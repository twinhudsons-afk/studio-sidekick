/* ============================================================
   STUDIO SIDEKICK — patterns, wizard engine, page behaviour
   ============================================================ */
(function () {
  "use strict";

  var SVGX = window.SVGX;

  /* ============================================================
     DRUM PATTERN LIBRARY (reference section + wizard visuals)
     ============================================================ */

  var BEATS = [1, 5, 9, 13];

  var PATTERNS = {
    basicpop: {
      name: "Basic pop / rock", bpm: "96–120",
      use: "Start here. Underneath a huge share of pop music.",
      rows: [
        { label: "Kick", steps: [1, 9] },
        { label: "Snare", steps: [5, 13] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ]
    },
    ballad: {
      name: "Ballad (half-time)", bpm: "65–80",
      use: "Slow, spacious, emotional. Half the hits, twice the weight.",
      rows: [
        { label: "Kick", steps: [1] },
        { label: "Snare", steps: [9] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ]
    },
    fourfloor: {
      name: "Four on the floor", bpm: "118–126",
      use: "Dance, disco, upbeat pop. Kick on every beat, hats in between.",
      rows: [
        { label: "Kick", steps: [1, 5, 9, 13] },
        { label: "Snare / clap", steps: [5, 13] },
        { label: "Open hat", steps: [3, 7, 11, 15] }
      ]
    },
    push: {
      name: "Pop with a push", bpm: "100–120",
      use: "The basic pattern plus one early kick that pulls the bar forward.",
      rows: [
        { label: "Kick", steps: [1, 8, 9] },
        { label: "Snare", steps: [5, 13] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ]
    },
    boombap: {
      name: "Hip hop boom bap", bpm: "85–95",
      use: "The classic head-nod feel. Add 15–20% swing.",
      rows: [
        { label: "Kick", steps: [1, 8, 11] },
        { label: "Snare", steps: [5, 13] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ],
      note: "The kick off the main beats is the whole flavour. Turn the swing knob up until it nods."
    },
    laidback: {
      name: "Laid-back hip hop", bpm: "80–95",
      use: "Sparse and behind the beat. Good under a spoken or breathy verse.",
      rows: [
        { label: "Kick", steps: [1, 7, 11] },
        { label: "Snare", steps: [5, 13] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ]
    },
    rnb: {
      name: "R&B with ghost notes", bpm: "70–95",
      use: "Smooth and expensive-sounding. The faded squares are ghost snares — very quiet hits.",
      rows: [
        { label: "Kick", steps: [1, 8, 11] },
        { label: "Snare", steps: [5, 13], ghost: [7, 12] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ],
      note: "Set the ghost hits to about a third of normal velocity in the graph editor. Barely heard, strongly felt."
    },
    trap: {
      name: "Trap (half-time)", bpm: "130–150",
      use: "Feels slow and heavy even though the tempo is high — the snare only lands on beat 3.",
      rows: [
        { label: "Kick / 808", steps: [1, 7, 10] },
        { label: "Snare / clap", steps: [9] },
        { label: "Hi-hat", steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
      ],
      note: "Pair each kick with an 808 note on the same step. For the signature rolls, see the hi-hat rolls card below."
    },
    drill: {
      name: "Drill (pushed snare)", bpm: "138–146",
      use: "Like trap but off-balance on purpose — the snare lands early, before beat 3.",
      rows: [
        { label: "Kick / 808", steps: [1, 4, 11] },
        { label: "Snare / clap", steps: [8, 16] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ],
      note: "Real drill hats often slide in triplets, which a straight 16-grid can't show — this is the honest 16-step version. It still reads as drill."
    },
    dembow: {
      name: "Reggaeton / dembow", bpm: "88–96",
      use: "The boom-ch-boom-chick under most latin-pop and plenty of chart pop.",
      rows: [
        { label: "Kick", steps: [1, 5, 9, 13] },
        { label: "Snare / rim", steps: [4, 7, 12, 15] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ]
    },
    driving8: {
      name: "Driving eighths", bpm: "120–140",
      use: "Urgent. Kick on every other step keeps a chorus moving.",
      rows: [
        { label: "Kick", steps: [1, 4, 7, 9, 12, 15] },
        { label: "Snare", steps: [5, 13] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ]
    },
    anthem: {
      name: "Half-time anthem", bpm: "70–85",
      use: "Big slow chorus feel — arena ballads and power choruses.",
      rows: [
        { label: "Kick", steps: [1, 8, 11] },
        { label: "Snare", steps: [9] },
        { label: "Hi-hat", steps: [1, 5, 9, 13] }
      ],
      note: "Crash cymbal on step 1 of the first bar of the chorus, and it turns into a moment."
    },
    rnb_slowjam: {
      name: "Slow jam (half-time)", bpm: "58–70",
      use: "The classic baby-making tempo. Half-time backbeat — one snare per bar carries everything.",
      rows: [
        { label: "Kick", steps: [1, 8] },
        { label: "Snare", steps: [9], ghost: [15] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ],
      note: "Hats soft, swing at ~20%. The ghost snare on 15 pulls the bar round to the next one. Space IS the style — resist filling it."
    },
    rnb_68: {
      name: "12/8 sway (slow dance)", bpm: "60–75",
      use: "The swaying, waltz-in-slow-motion feel of old-school soul ballads.",
      rows: [
        { label: "Kick", steps: [1, 10] },
        { label: "Snare", steps: [9] },
        { label: "Hi-hat", steps: [1, 4, 7, 10, 13, 16] }
      ],
      note: "The hats every THREE cells (1-4-7…) make the sway — that spacing turns straight time into a 12/8 rock-a-bye feel. Count “ONE-and-a, TWO-and-a” along with it."
    },
    rnb_neosoul: {
      name: "Neo-soul (drunk feel)", bpm: "68–82",
      use: "Loose, behind-the-beat, human. The D’Angelo / Erykah pocket.",
      rows: [
        { label: "Kick", steps: [1, 8, 12] },
        { label: "Snare", steps: [5, 13], ghost: [4, 11] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ],
      note: "Swing up HIGH — 25–35%, more than feels safe. Ghost hits just before the snares at ~25% velocity. It should feel like it’s almost falling over but never does."
    },
    rnb_trapsoul: {
      name: "Trap-soul (slow burn)", bpm: "65–75",
      use: "The late-night Weeknd / Brent Faiyaz bed — trap furniture at ballad speed.",
      rows: [
        { label: "Kick / 808", steps: [1, 8, 13] },
        { label: "Snare / clap", steps: [9] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
      ],
      note: "Every kick gets an 808 note on the chord root. ONE sparse hat roll per 8 bars, not per bar — at this tempo restraint reads as expensive."
    },
    rnb_quietstorm: {
      name: "Quiet storm (rim & shaker)", bpm: "60–72",
      use: "Candle-lit. The rim click instead of a snare is the whole mood.",
      rows: [
        { label: "Kick", steps: [1, 11] },
        { label: "Rim click", steps: [5, 13] },
        { label: "Shaker", steps: [1, 3, 5, 7, 9, 11, 13, 15], ghost: [2, 6, 10, 14] }
      ],
      note: "Swap any snare for a rim click and a song instantly moves closer to midnight. The ghost shaker cells are quiet in-between hits — a gentle 16th shimmer. Open hat once at the start of every second bar if it needs breath."
    },
    /* wizard-only patterns (not in the main library list) */
    gtr_chop: {
      name: "Guitar: off-beat chops", bpm: "any",
      use: "Short, muted chord stabs between the beats — the pop/funk/reggae guitar feel.",
      rows: [{ label: "Chop chord", steps: [3, 7, 11, 15] }],
      note: "Play the chord short and release immediately — the gap is the groove. Sits beautifully around a vocal."
    },
    gtr_drive: {
      name: "Guitar: driving eighths", bpm: "any",
      use: "Steady pushed chords — the rock/indie engine room.",
      rows: [{ label: "Chord hit", steps: [1, 3, 5, 7, 9, 11, 13, 15] }],
      note: "Accent steps 1, 5, 9, 13 (the main beats) slightly louder and it stops sounding mechanical."
    },
    gtr_arp: {
      name: "Guitar: picked arpeggio", bpm: "any",
      use: "One note of the chord at a time — delicate, great under verses.",
      rows: [
        { label: "High note", steps: [5, 13] },
        { label: "Middle note", steps: [3, 7, 11, 15] },
        { label: "Low note", steps: [1, 9] }
      ],
      note: "Low → middle → high → middle, repeating. Change the notes with each chord."
    },
    fill_bar: {
      name: "The fill bar", bpm: "any",
      use: "The last bar before a section change — announces that something's coming.",
      rows: [
        { label: "Kick", steps: [1, 9] },
        { label: "Snare", steps: [5, 13, 14, 15, 16] },
        { label: "Hi-hat", steps: [1, 3, 5, 7, 9, 11] }
      ],
      note: "Snare runs 13–14–15–16, hats step out of the way, then a crash on step 1 of the next bar. That's the whole trick."
    }
  };

  var PATTERN_ORDER = ["basicpop", "ballad", "fourfloor", "push", "boombap", "laidback", "rnb", "rnb_slowjam", "rnb_68", "rnb_neosoul", "rnb_trapsoul", "rnb_quietstorm", "trap", "drill", "dembow", "driving8", "anthem"];

  function patternGridHTML(id, compact) {
    var p = PATTERNS[id];
    if (!p) return "";
    var h = '<div class="pattern">';
    h += '<div class="pattern-head"><span class="pattern-name">' + p.name + '</span><span class="pattern-bpm">' + p.bpm + ' BPM</span>';
    if (!compact) h += '<span class="pattern-use">' + p.use + '</span>';
    h += '</div>';
    h += '<div class="grid-scroll"><div class="grid">';
    p.rows.forEach(function (row) {
      h += '<div class="grid-row"><span class="grid-label">' + row.label + '</span>';
      for (var i = 1; i <= 16; i++) {
        var cls = "cell";
        if (BEATS.indexOf(i) > -1) cls += " beat";
        if (row.steps.indexOf(i) > -1) cls += " on";
        else if (row.ghost && row.ghost.indexOf(i) > -1) cls += " ghost";
        h += '<span class="' + cls + '"></span>';
      }
      h += '</div>';
    });
    h += '<div class="grid-nums"><span class="grid-label">step</span>';
    for (var n = 1; n <= 16; n++) {
      h += '<span class="numcell' + (BEATS.indexOf(n) > -1 ? " beat" : "") + '">' + n + '</span>';
    }
    h += '</div></div></div>';
    if (p.note && !compact) h += '<p class="pattern-note">' + p.note + '</p>';
    h += '</div>';
    return h;
  }

  function buildPatternLibrary() {
    var host = document.getElementById("patterns");
    if (!host) return;
    var html = "";
    PATTERN_ORDER.forEach(function (id) { html += patternGridHTML(id, false); });
    host.innerHTML = html;
  }

  /* ============================================================
     WIZARD — flows and engine
     ============================================================ */

  var NODES = {};
  function N(id, def) { NODES[id] = def; }

  /* "Do this" box — the exact keys and clicks for a step */
  function act(items) {
    return '<div class="do"><b>Do this</b><ol>' + items.map(function (li) { return "<li>" + li + "</li>"; }).join("") + "</ol></div>";
  }

  var $ = function (id) { return document.getElementById(id); };
  var webQ = function (term) {
    return "https://www.google.com/search?q=" + encodeURIComponent(term + " FL Studio Mac Focusrite Scarlett Solo");
  };

  /* ---------- shared done/fallback nodes ---------- */

  N("doneFixed", {
    done: true, q: "Sorted.",
    d: "<p>Go and make something while the luck holds. If it comes back, run this fixer again — the answer's usually one step further down the list.</p>"
  });
  function fallbackNode(id, term) {
    N(id, {
      done: true, q: "This one needs the wider internet.",
      d: "<p>You've cleared every usual cause on this rig, which means it's something rarer. This button searches the web with your exact setup already in the question:</p>" +
         '<p><a class="btn primary" target="_blank" rel="noopener" href="' + webQ(term) + '">Search: ' + term + '</a></p>' +
         '<p>Also worth a look: <a target="_blank" rel="noopener" href="https://support.image-line.com/">FL Studio support</a> · <a target="_blank" rel="noopener" href="https://support.focusrite.com/">Focusrite support</a></p>'
    });
  }

  /* ============================================================
     FLOW: first-time setup
     ============================================================ */

  N("su1", {
    step: "Step 1 of 10", q: "Plug the Scarlett into the Mac",
    v: function () { return SVGX.backPanel(); },
    d: "<p>One USB-C cable from the back of the Scarlett straight into the Mac — it powers the box and carries the sound both ways. The Scarlett logo on top lights up. <strong>No drivers, no install</strong> — the Mac already knows what it is.</p><p>If it's already connected (it usually is), that counts.</p>",
    opts: [{ t: "Done — next", cls: "primary", next: "su2" }]
  });
  N("su2", {
    step: "Step 2 of 10", q: "Headphones into the Scarlett, not the Mac",
    v: function () { return SVGX.front("phones", "Headphones plug in here"); },
    d: "<p>The socket on the front right of the Scarlett. Turn the big <strong>MONITOR</strong> knob down low to start — you'll bring it up once sound is flowing.</p>",
    opts: [{ t: "Done — next", cls: "primary", next: "su3" }]
  });
  N("su3", {
    step: "Step 3 of 10", q: "Microphone into input 1, then press 48V",
    v: function () { return SVGX.front("v48", "48V on — the button lights red", { v48: true }); },
    d: "<p>The XLR cable clicks into the big socket on the left. Then press <strong>48V</strong> so it lights up — your RØDE is a condenser mic and it's almost completely silent without that power.</p>",
    opts: [{ t: "Done — next", cls: "primary", next: "su4" }]
  });
  N("su4", {
    step: "Step 4 of 10", q: "Piano into input 2 — and leave INST off",
    v: function () { return SVGX.front("jack2", "Piano's line-out plugs in here"); },
    d: "<p>A jack cable from the piano's <strong>line out</strong> into input 2. Make sure the <strong>INST</strong> button is <em>not</em> lit — that's a boost for electric guitars, and it makes a piano sound thin and distorted.</p><p>One cable means the piano records in mono. That's normal on a Solo and completely fine.</p>",
    opts: [{ t: "Done — next", cls: "primary", next: "su5" }]
  });
  N("su5", {
    step: "Step 5 of 10", q: "MIDI keyboard: its own USB cable, straight to the Mac",
    v: function () { return SVGX.connectionMap("kbd"); },
    d: "<p>The keyboard does <strong>not</strong> go through the Scarlett — it sends note instructions, not sound, so it has its own USB cable to the Mac.</p><p><strong>Plug it in before opening FL Studio</strong> — FL only looks for keyboards when it starts.</p>",
    opts: [{ t: "Done — next", cls: "primary", next: "su6" }]
  });
  N("su6", {
    step: "Step 6 of 10", q: "Point the Mac's sound at the Scarlett",
    v: function () { return SVGX.macSound(); },
    d: "<p>Apple menu → <strong>System Settings → Sound → Output</strong> → choose <strong>Scarlett Solo USB</strong>. From now on everything — FL Studio, YouTube, Spotify — comes through your headphones on the Scarlett.</p>",
    opts: [{ t: "Done — next", cls: "primary", next: "su7" }]
  });
  N("su7", {
    step: "Step 7 of 10", q: "Give FL Studio permission to hear the mic",
    v: function () { return SVGX.macMic(); },
    d: "<p><strong>System Settings → Privacy &amp; Security → Microphone</strong> → switch <strong>FL Studio</strong> on. macOS blocks every app from hearing any input until you do this, and FL won't warn you — it just records silence.</p><p><strong>Then quit FL Studio completely and reopen it.</strong> The permission doesn't take effect until you do.</p>",
    opts: [
      { t: "Done — next", cls: "primary", next: "su8" },
      { t: "FL Studio isn't in the list", s: "There's a known fix", next: "su7b" }
    ]
  });
  N("su7b", {
    q: "The Rosetta trick",
    d: "<p>On Apple Silicon Macs, FL Studio sometimes never asks for mic permission, so it never appears in the list. The fix:</p><ul><li>Open the <strong>Applications</strong> folder, right-click <strong>FL Studio</strong>, choose <strong>Get Info</strong></li><li>Tick <strong>Open using Rosetta</strong>, then launch FL Studio — macOS now asks for microphone permission. Say yes.</li><li>You can untick Rosetta afterwards — but note the permission is remembered per mode, so if it's ever silent again, check the permission list first.</li></ul>",
    opts: [{ t: "Done — carry on", cls: "primary", next: "su8" }]
  });
  N("su8", {
    step: "Step 8 of 10", q: "Tell FL Studio to use the Scarlett",
    v: function () { return SVGX.flAudio("device"); },
    d: "<p>In FL Studio: <strong>Options → Audio Settings</strong>. Set <strong>Device</strong> to <strong>Scarlett Solo USB</strong>, and set <strong>Buffer length</strong> to <strong>256 samples</strong> — low enough to feel instant when you play and sing.</p>",
    opts: [{ t: "Done — next", cls: "primary", next: "su9" }]
  });
  N("su9", {
    step: "Step 9 of 10", q: "Switch the keyboard on inside FL",
    v: function () { return SVGX.flMidi("enable"); },
    d: "<p><strong>Options → MIDI Settings</strong>. Find your keyboard in the <strong>Input</strong> list, <strong>click it</strong>, then click <strong>Enable</strong> so its status lights up. It sits there listed but doing nothing until you do — this is the single most common \"my keyboard is broken\" cause.</p><p>If the <strong>Port</strong> column shows a dash, click it and set it to <strong>0</strong>.</p>",
    opts: [
      { t: "Done — last step", cls: "primary", next: "su10" },
      { t: "My keyboard isn't in the list", s: "Jump to the keyboard fixer", next: "k2" }
    ]
  });
  N("su10", {
    step: "Step 10 of 10", q: "The moment of truth",
    v: function () { return SVGX.rackSelect(); },
    d: "<p>Open the Channel Rack (<strong>F6</strong>), click any instrument so its little light is on, and play a few keys.</p>",
    opts: [
      { t: "I hear it! 🎉", cls: "good", next: "suDone" },
      { t: "Someone else wants to listen too", s: "Two headphones at once — a 3-minute Mac trick", next: "suShare" },
      { t: "No sound", s: "Straight into the sound fixer", next: "ns1" },
      { t: "Keys do nothing", s: "Straight into the keyboard fixer", next: "k1" }
    ]
  });
  N("suShare", {
    q: "Listening together: the Multi-Output Device",
    v: function () { return SVGX.macAudioMidi(); },
    d: "<p>The Scarlett has one headphone socket — so the Mac itself will send the same music to two places at once. You build a small virtual device, once, and it's there forever:</p>" +
      act([
        "Open <strong>Audio MIDI Setup</strong> — <kbd>Cmd+Space</kbd>, type <em>audio midi</em>, Enter (it lives in Applications → Utilities)",
        "Click the <strong>+</strong> at the bottom-left of the device list → <strong>Create Multi-Output Device</strong>",
        "Tick <strong>Use</strong> on both <strong>Scarlett Solo USB</strong> and <strong>External Headphones</strong> (or MacBook Speakers)",
        "Tick <strong>Drift Correction</strong> on everything EXCEPT the Scarlett, and check both devices show the <strong>same sample rate</strong>",
        "<span class='path'>System Settings → Sound → Output → Multi-Output Device</span>, and the same pick in FL's <span class='path'>Options → Audio Settings</span>"
      ]) +
      "<p>Two normal surprises: the Mac's <strong>volume keys stop working</strong> on a multi-output (each device keeps its own volume — your MONITOR knob still works), and when you go back to <strong>recording vocals, switch FL back to plain Scarlett Solo USB</strong>. The full written version, plus the two-USB-inputs cousin (Aggregate Device), is in <a href='#setup' style='color:var(--accent-deep)'>First-time setup</a>.</p>",
    opts: [{ t: "We're both hearing it — finish", cls: "good", next: "suDone" }]
  });
  N("suDone", {
    done: true, q: "That's the whole rig working.",
    d: "<p>Everything from here is music, not setup. Two good next moves:</p><p>• <strong>Make me a beat</strong> — build your first drum pattern in about five minutes<br>• <strong>Start a song</strong> — find your key and tempo from your voice, then build outwards</p><p>One habit to install before you make anything: <kbd>Cmd+S</kbd> saves the project. Press it after every part you like — a crash that eats an hour of work is the #1 reason beginners quit, and it's entirely preventable.</p>",
    goFlows: ["beat", "song"]
  });

  /* ============================================================
     FLOW: no sound
     ============================================================ */

  N("ns0", {
    q: "When you press play, what happens?",
    d: "<p>Look at the top of FL Studio while you press <strong>Space</strong>.</p>",
    opts: [
      { t: "The play position moves, but I hear nothing", next: "ns1" },
      { t: "Nothing moves at all", next: "nsPlay" },
      { t: "Playback is fine — it's my keyboard that's silent", next: "k1" },
      { t: "Playback is fine — it's the mic that records nothing", next: "ms1" }
    ]
  });
  N("nsPlay", {
    q: "FL isn't playing because there's nothing to play",
    v: function () { return SVGX.rackSteps(); },
    d: "<p>Two usual causes:</p><ul><li>The current <strong>pattern is empty</strong> — click a few squares in the Channel Rack so there's something to hear, then press Space.</li><li>You're in <strong>SONG mode</strong> with an empty Playlist — press <strong>L</strong> to flip to PAT mode, which plays the pattern you're editing.</li></ul>",
    opts: [
      { t: "That was it — it plays now", cls: "good", next: "doneFixed" },
      { t: "It plays, but silently", next: "ns1" }
    ]
  });
  N("ns1", {
    q: "Are the headphones in the Scarlett?",
    v: function () { return SVGX.front("phones", "They belong here, front right"); },
    d: "<p>Not the Mac's headphone socket — the Scarlett's. The Mac is sending all its sound to the Scarlett, so headphones in the Mac hear nothing.</p>",
    opts: [
      { t: "They were in the Mac — moved, fixed!", cls: "good", next: "doneFixed" },
      { t: "Already in the Scarlett", next: "ns2" }
    ]
  });
  N("ns2", {
    q: "Is the MONITOR knob up?",
    v: function () { return SVGX.front("monitor", "This is the volume of everything"); },
    d: "<p>The big silver knob is the master listening level. All the way down = perfect silence, whatever FL is doing.</p>",
    opts: [
      { t: "It was down — fixed!", cls: "good", next: "doneFixed" },
      { t: "It's up", next: "ns3" }
    ]
  });
  N("ns3", {
    q: "Is the Mac's output set to the Scarlett?",
    v: function () { return SVGX.macSound(); },
    d: "<p><strong>System Settings → Sound → Output</strong>. If it says MacBook Speakers, the sound is going to the laptop, quietly, while you listen to silent headphones.</p>",
    opts: [
      { t: "It was on speakers — fixed!", cls: "good", next: "doneFixed" },
      { t: "Already the Scarlett", next: "ns4" }
    ]
  });
  N("ns4", {
    q: "Is FL Studio pointed at the Scarlett?",
    v: function () { return SVGX.flAudio("device"); },
    d: "<p><strong>Options → Audio Settings → Device</strong>. If FL is aimed at the built-in output or another device, this is the one.</p>",
    opts: [
      { t: "It was wrong — fixed!", cls: "good", next: "doneFixed" },
      { t: "Already Scarlett Solo USB", next: "ns5" }
    ]
  });
  N("ns5", {
    q: "Anything muted or soloed?",
    v: function () { return SVGX.flMixer(); },
    d: "<p>Check three things:</p><ul><li>The <strong>master volume</strong> at the top right of FL's toolbar</li><li>The <strong>Master fader</strong> in the Mixer (F9)</li><li>A <strong>soloed</strong> channel — solo silences everything else, and it's easy to leave on by accident. Right-click any lit solo light to clear it.</li></ul>",
    opts: [
      { t: "Found one — fixed!", cls: "good", next: "doneFixed" },
      { t: "All clear", next: "ns6" }
    ]
  });
  N("ns6", {
    q: "Restart FL Studio",
    d: "<p>If the Scarlett was plugged in <em>after</em> FL opened, FL may never have found it. Quit FL Studio completely and reopen it, then check <strong>Options → Audio Settings</strong> shows Scarlett Solo USB again.</p>",
    opts: [
      { t: "That did it!", cls: "good", next: "doneFixed" },
      { t: "Still silent", next: "nsFall" }
    ]
  });
  fallbackNode("nsFall", "no sound output");

  /* ============================================================
     FLOW: keyboard
     ============================================================ */

  N("k1", {
    q: "Is the keyboard enabled in FL?",
    v: function () { return SVGX.flMidi("enable"); },
    d: "<p><strong>Options → MIDI Settings</strong>. Your keyboard should be in the <strong>Input</strong> list. Click it, then click <strong>Enable</strong> so the status column lights up. A listed-but-not-enabled keyboard looks exactly like a broken one — this is the cause most of the time.</p>",
    opts: [
      { t: "It wasn't enabled — fixed!", cls: "good", next: "doneFixed" },
      { t: "It's enabled and still silent", next: "k3" },
      { t: "It's not in the list at all", next: "k2" }
    ]
  });
  N("k2", {
    q: "Was it plugged in after FL opened?",
    d: "<p>FL Studio only looks for keyboards when it starts up. Leave the keyboard plugged in, <strong>quit FL Studio completely, and reopen it</strong>. Then check <strong>Options → MIDI Settings</strong> again.</p>",
    opts: [
      { t: "It appeared — enabled it, works!", cls: "good", next: "doneFixed" },
      { t: "Still not in the list", next: "k6" }
    ]
  });
  N("k3", {
    q: "Check the Port and the controller type",
    v: function () { return SVGX.flMidi("port"); },
    d: "<p>Two settings on the same row:</p><ul><li>If the <strong>Port</strong> column shows a dash <code>—</code>, click it and set it to <strong>0</strong></li><li>Set <strong>Controller type</strong> to <strong>Generic Controller</strong></li></ul>",
    opts: [
      { t: "That fixed it!", cls: "good", next: "doneFixed" },
      { t: "Still nothing", next: "k4" }
    ]
  });
  N("k4", {
    q: "Is a channel selected?",
    v: function () { return SVGX.rackSelect(); },
    d: "<p>The keyboard plays <strong>whichever channel has its little green light on</strong> in the Channel Rack (F6). If nothing is selected, the notes arrive and go nowhere. Click an instrument — FLEX, say — and play.</p>",
    opts: [
      { t: "That was it!", cls: "good", next: "doneFixed" },
      { t: "A channel is selected, still silent", next: "k5" }
    ]
  });
  N("k5", {
    q: "Watch the MIDI light while you play",
    v: function () { return SVGX.flToolbar("midi"); },
    d: "<p>Top of FL's toolbar, there's a tiny activity light that flickers every time a note arrives. Play some keys and watch it.</p>",
    opts: [
      { t: "It flickers", s: "FL hears the keyboard — the problem is the instrument", next: "k5b" },
      { t: "Nothing flickers", s: "The notes aren't reaching FL at all", next: "k6" }
    ]
  });
  N("k5b", {
    q: "FL hears you — the channel just isn't making sound",
    d: "<p>The keyboard is fine. Check on the selected channel:</p><ul><li>Open it (click its name) and pick an actual <strong>preset</strong> — an empty sampler channel has nothing to play</li><li>The channel's <strong>volume knob</strong> in the rack isn't turned down</li><li>It isn't <strong>muted</strong> (the little light to its left)</li><li>Playing in the middle of the keyboard — some presets only cover certain octaves</li></ul>",
    opts: [
      { t: "Working now!", cls: "good", next: "doneFixed" },
      { t: "Still stuck", next: "kFall" }
    ]
  });
  N("k6", {
    q: "Now let's test the cable and the Mac",
    v: function () { return SVGX.cableTypes(); },
    d: "<p>In order:</p><ul><li><strong>Try a different USB cable.</strong> Charge-only cables are everywhere and produce exactly this: lights on, no data. This is the answer surprisingly often.</li><li>Try the other USB-C port on the Mac.</li><li>Then check whether the <strong>Mac itself</strong> sees the keyboard: open <strong>Applications → Utilities → Audio MIDI Setup</strong>, then <strong>Window → Show MIDI Studio</strong>. Your keyboard should appear as a box.</li></ul>",
    opts: [
      { t: "New cable fixed it!", cls: "good", next: "doneFixed" },
      { t: "It shows in MIDI Studio but not FL", next: "k2" },
      { t: "Not even in MIDI Studio", next: "kFall" }
    ]
  });
  fallbackNode("kFall", "MIDI keyboard not detected");

  /* ============================================================
     FLOW: mic
     ============================================================ */

  N("m0", {
    q: "What's the mic doing?",
    opts: [
      { t: "Recording silence", next: "ms1" },
      { t: "Distorted / crunchy", next: "md1" },
      { t: "Too quiet or hissy", next: "mq1" },
      { t: "I hear myself twice / echoey", next: "e1" }
    ]
  });
  N("ms1", {
    q: "Does FL have microphone permission?",
    v: function () { return SVGX.macMic(); },
    d: "<p><strong>System Settings → Privacy &amp; Security → Microphone</strong> — FL Studio must be switched on. macOS blocks it silently otherwise, and the result looks exactly like broken hardware.</p><p><strong>After switching it on, quit and reopen FL Studio.</strong> The permission only takes effect on restart — skipping this is why people think it didn't work.</p>",
    opts: [
      { t: "That was it — fixed!", cls: "good", next: "doneFixed" },
      { t: "Permission already on", next: "ms2" },
      { t: "FL Studio isn't in the list", next: "ms1b" }
    ]
  });
  N("ms1b", {
    q: "The Rosetta trick",
    d: "<p>On Apple Silicon Macs FL sometimes never asks, so it never appears. Right-click FL Studio in Applications → <strong>Get Info</strong> → tick <strong>Open using Rosetta</strong> → launch. macOS asks for mic permission — say yes. You can untick Rosetta afterwards.</p>",
    opts: [
      { t: "Done — it records now!", cls: "good", next: "doneFixed" },
      { t: "Still silent", next: "ms2" }
    ]
  });
  N("ms2", {
    q: "Is 48V lit?",
    v: function () { return SVGX.front("v48", "Must be lit for your RØDE", { v48: true }); },
    d: "<p>Your RØDE is a condenser microphone — without 48V power coming up the cable it's almost totally silent. Press the button so it lights.</p>",
    opts: [
      { t: "It was off — fixed!", cls: "good", next: "doneFixed" },
      { t: "Already on", next: "ms3" }
    ]
  });
  N("ms3", {
    q: "Does the gain ring light up when you sing?",
    v: function () { return SVGX.gainHalo(); },
    d: "<p>Sing at full volume and slowly turn <strong>Gain 1</strong> up. The ring around the knob should glow <strong>green</strong>. If you can turn it all the way up and see nothing, the signal isn't arriving — check the XLR is clicked in firmly at both ends.</p>",
    opts: [
      { t: "Green now — fixed!", cls: "good", next: "doneFixed" },
      { t: "Ring lights, but FL still records silence", next: "ms4" },
      { t: "No light even at full gain", next: "msFall" }
    ]
  });
  N("ms4", {
    q: "Is the mixer track pointed at input 1 — and armed?",
    v: function () { return SVGX.flMixer("input"); },
    d: "<p>In the Mixer (F9), click the track you're recording to:</p><ul><li>Top of the strip: set <strong>input</strong> to <strong>Solo Input 1</strong></li><li>Bottom of the strip: the small <strong>record dot</strong> must be lit red — that's \"arming\", and an unarmed track records nothing</li></ul>",
    opts: [
      { t: "That was it — fixed!", cls: "good", next: "doneFixed" },
      { t: "Both set, still silence", next: "ms5" }
    ]
  });
  N("ms5", {
    q: "One last check: the FL edition",
    d: "<p><strong>Help → About</strong>. Your copy should say <strong>Producer Edition</strong> — recording is fully included there, so this won’t be your problem. But if it somehow says <strong>Fruity Edition</strong> (a different install or account), audio recording isn’t a setting that’s off — the feature isn’t in that edition at all.</p>",
    opts: [
      { t: "It's Fruity — mystery solved", next: "ms5b" },
      { t: "It's Producer or higher", next: "msFall" }
    ]
  });
  N("ms5b", {
    done: true, q: "That explains everything.",
    d: "<p>Nothing was broken — Fruity Edition simply can't record audio. The upgrade to Producer Edition unlocks it, and everything you've set up today carries straight over.</p>"
  });
  fallbackNode("msFall", "microphone records silence");

  N("md1", {
    q: "Distortion means too loud somewhere",
    v: function () { return SVGX.gainHalo(); },
    d: "<p>If the ring around the gain knob flashes <strong>red</strong> while you sing, the take is clipping — and clipping is permanent, no plugin removes it.</p><ul><li>Turn <strong>Gain 1</strong> down until your loudest singing stays green</li><li>Quieter is always recoverable afterwards; distorted never is</li></ul>",
    opts: [
      { t: "Clean now — fixed!", cls: "good", next: "doneFixed" },
      { t: "It's the piano that distorts", next: "md2" },
      { t: "Gain is low and it still distorts", next: "mdFall" }
    ]
  });
  N("md2", {
    q: "Is INST lit?",
    v: function () { return SVGX.front("inst", "Should be OFF for the piano"); },
    d: "<p><strong>INST</strong> is a boost for electric guitars plugged straight in. A piano's line-out is already loud, so with INST on it slams in distorted. Switch it off and re-set Gain 2 so hard playing stays green.</p>",
    opts: [
      { t: "That was it — fixed!", cls: "good", next: "doneFixed" },
      { t: "Still distorting", next: "mdFall" }
    ]
  });
  fallbackNode("mdFall", "recording distorted");

  N("mq1", {
    q: "Quiet or hissy comes from too little gain",
    v: function () { return SVGX.gainHalo(); },
    d: "<p>When the recording is too quiet, turning it up later also turns up the hiss — the fix is more gain at the Scarlett:</p><ul><li>Sing your <strong>loudest chorus line</strong> and raise Gain 1 until the ring glows steady green</li><li>Stay about a <strong>hand's width</strong> from the mic — distance is volume</li><li>Try the <strong>AIR</strong> button — it adds presence and sparkle that reads as \"clearer\"</li></ul>",
    opts: [
      { t: "Much better — fixed!", cls: "good", next: "doneFixed" },
      { t: "Still faint", next: "ms2" }
    ]
  });

  N("e1", {
    q: "You're hearing yourself down two paths at once",
    v: function () { return SVGX.echoPaths(); },
    d: "<p>The Scarlett's <strong>DIRECT MONITOR</strong> sends your voice to your headphones instantly. FL Studio can <em>also</em> send it round through the Mac, arriving a few milliseconds later. Both at once = doubled, hollow, echoey.</p><p><strong>The fix:</strong> keep DIRECT MONITOR <strong>on</strong> at the Scarlett, and in FL's mixer turn that track's <strong>input monitoring off</strong> (the speaker icon by the input selector — or right-click the input and untick monitoring).</p>",
    opts: [
      { t: "Clean single voice — fixed!", cls: "good", next: "doneFixed" },
      { t: "Still doubled", next: "eFall" }
    ]
  });
  fallbackNode("eFall", "hearing voice twice direct monitor echo");

  /* ============================================================
     FLOW: crackle / delay
     ============================================================ */

  N("g0", {
    q: "Which one is it?",
    opts: [
      { t: "Crackles, pops, stutters during playback", next: "gc1" },
      { t: "A delay between pressing a key and hearing it", next: "gd1" }
    ]
  });
  N("gc1", {
    q: "Give the Mac more time per chunk",
    v: function () { return SVGX.flAudio("buffer"); },
    d: "<p>Crackling means the Mac can't finish each chunk of audio in time. <strong>Options → Audio Settings → Buffer length</strong> — raise it to <strong>512</strong>, and if it still crackles, <strong>1024</strong>. This fixes it most of the time.</p><p>(Bigger buffer = slight delay when playing live. Turn it back down to 256 when recording, up again when mixing.)</p>",
    opts: [
      { t: "Smooth now — fixed!", cls: "good", next: "doneFixed" },
      { t: "Still crackling", next: "gc2" }
    ]
  });
  N("gc2", {
    q: "Lighten the load",
    d: "<ul><li><strong>Close other apps</strong> — a browser with many tabs is the usual thief</li><li><strong>Plug the Mac into power</strong> — on battery, macOS slows the processor and audio suffers first</li><li>If the Scarlett is on a <strong>hub</strong>, move it to a direct port</li></ul>",
    opts: [
      { t: "Fixed!", cls: "good", next: "doneFixed" },
      { t: "Still crackling", next: "gcFall" }
    ]
  });
  fallbackNode("gcFall", "audio crackling underruns");

  N("gd1", {
    q: "That delay is a setting, not a fault",
    v: function () { return SVGX.flAudio("buffer"); },
    d: "<p>It's called latency — the buffer is set too big. <strong>Options → Audio Settings → Buffer length → 256</strong>, or <strong>128</strong> if the Mac handles it without crackling. Under about 10&nbsp;ms feels instant.</p>",
    opts: [
      { t: "Feels instant now — fixed!", cls: "good", next: "doneFixed" },
      { t: "Better, but I still feel it when singing", next: "gd2" },
      { t: "Now it crackles instead", next: "gc2" }
    ]
  });
  N("gd2", {
    q: "For singing, skip the computer entirely",
    v: function () { return SVGX.front("direct", "Zero-delay path for your voice", { direct: true }); },
    d: "<p>Press <strong>DIRECT MONITOR</strong> on the Scarlett. Your voice now reaches your headphones without touching the Mac — zero delay, regardless of any buffer setting. Just make sure FL's input monitoring is off for that track, or you'll hear yourself twice.</p><p>Also: heavy effects (especially reverb on the master) add processing delay — switch them off while recording, back on after.</p>",
    opts: [
      { t: "Sorted!", cls: "good", next: "doneFixed" },
      { t: "Still laggy", next: "gdFall" }
    ]
  });
  fallbackNode("gdFall", "latency delay when playing");

  /* ============================================================
     FLOW: record a vocal (guided walk)
     ============================================================ */

  N("r1", {
    step: "Step 1 of 6", q: "Set the front panel for singing",
    v: function () { return SVGX.frontVocal(); },
    d: "<p>Three buttons: <strong>48V on</strong> (your RØDE needs it), <strong>AIR</strong> to taste (a vocal sparkle lift — toggle it while singing and keep what you prefer), <strong>DIRECT MONITOR on</strong> so you hear yourself with zero delay.</p>",
    opts: [{ t: "Set — next", cls: "primary", next: "r2" }]
  });
  N("r2", {
    step: "Step 2 of 6", q: "Set your level with the loudest line",
    v: function () { return SVGX.gainHalo(); },
    d: "<p>Sing the <strong>biggest line of the chorus</strong> — not a polite test note — and turn <strong>Gain 1</strong> up until the ring glows steady <strong>green</strong>. If it ever flashes red, back off a touch. Loud parts set the level; quiet parts always fit underneath.</p><p>Stay about a hand's width from the mic, singing slightly across it rather than dead-on — that kills most popping \"p\" sounds free of charge.</p>",
    opts: [{ t: "Green — next", cls: "primary", next: "r3" }]
  });
  N("r3", {
    step: "Step 3 of 6", q: "Point a mixer track at the mic and arm it",
    v: function () { return SVGX.flMixer("input"); },
    d: "<p>Open the Mixer (<strong>F9</strong>), click an empty track:</p><ul><li>Top: set <strong>input</strong> to <strong>Solo Input 1</strong></li><li>Bottom: light the <strong>record dot</strong> — that's arming</li><li>And turn that track's <strong>input monitoring off</strong> (you're using Direct Monitor instead — otherwise you'll hear yourself doubled)</li></ul>",
    opts: [{ t: "Armed — next", cls: "primary", next: "r4" }]
  });
  N("r4", {
    step: "Step 4 of 6", q: "Headphones on. Speakers stay silent.",
    d: "<p>Always record vocals on headphones. If speakers are playing, the mic records the backing track along with your voice, welded together forever — it can never be removed afterwards.</p>",
    opts: [{ t: "Headphones on — next", cls: "primary", next: "r5" }]
  });
  N("r5", {
    step: "Step 5 of 6", q: "Record",
    v: function () { return SVGX.flToolbar("rec"); },
    d: "<p>Press the record button in the toolbar, choose <strong>Audio into the playlist</strong>, press play, and sing. FL counts you in.</p>",
    opts: [{ t: "Take recorded — next", cls: "primary", next: "r6" }]
  });
  N("r6", {
    step: "Step 6 of 6", q: "Now do it three more times",
    d: "<p>Record three or four takes onto separate tracks and choose later — nobody's first take is their best. Keep the session moving; don't listen back between every take.</p><p>When comping later: verse from take 2, chorus from take 4 is completely normal. That's how records are made.</p>",
    opts: [{ t: "Done", cls: "good", next: "rDone" }]
  });
  N("rDone", {
    done: true, q: "Vocal down.",
    d: "<p>Small habits that raise every future take: record the loud chorus first, stand a fixed hand's width away, and sing near a curtain or wardrobe rather than the middle of a bare room.</p><p>Press <kbd>Cmd+S</kbd> right now — a take this good deserves saving. Then the two natural next moves are below: make the voice sound like a record, or build the song underneath it.</p>",
    goFlows: ["voicefx", "song"]
  });

  /* ============================================================
     FLOW: play piano sounds with MIDI
     ============================================================ */

  N("p_1", {
    step: "Piano · step 1 of 5", q: "Add an instrument to play",
    v: function () { return SVGX.rackSelect(); },
    d: "<p>Your keyboard makes no sound of its own — it plays whichever instrument is selected in the <strong>Channel Rack</strong>. So first, put an instrument there.</p>" +
      act([
        "Press <kbd>F6</kbd> — the Channel Rack opens",
        "Click the <strong>+</strong> at the bottom of the rack, and choose <strong>FLEX</strong> from the list",
        "A new channel appears. Click its name once so its <strong>select strip lights lime</strong> — that means your keyboard is now connected to it",
        "Press a few keys. You'll hear FLEX's default sound already"
      ]),
    opts: [{ t: "I hear something — next", cls: "primary", next: "p_2" }]
  });
  N("p_2", {
    step: "Piano · step 2 of 5", q: "Pick the sound you actually want",
    v: function () { return SVGX.flexWindow(); },
    d: "<p>FLEX is a library of hundreds of sounds — pianos, pads, strings, basses. The window below is what opens when you click the channel's name.</p>" +
      act([
        "<strong>Click the FLEX channel's name</strong> — the FLEX window opens",
        "Pick a category on the left (<strong>Keys</strong> for pianos)",
        "<strong>Double-click a preset</strong> on the right — it loads instantly. Play your keyboard to try it",
        "Arrow through a few. <strong>Grand Piano</strong> and <strong>Upright Felt</strong> are both lovely under a voice",
        "More free sounds: the download icon inside FLEX fetches whole extra packs"
      ]),
    opts: [{ t: "Sound chosen — next", cls: "primary", next: "p_3" }]
  });
  N("p_3", {
    step: "Piano · step 3 of 5", q: "Record what you play",
    v: function () { return SVGX.flToolbar("rec"); },
    d: "<p>Two ways to get notes into FL: <strong>play them</strong> (this step) or <strong>draw them with the mouse</strong> (next step). Playing first — it's your instrument, after all.</p>" +
      act([
        "Set the tempo <strong>before</strong> recording — the orange number at the top",
        "Click the <strong>metronome</strong> icon (next to the LCDs) so you have a click to play against",
        "Click the round <strong>record button</strong> (ringed below), choose <strong>Score</strong> if FL asks what to record",
        "Press <kbd>Space</kbd> — FL counts one bar in, then records. <strong>Play your part</strong>",
        "Press <kbd>Space</kbd> again to stop. Press <kbd>Space</kbd> once more to hear it back"
      ]) +
      "<p style='margin-top:12px'>Too fast to play cleanly? Halve the tempo, record slowly, put the tempo back — the notes speed up perfectly. Everyone does this.</p>",
    opts: [{ t: "Recorded — next", cls: "primary", next: "p_4" }]
  });
  N("p_4", {
    step: "Piano · step 4 of 5", q: "Or draw the notes — no playing required",
    v: function () { return SVGX.flPianoRoll("draw"); },
    d: "<p>The <strong>Piano roll</strong> shows notes as blocks on a grid — piano keys down the left, time running right. Anything you can play, you can also just draw. The picture below is one bar each of C, Am, F and G.</p>" +
      act([
        "Press <kbd>F7</kbd> — the Piano roll opens for the selected channel",
        "Make sure the <strong>pencil tool</strong> is chosen (top-left, ringed)",
        "<strong>Left-click</strong> an empty cell — a note appears. Line it up with the keys on the left for pitch",
        "<strong>Drag a note's right edge</strong> to stretch it — a chord is just 3 notes stacked, same start, same length",
        "<strong>Right-click</strong> a note to delete it; <strong>drag</strong> a note to move it",
        "Press <kbd>Space</kbd> any time to hear where you're up to"
      ]),
    opts: [{ t: "Notes drawn — next", cls: "primary", next: "p_5" }]
  });
  N("p_5", {
    step: "Piano · step 5 of 5", q: "Fix and humanise what you've got",
    v: function () { return SVGX.flPianoRoll("vel"); },
    d: "<p>This is why MIDI beats audio: nothing you played is final.</p>" +
      act([
        "<strong>Wrong note?</strong> Drag it up or down to the right pitch — no re-recording",
        "<strong>Timing scruffy?</strong> Press <kbd>Cmd</kbd>+<kbd>A</kbd> (select all) then <kbd>Cmd</kbd>+<kbd>Q</kbd> — quantise snaps every note to the grid",
        "<strong>Too perfect now?</strong> The lane at the bottom (ringed) is <strong>velocity</strong> — how hard each note plays. Drag a few bars down so the part breathes like a human played it",
        "<strong>Whole part in the wrong key?</strong> <kbd>Cmd</kbd>+<kbd>A</kbd>, then <kbd>Shift</kbd>+<kbd>↑</kbd>/<kbd>↓</kbd> moves everything a semitone at a time"
      ]),
    opts: [
      { t: "Done", cls: "good", next: "pDone" },
      { t: "Go further — design a sound from nothing", s: "The spaceship: your first synth patch, in 3x Osc", next: "pd1" }
    ]
  });
  N("pd1", {
    step: "Sound design · 1 of 3", q: "Three waves = the spaceship's engine",
    v: function () { return SVGX.osc3Window(); },
    d: "<p>Every synth sound ever is layered waves + an envelope + effects. Prove it with <strong>3x Osc</strong>, the simplest synth in FL (and included in every edition):</p>" +
      act([
        "Channel Rack <strong>+</strong> → <strong>3x Osc</strong> — play a low key around <strong>A2</strong>. Dull tone? Good — raw material",
        "<strong>OSC 1: sine</strong>, leave it — the body",
        "<strong>OSC 2: saw, CRS −12</strong> — an octave-down engine rumble",
        "<strong>OSC 3: saw, FINE +7</strong> — slightly out of tune on purpose; that beating shimmer is the magic"
      ]),
    opts: [{ t: "It hums — next", cls: "primary", next: "pd2" }]
  });
  N("pd2", {
    step: "Sound design · 2 of 3", q: "The envelope: make it swell",
    v: function () { return SVGX.envCurve(); },
    d: "<p>Right now it starts instantly, like a key press. Spaceships don't start — they <em>arrive</em>:</p>" +
      act([
        "Click the 3x Osc channel's <strong>name</strong> → Channel settings → <strong>INS</strong> tab",
        "Under <strong>Volume</strong>: drag <strong>ATT</strong> (attack) to about a third — the sound now swells in",
        "Drag <strong>REL</strong> (release) up too — letting go fades out instead of cutting dead",
        "Hold one low note and listen to it bloom"
      ]),
    opts: [{ t: "It swells — next", cls: "primary", next: "pd3" }]
  });
  N("pd3", {
    step: "Sound design · 3 of 3", q: "The hangar, and the fly-by",
    d: "<p>Two effects finish it:</p>" +
      act([
        "On its mixer track: <strong>Fruity Reeverb 2</strong>, a big hall preset, <strong>WET ~40%</strong> — far wetter than a vocal ever gets",
        "Add <strong>Fruity Filter</strong> after it → <span class='path'>right-click its Cutoff knob → Create automation clip</span>",
        "In the Playlist, draw the automation as a slow <strong>rise and fall</strong> over four bars",
        "Hold one low note for those four bars: the whoosh sweeping open and shut IS the spaceship passing overhead"
      ]) +
      "<p>And that's the whole grammar of synthesis: <strong>waves → envelope → filter → space</strong>. Fast attack + closed filter = bass pluck; slow attack + big hall = the cinematic pad under your next bridge. Same four dials forever.</p>",
    opts: [{ t: "I made a sound that didn't exist", cls: "good", next: "pdDone" }]
  });
  N("pdDone", {
    done: true, q: "Sound designer.",
    d: "<p>You didn't pick a preset — you built the instrument. The written version (plus the FLEX macro-knob shortcut to the same ideas) is in <a href='#keyboard' style='color:var(--accent-deep)'>Playing the keyboard</a> under Advanced.</p>",
    goFlows: ["piano", "song"]
  });
  N("pDone", {
    done: true, q: "That's the whole MIDI piano workflow.",
    d: "<p>Add instrument → pick sound → play or draw → fix afterwards. Every instrument in every song works exactly this way — bass, strings, pads are the same five steps with a different preset. Now put it to work:</p>",
    goFlows: ["song", "beat"]
  });

  /* ============================================================
     FLOW: build a song — three levels, each building on the last
     ============================================================ */

  N("so0", {
    q: "Build a song — pick your level",
    d: "<p>Three walkthroughs that stack: each one assumes you've done the one before. Finish a level and the next unlocks naturally.</p>",
    opts: [
      { t: "Beginner — your first full track", s: "Tempo & key → drum beat → piano → bass → arrange → rough vocal. About 30 minutes.", cls: "primary", flow: "songB" },
      { t: "Intermediate — layers and lift", s: "Guitar three ways, pads and colour, verse/chorus drum changes, fills, the pre-chorus build.", flow: "songI" },
      { t: "Advanced — make it move", s: "Energy mapping, double- and half-time, real tempo changes, transitions, automation, the bridge.", flow: "songA" }
    ]
  });

  /* ---------------- BEGINNER ---------------- */

  N("b_1", {
    step: "Beginner · step 1 of 8", q: "Tempo and key first — from your voice",
    v: function () { return SVGX.flToolbar("bpm"); },
    d: "<p>Before any instrument: sing the chorus and tap along on your leg — that tap speed is your BPM. Set it at the top of FL: roughly <strong>70</strong> ballad, <strong>90–110</strong> mid-tempo, <strong>115–128</strong> upbeat.</p><p>Then the key: find the chorus's <strong>highest note</strong> and make sure it's comfortable — not just reachable — even on a fourth take. Too much strain? Shift everything down a step. The chord table for your key is in <a href='#keys'>Keys &amp; chords</a>.</p>",
    opts: [{ t: "Tempo set, key chosen — next", cls: "primary", next: "b_2" }]
  });
  N("b_2", {
    step: "Beginner · step 2 of 8", q: "The drum beat",
    v: function () {
      var chans = PATTERNS.basicpop.rows.map(function (r) { return { name: r.label, led: false, steps: r.steps }; });
      chans.push({ name: "FLEX — Grand Piano", led: false, steps: [] });
      return '<div style="margin-bottom:14px">' + SVGX.flRack("steps", chans) + "</div>" + patternGridHTML("basicpop", false);
    },
    d: "<p>Open the Channel Rack (<strong>F6</strong>) and click in the basic pop pattern below — kick on 1 and 9, snare on 5 and 13, hats every other step. Press <strong>Space</strong> and it loops while you click.</p><p>This one bar is your engine. Every refinement comes later — get it looping and move on.</p>",
    opts: [
      { t: "It's looping — next", cls: "primary", next: "b_3" },
      { t: "I want a different feel", s: "Genre picker: pop, ballad, R&B, dance, trap", next: "b0" }
    ]
  });
  N("b_3", {
    step: "Beginner · step 3 of 8", q: "Piano chords over the beat",
    v: function () { return SVGX.flPianoRoll(null); },
    d: "<p>Four chords, one bar each, is a complete verse. The picture below is exactly what that looks like in FL's Piano roll — one bar each of C, Am, F, G. Stuck for chords? <strong>I–V–vi–IV</strong> in your key (<a href='#keys'>the table</a>) has powered a thousand hits.</p>" +
      act([
        "Press <kbd>F6</kbd>, click <strong>+</strong> at the bottom of the rack → <strong>FLEX</strong> → double-click a piano preset",
        "Click the channel name so its <strong>select strip lights lime</strong> — your keyboard now plays it",
        "Metronome on, click <strong>record</strong>, press <kbd>Space</kbd>, and play the chords while the beat loops",
        "Can't play them cleanly? Press <kbd>F7</kbd> and <strong>draw</strong> them instead — three stacked notes per bar, exactly as below",
        "Wrong notes are fine: drag them to the right place afterwards. Nothing about MIDI is permanent"
      ]),
    opts: [
      { t: "Chords in — next", cls: "primary", next: "b_4" },
      { t: "Show me the full piano walk first", s: "Adding instruments, picking sounds, drawing notes — in detail", flow: "piano" }
    ]
  });
  N("b_4", {
    step: "Beginner · step 4 of 8", q: "Bass: the lowest note of each chord",
    v: function () { return SVGX.interlock(); },
    d: "<p>New FLEX channel, pick a bass, play <strong>just the root of each chord</strong>, low. C chord → C bass. That's genuinely the whole job, and it's the single biggest step toward sounding like a record.</p><p>Land the bass notes with the kick drum and the low end locks together.</p>",
    opts: [{ t: "Bass in — next", cls: "primary", next: "b_5" }]
  });
  N("b_5", {
    step: "Beginner · step 5 of 8", q: "Arrange it in the Playlist",
    v: function () { return SVGX.flPlaylist() + '<div style="margin-top:14px">' + SVGX.songArc() + "</div>"; },
    d: "<p>The Playlist is the song's timeline — you paint copies of your patterns onto it, like the picture below.</p>" +
      act([
        "Press <kbd>F5</kbd> — the Playlist opens",
        "Pick a pattern in the <strong>pattern selector</strong> at the top of FL (where it says \"Pattern 1\")",
        "<strong>Left-click</strong> on a track to paint a copy of it; <strong>right-click</strong> to erase; each grid column is one bar",
        "Build: intro (4 bars, piano only) → verse (16, beat + piano + bass) → chorus (16, everything)",
        "Press <kbd>L</kbd> to flip from PAT to <strong>SONG</strong> mode — now <kbd>Space</kbd> plays the whole arrangement"
      ]) +
      "<p style='margin-top:12px'>Rule that matters already: the verse stays <em>thinner</em> than the chorus. That difference is the song's shape.</p>",
    opts: [{ t: "Arranged — next", cls: "primary", next: "b_6" }]
  });
  N("b_6", {
    step: "Beginner · step 6 of 8", q: "Sing over it — roughly, on purpose",
    d: "<p>Loop the arrangement and sing the song over it, phone-memo rough. You're checking three things: the <strong>key</strong> still suits your voice with instruments underneath, the <strong>tempo</strong> feels right at full length, and the sections are the right lengths for the words.</p><p>Fix any of those <em>now</em> — they're one-click changes while everything is MIDI. Then it's quiz time.</p>",
    opts: [{ t: "Checked — next", cls: "primary", next: "bMix" }]
  });
  N("bMix", {
    step: "Beginner · step 7 of 8", q: "Balance it: the voice sits ON TOP",
    v: function () { return SVGX.flMixer("vocal"); },
    d: "<p>The difference between \"a beginner track\" and \"sounds like a record\" is almost never the sounds — it's the balance. One pass, ears only:</p>" +
      act([
        "Loop the <strong>fullest chorus</strong> and press <kbd>F9</kbd> for the Mixer",
        "Push the <strong>vocal track's fader</strong> up until the voice clearly rides on top of everything",
        "If the beat fights it, pull the <strong>drum and instrument faders down</strong> — don't push the vocal into the red",
        "Watch the <strong>Master meter</strong>: if it touches red, drag ALL faders down together and balance again — red on the master distorts the export",
        "Sanity-check on two systems: your headphones AND your phone's speaker. If the voice survives the phone speaker, the balance is right"
      ]),
    opts: [{ t: "The voice is on top — next", cls: "primary", next: "bExp" }]
  });
  N("bExp", {
    step: "Beginner · step 8 of 8", q: "Save it — then turn it into a real song file",
    d: "<p>Two different things, both essential. <strong>Saving</strong> keeps the project so you can keep working on it. <strong>Exporting</strong> makes the actual song file you can play anywhere and send to anyone.</p>" +
      act([
        "<kbd>Cmd+S</kbd> — save the project (a <strong>.flp</strong> file). Name it properly: <em>SongName v1</em>. From today onward: Cmd+S after every part you like",
        "<span class='path'>File → Export → WAV file…</span> (or <kbd>Cmd+R</kbd>)",
        "Name it, click <strong>Start</strong>, leave the settings at their defaults",
        "Find the WAV in Finder and <strong>AirDrop it to your phone</strong>",
        "Now go listen to it where you normally listen to music. That's YOUR song in the queue"
      ]) +
      "<p>WAV is full quality; choose MP3 in the same export window when you want a smaller file to message to someone.</p>",
    opts: [{ t: "Exported — quick quiz", cls: "primary", next: "bq1" }]
  });
  N("bq1", {
    step: "Beginner · check 1 of 3", q: "What gets set before anything is recorded?",
    opts: [
      { t: "The tempo and the key", next: "bq1y" },
      { t: "The drum sounds", next: "bq1n" },
      { t: "The vocal effects", next: "bq1n" }
    ]
  });
  N("bq1y", { q: "Right.", d: "<p>Tempo and key come from your voice, and everything else is built to fit them. Changing them later is painless for MIDI, painful for recorded audio.</p>", opts: [{ t: "Next question", cls: "primary", next: "bq2" }] });
  N("bq1n", { q: "Not this one.", d: "<p>It's <strong>tempo and key</strong> — they come from your voice, and every instrument is built to fit them. Sounds and effects can change any time; a re-recorded vocal is real work.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "bq1" }] });
  N("bq2", {
    step: "Beginner · check 2 of 3", q: "The bass plays…",
    opts: [
      { t: "The lowest note of each chord", next: "bq2y" },
      { t: "The melody, one octave down", next: "bq2n" },
      { t: "Whatever sounds busy", next: "bq2n" }
    ]
  });
  N("bq2y", { q: "Right.", d: "<p>Root of each chord, landing with the kick. Simple is the sound of a record.</p>", opts: [{ t: "Last question", cls: "primary", next: "bq3" }] });
  N("bq2n", { q: "Not this one.", d: "<p>The bass plays <strong>the root — the lowest note — of each chord</strong>, following the changes. You already made every bass decision when you chose the chords.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "bq2" }] });
  N("bq3", {
    step: "Beginner · check 3 of 3", q: "A chorus feels big because…",
    opts: [
      { t: "The verse before it was thinner", next: "bq3y" },
      { t: "You turned everything up", next: "bq3n" },
      { t: "It has more reverb", next: "bq3n" }
    ]
  });
  N("bq3y", { q: "Exactly.", d: "<p>Contrast, not volume. Arranging is mostly subtraction.</p>", opts: [{ t: "Finish", cls: "good", next: "bDone" }] });
  N("bq3n", { q: "Not this one.", d: "<p>It's contrast: <strong>the verse got out of the way</strong>. If a chorus isn't lifting, thin the verse rather than piling more onto the chorus.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "bq3" }] });
  N("bDone", {
    done: true, q: "Beginner level complete — that's a real song skeleton.",
    d: "<p>Beat, chords, bass, structure, and a voice-checked key and tempo. When you've done this two or three times it takes twenty minutes, and then the Intermediate walk is where it starts sounding produced.</p>",
    goFlows: ["songI", "record"]
  });

  /* ---------------- INTERMEDIATE ---------------- */

  N("i_1", {
    step: "Intermediate · step 1 of 9", q: "Guitar, three ways — from your keyboard",
    v: function () { return patternGridHTML("gtr_chop", false) + patternGridHTML("gtr_drive", false) + patternGridHTML("gtr_arp", false); },
    d: "<p>Add a FLEX channel and search its guitars (acoustic, clean electric, muted). You don't strum a keyboard — you play guitar <em>rhythms</em>. The three that cover almost everything:</p><p><strong>Off-beat chops</strong> for bounce, <strong>driving eighths</strong> for energy, <strong>picked arpeggio</strong> for delicate verses. Draw them in the Piano roll on your chord notes, or play them live.</p>",
    opts: [{ t: "Guitar in — next", cls: "primary", next: "i_2" }]
  });
  N("i_2", {
    step: "Intermediate · step 2 of 9", q: "Colour layers — one new sound per section",
    v: function () { return SVGX.vocalSpace(); },
    d: "<p>Now the supporting cast, added sparingly:</p><ul><li><strong>Pad or strings</strong> — long held chords, quiet, chorus only. Felt more than heard.</li><li><strong>Shaker or tambourine</strong> — 8th notes through the chorus adds motion for free.</li><li><strong>A second hat or perc</strong> — pan it slightly left or right for width.</li></ul><p>The discipline: <strong>each section introduces at most one new sound</strong>, and the middle of the picture stays clear for your voice.</p>",
    opts: [{ t: "Layered — next", cls: "primary", next: "i_3" }]
  });
  N("i_3", {
    step: "Intermediate · step 3 of 9", q: "The verse beat and the chorus beat must differ",
    d: "<p>One drum pattern all the way through is the #1 tell of a beginner track. The fix costs two minutes:</p><ul><li>Right-click your pattern → <strong>Clone</strong></li><li>In the clone, <strong>delete</strong> — drop the hats entirely, or keep just kick and a shaker. That's the <strong>verse</strong> beat.</li><li>The full pattern is the <strong>chorus</strong> beat. Swap them in the Playlist.</li></ul><p>Verses breathe, choruses hit. Same tempo, totally different energy.</p>",
    opts: [{ t: "Two beats — next", cls: "primary", next: "i_4" }]
  });
  N("i_4", {
    step: "Intermediate · step 4 of 9", q: "Fills and crashes — the punctuation",
    v: function () { return patternGridHTML("fill_bar", false); },
    d: "<p>Clone your verse beat once more and make the <strong>fill bar</strong> — it replaces the last bar before each chorus. The snare run says \"here it comes\", the crash on the next downbeat says \"it's here\".</p><p>Put a crash on step 1 of every chorus. It's the cheapest drama in music.</p>",
    opts: [{ t: "Fills placed — next", cls: "primary", next: "i_5" }]
  });
  N("i_5", {
    step: "Intermediate · step 5 of 9", q: "The pre-chorus build",
    v: function () { return SVGX.sweepCurve(); },
    d: "<p>The last 4–8 bars before a chorus should climb. Pick two:</p><ul><li>Hats go from 8ths to <strong>16ths</strong> in the last 2 bars</li><li>An <strong>open hat</strong> or riser sound swells in</li><li>Bass starts pumping 8th notes instead of holding</li><li>And the killer: a <strong>drop-out bar</strong> — everything stops for one bar, then the chorus slams in with the crash</li></ul>",
    opts: [{ t: "It builds — next", cls: "primary", next: "i_6" }]
  });
  N("i_6", {
    step: "Intermediate · step 6 of 9", q: "Humanise the whole thing",
    v: function () { return SVGX.hatRoll(); },
    d: "<ul><li><strong>Velocity</strong> — in the Channel Rack's graph editor, drag hats to alternate loud/soft. This single move transforms a beat.</li><li><strong>Swing</strong> — the knob at the top of the rack, 15–25% for anything with groove</li><li><strong>Ghost snares</strong> — very quiet hits before the main ones (the R&amp;B grid in <a href='#beats'>Making beats</a> shows where)</li></ul>",
    opts: [{ t: "It grooves — next", cls: "primary", next: "i_7" }]
  });
  N("i_7", {
    step: "Intermediate · step 7 of 9", q: "The full-structure pass",
    v: function () { return SVGX.songArc(); },
    d: "<p>Lay out the whole song: intro → verse → pre → chorus → verse 2 → chorus → bridge → final chorus → outro (bar counts in <a href='#song'>Building a song</a>). Now walk it start to finish asking one question per boundary: <em>does something change here?</em> A new layer in, a layer out, a fill, a drop — every section border needs one event.</p>",
    opts: [{ t: "Done — next", cls: "primary", next: "iMix" }]
  });
  N("iMix", {
    step: "Intermediate · step 8 of 9", q: "The balance pass",
    v: function () { return SVGX.flMixer("vocal"); },
    d: "<p>Before any listening verdict: balance. Loop the fullest chorus, <kbd>F9</kbd>, vocal fader up until the voice clearly sits on top, everything that fights it comes down. Master meter never touches red — if it does, all faders down together. Then check the mix survives your phone's speaker as well as headphones.</p>",
    opts: [{ t: "Balanced — next", cls: "primary", next: "iExp" }]
  });
  N("iExp", {
    step: "Intermediate · step 9 of 9", q: "Save, export, listen like a listener",
    d: act([
        "<kbd>Cmd+S</kbd> — and make version saves as you go: <em>SongName v2</em>, <em>v3</em>… so you can always step back",
        "<span class='path'>File → Export → WAV file…</span> (<kbd>Cmd+R</kbd>) → Start",
        "AirDrop it to your phone and play it in the places you actually listen — speaker, car, earbuds",
        "Write down the ONE thing that bothers you most on each listen. That list is your next session's plan"
      ]),
    opts: [{ t: "Exported — quiz me", cls: "primary", next: "iq1" }]
  });
  N("iq1", {
    step: "Intermediate · check 1 of 3", q: "The verse drum beat comes from…",
    opts: [
      { t: "Cloning the chorus beat and deleting pieces", next: "iq1y" },
      { t: "Writing a brand-new busier pattern", next: "iq1n" },
      { t: "Muting the drums entirely", next: "iq1n" }
    ]
  });
  N("iq1y", { q: "Right.", d: "<p>Subtraction from the full beat keeps the two related — same song, different intensity.</p>", opts: [{ t: "Next question", cls: "primary", next: "iq2" }] });
  N("iq1n", { q: "Not this one.", d: "<p><strong>Clone the full beat, then delete.</strong> The verse is the chorus with pieces removed — related but thinner. (Muting everything is a moment, not a verse.)</p>", opts: [{ t: "Back to the question", cls: "primary", next: "iq1" }] });
  N("iq2", {
    step: "Intermediate · check 2 of 3", q: "Where does a drum fill belong?",
    opts: [
      { t: "The last bar before a section change", next: "iq2y" },
      { t: "Every fourth bar, always", next: "iq2n" },
      { t: "Under the vocal's fastest line", next: "iq2n" }
    ]
  });
  N("iq2y", { q: "Right.", d: "<p>Fills are punctuation — they announce the boundary. And they live in the gaps the vocal leaves, never on top of it.</p>", opts: [{ t: "Last question", cls: "primary", next: "iq3" }] });
  N("iq2n", { q: "Not this one.", d: "<p><strong>The last bar before a section change.</strong> A fill under a busy vocal line fights the singer — save it for the gap between phrases.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "iq2" }] });
  N("iq3", {
    step: "Intermediate · check 3 of 3", q: "How many new sounds per section?",
    opts: [
      { t: "About one", next: "iq3y" },
      { t: "As many as possible — bigger is better", next: "iq3n" },
      { t: "None — sections should be identical", next: "iq3n" }
    ]
  });
  N("iq3y", { q: "Exactly.", d: "<p>One change per boundary keeps the song evolving without crowding the voice.</p>", opts: [{ t: "Finish", cls: "good", next: "iDone" }] });
  N("iq3n", { q: "Not this one.", d: "<p><strong>About one.</strong> Every border needs one event — but pile sounds in and the mid-range crowds your vocal. Identical sections are the opposite failure: nothing moves.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "iq3" }] });
  N("iDone", {
    done: true, q: "Intermediate complete — that's a produced track.",
    d: "<p>Guitar, colour, two beats, fills, a build, and groove. The Advanced walk is where the song learns to speed up, slow down, and breathe.</p>",
    goFlows: ["songA", "record"]
  });

  /* ---------------- ADVANCED ---------------- */

  N("a_1", {
    step: "Advanced · step 1 of 7", q: "Draw the energy map before touching anything",
    v: function () { return SVGX.songArc(); },
    d: "<p>On paper, score every section 1–10 for energy. A great pop arc: intro 2 · verse 4 · pre 6 · chorus 8 · verse2 5 · chorus 8 · bridge 3 · final chorus <strong>10</strong> · outro 2.</p><p>Two rules hiding in those numbers: verse 2 sits <em>above</em> verse 1 (the song must never fully reset), and the bridge drops <em>low</em> so the final chorus is the biggest thing in the song. Everything in this level is in service of that map.</p>",
    opts: [{ t: "Mapped — next", cls: "primary", next: "a_2" }]
  });
  N("a_2", {
    step: "Advanced · step 2 of 7", q: "Speed without changing speed",
    v: function () { return patternGridHTML("driving8", false) + patternGridHTML("anthem", false); },
    d: "<p>The BPM can stay identical while the song feels twice as fast or half as slow — it's all in the drum density:</p><ul><li><strong>Double-time feel:</strong> switch hats to 16ths, kick to driving eighths — the chorus \"speeds up\" without moving the tempo</li><li><strong>Half-time feel:</strong> snare moves from 5&amp;13 to just 9 — the same BPM suddenly feels heavy and huge. Devastating for a bridge or a final-chorus first half</li></ul><p>Try it: play your chorus, then swap in the half-time snare for 8 bars. Same song, new gravity.</p>",
    opts: [{ t: "Feels different — next", cls: "primary", next: "a_3" }]
  });
  N("a_3", {
    step: "Advanced · step 3 of 7", q: "Real tempo changes — yes, actually moving the BPM",
    v: function () { return SVGX.tempoCurve(); },
    d: "<p><strong>Right-click the BPM display → Create automation clip.</strong> A lane appears in the Playlist; click to add points, drag to shape.</p><ul><li><strong>The lift:</strong> +4–6 BPM ramped in across the bridge so the final chorus arrives faster than the song began. Listeners feel excitement, not the change itself.</li><li><strong>The ritardando:</strong> ease the last 2–4 bars of the outro down 20–30 BPM for an \"ending like a live band\" finish.</li><li>Keep vocals recorded <em>after</em> tempo automation is set — audio doesn't stretch as gracefully as MIDI.</li></ul>",
    opts: [{ t: "Tempo moves — next", cls: "primary", next: "a_4" }]
  });
  N("a_4", {
    step: "Advanced · step 4 of 7", q: "The transition toolbox",
    d: "<p>Six ways across a section boundary — use <strong>one</strong> per boundary, different ones through the song:</p><ul><li><strong>Drop-out bar</strong> — one bar of silence, then slam. The strongest move into a final chorus.</li><li><strong>Reverse crash</strong> — a cymbal swelling <em>into</em> the downbeat</li><li><strong>Riser</strong> — any long note pitching up through the last 2 bars</li><li><strong>Drum fill</strong> — your intermediate fill bar</li><li><strong>Filter sweep</strong> — everything muffled → opens exactly on the downbeat</li><li><strong>Vocal pickup</strong> — the singer starts a phrase alone, band lands with them. The classiest one, and free.</li></ul>",
    opts: [{ t: "Toolbox stocked — next", cls: "primary", next: "a_5" }]
  });
  N("a_5", {
    step: "Advanced · step 5 of 7", q: "Automation everywhere — nothing sits still",
    v: function () { return SVGX.sweepCurve(); },
    d: "<p>Right-click almost any knob in FL → <strong>Create automation clip</strong>. The three that matter most:</p><ul><li><strong>Volume:</strong> verses run about 20% lower than choruses — the arrangement breathes even before mixing</li><li><strong>Filter cutoff:</strong> verses slightly darker, opening into each chorus</li><li><strong>Reverb amount:</strong> dry verses, wetter choruses — space reads as size</li></ul><p>One automation lane on the master filter, shaped like the sweep above, is worth more than an hour of plugin shopping.</p>",
    opts: [{ t: "It breathes — next", cls: "primary", next: "a_6" }]
  });
  N("a_6", {
    step: "Advanced · step 6 of 7", q: "Reinvent the bridge, then lift the last chorus",
    d: "<p>The bridge is the deliberate low point. Strip to <strong>voice + one instrument</strong>, and start on a chord no section has started on (try the vi — Am in C). Eight bars is plenty.</p><p>Then the oldest trick that still works every time: <strong>the final chorus moves up one semitone</strong>. Select each MIDI part (Cmd+A in its Piano roll) and shift it up one step; your voice reaches slightly higher, and the whole room lifts. Check the new top note is still comfortable — if not, lift everything <em>except</em> the melody.</p>",
    opts: [{ t: "Bridge built — next", cls: "primary", next: "a_7" }]
  });
  N("a_7", {
    step: "Advanced · step 7 of 8", q: "The subtraction test",
    d: "<p>Solo the whole track and mute layers one at a time, asking: <em>do I miss it?</em> If not, delete it — every sound that isn't earning its place is stealing space from your voice.</p><p>Then play the song against a favourite record in the same mood. Not to match its polish — to check the <strong>shape</strong>: do your verses sit lower, do your choruses arrive, does anything change at every boundary?</p>",
    opts: [{ t: "Passed — last step", cls: "primary", next: "a_8" }]
  });
  N("a_8", {
    step: "Advanced · step 8 of 8", q: "The mastering pass — the last ten minutes",
    v: function () { return SVGX.mixerMaster(); },
    d: "<p>Mastering happens on the <strong>Master strip</strong> in the Mixer — click it, then load two effects into its slots on the right:</p><ul><li><strong>Slot 1 — Fruity Parametric EQ 2.</strong> Two gentle moves only: pull 200–300&nbsp;Hz down a touch if it sounds muddy, lift the top shelf slightly for air. If a move is big enough to hear instantly, it's too big.</li><li><strong>Slot 2 — Fruity Limiter.</strong> Its default limiter setting catches the peaks. Raise its gain until the song is comparably loud to a reference track, and stop the moment it starts to sound squashed.</li></ul><p>Keep the master fader itself at its default, and make sure the meter never slams red. Then <strong>File → Export → WAV</strong> for the keeper copy, MP3 for sharing.</p><div class='note watch' style='margin-top:14px'><b>What mastering can't do</b> It cannot fix arrangement, a clipped vocal, or a crowded mid-range — those are earlier steps. If the master needs surgery, the problem is upstream.</div>",
    opts: [{ t: "Exported — final quiz", cls: "primary", next: "aq1" }]
  });
  N("aq1", {
    step: "Advanced · check 1 of 3", q: "Make a chorus feel faster without touching the BPM:",
    opts: [
      { t: "Hats to 16ths, kick to driving eighths", next: "aq1y" },
      { t: "Turn the tempo up 20 BPM", next: "aq1n" },
      { t: "Add more reverb", next: "aq1n" }
    ]
  });
  N("aq1y", { q: "Right.", d: "<p>Perceived speed is drum density. The BPM never moved.</p>", opts: [{ t: "Next question", cls: "primary", next: "aq2" }] });
  N("aq1n", { q: "Not this one.", d: "<p><strong>Density, not tempo:</strong> hats to 16ths and a busier kick make the same BPM feel faster. A 20 BPM jump mid-song sounds like a mistake (a ramped 4–6 is the real trick), and reverb makes things bigger, not faster.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "aq1" }] });
  N("aq2", {
    step: "Advanced · check 2 of 3", q: "How do you change the actual tempo mid-song in FL?",
    opts: [
      { t: "Right-click the BPM display → Create automation clip", next: "aq2y" },
      { t: "Drag the BPM while the song plays and hope", next: "aq2n" },
      { t: "You can't — tempo is fixed", next: "aq2n" }
    ]
  });
  N("aq2y", { q: "Right.", d: "<p>Points on the automation lane, ramped smoothly — a lift into the final chorus, a ritardando at the end.</p>", opts: [{ t: "Last question", cls: "primary", next: "aq3" }] });
  N("aq2n", { q: "Not this one.", d: "<p><strong>Right-click the BPM display → Create automation clip.</strong> Tempo is fully automatable in FL — drawn as a curve in the Playlist, not performed live.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "aq2" }] });
  N("aq3", {
    step: "Advanced · check 3 of 3", q: "The strongest way into a final chorus?",
    opts: [
      { t: "A drop-out bar — silence, then everything", next: "aq3y" },
      { t: "Make the bridge as loud as possible first", next: "aq3n" },
      { t: "A key change in the bridge itself", next: "aq3n" }
    ]
  });
  N("aq3y", { q: "Exactly.", d: "<p>Silence is the biggest contrast available, and contrast is the entire game.</p>", opts: [{ t: "Finish", cls: "good", next: "aDone" }] });
  N("aq3n", { q: "Not this one.", d: "<p><strong>The drop-out bar.</strong> The bridge stays LOW so the final chorus towers over it — a loud bridge spends the contrast early, and the key lift belongs to the chorus itself, not the bridge.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "aq3" }] });
  N("aDone", {
    done: true, q: "Advanced complete — you're producing now.",
    d: "<p>Energy maps, perceived and real tempo movement, transitions, automation, a bridge that serves the ending. That's the craft in full. Record the vocal properly, and finish the song — a finished song teaches more than a perfect eight bars ever will.</p>",
    goFlows: ["record"]
  });

  /* ============================================================
     FLOW: make a beat (genre-parameterised)
     ============================================================ */

  N("b0", {
    q: "What should it feel like?",
    d: "<p>Pick the mood of the song it's going under. I'll suggest a tempo and build the pattern with you.</p>",
    opts: [
      { t: "Upbeat pop", s: "Bright, driving — most pop singles", next: "bt1_pop" },
      { t: "Slow ballad", s: "Spacious and emotional", next: "bt1_ballad" },
      { t: "Hip hop / R&B", s: "Head-nod groove, smooth", next: "bt1_rnb" },
      { t: "Dance / house", s: "Four-on-the-floor energy", next: "bt1_dance" },
      { t: "Trap / drill", s: "Heavy 808s, rolling hats", next: "bt1_trap" },
      { t: "Slow R&B / late-night", s: "Slow jams, neo-soul, quiet storm — five grooves", next: "bt1_rnbslow" }
    ]
  });

  var GENRES = {
    pop:    { label: "Upbeat pop",  bpm: "104–116", bpmSet: "110", pat: "basicpop", alt: "push",
              hum: "<ul><li>Alternate the hi-hat velocities loud/soft in the graph editor — instant humanity</li><li>Add the <strong>push</strong> variant (extra kick on step 8) in the chorus for drive</li><li>Snare fill on steps 13–16 of the bar before the chorus</li></ul>" },
    ballad: { label: "Slow ballad", bpm: "68–78",   bpmSet: "72",  pat: "ballad", alt: "anthem",
              hum: "<ul><li>Keep it sparse — this feel dies from overcrowding</li><li>Swap the hi-hat for a shaker or rimshot in the verses</li><li>For the final chorus, move to the <strong>half-time anthem</strong> pattern with a crash on beat 1</li></ul>" },
    rnb:    { label: "Hip hop / R&B", bpm: "84–92", bpmSet: "88",  pat: "boombap", alt: "rnb",
              hum: "<ul><li>Turn the <strong>swing knob</strong> (top of the Channel Rack) to 15–25% — this genre lives on swing</li><li>Add the ghost snares from the R&amp;B pattern at ~30% velocity</li><li>Keep hats quieter than you think — the groove is in the kick and snare</li></ul>" },
    dance:  { label: "Dance / house", bpm: "120–126", bpmSet: "124", pat: "fourfloor", alt: "driving8",
              hum: "<ul><li>The open hat on the off-beats (steps 3, 7, 11, 15) IS the genre — make it slightly loud</li><li>Layer a clap on top of the snare for width</li><li>Drop the kick out for the last bar before a chorus, then slam it back in</li></ul>" },
    trap:   { label: "Trap / drill", bpm: "136–146", bpmSet: "140", pat: "trap", alt: "drill",
              hum: "<ul><li>Every kick gets an <strong>808 note</strong> on the same step, pitched to your chord roots — in FLEX, search \"808\"</li><li>One <strong>hat roll</strong> at the end of each 4- or 8-bar phrase, velocity swelling in — see the roll card in Making beats</li><li>Try the <strong>drill</strong> variant with its early snare for the off-balance UK feel</li></ul>" },
    rnbslow: { label: "Slow R&B", bpm: "58–75", bpmSet: "66", pat: "rnb_slowjam", alt: "rnb_neosoul",
              hum: "<ul><li><strong>Swing 20–30%</strong> — slow R&B lives further behind the beat than anything else you’ll make</li><li>Ghost hits (snare or shaker at ~25% velocity) are the difference between empty and intimate</li><li>Swap the snare for a <strong>rim click</strong> to go full quiet-storm, or add an 808 on the kicks for trap-soul</li><li>All five slow grooves are drawn in the library: slow jam, 12/8 sway, neo-soul, trap-soul, quiet storm — try each under the same 8 bars of singing and keep the one that fits her phrasing</li></ul>" }
  };

  Object.keys(GENRES).forEach(function (g) {
    var G = GENRES[g];
    N("bt1_" + g, {
      step: "Step 1 of 5 — " + G.label, q: "Set the tempo: around " + G.bpmSet + " BPM",
      v: function () { return SVGX.flToolbar("bpm"); },
      d: "<p>This feel lives at <strong>" + G.bpm + " BPM</strong>. You're heading for about <strong>" + G.bpmSet + "</strong> — sequencing at roughly the right speed lets your ears judge it fairly.</p>" +
        act([
          "Look at the <strong>very top of the FL window</strong> — the orange number in the black box (ringed below) is the tempo",
          "<strong>Click and hold</strong> it, then <strong>drag up</strong> until it reads about " + G.bpmSet,
          "Or <strong>right-click it → Type in value</strong> and type " + G.bpmSet
        ]),
      opts: [{ t: "Tempo set — next", cls: "primary", next: "bt2_" + g }]
    });
    N("bt2_" + g, {
      step: "Step 2 of 5 — " + G.label, q: "Click this pattern into the Channel Rack",
      v: function () {
        var chans = PATTERNS[G.pat].rows.map(function (r) { return { name: r.label, led: false, steps: r.steps }; });
        chans.push({ name: "FLEX — Grand Piano", led: false, steps: [] });
        return '<div style="margin-bottom:14px">' + SVGX.flRack("steps", chans) + "</div>" + patternGridHTML(G.pat, false);
      },
      d: "<p>You're going to copy the grid at the bottom into FL, cell by cell. Each row is one drum; the 16 cells are one bar of time, left to right.</p>" +
        act([
          "Press <kbd>F6</kbd> — the <strong>Channel Rack</strong> opens (the window drawn below)",
          "On the <strong>" + PATTERNS[G.pat].rows[0].label + "</strong> row, <strong>left-click</strong> each cell that's filled in the grid below. It lights up lime",
          "Clicked the wrong one? <strong>Right-click</strong> a lit cell to clear it",
          "Do the same for the other rows, then press <kbd>Space</kbd> — the bar loops so you hear every change as you make it",
          "Don't like a drum's sound? <strong>Right-click its name → Replace</strong> and pick another from the browser"
        ]),
      opts: [{ t: "It's looping — next", cls: "primary", next: "bt3_" + g }]
    });
    N("bt3_" + g, {
      step: "Step 3 of 5 — " + G.label, q: "Make it human",
      v: g === "trap" ? function () { return SVGX.hatRoll(); } : function () { return SVGX.rackHumanise(); },
      d: G.hum + (g === "trap"
        ? act([
            "For the rolls: press <kbd>F7</kbd> on the Hat channel and paint <strong>1/32 notes</strong> for the last half-beat of a phrase",
            "Then drag their velocity bars (bottom lane) so the roll swells quiet → loud",
            "Back in the rack, nudge the <strong>SWING</strong> slider (top of the rack) slightly right"
          ])
        : act([
            "In the Channel Rack, click the small <strong>graph editor</strong> button at the <strong>top-right</strong> (ringed below) — a lane of orange bars opens under the steps",
            "Click the <strong>Hat</strong> channel's name first so the lane shows the hats",
            "<strong>Drag alternate bars lower</strong> — tall, short, tall, short. That one move stops the robot sound",
            "Find the <strong>SWING</strong> slider at the top of the rack and drag it right to about " + (g === "rnb" ? "20–25%" : "10–15%") + ", listening as you go"
          ])),
      opts: [{ t: "Grooving — next", cls: "primary", next: "bt4_" + g }]
    });
    N("bt4_" + g, {
      step: "Step 4 of 5 — " + G.label, q: "Verse version, chorus version",
      v: function () { return SVGX.songArc(); },
      d: "<p>One beat all the way through is the #1 beginner tell. You'll make a thinner copy for the verses — the full one becomes the chorus.</p>" +
        act([
          "Find <strong>Pattern 1</strong> in the toolbar at the top — <strong>right-click it → Clone</strong>",
          "In the clone, <strong>right-click cells to delete</strong> until only kick and one hat remain — that's the verse beat",
          "<strong>Right-click each pattern's name → Rename</strong>: call them \"Beat — verse\" and \"Beat — chorus\" now, while you remember which is which",
          "Also worth a try as a variation: the <strong>" + PATTERNS[G.alt].name + "</strong> grid from the library"
        ]),
      opts: [{ t: "Verse & chorus made — one more thing", cls: "primary", next: "btChorus" }]
    });
  });

  N("btChorus", {
    step: "Step 5 of 5 — when the chorus hits", q: "The chorus has to LIFT — here’s exactly what changes",
    v: function () { return SVGX.chorusLift(); },
    d: "<p>A chorus usually <em>feels</em> faster — but the tempo almost never changes. The speed-up you hear on records is the drums getting <strong>denser</strong>, not quicker. The diagram shows the whole trick; here it is as moves:</p>" +
      act([
        "<strong>The fill announces it:</strong> in the LAST bar of the verse pattern, add snare on steps <strong>13–14–15–16</strong> and clear the hats from those steps",
        "<strong>Crash on arrival:</strong> in the chorus pattern, add a <strong>crash cymbal on step 1</strong> — add a Crash channel if you don’t have one (right-click a channel → Insert)",
        "<strong>Double the hats:</strong> verse hats on every other cell (1,3,5…) become chorus hats on <strong>every cell</strong> — this is the ‘speed-up’ your ears hear",
        "<strong>Open hat breathes:</strong> add the open hat on the off-beats — steps <strong>3, 7, 11, 15</strong>",
        "<strong>One or two extra kicks</strong> (try steps 4 and 12) so the floor moves more",
        "Slow R&B exception: lift LESS — double the shaker instead of the hats, add the crash, and let the vocal stack do the rest"
      ]) +
      "<p>If a song genuinely speeds up (some do, on purpose): <strong>right-click the BPM display → Create automation clip</strong> and raise it by only <strong>2–4 BPM</strong> into the final chorus — more sounds like a mistake. The full walkthrough is in <a href='#song' style='color:var(--accent-deep)'>Building a song</a> under tempo changes.</p>",
    opts: [{ t: "Done — the beat breathes", cls: "good", next: "bDone" }]
  });

  N("bDone", {
    done: true, q: "You have a beat.",
    d: "<p>Everything deeper — hat rolls, 808/kick locking, ghost notes, leaving space for your voice — is in <a href='#beats' style='color:var(--accent-deep)'>Making beats</a>, with all twelve patterns drawn out.</p>",
    goFlows: ["song"]
  });

  /* ============================================================
     FLOW: shape my voice
     ============================================================ */

  N("v0", {
    q: "What should your voice sound like?",
    v: function () { return SVGX.vocalChain(); },
    d: "<p>Pick the destination — I'll set up the exact effects with you. If this is your first time here, start with the polish: it's the chain drawn below, and it's the foundation every other sound builds on.</p>",
    opts: [
      { t: "What IS the vocal chain?", s: "The guided tour — what each effect actually does to your voice, in plain words", next: "vc1" },
      { t: "Polished, like a record", s: "The standard vocal chain: EQ → compression → reverb → delay. Start here", cls: "primary", next: "vs1" },
      { t: "Big ballad space", s: "Long hall reverb, dreamy echoes — the held-note chorus sound", next: "vbal1" },
      { t: "Modern pop sheen", s: "Pitch correction — from invisible polish to the hard tuned effect", next: "vpop1" },
      { t: "A character voice", s: "Telephone, megaphone, robot, whisper — a different voice for one section", next: "vch1" },
      { t: "Doubles & harmonies", s: "The free chorus-thickener every record uses", next: "vdh1" },
      { t: "R&B vocals — three flavours", s: "Silky classic, airy neo-soul, dark trap-soul", next: "rb0" },
      { t: "Robot & synthetic voices", s: "Sing it human, robotise a copy — three levels, up to the full vocoder", next: "vrb1" }
    ]
  });

  /* ---- A0: the deep dive — what the chain actually is ---- */
  N("vc1", {
    step: "The chain · 1 of 5", q: "What a “chain” actually means",
    v: function () { return SVGX.vocalChain(); },
    d: "<p>When you record your voice, FL saves it exactly as the mic heard it — <strong>dry</strong>: no space around it, every loud note loud, every quiet word quiet, the room rumble still in it. Nobody releases that. Every voice you’ve ever heard on a record has been passed through a row of small tools first.</p>" +
      "<p>That row is the <strong>chain</strong>. Think of it like water through pipes: your voice flows in one end, passes through each tool <em>in order</em>, and comes out the other end sounding like a record. Each tool changes exactly ONE thing:</p>" +
      "<ul><li><strong>EQ</strong> changes the <em>tone</em> — which parts of the voice are louder or quieter, from deep chest to sparkly air</li><li><strong>Compression</strong> changes the <em>evenness</em> — quiet words come up, loud notes come down</li><li><strong>Reverb</strong> changes the <em>space</em> — it puts the voice in a room</li><li><strong>Delay</strong> adds <em>echoes</em> — distinct repeats, when you want them</li></ul>" +
      "<p>The chain lives on the vocal’s <strong>mixer track</strong> (press <kbd>F9</kbd>). The slots down the right-hand side are the pipe — the voice enters at slot 1 and flows downward, so <strong>top-to-bottom is the order</strong>. That’s why the diagram below maps each stage to a numbered slot.</p>",
    opts: [{ t: "So why this order? — next", cls: "primary", next: "vc2" }]
  });
  N("vc2", {
    step: "The chain · 2 of 5", q: "Stage 1: EQ — the tone map",
    v: function () { return SVGX.freqMap(); },
    d: "<p>Every sound is made of <strong>frequencies</strong> — low ones you feel in your chest, high ones that sparkle. A voice spreads across the whole map drawn below, and an <strong>EQ</strong> (equaliser) is simply a volume control for each region separately.</p>" +
      "<p>Reading the map left to right: below 90 Hz there’s <em>no voice at all</em> — just mic-stand rumble, so we cut it. The 250 Hz region turns “boxy” when it piles up — a small dip clears it. The middle is the words themselves — leave it alone. Around 3 kHz lives <strong>presence</strong> — a gentle lift moves the singer closer to the listener’s ear. And 10 kHz up is <strong>air</strong> — the expensive-sounding sparkle (the Scarlett’s AIR button lives up here too).</p>" +
      "<p><strong>What wrong sounds like:</strong> cut too much low and she turns thin, like a phone call. Boost too much air and every “s” turns sharp and spitty (that harsh region is 5–8 kHz — sibilance). That’s why every move stays at 2–3 dB: EQ done right is invisible.</p>" +
      "<p>Why it goes <strong>first</strong>: every tool after this one reacts to what it’s fed. Fix the tone first and the compressor squeezes <em>voice</em>, not rumble; the reverb echoes <em>clarity</em>, not mud.</p>",
    opts: [{ t: "Stage 2: compression — next", cls: "primary", next: "vc3" }]
  });
  N("vc3", {
    step: "The chain · 3 of 5", q: "Stage 2: compression — the invisible hand on the fader",
    v: function () { return SVGX.compDiagram(); },
    d: "<p>Singers are dynamic — a belted chorus can be TEN times louder than a breathy verse word. On a record that would mean quiet words vanish behind the beat and loud notes jump out and hurt. A <strong>compressor</strong> is an invisible hand that turns the volume down the instant you get loud, and lets go when you get quiet again — hundreds of times a second, faster than any human could.</p>" +
      "<p>Its controls in plain words:</p>" +
      "<ul><li><strong>THRESHOLD (THRES)</strong> — the line where the hand starts pushing. Lower line = more of the voice gets caught. This is the knob you actually use</li><li><strong>RATIO</strong> — how hard it pushes once you cross the line. 3:1–4:1 is the vocal zone</li><li><strong>ATTACK</strong> — how fast the hand grabs. Too fast squashes the crisp start of words</li><li><strong>RELEASE</strong> — how fast it lets go. Too fast and you hear it “breathing”</li></ul>" +
      "<p>The recipe: sing the loudest chorus line, lower THRES until the meter dips <strong>3–4 dB</strong> on the big moments, leave the rest at the defaults. <strong>What wrong sounds like:</strong> the voice “pumping” like it’s being squeezed, or her breaths suddenly as loud as words — both mean back the threshold off.</p>" +
      "<p>Why it comes <strong>after EQ</strong>: compression reacts to everything it hears. If the rumble is still in there, the compressor squeezes the whole voice every time a truck goes past.</p>",
    opts: [{ t: "Stage 3: reverb — next", cls: "primary", next: "vc4" }]
  });
  N("vc4", {
    step: "The chain · 4 of 5", q: "Stage 3: reverb — what a “space” is made of",
    v: function () { return SVGX.reverbAnatomy(); },
    d: "<p>Sing in a bathroom and the sound bounces off every wall, thousands of tiny echoes arriving so close together they blur into a wash. That wash is <strong>reverb</strong>. The plugin fakes it — which means you can record in a bedroom and place the voice in any room you like.</p>" +
      "<p>The anatomy drawn below is what the knobs control:</p>" +
      "<ul><li><strong>PRE-DELAY</strong> — the silent gap between the word and its reverb. ~20 ms keeps every word clear; without it the room swallows the consonants</li><li><strong>DECAY</strong> — how long the room rings. Short (~1.2 s) = tight and modern; long (3 s+) = cathedral ballad</li><li><strong>DAMPING</strong> — how fast the tail loses its brightness, like curtains on the walls. More damping = darker, moodier space</li><li><strong>WET</strong> — how loud the whole cloud is next to the dry voice. THE knob: 15–25% for a lead. You should <em>feel</em> the room, not hear an obvious effect</li></ul>" +
      "<p>The three room shapes: <strong>Room</strong> = small and intimate (verses). <strong>Plate</strong> = no room at all, a smooth flattering studio invention — THE default vocal choice. <strong>Hall</strong> = big and dramatic (ballad choruses). <strong>What wrong sounds like:</strong> the voice drowning far away — too wet; or lyrics smearing into each other — decay too long for the song’s speed.</p>" +
      "<p>Why it comes <strong>after</strong> EQ and compression: reverb is a photocopier for whatever you feed it. Feed it mud and unevenness, and it prints mud and unevenness onto every wall of the room.</p>",
    opts: [{ t: "Stage 4: delay — next", cls: "primary", next: "vc5" }]
  });
  N("vc5", {
    step: "The chain · 5 of 5", q: "Stage 4: delay — and the whole chain together",
    v: function () { return SVGX.delayTaps(); },
    d: "<p><strong>Delay vs reverb</strong>, once and forever: reverb is a <em>space you feel</em> — a blur. Delay is an <em>echo you hear</em> — distinct repeats of the word, in time with the song. Plenty of finished songs stop at reverb; delay is the optional fourth stage for when you want the echo as a feature.</p>" +
      "<ul><li><strong>Slapback</strong> — one fast echo: instant attitude</li><li><strong>1/4-note echo</strong> — repeats that land on the beat (use the tempo-sync icon): dreamy and big</li><li><strong>The throw</strong> — the delay turned up for just the LAST word of a line, echoing into the gap. The most record-sounding trick in this whole app</li></ul>" +
      "<p>And that’s the chain: <strong>EQ fixes the tone → compression fixes the evenness → reverb adds the space → delay adds echoes.</strong> Each stage hands a cleaner voice to the next — which is the whole reason the order never changes. Everything else in the voice menu (ballads, pop sheen, R&B, characters) is this same chain with different settings on top.</p>",
    opts: [
      { t: "Build it on my vocal now", cls: "primary", next: "vs1" },
      { t: "Back to the voice menu", next: "v0" },
      { t: "Done for now", cls: "good", next: "vcDone" }
    ]
  });
  N("vcDone", {
    done: true, q: "Now the chain makes sense.",
    d: "<p>When you’re ready to build it for real, the <strong>Polished, like a record</strong> path sets up all four stages on your actual vocal, knob by knob. The full written version lives in <a href='#voicefx' style='color:var(--accent-deep)'>Shaping your voice</a>.</p>",
    goFlows: ["voicefx", "record"]
  });

  /* ---- A: the standard chain ---- */
  N("vs1", {
    step: "Polish · step 1 of 5", q: "Where vocal effects live",
    v: function () { return SVGX.mixerVocal(); },
    d: "<p>Every effect goes on the vocal's <strong>mixer track</strong>, stacked in its slots — top to bottom is the order the voice passes through them, and the order is the recipe.</p>" +
      act([
        "Press <kbd>F9</kbd> — the Mixer opens",
        "Click the track your vocal is on (the one you armed when recording)",
        "The <strong>slots panel on the right</strong> is where the next four steps load their effects — slot 1 at the top, downwards in order"
      ]),
    opts: [{ t: "I'm on the vocal track — next", cls: "primary", next: "vs2" }]
  });
  N("vs2", {
    step: "Polish · step 2 of 5", q: "Slot 1: EQ — tidy the tone",
    v: function () { return SVGX.eqCurve(); },
    d: "<p>Four small moves cover almost every voice — the curve below is the whole recipe.</p>" +
      act([
        "Click the <strong>arrow on Slot 1</strong> → <span class='path'>Select</span> → <strong>Fruity parametric EQ 2</strong>",
        "Drag the leftmost band to <strong>cut everything below ~90 Hz</strong> (rumble, not voice)",
        "Pull a small <strong>dip around 250 Hz</strong> if it sounds boxy",
        "Lift <strong>3 kHz gently</strong> for presence, and a small <strong>shelf up at 10 kHz</strong> for air",
        "Keep every move at 2–3 dB — obvious means too much"
      ]),
    opts: [{ t: "EQ set — next", cls: "primary", next: "vs3" }]
  });
  N("vs3", {
    step: "Polish · step 3 of 5", q: "Slot 2: compression — even it out",
    v: function () { return SVGX.compDiagram(); },
    d: "<p>The compressor turns loud moments down automatically so every word sits at a steady level — the reason record vocals never vanish behind the music.</p>" +
      act([
        "Slot 2 → <strong>Fruity Limiter</strong>, and click its <strong>COMP</strong> tab",
        "Sing/play the loudest chorus line and <strong>lower THRES</strong> until the meter dips by about <strong>3–4 dB</strong> on the big moments",
        "If the voice audibly \"pumps\" or breathes, raise THRES back a little"
      ]),
    opts: [{ t: "Evened — next", cls: "primary", next: "vs4" }]
  });
  N("vs4", {
    step: "Polish · step 4 of 5", q: "Slot 3: reverb — the space",
    v: function () { return SVGX.reverbWindow(); },
    d: "<p>Room = intimate. <strong>Plate = the classic vocal choice.</strong> Hall = big and dramatic. The <strong>WET</strong> knob decides how much space you hear — and it's the knob that matters.</p>" +
      act([
        "Slot 3 → <strong>Fruity Reeverb 2</strong>",
        "Open its <strong>presets</strong> and pick a vocal plate (or a hall for a ballad)",
        "Set <strong>WET to ~20%</strong> — you should <em>feel</em> the space, not hear an obvious effect",
        "Set <strong>PRE-DELAY ~20 ms</strong> so each word lands clearly before its reverb blooms",
        "Fast song? Keep <strong>DECAY under 1.5 s</strong> so lines don't smear together"
      ]),
    opts: [{ t: "In its space — next", cls: "primary", next: "vs5" }]
  });
  N("vs5", {
    step: "Polish · step 5 of 5", q: "Slot 4: delay — optional echoes",
    v: function () { return SVGX.delayTaps(); },
    d: "<p>Delay is an effect you <em>hear</em>, where reverb is a space you <em>feel</em>. Plenty of songs stop at reverb — add this when you want it.</p>" +
      act([
        "Slot 4 → <strong>Fruity Delay 3</strong>",
        "Click the <strong>tempo-sync icon</strong> on TIME and set <strong>1/4</strong> — echoes now land on the beat",
        "Keep <strong>FEEDBACK low</strong> (two or three repeats) and the mix subtle",
        "The pro move: automate the delay's mix up for just the <strong>last word</strong> of a phrase, so it echoes into the gap"
      ]),
    opts: [{ t: "Chain complete — quick quiz", cls: "primary", next: "vfq1" }]
  });
  N("vfq1", {
    step: "Polish · check 1 of 3", q: "Which comes first on the vocal track?",
    opts: [
      { t: "EQ, then compression, then reverb", next: "vfq1y" },
      { t: "Reverb first — set the mood early", next: "vfq1n" },
      { t: "Order doesn't matter", next: "vfq1n" }
    ]
  });
  N("vfq1y", { q: "Right.", d: "<p>Fix the tone, even the level, <em>then</em> add space. Reverb on a muddy voice is muddy echoes.</p>", opts: [{ t: "Next question", cls: "primary", next: "vfq2" }] });
  N("vfq1n", { q: "Not this one.", d: "<p><strong>EQ → compression → reverb.</strong> The space goes on a voice that's already tidy and even — reverb applied to mud just gives you spacious mud.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "vfq1" }] });
  N("vfq2", {
    step: "Polish · check 2 of 3", q: "How much reverb on a lead vocal, usually?",
    opts: [
      { t: "WET around 15–25% — felt more than heard", next: "vfq2y" },
      { t: "50%+ — more space is more professional", next: "vfq2n" },
      { t: "None — reverb is old-fashioned", next: "vfq2n" }
    ]
  });
  N("vfq2y", { q: "Right.", d: "<p>If a listener would <em>notice</em> the reverb, it's usually too loud. (50%+ is a deliberate dreamy effect — bridges and outros.)</p>", opts: [{ t: "Last question", cls: "primary", next: "vfq3" }] });
  N("vfq2n", { q: "Not this one.", d: "<p><strong>15–25% WET</strong> for a lead. Big washes are a deliberate special effect, not the default — and bone-dry vocals are their own deliberate style, not the safe choice.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "vfq2" }] });
  N("vfq3", {
    step: "Polish · check 3 of 3", q: "Verses and choruses get…",
    opts: [
      { t: "Drier verses, wetter choruses", next: "vfq3y" },
      { t: "Identical settings — consistency matters", next: "vfq3n" },
      { t: "Wetter verses, drier choruses", next: "vfq3n" }
    ]
  });
  N("vfq3y", { q: "Exactly.", d: "<p>Automating the reverb up into the chorus opens the song like a door — same trick as thinning the verse beat.</p>", opts: [{ t: "Finish", cls: "good", next: "vsDone" }] });
  N("vfq3n", { q: "Not this one.", d: "<p><strong>Drier verses, wetter choruses.</strong> Intimacy up close, then space when the song opens — contrast again, the same rule as everywhere else in arranging.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "vfq3" }] });
  N("vsDone", {
    done: true, q: "That's a produced vocal.",
    d: "<p>EQ → compression → reverb → delay, in that order, forever. Save the mixer track as a preset (arrow at the top of the track → <em>File → Save mixer track state</em>) and every future song starts from here. The other voices — ballad space, tuning, characters, doubles — are back on the chooser.</p>",
    goFlows: ["voicefx", "record"]
  });

  /* ---- B: big ballad space ---- */
  N("vbal1", {
    step: "Ballad space · step 1 of 2", q: "The long hall",
    v: function () { return SVGX.reverbWindow(); },
    d: "<p>This is the held-note, lighters-up sound — the voice singing inside a huge room.</p>" +
      act([
        "Build the polish chain first if you haven't (EQ → compression) — big reverb on an untidy voice turns to soup",
        "In <strong>Fruity Reeverb 2</strong>: pick a <strong>Hall</strong> preset, <strong>DECAY 2.5–3.5 s</strong>, <strong>PRE-DELAY 30–40 ms</strong> so words stay clear inside all that space",
        "<strong>WET 25–35%</strong> — further than pop, still under half",
        "Add <strong>Fruity Delay 3</strong> after it: 1/4 note, feedback low, mix low — echoes swimming inside the hall"
      ]),
    opts: [{ t: "It's huge — next", cls: "primary", next: "vbal2" }]
  });
  N("vbal2", {
    step: "Ballad space · step 2 of 2", q: "Keep the verses close",
    v: function () { return SVGX.sweepCurve(); },
    d: "<p>If the whole song lives in the hall, the hall stops being special. The trick is contrast:</p>" +
      act([
        "<strong>Right-click the reverb's WET knob → Create automation clip</strong>",
        "Draw it <strong>low (~10%) through the verses</strong>, rising through the pre-chorus, <strong>full (~30%) in the chorus</strong>",
        "The last held note of the final chorus can go further — 50%+ as everything else drops away"
      ]),
    opts: [{ t: "Done", cls: "good", next: "vbalDone" }]
  });
  N("vbalDone", {
    done: true, q: "That's the ballad sound.",
    d: "<p>Close and dry when it's intimate, cathedral when it opens. The reverb automation IS the emotional arc.</p>",
    goFlows: ["voicefx"]
  });

  /* ---- C: modern pop sheen ---- */
  N("vpop1", {
    step: "Pop sheen · step 1 of 3", q: "First, the honest bit: your FL is Producer Edition",
    v: function () { return SVGX.pitcherWindow(); },
    d: "<p>Your copy is <strong>Producer Edition</strong> — it records and mixes everything in this app, but FL’s own tuning tools (<strong>Pitcher</strong> and <strong>NewTone</strong>, shown above) only come with Signature Edition and up. So the tuned-pop sound needs one of the routes on the next screen — all of them work on your copy.</p><p>(If the copy ever gets upgraded, or Pitcher gets bought on its own, the walkthrough for it is right here too.)</p>",
    opts: [
      { t: "My options on Producer", cls: "primary", next: "vpop1b" },
      { t: "We’ve added Pitcher — walk me through it", next: "vpop2" }
    ]
  });
  N("vpop1b", {
    step: "Pop sheen · Producer routes", q: "Four routes to the tuned sound, honestly ranked",
    d: "<p><strong>1 · Sing it again.</strong> Unfashionable answer, best result — three more takes of the wobbly line usually beats any software, and it’s free.</p>" +
      "<p><strong>2 · A free tuner plugin.</strong> <strong>Graillon 2 Free</strong> (Auburn Sounds) and <strong>MAutoPitch</strong> (MeldaProduction) are both free, both Mac AU, and both do the two things Pitcher does: set the KEY to your song’s key, and a speed/amount control where slow = invisible polish, fast = the hard tuned effect. Download from the maker’s site, install, then in FL the plugin appears under <span class='path'>Add → More plugins → Manage plugins → Find plugins</span>. Load it in the same slot Pitcher would take: after compression, before reverb.</p>" +
      "<p><strong>3 · Buy Pitcher on its own</strong> from Image-Line’s site — much cheaper than the full Signature upgrade, and then the walkthrough on the next screen applies exactly.</p>" +
      "<p><strong>4 · Upgrade to Signature</strong> — priced as the difference, unlocks NewTone (fix one flat note invisibly) as well.</p>",
    opts: [
      { t: "Free tuner installed — same principles?", cls: "primary", next: "vpop2" },
      { t: "Understood — done", cls: "good", next: "vpopDone" }
    ]
  });
  N("vpop2", {
    step: "Pop sheen · step 2 of 3", q: "Pitcher: from invisible to iconic",
    v: function () { return SVGX.pitcherWindow(); },
    d: "<p>Pitcher (and Graillon / MAutoPitch — same two controls, different paint) listens to the voice and pulls every note toward the nearest note of your key — the <strong>correction speed</strong> decides the character.</p>" +
      act([
        "On the vocal's mixer track, load <strong>Pitcher</strong> in the slot <strong>after</strong> EQ and compression, <strong>before</strong> reverb",
        "Set the <strong>key</strong> to your song's key — this matters most; the wrong key pulls notes to wrong places",
        "<strong>Slow-ish speed</strong> = invisible polish — nobody hears the tool, the voice just sounds confident",
        "<strong>Fastest speed</strong> = the hard quantised shimmer — the deliberate modern-pop/hip-hop vocal effect. It's a style, not a fix",
        "A/B it with the slot's green light — if the slow setting is audible as an effect, ease it further back"
      ]),
    opts: [{ t: "Tuned — next", cls: "primary", next: "vpop3" }]
  });
  N("vpop3", {
    step: "Pop sheen · step 3 of 3", q: "Fixing single notes instead: NewTone",
    v: function () { return SVGX.newtoneWindow(); },
    d: "<p>When the take is great except <em>one flat note</em>, don't tune the whole performance:</p>" +
      act([
        "Open <strong>NewTone</strong> and drag your vocal clip into it — the recording appears as editable note blobs",
        "<strong>Drag the flat note</strong> up to the right pitch — just that one",
        "Small timing slips fix the same way — slide the blob left or right",
        "Export back to the playlist. Nobody will ever know"
      ]),
    opts: [{ t: "Done", cls: "good", next: "vpopDone" }]
  });
  N("vpopDone", {
    done: true, q: "That's the tuned sound, both flavours.",
    d: "<p>Slow Pitcher = confidence. Fast Pitcher = a genre. NewTone = surgery. And all three sit <em>between</em> compression and reverb in the chain.</p>",
    goFlows: ["voicefx"]
  });

  /* ---- D: character voices ---- */
  N("vch1", {
    step: "Characters · step 1 of 2", q: "Pick a character",
    v: function () { return SVGX.charFilter(); },
    d: "<p>These are section effects — one verse, an intro, a bridge — not whole-song sounds. The contrast with the normal voice is the point.</p><div class='tw'><table><thead><tr><th>Sound</th><th>Recipe</th></tr></thead><tbody>" +
      "<tr><td><strong>Telephone / old radio</strong></td><td><strong>Fruity Filter</strong> (or EQ): cut below 500 Hz and above 3 kHz</td></tr>" +
      "<tr><td><strong>Megaphone / grit</strong></td><td><strong>Fruity Blood Overdrive</strong>, drive low — fur and attitude</td></tr>" +
      "<tr><td><strong>Robot</strong></td><td><strong>Vocodex</strong> (Signature) with a synth carrier</td></tr>" +
      "<tr><td><strong>Whisper layer</strong></td><td>No plugin — record the line again <em>whispered</em>, hide it under the sung take</td></tr>" +
      "<tr><td><strong>Dream dissolve</strong></td><td>Reverb WET 50%+, long decay — voice melts into the room</td></tr>" +
      "</tbody></table></div>",
    opts: [{ t: "Chosen — how do I apply it to only one section?", cls: "primary", next: "vch2" }]
  });
  N("vch2", {
    step: "Characters · step 2 of 2", q: "Only where you want it",
    v: function () { return SVGX.splitTrack(); },
    d: "<p>The effect must switch on for its section and vanish afterwards. Cleanest way for a beginner:</p>" +
      act([
        "In the playlist, <strong>cut the section's vocal audio</strong> (<kbd>C</kbd> slices at the cursor) so the character section is its own clip",
        "<strong>Drag that clip to a different mixer track</strong> and build the character effect there",
        "The normal chain stays untouched on the main vocal track — the song flips between the two automatically",
        "Check the character section's <strong>volume</strong> against the normal voice — filtered voices read quieter; nudge the fader up"
      ]),
    opts: [{ t: "Done", cls: "good", next: "vchDone" }]
  });
  N("vchDone", {
    done: true, q: "One voice, many characters.",
    d: "<p>Used once or twice a song, a character voice is a production signature. Used everywhere, it's a gimmick — the contrast is the whole trick.</p>",
    goFlows: ["voicefx"]
  });

  /* ---- E: doubles & harmonies ---- */
  N("vdh1", {
    step: "Doubles · step 1 of 2", q: "The double — the sound of a pop chorus",
    v: function () { return SVGX.stackDiagram(); },
    d: "<p>Not an effect: a second performance. This is the biggest free upgrade in vocal production.</p>" +
      act([
        "Record the chorus line again, matching the first take as <strong>exactly</strong> as you can — phrasing, breaths, endings",
        "And once more — two doubles, three takes total",
        "In the Mixer: <strong>pan one double hard left, the other hard right</strong> (the pan knob at the top of each track)",
        "Pull both doubles down until they <strong>support</strong> the lead rather than compete — you feel them more than hear them",
        "Verses stay single-voice: the doubles <em>arriving</em> is the chorus lift"
      ]),
    opts: [{ t: "Doubled — next", cls: "primary", next: "vdh2" }]
  });
  N("vdh2", {
    step: "Doubles · step 2 of 2", q: "The harmony",
    v: function () { return SVGX.harmonyRoll(); },
    d: "<p>One harmony line, used sparingly, sounds like a band. The easiest one to find:</p>" +
      act([
        "Play your melody's notes on the keyboard, then play the same shape <strong>two letter-names higher in the key</strong> (melody on C → harmony on E) — that's \"a third up\"",
        "<strong>Sing along with those keyboard notes</strong> until the harmony sits in your voice, then record it",
        "Mix it clearly <strong>below the lead</strong> — the lead tells the story, the harmony colours it",
        "Chorus last line only is a classic place to start; everywhere is soup"
      ]),
    opts: [{ t: "Done", cls: "good", next: "vdhDone" }]
  });
  N("vdhDone", {
    done: true, q: "That's the thick-chorus secret.",
    d: "<p>Doubles panned wide, a third-harmony under the last line, all of it quieter than the lead. Costs nothing but takes — and it's most of the difference between a demo chorus and a record one.</p>",
    goFlows: ["voicefx", "record"]
  });

  /* ---- G: robot & synthetic voices (all stock Producer plugins) ---- */
  N("vrb1", {
    step: "Robot · level 1 of 3", q: "The rule first — then the hard-tuned shadow",
    d: "<p>The rule behind every robot voice on a record: <strong>the lead stays human; a COPY gets transformed</strong> and tucked underneath. You always sing it real first.</p><p>Level 1 is five minutes:</p>" +
      act([
        "In the Playlist, <kbd>Cmd</kbd>+drag the vocal clip to duplicate it, and route the copy to its <strong>own mixer track</strong>",
        "On that track, load your free tuner (Graillon / MAutoPitch — installed back in the Pitch card), set the song's <strong>KEY</strong>, and correction speed to <strong>maximum</strong>",
        "Pull the <strong>formant</strong> knob down slightly — that's what tips it from \"tuned\" into \"synthetic\"",
        "Sit it just under the lead in the chorus, or duplicate again and pan two copies hard L/R"
      ]),
    opts: [{ t: "Shadow made — level 2", cls: "primary", next: "vrb2" }]
  });
  N("vrb2", {
    step: "Robot · level 2 of 3", q: "The metallic ghost",
    v: function () { return SVGX.charFilter(); },
    d: "<p>A radio-transmission voice for answering the lead in the gaps — three stock effects in a row on another vocal copy:</p>" +
      act([
        "<strong>Parametric EQ 2</strong>: the telephone band — cut everything below 500 Hz and above 3 kHz (drawn below)",
        "<strong>Fruity Blood Overdrive</strong>, gently — fur and grit",
        "<strong>Fruity Flanger</strong> — the metallic swirl that says \"machine\"",
        "Use it on single answering words, not whole lines — a ghost that comments, not a second singer"
      ]),
    opts: [{ t: "Ghost made — the full robot", cls: "primary", next: "vrb3" }]
  });
  N("vrb3", {
    step: "Robot · level 3 of 3", q: "The full vocoder — you speak, the chord talks",
    v: function () { return SVGX.vocoderRoute(); },
    d: "<p><strong>Fruity Vocoder</strong> (included in your copy) pushes your words through a synth's tone. It's the trickiest routing in this whole app — follow exactly:</p>" +
      act([
        "Vocal clip → mixer track <strong>A</strong>. A <strong>3x Osc</strong> (or FLEX synth) playing your song's chords as long held notes → mixer track <strong>B</strong>",
        "In the Mixer: click track <strong>B</strong>, then <span class='path'>right-click track A's routing arrow → Sidechain to this track</span>",
        "Load <strong>Fruity Vocoder</strong> on track <strong>A</strong>, and set its <strong>carrier input to the sidechain</strong> — voice = modulator, synth = throat",
        "Play: the chord speaks your words. <strong>Silent?</strong> Swap which input is MOD and which is CAR — the #1 gotcha",
        "Mute the plain synth channel's own output if you hear it twice"
      ]),
    opts: [{ t: "It talks! — the choir trick", cls: "primary", next: "vrb4" }]
  });
  N("vrb4", {
    step: "Robot · the payoff", q: "The synthetic choir",
    v: function () { return SVGX.stackDiagram(); },
    d: "<p>Now combine everything into the modern futuristic-backing sound:</p>" +
      act([
        "Human lead on top — untouched",
        "Level 1 <strong>tuned shadow</strong> just underneath",
        "The <strong>vocoder pad</strong> singing the chorus hook, quiet and wide",
        "A <strong>whisper take</strong> over the top of the pad",
        "Everything except the lead sits LOW — you should feel the machine choir, not count its members"
      ]),
    opts: [{ t: "Done — that's the robot toolkit", cls: "good", next: "vrbDone" }]
  });
  N("vrbDone", {
    done: true, q: "Three robots, one human.",
    d: "<p>Hard-tuned shadow, metallic ghost, full vocoder choir — all built from your own voice, all with plugins already in your FL. The written version with the routing diagram lives in <a href='#voicefx' style='color:var(--accent-deep)'>Shaping your voice</a> under Advanced.</p>",
    goFlows: ["voicefx"]
  });

  /* ---- F: R&B vocals, three flavours ---- */
  N("rb0", {
    q: "Which R&B are we making?",
    v: function () { return SVGX.stackDiagram(); },
    d: "<p>All three are built on the polish chain plus the <strong>stack</strong> above — R&B is stacked-vocal music before it's anything else. The flavour comes from what you do on top.</p>",
    opts: [
      { t: "Silky classic R&B", s: "Warm, close, effortless — the smooth 90s/2000s lead", next: "rbs1" },
      { t: "Airy neo-soul", s: "Breathy, wide, floating — space and air around the voice", next: "rba1" },
      { t: "Dark trap-soul", s: "Tuned, moody, echoing — the modern late-night sound", next: "rbd1" }
    ]
  });

  N("rbs1", {
    step: "Silky · step 1 of 2", q: "The silk: closer and more even than pop",
    v: function () { return SVGX.compDiagram(); },
    d: "<p>The silky lead sounds effortless because the level is <em>immaculately</em> even and the tone is warm rather than bright.</p>" +
      act([
        "Build the polish chain first (EQ → compressor → reverb) — this lane changes its settings",
        "<strong>Compression harder:</strong> lower THRES until the meter shows <strong>5–6 dB</strong> on big lines — deeper than pop. The evenness IS the silk",
        "<strong>EQ warmer:</strong> skip the 10 kHz air shelf, and make the 3 kHz presence lift smaller — R&B silk is smooth, not shiny",
        "<strong>Reverb smaller:</strong> a short plate, WET ~12–15%, DECAY ~1.2 s. The voice stays close to the ear",
        "Sing closer to the mic than usual — that chest warmth is the genre"
      ]),
    opts: [{ t: "Silky — next", cls: "primary", next: "rbs2" }]
  });
  N("rbs2", {
    step: "Silky · step 2 of 2", q: "The stack does the rest",
    v: function () { return SVGX.stackDiagram(); },
    d: "<p>Classic R&B choruses are 5–8 voices deep, all singing precisely together.</p>" +
      act([
        "Record the chorus <strong>four more times</strong>: two unison doubles (pan hard L and R), a <strong>third-up harmony</strong>, and a <strong>fifth-up harmony</strong>",
        "Pull every stacked voice down until the lead clearly carries — the stack is a cushion, not a choir",
        "Runs and riffs stay on the <strong>lead only</strong> — the stack holds long simple notes underneath",
        "Verses drop back to lead + one quiet double at most. The stack arriving is the chorus"
      ]),
    opts: [{ t: "Stacked — done", cls: "good", next: "rbsDone" }]
  });
  N("rbsDone", {
    done: true, q: "That's the silk.",
    d: "<p>Deep compression, warm EQ, short plate, and a disciplined stack. Brandy and H.E.R. records live exactly here.</p>",
    goFlows: ["voicefx"]
  });

  N("rba1", {
    step: "Airy · step 1 of 2", q: "Air is breath, kept — not brightness added",
    v: function () { return SVGX.reverbWindow(); },
    d: "<p>Neo-soul air comes from <em>keeping</em> the human texture pop usually scrubs off.</p>" +
      act([
        "<strong>Compression lighter:</strong> only 2–3 dB — the natural rise and fall of the voice is the style",
        "<strong>Don't edit out the breaths.</strong> Those inhales between lines are the intimacy",
        "<strong>Reverb:</strong> a plate with <strong>PRE-DELAY up at 30–40 ms</strong> and WET ~20% — the voice floats in front of the space rather than inside it",
        "Add <strong>Fruity Chorus</strong>, subtle, after the reverb — a gentle shimmer-widening",
        "Sing softer than feels right, slightly behind the beat. Laid-back timing is half this genre"
      ]),
    opts: [{ t: "Floating — next", cls: "primary", next: "rba2" }]
  });
  N("rba2", {
    step: "Airy · step 2 of 2", q: "The whisper layer",
    v: function () { return SVGX.stackDiagram(); },
    d: "<p>The signature neo-soul move: a voice you feel on your ear rather than hear.</p>" +
      act([
        "Record the chorus line again, <strong>fully whispered</strong> — actually whisper it, close to the mic",
        "Lay it exactly under the sung lead, and pull it down until you only <em>sense</em> it",
        "Pan two soft sung doubles wide L/R as usual — but keep them gentler than the silky lane",
        "Harmonies here can be <strong>oohs and aahs</strong> instead of words — clouds, not text"
      ]),
    opts: [{ t: "Breathing — done", cls: "good", next: "rbaDone" }]
  });
  N("rbaDone", {
    done: true, q: "That's the air.",
    d: "<p>Light compression, kept breaths, floating plate, whisper layer. SZA and Erykah territory — intimacy as production.</p>",
    goFlows: ["voicefx"]
  });

  N("rbd1", {
    step: "Dark · step 1 of 2", q: "Tuned and dimmed",
    v: function () { return SVGX.pitcherWindow(); },
    d: "<p>The late-night sound: pitch-perfect, slightly unreal, sitting in shadow rather than light.</p>" +
      act([
        "A tuner set to your key, speed on the <strong>faster side of subtle</strong> — audibly tuned but not full robot. This gloss is the genre's signature. (Pitcher is Signature-only — on your Producer copy use <strong>Graillon 2 Free</strong> or <strong>MAutoPitch</strong>, both free; the Pop sheen path has the install steps)",
        "<strong>EQ darker:</strong> no air shelf at all; even tilt the top slightly down",
        "<strong>Reverb:</strong> a hall with <strong>long DECAY (2.5 s+) but LOW WET (~12%)</strong> — darkness behind the voice, not wash over it, with DAMPING turned up",
        "No Pitcher? Run the polish chain darker and lean on the next step's echoes — most of the mood survives"
      ]),
    opts: [{ t: "Moody — next", cls: "primary", next: "rbd2" }]
  });
  N("rbd2", {
    step: "Dark · step 2 of 2", q: "Echoes and ghosts",
    v: function () { return SVGX.delayTaps(); },
    d: "<p>Trap-soul space is made of delays and low ghosts more than reverb.</p>" +
      act([
        "<strong>Fruity Delay 3:</strong> tempo-synced <strong>1/8 or dotted-1/8</strong>, feedback low, mix low — a nervous, close echo",
        "<strong>Throw the last word</strong> of key lines: automate the delay mix up for just that word, let it ring into the gap",
        "Record an <strong>octave-down double</strong> of the hook line, very quiet under the lead — the shadow voice",
        "Ad-libs (yeah / ooh / echoes of the lyric) panned wide, drenched in the delay, in the gaps between phrases"
      ]),
    opts: [{ t: "In the shadows — done", cls: "good", next: "rbdDone" }]
  });
  N("rbdDone", {
    done: true, q: "That's the dark one.",
    d: "<p>Tuned gloss, no air, long-dark-low reverb, nervous echoes, shadow octave, wide ad-libs. The Weeknd and Brent Faiyaz build from exactly these parts.</p>",
    goFlows: ["voicefx"]
  });

  /* ============================================================
     FLOW: PROJECT ONE — one whole R&B song, start to finish
     ============================================================ */

  var PJ_CHORDS = [
    { bar: 0, notes: ["A3", "C4", "E4", "G4"], lab: "Am7" },
    { bar: 1, notes: ["F3", "A3", "C4", "E4"], lab: "Fmaj7" },
    { bar: 2, notes: ["C4", "E4", "G4", "B4"], lab: "Cmaj7" },
    { bar: 3, notes: ["G3", "B3", "D4", "E4"], lab: "Em7" }
  ];

  N("pj0", {
    q: "Project One: we're building a real song together",
    v: function () { return SVGX.projectMap(0); },
    d: "<p>Not a lesson about songs — an actual song, finished and exported, that you'll play off your phone tonight. Every decision is already made so you can just build:</p>" +
      "<ul><li><strong>Style:</strong> silky R&B slow jam — warm keys, soft drums, stacked vocals</li>" +
      "<li><strong>Tempo:</strong> 70 BPM &nbsp;·&nbsp; <strong>Key:</strong> A minor (every note we use is a white key)</li>" +
      "<li><strong>The four chords:</strong> Am7 → Fmaj7 → Cmaj7 → Em7, one bar each, looping forever. This loop IS the song</li>" +
      "<li><strong>Structure:</strong> intro · verse · chorus · verse · chorus · bridge · final chorus · outro</li></ul>" +
      "<p>The map above is the build order — the same eight stages every producer walks. About an hour if you don't rush, and you shouldn't.</p>" +
      act([
        "Open FL Studio → <span class='path'>File → New</span>",
        "<kbd>Cmd+S</kbd> immediately — name it <strong>Project One v1</strong>",
        "From here on: <kbd>Cmd+S</kbd> every time you make something you like"
      ]),
    opts: [{ t: "Let's build it", cls: "primary", next: "pj1" }]
  });

  /* ---- DRUMS ---- */
  N("pj1", {
    step: "Project One · step 1 of 17 — drums", q: "Tempo first: 70 BPM",
    v: function () { return SVGX.projectMap(0) + '<div style="margin-top:14px">' + SVGX.flToolbar("bpm") + "</div>"; },
    d: "<p>70 BPM is the slow-jam heartland — slow enough to feel expensive, quick enough to groove. Setting it first means every note you record from now on lands on a grid that's already right.</p>" +
      act([
        "Find the orange BPM number at the top (ringed below) — <strong>right-click → Type in value → 70</strong>",
        "Press <kbd>F6</kbd> — the Channel Rack opens with Kick, Clap, Hat, Snare channels ready",
        "Add a shaker: <span class='path'>Browser → Packs → Drums</span>, find a shaker, drag it onto the rack"
      ]),
    opts: [{ t: "70 on the clock — next", cls: "primary", next: "pj2" }]
  });
  N("pj2", {
    step: "Project One · step 2 of 17 — drums", q: "Click in the slow-jam pattern",
    v: function () {
      var chans = PATTERNS.rnb_slowjam.rows.map(function (r) { return { name: r.label, led: false, steps: r.steps }; });
      chans.push({ name: "Shaker", led: false, steps: [] });
      return '<div style="margin-bottom:14px">' + SVGX.flRack("steps", chans) + "</div>" + patternGridHTML("rnb_slowjam", false);
    },
    d: "<p>This is the half-time slow jam from the library — one snare per bar carrying everything. Copy the grid below into the rack, cell by cell:</p>" +
      act([
        "<strong>Kick</strong> row: left-click cells <strong>1</strong> and <strong>8</strong>",
        "<strong>Snare</strong> row: cell <strong>9</strong> only — that lone backbeat is the genre",
        "<strong>Hat</strong> row: every other cell — <strong>1, 3, 5, 7, 9, 11, 13, 15</strong>",
        "Press <kbd>Space</kbd> — it loops. Right-click any wrong cell to clear it",
        "Sounds wrong for the mood? <strong>Right-click a channel name → Replace</strong> and audition until it feels late-night"
      ]),
    opts: [{ t: "It's looping — next", cls: "primary", next: "pj3" }]
  });
  N("pj3", {
    step: "Project One · step 3 of 17 — drums", q: "Make it breathe: ghosts, velocity, swing",
    v: function () { return SVGX.rackHumanise(); },
    d: "<p>Right now it's a machine. Three moves make it a drummer:</p>" +
      act([
        "Add a <strong>ghost snare</strong> on cell <strong>15</strong>, then open the <strong>graph editor</strong> (button at the rack's top-right, ringed below), click the Snare channel, and drag cell 15's bar down to about <strong>25%</strong> — barely heard, strongly felt",
        "Still in the graph editor, click the <strong>Hat</strong> channel and drag <strong>alternate bars lower</strong> — tall, short, tall, short",
        "Find the <strong>SWING</strong> slider at the top of the rack and push it to about <strong>20%</strong> — listen to it start leaning back",
        "<kbd>Cmd+S</kbd>"
      ]),
    opts: [{ t: "It grooves — next", cls: "primary", next: "pj4" }]
  });
  N("pj4", {
    step: "Project One · step 4 of 17 — drums", q: "Three drum patterns: verse, chorus, fill",
    v: function () { return SVGX.chorusLift(); },
    d: "<p>One beat all the way through is the #1 beginner tell. You need a thinner verse, a fuller chorus, and a fill to announce the change — all clones of what you just made:</p>" +
      act([
        "Toolbar: <strong>right-click Pattern 1 → Clone</strong>, twice — you now have three copies",
        "<strong>Pattern 1 = verse:</strong> delete the hat row entirely; add the <strong>shaker on every other cell</strong> instead. Rename it (right-click → Rename) \"Drums — verse\"",
        "<strong>Pattern 2 = chorus:</strong> keep everything, add <strong>shaker on EVERY cell</strong>, and add a <strong>Crash channel</strong> (Browser → Packs) hitting <strong>cell 1</strong>. Rename \"Drums — chorus\"",
        "<strong>Pattern 3 = fill:</strong> like the verse, plus quiet snares on <strong>13-14-15-16</strong> (drag their velocities to ~40%). Rename \"Drums — fill\"",
        "Slow-jam rule: the chorus lifts <em>gently</em> — the vocal stack will do the real lifting later"
      ]),
    opts: [{ t: "Three patterns named — next", cls: "primary", next: "pj5" }]
  });

  /* ---- PIANO ---- */
  N("pj5", {
    step: "Project One · step 5 of 17 — piano", q: "The four chords — exact notes, all white keys",
    v: function () {
      return SVGX.projectMap(1) + '<div style="margin-top:14px">' +
        SVGX.flPianoRoll(null, PJ_CHORDS, "One bar each: Am7 — Fmaj7 — Cmaj7 — Em7. Loop it forever — this IS the song.") + "</div>";
    },
    d: "<p>These four chords are the entire harmony of Project One. Each is four white keys under one hand:</p>" +
      "<div class='tw'><table><thead><tr><th>Bar</th><th>Chord</th><th>Exact notes</th><th>Hand shape</th></tr></thead><tbody>" +
      "<tr><td>1</td><td><strong>Am7</strong></td><td class='num'>A3 · C4 · E4 · G4</td><td>start on the A below middle C</td></tr>" +
      "<tr><td>2</td><td><strong>Fmaj7</strong></td><td class='num'>F3 · A3 · C4 · E4</td><td>same shape, two keys down</td></tr>" +
      "<tr><td>3</td><td><strong>Cmaj7</strong></td><td class='num'>C4 · E4 · G4 · B4</td><td>starts ON middle C</td></tr>" +
      "<tr><td>4</td><td><strong>Em7</strong></td><td class='num'>G3 · B3 · D4 · E4</td><td>a cosy E-minor voicing</td></tr>" +
      "</tbody></table></div>" +
      act([
        "Channel Rack → <strong>+</strong> → <strong>FLEX</strong> → search <strong>keys</strong> or <strong>piano</strong> — pick something warm and felt-like (single-click auditions, double-click loads)",
        "New pattern (toolbar <strong>+</strong>), rename it \"Keys\"",
        "Press <kbd>F7</kbd> for the Piano roll and <strong>draw</strong> the blocks exactly as below — each chord fills its whole bar",
        "Or <strong>play</strong> them: record with the metronome, one chord per bar. Wrong notes drag into place afterwards",
        "<kbd>Space</kbd> with the chorus drums playing — this is the moment it starts sounding like a record"
      ]),
    opts: [{ t: "Four chords in — next", cls: "primary", next: "pj6" }]
  });
  N("pj6", {
    step: "Project One · step 6 of 17 — piano", q: "Humanise the keys",
    v: function () { return SVGX.flPianoRoll("vel"); },
    d: "<p>A real pianist never plays four notes at identical volume or at the exact same instant:</p>" +
      act([
        "In the Piano roll, look at the <strong>velocity lane</strong> at the bottom — drag the bars so they vary between roughly <strong>70 and 100</strong>, top notes slightly louder than bottom ones",
        "If you played them in and the timing is loose: <kbd>Alt+Q</kbd> (quantize) and set strength around <strong>50%</strong> — tightened, not robotic",
        "Drag each chord's <strong>right edge</strong> a touch past the bar line so the chords melt into each other",
        "<kbd>Cmd+S</kbd>"
      ]),
    opts: [{ t: "It sounds human — next", cls: "primary", next: "pj7" }]
  });

  /* ---- BASS ---- */
  N("pj7", {
    step: "Project One · step 7 of 17 — bass", q: "The 808 plays the roots, with the kick",
    v: function () { return SVGX.projectMap(2) + '<div style="margin-top:14px">' + SVGX.interlock() + "</div>"; },
    d: "<p>The bass line is already decided — it's the bottom note of each chord: <strong>A, F, C, E</strong>. One long note per bar, landing exactly with the kick.</p>" +
      act([
        "Channel Rack → <strong>+</strong> → <strong>FLEX</strong> → search <strong>808</strong> — pick a smooth one, not a distorted one",
        "In the \"Keys\" pattern (or its own \"Bass\" pattern — cleaner), press <kbd>F7</kbd> on the 808 channel",
        "Draw: bar 1 = <strong>A1</strong>, bar 2 = <strong>F1</strong>, bar 3 = <strong>C2</strong>, bar 4 = <strong>E1</strong> — down in the bass zone, ONE note at a time",
        "Start each note exactly on <strong>step 1</strong> (with the kick) and end it around step <strong>13</strong> — if the low end turns muddy, shorten the notes further",
        "Loop everything together. Kick and 808 should feel like one instrument"
      ]),
    opts: [{ t: "The floor moves — next", cls: "primary", next: "pj8" }]
  });

  /* ---- GUITAR ---- */
  N("pj8", {
    step: "Project One · step 8 of 17 — guitar", q: "Two guitar parts, both tiny on purpose",
    v: function () { return SVGX.projectMap(3) + '<div style="margin-top:14px">' + patternGridHTML("gtr_arp", false) + patternGridHTML("gtr_chop", false) + "</div>"; },
    d: "<p>R&B guitar is seasoning, not a meal — small clean phrases that answer the keys. Two parts, used in different sections later:</p>" +
      act([
        "Channel Rack → <strong>+</strong> → <strong>FLEX</strong> → <strong>Guitar</strong> category — pick a <strong>clean electric</strong> (nothing distorted)",
        "<strong>Part 1 — the arpeggio</strong> (for verse 2): new pattern \"Gtr arp\". Pick each chord's notes one at a time, low → middle → high → middle, following the top grid below. Same four chords, same bars",
        "<strong>Part 2 — the chops</strong> (for choruses): new pattern \"Gtr chops\". The whole chord, very short, on the off-beats — cells <strong>3, 7, 11, 15</strong>, released immediately. The gap is the groove",
        "Turn the guitar channel's volume knob DOWN until it tucks under the piano — you should miss it when it's gone, barely notice it when it's there"
      ]),
    opts: [{ t: "Seasoned — next", cls: "primary", next: "pj9" }]
  });

  /* ---- EXTRAS ---- */
  N("pj9", {
    step: "Project One · step 9 of 17 — extras", q: "Colour: a pad, and one sparkle",
    v: function () { return SVGX.projectMap(4) + '<div style="margin-top:14px">' + SVGX.vocalSpace() + "</div>"; },
    d: "<p>Two more layers finish the bed — both live at the edges of the picture so the middle stays clear for your voice:</p>" +
      act([
        "<strong>The pad:</strong> FLEX → <strong>Pads</strong> → something warm. New pattern \"Pad\": the same four chords as long, held whole-bar notes. Volume LOW — it's felt, not heard. Choruses only",
        "<strong>The sparkle:</strong> FLEX → search <strong>music box</strong> or <strong>bell</strong>. New pattern \"Sparkle\": a tiny 3-note answer — try <strong>E5 · C5 · A4</strong> — placed in bar 4 only, in the gap where a vocal line will end",
        "Play everything together and mute/unmute layers with each channel's <strong>green light</strong>. Every layer should earn its place — if you can't hear what one adds, it goes",
        "<kbd>Cmd+S</kbd> — the bed is finished"
      ]),
    opts: [{ t: "Bed finished — arrange it", cls: "primary", next: "pj10" }]
  });

  /* ---- ARRANGE ---- */
  N("pj10", {
    step: "Project One · step 10 of 17 — arrange", q: "Paint the song onto the Playlist",
    v: function () { return SVGX.projectMap(5) + '<div style="margin-top:14px">' + SVGX.flPlaylist() + '<div style="margin-top:14px">' + SVGX.songArc() + "</div></div>"; },
    d: "<p>Press <kbd>F5</kbd> — the Playlist is the song's timeline. Paint your patterns onto it following this plan (every count is in bars):</p>" +
      "<div class='tw'><table><thead><tr><th>Section</th><th>Bars</th><th>What plays</th></tr></thead><tbody>" +
      "<tr><td><strong>Intro</strong></td><td class='num'>4</td><td>Keys alone (+ Sparkle in bar 4)</td></tr>" +
      "<tr><td><strong>Verse 1</strong></td><td class='num'>16</td><td>Drums — verse · Keys · Bass</td></tr>" +
      "<tr><td><strong>Chorus</strong></td><td class='num'>16</td><td>Drums — chorus · Keys · Bass · Gtr chops · Pad</td></tr>" +
      "<tr><td><strong>Verse 2</strong></td><td class='num'>16</td><td>Verse layers <em>+ Gtr arp</em></td></tr>" +
      "<tr><td><strong>Chorus</strong></td><td class='num'>16</td><td>Same as chorus 1</td></tr>" +
      "<tr><td><strong>Bridge</strong></td><td class='num'>8</td><td>Keys only (space for the voice to shine)</td></tr>" +
      "<tr><td><strong>Final chorus</strong></td><td class='num'>16</td><td>Everything at once (+ Sparkle)</td></tr>" +
      "<tr><td><strong>Outro</strong></td><td class='num'>4</td><td>Keys — let the last Am7 ring out</td></tr>" +
      "</tbody></table></div>" +
      act([
        "Make sure the toolbar says <strong>SONG</strong>, not PAT, or you'll only ever hear one pattern",
        "Left-click paints a pattern block; right-click erases; drag a block's right edge to repeat it",
        "Paint the whole table, then press <kbd>Space</kbd> from the top and just listen"
      ]),
    opts: [{ t: "The song exists — next", cls: "primary", next: "pj11" }]
  });
  N("pj11", {
    step: "Project One · step 11 of 17 — arrange", q: "The three transition moments",
    v: function () { return patternGridHTML("fill_bar", false); },
    d: "<p>Sections that just butt together sound like a playlist; transitions make them one song. Three edits:</p>" +
      act([
        "Swap the <strong>last bar of each verse</strong> for the \"Drums — fill\" pattern",
        "Check the <strong>crash</strong> lands on bar 1 of every chorus (it's inside Drums — chorus already)",
        "The showstopper: <strong>delete every block in the last half-bar before the final chorus</strong> — one beat of total silence, then everything lands at once. Free goosebumps",
        "<kbd>Cmd+S</kbd>"
      ]),
    opts: [{ t: "It flows — time for the voice", cls: "primary", next: "pj12" }]
  });

  /* ---- VOICE ---- */
  N("pj12", {
    step: "Project One · step 12 of 17 — voice", q: "Record the lead vocal",
    v: function () { return SVGX.projectMap(6) + '<div style="margin-top:14px">' + SVGX.flMixer("input") + "</div>"; },
    d: "<p>Write or hum your melody over the loop first — the four chords will pull you somewhere good. Then the take:</p>" +
      act([
        "Mic checks: <strong>48V on</strong>, gain ring <strong>green</strong> on your loudest line, <strong>DIRECT MONITOR on</strong>",
        "Mixer (<kbd>F9</kbd>): vocal track → input <strong>Solo Input 1</strong>, <strong>arm</strong> the red dot",
        "Record the <strong>chorus first</strong> — three takes, keep the best",
        "Then verses, then the bridge. Stand a fixed hand's width from the mic for all of it",
        "Full detail lives in the <strong>Record my voice</strong> walk if anything fights you"
      ]),
    opts: [{ t: "Lead vocal down — next", cls: "primary", next: "pj13" }]
  });
  N("pj13", {
    step: "Project One · step 13 of 17 — voice", q: "The stack — this is what makes it R&B",
    v: function () { return SVGX.stackDiagram(); },
    d: "<p>Pop doubles a chorus; R&B builds architecture out of voices. For each chorus:</p>" +
      act([
        "Record the chorus line <strong>twice more</strong>, matching the lead as exactly as you can — drag one clip's pan hard <strong>left</strong>, the other hard <strong>right</strong>, both quieter than the lead",
        "Record a <strong>harmony a third up</strong> — every note two white keys higher. Sing it against the keys if it helps",
        "Optional: a <strong>fifth up</strong> on the last chorus only",
        "The silk move: one take <strong>fully whispered</strong>, laid exactly under the lead, so quiet you only sense it",
        "Verses: lead + ONE quiet double. The stack ARRIVING is the chorus lift"
      ]),
    opts: [{ t: "Stacked — next", cls: "primary", next: "pj14" }]
  });
  N("pj14", {
    step: "Project One · step 14 of 17 — voice", q: "Ad-libs in the gaps",
    d: "<p>Listen for the holes between vocal phrases — end of a line, the bar before a chorus, the silence you built before the final chorus. Those belong to ad-libs:</p>" +
      act([
        "Record a pass of <strong>yeah / mmm / oh</strong> and echoes of your own last words, reacting to the song like a listener",
        "Keep the <strong>three best moments</strong>, delete the rest — restraint reads as expensive",
        "Pan them wide (one left, one right), volume low",
        "Bridge + final chorus get the most; verse 1 gets none"
      ]),
    opts: [{ t: "Ad-libs placed — next", cls: "primary", next: "pj15" }]
  });
  N("pj15", {
    step: "Project One · step 15 of 17 — voice", q: "The silky chain on the lead",
    v: function () { return SVGX.mixerVocal(); },
    d: "<p>The silky-classic settings, on the lead vocal's mixer track, top to bottom:</p>" +
      act([
        "Slot 1 — <strong>Parametric EQ 2</strong>: cut below 90 Hz, small dip at 250 Hz, gentle 3 kHz lift. <strong>No air shelf</strong> — silk is smooth, not shiny",
        "Slot 2 — <strong>Fruity Limiter (COMP)</strong>: lower THRES until the loudest chorus line dips <strong>5–6 dB</strong> — deeper than pop; the evenness IS the silk",
        "Slot 3 — <strong>Fruity Reeverb 2</strong>: short plate, <strong>WET 12–15%</strong>, DECAY ~1.2 s — close and warm, not spacious",
        "Stacked voices and ad-libs: same chain, or simply route them to the lead's track. The whisper layer takes NO reverb",
        "The full silky walkthrough lives in <strong>Shape my voice → R&B → Silky</strong> if you want it knob by knob"
      ]),
    opts: [{ t: "It's silk — finish the song", cls: "primary", next: "pj16" }]
  });

  /* ---- SHIP ---- */
  N("pj16", {
    step: "Project One · step 16 of 17 — ship", q: "The balance pass",
    v: function () { return SVGX.projectMap(7) + '<div style="margin-top:14px">' + SVGX.flMixer("vocal") + "</div>"; },
    d: "<p>Loop the final chorus — the busiest 16 bars — and balance with ears only:</p>" +
      act([
        "<kbd>F9</kbd>: push the <strong>lead vocal fader</strong> up until the voice clearly rides on top",
        "Anything fighting it comes <strong>down</strong> — usually the pad and the guitar first",
        "<strong>Master meter never touches red.</strong> If it does, drag all faders down together and re-balance",
        "Play it on your <strong>phone speaker</strong>: if the voice and the groove both survive, the balance is right"
      ]),
    opts: [{ t: "Voice on top — next", cls: "primary", next: "pj17" }]
  });
  N("pj17", {
    step: "Project One · step 17 of 17 — ship", q: "Save it. Export it. Play it.",
    d: act([
        "<kbd>Cmd+S</kbd> — Project One v1, saved",
        "<span class='path'>File → Export → WAV file…</span> (<kbd>Cmd+R</kbd>) → name it → <strong>Start</strong>",
        "AirDrop the WAV to your phone",
        "Tonight: play it in the place you normally listen to music, full attention, no editing allowed. Just listen to a song YOU built"
      ]) +
      "<p>Write down the one thing that bothers you most — that's the first job of Project Two.</p>",
    opts: [{ t: "Exported — quick quiz", cls: "primary", next: "pjq1" }]
  });

  /* ---- quiz ---- */
  N("pjq1", {
    step: "Project One · check 1 of 3", q: "Why did the drums come first?",
    opts: [
      { t: "They set the tempo and groove everything else lands on", next: "pjq1y" },
      { t: "Drums are the most important instrument", next: "pjq1n" },
      { t: "They're the easiest, so you warm up on them", next: "pjq1n" }
    ]
  });
  N("pjq1y", { q: "Right.", d: "<p>The drums are the skeleton — every later part (bass on the kick, chops between the hats, vocals in the pockets) was placed <em>relative to them</em>. Build the skeleton first and everything after it has somewhere to stand.</p>", opts: [{ t: "Next question", cls: "primary", next: "pjq2" }] });
  N("pjq1n", { q: "Not this one.", d: "<p>They came first because they're the <strong>skeleton</strong> — the tempo and groove that every other part was placed against. The bass locked to the kick, the chops filled the hat gaps, the vocal sat in the pockets. No skeleton, nowhere to stand.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "pjq1" }] });
  N("pjq2", {
    step: "Project One · check 2 of 3", q: "In this slow jam, the chorus lift came mostly from…",
    opts: [
      { t: "The vocal stack arriving, plus gentle additions", next: "pjq2y" },
      { t: "The tempo jumping up", next: "pjq2n" },
      { t: "Doubling the hi-hats like a pop song", next: "pjq2n" }
    ]
  });
  N("pjq2y", { q: "Exactly.", d: "<p>At 70 BPM a full pop lift tramples the mood — so the chorus got <em>fuller</em>, not faster: doubles, harmonies, the whisper, the pad, the crash. In slow R&B the voices are the fireworks.</p>", opts: [{ t: "Last question", cls: "primary", next: "pjq3" }] });
  N("pjq2n", { q: "Not this one.", d: "<p>The tempo never moved and the hats stayed gentle. The lift was the <strong>vocal stack arriving</strong> — doubles, harmonies, whisper — plus pad and crash. Slow R&B choruses get fuller, not faster.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "pjq2" }] });
  N("pjq3", {
    step: "Project One · check 3 of 3", q: "Before exporting, the one non-negotiable check was…",
    opts: [
      { t: "Vocal clearly on top, master never in the red", next: "pjq3y" },
      { t: "Every fader as loud as possible", next: "pjq3n" },
      { t: "Adding one more layer to be safe", next: "pjq3n" }
    ]
  });
  N("pjq3y", { q: "Right.", d: "<p>Balance is the difference between \"beginner track\" and \"record\". Voice on top, master out of the red, and the phone-speaker test as the tie-breaker.</p>", opts: [{ t: "Finish Project One", cls: "good", next: "pjDone" }] });
  N("pjq3n", { q: "Not this one.", d: "<p><strong>Voice on top, master never red</strong> — a red master distorts the export, and a buried vocal wastes everything you stacked. More layers is the opposite of the fix.</p>", opts: [{ t: "Back to the question", cls: "primary", next: "pjq3" }] });
  N("pjDone", {
    done: true, q: "Project One: shipped.",
    d: "<p>Drums you programmed, chords you voiced, a bass line locked to your kick, guitar seasoning, a bed with space in the middle — and your own stacked voice on top, balanced and exported. That's not an exercise. That's a record.</p>" +
      "<p><strong>Project Two is yours:</strong> same eight stages, your key (find it in <a href='#keys' style='color:var(--accent-deep)'>Keys &amp; chords</a>), your tempo, your words. Change one thing at a time and the process will hold you the whole way.</p>",
    goFlows: ["song", "voicefx"]
  });

  /* ============================================================
     FLOW registry
     ============================================================ */

  var FLOWS = {
    setup:   { name: "Set everything up", start: "su1", steps: ["su1", "su2", "su3", "su4", "su5", "su6", "su7", "su8", "su9", "su10"] },
    beat:    { name: "Make me a beat", start: "b0" },
    song:    { name: "Build a song", start: "so0" },
    project1: { name: "Project One — an R&B song, start to finish", start: "pj0",
      steps: ["pj0", "pj1", "pj2", "pj3", "pj4", "pj5", "pj6", "pj7", "pj8", "pj9", "pj10", "pj11", "pj12", "pj13", "pj14", "pj15", "pj16", "pj17", "pjq1", "pjq2", "pjq3"] },
    songB:   { name: "Build a song — Beginner", start: "b_1", steps: ["b_1", "b_2", "b_3", "b_4", "b_5", "b_6", "bMix", "bExp", "bq1", "bq2", "bq3"] },
    songI:   { name: "Build a song — Intermediate", start: "i_1", steps: ["i_1", "i_2", "i_3", "i_4", "i_5", "i_6", "i_7", "iMix", "iExp", "iq1", "iq2", "iq3"] },
    songA:   { name: "Build a song — Advanced", start: "a_1", steps: ["a_1", "a_2", "a_3", "a_4", "a_5", "a_6", "a_7", "a_8", "aq1", "aq2", "aq3"] },
    record:  { name: "Record my voice", start: "r1", steps: ["r1", "r2", "r3", "r4", "r5", "r6"] },
    piano:   { name: "Play piano sounds (MIDI)", start: "p_1", steps: ["p_1", "p_2", "p_3", "p_4", "p_5"] },
    voicefx: { name: "Shape my voice", start: "v0", steps: ["vs1", "vs2", "vs3", "vs4", "vs5", "vfq1", "vfq2", "vfq3"] },
    nosound: { name: "I can't hear anything", start: "ns0" },
    kbd:     { name: "Keyboard isn't working", start: "k1" },
    mic:     { name: "Mic problems", start: "m0" },
    glitch:  { name: "Crackles or delay", start: "g0" }
  };

  /* ============================================================
     Engine
     ============================================================ */

  var wiz = $("wiz"), wizBody = $("wizBody"), wizFlowEl = $("wizFlow");
  var curFlow = null, curFlowId = null, history = [];

  function openFlow(flowId) {
    curFlow = FLOWS[flowId];
    if (!curFlow) return;
    curFlowId = flowId;
    history = [];
    wizFlowEl.textContent = curFlow.name;
    wiz.hidden = false;
    document.body.style.overflow = "hidden";
    showNode(curFlow.start, false);
  }
  function closeWiz() {
    wiz.hidden = true;
    document.body.style.overflow = "";
    curFlow = null;
  }
  function back() {
    if (history.length > 1) {
      history.pop();
      showNode(history[history.length - 1], true);
    }
  }

  function showNode(id, isBack) {
    var node = NODES[id];
    if (!node) return;
    if (/q\d+y$/.test(id)) store("ss-quiz-" + id.slice(0, -1), "1");
    if (node.done && curFlowId) { store("ss-done-" + curFlowId, "1"); updateHubProgress(); }
    if (!isBack) history.push(id);
    $("wizBack").disabled = history.length <= 1;

    var h = "";

    // progress dots for linear flows
    if (curFlow && curFlow.steps) {
      var idx = curFlow.steps.indexOf(id);
      if (idx > -1) {
        h += '<div class="wiz-progress">';
        curFlow.steps.forEach(function (s, i) {
          h += '<span class="wiz-dot' + (i < idx ? " done" : i === idx ? " now" : "") + '"></span>';
        });
        h += "</div>";
      }
    }

    if (node.step) h += '<div class="wiz-stepnum">' + node.step + "</div>";

    if (node.done) {
      h += '<div class="wiz-done"><h3>' + node.q + "</h3>" + (node.d || "") + "</div>";
    } else {
      h += '<h2 class="wiz-q">' + node.q + "</h2>";
      if (node.d) h += '<div class="wiz-d">' + node.d + "</div>";
      if (/q\d+$/.test(id) && read("ss-quiz-" + id) === "1") h += '<p class="wiz-aced">✓ You got this one right last time.</p>';
    }

    if (node.v) {
      h += '<div class="wiz-visual">' + node.v() + (node.caption ? '<p class="wiz-caption">' + node.caption + "</p>" : "") + "</div>";
    }

    if (node.opts) {
      h += '<div class="wiz-opts">';
      node.opts.forEach(function (o, i) {
        var attr = o.flow ? 'data-oflow="' + o.flow + '"' : 'data-next="' + o.next + '"';
        h += '<button class="wiz-opt ' + (o.cls || "") + '" ' + attr + ">" + o.t +
             (o.s ? '<span class="wo-sub">' + o.s + "</span>" : "") + "</button>";
      });
      h += "</div>";
    }

    if (node.done) {
      h += '<div class="wiz-opts">';
      if (node.goFlows) {
        node.goFlows.forEach(function (f) {
          if (FLOWS[f]) h += '<button class="wiz-opt primary" data-flow="' + f + '">' + FLOWS[f].name + " →</button>";
        });
      }
      h += '<button class="wiz-opt" data-close="1">Back to all help</button>';
      h += "</div>";
    }

    wizBody.innerHTML = h;
    wiz.scrollTop = 0;

    // wire options
    Array.prototype.forEach.call(wizBody.querySelectorAll("[data-next]"), function (b) {
      b.addEventListener("click", function () { showNode(b.getAttribute("data-next"), false); });
    });
    Array.prototype.forEach.call(wizBody.querySelectorAll("[data-oflow]"), function (b) {
      b.addEventListener("click", function () { openFlow(b.getAttribute("data-oflow")); });
    });
    Array.prototype.forEach.call(wizBody.querySelectorAll("[data-flow]"), function (b) {
      b.addEventListener("click", function () { openFlow(b.getAttribute("data-flow")); });
    });
    Array.prototype.forEach.call(wizBody.querySelectorAll("[data-close]"), function (b) {
      b.addEventListener("click", closeWiz);
    });
    // reference links inside the wizard close it first so the section is visible
    Array.prototype.forEach.call(wizBody.querySelectorAll('a[href^="#"]'), function (a) {
      a.addEventListener("click", function () { closeWiz(); });
    });
  }

  $("wizClose").addEventListener("click", closeWiz);
  $("wizBack").addEventListener("click", back);

  // exposed for automated graph auditing (no runtime behaviour depends on this)
  window.SS = { NODES: NODES, FLOWS: FLOWS, openFlow: openFlow };

  Array.prototype.forEach.call(document.querySelectorAll(".flowcard, .rm-step[data-flow]"), function (c) {
    c.addEventListener("click", function () { openFlow(c.getAttribute("data-flow")); });
  });

  /* ---- progress memory: badge completed walks on the hub ---- */
  var GUIDED = ["setup", "beat", "song", "project1", "record", "piano", "voicefx"];
  function flowDone(f) {
    if (f === "song") return ["songB", "songI", "songA"].some(function (x) { return read("ss-done-" + x) === "1"; });
    return read("ss-done-" + f) === "1";
  }
  function updateHubProgress() {
    Array.prototype.forEach.call(document.querySelectorAll(".flowcard"), function (c) {
      var f = c.getAttribute("data-flow");
      var d = flowDone(f);
      c.classList.toggle("done-flow", d);
      if (d && !c.querySelector(".fc-done")) {
        var s = document.createElement("span");
        s.className = "fc-done";
        s.textContent = "✓ done";
        c.appendChild(s);
      }
    });
    var levels = ["songB", "songI", "songA"].filter(function (x) { return read("ss-done-" + x) === "1"; }).length;
    var songCard = document.querySelector('.flowcard[data-flow="song"] .fc-done');
    if (songCard && levels) songCard.textContent = "✓ " + levels + " of 3 levels";
    var n = GUIDED.filter(flowDone).length;
    var el = document.getElementById("hubprog");
    if (el) el.textContent = n === 0 ? "" : (n === GUIDED.length ? "All " + GUIDED.length + " guided walks finished — you know this rig now." : "You\u2019ve finished " + n + " of " + GUIDED.length + " guided walks \u2713");
  }
  updateHubProgress();

  /* ============================================================
     Page behaviour (theme, drawer, checklist, search, nav)
     ============================================================ */

  var root = document.documentElement;
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  var saved = read("ss-theme");
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  $("theme").addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = current ? current === "dark" : systemDark;
    var next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store("ss-theme", next);
  });

  var rail = $("rail"), scrim = $("scrim"), burger = $("burger");
  function setDrawer(open) {
    rail.classList.toggle("open", open);
    scrim.classList.toggle("on", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  }
  burger.addEventListener("click", function () { setDrawer(!rail.classList.contains("open")); });
  scrim.addEventListener("click", function () { setDrawer(false); });
  rail.addEventListener("click", function (e) { if (e.target.closest(".nav-link")) setDrawer(false); });

  var boxes = document.querySelectorAll("#checklist input[type=checkbox]");
  Array.prototype.forEach.call(boxes, function (b) {
    if (read("ss-" + b.dataset.ck) === "1") b.checked = true;
    b.addEventListener("change", function () { store("ss-" + b.dataset.ck, b.checked ? "1" : "0"); });
  });
  $("resetck").addEventListener("click", function () {
    Array.prototype.forEach.call(boxes, function (b) { b.checked = false; store("ss-" + b.dataset.ck, "0"); });
  });

  /* ---------- build visuals + patterns BEFORE search caches text ---------- */

  SVGX.injectAll();
  buildPatternLibrary();

  /* ---------- search ---------- */

  var q = $("q"), info = $("searchinfo"), noresults = $("noresults"), hero = $("hero");
  var hub = document.getElementById("help");
  var sections = Array.prototype.slice.call(document.querySelectorAll("section")).filter(function (s) { return s.id !== "help"; });
  var cards = Array.prototype.slice.call(document.querySelectorAll("section .card, section .fallback")).filter(function (c) { return !hub.contains(c); });

  cards.forEach(function (c) {
    c._html = c.innerHTML;
    c._text = (c.textContent || "").toLowerCase();
  });

  function escapeRx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  /* Natural-language tolerant search:
     - stopwords stripped, so "i want to make a drum beat" → [drum, beat]
     - plural-tolerant (trailing s dropped)
     - cards matching ALL keywords shown; if none, cards matching ANY
     - an intent layer recognises what she's trying to DO and offers
       the matching guided walk above the results */

  var STOP = {};
  ("i me my we you your it its a an the this that these those and or but if then than so too very just really please help need want wanting wants like would could should can cant can't cannot do does did doing how what when where which who why is are was were be been being am not no with without for from into onto of on in at by as to make making made get getting got set setting up out off some any thing things stuff way ways sound sounds sounding studio fl").split(" ").forEach(function (w) { STOP[w] = 1; });

  function tokenize(term) {
    return term.toLowerCase().split(/[^a-z0-9#♯&+]+/)
      .filter(function (w) { return w.length > 1 && !STOP[w]; })
      .map(function (w) { return w.length > 3 && w.slice(-1) === "s" ? w.slice(0, -1) : w; })
      .filter(function (w, i, arr) { return arr.indexOf(w) === i; });
  }

  var FLOW_HINTS = [
    { flow: "voicefx", rx: /\b(robot\w*|vocoder|vocode\w*|synthetic|daft\s*punk)\b/ },
    { flow: "piano", rx: /\b(spaceship|sound\s*design\w*|synth\w*|3x\s*osc|3xosc|oscillat\w*|macro\w*|plugin\w*|flex|envelope|attack|patch)\b/ },
    { flow: "setup", rx: /\b(aggregate|multi-?output|second\s*(pair|person|listener)|listen\s*together|two\s*headphones|share\s*the\s*sound)\b/ },
    { flow: "project1", rx: /\b(project\s*(one|1)|walk\s*-?through|example\s*song|whole\s*song|complete\s*song|start\s*to\s*finish|build\s*along)\b/ },
    { flow: "beat",    rx: /\b(beat|drum|drums|hat|hats|snare|kick|808|trap|drill|groove|rhythm|percussion|fill|fills|shaker|rim|ghost|crash|cymbal\w*|tom|toms|clap|slow\W*jam\w*|quiet\W*storm)\b/ },
    { flow: "record",  rx: /\b(record|recording|vocal|vocals|sing|singing|voice|take|takes)\b/ },
    { flow: "song",    rx: /\b(song|songs|chord|chords|write|writing|tempo|arrange|arranging|melody|bass|beginner|intermediate|advanced|level|speed|faster|slower|build|master\w*|limiter|export|finish\w*)\b/ },
    { flow: "setup",   rx: /\b(setup|set up|connect|connecting|plug|plugged|install|start|first time)\b/ },
    { flow: "nosound", rx: /\b(no sound|nothing|silent|silence|hear (nothing|anything)|can'?t hear|mute[d]?)\b/ },
    { flow: "kbd",     rx: /\b(keyboard (not|isn|dead|broken)|not working|no midi)\b/ },
    { flow: "piano",   rx: /\b(piano|keys?|keyboard|midi|instrument|preset|sound|flex|notes?|draw|velocity|quantis|quantiz)\b/ },
    { flow: "mic",     rx: /\b(mic|microphone|echo|twice|doubled|distort\w*|quiet|hiss\w*)\b/ },
    { flow: "voicefx", rx: /\b(reverb|hall|room|plate|delay|echo\w*|effects?|autotune|auto-tune|tune[ds]?|tuning|pitch\w*|harmon\w*|doubl\w*|polish\w*|compress\w*|eq|frequenc\w*|chain|edition|producer|telephone|robot|vocoder|shimmer|voice|vocal\w*|r&b|rnb|neo-?soul|soul|ad-?libs?|stacks?|whisper|breathy|silky|trap-?soul)\b/ },
    { flow: "glitch",  rx: /\b(crackl\w*|pop(s|ping)?|stutter\w*|delay|lag\w*|latency|glitch\w*)\b/ }
  ];

  function flowSuggestions(rawLower) {
    var out = [];
    FLOW_HINTS.forEach(function (h) {
      if (out.length < 2 && h.rx.test(rawLower) && out.indexOf(h.flow) === -1) out.push(h.flow);
    });
    return out;
  }

  function highlightTokens(el, tokens) {
    var rx = new RegExp("(" + tokens.map(escapeRx).join("|") + ")", "gi");
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      if (!n.nodeValue || !rx.test(n.nodeValue)) return;
      if (n.parentNode && n.parentNode.namespaceURI && n.parentNode.namespaceURI.indexOf("svg") > -1) return;
      rx.lastIndex = 0;
      var span = document.createElement("span");
      span.innerHTML = n.nodeValue.replace(rx, "<mark>$1</mark>");
      n.parentNode.replaceChild(span, n);
    });
  }

  var flows = $("searchflows");

  function clearSearch() {
    cards.forEach(function (c) { c.innerHTML = c._html; c.classList.remove("hidden"); });
    sections.forEach(function (s) { s.classList.remove("hidden"); });
    info.classList.remove("on");
    flows.classList.remove("on");
    flows.innerHTML = "";
    noresults.classList.remove("on");
    hero.classList.remove("hidden");
    hub.classList.remove("hidden");
  }

  function runSearch(term) {
    term = term.trim();
    if (term.length < 2) { clearSearch(); return; }
    var rawLower = term.toLowerCase();
    var tokens = tokenize(term);
    if (!tokens.length) tokens = [rawLower];

    // score every card
    var scored = cards.map(function (c) {
      var score = 0;
      tokens.forEach(function (tok) { if (c._text.indexOf(tok) > -1) score++; });
      return score;
    });
    var full = scored.filter(function (s) { return s === tokens.length; }).length;
    var needed = full > 0 ? tokens.length : 1;
    var partial = full === 0 && scored.some(function (s) { return s > 0; });

    var hits = 0;
    cards.forEach(function (c, i) {
      c.innerHTML = c._html;
      if (scored[i] >= needed) {
        c.classList.remove("hidden");
        highlightTokens(c, tokens);
        hits++;
      } else {
        c.classList.add("hidden");
      }
    });
    sections.forEach(function (s) {
      var visible = s.querySelectorAll(".card:not(.hidden), .fallback:not(.hidden)").length;
      s.classList.toggle("hidden", visible === 0);
    });
    hero.classList.add("hidden");
    hub.classList.add("hidden");

    // guided-walk suggestions
    var sugg = flowSuggestions(rawLower);
    if (sugg.length) {
      var fh = '<span class="sf-lead">Sounds like a job for:</span>';
      sugg.forEach(function (f) {
        fh += '<button class="suggest" data-sflow="' + f + '">' + FLOWS[f].name + " →</button>";
      });
      flows.innerHTML = fh;
      flows.classList.add("on");
      Array.prototype.forEach.call(flows.querySelectorAll("[data-sflow]"), function (b) {
        b.addEventListener("click", function () { openFlow(b.getAttribute("data-sflow")); });
      });
    } else {
      flows.classList.remove("on");
      flows.innerHTML = "";
    }

    info.classList.add("on");
    var termSafe = term.replace(/</g, "&lt;");
    info.innerHTML = hits
      ? "<b>" + hits + (hits === 1 ? " answer" : " answers") + "</b> for “" + termSafe + "”" +
        (partial ? " (closest matches — not every word)" : "") + ". Press Escape to see everything again."
      : "<b>Nothing found</b> for “" + termSafe + "”.";
    noresults.classList.toggle("on", hits === 0 && !sugg.length);

    var url = webQ(term);
    var g1 = $("googleBtn"), g2 = $("googleBtn2");
    if (g1) g1.href = url;
    if (g2) g2.href = url;
  }

  var t;
  q.addEventListener("input", function () {
    clearTimeout(t);
    t = setTimeout(function () { runSearch(q.value); }, 130);
  });
  q.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { q.value = ""; clearSearch(); q.blur(); }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!wiz.hidden) { closeWiz(); return; }
      setDrawer(false);
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); q.focus(); q.select(); }
    else if (e.key === "/" && document.activeElement !== q && wiz.hidden) { e.preventDefault(); q.focus(); }
  });

  /* ---------- nav highlight ---------- */

  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var allSections = Array.prototype.slice.call(document.querySelectorAll("section"));
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (l) {
        l.setAttribute("aria-current", l.getAttribute("href") === "#" + en.target.id ? "true" : "false");
      });
    });
  }, { rootMargin: "-84px 0px -70% 0px" });
  allSections.forEach(function (s) { observer.observe(s); });
})();
