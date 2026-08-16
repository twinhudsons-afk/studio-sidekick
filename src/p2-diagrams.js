/* ============================================================
   STUDIO SIDEKICK — diagram library
   Every visual is generated SVG so it stays crisp at any size,
   respects the page theme, and can highlight one control at a
   time for wizard steps.
   ============================================================ */
(function () {
  "use strict";

  var SVGX = {};
  window.SVGX = SVGX;

  /* ---------- tiny helpers ---------- */

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* unique-id gradient factory — gradients are defined adjacent to their use so
     nothing depends on cross-SVG defs (which break inside hidden sections) */
  var UID = 0;
  function lingrad(stops, vertical) {
    var id = "sxg" + (++UID);
    var m = '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vertical ? "0" : "1") + '" y2="' + (vertical ? "1" : "0") + '">';
    stops.forEach(function (st) { m += '<stop offset="' + st[0] + '" stop-color="' + st[1] + '"' + (st[2] !== undefined ? ' stop-opacity="' + st[2] + '"' : "") + "/>"; });
    m += "</linearGradient>";
    return { id: id, m: m };
  }
  function radgrad(stops, fx, fy) {
    var id = "sxg" + (++UID);
    var m = '<radialGradient id="' + id + '"' + (fx !== undefined ? ' fx="' + fx + '" fy="' + fy + '"' : "") + ">";
    stops.forEach(function (st) { m += '<stop offset="' + st[0] + '" stop-color="' + st[1] + '"' + (st[2] !== undefined ? ' stop-opacity="' + st[2] + '"' : "") + "/>"; });
    m += "</radialGradient>";
    return { id: id, m: m };
  }

  // callout: a labelled ring around a control + caption pill above the panel
  function ring(cx, cy, r) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>' +
           '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 7) + '" fill="none" stroke="var(--focus)" stroke-width="1.4" opacity=".45"/>';
  }
  function pointer(cx, topY, cy) {
    return '<line x1="' + cx + '" y1="' + topY + '" x2="' + cx + '" y2="' + cy + '" stroke="var(--focus)" stroke-width="2" stroke-dasharray="4 4"/>';
  }
  function pill(cx, y, text) {
    var w = text.length * 8.2 + 26;
    return '<g><rect x="' + (cx - w / 2) + '" y="' + (y - 15) + '" rx="13" ry="13" width="' + w + '" height="27" fill="var(--focus)"/>' +
           '<text x="' + cx + '" y="' + (y + 3.5) + '" text-anchor="middle" font-family="var(--body)" font-size="13.5" font-weight="700" fill="#fff">' + esc(text) + '</text></g>';
  }

  /* ============================================================
     THE SCARLETT SOLO 3rd GEN — front panel
     Controls addressable by id for wizard highlighting:
     xlr | gain1 | v48 | air | jack2 | gain2 | inst | monitor | direct | phones
     ============================================================ */

  var FP = {           /* control geometry, one place */
    xlr:     { x: 118, y: 128, r: 37 },
    gain1:   { x: 219, y: 103, r: 25 },
    v48:     { x: 200, y: 168, r: 10 },
    air:     { x: 240, y: 168, r: 10 },
    jack2:   { x: 298, y: 160, r: 17 },
    gain2:   { x: 330, y: 103, r: 25 },
    inst:    { x: 341, y: 168, r: 10 },
    monitor: { x: 462, y: 126, r: 47 },
    direct:  { x: 561, y: 96,  r: 11 },
    phones:  { x: 590, y: 165, r: 19 }
  };

  function knob(x, y, r, haloColor) {
    var rim = lingrad([[0, "#EFEDE9"], [0.5, "#C9C6C0"], [1, "#9C978F"]], true);
    var face = radgrad([[0, "#E2DFDA"], [0.65, "#CBC8C2"], [1, "#ABA7A0"]], "0.35", "0.3");
    var s = rim.m + face.m;
    // drop shadow
    s += '<ellipse cx="' + (x + r * 0.1) + '" cy="' + (y + r * 0.22) + '" rx="' + (r * 1.02) + '" ry="' + (r * 0.94) + '" fill="#000" opacity=".22"/>';
    // gain halo ring (the light ring around the real Scarlett gain knobs)
    if (haloColor) {
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 8) + '" fill="none" stroke="' + haloColor + '" stroke-width="2" opacity=".35"/>';
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 5) + '" fill="none" stroke="' + haloColor + '" stroke-width="4" opacity=".95"/>';
    }
    // knurled rim
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#' + rim.id + ')" stroke="#7D7870" stroke-width="1.2"/>';
    for (var k = 0; k < 24; k++) {
      var a = (k / 24) * Math.PI * 2;
      s += '<line x1="' + (x + Math.cos(a) * (r - 0.5)) + '" y1="' + (y + Math.sin(a) * (r - 0.5)) + '" x2="' + (x + Math.cos(a) * (r - 3.4)) + '" y2="' + (y + Math.sin(a) * (r - 3.4)) + '" stroke="#84807A" stroke-width="1.1" opacity=".65"/>';
    }
    // face + dome highlight
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 4.5) + '" fill="url(#' + face.id + ')" stroke="#918D86" stroke-width="0.8"/>';
    s += '<ellipse cx="' + (x - r * 0.28) + '" cy="' + (y - r * 0.34) + '" rx="' + (r * 0.42) + '" ry="' + (r * 0.3) + '" fill="#FFFFFF" opacity=".38"/>';
    // pointer
    s += '<line x1="' + (x + r * 0.18) + '" y1="' + (y - r * 0.18) + '" x2="' + (x + r * 0.58) + '" y2="' + (y - r * 0.58) + '" stroke="#3A3733" stroke-width="' + Math.max(2.4, r * 0.12) + '" stroke-linecap="round"/>';
    return s;
  }
  function btn(x, y, r, on, onColor) {
    var c = onColor || "#FFD34D";
    var s = '<ellipse cx="' + (x + 1) + '" cy="' + (y + 1.6) + '" rx="' + (r + 1) + '" ry="' + r + '" fill="#000" opacity=".28"/>';
    if (on) {
      var g = radgrad([[0, "#FFFFFF"], [0.25, c], [1, c]], "0.4", "0.35");
      s += g.m;
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 6) + '" fill="' + c + '" opacity=".14"/>';
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 3) + '" fill="' + c + '" opacity=".3"/>';
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#' + g.id + ')" stroke="#5C110D" stroke-width="1.3"/>';
    } else {
      var g2 = radgrad([[0, "#93261E"], [0.6, "#7E1712"], [1, "#5E100C"]], "0.38", "0.32");
      s += g2.m;
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#' + g2.id + ')" stroke="#4A0D09" stroke-width="1.3"/>';
      s += '<ellipse cx="' + (x - r * 0.3) + '" cy="' + (y - r * 0.35) + '" rx="' + (r * 0.4) + '" ry="' + (r * 0.26) + '" fill="#FFFFFF" opacity=".18"/>';
    }
    return s;
  }
  function flabel(x, y, t, size) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="var(--body)" font-size="' + (size || 9.5) + '" font-weight="700" letter-spacing=".08em" fill="#FBEBE9">' + esc(t) + '</text>';
  }

  /* opts: { hl: 'v48', caption: 'Press this', states: {v48:true, air:false, inst:false, direct:true, halo1:'#3BB273', halo2:null} } */
  function solo(opts) {
    opts = opts || {};
    var st = opts.states || {};
    var s = '<svg viewBox="0 0 700 250" role="img" aria-label="Scarlett Solo front panel">';

    // chassis — anodised red with a vertical sheen, like the real 3rd-gen shell
    var ch = lingrad([[0, "#DA5044"], [0.12, "#CE4136"], [0.5, "#C0332A"], [0.88, "#A82A21"], [1, "#96241C"]], true);
    s += ch.m;
    s += '<rect x="38" y="52" width="632" height="168" rx="16" fill="#000" opacity=".25"/>';
    s += '<rect x="34" y="46" width="632" height="168" rx="16" fill="url(#' + ch.id + ')"/>';
    s += '<rect x="34" y="46" width="632" height="168" rx="16" fill="none" stroke="#7E1D16" stroke-width="2.5"/>';
    s += '<rect x="36.5" y="48.5" width="627" height="163" rx="14" fill="none" stroke="#E8776C" stroke-width="1" opacity=".5"/>';
    s += '<rect x="40" y="52" width="620" height="12" rx="6" fill="#E8776C" opacity=".35"/>';
    // brushed-metal hint
    for (var bl2 = 0; bl2 < 5; bl2++) s += '<line x1="44" y1="' + (72 + bl2 * 30) + '" x2="656" y2="' + (72 + bl2 * 30) + '" stroke="#FFFFFF" opacity=".03" stroke-width="6"/>';
    // corner screws
    [[52, 62], [648, 62], [52, 198], [648, 198]].forEach(function (sc) {
      s += '<circle cx="' + sc[0] + '" cy="' + sc[1] + '" r="4.5" fill="#7E1D16" stroke="#5E120D" stroke-width="1"/>';
      s += '<line x1="' + (sc[0] - 2.4) + '" y1="' + (sc[1] - 2.4) + '" x2="' + (sc[0] + 2.4) + '" y2="' + (sc[1] + 2.4) + '" stroke="#4A0D09" stroke-width="1.1"/>';
    });
    s += '<text x="66" y="205" font-family="var(--display)" font-size="12.5" font-weight="700" fill="#F7D4CF" letter-spacing=".05em">Scarlett Solo</text>';
    s += '<text x="66" y="192" font-family="var(--body)" font-size="7.5" font-weight="600" fill="#E8A39B" letter-spacing=".14em">FOCUSRITE</text>';

    // input 1: combo XLR — chrome bezel, recessed well, 3 gold pins + jack hole
    var bez = lingrad([[0, "#EAE8E4"], [0.5, "#B8B4AE"], [1, "#8F8B84"]], true);
    s += bez.m;
    s += '<circle cx="' + FP.xlr.x + '" cy="' + (FP.xlr.y + 2) + '" r="' + FP.xlr.r + '" fill="#000" opacity=".3"/>';
    s += '<circle cx="' + FP.xlr.x + '" cy="' + FP.xlr.y + '" r="' + FP.xlr.r + '" fill="url(#' + bez.id + ')" stroke="#6E6A63" stroke-width="1.4"/>';
    s += '<circle cx="' + FP.xlr.x + '" cy="' + FP.xlr.y + '" r="' + (FP.xlr.r - 5) + '" fill="#211D1B" stroke="#0F0D0B" stroke-width="1.6"/>';
    s += '<circle cx="' + FP.xlr.x + '" cy="' + FP.xlr.y + '" r="' + (FP.xlr.r - 10) + '" fill="#332F2C"/>';
    // latch notch at top
    s += '<rect x="' + (FP.xlr.x - 5) + '" y="' + (FP.xlr.y - FP.xlr.r + 1) + '" width="10" height="7" rx="2" fill="#181512"/>';
    // gold pins with highlights
    [[-9, 7], [9, 7], [0, -10]].forEach(function (pp) {
      s += '<circle cx="' + (FP.xlr.x + pp[0]) + '" cy="' + (FP.xlr.y + pp[1]) + '" r="4.6" fill="#0D0B09"/>';
      s += '<circle cx="' + (FP.xlr.x + pp[0]) + '" cy="' + (FP.xlr.y + pp[1]) + '" r="3" fill="#C9A55A"/>';
      s += '<circle cx="' + (FP.xlr.x + pp[0] - 1) + '" cy="' + (FP.xlr.y + pp[1] - 1) + '" r="1" fill="#EFDCAE" opacity=".8"/>';
    });
    // centre jack hole (it's a combo socket on the real unit)
    s += '<circle cx="' + FP.xlr.x + '" cy="' + (FP.xlr.y + 1) + '" r="5.5" fill="#0D0B09"/>';
    s += flabel(FP.xlr.x, 74, "INPUT 1 · MIC", 10);

    // gain 1 + labels + buttons
    s += knob(FP.gain1.x, FP.gain1.y, FP.gain1.r, st.halo1 || null);
    s += flabel(FP.gain1.x, 145, "GAIN");
    s += btn(FP.v48.x, FP.v48.y, FP.v48.r, !!st.v48, "#F0655A");
    s += flabel(FP.v48.x, 192, "48V");
    s += btn(FP.air.x, FP.air.y, FP.air.r, !!st.air, "#FFD34D");
    s += flabel(FP.air.x, 192, "AIR");

    // input 2 jack + gain 2 + INST — chrome hex nut around the socket
    var hex = "";
    for (var hx = 0; hx < 6; hx++) {
      var ha = Math.PI / 6 + hx * Math.PI / 3;
      hex += (hx ? "L" : "M") + (FP.jack2.x + Math.cos(ha) * (FP.jack2.r + 3)) + " " + (FP.jack2.y + Math.sin(ha) * (FP.jack2.r + 3)) + " ";
    }
    s += '<path d="' + hex + 'Z" fill="url(#' + bez.id + ')" stroke="#6E6A63" stroke-width="1.2"/>';
    s += '<circle cx="' + FP.jack2.x + '" cy="' + FP.jack2.y + '" r="' + (FP.jack2.r - 2) + '" fill="#211D1B" stroke="#0F0D0B" stroke-width="1.4"/>';
    s += '<circle cx="' + FP.jack2.x + '" cy="' + FP.jack2.y + '" r="7" fill="#0D0B09"/>';
    s += '<circle cx="' + (FP.jack2.x - 3) + '" cy="' + (FP.jack2.y - 4) + '" r="2" fill="#FFFFFF" opacity=".14"/>';
    s += flabel(FP.jack2.x, 196, "INPUT 2");
    s += knob(FP.gain2.x, FP.gain2.y, FP.gain2.r, st.halo2 || null);
    s += flabel(FP.gain2.x, 145, "GAIN");
    s += btn(FP.inst.x, FP.inst.y, FP.inst.r, !!st.inst, "#FFD34D");
    s += flabel(FP.inst.x + 24, 172, "INST");

    // monitor
    s += knob(FP.monitor.x, FP.monitor.y, FP.monitor.r);
    s += flabel(FP.monitor.x, 66, "MONITOR", 10);

    // usb led
    s += '<circle cx="519" cy="86" r="5" fill="#7CE49A"/>';
    s += flabel(519, 70, "USB");

    // direct monitor
    s += btn(FP.direct.x, FP.direct.y, FP.direct.r, !!st.direct, "#7CE49A");
    s += flabel(FP.direct.x, 70, "DIRECT", 9);
    s += flabel(FP.direct.x, 81, "MONITOR", 9);

    // phones — chrome bezel like the jack
    s += '<circle cx="' + FP.phones.x + '" cy="' + (FP.phones.y + 1.5) + '" r="' + (FP.phones.r + 2) + '" fill="#000" opacity=".28"/>';
    s += '<circle cx="' + FP.phones.x + '" cy="' + FP.phones.y + '" r="' + (FP.phones.r + 2) + '" fill="url(#' + bez.id + ')" stroke="#6E6A63" stroke-width="1.2"/>';
    s += '<circle cx="' + FP.phones.x + '" cy="' + FP.phones.y + '" r="' + (FP.phones.r - 3) + '" fill="#211D1B" stroke="#0F0D0B" stroke-width="1.4"/>';
    s += '<circle cx="' + FP.phones.x + '" cy="' + FP.phones.y + '" r="7" fill="#0D0B09"/>';
    s += '<circle cx="' + (FP.phones.x - 4) + '" cy="' + (FP.phones.y - 5) + '" r="2.2" fill="#FFFFFF" opacity=".14"/>';
    // headphone glyph
    s += '<path d="M ' + (FP.phones.x - 9) + ' ' + (FP.phones.y + 33) + ' a 9 9 0 0 1 18 0" fill="none" stroke="#F4C9C4" stroke-width="2"/>' +
         '<rect x="' + (FP.phones.x - 11) + '" y="' + (FP.phones.y + 31) + '" width="4.5" height="7" rx="2" fill="#F4C9C4"/>' +
         '<rect x="' + (FP.phones.x + 6.5) + '" y="' + (FP.phones.y + 31) + '" width="4.5" height="7" rx="2" fill="#F4C9C4"/>';

    // highlight
    if (opts.hl && FP[opts.hl]) {
      var c = FP[opts.hl];
      s += ring(c.x, c.y, c.r + 9);
      if (opts.caption) {
        s += pointer(c.x, 26, c.y - c.r - 14);
        s += pill(Math.min(Math.max(c.x, 110), 590), 18, opts.caption);
      }
    }
    s += '</svg>';
    return s;
  }

  SVGX.front = function (hl, caption, states) { return solo({ hl: hl, caption: caption, states: states }); };
  SVGX.frontFull = function () { return solo({ states: { v48: true, direct: false, halo1: "#3BB273" } }); };
  SVGX.frontVocal = function () { return solo({ hl: "v48", caption: "48V on for your RØDE", states: { v48: true, air: true, direct: true, halo1: "#3BB273" } }); };

  /* ---------- back panel ---------- */

  SVGX.backPanel = function () {
    var s = '<svg viewBox="0 0 700 170" role="img" aria-label="Scarlett Solo back panel">';
    var ch = lingrad([[0, "#C2382D"], [0.5, "#A82A21"], [1, "#8E211A"]], true);
    var bez = lingrad([[0, "#EAE8E4"], [0.5, "#B8B4AE"], [1, "#8F8B84"]], true);
    s += ch.m + bez.m;
    s += '<rect x="37" y="34" width="632" height="112" rx="14" fill="#000" opacity=".25"/>';
    s += '<rect x="34" y="30" width="632" height="112" rx="14" fill="url(#' + ch.id + ')"/>';
    s += '<rect x="34" y="30" width="632" height="112" rx="14" fill="none" stroke="#6E1A14" stroke-width="2.5"/>';
    s += '<rect x="38" y="34" width="624" height="8" rx="4" fill="#E8776C" opacity=".3"/>';
    [[52, 44], [648, 44], [52, 128], [648, 128]].forEach(function (sc) {
      s += '<circle cx="' + sc[0] + '" cy="' + sc[1] + '" r="4" fill="#6E1A14" stroke="#521310" stroke-width="1"/>';
      s += '<line x1="' + (sc[0] - 2.1) + '" y1="' + (sc[1] - 2.1) + '" x2="' + (sc[0] + 2.1) + '" y2="' + (sc[1] + 2.1) + '" stroke="#3E0E0B" stroke-width="1"/>';
    });
    // Kensington
    s += '<rect x="80" y="76" width="26" height="12" rx="5" fill="#211D1B" stroke="#0F0D0B" stroke-width="1.4"/>' + flabel(93, 112, "LOCK");
    // line outs — chrome bezels with black wells
    [290, 350].forEach(function (lx) {
      s += '<circle cx="' + lx + '" cy="86" r="18" fill="#000" opacity=".25"/>';
      s += '<circle cx="' + lx + '" cy="84" r="17" fill="url(#' + bez.id + ')" stroke="#6E6A63" stroke-width="1.4"/>';
      s += '<circle cx="' + lx + '" cy="84" r="12" fill="#211D1B" stroke="#0F0D0B" stroke-width="1.2"/>';
      s += '<circle cx="' + lx + '" cy="84" r="6" fill="#0D0B09"/>';
      s += '<circle cx="' + (lx - 4) + '" cy="79" r="2" fill="#FFFFFF" opacity=".16"/>';
    });
    s += flabel(320, 52, "LINE OUTPUTS  L · R", 10);
    s += flabel(320, 118, "(speakers, if you add them)", 9);
    // USB-C — steel port with inner tongue
    s += '<rect x="558" y="72" width="46" height="22" rx="11" fill="url(#' + bez.id + ')" stroke="#6E6A63" stroke-width="1.4"/>';
    s += '<rect x="562" y="76" width="38" height="14" rx="7" fill="#15120F"/>';
    s += '<rect x="568" y="81" width="26" height="4" rx="2" fill="#4A453F"/>';
    s += flabel(581, 52, "USB-C", 10);
    s += flabel(581, 118, "one cable to the Mac", 9);
    s += ring(581, 83, 30);
    s += '</svg>';
    return s;
  };

  /* ---------- connection map ---------- */

  function nodeBox(x, y, w, h, label, sub, tone) {
    var fill = tone === "red" ? "var(--accent-wash)" : "var(--surface-sunk)";
    var strokeC = tone === "red" ? "var(--accent)" : "var(--line-strong)";
    var s = '<rect x="' + (x + 2.5) + '" y="' + (y + 3.5) + '" width="' + w + '" height="' + h + '" rx="11" fill="var(--ink)" opacity=".10"/>';
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="11" fill="' + fill + '" stroke="' + strokeC + '" stroke-width="1.8"/>';
    s += '<rect x="' + (x + 3) + '" y="' + (y + 2.5) + '" width="' + (w - 6) + '" height="' + (h / 2.6) + '" rx="8" fill="#FFFFFF" opacity=".22"/>';
    if (tone === "red") s += '<rect x="' + x + '" y="' + y + '" width="5" height="' + h + '" rx="2.5" fill="var(--accent)"/>';
    s += '<text x="' + (x + w / 2) + '" y="' + (y + (sub ? h / 2 - 4 : h / 2 + 5)) + '" text-anchor="middle" font-family="var(--display)" font-size="15" font-weight="700" fill="var(--ink)">' + esc(label) + '</text>';
    if (sub) s += '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 16) + '" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-soft)">' + esc(sub) + '</text>';
    return s;
  }
  function wire(x1, y1, x2, y2, label, midYOffset) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (midYOffset || 0);
    var s = '<path d="M ' + x1 + ' ' + y1 + ' C ' + (x1 + 55) + ' ' + y1 + ', ' + (x2 - 55) + ' ' + y2 + ', ' + (x2 - 9) + ' ' + y2 + '" fill="none" stroke="var(--ink-faint)" stroke-width="2.4"/>';
    s += '<path d="M ' + (x2 - 11) + ' ' + (y2 - 5.5) + ' L ' + x2 + ' ' + y2 + ' L ' + (x2 - 11) + ' ' + (y2 + 5.5) + ' Z" fill="var(--ink-faint)"/>';
    if (label) {
      var w = label.length * 6.6 + 18;
      s += '<rect x="' + (mx - w / 2) + '" y="' + (my - 12) + '" width="' + w + '" height="22" rx="11" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.2"/>';
      s += '<text x="' + mx + '" y="' + (my + 3.5) + '" text-anchor="middle" font-family="var(--mono)" font-size="10.5" font-weight="600" fill="var(--ink-mid)">' + esc(label) + '</text>';
    }
    return s;
  }

  /* little device glyphs for the map */
  function icoMic(x, y) {
    return '<g stroke="var(--ink-mid)" stroke-width="2" fill="none">' +
      '<rect x="' + (x - 6) + '" y="' + (y - 14) + '" width="12" height="18" rx="6" fill="var(--ink-mid)"/>' +
      '<path d="M ' + (x - 10) + ' ' + (y - 2) + ' a 10 10 0 0 0 20 0"/>' +
      '<line x1="' + x + '" y1="' + (y + 8) + '" x2="' + x + '" y2="' + (y + 14) + '"/>' +
      '<line x1="' + (x - 6) + '" y1="' + (y + 14) + '" x2="' + (x + 6) + '" y2="' + (y + 14) + '"/></g>';
  }
  function icoKeys(x, y, black) {
    var g = '<g>';
    for (var i = 0; i < 5; i++) g += '<rect x="' + (x - 20 + i * 8) + '" y="' + (y - 10) + '" width="7" height="22" rx="1.5" fill="var(--surface)" stroke="var(--ink-mid)" stroke-width="1.2"/>';
    if (black) [0, 1, 3].forEach(function (i) { g += '<rect x="' + (x - 15 + i * 8) + '" y="' + (y - 10) + '" width="5" height="13" rx="1" fill="var(--ink-mid)"/>'; });
    return g + '</g>';
  }
  function icoLaptop(x, y) {
    return '<g><rect x="' + (x - 16) + '" y="' + (y - 12) + '" width="32" height="20" rx="2.5" fill="var(--surface)" stroke="var(--ink-mid)" stroke-width="1.8"/>' +
      '<rect x="' + (x - 12) + '" y="' + (y - 8) + '" width="24" height="12" rx="1" fill="var(--accent)" opacity=".35"/>' +
      '<path d="M ' + (x - 21) + ' ' + (y + 11) + ' L ' + (x + 21) + ' ' + (y + 11) + ' L ' + (x + 17) + ' ' + (y + 8) + ' L ' + (x - 17) + ' ' + (y + 8) + ' Z" fill="var(--ink-mid)"/></g>';
  }
  function icoPhones(x, y) {
    return '<g fill="none" stroke="var(--ink-mid)" stroke-width="2.2">' +
      '<path d="M ' + (x - 11) + ' ' + (y + 4) + ' a 11 11 0 0 1 22 0"/>' +
      '<rect x="' + (x - 14) + '" y="' + (y + 2) + '" width="6" height="10" rx="3" fill="var(--ink-mid)"/>' +
      '<rect x="' + (x + 8) + '" y="' + (y + 2) + '" width="6" height="10" rx="3" fill="var(--ink-mid)"/></g>';
  }
  function icoScarlett(x, y) {
    var g = '<g><rect x="' + (x - 17) + '" y="' + (y - 9) + '" width="34" height="19" rx="4" fill="#C0332A" stroke="#8E211A" stroke-width="1.4"/>';
    g += '<circle cx="' + (x - 8) + '" cy="' + y + '" r="4" fill="#D6D3CE" stroke="#8F8B86" stroke-width="1"/>';
    g += '<circle cx="' + (x + 6) + '" cy="' + y + '" r="5.5" fill="#D6D3CE" stroke="#8F8B86" stroke-width="1"/>';
    return g + '</g>';
  }

  SVGX.connectionMap = function (hl) {
    var s = '<svg viewBox="0 0 760 400" role="img" aria-label="How everything connects">';
    s += nodeBox(24, 40, 150, 62, "Microphone", "your voice");
    s += nodeBox(24, 170, 150, 62, "Piano", "line out");
    s += nodeBox(24, 300, 170, 62, "MIDI keyboard", "instructions only");
    s += nodeBox(300, 96, 180, 78, "Scarlett Solo", "audio translator", "red");
    s += nodeBox(560, 150, 176, 78, "Mac", "FL Studio", "red");
    s += nodeBox(310, 300, 160, 62, "Headphones", "listen here");
    // device glyphs sitting above their boxes
    s += icoMic(50, 24);
    s += icoKeys(56, 156, false);
    s += icoKeys(56, 286, true);
    s += icoScarlett(336, 82);
    s += icoLaptop(596, 132);
    s += icoPhones(338, 282);
    s += wire(174, 71, 300, 118, "XLR");
    s += wire(174, 201, 300, 152, "jack");
    s += wire(480, 135, 560, 172, "USB-C");
    s += wire(194, 331, 560, 206, "USB — straight to the Mac", -46);
    s += '<path d="M 390 174 L 390 291" fill="none" stroke="var(--ink-faint)" stroke-width="2.4"/>';
    s += '<path d="M 384.5 289 L 390 300 L 395.5 289 Z" fill="var(--ink-faint)"/>';
    if (hl === "kbd") s += ring(97, 331, 92) + pill(240, 386, "This cable skips the Scarlett");
    s += '</svg>';
    return s;
  };

  /* ---------- cable types ---------- */

  SVGX.cableTypes = function () {
    var s = '<svg viewBox="0 0 760 170" role="img" aria-label="Cable types">';
    function cap(x, t, sub) {
      return '<text x="' + x + '" y="132" text-anchor="middle" font-family="var(--display)" font-size="15" font-weight="700" fill="var(--ink)">' + esc(t) + '</text>' +
             '<text x="' + x + '" y="152" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-soft)">' + esc(sub) + '</text>';
    }
    // XLR
    s += '<circle cx="120" cy="66" r="34" fill="var(--surface-sunk)" stroke="var(--ink-faint)" stroke-width="2.5"/>';
    s += '<circle cx="109" cy="74" r="5.5" fill="var(--ink)"/><circle cx="131" cy="74" r="5.5" fill="var(--ink)"/><circle cx="120" cy="54" r="5.5" fill="var(--ink)"/>';
    s += cap(120, "XLR", "mic → input 1");
    // jack
    s += '<rect x="352" y="30" width="16" height="52" rx="7" fill="var(--ink-faint)"/><rect x="355" y="80" width="10" height="22" fill="var(--ink)"/><rect x="357" y="20" width="6" height="12" rx="3" fill="var(--ink)"/>';
    s += cap(360, "Jack ¼-inch", "piano → input 2");
    // USB
    s += '<rect x="576" y="46" width="66" height="40" rx="8" fill="var(--surface-sunk)" stroke="var(--ink-faint)" stroke-width="2.5"/>';
    s += '<rect x="590" y="60" width="38" height="12" rx="6" fill="var(--ink)"/>';
    s += cap(609, "USB", "keyboard → Mac · Scarlett → Mac");
    s += '</svg>';
    return s;
  };

  /* ============================================================
     macOS SETTINGS WINDOWS (fixed light depiction)
     ============================================================ */

  function macWindow(title, rows, hlIndex, toggleOn) {
    var s = '<svg viewBox="0 0 680 330" role="img" aria-label="' + esc(title) + '">';
    s += '<rect x="10" y="8" width="660" height="312" rx="14" fill="#F5F4F2" stroke="#C9C6C1" stroke-width="1.6"/>';
    s += '<circle cx="38" cy="32" r="6.5" fill="#FF5F57"/><circle cx="60" cy="32" r="6.5" fill="#FEBC2E"/><circle cx="82" cy="32" r="6.5" fill="#28C840"/>';
    s += '<text x="340" y="37" text-anchor="middle" font-family="var(--body)" font-size="14" font-weight="700" fill="#3A3733">' + esc(title) + '</text>';
    // sidebar
    s += '<rect x="10" y="52" width="180" height="268" fill="#EAE8E4"/>';
    var side = ["General", "Sound", "Privacy & Security", "Displays"];
    side.forEach(function (t, i) {
      var y = 84 + i * 38;
      var active = (title.indexOf("Sound") > -1 && t === "Sound") || (title.indexOf("Micro") > -1 && t === "Privacy & Security");
      if (active) s += '<rect x="20" y="' + (y - 20) + '" width="160" height="30" rx="8" fill="#C6362C"/>';
      s += '<text x="34" y="' + y + '" font-family="var(--body)" font-size="12.5" font-weight="' + (active ? 700 : 500) + '" fill="' + (active ? "#fff" : "#4A4741") + '">' + esc(t) + '</text>';
    });
    // rows
    rows.forEach(function (r, i) {
      var y = 92 + i * 52;
      s += '<rect x="212" y="' + (y - 26) + '" width="436" height="44" rx="10" fill="#FFFFFF" stroke="#DBD8D3" stroke-width="1.2"/>';
      s += '<text x="232" y="' + y + '" font-family="var(--body)" font-size="13.5" font-weight="600" fill="#2C2925">' + esc(r.label) + '</text>';
      if (r.sub) s += '<text x="232" y="' + (y + 15) + '" font-family="var(--body)" font-size="10.5" fill="#8A867F">' + esc(r.sub) + '</text>';
      if (r.toggle !== undefined) {
        var on = r.toggle;
        s += '<rect x="586" y="' + (y - 13) + '" width="44" height="26" rx="13" fill="' + (on ? "#34C759" : "#D5D2CC") + '"/>';
        s += '<circle cx="' + (on ? 619 : 597) + '" cy="' + y + '" r="10.5" fill="#fff"/>';
      }
      if (r.tick) s += '<text x="612" y="' + (y + 2) + '" font-family="var(--body)" font-size="17" font-weight="700" fill="#C6362C">✓</text>';
      if (hlIndex === i) s += '<rect x="206" y="' + (y - 32) + '" width="448" height="56" rx="13" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="8 6"/>';
    });
    s += '</svg>';
    return s;
  }

  SVGX.macMic = function () {
    return macWindow("Privacy & Security → Microphone", [
      { label: "GarageBand", toggle: false },
      { label: "FL Studio", sub: "then quit and reopen FL Studio", toggle: true },
      { label: "Zoom", toggle: false },
      { label: "Safari", toggle: false }
    ], 1);
  };
  SVGX.macSound = function () {
    return macWindow("Sound → Output", [
      { label: "MacBook Speakers", sub: "Built-in" },
      { label: "Scarlett Solo USB", sub: "USB audio device", tick: true },
      { label: "AirPods", sub: "Bluetooth" }
    ], 1);
  };

  /* ============================================================
     FL STUDIO WINDOWS (fixed dark depiction, FL-flavoured)
     ============================================================ */

  /* FL Studio 2024 default-theme palette, matched to a reference screenshot:
     blue-grey chrome, dark LCD wells with orange digits, lime step cells */
  var FLC = {
    body: "#3E464F", well: "#2E353C", title: "#48505A", dark: "#262C33",
    edge: "#20262C", line: "#59626B",
    txt: "#D6DBDF", dim: "#98A1A9",
    lcdBg: "#171C21", lcd: "#F0A43C",
    green: "#7FBE4F", red: "#D9534F", cyan: "#6FBFE0",
    step: "#AFC96A", stepEdge: "#87A244",
    knob: "#333A41", ring: "#5A636C", fader: "#C9CED4",
    or: "#F5A623"
  };

  function flWindow(w, h, title, inner) {
    var tg = lingrad([[0, "#525B65"], [0.5, FLC.title], [1, "#3F474F"]], true);
    var s = '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(title) + '">';
    s += tg.m;
    s += '<rect x="11" y="10" width="' + (w - 16) + '" height="' + (h - 12) + '" rx="6" fill="#000" opacity=".28"/>';
    s += '<rect x="8" y="6" width="' + (w - 16) + '" height="' + (h - 12) + '" rx="6" fill="' + FLC.body + '" stroke="' + FLC.edge + '" stroke-width="2"/>';
    s += '<rect x="8" y="6" width="' + (w - 16) + '" height="27" rx="6" fill="url(#' + tg.id + ')"/>';
    s += '<rect x="8" y="24" width="' + (w - 16) + '" height="9" fill="url(#' + tg.id + ')"/>';
    s += '<line x1="10" y1="33.5" x2="' + (w - 10) + '" y2="33.5" stroke="#20262C" stroke-width="1"/>';
    s += '<line x1="10" y1="8" x2="' + (w - 10) + '" y2="8" stroke="#6B7480" stroke-width="1" opacity=".6"/>';
    s += '<path d="M 22 17 L 30 17 L 26 22 Z" fill="' + FLC.dim + '"/>';
    s += '<text x="40" y="24" font-family="var(--body)" font-size="12" font-weight="600" fill="' + FLC.txt + '">' + esc(title) + '</text>';
    // window buttons top-right
    s += '<g fill="' + FLC.dim + '"><rect x="' + (w - 58) + '" y="16" width="9" height="2.5" /><rect x="' + (w - 42) + '" y="13" width="8" height="8" fill="none" stroke="' + FLC.dim + '" stroke-width="1.6"/><path d="M ' + (w - 26) + ' 13 l 8 8 M ' + (w - 18) + ' 13 l -8 8" stroke="' + FLC.dim + '" stroke-width="1.6"/></g>';
    s += inner;
    // resize grip
    s += '<g stroke="' + FLC.line + '" stroke-width="1.2" opacity=".7"><line x1="' + (w - 20) + '" y1="' + (h - 10) + '" x2="' + (w - 10) + '" y2="' + (h - 20) + '"/><line x1="' + (w - 16) + '" y1="' + (h - 10) + '" x2="' + (w - 10) + '" y2="' + (h - 16) + '"/></g>';
    s += '</svg>';
    return s;
  }
  function lcd(x, y, w, h, text, size) {
    var fs = size || 13;
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + FLC.lcdBg + '" stroke="' + FLC.edge + '" stroke-width="1.4"/>' +
           '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (w - 3) + '" height="' + (h - 3) + '" rx="3" fill="none" stroke="#000" stroke-width="1" opacity=".5"/>' +
           '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (w - 4) + '" height="' + ((h - 4) / 2.4) + '" rx="2" fill="#FFFFFF" opacity=".05"/>' +
           '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + fs * 0.36) + '" text-anchor="middle" font-family="var(--mono)" font-size="' + fs + '" font-weight="700" fill="' + FLC.lcd + '" stroke="' + FLC.lcd + '" stroke-width="2.6" opacity=".18">' + esc(text) + '</text>' +
           '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + fs * 0.36) + '" text-anchor="middle" font-family="var(--mono)" font-size="' + fs + '" font-weight="700" fill="' + FLC.lcd + '">' + esc(text) + '</text>';
  }
  function flRow(x, y, w, label, value, hl) {
    var s = '<text x="' + x + '" y="' + (y + 4) + '" font-family="var(--body)" font-size="12.5" fill="' + FLC.dim + '">' + esc(label) + '</text>';
    s += '<rect x="' + (x + 150) + '" y="' + (y - 14) + '" width="' + (w - 150) + '" height="30" rx="4" fill="' + FLC.well + '" stroke="' + FLC.edge + '" stroke-width="1.2"/>';
    s += '<text x="' + (x + 164) + '" y="' + (y + 5) + '" font-family="var(--body)" font-size="12.5" font-weight="600" fill="' + FLC.txt + '">' + esc(value) + '</text>';
    s += '<path d="M ' + (x + w - 28) + ' ' + (y - 2) + ' l 8 0 l -4 6 Z" fill="' + FLC.dim + '"/>';
    if (hl) s += '<rect x="' + (x + 144) + '" y="' + (y - 20) + '" width="' + (w - 138) + '" height="42" rx="8" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="8 6"/>';
    return s;
  }
  function miniKnob(x, y, r) {
    var g = radgrad([[0, "#454D55"], [0.7, FLC.knob], [1, "#242A30"]], "0.35", "0.3");
    var s = g.m;
    // value arc, like FL's lit knob rings
    var a0 = Math.PI * 0.75, a1 = Math.PI * 1.62;
    s += '<path d="M ' + (x + Math.cos(a0) * (r + 2.5)) + ' ' + (y + Math.sin(a0) * (r + 2.5)) +
         ' A ' + (r + 2.5) + ' ' + (r + 2.5) + ' 0 0 1 ' + (x + Math.cos(a1) * (r + 2.5)) + ' ' + (y + Math.sin(a1) * (r + 2.5)) +
         '" fill="none" stroke="' + FLC.or + '" stroke-width="2" stroke-linecap="round" opacity=".85"/>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#' + g.id + ')" stroke="' + FLC.ring + '" stroke-width="1.3"/>';
    s += '<ellipse cx="' + (x - r * 0.3) + '" cy="' + (y - r * 0.35) + '" rx="' + (r * 0.4) + '" ry="' + (r * 0.28) + '" fill="#FFFFFF" opacity=".12"/>';
    s += '<line x1="' + x + '" y1="' + (y - r * 0.25) + '" x2="' + x + '" y2="' + (y - r + 2) + '" stroke="' + FLC.txt + '" stroke-width="1.7" stroke-linecap="round"/>';
    return s;
  }

  /* hl: 'device' | 'buffer' */
  SVGX.flAudio = function (hl, caption) {
    var inner = "";
    inner += '<text x="40" y="62" font-family="var(--body)" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="' + FLC.dim + '">INPUT / OUTPUT</text>';
    inner += flRow(40, 92, 560, "Device", "Scarlett Solo USB", hl === "device");
    inner += flRow(40, 140, 560, "Sample rate", "44100 Hz", false);
    // buffer slider
    inner += '<text x="40" y="196" font-family="var(--body)" font-size="12.5" fill="' + FLC.dim + '">Buffer length</text>';
    inner += '<rect x="190" y="188" width="300" height="8" rx="4" fill="' + FLC.well + '" stroke="' + FLC.edge + '" stroke-width="1"/>';
    inner += '<rect x="190" y="188" width="88" height="8" rx="4" fill="' + FLC.or + '"/>';
    inner += '<rect x="271" y="181" width="14" height="22" rx="3" fill="' + FLC.fader + '" stroke="' + FLC.edge + '" stroke-width="1.2"/>';
    inner += lcd(505, 178, 108, 28, "256 smp", 13);
    if (hl === "buffer") inner += '<rect x="182" y="172" width="440" height="40" rx="8" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="8 6"/>';
    inner += '<text x="40" y="242" font-family="var(--body)" font-size="12" fill="' + FLC.dim + '">Underruns</text>';
    inner += lcd(190, 226, 44, 24, "0", 12.5);
    inner += '<text x="248" y="242" font-family="var(--body)" font-size="11" fill="' + FLC.dim + '">← should stay at zero while playing</text>';
    var s = flWindow(660, 272, "Settings - Audio   (Options → Audio Settings)", inner);
    if (caption) s = s.replace("</svg>", pill(330, 22, caption) + "</svg>");
    return s;
  };
  SVGX.flAudioPlain = function () { return SVGX.flAudio(null); };

  /* hl: 'enable' | 'port' | 'row' */
  SVGX.flMidi = function (hl) {
    var inner = "";
    inner += '<text x="40" y="62" font-family="var(--body)" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="' + FLC.dim + '">INPUT</text>';
    // list box
    inner += '<rect x="40" y="72" width="580" height="104" rx="4" fill="' + FLC.well + '" stroke="' + FLC.edge + '" stroke-width="1.4"/>';
    // header row
    inner += '<rect x="41" y="73" width="578" height="22" fill="' + FLC.dark + '"/>';
    inner += '<text x="56" y="88" font-family="var(--body)" font-size="10.5" fill="' + FLC.dim + '">Controller</text>';
    inner += '<text x="430" y="88" font-family="var(--body)" font-size="10.5" fill="' + FLC.dim + '">Port</text>';
    inner += '<text x="510" y="88" font-family="var(--body)" font-size="10.5" fill="' + FLC.dim + '">Status</text>';
    // the keyboard row (selected — FL selection is a lighter band)
    inner += '<rect x="42" y="100" width="576" height="28" fill="#4B545E"/>';
    inner += '<circle cx="52" cy="114" r="4" fill="' + FLC.green + '"/>';
    inner += '<text x="64" y="119" font-family="var(--body)" font-size="12.5" font-weight="600" fill="' + FLC.txt + '">USB MIDI keyboard</text>';
    inner += lcd(422, 102, 34, 24, "0", 12);
    inner += '<text x="510" y="119" font-family="var(--body)" font-size="12" font-weight="700" fill="' + FLC.green + '">Enabled</text>';
    if (hl === "row") inner += '<rect x="38" y="96" width="584" height="36" rx="8" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="8 6"/>';
    if (hl === "port") inner += '<rect x="414" y="96" width="52" height="36" rx="8" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="8 6"/>';
    // second row
    inner += '<circle cx="52" cy="146" r="4" fill="' + FLC.ring + '"/>';
    inner += '<text x="64" y="151" font-family="var(--body)" font-size="12.5" fill="' + FLC.dim + '">IAC Driver Bus 1</text>';
    inner += '<text x="430" y="151" font-family="var(--mono)" font-size="12.5" fill="' + FLC.dim + '">—</text>';
    // enable button + controller type
    inner += '<rect x="40" y="192" width="110" height="32" rx="4" fill="' + FLC.dark + '" stroke="' + FLC.or + '" stroke-width="2"/>';
    inner += '<circle cx="58" cy="208" r="5" fill="' + FLC.or + '"/>';
    inner += '<text x="102" y="213" text-anchor="middle" font-family="var(--body)" font-size="12.5" font-weight="700" fill="' + FLC.txt + '">Enable</text>';
    if (hl === "enable") inner += '<rect x="34" y="186" width="122" height="44" rx="8" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="8 6"/>' + pill(120, 250, "Click the keyboard, then click this");
    inner += flRow(180, 208, 440, "Controller type", "Generic Controller", false);
    var s = flWindow(660, 272, "Settings - MIDI   (Options → MIDI Settings)", inner);
    return s;
  };

  /* Channel Rack, FL-2024 style.
     mode: 'select' (highlight selected channel) | 'steps' (highlight step cells) */
  SVGX.flRack = function (mode, stepData) {
    var chans = stepData || [
      { name: "Kick",  led: false, steps: [1, 9] },
      { name: "Clap",  led: false, steps: [5, 13] },
      { name: "Hat",   led: false, steps: [1, 3, 5, 7, 9, 11, 13, 15] },
      { name: "FLEX — Grand Piano", led: true, steps: [] }
    ];
    var top = 78, rowH = 38, x0 = 44, cellW = 25, cellX = 322;
    var h = top + chans.length * rowH + 56;
    var inner = "";
    // channel-button colours, like the real rack (muted purples/reds/blues)
    var CHCOL = ["#7E5A5E", "#6E5E92", "#5F6A94", "#4E7FA5", "#6E5E92", "#7E5A5E"];
    // header strip: category dropdown left, Auto + icons right
    inner += '<rect x="34" y="40" width="' + (760 - 68) + '" height="28" fill="' + FLC.dark + '"/>';
    inner += '<path d="M 46 50 l 0 9 l 6 -4.5 Z" fill="' + FLC.dim + '"/>';
    inner += '<rect x="60" y="46" width="96" height="17" rx="3" fill="' + FLC.well + '"/>';
    inner += '<text x="70" y="59" font-family="var(--body)" font-size="10.5" fill="' + FLC.txt + '">All</text>';
    inner += '<path d="M 142 51 l 8 0 l -4 6 Z" fill="' + FLC.dim + '"/>';
    inner += '<rect x="584" y="46" width="46" height="17" rx="3" fill="' + FLC.well + '" stroke="' + FLC.edge + '" stroke-width="1"/><text x="607" y="59" text-anchor="middle" font-family="var(--body)" font-size="10" fill="' + FLC.dim + '">Auto</text>';
    inner += '<g fill="' + FLC.or + '"><rect x="644" y="49" width="4" height="11"/><rect x="650" y="46" width="4" height="14"/><rect x="656" y="52" width="4" height="8"/></g>';
    inner += '<text x="576" y="59" font-family="var(--body)" font-size="9.5" letter-spacing=".06em" fill="' + FLC.dim + '" text-anchor="end">SWING</text>';
    chans.forEach(function (c, i) {
      var y = top + i * rowH;
      // mute LED (lime) + pan/vol mini knobs
      inner += '<circle cx="' + (x0 + 8) + '" cy="' + (y + 14) + '" r="5" fill="#C3E14E" stroke="#7C9430" stroke-width="1"/>';
      inner += miniKnob(x0 + 30, y + 14, 8);
      inner += miniKnob(x0 + 53, y + 14, 8);
      // coloured channel button, name centred like the real rack
      var col = c.led ? CHCOL[3] : CHCOL[i % CHCOL.length];
      inner += '<rect x="' + (x0 + 72) + '" y="' + y + '" width="172" height="28" rx="4" fill="' + col + '" stroke="' + FLC.edge + '" stroke-width="1.2"/>';
      inner += '<rect x="' + (x0 + 72) + '" y="' + y + '" width="172" height="12" rx="4" fill="#FFFFFF" opacity=".08"/>';
      inner += '<text x="' + (x0 + 158) + '" y="' + (y + 19) + '" text-anchor="middle" font-family="var(--body)" font-size="11.5" font-weight="600" fill="#EFF2F5">' + esc(c.name) + '</text>';
      // selection = the lime strip right of the button (vertical position sets the MIDI channel)
      if (c.led) {
        inner += '<rect x="' + (x0 + 252) + '" y="' + (y + 1) + '" width="7" height="26" rx="2" fill="#C3E14E" stroke="#5C6E20" stroke-width="1.4"/>';
      } else {
        inner += '<rect x="' + (x0 + 253) + '" y="' + (y + 4) + '" width="5" height="20" rx="2" fill="' + FLC.well + '"/>';
      }
      // 16 steps as vertical pills; groups of 4 alternate silver / dusty red
      for (var st = 1; st <= 16; st++) {
        var cx = cellX + (st - 1) * cellW + (st > 4 ? 7 : 0) + (st > 8 ? 7 : 0) + (st > 12 ? 7 : 0);
        var on = c.steps.indexOf(st) > -1;
        var silver = Math.floor((st - 1) / 4) % 2 === 0;
        var base = silver ? "#8A9099" : "#7E6165";
        var topHi = silver ? "#A6ACB4" : "#98797D";
        if (on) {
          inner += '<rect x="' + cx + '" y="' + (y + 1) + '" width="18" height="27" rx="4" fill="' + FLC.step + '" stroke="' + FLC.stepEdge + '" stroke-width="1.4"/>';
          inner += '<rect x="' + (cx + 2) + '" y="' + (y + 3) + '" width="14" height="11" rx="3" fill="#D3E6A0" opacity=".8"/>';
        } else {
          inner += '<rect x="' + cx + '" y="' + (y + 2) + '" width="18" height="25" rx="4" fill="' + base + '" stroke="' + FLC.edge + '" stroke-width="0.8"/>';
          inner += '<rect x="' + (cx + 2) + '" y="' + (y + 4) + '" width="14" height="10" rx="3" fill="' + topHi + '"/>';
        }
      }
      if (mode === "select" && c.led) {
        inner += '<rect x="' + (x0 + 66) + '" y="' + (y - 6) + '" width="200" height="40" rx="8" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="8 6"/>';
      }
    });
    // bottom: + add button and scrollbar, like the real rack
    inner += '<text x="' + (x0 + 158) + '" y="' + (h - 24) + '" text-anchor="middle" font-family="var(--body)" font-size="15" font-weight="700" fill="' + FLC.dim + '">+</text>';
    inner += '<rect x="' + cellX + '" y="' + (h - 34) + '" width="200" height="8" rx="4" fill="' + FLC.well + '"/><rect x="' + cellX + '" y="' + (h - 34) + '" width="90" height="8" rx="4" fill="' + FLC.ring + '"/>';
    if (mode === "select") inner += pill(220, h - 12, "The lime strip marks the selected channel — that's who your keyboard plays");
    if (mode === "steps") {
      inner += '<rect x="' + (cellX - 6) + '" y="' + (top - 8) + '" width="' + (16 * cellW + 32) + '" height="' + (3 * rowH + 6) + '" rx="8" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="8 6"/>';
      inner += pill(505, h - 12, "Click the cells — each row is one drum, 16 cells = 1 bar");
    }
    return flWindow(760, h, "Channel rack", inner);
  };
  SVGX.rackSelect = function () { return SVGX.flRack("select"); };
  SVGX.rackSteps = function () { return SVGX.flRack("steps"); };

  /* Mixer, matched to the real FL layout: strips left, FX-slots panel on the RIGHT.
     hl: 'input' | 'arm' | 'master' */
  SVGX.flMixer = function (hl) {
    var inner = "";
    var masterSel = hl === "master";
    var vocalSel = hl === "vocal";
    var top = 44, stripH = 300;
    // dB scale sliver + Current strip
    inner += '<rect x="34" y="' + top + '" width="20" height="' + stripH + '" fill="' + FLC.dark + '"/>';
    [0, 3, 6, 9, 12].forEach(function (db, k) {
      inner += '<text x="44" y="' + (top + 60 + k * 40) + '" text-anchor="middle" font-family="var(--mono)" font-size="7.5" fill="' + FLC.dim + '">' + db + '</text>';
    });
    inner += '<text x="70" y="' + (top + 14) + '" text-anchor="middle" font-family="var(--body)" font-size="8.5" fill="' + FLC.dim + '">Current</text>';
    inner += '<rect x="58" y="' + (top + 20) + '" width="24" height="' + (stripH - 24) + '" fill="' + FLC.well + '"/>';

    var strips = [
      { name: "Master", master: true },
      { name: vocalSel ? "1 — Vocal" : "Insert 1", active: hl === "input" || hl === "arm" || vocalSel },
      { name: "Insert 2" }, { name: "Insert 3" }, { name: "Insert 4" }
    ];
    strips.forEach(function (st, i) {
      var x = 90 + i * 82;
      var w = 76;
      var selected = (st.master && masterSel) || st.active;
      inner += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + stripH + '" fill="' + (selected ? "#4A535D" : FLC.body) + '" stroke="' + FLC.edge + '" stroke-width="1"/>';
      // header label
      inner += '<text x="' + (x + w / 2) + '" y="' + (top + 14) + '" text-anchor="middle" font-family="var(--body)" font-size="9" font-weight="' + (st.master ? 700 : 500) + '" fill="' + (st.master ? FLC.txt : FLC.dim) + '">' + (st.master ? "Master" : i) + '</text>';
      // vertical name plate (like the rotated labels in the real mixer)
      inner += '<rect x="' + (x + 8) + '" y="' + (top + 22) + '" width="18" height="86" rx="3" fill="' + (selected ? "#525B66" : FLC.well) + '"/>';
      inner += '<text x="' + (x + 17) + '" y="' + (top + 100) + '" font-family="var(--body)" font-size="9.5" font-weight="600" fill="' + (selected ? FLC.txt : FLC.dim) + '" transform="rotate(-90 ' + (x + 17) + ' ' + (top + 100) + ')">' + esc(st.name) + '</text>';
      // lime LED + pan knob + dB readout
      inner += '<circle cx="' + (x + w - 22) + '" cy="' + (top + 34) + '" r="4.5" fill="#C3E14E" stroke="#7C9430" stroke-width="1"/>';
      inner += miniKnob(x + w - 22, top + 62, 10);
      inner += '<text x="' + (x + w - 22) + '" y="' + (top + 88) + '" text-anchor="middle" font-family="var(--mono)" font-size="8" fill="' + FLC.dim + '">-6.6</text>';
      // fader: master gets the green cap, like the real selected master
      var fx = x + w / 2 - 5;
      inner += '<rect x="' + fx + '" y="' + (top + 116) + '" width="10" height="140" rx="3" fill="' + FLC.lcdBg + '"/>';
      var capY = st.master ? top + 150 : (selected ? top + 168 : top + 184);
      var capCol = st.master ? "#9CC24E" : FLC.fader;
      inner += '<rect x="' + (fx - 8) + '" y="' + capY + '" width="26" height="20" rx="4" fill="' + capCol + '" stroke="' + FLC.edge + '" stroke-width="1.2"/>';
      inner += '<line x1="' + (fx - 5) + '" y1="' + (capY + 10) + '" x2="' + (fx + 15) + '" y2="' + (capY + 10) + '" stroke="' + (st.master ? "#5C7527" : "#6A727B") + '" stroke-width="1.8"/>';
      // pan arrows + arm dot bottom
      inner += '<text x="' + (x + w / 2) + '" y="' + (top + 274) + '" text-anchor="middle" font-family="var(--body)" font-size="8" fill="' + FLC.dim + '">◄ ►</text>';
      var armed = st.active;
      inner += '<circle cx="' + (x + w / 2) + '" cy="' + (top + 288) + '" r="5.5" fill="' + (armed ? FLC.red : FLC.well) + '" stroke="' + FLC.edge + '" stroke-width="1.2"/>' + (armed ? '<circle cx="' + (x + w / 2) + '" cy="' + (top + 288) + '" r="9" fill="none" stroke="' + FLC.red + '" stroke-width="1.4" opacity=".55"/>' : "");
      if (st.active && hl === "arm") inner += '<rect x="' + (x + w / 2 - 14) + '" y="' + (top + 274) + '" width="28" height="28" rx="9" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>' + pill(x + w / 2, top + 322, "Arm = this red dot");
      if (st.master && masterSel) inner += '<rect x="' + (x - 3) + '" y="' + (top - 3) + '" width="' + (w + 6) + '" height="' + (stripH + 6) + '" rx="5" fill="none" stroke="#9CC24E" stroke-width="2.5"/>';
    });

    // RIGHT panel: input selector + FX slots, like the real mixer
    var px = 512, pw = 214;
    inner += '<rect x="' + px + '" y="' + top + '" width="' + pw + '" height="' + stripH + '" fill="' + FLC.dark + '"/>';
    // audio input selector at the top of the panel
    var inActive = hl === "input" || hl === "arm";
    inner += '<rect x="' + (px + 8) + '" y="' + (top + 8) + '" width="' + (pw - 16) + '" height="22" rx="3" fill="' + (inActive ? FLC.lcdBg : FLC.well) + '" stroke="' + FLC.edge + '" stroke-width="1"/>';
    inner += '<text x="' + (px + 20) + '" y="' + (top + 23) + '" font-family="var(--body)" font-size="10" font-weight="' + (inActive ? 700 : 400) + '" fill="' + (inActive ? FLC.lcd : FLC.dim) + '">' + (inActive ? "IN:  Solo Input 1" : "(none)") + '</text>';
    if (hl === "input") inner += '<rect x="' + (px + 3) + '" y="' + (top + 2) + '" width="' + (pw - 6) + '" height="34" rx="7" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>' + pill(px + pw / 2, 368, "Set the mic input here");
    // FX slots
    var slotNames = masterSel
      ? ["Fruity parametric EQ 2", "Fruity Limiter", "Slot 3", "Slot 4", "Slot 5", "Slot 6", "Slot 7", "Slot 8"]
      : vocalSel
      ? ["Fruity parametric EQ 2", "Fruity Limiter", "Fruity Reeverb 2", "Fruity Delay 3", "Slot 5", "Slot 6", "Slot 7", "Slot 8"]
      : ["Slot 1", "Slot 2", "Slot 3", "Slot 4", "Slot 5", "Slot 6", "Slot 7", "Slot 8"];
    slotNames.forEach(function (nm, k) {
      var sy = top + 40 + k * 28;
      var lit = (masterSel && k < 2) || (vocalSel && k < 4);
      inner += '<rect x="' + (px + 8) + '" y="' + sy + '" width="' + (pw - 46) + '" height="22" rx="3" fill="' + (lit ? "#3D4650" : FLC.body) + '"/>';
      inner += '<path d="M ' + (px + 16) + ' ' + (sy + 7) + ' l 0 8 l 5 -4 Z" fill="' + FLC.dim + '"/>';
      inner += '<text x="' + (px + 28) + '" y="' + (sy + 15) + '" font-family="var(--body)" font-size="9.5" font-style="' + (lit ? "normal" : "italic") + '" fill="' + (lit ? FLC.txt : FLC.dim) + '">' + esc(nm) + '</text>';
      inner += '<circle cx="' + (px + pw - 26) + '" cy="' + (sy + 11) + '" r="7" fill="' + FLC.knob + '" stroke="' + FLC.ring + '" stroke-width="1.2"/>';
      inner += '<circle cx="' + (px + pw - 10) + '" cy="' + (sy + 11) + '" r="3" fill="' + (lit ? "#C3E14E" : FLC.well) + '"/>';
    });
    if (masterSel) inner += '<rect x="' + (px + 3) + '" y="' + (top + 36) + '" width="' + (pw - 6) + '" height="60" rx="7" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>' + pill(px + pw / 2, 368, "The mastering chain lives here");
    if (vocalSel) inner += '<rect x="' + (px + 3) + '" y="' + (top + 36) + '" width="' + (pw - 6) + '" height="116" rx="7" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>' + pill(px + pw / 2, 368, "Your vocal chain — top to bottom, in this order");
    // routing line at the bottom
    inner += '<rect x="' + (px + 8) + '" y="' + (top + stripH - 30) + '" width="' + (pw - 16) + '" height="22" rx="3" fill="' + FLC.well + '"/>';
    inner += '<text x="' + (px + 20) + '" y="' + (top + stripH - 15) + '" font-family="var(--body)" font-size="9.5" fill="' + FLC.dim + '">Out 1 - Out 2  (the Scarlett)</text>';
    return flWindow(760, 386, "Mixer - " + (masterSel ? "Master" : vocalSel ? "Insert 1 (Vocal)" : "Insert 1"), inner);
  };
  SVGX.mixerArm = function () { return SVGX.flMixer("input"); };
  SVGX.mixerMaster = function () { return SVGX.flMixer("master"); };
  SVGX.mixerVocal = function () { return SVGX.flMixer("vocal"); };

  /* Toolbar — the real transport cluster: menu row, PAT/SONG, play/stop/rec,
     BPM + time LCDs, pattern selector, metronome, MIDI light.
     hl: 'rec' | 'bpm' | 'metro' | 'midi' */
  SVGX.flToolbar = function (hl) {
    var inner = "";
    // menu row, like the top of the real window
    inner += '<text x="40" y="56" font-family="var(--body)" font-size="10" letter-spacing=".04em" fill="' + FLC.dim + '">FILE&#160;&#160;EDIT&#160;&#160;ADD&#160;&#160;PATTERNS&#160;&#160;VIEW&#160;&#160;OPTIONS&#160;&#160;TOOLS&#160;&#160;HELP</text>';
    var y = 72, cy = y + 20;
    // PAT / SONG stacked toggle
    inner += '<rect x="40" y="' + y + '" width="52" height="40" rx="4" fill="' + FLC.dark + '" stroke="' + FLC.edge + '" stroke-width="1.4"/>';
    inner += '<text x="66" y="' + (y + 17) + '" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="800" fill="' + FLC.or + '">PAT</text>';
    inner += '<text x="66" y="' + (y + 33) + '" text-anchor="middle" font-family="var(--body)" font-size="9" font-weight="600" fill="' + FLC.dim + '">SONG</text>';
    // transport cluster
    inner += '<rect x="100" y="' + y + '" width="128" height="40" rx="4" fill="' + FLC.dark + '" stroke="' + FLC.edge + '" stroke-width="1.4"/>';
    inner += '<path d="M 118 ' + (cy - 10) + ' L 118 ' + (cy + 10) + ' L 136 ' + cy + ' Z" fill="' + FLC.green + '"/>';
    inner += '<rect x="152" y="' + (cy - 9) + '" width="17" height="18" rx="2" fill="' + FLC.txt + '"/>';
    inner += '<circle cx="200" cy="' + cy + '" r="10" fill="' + FLC.red + '" stroke="#8E2F2C" stroke-width="1.6"/>';
    if (hl === "rec") inner += '<rect x="184" y="' + (cy - 17) + '" width="34" height="34" rx="10" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>' + pill(200, 152, "Record");
    // BPM LCD
    inner += lcd(240, y, 96, 40, "120.000", 15.5);
    inner += '<text x="288" y="' + (y + 54) + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" fill="' + FLC.dim + '">BPM — drag to change</text>';
    if (hl === "bpm") inner += '<rect x="234" y="' + (y - 6) + '" width="108" height="52" rx="9" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>' + pill(288, 152, "Set the tempo first");
    // time LCD
    inner += lcd(348, y, 92, 40, "0:00:00", 14);
    // pattern selector
    inner += '<rect x="452" y="' + y + '" width="104" height="40" rx="4" fill="' + FLC.well + '" stroke="' + FLC.edge + '" stroke-width="1.4"/>';
    inner += '<text x="504" y="' + (cy + 4) + '" text-anchor="middle" font-family="var(--body)" font-size="11" font-weight="600" fill="' + FLC.txt + '">Pattern 1</text>';
    // metronome
    inner += '<rect x="568" y="' + y + '" width="44" height="40" rx="4" fill="' + FLC.dark + '" stroke="' + FLC.edge + '" stroke-width="1.4"/>';
    inner += '<path d="M 583 ' + (cy + 11) + ' L 590 ' + (cy - 12) + ' L 597 ' + (cy + 11) + ' Z" fill="none" stroke="' + FLC.txt + '" stroke-width="2"/>';
    inner += '<line x1="590" y1="' + (cy + 5) + '" x2="596" y2="' + (cy - 8) + '" stroke="' + FLC.or + '" stroke-width="2"/>';
    if (hl === "metro") inner += '<rect x="562" y="' + (y - 6) + '" width="56" height="52" rx="9" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>' + pill(560, 152, "Metronome on");
    // midi activity light
    inner += '<rect x="624" y="' + y + '" width="56" height="40" rx="4" fill="' + FLC.dark + '" stroke="' + FLC.edge + '" stroke-width="1.4"/>';
    inner += '<circle cx="642" cy="' + cy + '" r="6" fill="' + FLC.green + '"/>';
    inner += '<text x="666" y="' + (cy + 3.5) + '" text-anchor="middle" font-family="var(--body)" font-size="8.5" fill="' + FLC.dim + '">MIDI</text>';
    if (hl === "midi") inner += '<rect x="618" y="' + (y - 6) + '" width="68" height="52" rx="9" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>' + pill(560, 152, "Flickers when a key arrives");
    return flWindow(720, 172, "FL Studio — top toolbar", inner);
  };
  SVGX.toolbarRec = function () { return SVGX.flToolbar("rec"); };

  /* Playlist — track rows left, numbered timeline, 4-bar shading, pattern clips */
  SVGX.flPlaylist = function () {
    var top = 42, x0 = 34, trackW = 96, gridX = x0 + trackW, gridW = 760 - 68 - trackW;
    var rows = 5, rowH = 44, barW = gridW / 16;
    var h = top + 26 + rows * rowH + 24;
    var inner = "";
    // timeline header with bar numbers
    inner += '<rect x="' + x0 + '" y="' + top + '" width="' + (760 - 68) + '" height="24" fill="' + FLC.dark + '"/>';
    for (var bnum = 1; bnum <= 16; bnum += 2) {
      inner += '<text x="' + (gridX + (bnum - 1) * barW + 4) + '" y="' + (top + 16) + '" font-family="var(--mono)" font-size="9" fill="' + FLC.dim + '">' + bnum + '</text>';
    }
    // track rows + grid
    var names = ["Track 1", "Track 2", "Track 3", "Track 4", "Track 5"];
    for (var r = 0; r < rows; r++) {
      var y = top + 26 + r * rowH;
      inner += '<rect x="' + x0 + '" y="' + y + '" width="' + trackW + '" height="' + (rowH - 2) + '" fill="#333B44"/>';
      inner += '<text x="' + (x0 + 10) + '" y="' + (y + 26) + '" font-family="var(--body)" font-size="10.5" fill="' + FLC.dim + '">' + names[r] + '</text>';
      inner += '<circle cx="' + (x0 + trackW - 12) + '" cy="' + (y + rowH / 2) + '" r="4" fill="' + FLC.cyan + '"/>';
      // 4-bar alternating shading
      for (var b4 = 0; b4 < 4; b4++) {
        inner += '<rect x="' + (gridX + b4 * 4 * barW) + '" y="' + y + '" width="' + (4 * barW) + '" height="' + (rowH - 2) + '" fill="' + (b4 % 2 ? "#2B3641" : "#26313B") + '"/>';
      }
      // bar lines
      for (var bl = 1; bl < 16; bl++) {
        inner += '<line x1="' + (gridX + bl * barW) + '" y1="' + y + '" x2="' + (gridX + bl * barW) + '" y2="' + (y + rowH - 2) + '" stroke="#3A4650" stroke-width="' + (bl % 4 === 0 ? 1.4 : 0.6) + '"/>';
      }
    }
    // pattern clips: little title bar + body, like real playlist clips
    function clip(track, fromBar, toBar, name, col) {
      var y = top + 26 + track * rowH + 3;
      var cx = gridX + (fromBar - 1) * barW, cw = (toBar - fromBar + 1) * barW - 3;
      var s2 = '<rect x="' + cx + '" y="' + y + '" width="' + cw + '" height="' + (rowH - 8) + '" rx="3" fill="' + col + '" opacity=".32"/>';
      s2 += '<rect x="' + cx + '" y="' + y + '" width="' + cw + '" height="12" rx="3" fill="' + col + '"/>';
      s2 += '<text x="' + (cx + 5) + '" y="' + (y + 9.5) + '" font-family="var(--body)" font-size="8.5" font-weight="600" fill="#F2F4F6">' + esc(name) + '</text>';
      // fake note blobs in the body
      for (var nb = 0; nb < Math.min(6, toBar - fromBar + 2); nb++) {
        s2 += '<rect x="' + (cx + 6 + nb * (cw - 12) / 6) + '" y="' + (y + 17 + (nb % 3) * 5) + '" width="' + Math.max(6, (cw - 12) / 8) + '" height="3.5" rx="1.5" fill="' + col + '" opacity=".85"/>';
      }
      return s2;
    }
    inner += clip(0, 1, 8, "Drums — verse", "#6E8B3D");
    inner += clip(0, 9, 16, "Drums — chorus", "#8FAF4A");
    inner += clip(1, 1, 16, "Piano chords", "#4E7FA5");
    inner += clip(2, 5, 16, "Bass", "#6E5E92");
    inner += clip(3, 9, 16, "Guitar chops", "#B58A3E");
    inner += clip(4, 9, 16, "Vocal", "#B05A5E");
    inner += pill(400, h - 16, "Drag patterns onto tracks — this timeline IS the song");
    return flWindow(760, h, "Playlist - Arrangement", inner);
  };

  /* ---------- gain halo states ---------- */

  SVGX.gainHalo = function () {
    var s = '<svg viewBox="0 0 700 190" role="img" aria-label="Gain ring colours">';
    function state(x, halo, title, sub, tone) {
      var r = '';
      r += knob(x, 74, 27, halo);
      r += '<text x="' + x + '" y="136" text-anchor="middle" font-family="var(--display)" font-size="15" font-weight="700" fill="' + tone + '">' + esc(title) + '</text>';
      r += '<text x="' + x + '" y="157" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-soft)">' + esc(sub) + '</text>';
      return r;
    }
    s += state(130, null, "No light", "too quiet — turn up", "var(--ink-soft)");
    s += state(350, "#3BB273", "Green", "healthy — this is the aim", "var(--good)");
    s += state(570, "#E5484D", "Red", "clipped — permanent damage, back off", "var(--stop)");
    s += '</svg>';
    return s;
  };

  /* ---------- echo two-paths ---------- */

  SVGX.echoPaths = function () {
    var s = '<svg viewBox="0 0 760 300" role="img" aria-label="Why you hear yourself twice">';
    s += nodeBox(30, 110, 130, 60, "Your voice", "the mic");
    s += nodeBox(300, 40, 200, 60, "Scarlett direct", "instant", "red");
    s += nodeBox(300, 190, 200, 60, "Through the Mac", "a few ms late");
    s += nodeBox(600, 110, 130, 60, "Headphones");
    s += wire(160, 130, 300, 70, "path 1");
    s += wire(160, 152, 300, 220, "path 2");
    s += wire(500, 70, 600, 130, "");
    s += wire(500, 220, 600, 152, "");
    s += '<text x="380" y="285" text-anchor="middle" font-family="var(--body)" font-size="13.5" font-weight="650" fill="var(--stop)">Both on at once = the echo. Keep path 1, switch path 2 off in FL.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- keyboard drum map ---------- */

  SVGX.drumMap = function () {
    var s = '<svg viewBox="0 0 760 240" role="img" aria-label="Drum kit layout on the keyboard">';
    var whites = ["C", "D", "E", "F", "G", "A", "B", "C"];
    var map = { 0: "Kick", 1: "Snare", 2: "Clap" };
    var ww = 82, x0 = 40, y0 = 40, wh = 130;
    for (var i = 0; i < 8; i++) {
      var x = x0 + i * ww;
      s += '<rect x="' + x + '" y="' + y0 + '" width="' + (ww - 3) + '" height="' + wh + '" rx="6" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.6"/>';
      s += '<text x="' + (x + ww / 2 - 2) + '" y="' + (y0 + wh - 12) + '" text-anchor="middle" font-family="var(--mono)" font-size="12" fill="var(--ink-faint)">' + whites[i] + '</text>';
      if (map[i] !== undefined) {
        s += '<rect x="' + (x + 6) + '" y="' + (y0 + wh + 14) + '" width="' + (ww - 15) + '" height="26" rx="13" fill="var(--accent)"/>';
        s += '<text x="' + (x + ww / 2 - 2) + '" y="' + (y0 + wh + 31) + '" text-anchor="middle" font-family="var(--body)" font-size="11.5" font-weight="700" fill="#fff">' + map[i] + '</text>';
      }
    }
    // black keys: after C,D then F,G,A → positions 0,1,3,4,5
    [0, 1, 3, 4, 5].forEach(function (i) {
      var x = x0 + (i + 1) * ww - 26;
      var isFs = i === 3, isAs = i === 5;
      s += '<rect x="' + x + '" y="' + y0 + '" width="46" height="78" rx="5" fill="var(--ink)" />';
      if (isFs) {
        s += '<rect x="' + (x - 8) + '" y="' + (y0 - 32) + '" width="62" height="24" rx="12" fill="var(--accent)"/>';
        s += '<text x="' + (x + 23) + '" y="' + (y0 - 16) + '" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="700" fill="#fff">Closed hat</text>';
        s += '<line x1="' + (x + 23) + '" y1="' + (y0 - 8) + '" x2="' + (x + 23) + '" y2="' + (y0 + 8) + '" stroke="var(--accent)" stroke-width="2"/>';
      }
      if (isAs) {
        s += '<rect x="' + (x - 8) + '" y="' + (y0 - 32) + '" width="62" height="24" rx="12" fill="var(--accent)"/>';
        s += '<text x="' + (x + 23) + '" y="' + (y0 - 16) + '" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="700" fill="#fff">Open hat</text>';
        s += '<line x1="' + (x + 23) + '" y1="' + (y0 - 8) + '" x2="' + (x + 23) + '" y2="' + (y0 + 8) + '" stroke="var(--accent)" stroke-width="2"/>';
      }
    });
    s += '<text x="380" y="232" text-anchor="middle" font-family="var(--body)" font-size="12.5" fill="var(--ink-soft)">The low octaves of any drum kit preset — each key a different drum, not a different pitch</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- keyboard zones: which keys do which job ---------- */
  SVGX.kbZones = function () {
    var s = '<svg viewBox="0 0 760 360" role="img" aria-label="The keyboard, split into its working zones">';
    var x0 = 26, y0 = 120, ww = 34, wh = 110, nWhite = 21; // C2..B4 = 3 octaves
    var wg = lingrad([[0, "#FFFFFF"], [0.85, "#F2F0EC"], [1, "#DEDAD4"]], true);
    var bg = lingrad([[0, "#3A3733"], [0.5, "#16130F"], [1, "#000000"]], true);
    s += wg.m + bg.m;
    // zone bands above the keys
    var zones = [
      { from: 0, to: 7, n: "BASS ZONE", sub: "808s & bass — one note at a time", col: "var(--accent)" },
      { from: 7, to: 14, n: "CHORD ZONE", sub: "piano chords, pads, guitar", col: "#7A6FB8" },
      { from: 14, to: 21, n: "MELODY ZONE", sub: "riffs, leads, hooks", col: "#3E8FB8" }
    ];
    zones.forEach(function (z) {
      var zx = x0 + z.from * ww, zw = (z.to - z.from) * ww - 2;
      s += '<rect x="' + zx + '" y="34" width="' + zw + '" height="52" rx="9" fill="' + z.col + '" opacity=".16"/>';
      s += '<rect x="' + zx + '" y="34" width="' + zw + '" height="52" rx="9" fill="none" stroke="' + z.col + '" stroke-width="1.8"/>';
      s += '<text x="' + (zx + zw / 2) + '" y="55" text-anchor="middle" font-family="var(--display)" font-size="13.5" font-weight="800" fill="var(--ink)">' + z.n + '</text>';
      s += '<text x="' + (zx + zw / 2) + '" y="73" text-anchor="middle" font-family="var(--body)" font-size="10" fill="var(--ink-soft)">' + z.sub + '</text>';
      s += '<line x1="' + (zx + zw / 2) + '" y1="88" x2="' + (zx + zw / 2) + '" y2="' + (y0 - 6) + '" stroke="' + z.col + '" stroke-width="1.6" stroke-dasharray="4 4" opacity=".7"/>';
    });
    // white keys
    var names = ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"];
    for (var i = 0; i < nWhite; i++) {
      var x = x0 + i * ww;
      var isMidC = names[i] === "C4";
      s += '<rect x="' + x + '" y="' + y0 + '" width="' + (ww - 2.5) + '" height="' + wh + '" rx="4" fill="url(#' + wg.id + ')" stroke="' + (isMidC ? "var(--accent)" : "#B9B4AC") + '" stroke-width="' + (isMidC ? 2.2 : 1.2) + '"/>';
      if (names[i][0] === "C") s += '<text x="' + (x + ww / 2 - 1) + '" y="' + (y0 + wh - 9) + '" text-anchor="middle" font-family="var(--mono)" font-size="10" font-weight="' + (isMidC ? 800 : 500) + '" fill="' + (isMidC ? "var(--accent-deep)" : "#9A958D") + '">' + names[i] + '</text>';
    }
    // black keys (pattern per octave at white indices +0(C#),+1(D#),+3(F#),+4(G#),+5(A#))
    for (var oct = 0; oct < 3; oct++) {
      [0, 1, 3, 4, 5].forEach(function (k) {
        var wi = oct * 7 + k;
        var bx = x0 + (wi + 1) * ww - 12;
        s += '<rect x="' + (bx + 1.5) + '" y="' + (y0 + 1) + '" width="21" height="66" rx="3" fill="#000" opacity=".3"/>';
        s += '<rect x="' + bx + '" y="' + y0 + '" width="21" height="65" rx="3" fill="url(#' + bg.id + ')"/>';
        s += '<rect x="' + (bx + 3) + '" y="' + (y0 + 2) + '" width="15" height="30" rx="2.5" fill="#FFFFFF" opacity=".1"/>';
      });
    }
    // middle C flag
    s += '<path d="M ' + (x0 + 14 * ww + ww / 2 - 1) + ' ' + (y0 + wh + 6) + ' l 0 12" stroke="var(--accent)" stroke-width="2"/>';
    s += pill(x0 + 14 * ww + ww / 2 - 1, y0 + wh + 30, "MIDDLE C — home base");
    // vocal range bracket
    var vx1 = x0 + 12 * ww, vx2 = x0 + 21 * ww - 4;
    s += '<path d="M ' + vx1 + ' ' + (y0 + wh + 52) + ' l 0 8 L ' + vx2 + ' ' + (y0 + wh + 60) + ' l 0 -8" fill="none" stroke="#3E8FB8" stroke-width="2.2"/>';
    s += '<text x="500" y="' + (y0 + wh + 80) + '" text-anchor="middle" font-family="var(--body)" font-size="11" font-weight="700" fill="#3E8FB8">a singer’s range sits about here — write melodies where you sing</text>';
    s += '<text x="380" y="' + (y0 + wh + 104) + '" text-anchor="middle" font-family="var(--body)" font-size="11" fill="var(--ink-soft)">Your keyboard shows fewer keys than this — the OCTAVE +/− buttons slide its window up and down this map.</text>';
    return s + '</svg>';
  };

  /* ---------- the FULL drum kit on the keys — every drum, colour-coded ---------- */
  SVGX.drumKitFull = function () {
    var s = '<svg viewBox="0 0 760 350" role="img" aria-label="The full drum kit laid across the keyboard">';
    var x0 = 40, y0 = 120, ww = 52, wh = 96;
    var wg = lingrad([[0, "#FFFFFF"], [0.85, "#F2F0EC"], [1, "#DEDAD4"]], true);
    var bg = lingrad([[0, "#3A3733"], [0.5, "#16130F"], [1, "#000000"]], true);
    s += wg.m + bg.m;
    var FAM = { low: "var(--accent)", crack: "#7A6FB8", metal: "#C99A2E", tom: "#3E8FB8", perc: "#4E9E6A" };
    // white keys C..C (8) with labels below
    var whites = [
      { n: "C", d: "KICK", fam: "low", why: "the heartbeat" },
      { n: "D", d: "SNARE", fam: "crack", why: "the backbeat crack" },
      { n: "E", d: "SNAP", fam: "crack", why: "softer finger-snap" },
      { n: "F", d: "TOM low", fam: "tom", why: "fills, rolling down" },
      { n: "G", d: "TOM mid", fam: "tom", why: "fills" },
      { n: "A", d: "TOM high", fam: "tom", why: "fills, rolling up" },
      { n: "B", d: "RIDE", fam: "metal", why: "washy ting-ting" },
      { n: "C", d: "CRASH", fam: "metal", why: "the big arrival" }
    ];
    whites.forEach(function (w, i) {
      var x = x0 + i * ww;
      s += '<rect x="' + x + '" y="' + y0 + '" width="' + (ww - 3) + '" height="' + wh + '" rx="5" fill="url(#' + wg.id + ')" stroke="#B9B4AC" stroke-width="1.3"/>';
      s += '<text x="' + (x + ww / 2 - 1) + '" y="' + (y0 + wh - 8) + '" text-anchor="middle" font-family="var(--mono)" font-size="10.5" fill="#9A958D">' + w.n + '</text>';
      // label chip below
      var cy = y0 + wh + 16 + (i % 2) * 40;
      s += '<line x1="' + (x + ww / 2 - 1) + '" y1="' + (y0 + wh + 2) + '" x2="' + (x + ww / 2 - 1) + '" y2="' + (cy - 2) + '" stroke="' + FAM[w.fam] + '" stroke-width="1.6" stroke-dasharray="3 3" opacity=".8"/>';
      s += '<rect x="' + (x - 2) + '" y="' + cy + '" width="' + (ww + 1) + '" height="20" rx="10" fill="' + FAM[w.fam] + '"/>';
      s += '<text x="' + (x + ww / 2 - 1) + '" y="' + (cy + 13.5) + '" text-anchor="middle" font-family="var(--body)" font-size="9" font-weight="800" fill="#fff">' + w.d + '</text>';
      s += '<text x="' + (x + ww / 2 - 1) + '" y="' + (cy + 33) + '" text-anchor="middle" font-family="var(--body)" font-size="8" fill="var(--ink-soft)">' + w.why + '</text>';
    });
    // black keys with their drums, labels above
    var blacks = [
      { after: 0, d: "RIM", fam: "crack", why: "tick — ballad backbeat" },
      { after: 1, d: "CLAP", fam: "crack", why: "snare's best friend" },
      { after: 3, d: "CLOSED HAT", fam: "metal", why: "the tick-tick engine" },
      { after: 4, d: "PEDAL HAT", fam: "metal", why: "soft chick" },
      { after: 5, d: "OPEN HAT", fam: "metal", why: "tsss — the offbeat breath" }
    ];
    blacks.forEach(function (b, j) {
      var bx = x0 + (b.after + 1) * ww - 16;
      s += '<rect x="' + (bx + 1.5) + '" y="' + (y0 + 1) + '" width="29" height="58" rx="4" fill="#000" opacity=".3"/>';
      s += '<rect x="' + bx + '" y="' + y0 + '" width="29" height="57" rx="4" fill="url(#' + bg.id + ')"/>';
      s += '<rect x="' + (bx + 4) + '" y="' + (y0 + 2) + '" width="21" height="26" rx="3" fill="#FFFFFF" opacity=".1"/>';
      var cy = 26 + (j % 2) * 38;
      s += '<line x1="' + (bx + 14) + '" y1="' + (cy + 22) + '" x2="' + (bx + 14) + '" y2="' + (y0 - 2) + '" stroke="' + FAM[b.fam] + '" stroke-width="1.6" stroke-dasharray="3 3" opacity=".8"/>';
      var pw = b.d.length * 6.4 + 18;
      s += '<rect x="' + (bx + 14 - pw / 2) + '" y="' + cy + '" width="' + pw + '" height="19" rx="9.5" fill="' + FAM[b.fam] + '"/>';
      s += '<text x="' + (bx + 14) + '" y="' + (cy + 13) + '" text-anchor="middle" font-family="var(--body)" font-size="8.5" font-weight="800" fill="#fff">' + b.d + '</text>';
      s += '<text x="' + (bx + 14) + '" y="' + (cy + 32) + '" text-anchor="middle" font-family="var(--body)" font-size="8" fill="var(--ink-soft)">' + b.why + '</text>';
    });
    // family legend
    var leg = [["low", "LOW — the power"], ["crack", "BACKBEAT — the crack"], ["metal", "CYMBALS — the motion"], ["tom", "TOMS — the fills"]];
    var lx0 = 62, ly0 = 322;
    leg.forEach(function (l, i) {
      var lx = lx0 + i * 168;
      s += '<circle cx="' + lx + '" cy="' + ly0 + '" r="6" fill="' + FAM[l[0]] + '"/>';
      s += '<text x="' + (lx + 12) + '" y="' + (ly0 + 4) + '" font-family="var(--body)" font-size="10.5" font-weight="600" fill="var(--ink-soft)">' + l[1] + '</text>';
    });
    return s + '</svg>';
  };

  /* ---------- verse → chorus: what the drums do at the lift ---------- */
  SVGX.chorusLift = function () {
    var s = '<svg viewBox="0 0 760 490" role="img" aria-label="How the drums change when the chorus arrives">';
    var rows = ["Kick", "Snare", "Cl. hat", "Op. hat", "Crash"];
    var verse = [[1, 7, 9], [5, 13], [1, 3, 5, 7, 9, 11, 13, 15], [], []];
    var chorus = [[1, 4, 7, 9, 12], [5, 13], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], [3, 7, 11, 15], [1]];
    var fill = [13, 14, 15, 16]; // snare fill cells at the end of the verse
    function grid(gy, title, data, isChorus, added) {
      var g = '<text x="40" y="' + (gy - 10) + '" font-family="var(--display)" font-size="14.5" font-weight="800" fill="var(--ink)">' + title + '</text>';
      var x0 = 110, cw = 36, rh = 30;
      rows.forEach(function (rn, r) {
        var y = gy + r * rh;
        g += '<text x="' + (x0 - 10) + '" y="' + (y + 19) + '" text-anchor="end" font-family="var(--body)" font-size="10.5" font-weight="600" fill="var(--ink-soft)">' + rn + '</text>';
        for (var c = 1; c <= 16; c++) {
          var x = x0 + (c - 1) * cw + (c > 4 ? 5 : 0) + (c > 8 ? 5 : 0) + (c > 12 ? 5 : 0);
          var on = data[r].indexOf(c) > -1;
          var isNew = isChorus && added[r] && added[r].indexOf(c) > -1;
          var isFill = !isChorus && r === 1 && fill.indexOf(c) > -1;
          if (on || isFill) {
            var col = isNew ? "#C99A2E" : isFill ? "#D9A24C" : "var(--accent)";
            g += '<rect x="' + x + '" y="' + (y + 2) + '" width="' + (cw - 8) + '" height="' + (rh - 8) + '" rx="5" fill="' + col + '"' + (isFill ? ' opacity=".8"' : "") + '/>';
            if (isFill) g += '<rect x="' + x + '" y="' + (y + 2) + '" width="' + (cw - 8) + '" height="' + (rh - 8) + '" rx="5" fill="none" stroke="#8A5F1E" stroke-width="1.4" stroke-dasharray="4 3"/>';
          } else {
            g += '<rect x="' + x + '" y="' + (y + 2) + '" width="' + (cw - 8) + '" height="' + (rh - 8) + '" rx="5" fill="var(--surface-sunk)" stroke="var(--line)" stroke-width="0.8"/>';
          }
        }
      });
      return g;
    }
    s += grid(58, "LAST BAR OF THE VERSE", verse, false, null);
    // fill annotation — above the grid, clear of the cells
    s += '<text x="560" y="40" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="700" fill="#8A5F1E">the FILL — snare roll announcing the chorus</text>';
    s += '<path d="M 620 46 L 620 84" stroke="#8A5F1E" stroke-width="1.8" stroke-dasharray="4 3"/>';
    s += '<path d="M 615 80 L 620 89 L 625 80 Z" fill="#8A5F1E"/>';
    // arrow between
    s += '<path d="M 380 222 L 380 248" stroke="var(--accent)" stroke-width="3"/>';
    s += '<path d="M 372 246 L 380 258 L 388 246 Z" fill="var(--accent)"/>';
    s += '<text x="398" y="243" font-family="var(--body)" font-size="11" font-weight="700" fill="var(--accent-deep)">the lift</text>';
    var addedRows = [[4, 12], [], [2, 4, 6, 8, 10, 12, 14, 16], [3, 7, 11, 15], [1]];
    s += grid(288, "FIRST BAR OF THE CHORUS", chorus, true, addedRows);
    // legend
    s += '<circle cx="120" cy="466" r="6" fill="var(--accent)"/><text x="132" y="470" font-family="var(--body)" font-size="10.5" fill="var(--ink-soft)">already there</text>';
    s += '<circle cx="240" cy="466" r="6" fill="#C99A2E"/><text x="252" y="470" font-family="var(--body)" font-size="10.5" fill="var(--ink-soft)">NEW in the chorus — hats double, open hat breathes, crash on 1, kick busier</text>';
    return s + '</svg>';
  };

  /* ---------- hat roll ---------- */

  SVGX.hatRoll = function () {
    var s = '<svg viewBox="0 0 760 230" role="img" aria-label="Hi-hat roll — smaller subdivisions with rising velocity">';
    var x0 = 50, cw = 40, y0 = 46;
    s += '<text x="' + x0 + '" y="30" font-family="var(--body)" font-size="12.5" font-weight="700" fill="var(--ink)">One beat of normal 1/16 hats…</text>';
    for (var i = 0; i < 4; i++) {
      s += '<rect x="' + (x0 + i * cw) + '" y="' + y0 + '" width="34" height="34" rx="6" fill="var(--accent)"/>';
    }
    s += '<text x="' + (x0 + 4 * cw + 24) + '" y="' + (y0 + 23) + '" font-family="var(--body)" font-size="13" fill="var(--ink-soft)">→ becomes 1/32 for one beat:</text>';
    var x1 = 420, cw2 = 34;
    var vels = [0.3, 0.4, 0.5, 0.62, 0.72, 0.82, 0.9, 1];
    for (var j = 0; j < 8; j++) {
      var h = 12 + vels[j] * 60;
      s += '<rect x="' + (x1 + j * cw2) + '" y="' + (y0 + 68 - h) + '" width="28" height="' + h + '" rx="5" fill="var(--accent)" opacity="' + (0.45 + vels[j] * 0.55) + '"/>';
    }
    s += '<path d="M ' + x1 + ' ' + (y0 + 82) + ' L ' + (x1 + 8 * cw2 - 6) + ' ' + (y0 + 82) + '" stroke="var(--ink-faint)" stroke-width="1.6"/>';
    s += '<text x="' + (x1 + 4 * cw2) + '" y="' + (y0 + 100) + '" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-soft)">velocity ramps quiet → loud</text>';
    s += '<text x="380" y="205" text-anchor="middle" font-family="var(--body)" font-size="12.5" fill="var(--ink-soft)">The trap “tikatika” = the same hat, twice as dense, swelling in. Once per phrase, not everywhere.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- kick/808 interlock ---------- */

  SVGX.interlock = function () {
    var s = '<svg viewBox="0 0 760 240" role="img" aria-label="Kick and 808 locking together">';
    var x0 = 120, w = 600, y1 = 60, y2 = 140;
    s += '<text x="' + (x0 - 14) + '" y="' + (y1 + 5) + '" text-anchor="end" font-family="var(--body)" font-size="13" font-weight="700" fill="var(--ink)">Kick</text>';
    s += '<text x="' + (x0 - 14) + '" y="' + (y2 + 5) + '" text-anchor="end" font-family="var(--body)" font-size="13" font-weight="700" fill="var(--ink)">808 / bass</text>';
    s += '<line x1="' + x0 + '" y1="' + (y1 + 22) + '" x2="' + (x0 + w) + '" y2="' + (y1 + 22) + '" stroke="var(--line)" stroke-width="1.5"/>';
    var kicks = [0, 0.22, 0.5, 0.72];
    kicks.forEach(function (k) {
      s += '<circle cx="' + (x0 + k * w + 14) + '" cy="' + y1 + '" r="13" fill="var(--accent)"/>';
    });
    var chords = [{ p: 0, n: "C" }, { p: 0.25, n: "A" }, { p: 0.5, n: "F" }, { p: 0.75, n: "G" }];
    chords.forEach(function (c, i) {
      var bw = w * 0.21;
      var bx = x0 + c.p * w;
      s += '<rect x="' + bx + '" y="' + (y2 - 16) + '" width="' + bw + '" height="32" rx="9" fill="color-mix(in srgb, var(--accent) 72%, var(--ink))"/>';
      s += '<text x="' + (bx + bw / 2) + '" y="' + (y2 + 6) + '" text-anchor="middle" font-family="var(--mono)" font-size="14" font-weight="800" fill="#fff">' + c.n + '</text>';
    });
    // alignment guides
    kicks.forEach(function (k, i) {
      if (i === 1 || i === 3) return;
      var gx = x0 + k * w + 14;
      s += '<line x1="' + gx + '" y1="' + (y1 + 14) + '" x2="' + (gx - 14) + '" y2="' + (y2 - 18) + '" stroke="var(--ink-faint)" stroke-width="1.6" stroke-dasharray="4 4"/>';
    });
    s += '<text x="' + (x0 + w / 2) + '" y="200" text-anchor="middle" font-family="var(--body)" font-size="12.5" fill="var(--ink-soft)">The 808 notes are just the roots of your chords — C, A, F, G — landing with the kick.</text>';
    s += '<text x="' + (x0 + w / 2) + '" y="222" text-anchor="middle" font-family="var(--body)" font-size="12.5" fill="var(--ink-soft)">Muddy low end? Shorten the 808 so it isn’t ringing when the next kick hits.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- vocal space ---------- */

  SVGX.vocalSpace = function () {
    var s = '<svg viewBox="0 0 760 250" role="img" aria-label="Where each element sits, high to low">';
    var rows = [
      { y: 46,  label: "HIGH", items: "hi-hats · shakers · sparkle", tone: "var(--surface-sunk)", txt: "var(--ink-soft)" },
      { y: 106, label: "MIDDLE", items: "THE VOICE — keep this lane clear", tone: "var(--accent-wash)", txt: "var(--accent-deep)", star: true },
      { y: 166, label: "LOW", items: "kick · 808 · bass", tone: "var(--surface-sunk)", txt: "var(--ink-soft)" }
    ];
    rows.forEach(function (r) {
      s += '<rect x="120" y="' + r.y + '" width="590" height="48" rx="12" fill="' + r.tone + '" stroke="' + (r.star ? "var(--accent)" : "var(--line-strong)") + '" stroke-width="' + (r.star ? 2.2 : 1.4) + '"/>';
      s += '<text x="102" y="' + (r.y + 30) + '" text-anchor="end" font-family="var(--mono)" font-size="11.5" font-weight="700" letter-spacing=".08em" fill="var(--ink-faint)">' + r.label + '</text>';
      s += '<text x="415" y="' + (r.y + 30) + '" text-anchor="middle" font-family="var(--body)" font-size="' + (r.star ? 15 : 13.5) + '" font-weight="' + (r.star ? 800 : 600) + '" fill="' + r.txt + '">' + esc(r.items) + '</text>';
    });
    s += '<text x="415" y="240" text-anchor="middle" font-family="var(--body)" font-size="12.5" fill="var(--ink-soft)">Drums frame the voice from above and below. Busy mid-range instruments are what fight a singer.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- song arc ---------- */

  SVGX.songArc = function () {
    var s = '<svg viewBox="0 0 760 220" role="img" aria-label="Song energy shape">';
    var parts = [
      { n: "Intro", b: 4, e: 0.25 }, { n: "Verse 1", b: 16, e: 0.42 }, { n: "Pre", b: 8, e: 0.58 },
      { n: "Chorus", b: 16, e: 0.9 }, { n: "Verse 2", b: 16, e: 0.5 }, { n: "Chorus", b: 16, e: 0.92 },
      { n: "Bridge", b: 8, e: 0.35 }, { n: "Chorus", b: 16, e: 1 }, { n: "Out", b: 4, e: 0.3 }
    ];
    var total = 0; parts.forEach(function (p) { total += p.b; });
    var x = 40, W = 680, base = 160, maxH = 110;
    parts.forEach(function (p) {
      var w = (p.b / total) * W - 4;
      var h = p.e * maxH;
      var isC = p.n === "Chorus";
      s += '<rect x="' + x + '" y="' + (base - h) + '" width="' + w + '" height="' + h + '" rx="7" fill="' + (isC ? "var(--accent)" : "color-mix(in srgb, var(--accent) 32%, var(--surface-sunk))") + '"/>';
      s += '<text x="' + (x + w / 2) + '" y="' + (base + 20) + '" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="' + (isC ? 800 : 500) + '" fill="' + (isC ? "var(--accent-deep)" : "var(--ink-soft)") + '">' + esc(p.n) + '</text>';
      s += '<text x="' + (x + w / 2) + '" y="' + (base + 36) + '" text-anchor="middle" font-family="var(--mono)" font-size="9.5" fill="var(--ink-faint)">' + p.b + '</text>';
      x += w + 4;
    });
    s += '<text x="380" y="205" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">Height = how full the arrangement is. The verses stay low so the choruses have somewhere to go. Numbers are bars.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- The vocal chain: order matters — the full annotated signal flow.
     Each stage card shows WHAT THE SOUND LOOKS LIKE as it leaves that stage. ---------- */
  SVGX.vocalChain = function () {
    var s = '<svg viewBox="0 0 760 400" role="img" aria-label="The vocal effects chain — what each stage does to the sound">';
    var stages = [
      { n: "Your voice", plug: "recorded dry", knob: "sing close & green", viz: "dry", tone: "red" },
      { n: "1 · EQ", plug: "Parametric EQ 2", knob: "moves of 2–3 dB", viz: "eq" },
      { n: "2 · Compress", plug: "Fruity Limiter", knob: "THRES → 3–4 dB dip", viz: "comp" },
      { n: "3 · Reverb", plug: "Fruity Reeverb 2", knob: "WET ≈ 20%", viz: "verb" },
      { n: "4 · Delay", plug: "Fruity Delay 3", knob: "sync 1/4 · mix low", viz: "delay" }
    ];
    var cw = 136, gap = 14, x0 = 15, top = 34, chd = 150;
    function viz(kind, x, y, w, h) {
      var v = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" fill="#171C21" stroke="#20262C" stroke-width="1.2"/>';
      var base = y + h / 2, aw = w - 16, ax = x + 8;
      if (kind === "dry") {
        var hh = [7, 20, 5, 13, 25, 6, 17, 4, 23, 9, 14, 6];
        hh.forEach(function (v2, i) {
          v += '<rect x="' + (ax + i * (aw / 12)) + '" y="' + (base - v2) + '" width="' + (aw / 12 - 2.5) + '" height="' + (v2 * 2) + '" rx="1.5" fill="#F0A43C" opacity=".92"/>';
        });
      } else if (kind === "eq") {
        v += '<line x1="' + ax + '" y1="' + base + '" x2="' + (ax + aw) + '" y2="' + base + '" stroke="#3A424B" stroke-width="1"/>';
        v += '<path d="M ' + ax + ' ' + (y + h - 6) + ' C ' + (ax + aw * 0.12) + ' ' + (y + h - 6) + ', ' + (ax + aw * 0.14) + ' ' + base + ', ' + (ax + aw * 0.26) + ' ' + base +
             ' C ' + (ax + aw * 0.36) + ' ' + base + ', ' + (ax + aw * 0.36) + ' ' + (base + 6) + ', ' + (ax + aw * 0.46) + ' ' + (base + 6) +
             ' C ' + (ax + aw * 0.58) + ' ' + (base + 6) + ', ' + (ax + aw * 0.62) + ' ' + base + ', ' + (ax + aw * 0.74) + ' ' + (base - 5) +
             ' C ' + (ax + aw * 0.86) + ' ' + (base - 9) + ', ' + (ax + aw * 0.9) + ' ' + (base - 10) + ', ' + (ax + aw) + ' ' + (base - 11) +
             '" fill="none" stroke="#F0A43C" stroke-width="2.4" stroke-linecap="round"/>';
        v += '<text x="' + (ax + 4) + '" y="' + (y + 12) + '" font-family="var(--body)" font-size="7.5" fill="#98A1A9">cut lows · lift presence</text>';
      } else if (kind === "comp") {
        var he = [14, 17, 13, 15, 18, 14, 16, 13, 17, 15, 16, 14];
        he.forEach(function (v2, i) {
          v += '<rect x="' + (ax + i * (aw / 12)) + '" y="' + (base - v2) + '" width="' + (aw / 12 - 2.5) + '" height="' + (v2 * 2) + '" rx="1.5" fill="#AFC96A" opacity=".95"/>';
        });
        v += '<line x1="' + ax + '" y1="' + (base - 19) + '" x2="' + (ax + aw) + '" y2="' + (base - 19) + '" stroke="#D9534F" stroke-width="1.2" stroke-dasharray="4 3"/>';
        v += '<text x="' + (ax + 4) + '" y="' + (base - 23) + '" font-family="var(--body)" font-size="7.5" fill="#D9534F">ceiling</text>';
      } else if (kind === "verb") {
        var hv = [15, 18, 14, 17];
        hv.forEach(function (v2, i) {
          v += '<rect x="' + (ax + i * 9) + '" y="' + (base - v2) + '" width="6.5" height="' + (v2 * 2) + '" rx="1.5" fill="#AFC96A"/>';
        });
        v += '<path d="M ' + (ax + 40) + ' ' + (base - 15) + ' C ' + (ax + 62) + ' ' + (base - 13) + ', ' + (ax + 80) + ' ' + (base - 5) + ', ' + (ax + aw) + ' ' + (base - 1) +
             ' L ' + (ax + aw) + ' ' + (base + 1) + ' C ' + (ax + 80) + ' ' + (base + 5) + ', ' + (ax + 62) + ' ' + (base + 13) + ', ' + (ax + 40) + ' ' + (base + 15) + ' Z" fill="#6FBFE0" opacity=".45"/>';
        v += '<text x="' + (ax + aw - 4) + '" y="' + (y + 12) + '" text-anchor="end" font-family="var(--body)" font-size="7.5" fill="#6FBFE0">the tail</text>';
      } else if (kind === "delay") {
        var taps = [[0, 18], [0.3, 12], [0.58, 8], [0.84, 5]];
        taps.forEach(function (t, i) {
          v += '<rect x="' + (ax + t[0] * (aw - 12)) + '" y="' + (base - t[1]) + '" width="9" height="' + (t[1] * 2) + '" rx="2" fill="#F0A43C" opacity="' + (1 - i * 0.2) + '"/>';
          if (i) v += '<path d="M ' + (ax + taps[i - 1][0] * (aw - 12) + 11) + ' ' + (base - 20) + ' Q ' + (ax + (taps[i - 1][0] + t[0]) / 2 * (aw - 12) + 5) + ' ' + (base - 27) + ' ' + (ax + t[0] * (aw - 12) + 3) + ' ' + (base - 20) + '" fill="none" stroke="#98A1A9" stroke-width="1" opacity=".6"/>';
        });
        v += '<text x="' + (ax + 4) + '" y="' + (y + h - 5) + '" font-family="var(--body)" font-size="7.5" fill="#98A1A9">each echo quieter, on the beat</text>';
      }
      return v;
    }
    stages.forEach(function (st, i) {
      var x = x0 + i * (cw + gap);
      var isVoice = st.tone === "red";
      s += '<rect x="' + (x + 2.5) + '" y="' + (top + 3.5) + '" width="' + cw + '" height="' + chd + '" rx="12" fill="var(--ink)" opacity=".10"/>';
      s += '<rect x="' + x + '" y="' + top + '" width="' + cw + '" height="' + chd + '" rx="12" fill="' + (isVoice ? "var(--accent-wash)" : "var(--surface-sunk)") + '" stroke="' + (isVoice ? "var(--accent)" : "var(--line-strong)") + '" stroke-width="1.8"/>';
      s += '<text x="' + (x + cw / 2) + '" y="' + (top + 26) + '" text-anchor="middle" font-family="var(--display)" font-size="14.5" font-weight="800" fill="var(--ink)">' + esc(st.n) + '</text>';
      s += '<text x="' + (x + cw / 2) + '" y="' + (top + 43) + '" text-anchor="middle" font-family="var(--mono)" font-size="9.5" fill="' + (isVoice ? "var(--accent-deep)" : "var(--ink-soft)") + '">' + esc(st.plug) + '</text>';
      s += viz(st.viz, x + 10, top + 52, cw - 20, 62);
      // the one knob that matters
      s += '<rect x="' + (x + 8) + '" y="' + (top + 121) + '" width="' + (cw - 16) + '" height="21" rx="10.5" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1"/>';
      s += '<text x="' + (x + cw / 2) + '" y="' + (top + 135) + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" font-weight="700" fill="var(--accent-deep)">' + esc(st.knob) + '</text>';
      if (i < stages.length - 1) {
        var axr = x + cw + gap / 2;
        s += '<path d="M ' + (x + cw + 1) + ' ' + (top + chd / 2) + ' L ' + (x + cw + gap - 4) + ' ' + (top + chd / 2) + '" stroke="var(--accent)" stroke-width="2.6"/>';
        s += '<path d="M ' + (x + cw + gap - 5) + ' ' + (top + chd / 2 - 5) + ' L ' + (x + cw + gap + 1) + ' ' + (top + chd / 2) + ' L ' + (x + cw + gap - 5) + ' ' + (top + chd / 2 + 5) + ' Z" fill="var(--accent)"/>';
      }
    });
    // where it lives: the mixer slot mapping
    var my = top + chd + 26;
    s += '<text x="380" y="' + (my - 2) + '" text-anchor="middle" font-family="var(--body)" font-size="12" font-weight="700" fill="var(--ink)">Where the chain lives: the vocal track’s mixer slots (press F9) — top to bottom IS the order</text>';
    var slots = ["Slot 1 · Fruity parametric EQ 2", "Slot 2 · Fruity Limiter (COMP)", "Slot 3 · Fruity Reeverb 2", "Slot 4 · Fruity Delay 3"];
    slots.forEach(function (sl, k) {
      var sy = my + 10 + k * 30;
      s += '<rect x="220" y="' + sy + '" width="320" height="24" rx="5" fill="var(--surface-sunk)" stroke="var(--line-strong)" stroke-width="1.2"/>';
      s += '<circle cx="236" cy="' + (sy + 12) + '" r="4" fill="#AFC96A" stroke="#87A244" stroke-width="1"/>';
      s += '<text x="250" y="' + (sy + 16) + '" font-family="var(--mono)" font-size="10.5" font-weight="600" fill="var(--ink-mid)">' + esc(sl) + '</text>';
      var stgIdx = k + 1, sx = x0 + stgIdx * (cw + gap) + cw / 2;
      s += '<path d="M ' + sx + ' ' + (top + chd + 4) + ' C ' + sx + ' ' + (my + 2) + ', ' + (k % 2 ? 560 : 200) + ' ' + (sy + 12) + ', ' + (k % 2 ? 543 : 217) + ' ' + (sy + 12) + '" fill="none" stroke="var(--ink-faint)" stroke-width="1.2" stroke-dasharray="4 4" opacity=".55"/>';
    });
    s += '<text x="380" y="' + (my + 10 + 4 * 30 + 16) + '" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">Why this order: fix the tone, then even the level — and only THEN add space. Reverb on a muddy, uneven voice is muddy, uneven echoes.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- The frequency map of a voice — what lives where ---------- */
  SVGX.freqMap = function () {
    var s = '<svg viewBox="0 0 760 280" role="img" aria-label="The frequency map of a voice">';
    var gx = 46, gw = 680, gy = 190;
    var bands = [
      { f: "under 90 Hz", n: "Rumble", act: "CUT it", x: 0, w: 0.11, tone: "cut", note: "room boom, no voice" },
      { f: "90–250 Hz", n: "Warmth", act: "keep", x: 0.11, w: 0.15, tone: "keep", note: "the chest of the voice" },
      { f: "250–500 Hz", n: "Mud", act: "small dip", x: 0.26, w: 0.13, tone: "risk", note: "boxy, woolly when too loud" },
      { f: "500 Hz–2 kHz", n: "Body", act: "leave alone", x: 0.39, w: 0.2, tone: "keep", note: "the words themselves" },
      { f: "2–5 kHz", n: "Presence", act: "gentle lift", x: 0.59, w: 0.16, tone: "good", note: "“closer to the speaker”" },
      { f: "5–8 kHz", n: "Sibilance", act: "watch it", x: 0.75, w: 0.1, tone: "risk", note: "harsh “ess” sounds live here" },
      { f: "10 kHz +", n: "Air", act: "small shelf up", x: 0.85, w: 0.15, tone: "good", note: "sparkle — AIR button ground" }
    ];
    var cols = { cut: "var(--ink-faint)", keep: "color-mix(in srgb, var(--accent) 40%, var(--surface-sunk))", risk: "#D9A24C", good: "var(--accent)" };
    // the voice-energy curve behind
    s += '<path d="M ' + gx + ' ' + (gy - 8) + ' C ' + (gx + gw * 0.1) + ' ' + (gy - 30) + ', ' + (gx + gw * 0.18) + ' ' + (gy - 96) + ', ' + (gx + gw * 0.33) + ' ' + (gy - 100) +
         ' C ' + (gx + gw * 0.5) + ' ' + (gy - 104) + ', ' + (gx + gw * 0.62) + ' ' + (gy - 74) + ', ' + (gx + gw * 0.74) + ' ' + (gy - 48) +
         ' C ' + (gx + gw * 0.86) + ' ' + (gy - 26) + ', ' + (gx + gw * 0.94) + ' ' + (gy - 14) + ', ' + (gx + gw) + ' ' + (gy - 10) +
         ' L ' + (gx + gw) + ' ' + gy + ' L ' + gx + ' ' + gy + ' Z" fill="var(--accent)" opacity=".12"/>';
    bands.forEach(function (b, i) {
      var bx = gx + b.x * gw, bw = b.w * gw - 3;
      s += '<rect x="' + bx + '" y="' + (gy - 64) + '" width="' + bw + '" height="64" rx="7" fill="' + cols[b.tone] + '" opacity="' + (b.tone === "cut" ? ".55" : b.tone === "keep" ? ".85" : ".8") + '" stroke="var(--line-strong)" stroke-width="1"/>';
      var lab = b.tone === "good" || b.tone === "cut";
      s += '<text x="' + (bx + bw / 2) + '" y="' + (gy - 38) + '" text-anchor="middle" font-family="var(--display)" font-size="12.5" font-weight="800" fill="' + (b.tone === "good" ? "#fff" : "var(--ink)") + '">' + esc(b.n) + '</text>';
      s += '<text x="' + (bx + bw / 2) + '" y="' + (gy - 20) + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" font-weight="700" fill="' + (b.tone === "good" ? "rgba(255,255,255,.9)" : "var(--ink-mid)") + '">' + esc(b.act) + '</text>';
      s += '<text x="' + (bx + bw / 2) + '" y="' + (gy + 18) + '" text-anchor="middle" font-family="var(--mono)" font-size="9" fill="var(--ink-faint)">' + esc(b.f) + '</text>';
      // stagger the notes above so they never collide; clamp so edge notes stay on the canvas
      var ny = (i % 2 === 0) ? gy - 84 : gy - 106;
      var nx = Math.min(Math.max(bx + bw / 2, 104), 618);
      s += '<line x1="' + (bx + bw / 2) + '" y1="' + (ny + 6) + '" x2="' + (bx + bw / 2) + '" y2="' + (gy - 66) + '" stroke="var(--ink-faint)" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>';
      s += '<text x="' + nx + '" y="' + ny + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" fill="var(--ink-soft)">' + esc(b.note) + '</text>';
    });
    s += '<line x1="' + gx + '" y1="' + gy + '" x2="' + (gx + gw) + '" y2="' + gy + '" stroke="var(--line-strong)" stroke-width="1.6"/>';
    s += '<text x="380" y="248" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">Low notes on the left, sparkle on the right. Every EQ move in the polish recipe is one of these blocks —</text>';
    s += '<text x="380" y="266" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">cut what isn’t voice, dip the mud, lift presence and air a touch. That’s the whole science.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- Anatomy of a reverb: direct sound, pre-delay, tail ---------- */
  SVGX.reverbAnatomy = function () {
    var s = '<svg viewBox="0 0 760 270" role="img" aria-label="What a reverb is made of">';
    var gx = 70, gw = 640, base = 180;
    s += '<line x1="' + gx + '" y1="' + base + '" x2="' + (gx + gw) + '" y2="' + base + '" stroke="var(--line-strong)" stroke-width="1.6"/>';
    s += '<text x="' + (gx + gw) + '" y="' + (base + 20) + '" text-anchor="end" font-family="var(--mono)" font-size="10" fill="var(--ink-faint)">time →</text>';
    // direct sound
    s += '<rect x="' + gx + '" y="' + (base - 120) + '" width="16" height="120" rx="4" fill="var(--accent)"/>';
    s += '<text x="' + (gx + 8) + '" y="' + (base - 130) + '" text-anchor="middle" font-family="var(--body)" font-size="11" font-weight="800" fill="var(--ink)">the word itself</text>';
    // pre-delay gap
    var pdEnd = gx + 88;
    s += '<path d="M ' + (gx + 22) + ' ' + (base - 96) + ' L ' + (pdEnd - 4) + ' ' + (base - 96) + '" stroke="var(--accent-deep)" stroke-width="2"/>';
    s += '<path d="M ' + (gx + 27) + ' ' + (base - 101) + ' L ' + (gx + 21) + ' ' + (base - 96) + ' L ' + (gx + 27) + ' ' + (base - 91) + ' Z" fill="var(--accent-deep)"/>';
    s += '<path d="M ' + (pdEnd - 9) + ' ' + (base - 101) + ' L ' + (pdEnd - 3) + ' ' + (base - 96) + ' L ' + (pdEnd - 9) + ' ' + (base - 91) + ' Z" fill="var(--accent-deep)"/>';
    s += '<text x="' + (pdEnd + 62) + '" y="' + (base - 108) + '" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="700" fill="var(--accent-deep)">← PRE-DELAY (~20 ms)</text>';
    s += '<text x="' + (pdEnd + 78) + '" y="' + (base - 92) + '" text-anchor="middle" font-family="var(--body)" font-size="9" fill="var(--ink-soft)">the silent gap that keeps words clear</text>';
    // early reflections
    [[0, 46], [10, 38], [22, 52], [34, 30]].forEach(function (er) {
      s += '<rect x="' + (pdEnd + er[0]) + '" y="' + (base - er[1]) + '" width="7" height="' + er[1] + '" rx="2" fill="var(--accent)" opacity=".55"/>';
    });
    s += '<text x="' + (pdEnd + 24) + '" y="' + (base - 62) + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" fill="var(--ink-soft)">first echoes off the walls</text>';
    // the tail
    var tx = pdEnd + 52;
    s += '<path d="M ' + tx + ' ' + (base - 58) + ' C ' + (tx + 120) + ' ' + (base - 44) + ', ' + (tx + 260) + ' ' + (base - 16) + ', ' + (gx + gw - 10) + ' ' + (base - 2) +
         ' L ' + (gx + gw - 10) + ' ' + base + ' L ' + tx + ' ' + base + ' Z" fill="var(--accent)" opacity=".28"/>';
    s += '<path d="M ' + tx + ' ' + (base - 58) + ' C ' + (tx + 120) + ' ' + (base - 44) + ', ' + (tx + 260) + ' ' + (base - 16) + ', ' + (gx + gw - 10) + ' ' + (base - 2) + '" fill="none" stroke="var(--accent)" stroke-width="2.4"/>';
    s += '<text x="' + (tx + 170) + '" y="' + (base - 52) + '" text-anchor="middle" font-family="var(--display)" font-size="13" font-weight="800" fill="var(--ink)">the tail — the “room” you hear</text>';
    // decay arrow
    s += '<path d="M ' + tx + ' ' + (base + 26) + ' L ' + (gx + gw - 14) + ' ' + (base + 26) + '" stroke="var(--ink-faint)" stroke-width="1.8"/>';
    s += '<path d="M ' + (gx + gw - 16) + ' ' + (base + 21) + ' L ' + (gx + gw - 8) + ' ' + (base + 26) + ' L ' + (gx + gw - 16) + ' ' + (base + 31) + ' Z" fill="var(--ink-faint)"/>';
    s += '<text x="' + (tx + (gw - (tx - gx)) / 2) + '" y="' + (base + 44) + '" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="700" fill="var(--ink-mid)">DECAY — how long the room rings (plate ~1.5 s · hall 2.5 s+)</text>';
    // knob legend
    s += '<text x="380" y="250" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">WET = how tall this whole cloud is next to the word · DAMPING = how quickly the tail loses its brightness.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- Fruity Reeverb 2: the space knobs, and room vs plate vs hall ---------- */
  SVGX.reverbWindow = function () {
    var inner = "";
    var top = 44;
    // preset row
    inner += '<rect x="34" y="' + top + '" width="' + (700 - 68) + '" height="26" fill="' + FLC.dark + '"/>';
    inner += '<rect x="42" y="' + (top + 4) + '" width="180" height="18" rx="3" fill="' + FLC.well + '"/>';
    inner += '<text x="54" y="' + (top + 17) + '" font-family="var(--body)" font-size="10" fill="' + FLC.txt + '">Presets ▾  Vocal Plate</text>';
    // knob row
    var knobs = [
      { n: "ROOM SIZE", v: "medium" }, { n: "DECAY", v: "1.8 s" }, { n: "PRE-DELAY", v: "20 ms" }, { n: "DAMPING", v: "gentle" }, { n: "WET", v: "20%" }
    ];
    knobs.forEach(function (k, i) {
      var kx = 100 + i * 120;
      inner += miniKnob(kx, top + 78, 22);
      inner += '<text x="' + kx + '" y="' + (top + 118) + '" text-anchor="middle" font-family="var(--body)" font-size="9" letter-spacing=".06em" fill="' + FLC.dim + '">' + k.n + '</text>';
      inner += '<text x="' + kx + '" y="' + (top + 134) + '" text-anchor="middle" font-family="var(--mono)" font-size="9.5" font-weight="700" fill="' + FLC.or + '">' + k.v + '</text>';
    });
    inner += '<rect x="560" y="' + (top + 50) + '" width="86" height="94" rx="7" fill="none" stroke="var(--focus)" stroke-width="2.5" stroke-dasharray="6 4"/>';
    inner += '<text x="603" y="' + (top + 160) + '" text-anchor="middle" font-family="var(--body)" font-size="9" font-weight="700" fill="var(--focus)">the one that matters most</text>';
    var s = flWindow(700, 240, "Fruity Reeverb 2   (on the mixer track, slot 3)", inner);
    // room/plate/hall chips under the window
    s += '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">';
    [["Room", "small, intimate — barely-there polish for verses"],
     ["Plate", "smooth and flattering — THE classic vocal reverb"],
     ["Hall", "big and dramatic — ballad choruses, held notes"]].forEach(function (c) {
      s += '<div style="flex:1 1 180px;background:var(--surface-sunk);border:1px solid var(--line-strong);border-radius:9px;padding:10px 14px">' +
           '<b style="color:var(--accent-deep)">' + c[0] + '</b><br><span style="font-size:var(--fs-xs);color:var(--ink-soft)">' + c[1] + "</span></div>";
    });
    s += "</div>";
    return s;
  };

  /* ---------- EQ curve for a voice ---------- */
  SVGX.eqCurve = function () {
    var inner = "";
    var top = 50, gx = 60, gw = 600, gy = 190, gh = 120;
    inner += '<rect x="' + gx + '" y="' + (gy - gh) + '" width="' + gw + '" height="' + gh + '" fill="' + FLC.lcdBg + '"/>';
    // freq gridlines + labels
    [["100", 0.18], ["250", 0.33], ["1k", 0.55], ["3k", 0.72], ["10k", 0.9]].forEach(function (f) {
      var fx = gx + f[1] * gw;
      inner += '<line x1="' + fx + '" y1="' + (gy - gh) + '" x2="' + fx + '" y2="' + gy + '" stroke="#333B44" stroke-width="0.8"/>';
      inner += '<text x="' + fx + '" y="' + (gy + 16) + '" text-anchor="middle" font-family="var(--mono)" font-size="9" fill="' + FLC.dim + '">' + f[0] + '</text>';
    });
    inner += '<line x1="' + gx + '" y1="' + (gy - gh / 2) + '" x2="' + (gx + gw) + '" y2="' + (gy - gh / 2) + '" stroke="#3A424B" stroke-width="1"/>';
    // the curve: HP below 90, dip at 250, presence rise 3k, air shelf 10k
    var mid = gy - gh / 2;
    inner += '<path d="M ' + gx + " " + gy + " C " + (gx + 40) + " " + gy + ", " + (gx + 60) + " " + mid + ", " + (gx + 105) + " " + mid +
             " C " + (gx + 150) + " " + mid + ", " + (gx + 155) + " " + (mid + 22) + ", " + (gx + 198) + " " + (mid + 22) +
             " C " + (gx + 245) + " " + (mid + 22) + ", " + (gx + 260) + " " + mid + ", " + (gx + 330) + " " + mid +
             " C " + (gx + 390) + " " + mid + ", " + (gx + 400) + " " + (mid - 16) + ", " + (gx + 445) + " " + (mid - 16) +
             " C " + (gx + 490) + " " + (mid - 16) + ", " + (gx + 500) + " " + (mid - 24) + ", " + (gx + gw) + " " + (mid - 26) +
             '" fill="none" stroke="' + FLC.or + '" stroke-width="3" stroke-linecap="round"/>';
    // spectrum wash under the curve, like the real EQ2 analyser
    inner += '<path d="M ' + gx + " " + gy + " C " + (gx + 40) + " " + gy + ", " + (gx + 60) + " " + mid + ", " + (gx + 105) + " " + mid +
             " C " + (gx + 150) + " " + mid + ", " + (gx + 155) + " " + (mid + 22) + ", " + (gx + 198) + " " + (mid + 22) +
             " C " + (gx + 245) + " " + (mid + 22) + ", " + (gx + 260) + " " + mid + ", " + (gx + 330) + " " + mid +
             " C " + (gx + 390) + " " + mid + ", " + (gx + 400) + " " + (mid - 16) + ", " + (gx + 445) + " " + (mid - 16) +
             " C " + (gx + 490) + " " + (mid - 16) + ", " + (gx + 500) + " " + (mid - 24) + ", " + (gx + gw) + " " + (mid - 26) +
             ' L ' + (gx + gw) + ' ' + gy + ' L ' + gx + ' ' + gy + ' Z" fill="' + FLC.or + '" opacity=".13"/>';
    // numbered band handles, like EQ2's draggable dots
    [[gx + 105, mid, "1"], [gx + 198, mid + 22, "2"], [gx + 445, mid - 16, "3"], [gx + 570, mid - 25, "4"]].forEach(function (bd) {
      inner += '<circle cx="' + bd[0] + '" cy="' + bd[1] + '" r="9" fill="' + FLC.lcdBg + '" stroke="' + FLC.or + '" stroke-width="2"/>';
      inner += '<text x="' + bd[0] + '" y="' + (bd[1] + 3.5) + '" text-anchor="middle" font-family="var(--mono)" font-size="10" font-weight="800" fill="' + FLC.or + '">' + bd[2] + '</text>';
    });
    // labels
    function tag(x, y, t) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" font-weight="700" fill="' + FLC.txt + '">' + t + "</text>";
    }
    inner += tag(gx + 70, gy - gh + 20, "1 · cut the rumble");
    inner += tag(gx + 198, mid + 48, "2 · less mud (250 Hz)");
    inner += tag(gx + 445, mid - 34, "3 · presence (3 kHz)");
    inner += tag(gx + 560, mid - 44, "4 · air (10 kHz+)");
    return flWindow(720, 230, "Fruity parametric EQ 2 — a vocal curve", inner);
  };

  /* ---------- compression: before / after ---------- */
  SVGX.compDiagram = function () {
    var s = '<svg viewBox="0 0 760 210" role="img" aria-label="What compression does">';
    function wave(x0, heights, col) {
      var w = "";
      heights.forEach(function (hh, i) {
        w += '<rect x="' + (x0 + i * 14) + '" y="' + (120 - hh) + '" width="9" height="' + (hh * 2) + '" rx="3" fill="' + col + '"/>';
      });
      return w;
    }
    var before = [18, 44, 12, 30, 55, 15, 38, 10, 52, 20, 33, 14];
    var after = before.map(function (h) { return 22 + h * 0.45; });
    s += '<text x="150" y="34" text-anchor="middle" font-family="var(--display)" font-size="14" font-weight="700" fill="var(--ink)">Before</text>';
    s += wave(70, before, "var(--ink-faint)");
    // threshold line + pull-down arrows on the peaks
    s += '<line x1="62" y1="80" x2="242" y2="80" stroke="var(--stop)" stroke-width="1.6" stroke-dasharray="5 4"/>';
    s += '<text x="246" y="84" font-family="var(--body)" font-size="9.5" font-weight="700" fill="var(--stop)">THRES</text>';
    [4, 8].forEach(function (i) {
      var px = 70 + i * 14 + 4.5;
      s += '<path d="M ' + px + ' 58 L ' + px + ' 72" stroke="var(--stop)" stroke-width="2"/>';
      s += '<path d="M ' + (px - 4) + ' 69 L ' + px + ' 77 L ' + (px + 4) + ' 69 Z" fill="var(--stop)"/>';
    });
    s += '<text x="150" y="188" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-soft)">quiet words vanish, loud notes poke out</text>';
    s += '<path d="M 280 105 L 330 105" stroke="var(--accent)" stroke-width="3" marker-end="none"/><path d="M 322 97 L 336 105 L 322 113 Z" fill="var(--accent)"/>';
    s += '<text x="308" y="88" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="700" fill="var(--accent-deep)">compressor</text>';
    s += '<text x="480" y="34" text-anchor="middle" font-family="var(--display)" font-size="14" font-weight="700" fill="var(--ink)">After</text>';
    s += wave(400, after, "var(--accent)");
    s += '<text x="480" y="188" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-soft)">every word sits at a steady, present level</text>';
    s += '<text x="672" y="105" text-anchor="middle" font-family="var(--body)" font-size="11" fill="var(--ink-soft)">= the vocal stays</text>';
    s += '<text x="672" y="122" text-anchor="middle" font-family="var(--body)" font-size="11" fill="var(--ink-soft)">on top of the beat</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- delay taps: slapback vs quarter-note ---------- */
  SVGX.delayTaps = function () {
    var s = '<svg viewBox="0 0 760 230" role="img" aria-label="Delay types">';
    function row(y, label, taps, sub) {
      var r = '<text x="26" y="' + (y + 5) + '" font-family="var(--display)" font-size="13" font-weight="700" fill="var(--ink)">' + label + "</text>";
      r += '<rect x="170" y="' + (y - 16) + '" width="18" height="32" rx="4" fill="var(--accent)"/>';
      r += '<text x="179" y="' + (y + 42) + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" fill="var(--ink-faint)">you sing</text>';
      taps.forEach(function (t) {
        r += '<rect x="' + (170 + t[0]) + '" y="' + (y - 16 * t[1]) + '" width="14" height="' + (32 * t[1]) + '" rx="4" fill="var(--accent)" opacity="' + (0.25 + t[1] * 0.5) + '"/>';
      });
      r += '<text x="' + 640 + '" y="' + (y + 5) + '" font-family="var(--body)" font-size="11" fill="var(--ink-soft)">' + sub + "</text>";
      return r;
    }
    s += row(60, "Slapback", [[52, 0.7]], "one fast echo — rock'n'roll, instant attitude");
    s += row(150, "1/4-note echo", [[110, 0.72], [220, 0.5], [330, 0.32]], "echoes in time with the song — dreamy, big");
    s += '<text x="380" y="215" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">In Fruity Delay 3, set TIME by clicking the tempo-sync icon so echoes always land on the beat. Keep FEEDBACK low — two or three repeats.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- the Project One session map: where you are in the build ---------- */
  SVGX.projectMap = function (cur) {
    var stages = ["Drums", "Piano", "Bass", "Guitar", "Extras", "Arrange", "Voice", "Ship"];
    var s = '<svg viewBox="0 0 760 96" role="img" aria-label="Project One — the build order">';
    var w = 82, gap = 8, x0 = 14, y = 22, h = 42;
    stages.forEach(function (st, i) {
      var x = x0 + i * (w + gap);
      var state = i < cur ? "done" : i === cur ? "now" : "todo";
      var fill = state === "now" ? "var(--accent)" : state === "done" ? "color-mix(in srgb, var(--good) 18%, var(--surface-sunk))" : "var(--surface-sunk)";
      var stroke = state === "now" ? "var(--accent-deep)" : state === "done" ? "color-mix(in srgb, var(--good) 55%, var(--line-strong))" : "var(--line-strong)";
      if (state === "now") s += '<rect x="' + (x + 2) + '" y="' + (y + 3) + '" width="' + w + '" height="' + h + '" rx="10" fill="var(--ink)" opacity=".14"/>';
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (state === "now" ? 2 : 1.3) + '"/>';
      s += '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4.5) + '" text-anchor="middle" font-family="var(--body)" font-size="12" font-weight="' + (state === "now" ? 800 : 600) + '" fill="' + (state === "now" ? "#fff" : state === "done" ? "var(--ink-mid)" : "var(--ink-soft)") + '">' + st + '</text>';
      if (state === "done") s += '<text x="' + (x + w - 11) + '" y="' + (y + 14) + '" text-anchor="middle" font-size="10" fill="var(--good)" font-weight="800">✓</text>';
      if (i < stages.length - 1) s += '<path d="M ' + (x + w + 1) + ' ' + (y + h / 2) + ' l ' + (gap - 3) + ' 0" stroke="var(--ink-faint)" stroke-width="2"/>';
    });
    s += '<text x="380" y="88" text-anchor="middle" font-family="var(--body)" font-size="11" fill="var(--ink-soft)">Project One — the same eight stages every producer walks, in this order.</text>';
    return s + '</svg>';
  };

  /* ---------- Piano roll: notes as blocks + velocity lane ----------
     hl: 'draw' | 'vel' | null · chords: optional override · cap: optional pill text */
  SVGX.flPianoRoll = function (hl, chords, cap) {
    var rows = ["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3"];
    var top = 74, rowH = 15, keysX = 34, keysW = 50, gridX = 84, barW = 158;
    var gridBottom = top + rows.length * rowH;
    var velTop = gridBottom + 10, velH = 56;
    var h = velTop + velH + 26;
    var inner = "";
    // toolbar: draw tools + snap
    inner += '<rect x="34" y="42" width="' + (760 - 68) + '" height="24" fill="' + FLC.dark + '"/>';
    var tools = ["✏", "🖌", "✂", "🔍"];
    tools.forEach(function (t, k) {
      var tx = 44 + k * 30;
      inner += '<rect x="' + tx + '" y="45" width="24" height="18" rx="3" fill="' + (k === 0 ? FLC.well : FLC.body) + '"' + (k === 0 ? ' stroke="' + FLC.or + '" stroke-width="1.6"' : "") + '/>';
      inner += '<text x="' + (tx + 12) + '" y="' + 59 + '" text-anchor="middle" font-size="11">' + t + "</text>";
    });
    inner += '<text x="196" y="58" font-family="var(--body)" font-size="9.5" fill="' + FLC.dim + '">← the pencil = draw notes</text>';
    inner += '<rect x="600" y="45" width="86" height="18" rx="3" fill="' + FLC.well + '"/><text x="643" y="58" text-anchor="middle" font-family="var(--body)" font-size="9.5" fill="' + FLC.dim + '">Snap: Cell</text>';
    if (hl === "draw") inner += '<rect x="40" y="41" width="34" height="27" rx="5" fill="none" stroke="var(--focus)" stroke-width="2.5" stroke-dasharray="6 4"/>';
    // key column + row stripes + beat lines
    rows.forEach(function (nm, r) {
      var y = top + r * rowH;
      var isC = nm[0] === "C" && nm[1] !== "#";
      inner += '<rect x="' + keysX + '" y="' + y + '" width="' + keysW + '" height="' + (rowH - 1) + '" fill="#E8EAEC" stroke="#B9BEC4" stroke-width="0.6"/>';
      if (isC) inner += '<text x="' + (keysX + keysW - 5) + '" y="' + (y + 11) + '" text-anchor="end" font-family="var(--mono)" font-size="8" fill="#5A6068">' + nm + "</text>";
      inner += '<rect x="' + gridX + '" y="' + y + '" width="' + (barW * 4) + '" height="' + (rowH - 1) + '" fill="' + (r % 2 ? "#2B333B" : "#2F373F") + '"/>';
    });
    // black key stubs (decor, between B/A/G/F/D/C rows)
    [1, 2, 3, 4, 6, 8, 9, 10].forEach(function (r) {
      inner += '<rect x="' + keysX + '" y="' + (top + r * rowH - 4) + '" width="' + (keysW * 0.62) + '" height="8" rx="2" fill="#20262C"/>';
    });
    // bar shading + lines + numbers
    for (var bb = 0; bb < 4; bb++) {
      if (bb % 2) inner += '<rect x="' + (gridX + bb * barW) + '" y="' + top + '" width="' + barW + '" height="' + (rows.length * rowH - 1) + '" fill="#000000" opacity=".08"/>';
      inner += '<line x1="' + (gridX + bb * barW) + '" y1="' + top + '" x2="' + (gridX + bb * barW) + '" y2="' + gridBottom + '" stroke="#454F59" stroke-width="1.4"/>';
      inner += '<text x="' + (gridX + bb * barW + 5) + '" y="' + (top - 5) + '" font-family="var(--mono)" font-size="9" fill="' + FLC.dim + '">Bar ' + (bb + 1) + "</text>";
      for (var q = 1; q < 4; q++) inner += '<line x1="' + (gridX + bb * barW + q * barW / 4) + '" y1="' + top + '" x2="' + (gridX + bb * barW + q * barW / 4) + '" y2="' + gridBottom + '" stroke="#3A424B" stroke-width="0.6"/>';
    }
    // chord notes: C — Am — F — G, one bar each, green FL-style blocks (or caller-supplied chords)
    var CH = chords || [
      { bar: 0, notes: ["C4", "E4", "G4"], lab: "C" },
      { bar: 1, notes: ["A3", "C4", "E4"], lab: "Am" },
      { bar: 2, notes: ["F3", "A3", "C4"], lab: "F" },
      { bar: 3, notes: ["G3", "B3", "D4"], lab: "G" }
    ];
    var lastNote = null;
    CH.forEach(function (c) {
      c.notes.forEach(function (n, k) {
        var r = rows.indexOf(n);
        if (r < 0) return;
        var nx = gridX + c.bar * barW + 2, ny = top + r * rowH + 1;
        inner += '<rect x="' + nx + '" y="' + ny + '" width="' + (barW - 6) + '" height="' + (rowH - 3) + '" rx="3" fill="#7DBF6E" stroke="#4E8A44" stroke-width="1.2"/>';
        inner += '<rect x="' + nx + '" y="' + ny + '" width="4" height="' + (rowH - 3) + '" fill="#4E8A44"/>';
        if (k === 2) inner += '<text x="' + (nx + 10) + '" y="' + (ny + 10) + '" font-family="var(--body)" font-size="8.5" font-weight="700" fill="#1E3318">' + c.lab + "</text>";
        lastNote = { x: nx, y: ny, w: barW - 6 };
      });
    });
    if (hl === "draw" && lastNote) {
      inner += '<rect x="' + (lastNote.x - 4) + '" y="' + (lastNote.y - 4) + '" width="' + (lastNote.w + 8) + '" height="' + (rowH + 5) + '" rx="5" fill="none" stroke="var(--focus)" stroke-width="2.5" stroke-dasharray="6 4"/>';
      inner += pill(420, 24, "Left-click an empty cell = place a note · drag its right edge = longer · right-click = delete");
    }
    // velocity lane
    inner += '<rect x="' + gridX + '" y="' + velTop + '" width="' + (barW * 4) + '" height="' + velH + '" fill="' + FLC.lcdBg + '"/>';
    inner += '<text x="' + (keysX + 4) + '" y="' + (velTop + 20) + '" font-family="var(--body)" font-size="8.5" fill="' + FLC.dim + '">Velocity</text>';
    CH.forEach(function (c, i) {
      for (var k = 0; k < 3; k++) {
        var vh = 14 + ((i + k) % 3) * 11;
        var vx = gridX + c.bar * barW + 8 + k * 14;
        inner += '<rect x="' + vx + '" y="' + (velTop + velH - vh - 4) + '" width="8" height="' + vh + '" rx="2" fill="' + FLC.or + '" opacity=".9"/>';
        inner += '<circle cx="' + (vx + 4) + '" cy="' + (velTop + velH - vh - 6) + '" r="2.5" fill="' + FLC.or + '"/>';
      }
    });
    if (hl === "vel") {
      inner += '<rect x="' + (gridX - 4) + '" y="' + (velTop - 4) + '" width="' + (barW * 4 + 8) + '" height="' + (velH + 8) + '" rx="6" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>';
      inner += pill(420, h - 8, "Each bar = how hard that note plays. Drag some lower — evenness is what sounds robotic");
    }
    if (!hl) inner += pill(420, h - 8, cap || "Notes are blocks on a grid — this is one bar each of C, Am, F, G");
    return flWindow(760, h, "Piano roll - FLEX   (F7)", inner);
  };

  /* ---------- FLEX: picking a sound ---------- */
  SVGX.flexWindow = function () {
    var inner = "";
    var top = 44;
    // search bar
    inner += '<rect x="34" y="' + top + '" width="' + (700 - 68) + '" height="24" fill="' + FLC.dark + '"/>';
    inner += '<rect x="42" y="' + (top + 3) + '" width="200" height="18" rx="9" fill="' + FLC.well + '"/><text x="54" y="' + (top + 16) + '" font-family="var(--body)" font-size="9.5" fill="' + FLC.dim + '">🔍 search: piano</text>';
    // left: categories
    var cats = ["Keys", "Guitar", "Bass", "Brass", "Strings", "Pads", "Synth", "808 & Sub"];
    inner += '<rect x="34" y="' + (top + 26) + '" width="130" height="230" fill="' + FLC.dark + '"/>';
    cats.forEach(function (c, i) {
      var cy = top + 40 + i * 27;
      var sel = i === 0;
      if (sel) inner += '<rect x="40" y="' + (cy - 14) + '" width="118" height="22" rx="3" fill="' + FLC.or + '"/>';
      inner += '<text x="52" y="' + (cy + 1) + '" font-family="var(--body)" font-size="10.5" font-weight="' + (sel ? 800 : 500) + '" fill="' + (sel ? "#1E1503" : FLC.dim) + '">' + c + "</text>";
    });
    // right: presets
    var pres = ["Grand Piano", "Upright Felt", "Electric Piano", "Dreamy Keys", "Music Box", "Organ Warm"];
    pres.forEach(function (pn, i) {
      var py = top + 40 + i * 34;
      var sel = i === 0;
      inner += '<rect x="176" y="' + (py - 15) + '" width="440" height="27" rx="3" fill="' + (sel ? "#4B545E" : FLC.body) + '"' + (sel ? ' stroke="' + FLC.or + '" stroke-width="1.6"' : "") + '/>';
      inner += '<path d="M 188 ' + (py - 6) + ' l 0 10 l 7 -5 Z" fill="' + (sel ? FLC.or : FLC.dim) + '"/>';
      inner += '<text x="204" y="' + (py + 3) + '" font-family="var(--body)" font-size="11.5" font-weight="' + (sel ? 700 : 500) + '" fill="' + (sel ? FLC.txt : FLC.dim) + '">' + pn + "</text>";
      if (sel) inner += '<text x="596" y="' + (py + 3) + '" text-anchor="end" font-family="var(--body)" font-size="9" fill="' + FLC.green + '">▶ playing</text>';
    });
    // macro knobs
    for (var k = 0; k < 4; k++) inner += miniKnob(220 + k * 60, top + 262, 13);
    inner += '<text x="330" y="' + (top + 296) + '" text-anchor="middle" font-family="var(--body)" font-size="8.5" fill="' + FLC.dim + '">macro knobs — shape the sound later, ignore for now</text>';
    inner += '<rect x="170" y="' + (top + 22) + '" width="452" height="40" rx="7" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>';
    inner += pill(350, 24, "Double-click a sound — then just play your keyboard");
    return flWindow(700, 360, "FLEX", inner);
  };

  /* ---------- Channel rack with the graph editor open: velocity + swing ---------- */
  SVGX.rackHumanise = function () {
    var chans = [
      { name: "Kick", steps: [1, 9] },
      { name: "Clap", steps: [5, 13] },
      { name: "Hat", steps: [1, 3, 5, 7, 9, 11, 13, 15] }
    ];
    var top = 78, rowH = 34, x0 = 44, cellW = 25, cellX = 322;
    var graphTop = top + chans.length * rowH + 6, graphH = 78;
    var h = graphTop + graphH + 40;
    var inner = "";
    var CHCOL = ["#7E5A5E", "#6E5E92", "#5F6A94"];
    // header: SWING slider (highlighted) + graph editor button (highlighted)
    inner += '<rect x="34" y="40" width="' + (760 - 68) + '" height="28" fill="' + FLC.dark + '"/>';
    inner += '<text x="470" y="59" font-family="var(--body)" font-size="9.5" letter-spacing=".06em" fill="' + FLC.txt + '">SWING</text>';
    inner += '<rect x="516" y="50" width="110" height="8" rx="4" fill="' + FLC.well + '"/>';
    inner += '<rect x="516" y="50" width="34" height="8" rx="4" fill="' + FLC.or + '"/>';
    inner += '<rect x="544" y="45" width="12" height="18" rx="3" fill="' + FLC.fader + '" stroke="' + FLC.edge + '" stroke-width="1"/>';
    inner += '<rect x="510" y="42" width="122" height="25" rx="6" fill="none" stroke="var(--focus)" stroke-width="2.5" stroke-dasharray="6 4"/>';
    // graph editor toggle button, top right — the thing to click
    inner += '<rect x="648" y="44" width="36" height="20" rx="3" fill="' + FLC.well + '" stroke="' + FLC.or + '" stroke-width="1.6"/>';
    inner += '<g fill="' + FLC.or + '"><rect x="654" y="54" width="4" height="7"/><rect x="660" y="50" width="4" height="11"/><rect x="666" y="47" width="4" height="14"/></g>';
    inner += '<rect x="642" y="38" width="48" height="32" rx="7" fill="none" stroke="var(--focus)" stroke-width="2.5" stroke-dasharray="6 4"/>';
    inner += '<text x="700" y="34" text-anchor="end" font-family="var(--body)" font-size="9.5" font-weight="700" fill="var(--focus)">click this to open the bars ↓</text>';
    chans.forEach(function (c, i) {
      var y = top + i * rowH;
      inner += '<circle cx="' + (x0 + 8) + '" cy="' + (y + 13) + '" r="5" fill="#C3E14E" stroke="#7C9430" stroke-width="1"/>';
      inner += miniKnob(x0 + 30, y + 13, 8);
      inner += miniKnob(x0 + 53, y + 13, 8);
      inner += '<rect x="' + (x0 + 72) + '" y="' + y + '" width="172" height="26" rx="4" fill="' + CHCOL[i] + '" stroke="' + FLC.edge + '" stroke-width="1.2"/>';
      inner += '<text x="' + (x0 + 158) + '" y="' + (y + 18) + '" text-anchor="middle" font-family="var(--body)" font-size="11.5" font-weight="600" fill="#EFF2F5">' + esc(c.name) + '</text>';
      for (var st = 1; st <= 16; st++) {
        var cx = cellX + (st - 1) * cellW + (st > 4 ? 7 : 0) + (st > 8 ? 7 : 0) + (st > 12 ? 7 : 0);
        var on = c.steps.indexOf(st) > -1;
        var silver = Math.floor((st - 1) / 4) % 2 === 0;
        inner += '<rect x="' + cx + '" y="' + (y + 2) + '" width="18" height="22" rx="4" fill="' + (on ? FLC.step : (silver ? "#8A9099" : "#7E6165")) + '"' + (on ? ' stroke="' + FLC.stepEdge + '" stroke-width="1.2"' : "") + '/>';
      }
    });
    // graph editor lane: velocity bars under the HAT steps, alternating loud/soft
    inner += '<rect x="' + (cellX - 8) + '" y="' + graphTop + '" width="' + (16 * cellW + 30) + '" height="' + graphH + '" fill="' + FLC.lcdBg + '"/>';
    inner += '<text x="' + (x0 + 158) + '" y="' + (graphTop + 42) + '" text-anchor="middle" font-family="var(--body)" font-size="10.5" fill="' + FLC.dim + '">Hat — velocity</text>';
    for (var st2 = 1; st2 <= 16; st2 += 2) {
      var gx = cellX + (st2 - 1) * cellW + (st2 > 4 ? 7 : 0) + (st2 > 8 ? 7 : 0) + (st2 > 12 ? 7 : 0);
      var loud = ((st2 - 1) / 2) % 2 === 0;
      var bh = loud ? 58 : 30;
      inner += '<rect x="' + (gx + 2) + '" y="' + (graphTop + graphH - bh - 6) + '" width="14" height="' + bh + '" rx="2" fill="' + FLC.or + '" opacity="' + (loud ? 1 : 0.65) + '"/>';
    }
    inner += '<rect x="' + (cellX - 12) + '" y="' + (graphTop - 4) + '" width="' + (16 * cellW + 38) + '" height="' + (graphH + 8) + '" rx="7" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>';
    inner += pill(430, h - 10, "Drag each bar with the mouse — tall = loud, short = soft. Alternate them.");
    return flWindow(760, h, "Channel rack — graph editor open", inner);
  };

  /* ---------- the R&B vocal stack: who sits where ---------- */
  SVGX.stackDiagram = function () {
    var s = '<svg viewBox="0 0 760 300" role="img" aria-label="The vocal stack — where each voice sits">';
    // stereo field: x = pan, y = pitch height
    s += '<line x1="80" y1="250" x2="680" y2="250" stroke="var(--line-strong)" stroke-width="1.5"/>';
    ["L", "CENTRE", "R"].forEach(function (t, i) {
      s += '<text x="' + (110 + i * 270) + '" y="272" text-anchor="middle" font-family="var(--mono)" font-size="10.5" font-weight="700" fill="var(--ink-faint)">' + t + "</text>";
    });
    function voice(x, y, w, h, label, sub, main) {
      var r = '<rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="9" fill="' + (main ? "var(--accent)" : "var(--accent-wash)") + '" stroke="' + (main ? "var(--accent-deep)" : "var(--accent)") + '" stroke-width="1.6"/>';
      r += '<text x="' + x + '" y="' + (y + (sub ? -2 : 5)) + '" text-anchor="middle" font-family="var(--body)" font-size="' + (main ? 14 : 11.5) + '" font-weight="700" fill="' + (main ? "#fff" : "var(--accent-deep)") + '">' + label + "</text>";
      if (sub) r += '<text x="' + x + '" y="' + (y + 15) + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" fill="' + (main ? "rgba(255,255,255,.85)" : "var(--ink-soft)") + '">' + sub + "</text>";
      return r;
    }
    s += voice(380, 150, 170, 62, "LEAD", "tells the story — loudest", true);
    s += voice(200, 150, 130, 46, "Double", "same line, panned L");
    s += voice(560, 150, 130, 46, "Double", "same line, panned R");
    s += voice(380, 222, 150, 40, "Octave under", "very quiet — adds weight");
    s += voice(290, 78, 130, 42, "Harmony · 3rd", "clearly under the lead");
    s += voice(470, 78, 130, 42, "Harmony · 5th", "chorus only");
    s += voice(120, 60, 88, 38, "Ad-lib", "in the gaps");
    s += voice(640, 60, 88, 38, "Ad-lib", "in the gaps");
    s += '<text x="380" y="292" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">Left–right is pan; height is pitch. Everything except the lead sits QUIETER than you think it should.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- Pitcher: the correction-speed knob is the whole story ---------- */
  SVGX.pitcherWindow = function () {
    var inner = "";
    var top = 44;
    inner += '<rect x="34" y="' + top + '" width="' + (700 - 68) + '" height="26" fill="' + FLC.dark + '"/>';
    inner += '<rect x="42" y="' + (top + 4) + '" width="170" height="18" rx="3" fill="' + FLC.well + '"/>';
    inner += '<text x="54" y="' + (top + 17) + '" font-family="var(--body)" font-size="10.5" fill="' + FLC.txt + '">KEY:  G major  ▾</text>';
    inner += '<text x="230" y="' + (top + 17) + '" font-family="var(--body)" font-size="9.5" fill="' + FLC.or + '">← set this to YOUR song’s key first — it matters most</text>';
    var kx = 350, ky = top + 130;
    inner += '<circle cx="' + kx + '" cy="' + ky + '" r="52" fill="' + FLC.knob + '" stroke="' + FLC.ring + '" stroke-width="2.5"/>';
    inner += '<line x1="' + kx + '" y1="' + ky + '" x2="' + (kx - 30) + '" y2="' + (ky - 38) + '" stroke="' + FLC.txt + '" stroke-width="4" stroke-linecap="round"/>';
    inner += '<text x="' + kx + '" y="' + (ky + 78) + '" text-anchor="middle" font-family="var(--body)" font-size="12" font-weight="700" letter-spacing=".08em" fill="' + FLC.txt + '">SPEED</text>';
    inner += '<text x="' + (kx - 128) + '" y="' + (ky - 34) + '" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="700" fill="' + FLC.green + '">SLOW</text>';
    inner += '<text x="' + (kx - 128) + '" y="' + (ky - 20) + '" text-anchor="middle" font-family="var(--body)" font-size="9" fill="' + FLC.dim + '">invisible polish</text>';
    inner += '<text x="' + (kx + 128) + '" y="' + (ky - 34) + '" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="700" fill="' + FLC.or + '">FAST</text>';
    inner += '<text x="' + (kx + 128) + '" y="' + (ky - 20) + '" text-anchor="middle" font-family="var(--body)" font-size="9" fill="' + FLC.dim + '">the hard tuned effect</text>';
    inner += '<rect x="' + (kx - 62) + '" y="' + (ky - 62) + '" width="124" height="124" rx="62" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="8 6"/>';
    inner += miniKnob(590, ky, 20);
    inner += '<text x="590" y="' + (ky + 40) + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" fill="' + FLC.dim + '">MIX — keep at 100%</text>';
    inner += pill(350, top + 246, "One knob decides the style: slow = confidence, fast = a genre");
    return flWindow(700, 320, "Pitcher   (Signature — after compression, before reverb)", inner);
  };

  /* ---------- NewTone: drag the flat note up ---------- */
  SVGX.newtoneWindow = function () {
    var inner = "";
    var rows = ["D4", "C4", "B3", "A3", "G3"];
    var top = 60, rowH = 34, gx = 90, gw = 560;
    rows.forEach(function (nm, r) {
      var y = top + r * rowH;
      inner += '<rect x="' + gx + '" y="' + y + '" width="' + gw + '" height="' + (rowH - 2) + '" fill="' + (r % 2 ? "#2B333B" : "#2F373F") + '"/>';
      inner += '<text x="' + (gx - 10) + '" y="' + (y + 21) + '" text-anchor="end" font-family="var(--mono)" font-size="10" fill="' + FLC.dim + '">' + nm + "</text>";
      inner += '<line x1="' + gx + '" y1="' + (y + rowH / 2) + '" x2="' + (gx + gw) + '" y2="' + (y + rowH / 2) + '" stroke="#454F59" stroke-width="0.8"/>';
    });
    function blob(x, w, row, offset, col) {
      var cy = top + row * rowH + rowH / 2 + (offset || 0);
      var r2 = '<rect x="' + x + '" y="' + (cy - 8) + '" width="' + w + '" height="16" rx="8" fill="' + col + '" opacity=".85"/>';
      r2 += '<path d="M ' + (x + 6) + " " + cy + " q 8 -4 16 0 t 16 0 t 16 0" + '" fill="none" stroke="#1E3318" stroke-width="1.4" opacity=".6"/>';
      return r2;
    }
    inner += blob(gx + 14, 88, 1, 0, "#7DBF6E");
    inner += blob(gx + 116, 74, 0, 0, "#7DBF6E");
    inner += blob(gx + 204, 96, 1, 0, "#7DBF6E");
    inner += blob(gx + 316, 90, 2, 12, "#D9A24C");
    inner += blob(gx + 422, 118, 3, 0, "#7DBF6E");
    var fx = gx + 316 + 45, fy = top + 2 * rowH + rowH / 2 + 12;
    inner += '<rect x="' + (gx + 308) + '" y="' + (fy - 16) + '" width="112" height="32" rx="9" fill="none" stroke="var(--focus)" stroke-width="3" stroke-dasharray="7 5"/>';
    inner += '<path d="M ' + fx + " " + (fy - 24) + " L " + fx + " " + (fy - 48) + '" stroke="var(--focus)" stroke-width="2.5"/><path d="M ' + (fx - 7) + " " + (fy - 42) + " L " + fx + " " + (fy - 52) + " L " + (fx + 7) + " " + (fy - 42) + ' Z" fill="var(--focus)"/>';
    inner += pill(380, 34, "The sagging note is the flat one — drag JUST that one up onto its line");
    return flWindow(720, 270, "NewTone   (Signature — fixes single notes invisibly)", inner);
  };

  /* ---------- telephone band: what you cut, what you keep ---------- */
  SVGX.charFilter = function () {
    var s = '<svg viewBox="0 0 760 250" role="img" aria-label="The telephone effect — keep only the middle band">';
    var gx = 70, gw = 620, gy = 170;
    s += '<path d="M ' + gx + " " + gy + " C " + (gx + 60) + " " + (gy - 60) + ", " + (gx + 120) + " " + (gy - 86) + ", " + (gx + 280) + " " + (gy - 82) +
         " C " + (gx + 440) + " " + (gy - 78) + ", " + (gx + 520) + " " + (gy - 40) + ", " + (gx + gw) + " " + gy +
         ' Z" fill="var(--accent)" opacity=".18"/>';
    s += '<rect x="' + (gx + 205) + '" y="' + (gy - 96) + '" width="215" height="108" rx="8" fill="var(--accent)" opacity=".30"/>';
    s += '<rect x="' + (gx + 205) + '" y="' + (gy - 96) + '" width="215" height="108" rx="8" fill="none" stroke="var(--accent-deep)" stroke-width="2.5"/>';
    s += '<line x1="' + (gx + 40) + '" y1="' + (gy - 70) + '" x2="' + (gx + 150) + '" y2="' + (gy - 10) + '" stroke="var(--ink-faint)" stroke-width="3"/>';
    s += '<line x1="' + (gx + 40) + '" y1="' + (gy - 10) + '" x2="' + (gx + 150) + '" y2="' + (gy - 70) + '" stroke="var(--ink-faint)" stroke-width="3"/>';
    s += '<line x1="' + (gx + 470) + '" y1="' + (gy - 66) + '" x2="' + (gx + 580) + '" y2="' + (gy - 8) + '" stroke="var(--ink-faint)" stroke-width="3"/>';
    s += '<line x1="' + (gx + 470) + '" y1="' + (gy - 8) + '" x2="' + (gx + 580) + '" y2="' + (gy - 66) + '" stroke="var(--ink-faint)" stroke-width="3"/>';
    s += '<line x1="' + gx + '" y1="' + gy + '" x2="' + (gx + gw) + '" y2="' + gy + '" stroke="var(--line-strong)" stroke-width="1.6"/>';
    [["100 Hz", 60], ["500 Hz", 205], ["3 kHz", 420], ["10 kHz", 570]].forEach(function (f) {
      s += '<text x="' + (gx + f[1]) + '" y="' + (gy + 22) + '" text-anchor="middle" font-family="var(--mono)" font-size="10.5" fill="var(--ink-faint)">' + f[0] + "</text>";
    });
    s += '<text x="' + (gx + 95) + '" y="' + (gy - 106) + '" text-anchor="middle" font-family="var(--body)" font-size="11.5" font-weight="700" fill="var(--ink-soft)">CUT the warmth</text>';
    s += '<text x="' + (gx + 312) + '" y="' + (gy - 108) + '" text-anchor="middle" font-family="var(--body)" font-size="12.5" font-weight="800" fill="var(--accent-deep)">KEEP — the telephone band</text>';
    s += '<text x="' + (gx + 525) + '" y="' + (gy - 106) + '" text-anchor="middle" font-family="var(--body)" font-size="11.5" font-weight="700" fill="var(--ink-soft)">CUT the air</text>';
    s += '<text x="380" y="240" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">In Fruity Filter or EQ 2: high-pass at 500 Hz + low-pass at 3 kHz. What’s left is a voice down a phone line.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- one section on its own effect track ---------- */
  SVGX.splitTrack = function () {
    var top = 42, x0 = 34, trackW = 168, gridX = x0 + trackW, gridW = 760 - 68 - trackW;
    var rowH = 52, barW = gridW / 16;
    var h = top + 26 + 2 * rowH + 56;
    var inner = "";
    inner += '<rect x="' + x0 + '" y="' + top + '" width="' + (760 - 68) + '" height="24" fill="' + FLC.dark + '"/>';
    for (var bnum = 1; bnum <= 16; bnum += 4) {
      inner += '<text x="' + (gridX + (bnum - 1) * barW + 4) + '" y="' + (top + 16) + '" font-family="var(--mono)" font-size="9" fill="' + FLC.dim + '">' + bnum + "</text>";
    }
    var names = ["Vocal — normal chain", "Telephone track"];
    for (var r = 0; r < 2; r++) {
      var y = top + 26 + r * rowH;
      inner += '<rect x="' + x0 + '" y="' + y + '" width="' + trackW + '" height="' + (rowH - 2) + '" fill="#333B44"/>';
      inner += '<text x="' + (x0 + 10) + '" y="' + (y + 30) + '" font-family="var(--body)" font-size="10.5" fill="' + FLC.txt + '">' + names[r] + "</text>";
      for (var b4 = 0; b4 < 4; b4++) {
        inner += '<rect x="' + (gridX + b4 * 4 * barW) + '" y="' + y + '" width="' + (4 * barW) + '" height="' + (rowH - 2) + '" fill="' + (b4 % 2 ? "#2B3641" : "#26313B") + '"/>';
      }
    }
    function vclip(track, fromBar, toBar, name, col) {
      var y = top + 26 + track * rowH + 4;
      var cx = gridX + (fromBar - 1) * barW, cw = (toBar - fromBar + 1) * barW - 3;
      return '<rect x="' + cx + '" y="' + y + '" width="' + cw + '" height="' + (rowH - 12) + '" rx="3" fill="' + col + '" opacity=".38"/>' +
             '<rect x="' + cx + '" y="' + y + '" width="' + cw + '" height="12" rx="3" fill="' + col + '"/>' +
             '<text x="' + (cx + 5) + '" y="' + (y + 9.5) + '" font-family="var(--body)" font-size="8.5" font-weight="600" fill="#F2F4F6">' + esc(name) + "</text>";
    }
    inner += vclip(0, 1, 8, "Verse 1 + chorus", "#B05A5E");
    inner += vclip(1, 9, 12, "Verse 2 — telephone", "#B58A3E");
    inner += vclip(0, 13, 16, "Chorus", "#B05A5E");
    [9, 13].forEach(function (bar) {
      var sx = gridX + (bar - 1) * barW;
      inner += '<line x1="' + sx + '" y1="' + (top + 26) + '" x2="' + sx + '" y2="' + (top + 26 + 2 * rowH) + '" stroke="var(--focus)" stroke-width="2.5" stroke-dasharray="6 4"/>';
      inner += '<text x="' + sx + '" y="' + (top + 26 + 2 * rowH + 16) + '" text-anchor="middle" font-size="12">✂</text>';
    });
    inner += pill(400, h - 12, "Slice at the section edges, drag the middle piece to its own track — the song swaps voices automatically");
    return flWindow(760, h, "Playlist — one section, different voice", inner);
  };

  /* ---------- harmony: two letter-names up ---------- */
  SVGX.harmonyRoll = function () {
    var rows = ["A4", "G4", "F4", "E4", "D4", "C4"];
    var top = 56, rowH = 24, gx = 84, gw = 560, cell = gw / 8;
    var h = top + rows.length * rowH + 66;
    var inner = "";
    rows.forEach(function (nm, r) {
      var y = top + r * rowH;
      inner += '<rect x="' + gx + '" y="' + y + '" width="' + gw + '" height="' + (rowH - 1) + '" fill="' + (r % 2 ? "#2B333B" : "#2F373F") + '"/>';
      inner += '<text x="' + (gx - 10) + '" y="' + (y + 16) + '" text-anchor="end" font-family="var(--mono)" font-size="9.5" fill="' + FLC.dim + '">' + nm + "</text>";
    });
    var mel = [[0, 5], [2, 4], [4, 3], [6, 5]];
    mel.forEach(function (n) {
      var x = gx + n[0] * cell + 3, y = top + n[1] * rowH + 2;
      inner += '<rect x="' + x + '" y="' + y + '" width="' + (cell * 2 - 8) + '" height="' + (rowH - 5) + '" rx="4" fill="#7DBF6E" stroke="#4E8A44" stroke-width="1.2"/>';
      var hy = top + (n[1] - 2) * rowH + 2;
      inner += '<rect x="' + x + '" y="' + hy + '" width="' + (cell * 2 - 8) + '" height="' + (rowH - 5) + '" rx="4" fill="#D9A24C" stroke="#A87A2E" stroke-width="1.2"/>';
      inner += '<line x1="' + (x + 14) + '" y1="' + (y + 2) + '" x2="' + (x + 14) + '" y2="' + (hy + rowH - 4) + '" stroke="var(--focus)" stroke-width="1.6" stroke-dasharray="4 3" opacity=".7"/>';
    });
    inner += '<rect x="' + (gx + gw + 8) + '" y="' + (top + 8) + '" width="14" height="14" rx="3" fill="#7DBF6E"/><text x="' + (gx + gw + 28) + '" y="' + (top + 19) + '" font-family="var(--body)" font-size="9.5" fill="' + FLC.txt + '">melody</text>';
    inner += '<rect x="' + (gx + gw + 8) + '" y="' + (top + 32) + '" width="14" height="14" rx="3" fill="#D9A24C"/><text x="' + (gx + gw + 28) + '" y="' + (top + 43) + '" font-family="var(--body)" font-size="9.5" fill="' + FLC.txt + '">harmony</text>';
    inner += pill(380, h - 12, "Every harmony note = the melody note moved TWO letter-names up. C→E, D→F, E→G.");
    return flWindow(760, h, "The harmony, drawn — a third above the melody", inner);
  };

  /* ---------- tempo automation curve ---------- */

  SVGX.tempoCurve = function () {
    var s = '<svg viewBox="0 0 760 250" role="img" aria-label="Tempo changes across the song">';
    var secs = [
      { n: "Verse", w: 120 }, { n: "Chorus", w: 120 }, { n: "Verse 2", w: 110 },
      { n: "Chorus", w: 120 }, { n: "Bridge", w: 90 }, { n: "FINAL CHORUS", w: 130 }, { n: "Outro", w: 60 }
    ];
    var x = 40, top = 40;
    secs.forEach(function (p) {
      var isBig = p.n === "FINAL CHORUS";
      s += '<rect x="' + x + '" y="' + top + '" width="' + (p.w - 4) + '" height="34" rx="7" fill="' + (isBig ? "var(--accent)" : "color-mix(in srgb, var(--accent) 28%, var(--surface-sunk))") + '"/>';
      s += '<text x="' + (x + p.w / 2 - 2) + '" y="' + (top + 22) + '" text-anchor="middle" font-family="var(--body)" font-size="10" font-weight="' + (isBig ? 800 : 600) + '" fill="' + (isBig ? "#fff" : "var(--ink-soft)") + '">' + p.n + '</text>';
      x += p.w;
    });
    // BPM curve: flat 120 → ramp up through bridge → 126 at final chorus → falls at outro (rit.)
    var yFor = function (bpm) { return 200 - (bpm - 85) * 1.7; };
    var path = "M 40 " + yFor(120) + " L 500 " + yFor(120) + " C 540 " + yFor(120) + ", 560 " + yFor(126) + ", 590 " + yFor(126) +
               " L 660 " + yFor(126) + " C 690 " + yFor(126) + ", 700 " + yFor(92) + ", 736 " + yFor(88);
    s += '<path d="' + path + '" fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/>';
    s += '<circle cx="40" cy="' + yFor(120) + '" r="5" fill="var(--accent)"/><circle cx="590" cy="' + yFor(126) + '" r="5" fill="var(--accent)"/><circle cx="736" cy="' + yFor(88) + '" r="5" fill="var(--accent)"/>';
    s += '<text x="52" y="' + (yFor(120) - 10) + '" font-family="var(--mono)" font-size="12" font-weight="700" fill="var(--ink)">120 BPM</text>';
    s += '<text x="586" y="' + (yFor(126) - 10) + '" text-anchor="middle" font-family="var(--mono)" font-size="12" font-weight="700" fill="var(--accent-deep)">126 — lifts</text>';
    s += '<text x="712" y="' + (yFor(88) + 20) + '" text-anchor="middle" font-family="var(--mono)" font-size="12" font-weight="700" fill="var(--ink-soft)">rit. 88</text>';
    s += '<text x="380" y="240" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">Right-click the BPM display → Create automation clip. A 4–6 BPM lift into the final chorus reads as excitement, not a mistake.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- build/sweep automation into a chorus ---------- */

  SVGX.sweepCurve = function () {
    var s = '<svg viewBox="0 0 760 240" role="img" aria-label="The pre-chorus build">';
    var secs = [{ n: "Verse (darker, thinner)", x: 40, w: 250, big: false }, { n: "Pre-chorus (building…)", x: 290, w: 190, big: false }, { n: "CHORUS (everything opens)", x: 480, w: 240, big: true }];
    secs.forEach(function (p) {
      s += '<rect x="' + p.x + '" y="40" width="' + (p.w - 4) + '" height="34" rx="7" fill="' + (p.big ? "var(--accent)" : "color-mix(in srgb, var(--accent) 28%, var(--surface-sunk))") + '"/>';
      s += '<text x="' + (p.x + p.w / 2 - 2) + '" y="62" text-anchor="middle" font-family="var(--body)" font-size="10.5" font-weight="' + (p.big ? 800 : 600) + '" fill="' + (p.big ? "#fff" : "var(--ink-soft)") + '">' + p.n + '</text>';
    });
    s += '<path d="M 40 185 L 290 185 C 380 185, 420 180, 476 110 L 480 105 L 480 92 L 720 92" fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/>';
    s += '<text x="60" y="172" font-family="var(--body)" font-size="11.5" fill="var(--ink-soft)">filter closed · volume lower · no cymbals</text>';
    s += '<text x="595" y="118" text-anchor="middle" font-family="var(--body)" font-size="11.5" font-weight="700" fill="var(--accent-deep)">full brightness, full level</text>';
    s += '<circle cx="480" cy="98" r="6" fill="var(--accent)"/>';
    s += '<text x="380" y="228" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">Automate volume or a filter rising through the pre-chorus — the chorus lands because the road to it climbed.</text>';
    s += '</svg>';
    return s;
  };

  /* ---------- where plugins live: the Add-plugin picker ---------- */
  SVGX.pluginPicker = function () {
    var inner = "";
    var top = 44;
    // left: a fragment of the channel rack bottom with the + ringed
    inner += '<rect x="34" y="' + top + '" width="200" height="150" rx="4" fill="' + FLC.well + '" stroke="' + FLC.edge + '" stroke-width="1.4"/>';
    inner += '<text x="44" y="' + (top + 18) + '" font-family="var(--body)" font-size="10" fill="' + FLC.dim + '">Channel Rack (F6)</text>';
    ["Kick", "Snare", "Hat"].forEach(function (nm, i) {
      var y = top + 30 + i * 26;
      inner += '<rect x="44" y="' + y + '" width="150" height="20" rx="3" fill="#5F6A94" opacity=".8"/>';
      inner += '<text x="119" y="' + (y + 14) + '" text-anchor="middle" font-family="var(--body)" font-size="9.5" fill="#EFF2F5">' + nm + '</text>';
    });
    inner += '<circle cx="66" cy="' + (top + 126) + '" r="11" fill="' + FLC.dark + '" stroke="' + FLC.or + '" stroke-width="1.6"/>';
    inner += '<text x="66" y="' + (top + 131) + '" text-anchor="middle" font-family="var(--body)" font-size="14" font-weight="800" fill="' + FLC.or + '">+</text>';
    inner += ring(66, top + 126, 17);
    inner += '<text x="120" y="' + (top + 131) + '" font-family="var(--body)" font-size="9.5" font-weight="700" fill="var(--focus)">click this…</text>';
    // arrow to the picker
    inner += '<path d="M 240 ' + (top + 100) + ' C 262 ' + (top + 100) + ', 262 ' + (top + 80) + ', 282 ' + (top + 80) + '" fill="none" stroke="var(--focus)" stroke-width="2.5"/>';
    inner += '<path d="M 278 ' + (top + 74) + ' L 290 ' + (top + 80) + ' L 278 ' + (top + 86) + ' Z" fill="var(--focus)"/>';
    // right: the picker list
    inner += '<rect x="292" y="' + top + '" width="330" height="216" rx="4" fill="' + FLC.dark + '" stroke="' + FLC.edge + '" stroke-width="1.4"/>';
    inner += '<text x="306" y="' + (top + 20) + '" font-family="var(--body)" font-size="10.5" font-weight="700" fill="' + FLC.txt + '">…and this list opens</text>';
    var gens = ["3x Osc", "FLEX", "FPC", "Fruity Slicer", "GMS", "Sytrus", "BassDrum", "Plucked!"];
    gens.forEach(function (g, i) {
      var y = top + 32 + i * 22;
      var sel = g === "FLEX";
      if (sel) inner += '<rect x="298" y="' + (y - 3) + '" width="318" height="20" rx="3" fill="' + FLC.or + '"/>';
      inner += '<path d="M 308 ' + (y + 3) + ' l 0 8 l 6 -4 Z" fill="' + (sel ? "#1E1503" : FLC.dim) + '"/>';
      inner += '<text x="322" y="' + (y + 11) + '" font-family="var(--body)" font-size="11" font-weight="' + (sel ? 800 : 500) + '" fill="' + (sel ? "#1E1503" : FLC.dim) + '">' + g + (sel ? "   ← the sound library" : "") + '</text>';
    });
    inner += pill(330, 24, "Every instrument is already inside FL — nothing to download or buy");
    return flWindow(660, 300, "Add a plugin   (the + at the bottom of the Channel Rack)", inner);
  };

  /* ---------- FLEX macro knobs: one preset, a hundred sounds ---------- */
  SVGX.flexMacros = function () {
    var inner = "";
    var top = 46;
    inner += '<rect x="34" y="' + top + '" width="' + (700 - 68) + '" height="34" rx="4" fill="' + FLC.dark + '"/>';
    inner += '<text x="350" y="' + (top + 22) + '" text-anchor="middle" font-family="var(--display)" font-size="14" font-weight="700" fill="' + FLC.txt + '">Dreamy Keys</text>';
    inner += '<text x="48" y="' + (top + 22) + '" font-family="var(--body)" font-size="10" fill="' + FLC.dim + '">◀ preset ▶</text>';
    var macros = [
      ["FILTER", "darker ↔ brighter"], ["RESO", "hollow ↔ whistly"], ["ATTACK", "pluck ↔ swell"], ["RELEASE", "dry ↔ ringing"],
      ["SPACE", "close ↔ huge"], ["MOTION", "still ↔ alive"], ["DRIVE", "clean ↔ furry"], ["MASTER", "volume"]
    ];
    macros.forEach(function (m, i) {
      var kx = 76 + i * 79, ky = top + 128;
      inner += miniKnob(kx, ky, 19);
      inner += '<text x="' + kx + '" y="' + (ky + 40) + '" text-anchor="middle" font-family="var(--body)" font-size="9" letter-spacing=".06em" font-weight="700" fill="' + FLC.txt + '">' + m[0] + '</text>';
      inner += '<text x="' + kx + '" y="' + (ky + 55) + '" text-anchor="middle" font-family="var(--body)" font-size="8" fill="' + FLC.dim + '">' + m[1] + '</text>';
    });
    inner += '<rect x="42" y="' + (top + 96) + '" width="616" height="100" rx="8" fill="none" stroke="var(--focus)" stroke-width="2.5" stroke-dasharray="7 5"/>';
    inner += pill(350, 24, "These knobs are the whole game — same preset, turned into a hundred different sounds");
    return flWindow(700, 290, "FLEX — the macro knobs along the bottom", inner);
  };

  /* ---------- 3xOsc: the spaceship recipe ---------- */
  SVGX.osc3Window = function () {
    var inner = "";
    var top = 48;
    var oscs = [
      { n: "OSC 1", shape: 0, note: "sine — the body" },
      { n: "OSC 2", shape: 2, note: "saw, CRS −12 — engine" },
      { n: "OSC 3", shape: 2, note: "saw, FINE +7 — shimmer" }
    ];
    oscs.forEach(function (o, i) {
      var y = top + 10 + i * 74;
      inner += '<rect x="34" y="' + y + '" width="' + (700 - 68) + '" height="64" rx="4" fill="' + (i % 2 ? FLC.well : "#333B44") + '" stroke="' + FLC.edge + '" stroke-width="1"/>';
      inner += '<text x="48" y="' + (y + 24) + '" font-family="var(--body)" font-size="11" font-weight="800" fill="' + FLC.txt + '">' + o.n + '</text>';
      // waveform shape buttons: sine, tri, saw, square, noise
      for (var s2 = 0; s2 < 5; s2++) {
        var bx = 110 + s2 * 34, sel = s2 === o.shape;
        inner += '<rect x="' + bx + '" y="' + (y + 10) + '" width="28" height="22" rx="3" fill="' + (sel ? FLC.or : FLC.dark) + '" stroke="' + FLC.edge + '" stroke-width="1"/>';
        var mid = y + 21, c = sel ? "#1E1503" : FLC.dim;
        if (s2 === 0) inner += '<path d="M ' + (bx + 5) + ' ' + mid + ' q 4.5 -8 9 0 t 9 0" fill="none" stroke="' + c + '" stroke-width="1.6"/>';
        if (s2 === 1) inner += '<path d="M ' + (bx + 5) + ' ' + (mid + 4) + ' l 4.5 -8 l 4.5 8 l 4.5 -8 l 4.5 8" fill="none" stroke="' + c + '" stroke-width="1.6"/>';
        if (s2 === 2) inner += '<path d="M ' + (bx + 5) + ' ' + (mid + 4) + ' l 9 -8 l 0 8 l 9 -8 l 0 8" fill="none" stroke="' + c + '" stroke-width="1.6"/>';
        if (s2 === 3) inner += '<path d="M ' + (bx + 5) + ' ' + (mid + 4) + ' l 0 -8 l 9 0 l 0 8 l 9 0 l 0 -8" fill="none" stroke="' + c + '" stroke-width="1.6"/>';
        if (s2 === 4) inner += '<path d="M ' + (bx + 5) + ' ' + mid + ' l 2 -4 l 2 6 l 2 -7 l 2 5 l 2 -3 l 2 6 l 2 -5 l 2 3" fill="none" stroke="' + c + '" stroke-width="1.4"/>';
      }
      // knobs CRS FINE PAN VOL
      ["CRS", "FINE", "PAN", "VOL"].forEach(function (k, ki) {
        var kx = 320 + ki * 52;
        inner += miniKnob(kx, y + 22, 12);
        inner += '<text x="' + kx + '" y="' + (y + 48) + '" text-anchor="middle" font-family="var(--body)" font-size="7.5" fill="' + FLC.dim + '">' + k + '</text>';
      });
      inner += '<text x="540" y="' + (y + 26) + '" font-family="var(--body)" font-size="9" fill="' + FLC.or + '">' + o.note + '</text>';
    });
    inner += pill(350, 24, "Three oscillators = three voices humming together. This exact recipe is the spaceship");
    return flWindow(700, 300, "3x Osc   (included in every FL edition)", inner);
  };

  /* ---------- attack/release: why slow attack = pad, fast = pluck ---------- */
  SVGX.envCurve = function () {
    var s = '<svg viewBox="0 0 760 250" role="img" aria-label="The volume envelope — attack and release">';
    function env(x0, aw, label, sub, attackFrac) {
      var base = 170, h = 100, w = 300;
      var r = '<line x1="' + x0 + '" y1="' + base + '" x2="' + (x0 + w) + '" y2="' + base + '" stroke="var(--line-strong)" stroke-width="1.5"/>';
      var ax = x0 + w * attackFrac;
      r += '<path d="M ' + x0 + ' ' + base + ' C ' + (x0 + w * attackFrac * 0.6) + ' ' + base + ', ' + (x0 + w * attackFrac * 0.7) + ' ' + (base - h) + ', ' + ax + ' ' + (base - h) +
           ' L ' + (x0 + w * 0.62) + ' ' + (base - h) +
           ' C ' + (x0 + w * 0.8) + ' ' + (base - h) + ', ' + (x0 + w * 0.86) + ' ' + base + ', ' + (x0 + w * 0.98) + ' ' + base + '" fill="var(--accent)" opacity=".2"/>';
      r += '<path d="M ' + x0 + ' ' + base + ' C ' + (x0 + w * attackFrac * 0.6) + ' ' + base + ', ' + (x0 + w * attackFrac * 0.7) + ' ' + (base - h) + ', ' + ax + ' ' + (base - h) +
           ' L ' + (x0 + w * 0.62) + ' ' + (base - h) +
           ' C ' + (x0 + w * 0.8) + ' ' + (base - h) + ', ' + (x0 + w * 0.86) + ' ' + base + ', ' + (x0 + w * 0.98) + ' ' + base + '" fill="none" stroke="var(--accent)" stroke-width="3"/>';
      r += '<text x="' + (x0 + w / 2) + '" y="42" text-anchor="middle" font-family="var(--display)" font-size="15" font-weight="800" fill="var(--ink)">' + label + '</text>';
      r += '<text x="' + (x0 + w / 2) + '" y="62" text-anchor="middle" font-family="var(--body)" font-size="11" fill="var(--ink-soft)">' + sub + '</text>';
      // attack arrow
      r += '<path d="M ' + x0 + ' ' + (base + 20) + ' L ' + ax + ' ' + (base + 20) + '" stroke="var(--accent-deep)" stroke-width="2"/>';
      r += '<text x="' + ((x0 + ax) / 2) + '" y="' + (base + 38) + '" text-anchor="middle" font-family="var(--body)" font-size="10" font-weight="700" fill="var(--accent-deep)">ATTACK</text>';
      r += '<text x="' + (x0 + w * 0.84) + '" y="' + (base + 38) + '" text-anchor="middle" font-family="var(--body)" font-size="10" font-weight="700" fill="var(--ink-faint)">RELEASE</text>';
      return r;
    }
    s += env(50, 0, "Fast attack", "pluck, key, drum — the note hits instantly", 0.05);
    s += env(420, 0, "Slow attack", "pad, strings, spaceship — the note swells in", 0.4);
    s += '<text x="380" y="238" text-anchor="middle" font-family="var(--body)" font-size="12" fill="var(--ink-soft)">Same sound, different envelope, different instrument. In 3xOsc: channel settings → the INS envelope. In FLEX: the ATTACK and RELEASE macros.</text>';
    return s + '</svg>';
  };

  /* ---------- the vocoder routing map ---------- */
  SVGX.vocoderRoute = function () {
    var s = '<svg viewBox="0 0 760 360" role="img" aria-label="How the vocoder is wired">';
    s += nodeBox(30, 46, 200, 66, "Your voice", "the words & rhythm (MOD)");
    s += nodeBox(30, 200, 200, 66, "3x Osc — held chord", "the robot's throat (CAR)");
    s += nodeBox(320, 116, 210, 78, "Fruity Vocoder", "on the VOICE's mixer track", "red");
    s += nodeBox(610, 128, 126, 60, "Robot voice");
    s += wire(230, 79, 320, 140, "voice track");
    s += wire(230, 233, 320, 172, "sidechain send", 12);
    s += wire(530, 155, 610, 158, "");
    s += '<text x="380" y="296" text-anchor="middle" font-family="var(--body)" font-size="12.5" font-weight="650" fill="var(--ink)">The vocoder pushes your WORDS through the synth’s TONE — you speak, the chord talks.</text>';
    s += '<text x="380" y="318" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-soft)">Voice and synth sit on two mixer tracks; the synth is sent to the voice’s track as a sidechain,</text>';
    s += '<text x="380" y="336" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-soft)">and Fruity Vocoder on the voice’s track listens to both. Silent robot? Swap which input is MOD and CAR.</text>';
    return s + '</svg>';
  };

  /* ---------- Audio MIDI Setup: listening together ---------- */
  SVGX.macAudioMidi = function () {
    var s = '<svg viewBox="0 0 680 360" role="img" aria-label="Audio MIDI Setup — Multi-Output Device">';
    s += '<rect x="10" y="8" width="660" height="340" rx="14" fill="#F5F4F2" stroke="#C9C6C1" stroke-width="1.6"/>';
    s += '<circle cx="38" cy="32" r="6.5" fill="#FF5F57"/><circle cx="60" cy="32" r="6.5" fill="#FEBC2E"/><circle cx="82" cy="32" r="6.5" fill="#28C840"/>';
    s += '<text x="340" y="37" text-anchor="middle" font-family="var(--body)" font-size="14" font-weight="700" fill="#3A3733">Audio MIDI Setup   (Applications → Utilities)</text>';
    // left device list
    s += '<rect x="10" y="52" width="240" height="296" fill="#EAE8E4"/>';
    var devs = [
      ["MacBook Microphone", false], ["MacBook Speakers", false], ["External Headphones", false],
      ["Scarlett Solo USB", false], ["Multi-Output Device", true]
    ];
    devs.forEach(function (d, i) {
      var y = 88 + i * 40;
      if (d[1]) s += '<rect x="18" y="' + (y - 22) + '" width="224" height="32" rx="8" fill="#C6362C"/>';
      s += '<text x="34" y="' + y + '" font-family="var(--body)" font-size="12.5" font-weight="' + (d[1] ? 700 : 500) + '" fill="' + (d[1] ? "#fff" : "#4A4741") + '">' + d[0] + '</text>';
    });
    // + button bottom-left, ringed
    s += '<rect x="20" y="310" width="30" height="26" rx="6" fill="#FFFFFF" stroke="#C9C6C1" stroke-width="1.4"/>';
    s += '<text x="35" y="329" text-anchor="middle" font-family="var(--body)" font-size="17" font-weight="700" fill="#3A3733">+</text>';
    s += ring(35, 323, 22);
    s += '<text x="130" y="330" font-family="var(--body)" font-size="10.5" font-weight="700" fill="var(--focus)">+ → Create Multi-Output Device</text>';
    // right pane: use/drift table
    s += '<text x="272" y="80" font-family="var(--body)" font-size="13" font-weight="700" fill="#2C2925">Multi-Output Device — tick both:</text>';
    s += '<text x="560" y="104" font-family="var(--body)" font-size="10.5" font-weight="700" fill="#8A867F">USE</text>';
    s += '<text x="605" y="104" font-family="var(--body)" font-size="10.5" font-weight="700" fill="#8A867F">DRIFT</text>';
    var rows = [
      ["Scarlett Solo USB", "her headphones, via the Solo", true, false],
      ["External Headphones", "the listener, via the Mac’s jack", true, true],
      ["MacBook Speakers", "or out loud instead", false, false]
    ];
    rows.forEach(function (r, i) {
      var y = 128 + i * 52;
      s += '<rect x="266" y="' + (y - 24) + '" width="388" height="44" rx="10" fill="#FFFFFF" stroke="#DBD8D3" stroke-width="1.2"/>';
      s += '<text x="282" y="' + y + '" font-family="var(--body)" font-size="12.5" font-weight="600" fill="#2C2925">' + r[0] + '</text>';
      s += '<text x="282" y="' + (y + 14) + '" font-family="var(--body)" font-size="10" fill="#8A867F">' + r[1] + '</text>';
      s += '<rect x="556" y="' + (y - 10) + '" width="18" height="18" rx="4" fill="' + (r[2] ? "#C6362C" : "#FFFFFF") + '" stroke="#C9C6C1" stroke-width="1.2"/>';
      if (r[2]) s += '<path d="M 560 ' + (y - 1) + ' l 4 4 l 7 -8" fill="none" stroke="#fff" stroke-width="2.2"/>';
      s += '<rect x="604" y="' + (y - 10) + '" width="18" height="18" rx="4" fill="' + (r[3] ? "#C6362C" : "#FFFFFF") + '" stroke="#C9C6C1" stroke-width="1.2"/>';
      if (r[3]) s += '<path d="M 608 ' + (y - 1) + ' l 4 4 l 7 -8" fill="none" stroke="#fff" stroke-width="2.2"/>';
    });
    s += '<text x="266" y="300" font-family="var(--body)" font-size="10.5" fill="#8A867F">Sample rate: 44.1 kHz on BOTH · Drift ticks on all EXCEPT the Scarlett</text>';
    s += '<text x="266" y="318" font-family="var(--body)" font-size="10.5" fill="#8A867F">Volume keys stop working here — use each device’s own volume</text>';
    return s + '</svg>';
  };

  /* ============================================================
     Inject into reference cards: <figure data-svg="name">
     ============================================================ */

  var refMap = {
    connectionMap: function () { return SVGX.connectionMap(); },
    frontFull: SVGX.frontFull,
    frontVocal: SVGX.frontVocal,
    backPanel: SVGX.backPanel,
    cableTypes: SVGX.cableTypes,
    macMic: SVGX.macMic,
    macSound: SVGX.macSound,
    flAudioPlain: SVGX.flAudioPlain,
    rackSelect: SVGX.rackSelect,
    rackSteps: SVGX.rackSteps,
    mixerArm: SVGX.mixerArm,
    toolbarRec: SVGX.toolbarRec,
    drumMap: SVGX.drumMap,
    gainHalo: SVGX.gainHalo,
    echoPaths: SVGX.echoPaths,
    hatRoll: SVGX.hatRoll,
    interlock: SVGX.interlock,
    vocalSpace: SVGX.vocalSpace,
    songArc: SVGX.songArc,
    tempoCurve: SVGX.tempoCurve,
    sweepCurve: SVGX.sweepCurve,
    flPlaylist: function () { return SVGX.flPlaylist(); },
    mixerMaster: function () { return SVGX.mixerMaster(); },
    flPianoRoll: function () { return SVGX.flPianoRoll(null); },
    flexWindow: function () { return SVGX.flexWindow(); },
    rackHumanise: function () { return SVGX.rackHumanise(); },
    vocalChain: function () { return SVGX.vocalChain(); },
    freqMap: function () { return SVGX.freqMap(); },
    reverbAnatomy: function () { return SVGX.reverbAnatomy(); },
    kbZones: function () { return SVGX.kbZones(); },
    projectMap: function () { return SVGX.projectMap(0); },
    pluginPicker: function () { return SVGX.pluginPicker(); },
    flexMacros: function () { return SVGX.flexMacros(); },
    osc3Window: function () { return SVGX.osc3Window(); },
    envCurve: function () { return SVGX.envCurve(); },
    vocoderRoute: function () { return SVGX.vocoderRoute(); },
    macAudioMidi: function () { return SVGX.macAudioMidi(); },
    drumKitFull: function () { return SVGX.drumKitFull(); },
    chorusLift: function () { return SVGX.chorusLift(); },
    reverbWindow: function () { return SVGX.reverbWindow(); },
    eqCurve: function () { return SVGX.eqCurve(); },
    compDiagram: function () { return SVGX.compDiagram(); },
    delayTaps: function () { return SVGX.delayTaps(); },
    mixerVocal: function () { return SVGX.mixerVocal(); },
    stackDiagram: function () { return SVGX.stackDiagram(); },
    harmonyRoll: function () { return SVGX.harmonyRoll(); },
    charFilter: function () { return SVGX.charFilter(); },
    pitcherWindow: function () { return SVGX.pitcherWindow(); },
    newtoneWindow: function () { return SVGX.newtoneWindow(); },
    splitTrack: function () { return SVGX.splitTrack(); }
  };

  SVGX.injectAll = function () {
    var figs = document.querySelectorAll("[data-svg]");
    Array.prototype.forEach.call(figs, function (f) {
      var name = f.getAttribute("data-svg");
      if (refMap[name]) f.innerHTML = refMap[name]();
    });
  };
})();
