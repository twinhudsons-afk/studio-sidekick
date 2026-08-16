import { chromium } from "file:///C:/Users/Nick%20Hudson/AppData/Local/npm-cache/_npx/db89d7302a373f10/node_modules/playwright/index.mjs";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
const errs = [];
p.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
p.on("console", m => { if (m.type() === "error") errs.push("CONSOLE: " + m.text()); });
await p.goto("file:///C:/Users/Nick%20Hudson/Projects/studio-sidekick/Studio%20Sidekick.html");
await p.waitForTimeout(500);

/* ---- 1. STATIC GRAPH AUDIT: every option target must exist; every flow start
        must reach a done node; every node must render without throwing ---- */
const graph = await p.evaluate(() => {
  const { NODES, FLOWS } = window.SS;
  const problems = [];
  const nodeIds = Object.keys(NODES);
  // dangling targets
  nodeIds.forEach(id => {
    const n = NODES[id];
    (n.opts || []).forEach(o => {
      if (o.flow && !FLOWS[o.flow]) problems.push(id + " -> missing flow " + o.flow);
      if (!o.flow && !NODES[o.next]) problems.push(id + " -> missing node " + o.next);
    });
    (n.goFlows || []).forEach(f => { if (!FLOWS[f]) problems.push(id + " goFlows missing " + f); });
  });
  // every visual renders
  nodeIds.forEach(id => {
    const n = NODES[id];
    if (n.v) { try { const html = n.v(); if (!html || html.length < 40) problems.push(id + " visual empty"); }
               catch (e) { problems.push(id + " visual THROWS: " + e.message); } }
  });
  // reachability: from each flow start, can we reach a done node?
  const flowReach = {};
  Object.keys(FLOWS).forEach(f => {
    const seen = new Set(); const stack = [FLOWS[f].start]; let doneReachable = false;
    while (stack.length) {
      const id = stack.pop();
      if (seen.has(id)) continue; seen.add(id);
      const n = NODES[id]; if (!n) { problems.push("flow " + f + " reaches missing node " + id); continue; }
      if (n.done) doneReachable = true;
      (n.opts || []).forEach(o => { if (!o.flow && o.next) stack.push(o.next); });
    }
    flowReach[f] = { nodes: seen.size, doneReachable };
    if (!doneReachable) problems.push("flow " + f + " cannot reach a done node");
  });
  // orphans: nodes unreachable from any flow start (info only)
  const reachable = new Set();
  Object.keys(FLOWS).forEach(f => {
    const stack = [FLOWS[f].start];
    while (stack.length) {
      const id = stack.pop();
      if (reachable.has(id)) continue; reachable.add(id);
      const n = NODES[id]; if (!n) continue;
      (n.opts || []).forEach(o => { if (o.flow) stack.push(FLOWS[o.flow] && FLOWS[o.flow].start); else if (o.next) stack.push(o.next); });
      (n.goFlows || []).forEach(f2 => { if (FLOWS[f2]) stack.push(FLOWS[f2].start); });
    }
  });
  const orphans = nodeIds.filter(id => !reachable.has(id));
  return { totalNodes: nodeIds.length, problems, flowReach, orphans };
});

/* ---- 2. LIVE CLICK-THROUGH of the three levels via the chooser ---- */
async function clickThrough(level, wrongFirst) {
  await p.click('[data-flow="song"]');
  await p.waitForTimeout(150);
  await p.click(`.wiz-opts .wiz-opt:nth-child(${level})`);
  await p.waitForTimeout(150);
  let steps = 0, sawDone = false, quizWrongTested = false;
  for (let i = 0; i < 40; i++) {
    const state = await p.evaluate(() => ({
      done: !!document.querySelector(".wiz-done"),
      opts: [...document.querySelectorAll(".wiz-opt")].map(o => o.textContent.trim().slice(0, 30)),
      hasVisual: !!document.querySelector(".wiz-visual")
    }));
    if (state.done) { sawDone = true; break; }
    // on first quiz question, deliberately answer WRONG once, verify explanation + return
    const isQuiz = state.opts.length === 3 && !state.opts[0].includes("next") && await p.evaluate(() => (document.querySelector(".wiz-stepnum")||{}).textContent?.includes("check"));
    if (isQuiz && wrongFirst && !quizWrongTested) {
      await p.click(".wiz-opts .wiz-opt:nth-child(2)"); // wrong answer
      await p.waitForTimeout(120);
      const expl = await p.textContent(".wiz-q");
      await p.click(".wiz-opts .wiz-opt"); // "Back to the question"
      await p.waitForTimeout(120);
      quizWrongTested = expl.length > 3;
    }
    // pick the correct/primary/first option (quiz correct answers vary position — find by known-good next)
    const clicked = await p.evaluate(() => {
      const opts = [...document.querySelectorAll(".wiz-opt")];
      // prefer primary/good; for quizzes find the option whose data-next ends in 'y'
      let target = opts.find(o => (o.getAttribute("data-next") || "").match(/y$/)) ||
                   opts.find(o => o.classList.contains("primary")) ||
                   opts.find(o => o.classList.contains("good")) || opts[0];
      if (target) { target.click(); return true; }
      return false;
    });
    if (!clicked) break;
    steps++;
    await p.waitForTimeout(120);
  }
  await p.click("#wizClose");
  await p.waitForTimeout(100);
  return { steps, sawDone, quizWrongTested };
}
const beginner = await clickThrough(1, true);
const intermediate = await clickThrough(2, true);
const advanced = await clickThrough(3, true);

/* ---- 3. search intent for the new material ---- */
await p.fill("#q", "how do I speed up my song");
await p.waitForTimeout(350);
const speedSearch = await p.evaluate(() => ({
  hits: document.querySelectorAll("section .card:not(.hidden)").length,
  sugg: [...document.querySelectorAll("#searchflows .suggest")].map(x => x.textContent.trim())
}));
await p.keyboard.press("Escape");

const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
await p.setViewportSize({ width: 390, height: 800 });
await p.waitForTimeout(250);
const mOverflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

console.log(JSON.stringify({ graph, beginner, intermediate, advanced, speedSearch, overflow, mOverflow, errs }, null, 1));
await b.close();
