
(function () {
  "use strict";
  /* ================= CORE ================= */
  var doc = document, body = doc.body, root = doc.documentElement, win = window;
  function $(id) { return doc.getElementById(id); }
  function qsa(sel, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(sel)); }
  function mq(q) { try { return win.matchMedia(q).matches; } catch (e) { return false; } }
  var reduce = win.__RIWAYAT.reducedMotion || mq("(prefers-reduced-motion: reduce)");
  var fine = mq("(hover: hover) and (pointer: fine)");
  function clean(s) { s = s == null ? "" : String(s).replace(/\s+/g, " ").trim(); return /\{\{/.test(s) ? "" : s; }
  function cleanML(s) {
    s = s == null ? "" : String(s);
    if (/\{\{/.test(s)) { return ""; }
    return s.replace(/\r\n?/g, "\n").split("\n").map(function (l) { return l.replace(/[ \t]+/g, " ").trim(); }).join("\n").replace(/^\n+|\n+$/g, "");
  }
  function txt(id) { var e = $(id); return e ? clean(e.textContent) : ""; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function pad2(n) { n = Math.floor(Math.abs(n)); return (n < 10 ? "0" : "") + n; }
  var uidN = 0;
  function mkId(p) { uidN += 1; return (p || "x") + "-r" + uidN; }
  function el(tag, cls, parent) { var e = doc.createElement(tag); if (cls) { e.className = cls; } e.id = mkId(tag.charAt(0)); if (parent) { parent.appendChild(e); } return e; }
  function idAll(r, p) { if (!r) { return; } if (!r.id) { r.id = mkId(p); } qsa("*", r).forEach(function (n) { if (!n.id) { n.id = mkId(p); } }); }
  function hashStr(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }
  function svgIcon(name, cls) {
    var s = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "ic " + (cls || "")); s.id = mkId("s");
    var u = doc.createElementNS("http://www.w3.org/2000/svg", "use");
    u.setAttribute("href", "#" + name); u.id = mkId("u"); s.appendChild(u); return s;
  }
  function stkEl(name, cls) { var s = svgIcon("stk-" + name, ""); s.setAttribute("class", "stk " + (cls || "")); return s; }
  var KEY = "dps1:" + win.__RIWAYAT.invitationId + ":";
  var store = {
    get: function (k, d) { try { var v = win.localStorage.getItem(KEY + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { win.localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {} }
  };
  function readTpl(id) {
    var t = $(id); if (!t) { return ""; }
    var src = t.content ? t.content : t;
    var box = doc.createElement("div");
    Array.prototype.forEach.call(src.childNodes, function (n) { box.appendChild(n.cloneNode(true)); });
    qsa("br", box).forEach(function (b) { b.parentNode.replaceChild(doc.createTextNode("\n"), b); });
    qsa("p,div,li", box).forEach(function (b) { b.appendChild(doc.createTextNode("\n")); });
    return cleanML(box.textContent);
  }
  function lines(s) { return cleanML(s).split("\n").map(function (l) { return l.trim(); }).filter(Boolean); }
  var vibrate = function (ms) { try { if (navigator.vibrate) { navigator.vibrate(ms); } } catch (e) {} };

  /* ================= SPRITE ================= */
  var F = ' fill="currentColor" stroke="none"';
  var ICONS = {
    back: '<path d="M15 4.5 7.5 12l7.5 7.5"/>',
    video: '<rect x="2.5" y="6.5" width="13" height="11" rx="3"/><path d="m15.5 10.5 5.5-3.2v9.4l-5.5-3.2"/>',
    phone: '<path d="M5.2 3.5h3.3l1.7 4.3-2.2 1.4a11.6 11.6 0 0 0 6.8 6.8l1.4-2.2 4.3 1.7v3.3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.2 5.6a2 2 0 0 1 2-2.1z"/>',
    more: '<g' + F + '><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></g>',
    moon: '<path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="9.5" r="1.8"/><path d="m3.5 17.5 5-5 4 4 2.5-2.5 5.5 5.5"/>',
    vol: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9a4.2 4.2 0 0 1 0 6M18.6 6.4a7.8 7.8 0 0 1 0 11.2"/>',
    mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
    fwd: '<path d="M14 5l6 6-6 6"/><path d="M20 11H10a6 6 0 0 0-6 6v1.5"/>',
    fwd2: '<path d="M9 6l5 5-5 5"/><path d="M14 6l5 5-5 5"/><path d="M14 11H9a5 5 0 0 0-5 5v2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.4"/>',
    signal: '<g' + F + '><rect x="3" y="15" width="3.2" height="5" rx="1"/><rect x="8" y="11.5" width="3.2" height="8.5" rx="1"/><rect x="13" y="8" width="3.2" height="12" rx="1"/><rect x="18" y="4" width="3.2" height="16" rx="1"/></g>',
    wifi: '<path d="M2.8 9.3a13.5 13.5 0 0 1 18.4 0M6 12.8a8.8 8.8 0 0 1 12 0M9.3 16.2a4.1 4.1 0 0 1 5.4 0"/><circle cx="12" cy="19.2" r="1.3"' + F + '/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.6"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    ring: '<circle cx="12" cy="15" r="6"/><path d="M9.5 5.5 12 9l2.5-3.5L13 3.5h-2z"/>',
    chat: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5z"/>',
    chatheart: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5z"/><path d="M12 12.6s-3-1.8-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 3.8-3 3.8z"' + F + '/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    sparkle: '<path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9z"' + F + '/><path d="M19 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"' + F + '/>',
    users: '<circle cx="9" cy="8.5" r="3.3"/><path d="M3 19.5c.6-3.4 2.9-5.3 6-5.3s5.4 1.9 6 5.3"/><circle cx="17" cy="9.5" r="2.6"/><path d="M15.8 14.4c2.6-.2 4.6 1.3 5.2 4.3"/>',
    user: '<circle cx="12" cy="8.5" r="3.9"/><path d="M4.5 20.5c.8-4.1 3.7-6.2 7.5-6.2s6.7 2.1 7.5 6.2"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.4 2"/>',
    mappin: '<path d="M12 21.5s-6.8-6.2-6.8-11.6a6.8 6.8 0 0 1 13.6 0c0 5.4-6.8 11.6-6.8 11.6z"/><circle cx="12" cy="10" r="2.5"/>',
    poll: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8.5 16v-4M12 16V8M15.5 16v-6"/>',
    pin: '<path d="M9 3.5h6l-1 5 3.5 3.5h-11L10 8.5z"/><path d="M12 12v8.5"/>',
    translate: '<path d="M3.5 5.5h9M8 3.5v2M5.5 5.5c.7 3.5 3 6.2 6 7.4M10.8 5.5c-.8 3.8-3.4 6.8-7.3 8.5"/><path d="M12.5 20.5l4-9 4 9M14 17.5h5"/>',
    history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8"/><path d="M12 7.5V12l3 2"/>',
    swap: '<path d="M4 8h14l-4-4M20 16H6l4 4"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><circle cx="8.5" cy="11" r="2.4"/><path d="M5.2 16.4c.6-1.8 1.8-2.8 3.3-2.8s2.7 1 3.3 2.8M14.5 10h4.5M14.5 13.5h3"/>',
    play: '<path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z"' + F + '/>',
    pause: '<g' + F + '><rect x="6" y="5" width="4" height="14" rx="1.3"/><rect x="14" y="5" width="4" height="14" rx="1.3"/></g>',
    pencil: '<path d="M4 20l1.2-4.8L15.6 4.8a2.1 2.1 0 0 1 3 0l.6.6a2.1 2.1 0 0 1 0 3L8.8 18.8z"/><path d="M13.5 7l3.5 3.5"/>',
    send: '<path d="M21 3 3.5 10.5l7 2.8 2.8 7z"/><path d="M21 3l-10.5 10.3"/>',
    home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5.5h4V20"/>',
    ig: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1"' + F + '/>',
    reply: '<path d="M10 6.5 4 12l6 5.5"/><path d="M4 12h9.5a6.5 6.5 0 0 1 6.5 6.5v1"/>',
    bell: '<path d="M18 16H6l1.5-2V10a4.5 4.5 0 0 1 9 0v4z"/><path d="M10 19a2 2 0 0 0 4 0M12 3.5v1"/>',
    belloff: '<path d="M6 16l1.5-2V10a4.5 4.5 0 0 1 7.3-3.5M16.5 10v4l1.5 2H9"/><path d="M10 19a2 2 0 0 0 4 0M3.5 3.5l17 17"/>',
    doc: '<path d="M6 2.5h8l5 5v14H6z"/><path d="M14 2.5v5h5M9 12.5h7M9 16.5h5"/>',
    nav: '<path d="M3.5 11 20.5 3.5 13 20.5l-2-7.5z"/>',
    list: '<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="m3.5 6.5 1.5 1.5L7.5 5M3.5 12l1.5 1.5 2.5-3M3.5 17.5 5 19l2.5-3"/>',
    flag: '<path d="M5 21V4M5 4.5h11l-2 3.5 2 3.5H5"/>',
    copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2.8"/><path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 1.9-1.1 1.3-2.1-.8-1.3.1-2.8 1.7-2.8H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3z"/><g' + F + '><circle cx="7.5" cy="11.5" r="1.3"/><circle cx="9.5" cy="7.5" r="1.3"/><circle cx="14.5" cy="7.3" r="1.3"/><circle cx="17.2" cy="11" r="1.3"/></g>',
    undo: '<path d="M9 7 4.5 11.5 9 16"/><path d="M4.5 11.5H15a5 5 0 0 1 0 10h-2"/>',
    hangup: '<path d="M2.6 13.4c5-5 13.8-5 18.8 0 .7.7.7 1.8 0 2.4l-1.6 1.4c-.6.5-1.4.5-2 0l-2-1.7c-.4-.3-.6-.8-.6-1.3v-1.5a10.5 10.5 0 0 0-6.4 0v1.5c0 .5-.2 1-.6 1.3l-2 1.7c-.6.5-1.4.5-2 0l-1.6-1.4c-.7-.6-.7-1.7 0-2.4z"' + F + '/>',
    dcheck: '<path d="M1.5 12.5 5.5 16.5 13.5 8.5"/><path d="M11.5 15.5l1 1 8-8"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    scan: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16"/>',
    gift: '<rect x="3.5" y="8.5" width="17" height="4.5" rx="1.2"/><path d="M5 13v7.5h14V13M12 8.5v12M12 8.5C9.2 8.5 7.2 7.5 7.6 5.8s3.2-1.6 4.4 2.7c1.2-4.3 4-4.4 4.4-2.7s-1.6 2.7-4.4 2.7z"/>',
    bot: '<rect x="4.5" y="7.5" width="15" height="12" rx="3.5"/><path d="M12 4v3.5M9.5 16.5h5"/><circle cx="12" cy="3.5" r="1.2"' + F + '/><circle cx="9" cy="12.6" r="1.4"' + F + '/><circle cx="15" cy="12.6" r="1.4"' + F + '/>',
    door: '<path d="M13.5 4H18a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 18 20h-4.5"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.3 14.2a4.6 4.6 0 0 0 7.4 0"/><g' + F + '><circle cx="9" cy="9.8" r="1.2"/><circle cx="15" cy="9.8" r="1.2"/></g>',
    clip: '<path d="M20.5 11.5l-8.2 8.2a5.3 5.3 0 0 1-7.5-7.5l8.4-8.4a3.5 3.5 0 0 1 5 5l-8.3 8.3a1.8 1.8 0 0 1-2.5-2.5l7.6-7.6"/>',
    heart: '<path d="M12 20.3s-7.8-4.7-7.8-10.3A4.4 4.4 0 0 1 12 7.5a4.4 4.4 0 0 1 7.8 2.5c0 5.6-7.8 10.3-7.8 10.3z"/>',
    chevl: '<path d="M15 5l-7 7 7 7"/>',
    chevr: '<path d="M9 5l7 7-7 7"/>',
    ban: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
    mic: '<rect x="9" y="3" width="6" height="11.5" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8.5 7l1.5-2.5h4L15.5 7"/><circle cx="12" cy="13.5" r="3.6"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    food: '<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16.5 21V3c-2 0-3.5 2.5-3.5 6s1.5 5 3.5 5"/>',
    car: '<path d="M4 16.5V12l2-5h12l2 5v4.5"/><path d="M3.5 12h17v4.5h-17z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
    flower: '<circle cx="12" cy="9" r="2.5"/><path d="M12 6.5c0-2.5 3.5-2.5 3.5 0M14.5 9c2.5 0 2.5 3.5 0 3.5M12 11.5c0 2.5-3.5 2.5-3.5 0M9.5 9c-2.5 0-2.5-3.5 0-3.5M12 12v8.5M12 17c-1.5-2-4-2-5-1 1 2 3.5 2.5 5 1z"/>',
    cake: '<path d="M4 20.5h16M5 20.5v-7h14v7M5 16.5c2 1.3 3.5 1.3 5 0s3.5-1.3 5 0 3 1.3 4 0M12 13.5v-3M12 7.5c-1 0-1.5-.8-1.5-1.6S12 3.5 12 3.5s1.5 1.6 1.5 2.4-.5 1.6-1.5 1.6z"/>'
  };
  var OUT = ' fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"';
  var STK = {
    p: '<path' + OUT + ' d="M22 16h76a14 14 0 0 1 14 14v46a14 14 0 0 1-14 14H56l-22 18v-18H22A14 14 0 0 1 8 76V30a14 14 0 0 1 14-14z"/><path fill="url(#gr-p)" d="M22 16h76a14 14 0 0 1 14 14v46a14 14 0 0 1-14 14H56l-22 18v-18H22A14 14 0 0 1 8 76V30a14 14 0 0 1 14-14z"/><path fill="#fff" fill-rule="evenodd" d="M44 30h20a16 16 0 0 1 0 32h-8v16H44zM56 41v10h7a5 5 0 0 0 0-10z"/><path d="M78 76l3.5 3.5 7-8M86 79.5l1.2 1.2 7-8" fill="none" stroke="#a8ecff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path fill="#ffd96a" d="M100 4l2.6 7.4L110 14l-7.4 2.6L100 24l-2.6-7.4L90 14l7.4-2.6z"/><path fill="#fff" d="M84 30l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z"/>',
    cincin: '<path' + OUT + ' d="M24 60 31 20h58l7 40v42H24z"/><path fill="#5f2383" d="M26 60 32 22h56l6 38z"/><path fill="#7d34a8" d="M31 55 36 27h48l5 28z"/><rect x="22" y="60" width="76" height="42" rx="8" fill="#8b3db4"/><rect x="22" y="60" width="76" height="11" rx="5" fill="#a656d0"/><ellipse cx="60" cy="64" rx="26" ry="8" fill="#f6d9ea"/><circle cx="60" cy="51" r="13" fill="none" stroke="#e9c979" stroke-width="5.5"/><circle cx="60" cy="51" r="13" fill="none" stroke="#fff3c4" stroke-width="1.6" stroke-dasharray="6 30"/><path fill="#c8f4ff" stroke="#6fcde8" stroke-width="2" stroke-linejoin="round" d="M60 26l8 8-8 9-8-9z"/><path fill="#fff" d="M57 31h6l-3 4z"/><path fill="#ffd96a" d="M101 26l2 5.6 5.6 2-5.6 2-2 5.6-2-5.6-5.6-2 5.6-2zM18 34l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z"/><rect x="50" y="80" width="20" height="7" rx="3.5" fill="#e9c979"/>',
    amplop: '<path' + OUT + ' d="M30 44 12 30c-4 10 0 22 12 26l6 2zM90 44l18-14c4 10 0 22-12 26l-6 2zM30 42h60v46H30z"/><path fill="#fff" stroke="#f3a4bf" stroke-width="2.5" stroke-linejoin="round" d="M32 46 10 28c-5 12 1 25 14 29l8 2zM88 46l22-18c5 12-1 25-14 29l-8 2z"/><path fill="none" stroke="#f3a4bf" stroke-width="2" stroke-linecap="round" d="M14 38c5 5 10 7 16 8M18 47c4 3 8 4 12 4M106 38c-5 5-10 7-16 8M102 47c-4 3-8 4-12 4"/><rect x="28" y="42" width="64" height="46" rx="7" fill="#fff6f9" stroke="#e2789b" stroke-width="2.5"/><path d="M29 45l31 23 31-23" fill="none" stroke="#e2789b" stroke-width="2.5" stroke-linejoin="round"/><path fill="#e0406f" d="M60 80c-7-4.5-11-8-11-12.5a5.5 5.5 0 0 1 11-2 5.5 5.5 0 0 1 11 2C71 72 67 75.5 60 80z"/><path d="M40 98h40" stroke="#f3a4bf" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 8"/>',
    kucing: '<path' + OUT + ' d="M30 34 26 10l22 14h24l22-14-4 24c10 9 14 19 14 30 0 26-22 42-44 42S16 90 16 64c0-11 4-21 14-30z"/><path fill="#ffc98a" d="M30 34 26 10l22 14h24l22-14-4 24c10 9 14 19 14 30 0 26-22 42-44 42S16 90 16 64c0-11 4-21 14-30z"/><path fill="#ffb0c8" d="M31 19l3 14 9-6zM89 19l-3 14-9-6z"/><path fill="#f0a867" d="M52 26h16l-8 10z"/><path d="M38 56q6-6 12 0M70 56q6-6 12 0" fill="none" stroke="#5b3a2a" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="36" cy="68" rx="7" ry="4.5" fill="#ff9ab4" opacity=".8"/><ellipse cx="84" cy="68" rx="7" ry="4.5" fill="#ff9ab4" opacity=".8"/><path d="M54 66q3 4 6 0 3 4 6 0" fill="none" stroke="#5b3a2a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path fill="#ff4f7e" stroke="#fff" stroke-width="3" d="M60 110c-15-8-22-15-22-23a10 10 0 0 1 22-4 10 10 0 0 1 22 4c0 8-7 15-22 23z"/><ellipse cx="41" cy="93" rx="8" ry="6.5" fill="#ffc98a" stroke="#f0a867" stroke-width="2"/><ellipse cx="79" cy="93" rx="8" ry="6.5" fill="#ffc98a" stroke="#f0a867" stroke-width="2"/><path d="M14 58h10M14 66l10-2M96 58h10M96 64l10 2" stroke="#e0925a" stroke-width="2" stroke-linecap="round"/>',
    hati: '<path' + OUT + ' d="M60 106C22 82 10 58 16 40c7-19 32-22 44-5 12-17 37-14 44 5 6 18-6 42-44 66z"/><path fill="url(#gr-h)" d="M60 106C22 82 10 58 16 40c7-19 32-22 44-5 12-17 37-14 44 5 6 18-6 42-44 66z"/><ellipse cx="34" cy="42" rx="8" ry="5" fill="#fff" opacity=".55" transform="rotate(-30 34 42)"/><circle cx="46" cy="60" r="4.5" fill="#3b1325"/><circle cx="74" cy="60" r="4.5" fill="#3b1325"/><circle cx="47.5" cy="58.5" r="1.5" fill="#fff"/><circle cx="75.5" cy="58.5" r="1.5" fill="#fff"/><ellipse cx="38" cy="70" rx="6" ry="4" fill="#ffb3c9"/><ellipse cx="82" cy="70" rx="6" ry="4" fill="#ffb3c9"/><path d="M53 70q7 7 14 0" fill="none" stroke="#3b1325" stroke-width="3" stroke-linecap="round"/><path fill="#ffd96a" d="M104 10l2.2 6 6 2.2-6 2.2-2.2 6-2.2-6-6-2.2 6-2.2z"/>',
    pesawat: '<path' + OUT + ' d="M14 58 106 20 78 98 60 72 46 88l-2-22z"/><path d="M8 104c10-2 16-8 18-16 2-9 10-12 16-8" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M8 104c10-2 16-8 18-16 2-9 10-12 16-8" fill="none" stroke="#c9b6ff" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 6"/><path fill="#fff" stroke="#6b5cff" stroke-width="3" stroke-linejoin="round" d="M14 58 106 20 60 72z"/><path fill="#e8e2ff" stroke="#6b5cff" stroke-width="3" stroke-linejoin="round" d="M106 20 78 98 60 72z"/><path fill="#cfc4ff" stroke="#6b5cff" stroke-width="3" stroke-linejoin="round" d="M60 72 46 88l-2-22z"/><path fill="#ff5a86" d="M14 96c-5-3-8-5.5-8-8.5a3.6 3.6 0 0 1 8-1.2 3.6 3.6 0 0 1 8 1.2c0 3-3 5.5-8 8.5z"/>',
    kopi: '<path' + OUT + ' d="M14 44h40l-4 56H22zM66 44h40l-8 56H74zM26 30c0-8 8-8 8-16M86 30c0-8 8-8 8-16"/><g transform="rotate(-10 34 72)"><path fill="#fff" stroke="#8a5a3c" stroke-width="3" stroke-linejoin="round" d="M16 44h38l-4 52H20z"/><rect x="18" y="58" width="34" height="18" fill="#c8366b"/><path fill="#fff" d="M29 67c-3-2-4-3-4-4.5a2 2 0 0 1 4-.6 2 2 0 0 1 4 .6c0 1.5-1 2.5-4 4.5z"/><path d="M54 52c8 0 8 14 0 14" fill="none" stroke="#8a5a3c" stroke-width="3"/></g><g transform="rotate(10 86 72)"><path fill="#fff" stroke="#8a5a3c" stroke-width="3" stroke-linejoin="round" d="M66 44h38l-4 52H70z"/><rect x="68" y="58" width="34" height="18" fill="#4b50d2"/><path fill="#fff" d="M83 67c-3-2-4-3-4-4.5a2 2 0 0 1 4-.6 2 2 0 0 1 4 .6c0 1.5-1 2.5-4 4.5z"/><path d="M66 52c-8 0-8 14 0 14" fill="none" stroke="#8a5a3c" stroke-width="3"/></g><path d="M28 32c0-7 7-7 7-14M88 32c0-7 7-7 7-14" fill="none" stroke="#c7a6ff" stroke-width="3.2" stroke-linecap="round"/><path fill="#ff6f97" d="M60 30c-4.5-3-7-5-7-7.5a3.4 3.4 0 0 1 7-1 3.4 3.4 0 0 1 7 1c0 2.5-2.5 4.5-7 7.5z"/><path fill="#ffd96a" d="M60 36l1.6 4.4 4.4 1.6-4.4 1.6L60 48l-1.6-4.4L54 42l4.4-1.6z"/>',
    bunga: '<path' + OUT + ' d="M36 64 60 112 84 64zM60 12c16 0 34 12 34 30S78 70 60 70 26 60 26 42s18-30 34-30z"/><path fill="#f5e2c6" stroke="#d6b183" stroke-width="2.5" stroke-linejoin="round" d="M34 62 60 112 86 62z"/><path fill="#ecd2ac" d="M60 112 48 62h24z"/><path fill="#6fbf73" d="M30 50c-6-10 0-18 8-18 0 8-2 14-8 18zM90 50c6-10 0-18-8-18 0 8 2 14 8 18z"/><circle cx="46" cy="40" r="13" fill="#ff8fae"/><circle cx="74" cy="40" r="13" fill="#ffb996"/><circle cx="60" cy="28" r="13" fill="#fff" stroke="#f3c1d2" stroke-width="2"/><circle cx="60" cy="52" r="13" fill="#e8517f"/><path d="M42 40a4 4 0 0 1 8 0M70 40a4 4 0 0 1 8 0M56 28a4 4 0 0 1 8 0M56 52a4 4 0 0 1 8 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/><path fill="#c8366b" d="M60 84c-7-3-12-2-14 1 3 3 8 2 14-1zm0 0c7-3 12-2 14 1-3 3-8 2-14-1z"/><circle cx="60" cy="84" r="3" fill="#a52758"/>',
    sah: '<circle' + OUT + ' cx="60" cy="60" r="50"/><circle cx="60" cy="60" r="48" fill="#fffaf2" stroke="#d8394a" stroke-width="5"/><circle cx="60" cy="60" r="39" fill="none" stroke="#d8394a" stroke-width="2" stroke-dasharray="5 4"/><g transform="rotate(-12 60 60)"><text x="60" y="71" text-anchor="middle" font-family="Figtree, Arial, sans-serif" font-weight="900" font-size="34" fill="#d8394a" letter-spacing="1">TO‘Y!</text></g><path fill="#e9c979" d="M60 22l1.8 5 5 1.8-5 1.8L60 35.6l-1.8-5-5-1.8 5-1.8zM60 86l1.5 4 4 1.5-4 1.5L60 97l-1.5-4-4-1.5 4-1.5z"/><circle cx="26" cy="60" r="3" fill="#d8394a"/><circle cx="94" cy="60" r="3" fill="#d8394a"/>',
    kalender: '<rect' + OUT + ' x="20" y="22" width="80" height="80" rx="14"/><rect x="20" y="22" width="80" height="80" rx="14" fill="#fff" stroke="#e7d6de" stroke-width="2"/><path fill="#e2394c" d="M34 22h52a14 14 0 0 1 14 14v8H20v-8a14 14 0 0 1 14-14z"/><rect x="36" y="14" width="8" height="18" rx="4" fill="#5b4b60"/><rect x="76" y="14" width="8" height="18" rx="4" fill="#5b4b60"/><path fill="#ff4f7e" d="M60 90c-13-7.5-19-13.5-19-20a9 9 0 0 1 19-3.6A9 9 0 0 1 79 70c0 6.5-6 12.5-19 20z"/><path d="M30 56h8M30 66h8M82 56h8M82 66h8" stroke="#e7d6de" stroke-width="4" stroke-linecap="round"/><path fill="#ffd96a" d="M104 64l2 5.6 5.6 2-5.6 2-2 5.6-2-5.6-5.6-2 5.6-2z"/>',
    kue: '<path' + OUT + ' d="M24 72h72v34H24zM36 44h48v30H36zM60 16l4 12H56z"/><ellipse cx="60" cy="106" rx="46" ry="7" fill="#e8dde3"/><rect x="24" y="70" width="72" height="34" rx="7" fill="#fff4ea" stroke="#f0c9d6" stroke-width="2.5"/><path fill="#ffb3c9" d="M24 78c6 7 12 7 18 0s12 7 18 0 12 7 18 0 12 7 18 0v-8H24z"/><rect x="36" y="44" width="48" height="28" rx="6" fill="#fff" stroke="#f0c9d6" stroke-width="2.5"/><path fill="#ff8fae" d="M36 51c5 6 9 6 12 0s8 6 12 0 8 6 12 0 7 6 12 0v-7H36z"/><circle cx="46" cy="92" r="3" fill="#e9c979"/><circle cx="60" cy="94" r="3" fill="#e9c979"/><circle cx="74" cy="92" r="3" fill="#e9c979"/><path d="M60 44V28" stroke="#b58a4a" stroke-width="3"/><path fill="#ff4f7e" d="M60 30c-6-3.5-9-6.2-9-9a4.2 4.2 0 0 1 9-1.5 4.2 4.2 0 0 1 9 1.5c0 2.8-3 5.5-9 9z"/>',
    pin: '<path' + OUT + ' d="M60 106S28 74 28 48a32 32 0 0 1 64 0c0 26-32 58-32 58z"/><ellipse cx="60" cy="108" rx="20" ry="5" fill="#000" opacity=".12"/><path fill="url(#gr-pin)" d="M60 106S28 74 28 48a32 32 0 0 1 64 0c0 26-32 58-32 58z"/><circle cx="60" cy="48" r="18" fill="#fff"/><path fill="#ff4f7e" d="M60 58c-8-4.8-12-8.6-12-12.4a5.8 5.8 0 0 1 12-2.3 5.8 5.8 0 0 1 12 2.3c0 3.8-4 7.6-12 12.4z"/><ellipse cx="44" cy="32" rx="6" ry="3.5" fill="#fff" opacity=".45" transform="rotate(-40 44 32)"/>',
    kamera: '<rect' + OUT + ' x="14" y="34" width="92" height="62" rx="16"/><rect x="14" y="34" width="92" height="62" rx="16" fill="#ffd166"/><rect x="14" y="58" width="92" height="38" rx="0" fill="#f4a25b" opacity=".35"/><rect x="24" y="26" width="24" height="12" rx="4" fill="#5b4b60"/><circle cx="60" cy="66" r="24" fill="#fff"/><circle cx="60" cy="66" r="18" fill="#3a2d42"/><circle cx="60" cy="66" r="10" fill="#5b4bd8"/><path fill="#ff8fae" d="M60 72c-4.5-2.6-7-4.8-7-7a3.3 3.3 0 0 1 7-1.3 3.3 3.3 0 0 1 7 1.3c0 2.2-2.5 4.4-7 7z"/><circle cx="53" cy="58" r="3" fill="#fff" opacity=".8"/><rect x="84" y="42" width="14" height="9" rx="3" fill="#fff"/><path fill="#ffd96a" d="M104 12l2 5.6 5.6 2-5.6 2-2 5.6-2-5.6-5.6-2 5.6-2z"/>',
    siap: '<path' + OUT + ' d="M60 8l10 16 18-6-2 19 18 7-14 13 10 16-19 1-3 19-16-10-14 13-5-19-19 2 8-17-16-11 18-6-2-19 18 6z"/><path fill="#ffd84a" stroke="#f0a020" stroke-width="3" stroke-linejoin="round" d="M60 8l10 16 18-6-2 19 18 7-14 13 10 16-19 1-3 19-16-10-14 13-5-19-19 2 8-17-16-11 18-6-2-19 18 6z"/><g transform="rotate(-8 60 62)"><text x="60" y="72" text-anchor="middle" font-family="Figtree, Arial, sans-serif" font-weight="900" font-size="30" fill="#231a26" letter-spacing="1">TAYYOR!</text></g>',
    hadiah: '<path' + OUT + ' d="M18 42h84v18H18zM22 58h76v46H22zM60 42c-14-2-24-10-20-22 6-10 18-2 20 16 2-18 14-26 20-16 4 12-6 20-20 22z"/><rect x="22" y="56" width="76" height="48" rx="8" fill="#c8366b"/><rect x="18" y="42" width="84" height="18" rx="6" fill="#e0508a"/><rect x="53" y="42" width="14" height="62" fill="#f4d27a"/><path fill="#f4d27a" stroke="#d6a93e" stroke-width="2" d="M60 42c-14-2-24-10-20-22 6-10 18-2 20 16zM60 42c14-2 24-10 20-22-6-10-18-2-20 16z"/><circle cx="60" cy="40" r="6" fill="#e6b84a"/><path fill="#fff" opacity=".35" d="M26 64h10v34H26z"/><path fill="#ffd96a" d="M104 30l2 5.6 5.6 2-5.6 2-2 5.6-2-5.6-5.6-2 5.6-2zM14 22l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z"/>',
    bulan: '<path' + OUT + ' d="M74 16a44 44 0 1 0 30 70A36 36 0 1 1 74 16z"/><path fill="#ffe08a" stroke="#f2c14e" stroke-width="2.5" d="M74 16a44 44 0 1 0 30 70A36 36 0 1 1 74 16z"/><path fill="#8b3db4" d="M40 30 70 8l6 28c-10-4-24-4-36-6z"/><circle cx="72" cy="8" r="6" fill="#fff"/><path d="M36 66q5 5 10 0M56 74q5 5 10 0" fill="none" stroke="#7a5a1e" stroke-width="3" stroke-linecap="round"/><ellipse cx="38" cy="78" rx="6" ry="3.5" fill="#ffb3a0"/><text x="92" y="36" font-family="Figtree, Arial, sans-serif" font-weight="900" font-size="18" fill="#8b3db4">z</text><text x="102" y="22" font-family="Figtree, Arial, sans-serif" font-weight="900" font-size="13" fill="#8b3db4">z</text><path fill="#fff5c4" d="M100 60l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z"/>',
    baju: '<path' + OUT + ' d="M60 14a8 8 0 1 1 8 8L60 30 24 44h72L60 30zM44 44h32l-6 18 22 46H28l22-46z"/><path d="M60 14a8 8 0 1 1 8 8" fill="none" stroke="#9a8a9e" stroke-width="3.5" stroke-linecap="round"/><path d="M60 22v8L24 44h72L60 30" fill="none" stroke="#9a8a9e" stroke-width="3.5" stroke-linejoin="round"/><path fill="url(#gr-d)" d="M44 44h32l-6 18 22 46H28l22-46z"/><path d="M50 62h20" stroke="#fff" stroke-width="3" opacity=".7"/><path fill="#fff" opacity=".35" d="M52 64 38 104h8l12-40z"/><path fill="#ff4f7e" d="M60 88c-5-3-8-5.3-8-7.8a3.7 3.7 0 0 1 8-1.4 3.7 3.7 0 0 1 8 1.4c0 2.5-3 4.8-8 7.8z"/>'
  };
  (function buildSprite() {
    var sp = $("sprite"); if (!sp) { return; }
    var h = '<defs id="sprite-defs">' +
      '<linearGradient id="gr-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6f9f"/><stop offset=".5" stop-color="#f4c86b"/><stop offset="1" stop-color="#6b5cff"/></linearGradient>' +
      '<linearGradient id="gr-p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6f9f"/><stop offset="1" stop-color="#6b5cff"/></linearGradient>' +
      '<linearGradient id="gr-h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8fb3"/><stop offset="1" stop-color="#e0356f"/></linearGradient>' +
      '<linearGradient id="gr-pin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7a93"/><stop offset="1" stop-color="#c8284a"/></linearGradient>' +
      '<linearGradient id="gr-d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c9ad"/><stop offset="1" stop-color="#e8b4b0"/></linearGradient>' +
      '</defs>';
    Object.keys(ICONS).forEach(function (k) { h += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; });
    Object.keys(STK).forEach(function (k) { h += '<symbol id="stk-' + k + '" viewBox="0 0 120 120" overflow="visible">' + STK[k] + '</symbol>'; });
    sp.innerHTML = h;
  })();

  /* ================= DOODLE WALLPAPER ================= */
  (function doodle() {
    var w = $("wall-doodle"); if (!w) { return; }
    var pick = ["heart", "ring", "chatheart", "send", "sparkle", "gift", "cal", "moon", "mappin", "dcheck", "pin", "music", "camera", "clock", "smile", "flower"];
    var g = "", seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        var k = pick[(r * 4 + c) % pick.length];
        var x = 35 + c * 70 + (rnd() - .5) * 18, y = 35 + r * 70 + (rnd() - .5) * 18, rot = (rnd() - .5) * 50, s = 1.22 + rnd() * .2;
        g += '<g transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + rot.toFixed(0) + ") scale(" + s.toFixed(2) + ') translate(-12 -12)">' + ICONS[k].replace(/fill="currentColor"/g, 'fill="#000"') + "</g>";
      }
    }
    var dots = "";
    for (var d = 0; d < 14; d++) { dots += '<circle cx="' + (18 + rnd() * 244).toFixed(0) + '" cy="' + (18 + rnd() * 244).toFixed(0) + '" r="' + (1.2 + rnd() * 1.4).toFixed(1) + '" fill="#000" stroke="none"/>'; }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + g + dots + "</g></svg>";
    var url = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
    w.style.webkitMaskImage = url; w.style.maskImage = url;
  })();

  /* ================= PEOPLE · PHOTOS · GUEST ================= */
  var G = txt("hero-g") || win.riwayatText("Mempelai Pria");
  var B = txt("hero-b") || win.riwayatText("Mempelai Wanita");
  function initial(n) { var m = String(n || "").match(/[\p{L}\p{N}]/u); return m ? m[0].toUpperCase() : "♥"; }
  var GI = initial(G), BI = initial(B), CI = GI + "&" + BI;
  function imgOk(img) { var s = img && img.getAttribute("src"); return !!(s && /\S/.test(s) && !/\{\{/.test(s)); }
  function srcOf(id) { var i = $(id); return i && imgOk(i) ? i.getAttribute("src").trim() : ""; }
  var PH = { c: srcOf("hero-av-img"), g: srcOf("mp-g-img"), b: srcOf("mp-b-img") };
  qsa("img").forEach(function (im) {
    if (im.closest("template") || im.id === "vw-img") { return; }
    if (!imgOk(im)) { im.parentNode.removeChild(im); return; }
    im.addEventListener("error", function () { if (im.parentNode) { im.parentNode.removeChild(im); } });
  });
  var INI = { g: GI, b: BI, c: CI };
  qsa(".ini").forEach(function (s) {
    if (s.textContent.trim()) { return; }
    var id = s.id || "";
    s.textContent = /-g-|cv-n3|vc-av-g/.test(id) ? GI : /-b-|cv-n2|vc-av-b/.test(id) ? BI : CI;
  });
  function fillAv(a, who) {
    if (!a) { return a; }
    a.classList.add("av"); if (who === "g" || who === "b") { a.classList.add("av-" + who); }
    a.innerHTML = "";
    var url = PH[who];
    if (url) { var im = el("img", "", a); im.alt = ""; im.src = url; im.addEventListener("error", function () { if (im.parentNode) { im.parentNode.removeChild(im); } }); }
    var s = el("span", "ini", a); s.textContent = INI[who] || initial(who);
    return a;
  }
  function makeAv(who, cls) { var a = el("span", "av " + (cls || "")); return fillAv(a, who); }
  qsa(".cv-n .ini").forEach(function (s) { var n = s.closest(".cv-n"); if (n && n.id === "cv-n2") { s.parentNode.classList.add("av-b"); } if (n && n.id === "cv-n3") { s.parentNode.classList.add("av-g"); } });
  ["vc-av-g", "draf-1-av"].forEach(function (id) { fillAv($(id), "g"); });
  ["vc-av-b", "draf-2-av"].forEach(function (id) { fillAv($(id), "b"); });
  fillAv($("lk-ll-dot"), "c"); fillAv($("call-av"), "c");
  if (PH.c) { body.style.setProperty("--couple-bg", 'url("' + PH.c.replace(/"/g, "%22") + '")'); }
  var guestName = clean(($("cv-guest-name") || {}).textContent);
  body.classList.toggle("has-guest", !!guestName);
  (function () { var me = $("nav-me-ini"); if (me) { me.textContent = guestName ? initial(guestName) : "A"; } })();

  /* ================= DATES ================= */
  var MON = win.__RIWAYAT.months;
  var DOW = win.__RIWAYAT.weekdays;
  var TZN = win.__RIWAYAT.data.timezone;
  var TZO = win.__RIWAYAT.offsetHours;
  function ymd(s) { var m = String(s || "").match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); return m ? { y: +m[1], m: +m[2], d: +m[3] } : null; }
  function hm(s) { var m = String(s || "").match(/^(\d{1,2})[:.](\d{2})/); return m ? { h: +m[1], i: +m[2] } : null; }
  function absAt(d, t) { var a = ymd(d); if (!a) { return null; } var b = hm(t) || { h: 0, i: 0 }; return new Date(Date.UTC(a.y, a.m - 1, a.d, b.h - TZO, b.i)); }
  function fmtDate(s, noDow) { var a = ymd(s); if (!a) { return ""; } var w = new Date(Date.UTC(a.y, a.m - 1, a.d)).getUTCDay(); return (noDow ? "" : DOW[w] + ", ") + a.d + " " + MON[a.m - 1] + " " + a.y; }
  function fmtShort(s) { var a = ymd(s); return a ? pad2(a.d) + "/" + pad2(a.m) + "/" + String(a.y).slice(2) : ""; }
  function fmtTime(t) { var b = hm(t); return b ? pad2(b.h) + "." + pad2(b.i) : ""; }
  var WD = win.__RIWAYAT.dateISO, WT = win.__RIWAYAT.data.date.time;
  if (!ymd(WD)) { WD = ""; }
  var wedAt = win.__RIWAYAT.eventISO ? new Date(win.__RIWAYAT.eventISO) : null;
  var now0 = new Date();
  function hmNow(d) { d = d || new Date(); return pad2(d.getHours()) + "." + pad2(d.getMinutes()); }
  function daysLeft() { if (!wedAt) { return null; } return Math.ceil((wedAt.getTime() - Date.now()) / 864e5); }
  function todayISO() { var d = new Date(Date.now() + TZO * 36e5); return d.getUTCFullYear() + "-" + pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate()); }
  function spanText(from, to) {
    var a = ymd(from); if (!a) { return ""; }
    var t = to ? ymd(to) : null; var n = t ? new Date(Date.UTC(t.y, t.m - 1, t.d)) : new Date();
    var months = (n.getUTCFullYear() - a.y) * 12 + (n.getUTCMonth() + 1 - a.m) - (n.getUTCDate() < a.d ? 1 : 0);
    if (months < 1) { return "beberapa hari"; }
    var y = Math.floor(months / 12), mo = months % 12;
    return (y ? y + " tahun" : "") + (y && mo ? " " : "") + (mo ? mo + " bulan" : "");
  }

  /* ================= SOUND ================= */
  var AC = null, soundOn = store.get("snd", true), lastPop = 0;
  function audioInit() { if (AC) { if (AC.state === "suspended") { try { AC.resume(); } catch (e) {} } return; } try { var C = win.AudioContext || win.webkitAudioContext; if (C) { AC = new C(); } } catch (e) { AC = null; } }
  function tone(f, t0, dur, type, gain, f2) {
    var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0;
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (f2) { o.frequency.exponentialRampToValueAtTime(f2, t + dur); }
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + .012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + .02);
  }
  function noise(t0, dur, gain, f1, f2) {
    var n = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) { d[i] = (Math.random() * 2 - 1) * (1 - i / n); }
    var s = AC.createBufferSource(), bp = AC.createBiquadFilter(), g = AC.createGain(), t = AC.currentTime + t0;
    bp.type = "bandpass"; bp.Q.value = 1.2; bp.frequency.setValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.buffer = buf; s.connect(bp); bp.connect(g); g.connect(AC.destination); s.start(t);
  }
  function sfx(n) {
    if (!soundOn || !AC || reduce && n === "tick") { return; }
    try {
      if (n === "pop") { var t = Date.now(); if (t - lastPop < 110) { return; } lastPop = t; tone(880, 0, .09, "sine", .05, 1320); tone(1760, .03, .06, "sine", .018); }
      else if (n === "send") { noise(0, .16, .05, 700, 2600); tone(620, .02, .1, "sine", .03, 1240); }
      else if (n === "tick") { tone(2400, 0, .018, "square", .012); }
      else if (n === "chime") { tone(1318, 0, .35, "sine", .06); tone(1976, .11, .45, "sine", .05); }
      else if (n === "unlock") { tone(520, 0, .06, "triangle", .05); tone(1040, .07, .22, "sine", .05, 1560); noise(.05, .25, .025, 1200, 5000); }
      else if (n === "ding") { tone(1568, 0, .5, "sine", .06); tone(2349, .09, .55, "sine", .035); }
      else if (n === "sparkle") { [2093, 2637, 3136, 4186].forEach(function (f, i) { tone(f, i * .06, .22, "sine", .025); }); }
      else if (n === "coin") { tone(1976, 0, .08, "square", .02); tone(2637, .08, .35, "square", .02); }
      else if (n === "ring") { for (var k = 0; k < 6; k++) { tone(k % 2 ? 660 : 880, k * .11, .1, "sine", .045); } }
      else if (n === "type") { tone(1900 + Math.random() * 500, 0, .014, "square", .008); }
    } catch (e) {}
  }

  /* ================= FX CANVAS ================= */
  var fx = { c: $("fx"), ctx: null, P: [], run: false, w: 0, h: 0, dpr: 1, last: 0, cool: 0 };
  if (fx.c && fx.c.getContext) { fx.ctx = fx.c.getContext("2d"); }
  function fxSize() { if (!fx.ctx) { return; } fx.dpr = Math.min(win.devicePixelRatio || 1, 2); fx.w = innerWidth; fx.h = innerHeight; fx.c.width = fx.w * fx.dpr; fx.c.height = fx.h * fx.dpr; fx.ctx.setTransform(fx.dpr, 0, 0, fx.dpr, 0, 0); }
  var PAL = ["#ff5a8a", "#ffb84d", "#8b5cf6", "#4cc9f0", "#ffd166", "#06d6a0", "#ff8fab", "#ffffff"];
  function heartPath(c, s) { c.beginPath(); c.moveTo(0, s * .35); c.bezierCurveTo(-s * 1.1, -s * .4, -s * .45, -s * 1.15, 0, -s * .45); c.bezierCurveTo(s * .45, -s * 1.15, s * 1.1, -s * .4, 0, s * .35); c.closePath(); }
  function starPath(c, s) { c.beginPath(); for (var i = 0; i < 8; i++) { var r = i % 2 ? s * .38 : s, a = i * Math.PI / 4; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function fxStart() { if (!fx.run && fx.ctx) { fx.run = true; fx.last = performance.now(); requestAnimationFrame(fxLoop); } }
  function fxLoop(t) {
    var c = fx.ctx, dt = Math.min(48, t - fx.last) / 16.67; fx.last = t;
    c.clearRect(0, 0, fx.w, fx.h);
    for (var i = fx.P.length - 1; i >= 0; i--) {
      var p = fx.P[i]; p.life += dt;
      if (p.life > p.max) { fx.P.splice(i, 1); continue; }
      if (p.k === "rocket") {
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy += .12 * dt;
        c.fillStyle = "#fff6d0"; c.globalAlpha = .9; c.beginPath(); c.arc(p.x, p.y, 2.2, 0, 7); c.fill();
        if (p.vy >= -1.2) { explode(p.x, p.y, p.col); fx.P.splice(i, 1); }
        continue;
      }
      p.vy += (p.g || 0) * dt; p.vx *= p.drag || 1; p.vy *= p.drag || 1;
      p.x += (p.vx + Math.sin((p.life + p.ph) * .08) * (p.sway || 0)) * dt; p.y += p.vy * dt; p.rot += (p.vr || 0) * dt;
      var a = 1 - Math.pow(p.life / p.max, 3);
      c.save(); c.globalAlpha = Math.max(0, a); c.translate(p.x, p.y); c.rotate(p.rot);
      if (p.k === "conf") { c.fillStyle = p.col; c.scale(1, Math.cos(p.life * .15 + p.ph)); c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); }
      else if (p.k === "heart") { c.fillStyle = p.col; heartPath(c, p.s); c.fill(); }
      else if (p.k === "star") { c.fillStyle = p.col; starPath(c, p.s); c.fill(); }
      else if (p.k === "dot") { c.fillStyle = p.col; c.beginPath(); c.arc(0, 0, p.s, 0, 7); c.fill(); }
      else if (p.k === "emo") { c.font = p.s + "px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(p.e, 0, 0); }
      c.restore();
    }
    if (fx.P.length) { requestAnimationFrame(fxLoop); } else { fx.run = false; c.clearRect(0, 0, fx.w, fx.h); }
  }
  function explode(x, y, col) { for (var i = 0; i < 46; i++) { var a = Math.random() * 6.283, v = 1.5 + Math.random() * 3.6; fx.P.push({ k: i % 5 ? "dot" : "star", x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: .045, drag: .985, s: i % 5 ? 1.6 + Math.random() * 1.6 : 4, col: i % 3 ? col : "#fff", life: 0, max: 60 + Math.random() * 30, rot: 0, ph: 0 }); } sfx("pop"); }
  function burst(kind, x, y) {
    if (reduce || !fx.ctx) { return; }
    if (!fx.w) { fxSize(); }
    var W = fx.w, H = fx.h, i;
    if (kind === "confetti") { for (i = 0; i < 110; i++) { fx.P.push({ k: "conf", x: Math.random() * W, y: -20 - Math.random() * H * .4, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, g: .03, sway: 1.2, s: 7 + Math.random() * 7, col: PAL[i % PAL.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .25, life: 0, max: 170 + Math.random() * 60, ph: Math.random() * 20 }); } }
    else if (kind === "hearts") { for (i = 0; i < 28; i++) { fx.P.push({ k: "heart", x: (x == null ? Math.random() * W : x + (Math.random() - .5) * 120), y: (y == null ? H + 20 : y) + Math.random() * 40, vx: (Math.random() - .5) * .8, vy: -(1.6 + Math.random() * 2.2), sway: 1.1, s: 7 + Math.random() * 9, col: ["#ff4f7e", "#ff8fb3", "#e0356f", "#ffb3c9"][i % 4], rot: (Math.random() - .5) * .6, life: 0, max: 130 + Math.random() * 60, ph: Math.random() * 20 }); } }
    else if (kind === "sparkle") { for (i = 0; i < 26; i++) { var a = Math.random() * 6.283, v = 1.5 + Math.random() * 3.5; fx.P.push({ k: "star", x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, drag: .95, s: 3 + Math.random() * 5, col: ["#ffd96a", "#fff", "#ffb3c9", "#c8f4ff"][i % 4], rot: 0, vr: .1, life: 0, max: 50 + Math.random() * 30, ph: 0 }); } }
    else if (kind === "fireworks") { for (i = 0; i < 5; i++) { (function (k) { setTimeout(function () { fx.P.push({ k: "rocket", x: W * (.15 + Math.random() * .7), y: H + 10, vx: (Math.random() - .5) * 1.5, vy: -(9 + Math.random() * 3.5), col: PAL[k % 7], life: 0, max: 200 }); fxStart(); }, k * 330); })(i); } }
    else if (kind === "emoji") { var set = y && y.set ? y.set : ["❤️", "🥰", "🎉", "💍", "✨", "🥹"]; var ox = x.x, oy = x.y; for (i = 0; i < 12; i++) { fx.P.push({ k: "emo", e: set[i % set.length], x: ox + (Math.random() - .5) * 30, y: oy, vx: (Math.random() - .5) * 2.4, vy: -(3 + Math.random() * 3.5), g: .03, sway: .6, s: 20 + Math.random() * 12, rot: (Math.random() - .5) * .5, life: 0, max: 90 + Math.random() * 40, ph: Math.random() * 10 }); } }
    fxStart();
  }
  function fxFor(text, x, y) {
    var t = Date.now(); if (t < fx.cool) { return; }
    var s = String(text || "");
    var k = /\bsah\b/i.test(s) ? "fireworks" : /💍|cincin|lamar/i.test(s) ? "ring" : /selamat|congrat|🎉|🥳|\bmau\b/i.test(s) ? "confetti" : /❤|💕|💖|🥰|😍|sayang|cinta|\blove\b|kangen|rindu|salting/i.test(s) ? "hearts" : "";
    if (!k) { return; }
    fx.cool = t + 4200;
    if (k === "ring") { burst("sparkle", x, y); sfx("sparkle"); setTimeout(function () { burst("confetti"); }, 250); }
    else { burst(k, x, y); if (k !== "fireworks") { sfx("sparkle"); } }
  }

  /* ================= AMBIENT CANVAS ================= */
  var amb = { c: $("amb"), ctx: null, P: [], run: false, w: 0, h: 0, dpr: 1, px: -999, py: -999, col: [] };
  if (amb.c && amb.c.getContext) { amb.ctx = amb.c.getContext("2d"); }
  function ambColors() { var dark = root.getAttribute("data-theme") === "dark"; amb.col = dark ? ["rgba(255,143,179,", "rgba(185,155,255,", "rgba(255,217,106,", "rgba(255,255,255,"] : ["rgba(214,63,120,", "rgba(122,82,199,", "rgba(233,160,60,", "rgba(255,255,255,"]; }
  function ambSize() { if (!amb.ctx) { return; } var r = amb.c.getBoundingClientRect(); amb.dpr = Math.min(win.devicePixelRatio || 1, 2); amb.w = r.width || innerWidth; amb.h = r.height || innerHeight; amb.c.width = amb.w * amb.dpr; amb.c.height = amb.h * amb.dpr; amb.ctx.setTransform(amb.dpr, 0, 0, amb.dpr, 0, 0); }
  function ambSpawn() {
    var n = amb.w > 900 ? 34 : 22; amb.P = [];
    for (var i = 0; i < n; i++) { amb.P.push({ x: Math.random() * amb.w, y: Math.random() * amb.h, s: 3 + Math.random() * 7, vy: -(.12 + Math.random() * .32), ph: Math.random() * 100, sw: .2 + Math.random() * .4, k: ["heart", "dot", "star", "bub"][i % 4], a: .1 + Math.random() * .22, ci: i % 4, rot: Math.random() * 6, ox: 0, oy: 0 }); }
  }
  function ambDraw(dt) {
    var c = amb.ctx; c.clearRect(0, 0, amb.w, amb.h);
    for (var i = 0; i < amb.P.length; i++) {
      var p = amb.P[i];
      p.ph += .012 * dt; p.y += p.vy * dt; p.x += Math.sin(p.ph) * p.sw * .6 * dt;
      var dx = p.x - amb.px, dy = p.y - amb.py, d2 = dx * dx + dy * dy;
      if (d2 < 9000) { var f = (1 - d2 / 9000) * 2.2; p.ox += dx / Math.sqrt(d2 + 1) * f; p.oy += dy / Math.sqrt(d2 + 1) * f; }
      p.ox *= .94; p.oy *= .94;
      if (p.y < -20) { p.y = amb.h + 20; p.x = Math.random() * amb.w; }
      var x = p.x + p.ox, y = p.y + p.oy;
      c.save(); c.translate(x, y); c.rotate(p.rot + Math.sin(p.ph) * .3);
      c.fillStyle = amb.col[p.ci] + p.a + ")"; c.strokeStyle = amb.col[p.ci] + (p.a + .08) + ")"; c.lineWidth = 1.4;
      if (p.k === "heart") { heartPath(c, p.s); c.fill(); }
      else if (p.k === "star") { starPath(c, p.s * .9); c.fill(); }
      else if (p.k === "dot") { c.beginPath(); c.arc(0, 0, p.s * .7, 0, 7); c.fill(); }
      else { c.beginPath(); var w = p.s * 2.2, h = p.s * 1.5; if (c.roundRect) { c.roundRect(-w / 2, -h / 2, w, h, h / 2); } else { c.rect(-w / 2, -h / 2, w, h); } c.stroke(); c.beginPath(); c.moveTo(-w * .2, h / 2); c.lineTo(-w * .34, h * .9); c.lineTo(0, h / 2); c.stroke(); }
      c.restore();
    }
  }
  var ambLast = 0;
  function ambLoop(t) { if (!amb.run) { return; } var dt = Math.min(48, t - (ambLast || t)) / 16.67; ambLast = t; ambDraw(dt); requestAnimationFrame(ambLoop); }
  function ambStart() { if (!amb.ctx) { return; } ambColors(); ambSize(); if (!amb.P.length) { ambSpawn(); } if (reduce) { ambDraw(0); return; } if (!amb.run && !doc.hidden) { amb.run = true; ambLast = 0; requestAnimationFrame(ambLoop); } }
  win.addEventListener("pointermove", function (e) { var r = amb.c ? amb.c.getBoundingClientRect() : { left: 0, top: 0 }; amb.px = e.clientX - r.left; amb.py = e.clientY - r.top; }, { passive: true });
  doc.addEventListener("visibilitychange", function () { if (doc.hidden) { amb.run = false; } else if (body.classList.contains("is-open")) { ambStart(); } });

  /* ================= TOAST · DIALOG ================= */
  var toastT = 0;
  function toast(m) { var t = $("toast"); if (!t) { return; } t.textContent = m; t.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("is-on"); }, 2600); }
  var dlgCb = null;
  function dialog(o) {
    var d = $("dlg"); if (!d) { return; }
    $("dlg-e").textContent = o.e || ""; $("dlg-t").textContent = o.t || ""; $("dlg-p").textContent = o.p || "";
    $("dlg-ok").textContent = o.ok || "Oke"; $("dlg-no").textContent = o.no || "";
    dlgCb = o.cb || null;
    d.hidden = false; body.classList.add("is-modal"); void d.offsetWidth; d.classList.add("is-open");
    setTimeout(function () { $("dlg-ok").focus(); }, 60);
  }
  function dialogClose(ok) {
    var d = $("dlg"); if (!d || d.hidden) { return; }
    d.classList.remove("is-open"); unlockModal();
    var cb = dlgCb; dlgCb = null;
    setTimeout(function () { d.hidden = true; }, reduce ? 0 : 280);
    if (ok && cb) { cb(); }
  }
  function unlockModal() { if (!qsa("#viewer:not([hidden]),#stv:not([hidden]),#call:not([hidden]),#dlg:not([hidden])").some(function (x) { return x.classList.contains("is-open"); })) { body.classList.remove("is-modal"); } }
  if ($("dlg-ok")) { $("dlg-ok").addEventListener("click", function () { dialogClose(true); }); $("dlg-no").addEventListener("click", function () { dialogClose(false); }); $("dlg").addEventListener("click", function (e) { if (e.target.id === "dlg") { dialogClose(false); } }); }
  function copyText(s, msg) {
    function ok() { toast(msg); sfx("ding"); }
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(s).then(ok, fb); return; } } catch (e) {}
    fb();
    function fb() { var ta = doc.createElement("textarea"); ta.value = s; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; body.appendChild(ta); ta.select(); try { doc.execCommand("copy"); ok(); } catch (e) { toast(s); } body.removeChild(ta); }
  }

  /* ================= MESSAGE ENGINE ================= */
  var NC = { g: "var(--name-g)", b: "var(--name-b)" };
  function nameOf(w) { return w === "g" ? G : w === "b" ? B : w === "me" ? win.riwayatText("Anda") : w; }
  function tickSvg() {
    var s = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "tk s1"); s.setAttribute("viewBox", "0 0 18 11"); s.id = mkId("tk");
    s.innerHTML = '<path class="tk1" d="M1 6.2 4 9.2 10.5 2"/><path class="tk2" d="M7 8.3 7.9 9.2 14.4 2"/>';
    idAll(s, "tk"); return s;
  }
  function buildMsg(m, o) {
    o = o || {};
    var side = o.side || "l", from = o.from || m.getAttribute("data-from") || "x";
    m.__built = true;
    m.classList.add("msg", "msg-" + side);
    if (!o.group) { m.classList.add("no-av"); }
    m.setAttribute("data-from", from);
    var kids = Array.prototype.slice.call(m.childNodes);
    var bub = null, under = [];
    kids.forEach(function (k) { if (k.nodeType === 1 && k.classList.contains("bub")) { bub = k; } });
    if (!bub) { bub = el("div", "bub"); kids.forEach(function (k) { if (k.nodeType === 1 && (k.classList.contains("m-text") || k.tagName === "P" || k.tagName === "IMG")) { bub.appendChild(k); } else if (k.nodeType === 1) { under.push(k); } else if (k.nodeType === 3 && k.textContent.trim()) { bub.appendChild(k); } }); }
    else { kids.forEach(function (k) { if (k !== bub && k.nodeType === 1) { under.push(k); } }); }
    var mb = el("div", "m-body"); mb.appendChild(bub);
    var rx = el("div", "m-rx"); mb.appendChild(rx);
    if (under.length) { var u = el("div", "m-under", mb); under.forEach(function (k) { u.appendChild(k); }); }
    m.innerHTML = ""; m.appendChild(mb);
    if (o.group && side === "l") { var av = makeAv(from === "g" || from === "b" ? from : "c", "m-av"); m.insertBefore(av, mb); }
    if (o.group && side === "l" && !bub.classList.contains("bub-stk") && !bub.classList.contains("bub-jumbo")) { var nm = el("span", "m-name"); nm.textContent = o.name || nameOf(from); nm.style.setProperty("--nc", NC[from] || "hsl(" + (hashStr(nm.textContent) % 360) + ",55%,45%)"); bub.insertBefore(nm, bub.firstChild); }
    if (o.name && !o.group && from === "x") { var nx = el("span", "m-name"); nx.textContent = o.name; nx.style.setProperty("--nc", "hsl(" + (hashStr(o.name) % 360) + ",55%,45%)"); bub.insertBefore(nx, bub.firstChild); }
    var meta = el("span", "meta");
    if (o.edited) { var ed = el("span", "m-ed", meta); ed.textContent = "diedit"; }
    var tm = el("time", "m-tm", meta); tm.textContent = o.time || hmNow();
    if (side === "r" && o.ticks !== false) { meta.appendChild(tickSvg()); }
    var mt = bub.querySelector(".m-text"); if (mt) { mt.style.setProperty("--mw", (side === "r" ? 66 : 46) + (o.edited ? 40 : 0) + "px"); }
    if (bub.classList.contains("bub-card")) { meta.classList.add("meta-card"); }
    bub.appendChild(meta);
    var ty = el("span", "typing", m); ty.setAttribute("aria-hidden", "true"); for (var i = 0; i < 3; i++) { el("i", "", ty); }
    if (o.rx && o.rx.length) { m.__preRx = o.rx.slice(0, 3); }
    m.__len = (bub.textContent || "").length;
    m.__text = bub.textContent || "";
    if (o.pending !== false && !reduce) { m.classList.add("pend"); }
    renderRx(m);
    if (side === "r") { gTrack(bub); }
    return m;
  }
  function clusterize(container) {
    var ms = qsa(":scope > .msg", container).filter(function (m) { return m.style.display !== "none" && !m.hidden; });
    var prev = null;
    ms.forEach(function (m, i) {
      var p = ms[i - 1], n = ms[i + 1];
      var adjP = p && p.nextElementSibling === m, adjN = n && m.nextElementSibling === n;
      var same = function (a) { return a && a.getAttribute("data-from") === m.getAttribute("data-from") && a.classList.contains("msg-r") === m.classList.contains("msg-r"); };
      var first = !(adjP && same(p)), last = !(adjN && same(n));
      m.classList.toggle("first", first); m.classList.toggle("last", last);
      var nm = m.querySelector(".m-name"); if (nm) { nm.style.display = first ? "" : "none"; }
      prev = m;
    });
    return prev;
  }
  function ticksRun(m, quick) {
    var tk = m.querySelector(".tk"); if (!tk) { return; }
    if (quick) { tk.setAttribute("class", "tk s3"); return; }
    setTimeout(function () { tk.setAttribute("class", "tk s2"); }, 380);
    setTimeout(function () { tk.setAttribute("class", "tk s3"); }, 1150);
  }
  /* reactions */
  var RX = store.get("rx", {});
  function renderRx(m) {
    var box = m.querySelector(".m-rx"); if (!box) { return; }
    box.innerHTML = "";
    var map = {}, order = [];
    (m.__preRx || []).forEach(function (e) { if (!map[e]) { map[e] = 0; order.push(e); } map[e] += 1; });
    var mine = RX[m.id];
    if (mine) { if (!map[mine]) { map[mine] = 0; order.push(mine); } map[mine] += 1; }
    order.forEach(function (e) { var r = el("span", "rx" + (e === mine ? " mine" : ""), box); r.textContent = e; if (map[e] > 1) { var sm = el("small", "", r); sm.textContent = map[e]; } });
  }
  function setRx(m, e) {
    if (!m || !m.id) { return; }
    if (RX[m.id] === e) { delete RX[m.id]; } else { RX[m.id] = e; var b = m.querySelector(".bub"); if (b) { var r = b.getBoundingClientRect(); burst("emoji", { x: r.left + r.width / 2, y: r.top }, { set: [e] }); } sfx("pop"); vibrate(8); }
    store.set("rx", RX); renderRx(m);
  }
  /* queue */
  var Q = [], qBusy = false, typingWho = null;
  function onScreen(n) { var r = n.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }
  function enqueue(m) { if (m.__q || !m.classList.contains("pend")) { return; } m.__q = 1; Q.push(m); pump(); }
  function pump() {
    if (qBusy) { return; }
    var m = Q.shift(); if (!m) { return; }
    if (!onScreen(m)) { arrive(m, true); pump(); return; }
    qBusy = true;
    var left = m.classList.contains("msg-l");
    var typing = left && m.classList.contains("first") && Q.length < 4 && m.getAttribute("data-typing") !== "0";
    var dur = typing ? clamp(360 + (m.__len || 16) * 10, 420, 1150) * (Q.length > 1 ? .6 : 1) : 0;
    if (typing) { m.classList.add("is-typing"); headerTyping(m.getAttribute("data-from"), true, m); }
    setTimeout(function () {
      if (typing) { headerTyping(null, false, m); }
      arrive(m, false);
      setTimeout(function () { qBusy = false; pump(); }, Q.length > 3 ? 60 : 190);
    }, dur);
  }
  function arrive(m, quiet) {
    m.classList.remove("pend", "is-typing"); m.__arrived = true;
    if (!quiet) { sfx(m.classList.contains("msg-r") ? "send" : "pop"); }
    ticksRun(m, quiet);
    if (!quiet) { var b = m.querySelector(".bub"); if (b) { var r = b.getBoundingClientRect(); fxFor(m.__text, r.left + r.width / 2, r.top + r.height / 2); } }
    if (m.__onArrive) { var f = m.__onArrive; m.__onArrive = null; f(); }
  }
  function sendMsg(container, o, after) {
    var m = el("div", "msg");
    var mt = el("p", "m-text", m); mt.textContent = o.text;
    if (o.bubCls) { var bb = el("div", "bub " + o.bubCls); while (m.firstChild) { bb.appendChild(m.firstChild); } if (o.pre) { bb.insertBefore(o.pre, bb.firstChild); } m.appendChild(bb); }
    container.appendChild(m);
    buildMsg(m, { side: o.side, from: o.from, group: o.group, time: hmNow(), name: o.name, pending: true });
    clusterize(container);
    m.__onArrive = after || null;
    if (reduce || o.side === "r" || o.typing === false) { arrive(m, reduce); } else { enqueue(m); }
    return m;
  }

  /* ================= MESSENGER GRADIENT ================= */
  var gVis = [], gio = ("IntersectionObserver" in win) ? new IntersectionObserver(function (ents) { ents.forEach(function (en) { var i = gVis.indexOf(en.target); if (en.isIntersecting) { if (i < 0) { gVis.push(en.target); } } else if (i >= 0) { gVis.splice(i, 1); } }); gPaint(); }) : null;
  function gTrack(b) { if (gio) { gio.observe(b); } }
  function gPaint() { for (var i = 0; i < gVis.length; i++) { gVis[i].style.setProperty("--gy", Math.round(gVis[i].getBoundingClientRect().top) + "px"); } }
  function setVH() { root.style.setProperty("--vh", innerHeight + "px"); }
  setVH();

  /* ================= SECTIONS · HELPERS ================= */
  function secEl(id) { return doc.querySelector('[data-section="' + id + '"]'); }
  function navOf(id) { return doc.querySelector('[data-nav-target="' + id + '"]'); }
  function hideSec(id) { var s = secEl(id); if (s) { s.style.display = "none"; } var n = navOf(id); if (n) { n.style.display = "none"; } }
  function shown(s) { return !!s && s.style.display !== "none" && getComputedStyle(s).display !== "none"; }
  function hideEl(e) { if (e) { e.style.display = "none"; } }
  var EMO_OK = true, RE_PICT = null, RE_EMO_ALL = null;
  try { RE_PICT = new RegExp("\\p{Extended_Pictographic}", "gu"); RE_EMO_ALL = new RegExp("[\\p{Extended_Pictographic}\\p{Emoji_Component}\\s]", "gu"); } catch (e) { EMO_OK = false; }
  function isJumbo(s) {
    if (!EMO_OK || !s || /[A-Za-z0-9]/.test(s)) { return false; }
    var n = (s.match(RE_PICT) || []).length;
    return n > 0 && n <= 3 && s.replace(RE_EMO_ALL, "") === "";
  }
  function richText(p, s) { p.dataset.authored = "";
    var re = /(^|[\s(“"'])([*_~])(\S(?:[^\n]*?\S)?)\2(?=$|[\s).,!?:;”"'…])/g, last = 0, mm;
    while ((mm = re.exec(s))) {
      var st = mm.index + mm[1].length;
      if (st > last) { p.appendChild(doc.createTextNode(s.slice(last, st))); }
      var tag = mm[2] === "*" ? "b" : mm[2] === "_" ? "i" : "s";
      var e = el(tag, "", p); e.textContent = mm[3];
      last = st + mm[3].length + 2;
      re.lastIndex = last;
    }
    if (last < s.length) { p.appendChild(doc.createTextNode(s.slice(last))); }
  }

  /* ================= HERO · AYAT ================= */
  (function hero() {
    var d = $("hero-date-d"), t = $("hero-date-time");
    if (d) { d.textContent = fmtDate(WD) || win.riwayatText("Segera"); }
    if (t) { t.textContent = (fmtTime(WT) || "09.00") + " " + TZN; }
    var dl = daysLeft(), w = $("cv-widget-t");
    if (w) { w.textContent = dl == null ? win.riwayatText("Menuju “Sah”") : dl > 0 ? dl + " " + win.riwayatText(win.riwayatText("hari")) + " · " + win.__RIWAYAT.data.eventType : dl === 0 ? win.__RIWAYAT.data.eventType : win.__RIWAYAT.data.eventType; }
    if (!txt("hero-desc")) { hideEl($("hero-desc")); }
    if (!txt("hero-e2e-t")) { hideEl($("hero-e2e")); }
    if (!txt("hero-unread-n")) { $("hero-unread-t").textContent = win.riwayatText("Pesan belum dibaca"); }
    if (!txt("hero-group-t")) { hideEl($("hero-group")); hideEl($("hero-sys1")); }
  })();
  (function ayat() {
    var ar = txt("ayat-ar"), tr = txt("ayat-tr");
    if (!ar && !tr) { hideSec("ayat"); return; }
    if (!ar) { hideEl($("ayat-ar")); }
    if (!txt("ayat-salam")) { hideEl($("ayat-salam")); }
    if (!txt("ayat-src")) { hideEl($("ayat-src")); }
    $("ayat-time").textContent = hmNow(new Date(Date.now() - 36 * 6e4));
    var card = $("ayat-card"), btn = $("ayat-toggle"), bt = $("ayat-toggle-t");
    if (!tr) { hideEl(btn); return; }
    if (!ar) { card.classList.add("is-tr"); hideEl(btn); return; }
    function setTr(on, anim) {
      if (on && anim && !reduce) { card.classList.add("is-busy"); setTimeout(function () { card.classList.remove("is-busy"); card.classList.add("is-tr"); }, 900); }
      else { card.classList.toggle("is-tr", on); }
      bt.textContent = on ? "Sembunyikan terjemahan" : win.riwayatText("Terjemahkan");
    }
    btn.addEventListener("click", function () { var on = !card.classList.contains("is-tr"); setTr(on, true); sfx("tick"); });
    card.__onReveal = function () { setTimeout(function () { if (!card.classList.contains("is-tr")) { setTr(true, true); } }, 900); };
  })();

  /* ================= KISAH (STORY) ================= */
  var ownerRaw = clean((secEl("kisah") || { getAttribute: function () { return ""; } }).getAttribute("data-owner")).toLowerCase();
  var OWN = /^(p(r|ia)|l|co|laki|suami|groom|mas|cowo)/.test(ownerRaw) ? "g" : "b";
  var PART = OWN === "g" ? "b" : "g";
  function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9à-ÿ ]+/g, " ").replace(/\s+/g, " ").trim(); }
  var ALIAS = { g: ["pria", "cowok", "cowo", "laki laki", "laki", "l", "mas", "suami", "calon suami", "groom", "dia pria", "1"], b: ["wanita", "cewek", "cewe", "perempuan", "w", "mbak", "istri", "calon istri", "bride", "2"] };
  var KG = norm(G), KB = norm(B);
  var GF = norm(txt("mp-g-name")).split(" ")[0] || "", BF = norm(txt("mp-b-name")).split(" ")[0] || "";
  var claim = {}, claimed = { g: false, b: false };
  function whoOf(name, loose) {
    var n = norm(name); if (!n) { return null; }
    if (claim[n]) { return claim[n]; }
    var w = null;
    if (n === KG || n === GF || n.split(" ")[0] === KG || ALIAS.g.indexOf(n) >= 0) { w = "g"; }
    else if (n === KB || n === BF || n.split(" ")[0] === KB || ALIAS.b.indexOf(n) >= 0) { w = "b"; }
    else if (loose) { w = !claimed.g && !claimed.b ? PART : !claimed.g ? "g" : !claimed.b ? "b" : "x"; }
    if (w) { claim[n] = w; if (w !== "x") { claimed[w] = true; } }
    return w;
  }
  var RE_LINE = /^\[?\s*(?:(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})[,\s]+)?(\d{1,2})[.:](\d{2})(?:[.:]\d{2})?\s*(?:[ap]\.?m\.?)?\s*\]?\s*(?:[-–—]\s*)?(.*)$/i;
  function parseChat(raw, baseDate) {
    var out = [], prevWho = null, prevTime = null, prevDate = baseDate || "";
    lines(raw).forEach(function (ln) {
      if (/^#/.test(ln)) { out.push({ t: "sys", text: ln.replace(/^#+\s*/, "") }); return; }
      var m = ln.match(RE_LINE), time = null, date = null, rest = ln, hasDate = false;
      if (m && (m[6] || "").length) {
        time = pad2(+m[4]) + "." + m[5]; rest = m[6];
        if (m[1]) { hasDate = true; var yy = +m[3]; yy = yy < 100 ? 2000 + yy : yy; date = yy + "-" + pad2(+m[2]) + "-" + pad2(+m[1]); }
      }
      var who = null, text = rest, nm = rest.match(/^([^:\n]{1,40}?)\s?:\s(.*)$/) || rest.match(/^([^:\n]{1,40}?):(\S.*)$/);
      if (nm) {
        var cand = nm[1].trim();
        var w = whoOf(cand, !!time && cand.split(" ").length <= 4 && !/[.?!]/.test(cand));
        if (w) { who = w; text = nm[2]; if (w === "x") { who = "x:" + cand; } }
      }
      if (!who) {
        if (hasDate && !nm) { out.push({ t: "sys", text: rest }); return; }
        who = prevWho || PART;
      }
      if (date && date !== prevDate) { out.push({ t: "date", date: date }); prevDate = date; }
      if (!time) { time = prevTime; }
      prevWho = who; prevTime = time;
      out.push({ t: "msg", who: who, time: time, text: text.trim() });
    });
    return out;
  }
  function parseBody(s) {
    var r = { kind: "text", text: s, rx: [], edited: false, extra: "" }, mm;
    while ((mm = r.text.match(/\s*\{([^{}]{1,16})\}\s*$/))) { r.rx.unshift(mm[1].trim()); r.text = r.text.slice(0, mm.index); }
    if (/\s*\((?:diedit|edited)\)\s*$/i.test(r.text) || /<(?:pesan ini (?:telah )?diedit|this message was edited)>/i.test(r.text)) { r.edited = true; r.text = r.text.replace(/\s*\((?:diedit|edited)\)\s*$/i, "").replace(/\s*<(?:pesan ini (?:telah )?diedit|this message was edited)>/i, ""); }
    var t = r.text.trim();
    if ((mm = t.match(/^\[(?:foto|photo|gambar|img)\]\s*(.*)$/i)) || (mm = t.match(/^<(?:media|gambar|file) (?:tidak disertakan|omitted)>\s*(.*)$/i))) { r.kind = "photo"; r.text = mm[1] || ""; }
    else if ((mm = t.match(/^\[(?:stiker|sticker)\s*([^\]]*)\]$/i)) || (mm = t.match(/^<(?:stiker|sticker) (?:tidak disertakan|omitted)>()$/i))) { r.kind = "stk"; r.extra = norm(mm[1]); }
    else if ((mm = t.match(/^\[(?:suara|vn|voice|pesan suara|audio)\s*(\d{1,2}[:.]\d{2})?\s*\]\s*(.*)$/i)) || (mm = t.match(/^<(?:audio|suara) (?:tidak disertakan|omitted)>()()$/i))) { r.kind = "vn"; r.extra = (mm[1] || "0:07").replace(".", ":"); r.text = mm[2] || ""; }
    else if ((mm = t.match(/^\[(?:lokasi|location|loc)\s*([^\]]*)\]\s*$/i))) { r.kind = "loc"; r.text = mm[1] || win.riwayatText("Lokasi dibagikan"); }
    else if (/^\[(?:dihapus|deleted)\]$|^pesan ini (?:telah )?dihapus\.?$|^this message was deleted\.?$|^anda menghapus pesan ini\.?$/i.test(t)) { r.kind = "del"; r.text = "Pesan ini telah dihapus"; }
    else if (isJumbo(t)) { r.kind = "jumbo"; }
    return r;
  }
  var STK_MAP = { hati: "hati", cinta: "hati", love: "hati", heart: "hati", kucing: "kucing", cat: "kucing", peluk: "kucing", kopi: "kopi", coffee: "kopi", bulan: "bulan", tidur: "bulan", malam: "bulan", cincin: "cincin", ring: "cincin", pesawat: "pesawat", kirim: "pesawat", amplop: "amplop", surat: "amplop", kue: "kue", cake: "kue", hadiah: "hadiah", kado: "hadiah", gift: "hadiah", pin: "pin", lokasi: "pin", kamera: "kamera", foto: "kamera", siap: "siap", ok: "siap", oke: "siap", sah: "sah", bunga: "bunga", flower: "bunga", kalender: "kalender", tanggal: "kalender", p: "p", baju: "baju" };
  function miniMap() {
    return '<svg viewBox="0 0 220 110" preserveAspectRatio="xMidYMid slice"><rect width="220" height="110" fill="#e7efe3"/><path d="M-10 80C40 70 70 96 120 84s80-40 120-30" fill="none" stroke="#a9d4ef" stroke-width="12" stroke-linecap="round"/><rect x="14" y="10" width="46" height="30" rx="6" fill="#f4efe4"/><rect x="150" y="12" width="56" height="26" rx="6" fill="#f4efe4"/><circle cx="170" cy="78" r="14" fill="#cfe5c3"/><path d="M0 52h220M96 0v110" stroke="#fff" stroke-width="9"/><g class="map-pin"><path d="M110 50s-11-11-11-19a11 11 0 0 1 22 0c0 8-11 19-11 19z" fill="#d8394a"/><circle cx="110" cy="31" r="4.5" fill="#fff"/></g></svg>';
  }
  var STORY = { chapters: [], names: [] };
  function nameAt(year) {
    var list = STORY.names; if (!list.length) { return nameOf(PART); }
    var best = list[0].n; list.forEach(function (e) { var y = parseInt(e.y, 10); if (!isNaN(y) && y <= year) { best = e.n; } });
    return best;
  }
  (function kisah() {
    var sec = secEl("kisah"); if (!sec) { return; }
    var srcList = lines(readTpl(OWN === "g" ? "kontak-src-g" : "kontak-src-b")).map(function (l) { var m = l.match(/^(\d{4})\s*[:\-–—.]\s*(.+)$/); return m ? { y: m[1], n: m[2] } : { y: "", n: l }; });
    STORY.names = srcList;
    var any = false, firstDate = "", lastDate = "";
    for (var i = 1; i <= win.__RIWAYAT.data.story.length; i++) {
      var ch = $("kisah-c" + i), box = $("kisah-c" + i + "-m"); if (!ch || !box) { continue; }
      var raw = readTpl("kisah-c" + i + "-src"), title = txt("kisah-c" + i + "-tt");
      var date = clean(ch.getAttribute("data-date")); if (!ymd(date)) { date = ""; }
      var photo = clean(ch.getAttribute("data-photo"));
      var items = parseChat(raw, date);
      if (!items.length && !title) { ch.style.display = "none"; continue; }
      if (!title) { hideEl($("kisah-c" + i + "-t")); }
      any = true;
      if (date) { if (!firstDate || date < firstDate) { firstDate = date; } if (!lastDate || date > lastDate) { lastDate = date; } }
      var dp = $("kisah-c" + i + "-dp"); dp.textContent = date ? fmtDate(date) : "";
      var usedPhoto = false, n = 0, lastTime = "";
      items.forEach(function (it) {
        n += 1;
        if (it.t === "sys") { var sp = el("p", "sp rv", box); var st = el("span", "", sp); st.textContent = it.text; var rn = it.text.match(/menjadi\s*[“"'‘]([^”"'’]+)[”"'’]/i); if (rn) { sp.__onReveal = (function (name) { return function () { if (curMode === "story") { setHeader("story", { title: name }); } }; })(rn[1]); } return; }
        if (it.t === "date") { var d2 = el("p", "dp", box); d2.textContent = fmtDate(it.date); return; }
        var b = parseBody(it.text), who = it.who, xname = "";
        if (/^x:/.test(who)) { xname = who.slice(2); who = "x"; }
        if (b.kind === "photo" && !photo) { if (!b.text) { return; } b.kind = "text"; }
        if (b.kind === "text" && !b.text) { return; }
        var m = el("div", "msg", box); m.id = "km-" + i + "-" + n;
        var bub = el("div", "bub", m), p;
        if (b.kind === "photo") { bub.classList.add("bub-photo"); var im = el("img", "", bub); im.src = photo; im.alt = title || win.riwayatText("Foto"); im.loading = "lazy"; im.addEventListener("click", function (ev) { ev.stopPropagation(); openViewer([photo], 0, { who: it.who, date: dp.textContent, name: title }); }); usedPhoto = true; if (b.text) { p = el("p", "m-text", bub); richText(p, b.text); } }
        else if (b.kind === "stk") { bub.classList.add("bub-stk"); bub.appendChild(stkEl(STK_MAP[b.extra] || STK_MAP[(b.extra || "").split(" ")[0]] || "hati", "stk-wob")); }
        else if (b.kind === "vn") { buildVN(bub, b.extra, b.text); }
        else if (b.kind === "loc") { bub.classList.add("bub-loc"); var lm = el("div", "loc-mini", bub); lm.innerHTML = miniMap(); idAll(lm, "lm"); p = el("p", "m-text", bub); p.textContent = "📍 " + b.text; }
        else if (b.kind === "del") { bub.classList.add("bub-del"); p = el("p", "m-text", bub); p.appendChild(svgIcon("i-ban")); p.appendChild(doc.createTextNode(b.text)); }
        else { if (b.kind === "jumbo") { bub.classList.add("bub-jumbo"); } p = el("p", "m-text", bub); richText(p, b.text); }
        var side = who === OWN ? "r" : "l";
        buildMsg(m, { side: side, from: who, group: false, time: it.time || "", edited: b.edited, rx: b.rx, name: xname });
        lastTime = it.time || lastTime;
      });
      if (photo && !usedPhoto) {
        var pm = el("div", "msg", box); pm.id = "kph-" + i;
        var pb = el("div", "bub bub-photo", pm), pi = el("img", "", pb); pi.src = photo; pi.alt = title || win.riwayatText("Foto"); pi.loading = "lazy";
        pi.addEventListener("click", function (ev) { ev.stopPropagation(); openViewer([photo], 0, { who: PART, date: dp.textContent, name: title }); });
        if (title) { var pc = el("p", "m-text", pb); pc.textContent = title; }
        buildMsg(pm, { side: "l", from: PART, group: false, time: lastTime });
      }
      clusterize(box);
      STORY.chapters.push({ el: ch, date: date, year: date ? +date.slice(0, 4) : 0, last: lastTime });
    }
    if (!any) { hideSec("kisah"); return; }
    STORY.first = firstDate;
    $("kisah-tp-s").textContent = win.riwayatText(win.riwayatText("Diimpor dari HP kami")) + (firstDate ? " · " + firstDate.slice(0, 4) + (lastDate && lastDate.slice(0, 4) !== firstDate.slice(0, 4) ? "–" + lastDate.slice(0, 4) : "") : "");
    fillAv($("kisah-lg-l-av"), PART); fillAv($("kisah-lg-r-av"), OWN);
    $("kisah-lg-l-n").textContent = nameOf(PART); $("kisah-lg-r-n").textContent = nameOf(OWN);
    if (!txt("kisah-intro-t")) { hideEl($("kisah-intro")); }
  })();
  function buildVN(bub, dur, tr) {
    bub.classList.add("bub-vn");
    var pl = el("button", "vn-play", bub); pl.type = "button"; pl.setAttribute("aria-label", "Putar pesan suara"); pl.appendChild(svgIcon("i-play"));
    var wv = el("span", "vn-wave", bub), bars = [];
    var seed = hashStr(tr + dur) % 97 + 3;
    for (var i = 0; i < 28; i++) { seed = (seed * 17 + 11) % 101; var b = el("i", "", wv); b.style.setProperty("--h", (20 + seed % 80) + "%"); bars.push(b); }
    var dl = el("span", "vn-dur", bub); dl.textContent = dur;
    var sec = (function () { var p = dur.split(":"); return (+p[0] || 0) * 60 + (+p[1] || 7); })();
    var trEl = null, playing = false, raf = 0;
    if (tr) { bub.__tr = tr; }
    pl.addEventListener("click", function (ev) {
      ev.stopPropagation(); audioInit();
      if (playing) { return; }
      playing = true; sfx("chime"); pl.innerHTML = ""; pl.appendChild(svgIcon("i-pause"));
      var body0 = bub.closest(".m-body");
      if (tr && !trEl && body0) { trEl = el("span", "vn-tr", body0); }
      var words = tr ? tr.split(" ") : [], t0 = performance.now(), total = Math.max(2, Math.min(sec, 12)) * 1000;
      (function step(t) {
        var k = Math.min(1, (t - t0) / total);
        bars.forEach(function (b, j) { b.classList.toggle("on", j / bars.length <= k); });
        dl.textContent = "0:" + pad2(Math.floor(k * sec));
        if (trEl) { trEl.textContent = words.slice(0, Math.max(1, Math.ceil(k * words.length))).join(" "); }
        if (k < 1) { raf = requestAnimationFrame(step); }
        else { playing = false; pl.innerHTML = ""; pl.appendChild(svgIcon("i-play")); dl.textContent = dur; var m = bub.closest(".msg"); if (m) { var r = bub.getBoundingClientRect(); fxFor(tr, r.left + r.width / 2, r.top); } }
      })(t0);
    });
  }

  /* ================= TODAY MESSAGES (static) ================= */
  var TODAY = qsa('body > [data-era="today"]');
  function hydrateToday() {
    var ms = [];
    TODAY.forEach(function (s) { qsa(".msg[data-from]", s).forEach(function (m) { if (!m.closest("template") && !m.__built) { ms.push(m); } }); });
    var total = ms.length, base = Date.now() - (total + 2) * 60000;
    ms.forEach(function (m, i) {
      var t = m.querySelector(".m-text");
      var empty = t && !clean(t.textContent) && !m.querySelector(".bub");
      if (m.classList.contains("km")) { empty = !txt(m.id + "-w"); }
      if (empty) { m.style.display = "none"; return; }
      buildMsg(m, { side: m.getAttribute("data-from") === "me" ? "r" : "l", from: m.getAttribute("data-from"), group: true, time: hmNow(new Date(base + i * 60000)) });
    });
    var seen = [];
    ms.forEach(function (m) { if (seen.indexOf(m.parentNode) < 0) { seen.push(m.parentNode); clusterize(m.parentNode); } });
  }

  /* ================= KAMUS ================= */
  (function kamus() {
    var items = [], any = false;
    for (var i = 1; i <= 6; i++) {
      var m = $("kamus-" + i); if (!m) { continue; }
      var w = txt("kamus-" + i + "-w"), a = txt("kamus-" + i + "-a");
      if (!w) { m.style.display = "none"; continue; }
      any = true;
      var btn = $("kamus-" + i + "-btn");
      if (!a) { hideEl(btn); continue; }
      items.push(m);
      (function (m, btn) {
        var bt = btn.querySelector("span");
        m.__tr = function (on) {
          if (on === m.classList.contains("is-tr")) { return; }
          m.classList.add("is-busy"); sfx("tick");
          setTimeout(function () { m.classList.remove("is-busy"); m.classList.toggle("is-tr", on); bt.textContent = on ? "Lihat teks asli" : win.riwayatText("Terjemahkan"); }, reduce ? 0 : 480);
        };
        btn.addEventListener("click", function (e) { e.stopPropagation(); m.__tr(!m.classList.contains("is-tr")); });
      })(m, btn);
    }
    if (!any) { hideSec("kamus"); return; }
    if (items.length < 2) { hideEl($("kamus-all-row")); }
    $("kamus-all").addEventListener("click", function () {
      var on = items.some(function (m) { return !m.classList.contains("is-tr"); });
      items.forEach(function (m, k) { setTimeout(function () { m.__tr(on); }, k * 170); });
      $("kamus-all-t").textContent = on ? "Kembalikan semua" : "Terjemahkan semua";
    });
    if (items[0]) { items[0].__onArrive = function () { setTimeout(function () { items[0].__tr(true); }, 1300); }; }
  })();

  /* ================= KONTAK ================= */
  (function kontak() {
    function parse(id) { return lines(readTpl(id)).map(function (l) { var m = l.match(/^(\d{4}|[^:]{1,14})\s*[:\-–—]\s*(.+)$/); return m ? { y: m[1].trim(), n: m[2].trim() } : { y: "", n: l }; }); }
    var L = { g: parse("kontak-src-g"), b: parse("kontak-src-b") };
    if (!L.g.length && !L.b.length) { hideSec("kontak"); return; }
    var cur = L.g.length ? "g" : "b", idx = -1, busy = 0, played = false, token = 0;
    if (!L.g.length) { hideEl($("kontak-tab-g")); }
    if (!L.b.length) { hideEl($("kontak-tab-b")); }
    if (!L.g.length || !L.b.length) { hideEl($("kontak-seg-pill")); $("kontak-seg").style.gridTemplateColumns = "1fr"; }
    var nameT = $("kontak-name-t"), since = $("kontak-row-2-v"), stops = $("kontak-tl-stops"), fill = $("kontak-tl-fill"), av = $("kontak-av");
    function setTab(w) {
      cur = w; idx = -1; token += 1;
      $("kontak-seg").classList.toggle("is-b", w === "b");
      $("kontak-tab-g").classList.toggle("is-on", w === "g"); $("kontak-tab-b").classList.toggle("is-on", w === "b");
      $("kontak-tab-g").setAttribute("aria-selected", w === "g"); $("kontak-tab-b").setAttribute("aria-selected", w === "b");
      fillAv(av, w === "g" ? "b" : "g");
      stops.innerHTML = "";
      L[w].forEach(function (e, i) { var b = el("button", "kt", stops); b.type = "button"; el("i", "", b); var s = el("span", "", b); s.textContent = e.y || String(i + 1); b.setAttribute("aria-label", "Nama kontak " + (e.y || i + 1)); b.addEventListener("click", function () { token += 1; go(i, token); }); });
      nameT.textContent = ""; since.textContent = "";
      fill.style.width = "0";
    }
    function type(target, tk, done) {
      var curS = nameT.textContent;
      (function del() {
        if (tk !== token) { return; }
        if (curS.length && target.indexOf(curS) !== 0) { curS = Array.from(curS).slice(0, -1).join(""); nameT.textContent = curS; sfx("type"); return setTimeout(del, reduce ? 0 : 34); }
        (function add() {
          if (tk !== token) { return; }
          var chars = Array.from(target), have = Array.from(curS).length;
          if (have < chars.length) { curS = chars.slice(0, have + 1).join(""); nameT.textContent = curS; sfx("type"); return setTimeout(add, reduce ? 0 : 62); }
          if (done) { done(); }
        })();
      })();
    }
    function go(i, tk) {
      var list = L[cur]; if (!list[i]) { return; }
      idx = i;
      qsa(".kt", stops).forEach(function (b, j) { b.classList.toggle("is-on", j === i); b.classList.toggle("is-done", j < i); });
      fill.style.width = list.length > 1 ? (i / (list.length - 1) * 100) + "%" : "100%";
      since.textContent = list[i].y || "—";
      $("kontak-name").classList.add("is-sel");
      setTimeout(function () { $("kontak-name").classList.remove("is-sel"); type(list[i].n, tk); }, reduce ? 0 : 260);
    }
    function play() {
      token += 1; var tk = token, list = L[cur], i = 0;
      (function nx() { if (tk !== token || i >= list.length) { return; } go(i, tk); var n = Array.from(list[i].n).length; i += 1; setTimeout(nx, reduce ? 200 : 1500 + n * 95); })();
    }
    $("kontak-tab-g").addEventListener("click", function () { if (cur !== "g") { setTab("g"); play(); } });
    $("kontak-tab-b").addEventListener("click", function () { if (cur !== "b") { setTab("b"); play(); } });
    $("kontak-play").addEventListener("click", function () { audioInit(); play(); });
    setTab(cur);
    var list0 = L[cur]; if (list0[0]) { nameT.textContent = list0[0].n; since.textContent = list0[0].y; qsa(".kt", stops)[0].classList.add("is-on"); idx = 0; }
    $("kontak-card").__onReveal = function () { if (!played) { played = true; setTimeout(play, 700); } };
  })();

  /* ================= DRAF ================= */
  (function draf() {
    var SENT = store.get("draf", {}), any = false;
    [1, 2].forEach(function (k) {
      var a = $("draf-" + k); if (!a) { return; }
      var text = txt("draf-" + k + "-src"), rep = txt("draf-" + k + "-rep");
      if (!text) { a.style.display = "none"; return; }
      any = true;
      var who = a.getAttribute("data-who") === "b" ? "b" : "g", other = who === "g" ? "b" : "g";
      var d = clean(a.getAttribute("data-date")), t = clean(a.getAttribute("data-time"));
      $("draf-" + k + "-when").textContent = (ymd(d) ? fmtDate(d) : "") + (hm(t) ? " · " + fmtTime(t) : "");
      var foot = $("draf-" + k + "-foot-t"), typed = $("draf-" + k + "-typed"), thread = $("draf-" + k + "-thread"), send = $("draf-" + k + "-send");
      foot.textContent = ymd(d) ? "Tersimpan sebagai draf selama " + spanText(d) : "Tersimpan sebagai draf";
      var done = false, started = false;
      function finish() { done = true; typed.textContent = text; a.classList.add("is-ready"); }
      function start() {
        if (started) { return; } started = true;
        if (reduce) { finish(); return; }
        var chars = Array.from(text), i = 0, back = Math.max(0, Math.floor(chars.length * .62)), backed = false;
        (function step() {
          if (done) { return; }
          if (!backed && i === back + 7 && chars.length > 16) { backed = true; var j = i; (function del() { if (done) { return; } if (j > back) { j -= 1; typed.textContent = chars.slice(0, j).join(""); return setTimeout(del, 45); } i = j; setTimeout(step, 700); })(); return; }
          if (i < chars.length) { i += 1; typed.textContent = chars.slice(0, i).join(""); return setTimeout(step, 38 + Math.random() * 60); }
          finish();
        })();
      }
      function renderSent(anim) {
        a.classList.add("is-sent"); a.classList.remove("is-ready");
        $("draf-" + k + "-tag").textContent = win.riwayatText("Terkirim");
        foot.textContent = ymd(d) ? "Akhirnya terkirim, setelah " + spanText(d) : "Akhirnya terkirim";
        typed.textContent = ""; send.disabled = true;
        var m1 = sendMsg(thread, { text: text, side: "r", from: who, group: false });
        if (!anim) { arrive(m1, true); }
        if (!rep) { return; }
        var after = function () { m1.__preRx = ["❤️"]; renderRx(m1); };
        if (anim) { setTimeout(function () { var m2 = sendMsg(thread, { text: rep, side: "l", from: other, group: false }, after); }, 1200); }
        else { var m2 = sendMsg(thread, { text: rep, side: "l", from: other, group: false, typing: false }); arrive(m2, true); after(); }
      }
      send.addEventListener("click", function () {
        if (a.classList.contains("is-sent")) { return; }
        audioInit(); if (!done) { finish(); }
        var r0 = $("draf-" + k + "-in").getBoundingClientRect();
        if (!reduce) {
          var fly = el("div", "draf-fly", body); fly.textContent = text; fly.style.left = r0.left + "px"; fly.style.top = r0.top + "px"; fly.style.maxWidth = r0.width + "px";
          var r1 = thread.getBoundingClientRect();
          requestAnimationFrame(function () { fly.style.transform = "translate(" + (r1.right - r0.right - 10) + "px," + (r1.top - r0.top + 12) + "px) scale(.9)"; fly.style.opacity = "0"; });
          setTimeout(function () { if (fly.parentNode) { fly.parentNode.removeChild(fly); } }, 700);
        }
        setTimeout(function () { renderSent(true); SENT[k] = 1; store.set("draf", SENT); vibrate(10); }, reduce ? 0 : 420);
      });
      if (SENT[k]) { renderSent(false); } else { a.__onReveal = function () { setTimeout(start, 400); }; }
    });
    if (!any) { hideSec("draf"); }
  })();

  /* ================= MEMPELAI ================= */
  (function mempelai() {
    ["g", "b"].forEach(function (w) {
      var ig = txt("mp-" + w + "-ig-t"), a = $("mp-" + w + "-ig");
      if (!ig) { hideEl(a); } else { a.href = "https://www.instagram.com/" + encodeURIComponent(ig.replace(/^@/, "").replace(/^.*instagram\.com\//i, "").replace(/\/.*$/, "")); }
      if (!txt("mp-" + w + "-info-t")) { hideEl($("mp-" + w + "-info")); }
      if (!txt("mp-" + w + "-par-t")) { hideEl($("mp-" + w + "-par")); }
      if (store.get("seen-" + w, false)) { $("mp-" + w).classList.add("is-seen"); }
    });
  })();

  /* ================= KELUARGA ================= */
  (function keluarga() {
    [1, 2, 3, 4].forEach(function (i) { if (!txt("kel-" + i + "-t")) { hideEl($("kel-" + i)); } else if (!txt("kel-" + i + "-n")) { hideEl($("kel-" + i + "-n")); } });
    var card = lines(readTpl("kel-c-src"));
    if (!card.length && !txt("kel-c-n")) { hideEl($("kel-c")); }
    else { $("kel-c-wa").textContent = card[0] || "Selamat!"; $("kel-c-wa2").textContent = card.slice(1).join(" ") || "🌹🌹🌹"; }
    if (!txt("kel-name")) { $("kel-name").textContent = "Keluarga Besar"; }
    var pray = $("kel-pray"), pn = $("kel-pray-n"), mine = store.get("pray", false), base = 27;
    function upd() { pn.textContent = base + (mine ? 1 : 0); pray.classList.toggle("is-on", mine); }
    upd();
    pray.addEventListener("click", function () { mine = !mine; store.set("pray", mine); upd(); audioInit(); sfx("pop"); if (mine) { var r = pray.getBoundingClientRect(); burst("emoji", { x: r.left + r.width / 2, y: r.top }, { set: ["🤲", "🙏", "✨"] }); } });
    var thr = $("kel-thread"), amin = $("kel-amin");
    function sayAmin(anim) { amin.disabled = true; $("kel-amin-t").textContent = win.riwayatText("Terkirim"); var m = sendMsg(thr, { text: "Aamiin 🤲", side: "r", from: "me", group: false }); if (!anim) { arrive(m, true); } }
    if (store.get("amin", false)) { sayAmin(false); }
    amin.addEventListener("click", function () { if (amin.disabled) { return; } audioInit(); sayAmin(true); store.set("amin", true); if (!mine) { mine = true; store.set("pray", true); upd(); } });
    var tl = lines(readTpl("kel-turut-src")), ul = $("kel-turut-list");
    if (!tl.length) { hideEl($("kel-turut")); }
    tl.forEach(function (t) { var li = el("li", "", ul), a = makeAv(t.replace(/^(keluarga besar|keluarga|kel\.|bapak|ibu|teman-teman|rekan)\s+/i, ""), "tm-av"); a.style.background = "hsl(" + (hashStr(t) % 360) + ",55%,55%)"; li.appendChild(a); var s = el("span", "", li); s.textContent = t; });
    $("kel-mem").textContent = (24 + tl.length * 2) + " anggota";
    if (!txt("kel-formal-g-p")) { hideEl($("kel-formal-g-p")); }
    if (!txt("kel-formal-b-p")) { hideEl($("kel-formal-b-p")); }
  })();

  /* ================= TERJADWAL (COUNTDOWN) ================= */
  var calInfo = null;
  function gcalUrl(title, startD, endD, place, details) {
    function z(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) + "&dates=" + z(startD) + "/" + z(endD) + "&location=" + encodeURIComponent(place) + "&details=" + encodeURIComponent(details);
  }
  function icsFile(title, startD, endD, place, details) {
    function z(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
    function esc(s) { return String(s).replace(/[\\;,]/g, function (c) { return "\\" + c; }).replace(/\n/g, "\\n"); }
    var s = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Taklifnoma//Suhbat//UZ", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", "UID:" + z(startD) + "-" + hashStr(title) + "@taklifnoma", "DTSTAMP:" + z(new Date()), "DTSTART:" + z(startD), "DTEND:" + z(endD), "SUMMARY:" + esc(title), "LOCATION:" + esc(place), "DESCRIPTION:" + esc(details), "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:" + esc(title), "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    try {
      var blob = new Blob([s], { type: "text/calendar;charset=utf-8" }), url = URL.createObjectURL(blob), a = el("a", "", body);
      a.href = url; a.download = "taklifnoma-" + norm(G + " " + B).replace(/ /g, "-") + ".ics"; a.click();
      setTimeout(function () { URL.revokeObjectURL(url); if (a.parentNode) { a.parentNode.removeChild(a); } }, 800);
      toast(win.riwayatText("File kalender diunduh 📅"));
    } catch (e) { toast(win.riwayatText("Tidak bisa mengunduh di perangkat ini")); }
  }
  (function terjadwal() {
    var tj = $("tj"); if (!tj) { return; }
    var msg = txt("tj-msg"); if (!msg) { $("tj-msg").textContent = "SAH! 💍"; }
    if (!txt("tj-note")) { hideEl($("tj-note")); }
    $("tj-meta-t").textContent = fmtTime(WT) || "09.00";
    $("tj-when-t").textContent = WD ? fmtDate(WD) + " · " + (fmtTime(WT) || "") + " " + TZN : win.riwayatText("segera");
    var first = STORY.first || "";
    $("tj-road-ad").textContent = fmtShort(first); $("tj-road-bd").textContent = fmtShort(WD);
    if (!first || !wedAt) { hideEl($("tj-road")); hideEl($("tj-pct")); }
    var e1End = clean(($("ev1-raw") || { getAttribute: function () { return ""; } }).getAttribute("data-end"));
    var title = (txt("ev1-n") || "Pernikahan") + " " + G + " & " + B, place = [txt("ev1-vn"), txt("ev1-va")].filter(Boolean).join(", ");
    if (wedAt) {
      var endAt = absAt(WD, e1End) || new Date(wedAt.getTime() + 2 * 36e5); if (endAt <= wedAt) { endAt = new Date(wedAt.getTime() + 2 * 36e5); }
      calInfo = { title: title, s: wedAt, e: endAt, place: place, details: win.__RIWAYAT.data.message };
      $("tj-gcal").href = gcalUrl(calInfo.title, calInfo.s, calInfo.e, calInfo.place, calInfo.details);
    } else { hideEl($("tj-acts")); }
    $("tj-ics").addEventListener("click", function () { if (calInfo) { icsFile(calInfo.title, calInfo.s, calInfo.e, calInfo.place, calInfo.details); } });
    var U = { d: $("tj-d"), h: $("tj-h"), m: $("tj-m"), s: $("tj-s") }, sentFx = false, iv = 0;
    function setU(k, v) { if (U[k].textContent !== v) { U[k].textContent = v; if (!reduce) { U[k].classList.remove("tick"); void U[k].offsetWidth; U[k].classList.add("tick"); } } }
    function tick() {
      if (!wedAt) { return; }
      var ms = wedAt.getTime() - Date.now();
      if (ms <= 0) {
        clearInterval(iv); tj.classList.add("is-sent"); $("tj-head-t").textContent = win.riwayatText("Terkirim");
        $("tj-when-l").textContent = win.riwayatText("Terkirim"); ["d", "h", "m", "s"].forEach(function (k) { U[k].textContent = "0"; });
        $("tj-count").style.display = "none";
        var meta = $("tj-meta"); if (meta && !meta.querySelector(".tk")) { var ic = meta.querySelector(".ic"); if (ic) { ic.style.display = "none"; } var tk = tickSvg(); tk.setAttribute("class", "tk s3"); meta.appendChild(tk); }
        return;
      }
      var s = Math.floor(ms / 1000);
      setU("d", String(Math.floor(s / 86400))); setU("h", pad2(Math.floor(s % 86400 / 3600))); setU("m", pad2(Math.floor(s % 3600 / 60))); setU("s", pad2(s % 60));
    }
    tick(); iv = setInterval(tick, 1000);
    tj.__onReveal = function () {
      if (first && wedAt) {
        var a = absAt(first, "00:00").getTime(), pct = clamp((Date.now() - a) / (wedAt.getTime() - a), 0, 1);
        setTimeout(function () { tj.style.setProperty("--p", (pct * 100).toFixed(1) + "%"); }, 250);
        $("tj-pct").textContent = pct >= 1 ? "Perjalanan dari “P” sampai “Sah” sudah 100% 💍" : "Perjalanan dari “P” sampai “Sah”: " + Math.floor(pct * 100) + "% · tinggal sedikit lagi!";
      }
      if (tj.classList.contains("is-sent") && !sentFx) { sentFx = true; setTimeout(function () { burst("fireworks"); }, 500); }
    };
  })();

  /* ================= ACARA ================= */
  var MSH = win.__RIWAYAT.months.map(function(s){ return s.slice(0,3).toUpperCase(); }), DSH = win.__RIWAYAT.weekdays.map(function(s){ return s.slice(0,3).toUpperCase(); });
  function mapsDir(pid, name, addr) { if(win.__RIWAYAT.data.venue.mapUrl) { return win.__RIWAYAT.data.venue.mapUrl; } return pid ? "https://www.google.com/maps/dir/?api=1&destination=Destination&travelmode=driving&destination_place_id=" + encodeURIComponent(pid) : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([name, addr].filter(Boolean).join(", ")); }
  function pidFrom(href) { var m = String(href || "").match(/destination_place_id=([^&]*)/); return m ? clean(decodeURIComponent(m[1])) : ""; }
  (function acara() {
    if (!txt("ac-m1-t")) { hideEl($("ac-m1")); }
    function fillEv(k, date, t1, t2, name, vn, va, note, pidHref) {
      var a = ymd(date);
      $("ev" + k + "-mon").textContent = a ? MSH[a.m - 1] : "—"; $("ev" + k + "-day").textContent = a ? a.d : "?"; $("ev" + k + "-dow").textContent = a ? DSH[new Date(Date.UTC(a.y, a.m - 1, a.d)).getUTCDay()] : "";
      $("ev" + k + "-d").textContent = fmtDate(date) || "Tanggal menyusul";
      $("ev" + k + "-time").textContent = (fmtTime(t1) || "—") + (fmtTime(t2) ? " – " + fmtTime(t2) : win.riwayatText(" onwards")) + " " + TZN;
      if (!note) { hideEl($("ev" + k + "-r3")); }
      if (!vn && !va) { hideEl($("ev" + k + "-r2")); }
      var pid = pidFrom($("ev" + k + "-map").getAttribute("href"));
      $("ev" + k + "-map").href = mapsDir(pid, vn, va);
      var s = absAt(date, t1), e = absAt(date, t2);
      if (s) { if (!e || e <= s) { e = new Date(s.getTime() + 2 * 36e5); } $("ev" + k + "-cal-a").href = gcalUrl(name + " " + G + " & " + B, s, e, [vn, va].filter(Boolean).join(", "), win.__RIWAYAT.data.message); } else { hideEl($("ev" + k + "-cal-a")); }
    }
    var e1 = $("ev1-raw"), e2 = $("ev2-raw");
    fillEv(1, WD, WT, clean(e1 ? e1.getAttribute("data-end") : ""), txt("ev1-n") || "Akad", txt("ev1-vn"), txt("ev1-va"), txt("ev1-note"));
    var n2 = clean(($("ev2-msg") || { getAttribute: function () { return ""; } }).getAttribute("data-name"));
    if (!n2) { hideEl($("ev2-msg")); }
    else { var d2 = clean(e2.getAttribute("data-date")); if (!ymd(d2)) { d2 = WD; } fillEv(2, d2, clean(e2.getAttribute("data-time")) || WT, clean(e2.getAttribute("data-end")), n2, txt("ev2-vn"), txt("ev2-va"), txt("ev2-note")); }
  })();

  /* ================= RUNDOWN ================= */
  (function rundown() {
    var raw = "", items = [];
    try { raw = ($("wedivo-rundown-data").textContent || "").trim(); items = /^\[/.test(raw) ? JSON.parse(raw) : []; } catch (e) { items = []; }
    if (!Array.isArray(items)) { items = []; }
    items = items.filter(function (it) { return it && (it.title || it.description); });
    if (!items.length) { hideSec("rundown"); return; }
    var list = $("rd-list"), dates = [], ICO = { heart: "heart", users: "users", utensils: "food", camera: "camera", mic2: "mic", cake: "cake", music: "music", gift: "gift", "party-popper": "sparkle", sparkles: "sparkle", flower2: "flower", home: "home", car: "car", shirt: "palette", clock: "clock", star: "sparkle" };
    items.forEach(function (it) { if (dates.indexOf(it.date || "") < 0) { dates.push(it.date || ""); } });
    $("rd-h-n").textContent = String(items.length);
    var lastD = null, rows = [];
    items.forEach(function (it) {
      if (dates.length > 1 && it.date !== lastD) { var h = el("p", "rd-day", list); h.textContent = fmtDate(it.date) || win.riwayatText("Hari lainnya"); lastD = it.date; }
      var r = el("div", "rd-i", list), ck = el("span", "rd-ck", r); r.dataset.itemId = it.id; ck.appendChild(svgIcon("i-check"));
      var mid = el("div", "", r), tm = el("span", "rd-tm", mid);
      tm.textContent = it.isAllDay ? win.riwayatText("Sepanjang hari") : (fmtTime(it.startTime) || "") + (fmtTime(it.endTime) ? " – " + fmtTime(it.endTime) : "") + " " + TZN;
      var t = el("span", "rd-t", mid); t.textContent = clean(it.title) || win.riwayatText("Acara");
      if (clean(it.location)) { var l = el("span", "rd-l", mid); l.textContent = "📍 " + clean(it.location); }
      if (clean(it.description)) { var d = el("span", "rd-d", mid); d.textContent = clean(it.description); }
      var ic = el("span", "rd-ico", r); ic.appendChild(svgIcon("i-" + (ICO[it.icon] || "sparkle")));
      rows.push({ el: r, t: t, s: it.isAllDay ? absAt(it.date, "00:00") : absAt(it.date, it.startTime), e: it.isAllDay ? absAt(it.date, "23:59") : absAt(it.date, it.endTime || it.startTime) });
    });
    function status() {
      var n = Date.now();
      rows.forEach(function (x) {
        var done = x.e && n > x.e.getTime(), now = x.s && x.e && n >= x.s.getTime() && n <= x.e.getTime();
        x.el.classList.toggle("is-done", !!done); x.el.classList.toggle("is-now", !!now);
        var b = x.t.querySelector(".rd-now"); if (now && !b) { b = el("span", "rd-now", x.t); b.textContent = win.riwayatText("SEKARANG"); } else if (!now && b) { b.parentNode.removeChild(b); }
      });
    }
    status(); setInterval(status, 30000);
  })();

  /* ================= LOKASI ================= */
  (function lokasi() {
    var vn = txt("lk-vn"), va = txt("lk-va");
    var map = $("lk-map-svg");
    map.innerHTML = [
      '<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="200" fill="#e6eee1"/><path d="M-20 150C60 126 110 176 190 150s120-70 230-52" fill="none" stroke="#a7d3ee" stroke-width="22" stroke-linecap="round"/><path d="M-20 150C60 126 110 176 190 150s120-70 230-52" fill="none" stroke="#c6e4f6" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 14"/><path d="M262 16c30-10 64 4 70 30s-18 44-46 40-52-22-44-44 6-22 20-26z" fill="#cfe5c2"/><g fill="#9fcf8e"><circle cx="275" cy="40" r="7"/><circle cx="298" cy="52" r="9"/><circle cx="316" cy="36" r="6"/><circle cx="288" cy="68" r="6"/></g>',
      '<g fill="#f3eee2" stroke="#e1d9c6" stroke-width="1.5"><rect x="18" y="14" width="70" height="44" rx="8"/><rect x="104" y="14" width="56" height="44" rx="8"/><rect x="18" y="80" width="54" height="38" rx="8"/><rect x="176" y="80" width="62" height="36" rx="8"/><rect x="330" y="120" width="56" height="60" rx="8"/><rect x="176" y="14" width="62" height="44" rx="8"/></g><g fill="none" stroke-linecap="round"><path d="M0 70h400M96 0v200M250 0v200M0 190h400" stroke="#d8d0bf" stroke-width="15"/><path d="M0 70h400M96 0v200M250 0v200M0 190h400" stroke="#fff" stroke-width="11"/><path d="M96 70 250 124h160" stroke="#d8d0bf" stroke-width="11"/>',
      '<path d="M96 70 250 124h160" stroke="#fffaf0" stroke-width="7"/></g><path class="map-route" d="M84 176C96 176 96 160 96 130s0-60 40-60h60c30 0 54 30 54 54" fill="none" stroke="#c8366b" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="9 5"/><circle class="map-pulse" cx="84" cy="176" r="10" fill="#3d6ddf" opacity=".35"/><circle cx="84" cy="176" r="6.5" fill="#3d6ddf" stroke="#fff" stroke-width="3"/><g class="map-pin"><path d="M250 126s-20-19-20-34a20 20 0 0 1 40 0c0 15-20 34-20 34z" fill="#d8394a" stroke="#fff" stroke-width="2.5"/><circle cx="250" cy="92" r="10" fill="#fff"/>',
      '<path d="M250 97.5c-4.5-2.6-6.8-4.7-6.8-6.9a3.3 3.3 0 0 1 6.8-1.2 3.3 3.3 0 0 1 6.8 1.2c0 2.2-2.3 4.3-6.8 6.9z" fill="#ff4f7e"/></g><g font-family="Figtree, Arial, sans-serif" font-size="12" font-weight="800"><rect x="106" y="167" width="44" height="18" rx="9" fill="#fff" opacity=".92"/><text x="128" y="180" text-anchor="middle" fill="#3d6ddf">Anda</text></g></svg>'
    ].join("");
    idAll(map, "mp");
    var pid = pidFrom($("lk-dir").getAttribute("href"));
    $("lk-dir").href = mapsDir(pid, vn, va);
    if (!txt("lk-mark-t")) { hideEl($("lk-mark")); }
    if (!va && !vn) { hideEl($("lk-copy")); }
    $("lk-copy").addEventListener("click", function () { copyText([vn, va].filter(Boolean).join(", "), win.riwayatText("Alamat disalin 📋")); });
    var ifr = $("lk-iframe"), src = ifr.getAttribute("data-src") || "";
    var key = (src.match(/key=([^&]*)/) || [])[1] || "", pq = (src.match(/place_id:([^&]*)/) || [])[1] || "";
    if (clean(decodeURIComponent(key)) && clean(decodeURIComponent(pq))) {
      $("lk-msg").__onArrive = function () { if (ifr.getAttribute("src")) { return; } ifr.hidden = false; ifr.addEventListener("load", function () { ifr.classList.add("is-in"); }); ifr.setAttribute("src", src); };
    }
    $("lk-live-s").textContent = (WD ? fmtDate(WD, false) : "") + (hm(WT) ? ", " + fmtTime(WT) + " " + TZN : "");
  })();

  /* ================= BUSANA (CHAT THEME) ================= */
  var themeTint = null;
  function hexRgb(h) { h = String(h || "").trim(); var m = h.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) { return null; } var s = m[1]; if (s.length === 3) { s = s.replace(/./g, "$&$&"); } var n = parseInt(s, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgbHsl(r, g, b) { r /= 255; g /= 255; b /= 255; var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2; if (mx !== mn) { var d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s, l]; }
  function hsl(h, s, l) { return "hsl(" + ((h % 360 + 360) % 360).toFixed(0) + "," + (clamp(s, 0, 1) * 100).toFixed(0) + "%," + (clamp(l, 0, 1) * 100).toFixed(0) + "%)"; }
  function applyTint(c) {
    var rs = root.style;
    if (!c) { ["--me-1", "--me-2", "--me-3", "--me-ink", "--me-meta", "--accent", "--accent-soft"].forEach(function (k) { rs.removeProperty(k); }); themeTint = null; ambColors(); return; }
    var rgb = hexRgb(c); if (!rgb) { return; }
    var q = rgbHsl(rgb[0], rgb[1], rgb[2]), h = q[0], s = Math.max(q[1], .28), l = q[2];
    var dark = root.getAttribute("data-theme") === "dark";
    var L1 = clamp(l, .38, .56), light = false;
    rs.setProperty("--me-1", hsl(h - 8, s, L1 + .04)); rs.setProperty("--me-2", hsl(h, s, L1 - .04)); rs.setProperty("--me-3", hsl(h + 14, s * .95, L1 - .12));
    rs.setProperty("--me-ink", light ? "#231a26" : "#ffffff"); rs.setProperty("--me-meta", "rgba(255,255,255,.82)");
    rs.setProperty("--accent", dark ? hsl(h, s, .72) : hsl(h, s, .34)); rs.setProperty("--accent-soft", "hsla(" + h.toFixed(0) + "," + (s * 100).toFixed(0) + "%,50%,.14)");
    themeTint = c; ambColors();
  }
  (function busana() {
    var any = false, cnt = 0;
    qsa("#bs-sw .sw").forEach(function (b) {
      var c = clean(b.style.getPropertyValue("--c")) || clean(getComputedStyle(b).getPropertyValue("--c"));
      var nm = clean(b.querySelector(".sw-n").textContent);
      if (!hexRgb(c)) { b.style.display = "none"; return; }
      any = true; cnt += 1; b.__c = c;
      if (!nm) { b.querySelector(".sw-n").textContent = c.toUpperCase(); }
      b.setAttribute("aria-label", win.riwayatText(win.riwayatText("Tema Obrolan")) + " " + (nm || c));
      b.addEventListener("click", function () {
        qsa("#bs-sw .sw").forEach(function (x) { x.classList.toggle("is-on", x === b); });
        applyTint(c); $("bs-reset").hidden = false; audioInit(); sfx("sparkle"); vibrate(8);
        $("bs-pr-t").textContent = win.riwayatText(win.riwayatText("Yang ini aja, cocok! 🥰"));
        var r = b.getBoundingClientRect(); burst("sparkle", r.left + r.width / 2, r.top + r.height / 2);
        toast(win.riwayatText(win.riwayatText("Tema Obrolan")) + ": " + (clean(b.querySelector(".sw-n").textContent) || c));
      });
    });
    if (cnt) { $("bs-sw").style.gridTemplateColumns = "repeat(" + cnt + ",minmax(0,1fr))"; }
    if (!any && !txt("bs-m0-t")) { hideSec("busana"); return; }
    if (!any) { hideEl($("bs-card")); }
    if (!txt("bs-sys-n")) { hideEl($("bs-sys")); }
    $("bs-reset").addEventListener("click", function () { applyTint(null); qsa("#bs-sw .sw").forEach(function (x) { x.classList.remove("is-on"); }); $("bs-reset").hidden = true; $("bs-pr-t").textContent = win.riwayatText("Yang ini aja, cocok! 🥰"); toast(win.riwayatText("Tema awal dikembalikan")); });
  })();

  /* ================= GALERI ================= */
  var GAL = win.__RIWAYAT.data.gallery.map(function(i){ return i.src; }).filter(Boolean);
  (function galeri() {
    if (!GAL.length) { hideSec("galeri"); return; }
    var box = $("gl-albums"), SZ = { 1: [1], 2: [2], 3: [3], 4: [4], 5: [3, 2], 6: [4, 2], 7: [4, 3], 8: [4, 4], 9: [4, 3, 2], 10: [4, 3, 3] }[GAL.length] || [GAL.length];
    var at = 0;
    SZ.forEach(function (n, k) {
      var who = k % 2 ? "g" : "b", m = el("div", "msg", box); m.id = "gl-a" + (k + 1);
      var bub = el("div", "bub bub-card alb", m), g = el("div", "alb-g n" + n, bub);
      for (var j = 0; j < n; j++) {
        (function (idx) {
          var c = el("button", "ac", g); c.type = "button"; c.dataset.itemId = win.__RIWAYAT.data.gallery[idx].id; c.setAttribute("aria-label", win.riwayatText(win.riwayatText("Media")) + " " + (idx+1) + " / " + GAL.length);
          var im = el("img", "", c); im.src = GAL[idx]; im.alt = win.__RIWAYAT.data.gallery[idx].alt || win.riwayatText(win.riwayatText("Media")) + " " + (idx+1); im.loading = "lazy";
          c.addEventListener("click", function (e) { e.stopPropagation(); openViewer(GAL, idx, { who: who }); });
        })(at + j);
      }
      at += n;
      buildMsg(m, { side: "l", from: who, group: true, time: hmNow(new Date(Date.now() - (SZ.length - k) * 45000)) });
    });
    clusterize(box);
    $("gl-all-t").textContent = win.riwayatText(win.riwayatText("Lihat semua media")) + " · " + GAL.length;
    $("gl-all").addEventListener("click", function () { openViewer(GAL, 0, { who: "b" }); });
  })();

  /* ================= VIDEO CALL + LIVE ================= */
  var bgm = $("bgm"), bgmOn = false, bgmWant = store.get("bgm", true), bgmHeldByVideo = false;
  var ringFn = null;
  (function video() {
    var vc = $("vc"), vid = $("vc-video"), vsrc = clean(vid.getAttribute("data-src"));
    var live = clean($("live-a").getAttribute("href"));
    if (!/^https?:\/\//i.test(live)) { live = ""; }
    if (!vsrc && !live) { hideSec("video"); hideEl($("ab-video")); return; }
    if (!live) { hideEl($("live")); } else {
      var yt = live.match(/(?:youtube\.com\/(?:watch\?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
      $("live-h-s").textContent = WD ? fmtDate(WD, false) + " · " + fmtTime(WT) + " " + TZN : "";
      if (yt) {
        $("live").__onReveal = function () { var f = el("iframe", "", $("live-embed")); f.src = "https://www.youtube.com/embed/" + yt[1] + "?rel=0"; f.title = "Siaran langsung"; f.loading = "lazy"; f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"; f.setAttribute("allowfullscreen", ""); };
        $("live-a-t").textContent = "Buka di YouTube";
      }
    }
    if (!vsrc) { hideEl(vc); return; }
    var ringing = false, ringCount = 0, ringT = 0, callT = 0, startedAt = 0, calls = 0, thr = $("vc-thread");
    function ring() {
      if (ringing) { return; } ringing = true; ringCount = 0; vc.classList.add("is-ringing");
      $("vc-lbl-t").textContent = calls ? "Menelepon lagi…" : "Panggilan video masuk…";
      (function rr() { if (!ringing) { return; } if (onScreen(vc)) { sfx("ring"); } ringCount += 1; if (ringCount < 8) { ringT = setTimeout(rr, 2200); } else { stopRing(); } })();
    }
    function stopRing() { ringing = false; clearTimeout(ringT); vc.classList.remove("is-ringing"); }
    function fmtDur(s) { return pad2(Math.floor(s / 60)) + "." + pad2(s % 60); }
    function accept() {
      audioInit(); stopRing(); calls += 1;
      if (!vid.getAttribute("src")) { vid.setAttribute("src", vsrc); vid.addEventListener("loadedmetadata", function () { if (vid.videoWidth && vid.videoHeight) { var ar = clamp(vid.videoWidth / vid.videoHeight, .56, 1.78); $("vc-stage").style.setProperty("--ar", ar.toFixed(3)); } }); }
      $("vc-ring").hidden = true; $("vc-call").hidden = false;
      if (bgmOn) { bgmHeldByVideo = true; musicSet(false, true); }
      try { var p = vid.play(); if (p && p.catch) { p.catch(function () {}); } } catch (e) {}
      startedAt = Date.now(); clearInterval(callT);
      callT = setInterval(function () { $("vc-hud-t").textContent = fmtDur(Math.floor(vid.currentTime || (Date.now() - startedAt) / 1000)); }, 500);
      setPlayIcon();
    }
    function end(auto) {
      clearInterval(callT); try { vid.pause(); } catch (e) {}
      var secs = Math.floor(vid.currentTime || 0);
      $("vc-call").hidden = true; $("vc-ring").hidden = false; $("vc-lbl-t").textContent = "Panggilan berakhir · " + fmtDur(secs) + " — ketuk Terima untuk menonton lagi";
      var sp = el("p", "sp", thr); var st = el("span", "", sp); st.textContent = "📹 Panggilan video · " + fmtDur(secs);
      if (bgmHeldByVideo) { bgmHeldByVideo = false; musicSet(true, true); }
      if (auto) { sendMsg(thr, { text: "Makasih udah angkat telepon kami 🥹", side: "l", from: "b", group: true }); }
    }
    function setPlayIcon() { var u = $("vc-play-u"); if (u) { u.setAttribute("href", vid.paused ? "#i-play" : "#i-pause"); } }
    $("vc-yes").addEventListener("click", accept);
    $("vc-no").addEventListener("click", function () {
      audioInit(); stopRing(); calls += 1;
      var sp = el("p", "sp", thr); var st = el("span", "", sp); st.textContent = "📵 Panggilan video tak terjawab · " + hmNow();
      sendMsg(thr, { text: "Yah… ditolak 😢", side: "l", from: "b", group: true }, function () { setTimeout(function () { if (calls < 3) { ring(); } }, 3200); });
    });
    $("vc-end").addEventListener("click", function () { end(false); });
    $("vc-play").addEventListener("click", function () { try { if (vid.paused) { vid.play(); } else { vid.pause(); } } catch (e) {} setTimeout(setPlayIcon, 60); });
    $("vc-mute").addEventListener("click", function () { vid.muted = !vid.muted; $("vc-mute-u").setAttribute("href", vid.muted ? "#i-mute" : "#i-vol"); });
    vid.addEventListener("ended", function () { end(true); });
    vid.addEventListener("pause", setPlayIcon); vid.addEventListener("play", setPlayIcon);
    vc.__onReveal = function () { setTimeout(ring, 900); };
    ringFn = function () { if (!$("vc-call").hidden) { return; } ring(); };
  })();

  var SENT_PV = {};
  /* ================= UCAPAN (WISHES) ================= */
  (function ucapan() {
    var list = $("wish-list"), bodyW = $("wish-body"), cnt = $("wish-count"), ready = false, mine = false;
    var COL = ["#d63f78", "#8744c7", "#2a8db8", "#2c9a67", "#ee7640", "#c2892b", "#5949d6", "#b0307a"];
    function dress(n, fresh) {
      if (!n || n.nodeType !== 1) { return; }
      idAll(n, "wm");
      var nameEl = n.querySelector("[data-field=name]"), nm = nameEl ? clean(nameEl.textContent) : "";
      var c = COL[hashStr(nm || "?") % COL.length];
      n.style.setProperty("--wc", c);
      var av = n.querySelector(".wm-av"); if (av && !av.textContent) { av.textContent = initial(nm || "?"); }
      if (fresh) { n.classList.add("is-new"); var t = n.querySelector("[data-field=message]"); if (mine && t) { var r = n.getBoundingClientRect(); fxFor(t.textContent, r.left + 40, r.top); } }
    }
    function count() { var k = qsa(":scope > *", list).length; cnt.textContent = k ? String(k) : win.riwayatText("Belum ada pesan"); bodyW.classList.toggle("has-items", k > 0); if (k) { SENT_PV.ucapanN = k; } navPreview(); }
    qsa(":scope > *", list).forEach(function (n) { dress(n, false); });
    count();
    if ("MutationObserver" in win) {
      new MutationObserver(function (muts) {
        muts.forEach(function (mu) { Array.prototype.forEach.call(mu.addedNodes, function (n) { dress(n, ready); }); });
        count();
        if (mine) { bodyW.scrollTop = bodyW.scrollHeight; setTimeout(function () { mine = false; }, 2500); }
      }).observe(list, { childList: true });
    }
    setTimeout(function () { ready = true; }, 2500);
    var form = $("wish-form"), ta = $("wish-msg");

    function grow() { ta.style.height = "auto"; ta.style.height = Math.min(150, ta.scrollHeight + 2) + "px"; }
    ta.addEventListener("input", grow);
  })();

  /* ================= PENUTUP ================= */
  (function penutup() {
    if (!txt("pn-tag-t")) { hideEl($("pn-tag")); $("pn-foot-tag").textContent = "#" + norm(G + B).replace(/ /g, ""); }
    if (!txt("pn-salam")) { hideEl($("pn-salam")); }
    if (!txt("pn-msg")) { hideEl($("pn-msg")); }
    $("pn-tag").addEventListener("click", function () { copyText(txt("pn-tag-t"), "Tagar disalin ✨"); });
    function share() {
      var data = { title: G + " & " + B, text: win.__RIWAYAT.data.message, url: win.__RIWAYAT.publicUrl };
      try { if (navigator.share) { navigator.share(data).catch(function () {}); return; } } catch (e) {}
      copyText(win.__RIWAYAT.publicUrl, win.riwayatText("Tautan undangan disalin 🔗"));
    }
    $("pn-share").addEventListener("click", share); $("mi-share").addEventListener("click", function () { menu(false); share(); });
    $("pn-mute").addEventListener("click", function () { audioInit(); dialog({ e: "🔕", t: "Bisukan grup ini?", p: "Boleh, tapi pesan terjadwal di hari H tetap akan sampai kepadamu. Itu pesan paling penting di grup ini 💍", no: win.riwayatText("Batal"), ok: "Bisukan 8 jam", cb: function () { toast("Grup dibisukan 8 jam… kecuali untuk kabar bahagia 😉"); } }); });
    $("pn-leave").addEventListener("click", function () { audioInit(); sfx("pop"); dialog({ e: "🥺", t: "Keluar dari grup?", p: "Maaf, tombol ini sengaja tidak berfungsi. Kamu sudah jadi bagian dari cerita kami — dan kami ingin kamu tetap di sini 🤍", ok: "Oke, aku tetap di sini", cb: function () { burst("hearts"); } }); });
  })();

  /* ================= VIEWER ================= */
  var VW = { list: [], i: 0, who: "b", open: false, from: null, liked: store.get("liked", {}) };
  function openViewer(list, i, meta) {
    var v = $("viewer"); if (!v || !list.length) { return; }
    VW.list = list; VW.who = meta && meta.who ? (meta.who.charAt(0) === "x" ? "c" : meta.who) : "b"; VW.from = doc.activeElement; VW.name = meta && meta.name;
    fillAv($("vw-av"), VW.who === "g" || VW.who === "b" ? VW.who : "c");
    var th = $("vw-thumbs"); th.innerHTML = "";
    list.forEach(function (u, k) { var b = el("button", "vt", th); b.type = "button"; b.setAttribute("aria-label", win.riwayatText("Foto ") + (k + 1)); var im = el("img", "", b); im.src = u; im.alt = ""; im.loading = "lazy"; b.addEventListener("click", function () { show(k); }); });
    var single = list.length <= 1;
    $("vw-prev").hidden = single; $("vw-next").hidden = single; th.hidden = single; $("vw-count").hidden = single;
    v.hidden = false; body.classList.add("is-modal"); void v.offsetWidth; v.classList.add("is-open"); VW.open = true;
    show(i); setTimeout(function () { $("vw-close").focus(); }, 50);
  }
  function show(i) {
    var n = VW.list.length; VW.i = (i + n) % n;
    var img = $("vw-img"), u = VW.list[VW.i];
    img.classList.remove("is-in");
    setTimeout(function () { img.onload = function () { img.classList.add("is-in"); }; img.src = u; var gi=VW.list === GAL ? win.__RIWAYAT.data.gallery[VW.i] : win.__RIWAYAT.data.gallery.filter(function(p){ return p.src===u; })[0]; img.alt = gi && gi.alt || win.riwayatText(win.riwayatText("Media")) + " " + (VW.i+1); if (img.complete) { img.classList.add("is-in"); } }, reduce ? 0 : 120);
    $("vw-count").textContent = (VW.i + 1) + " / " + n;
    $("vw-name").textContent = VW.name || nameOf(VW.who === "c" ? "b" : VW.who);
    var gi=VW.list === GAL ? win.__RIWAYAT.data.gallery[VW.i] : win.__RIWAYAT.data.gallery.filter(function(p){return p.src===u;})[0]; $("vw-date").textContent=gi && gi.caption || ""; $("vw-date").dataset.authored="";
    qsa(".vt", $("vw-thumbs")).forEach(function (b, k) { b.classList.toggle("is-on", k === VW.i); if (k === VW.i) { var th = $("vw-thumbs"); var br = b.getBoundingClientRect(), tr = th.getBoundingClientRect(); th.scrollLeft += br.left - tr.left - (tr.width - br.width) / 2; } });
    $("vw-heart").classList.toggle("is-on", !!VW.liked[hashStr(u)]);
  }
  function closeViewer() {
    var v = $("viewer"); if (!VW.open) { return; } VW.open = false;
    v.classList.remove("is-open"); unlockModal();
    var gone = function (e) { if (e && (e.target !== v || e.propertyName !== "opacity")) { return; } if (!VW.open) { v.hidden = true; } v.removeEventListener("transitionend", gone); };
    v.addEventListener("transitionend", gone); setTimeout(gone, 450);
    if (VW.from && VW.from.focus) { try { VW.from.focus({ preventScroll: true }); } catch (e) {} }
  }
  function likePhoto() { var u = VW.list[VW.i], k = hashStr(u); VW.liked[k] = !VW.liked[k]; store.set("liked", VW.liked); $("vw-heart").classList.toggle("is-on", VW.liked[k]); if (VW.liked[k]) { var p = $("vw-pop"); p.classList.remove("go"); void p.offsetWidth; p.classList.add("go"); sfx("pop"); vibrate(8); } }
  (function viewerWire() {
    if (!$("viewer")) { return; }
    $("vw-close").addEventListener("click", closeViewer);
    $("vw-prev").addEventListener("click", function () { show(VW.i - 1); });
    $("vw-next").addEventListener("click", function () { show(VW.i + 1); });
    $("vw-heart").addEventListener("click", likePhoto);
    var st = $("vw-stage"), sx = 0, sy = 0, down = false, lastTap = 0;
    st.addEventListener("pointerdown", function (e) { down = true; sx = e.clientX; sy = e.clientY; });
    st.addEventListener("pointerup", function (e) {
      if (!down) { return; } down = false;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && VW.list.length > 1) { show(VW.i + (dx < 0 ? 1 : -1)); return; }
      if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { closeViewer(); return; }
      var t = Date.now(); if (t - lastTap < 300) { if (!$("vw-heart").classList.contains("is-on")) { likePhoto(); } else { var p = $("vw-pop"); p.classList.remove("go"); void p.offsetWidth; p.classList.add("go"); } lastTap = 0; } else { lastTap = t; }
    });
  })();

  /* ================= STATUS VIEWER ================= */
  var ST = { frames: [], i: 0, t0: 0, raf: 0, paused: false, open: false, dur: 5200, who: "c", from: null };
  function openStatus(frames, who, name) {
    var v = $("stv"); if (!v || !frames.length) { return; }
    ST.frames = frames; ST.i = 0; ST.who = who; ST.from = doc.activeElement;
    fillAv($("stv-av"), who); $("stv-name").textContent = name; $("stv-time").textContent = win.riwayatText(win.riwayatText("Hari ini")) + ", " + hmNow(new Date(Date.now() - 18 * 6e4));
    var bars = $("stv-bars"), stage = $("stv-stage"); bars.innerHTML = ""; stage.innerHTML = "";
    frames.forEach(function (f) {
      var b = el("span", "stb", bars); el("i", "", b);
      var fr = el("div", "stf", stage);
      if (f.type === "img") { if (f.src) { var im = el("img", "", fr); im.src = f.src; im.alt = ""; } else { var ph = el("div", "stf-ph", fr); ph.textContent = INI[who] || CI; } if (f.cap) { var c = el("p", "stf-cap", fr); c.textContent = f.cap; } }
      else { var tx = el("div", "stf-txt", fr), p = el("p", "", tx); p.textContent = f.text; if (f.by) { var sm = el("small", "", p); sm.textContent = f.by; } }
    });
    $("stv-like").classList.remove("is-on");
    v.hidden = false; body.classList.add("is-modal"); void v.offsetWidth; v.classList.add("is-open"); ST.open = true;
    stGo(0); setTimeout(function () { $("stv-close").focus(); }, 60);
  }
  function stGo(i) {
    if (i >= ST.frames.length) { closeStatus(); return; } if (i < 0) { i = 0; }
    ST.i = i; ST.t0 = performance.now(); ST.acc = 0;
    qsa(".stf", $("stv-stage")).forEach(function (f, k) { f.classList.toggle("is-on", k === i); });
    qsa(".stb", $("stv-bars")).forEach(function (b, k) { b.classList.toggle("done", k < i); b.firstChild.style.width = k < i ? "100%" : "0"; });
    cancelAnimationFrame(ST.raf); ST.raf = requestAnimationFrame(stTick);
  }
  function stTick(t) {
    if (!ST.open) { return; }
    if (ST.paused) { ST.t0 = t - ST.acc; ST.raf = requestAnimationFrame(stTick); return; }
    ST.acc = t - ST.t0; var k = Math.min(1, ST.acc / ST.dur);
    var bar = qsa(".stb", $("stv-bars"))[ST.i]; if (bar) { bar.firstChild.style.width = (k * 100) + "%"; }
    if (k >= 1) { stGo(ST.i + 1); return; }
    ST.raf = requestAnimationFrame(stTick);
  }
  function closeStatus() {
    var v = $("stv"); if (!ST.open) { return; } ST.open = false; cancelAnimationFrame(ST.raf);
    v.classList.remove("is-open"); unlockModal();
    var gone = function (e) { if (e && (e.target !== v || e.propertyName !== "opacity")) { return; } if (!ST.open) { v.hidden = true; } v.removeEventListener("transitionend", gone); };
    v.addEventListener("transitionend", gone); setTimeout(gone, 450);
    if (ST.who === "g" || ST.who === "b") { store.set("seen-" + ST.who, true); var c = $("mp-" + ST.who); if (c) { c.classList.add("is-seen"); } }
    if (ST.from && ST.from.focus) { try { ST.from.focus({ preventScroll: true }); } catch (e) {} }
  }
  (function statusWire() {
    if (!$("stv")) { return; }
    $("stv-close").addEventListener("click", closeStatus);
    $("stv-prev").addEventListener("click", function () { stGo(ST.i - 1); });
    $("stv-next").addEventListener("click", function () { stGo(ST.i + 1); });
    var sg = $("stv-stage");
    ["pointerdown"].forEach(function (ev) { sg.addEventListener(ev, function () { ST.paused = true; }); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { sg.addEventListener(ev, function () { ST.paused = false; }); });
    $("stv-like").addEventListener("click", function () { var b = $("stv-like"); b.classList.toggle("is-on"); if (b.classList.contains("is-on")) { var r = b.getBoundingClientRect(); burst("emoji", { x: r.left + r.width / 2, y: r.top }, { set: ["❤️", "🥰", "💕"] }); sfx("pop"); } });
    $("stv-reply").addEventListener("click", function () { closeStatus(); setTimeout(function () { goTo("ucapan", function () { var t = $("wish-msg"); if (t) { try { t.focus({ preventScroll: true }); } catch (e) {} } }); }, 250); });
    function statusFor(w) {
      if (w === "c") { return [{ type: "img", src: PH.c, cap: G + " & " + B + (WD ? " · " + fmtDate(WD, true) : "") }, { type: "txt", text: txt("hero-desc") || win.riwayatText("Kami akan menikah! 💍"), by: "— " + G + " & " + B }]; }
      var o = w === "g" ? "b" : "g", st = readTpl("mp-" + w + "-status");
      var f = [{ type: "img", src: PH[w], cap: txt("mp-" + w + "-name") || nameOf(w) }];
      if (st) { f.push({ type: "txt", text: st, by: "— kata " + nameOf(o) + " tentang " + nameOf(w) }); }
      return f;
    }
    qsa("[data-status]").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); audioInit(); var w = b.getAttribute("data-status"); openStatus(statusFor(w), w, nameOf(w)); }); });
    $("hero-ring").addEventListener("click", function () { audioInit(); openStatus(statusFor("c"), "c", G + " & " + B); });
  })();

  /* ================= VOICE CALL (easter egg) ================= */
  var CALL = { open: false, t: [] };
  function openCall() { if (win.__RIWAYAT.phoneHref) { win.location.href=win.__RIWAYAT.phoneHref; } return;
    var c = $("call"); if (!c || CALL.open) { return; }
    audioInit(); CALL.open = true; c.hidden = false; body.classList.add("is-modal"); void c.offsetWidth; c.classList.add("is-open");
    var s = $("call-s"); s.textContent = "Memanggil…"; sfx("ring");
    CALL.t = [setTimeout(function () { s.textContent = "Berdering…"; sfx("ring"); }, 2200), setTimeout(function () { sfx("ring"); }, 4400), setTimeout(function () { s.textContent = "Tidak diangkat. Mereka sedang sibuk fitting baju pengantin 😅"; }, 6200), setTimeout(closeCall, 9800)];
    setTimeout(function () { $("call-end").focus(); }, 60);
  }
  function closeCall() {
    var c = $("call"); if (!CALL.open) { return; } CALL.open = false; CALL.t.forEach(clearTimeout);
    c.classList.remove("is-open"); unlockModal();
    setTimeout(function () { if (!CALL.open) { c.hidden = true; } }, reduce ? 0 : 380);
  }
  if ($("call-end")) { $("call-end").addEventListener("click", closeCall); }

  /* ================= THEME · WALLPAPER · SOUND · MUSIC ================= */
  var THEME = store.get("theme", null) || (mq("(prefers-color-scheme: dark)") ? "dark" : "light");
  function applyTheme(t) {
    THEME = t; root.setAttribute("data-theme", t);
    $("mi-theme-v").textContent = t === "dark" ? win.riwayatText("Nyala") : win.riwayatText("Mati");
    $("mi-theme-u").setAttribute("href", t === "dark" ? "#i-sun" : "#i-moon");
    var mc = doc.querySelector('meta[name="theme-color"]'); if (mc) { mc.setAttribute("content", t === "dark" ? "#17121b" : "#f6ebe7"); }
    ambColors(); if (themeTint) { applyTint(themeTint); }
  }
  applyTheme(THEME);
  var WPS = [["doodle", win.riwayatText("Doodle")], ["paper", win.riwayatText("Kertas")], ["sky", win.riwayatText("Langit senja")], ["photo", win.riwayatText("Foto kita")], ["plain", win.riwayatText("Polos")]].filter(function (w) { return w[0] !== "photo" || PH.c; });
  var WP = store.get("wp", "doodle");
  function applyWp(k) {
    var f = WPS.filter(function (w) { return w[0] === k; })[0] || WPS[0];
    WPS.forEach(function (w) { body.classList.remove("wp-" + w[0]); });
    body.classList.add("wp-" + f[0]); WP = f[0]; $("mi-wall-v").textContent = f[1]; store.set("wp", f[0]);
  }
  applyWp(WP);
  function applySound(on) { soundOn = on; store.set("snd", on); $("mi-sound-v").textContent = on ? win.riwayatText("Nyala") : win.riwayatText("Mati"); $("mi-sound-u").setAttribute("href", on ? "#i-vol" : "#i-mute"); }
  applySound(soundOn);
  var bgmSrc = bgm ? clean(bgm.getAttribute("data-src")) : "";
  if (!/^(https?:)?\/\//i.test(bgmSrc) && !/^\/[^/]/.test(bgmSrc)) { bgmSrc = ""; }
  if (bgmSrc) { $("ab-music").hidden = false; }
  function musicSet(on, silent) {
    if (!bgmSrc || !bgm) { return; }
    if (on) {
      if (!bgm.getAttribute("src")) { bgm.setAttribute("src", bgmSrc); }
      bgm.volume = .5; bgmOn = true;
      try { var p = bgm.play(); if (p && p.catch) { p.catch(function () { bgmOn = false; $("ab-music").classList.remove("is-on"); }); } } catch (e) { bgmOn = false; }
    } else { try { bgm.pause(); } catch (e) {} bgmOn = false; }
    $("ab-music").classList.toggle("is-on", bgmOn);
    if (!silent) { bgmWant = on; store.set("bgm", on); }
  }
  $("ab-music").addEventListener("click", function () { audioInit(); musicSet(!bgmOn); toast(bgmOn ? win.riwayatText("Musik diputar 🎵") : win.riwayatText("Musik dijeda")); });
  function menu(open) {
    var m = $("ab-menu"); open = open == null ? !m.classList.contains("is-open") : open;
    m.classList.toggle("is-open", open); $("ab-more").setAttribute("aria-expanded", open ? "true" : "false");
  }
  $("ab-more").addEventListener("click", function (e) { e.stopPropagation(); audioInit(); menu(); });
  $("mi-theme").addEventListener("click", function () { applyTheme(THEME === "dark" ? "light" : "dark"); store.set("theme", THEME); sfx("tick"); });
  $("mi-wall").addEventListener("click", function () { var i = 0; WPS.forEach(function (w, k) { if (w[0] === WP) { i = k; } }); applyWp(WPS[(i + 1) % WPS.length][0]); sfx("tick"); toast("Wallpaper: " + $("mi-wall-v").textContent); });
  $("mi-sound").addEventListener("click", function () { applySound(!soundOn); audioInit(); sfx("pop"); });

  /* ================= HEADER ================= */
  var abT = $("ab-title"), abS = $("ab-sub-t"), abSub = $("ab-sub"), abAv = $("ab-av");
  var GROUP_T = txt("ab-title") || (G + " & " + B), MEMBERS = txt("ab-sub-t") || (G + ", " + B + ", Anda");
  var curMode = "group", typingOn = false, subI = 0, storyCh = null;
  if (!txt("ab-title")) { abT.textContent = GROUP_T; }
  function swapText(n, s, wrap) { if (!n || n.textContent === s) { return; } n.textContent = s; var w = wrap || n; if (!reduce) { w.classList.remove("swap"); void w.offsetWidth; w.classList.add("swap"); } }
  function groupSubs() { var a = [MEMBERS], dl = daysLeft(); if (dl != null && dl > 0) { a.push("💍 " + dl + " " + win.riwayatText(win.riwayatText("hari"))); } else if (dl === 0) { a.push("💍 " + win.riwayatText(win.riwayatText("Hari ini"))); } a.push(win.riwayatText("online")); return a; }
  function restoreSub() {
    abSub.classList.remove("is-typing");
    if (curMode === "story") { swapText(abS, storyCh ? win.riwayatText(win.riwayatText("Riwayat Obrolan")) : win.riwayatText(win.riwayatText("Riwayat Obrolan")), abSub); }
    else { var l = groupSubs(); swapText(abS, l[subI % l.length], abSub); }
  }
  function setHeader(mode, o) {
    o = o || {};
    if (mode === "story") {
      if (curMode !== "story") { fillAv(abAv, PART); }
      curMode = "story"; swapText(abT, o.title || nameOf(PART)); if (!typingOn) { restoreSub(); }
    } else {
      if (curMode !== "group") { fillAv(abAv, "c"); swapText(abT, GROUP_T); }
      curMode = "group"; if (!typingOn) { restoreSub(); }
    }
  }
  function headerTyping(from, on, m) {
    typingOn = !!on;
    if (!on) { restoreSub(); return; }
    var inStory = m && m.closest && m.closest("#sec-kisah");
    abSub.classList.add("is-typing");
    swapText(abS, inStory ? win.riwayatText("sedang mengetik…") : nameOf(from) + win.riwayatText(" sedang mengetik…"), abSub);
  }
  setInterval(function () { if (curMode !== "group" || typingOn || !body.classList.contains("is-open")) { return; } subI += 1; restoreSub(); }, 5200);
  function storyHeader() {
    if (activeId !== "kisah" || !STORY.chapters.length) { return; }
    var line = innerHeight * .35, cur = STORY.chapters[0];
    STORY.chapters.forEach(function (c) { if (c.el.style.display !== "none" && c.el.getBoundingClientRect().top <= line) { cur = c; } });
    if (cur !== storyCh) { storyCh = cur; setHeader("story", { title: cur.year ? nameAt(cur.year) : nameOf(PART) }); }
  }
  $("ab-who").addEventListener("click", function () { if (curMode === "story") { goTo("kisah"); } else { audioInit(); openStatus([{ type: "img", src: PH.c, cap: G + " & " + B + (WD ? " · " + fmtDate(WD, true) : "") }, { type: "txt", text: txt("hero-desc") || win.riwayatText("Kami akan menikah! 💍"), by: "— " + G + " & " + B }], "c", GROUP_T); } });
  $("ab-call").addEventListener("click", openCall);
  $("ab-video").addEventListener("click", function () { audioInit(); var s = secEl("video"); if (s && shown(s)) { goTo("video", function () { if (ringFn) { ringFn(); } }); } else { toast("Belum ada panggilan video 📹"); } });

  /* ================= NAV (CHAT LIST) ================= */
  var NAV = $("nav"), LIST = $("nav-list");
  var visited = store.get("visited", {}), activeId = null, lockUntil = 0, centerT = 0, fMode = "all";
  function navItems() { return qsa("[data-nav-target]", LIST); }
  function visibleSecs() { return qsa("body > [data-section]").filter(function (s) { return s.getAttribute("data-section") !== "cover" && shown(s); }); }
  function hdrH() { var a = $("appbar"); return a ? a.getBoundingClientRect().height : 60; }
  function setPv(id, text, tick) { var p = $("nav-" + id + "-p"); if (!p) { return; } p.innerHTML = ""; if (tick) { var t = tickSvg(); t.setAttribute("class", "tk s3"); p.appendChild(t); } var s = el("span", "", p); s.textContent = text; }
  function lastTimeIn(s) { var t = qsa(".m-tm", s).pop(); return t ? t.textContent : hmNow(); }
  function navPreview() {
    ["hero","ayat","kisah","mempelai","keluarga","terjadwal","acara","rundown","lokasi","busana","galeri","rsvp","ucapan","penutup"].forEach(function(id){
      var title=$("nav-"+id+"-t"); setPv(id, title ? title.textContent : "");
    });
  }
  function navTimes() {
    navItems().forEach(function (it) {
      var id = it.getAttribute("data-nav-target"), s = secEl(id), tm = $("nav-" + id + "-tm"); if (!tm || !s) { return; }
      tm.textContent = id === "kisah" ? (STORY.first ? fmtShort(STORY.first) : "") : id === "hero" ? hmNow() : lastTimeIn(s);
      it.__n = clamp(qsa(".msg", s).filter(function (m) { return m.style.display !== "none"; }).length, 1, 9);
    });
  }
  function badges() {
    var unread = 0;
    navItems().forEach(function (it) {
      var id = it.getAttribute("data-nav-target"), u = !visited[id] && it.style.display !== "none" && shown(secEl(id));
      it.classList.toggle("is-unread", u); var b = $("nav-" + id + "-b"); if (b) { b.textContent = u ? String(it.__n || 1) : ""; }
      if (u) { unread += 1; }
    });
    $("ab-back-n").textContent = unread ? String(unread) : "";
  }
  function applyFilter() {
    var q = norm($("nav-search").value);
    navItems().forEach(function (it) {
      var id = it.getAttribute("data-nav-target");
      var ok = (!q || norm(it.textContent).indexOf(q) >= 0) && (fMode === "all" || (fMode === "unread" && !visited[id]) || (fMode === "pin" && it.getAttribute("data-pin") === "1"));
      it.classList.toggle("is-filtered", !ok);
    });
  }
  $("nav-search").addEventListener("input", applyFilter);
  qsa(".chip", $("nav-chips")).forEach(function (c) { c.addEventListener("click", function () { fMode = c.getAttribute("data-f"); qsa(".chip", $("nav-chips")).forEach(function (x) { x.classList.toggle("is-on", x === c); }); applyFilter(); }); });
  function isDesk() { return mq("(min-width: 1024px)"); }
  function openNav() { body.classList.add("nav-open"); centerNav(true); setTimeout(function () { var a = navOf(activeId) || LIST.querySelector(".ci"); if (a) { try { a.focus({ preventScroll: true }); } catch (e) {} } }, 380); }
  function closeNav() { if (!body.classList.contains("nav-open")) { return; } body.classList.remove("nav-open"); }
  $("ab-back").addEventListener("click", function () { audioInit(); openNav(); });
  $("nav-close").addEventListener("click", closeNav); $("nav-scrim").addEventListener("click", closeNav);
  NAV.addEventListener("click", function (e) {
    var it = e.target.closest("[data-nav-target]"); if (!it || !NAV.contains(it)) { return; }
    e.preventDefault(); audioInit(); sfx("tick");
    var id = it.getAttribute("data-nav-target"); closeNav(); goTo(id);
  });
  function centerNav(now) {
    var it = navOf(activeId); if (!it || it.style.display === "none" || it.classList.contains("is-filtered")) { return; }
    var L = LIST; if (L.scrollHeight <= L.clientHeight + 2) { return; }
    var lr = L.getBoundingClientRect(), ir = it.getBoundingClientRect();
    var target = clamp(L.scrollTop + (ir.top - lr.top - L.clientTop) - (L.clientHeight - ir.height) / 2, 0, L.scrollHeight - L.clientHeight);
    if (Math.abs(target - L.scrollTop) < 2) { return; }
    var vis = isDesk() || body.classList.contains("nav-open");
    try { L.scrollTo({ top: target, behavior: vis && !reduce ? "smooth" : "auto" }); } catch (e) { L.scrollTop = target; }
  }
  function modeFor(id) {
    if (id === "kisah") { storyCh = null; storyHeader(); body.classList.add("cp-locked"); }
    else { setHeader("group"); body.classList.remove("cp-locked"); }
    body.classList.toggle("cp-hide", id === "ucapan");
  }
  function setActive(id, fromTap) {
    if (!id) { return; }
    var changed = id !== activeId; activeId = id;
    navItems().forEach(function (it) { var on = it.getAttribute("data-nav-target") === id; it.classList.toggle("is-active", on); if (on) { it.setAttribute("aria-current", "true"); } else { it.removeAttribute("aria-current"); } });
    if (body.classList.contains("is-open") && !visited[id]) { visited[id] = 1; store.set("visited", visited); badges(); if (fMode === "unread") { applyFilter(); } }
    if (changed) { modeFor(id); }
    clearTimeout(centerT);
    if (fromTap) { centerNav(true); } else if (changed) { centerT = setTimeout(function () { centerNav(false); }, 180); }
  }
  function computeSec() {
    var secs = visibleSecs(); if (!secs.length) { return null; }
    var line = innerHeight * .35, cur = secs[0];
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line) { cur = s; } });
    if (innerHeight + win.pageYOffset >= doc.documentElement.scrollHeight - 4) { cur = secs[secs.length - 1]; }
    return cur;
  }
  function nextSec() { var secs = visibleSecs(), i = -1; secs.forEach(function (s, k) { if (s.getAttribute("data-section") === activeId) { i = k; } }); return secs[i + 1] || null; }
  function goTo(id, cb) {
    var s = id === "next" ? nextSec() : secEl(id);
    if (!s || !shown(s)) { return; }
    var sid = s.getAttribute("data-section");
    var y = s.getBoundingClientRect().top + win.pageYOffset - hdrH() - 4;
    lockUntil = Date.now() + (reduce ? 200 : 1100); setActive(sid, true);
    try { win.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" }); } catch (e) { win.scrollTo(0, y); }
    setTimeout(function () { lockUntil = 0; var c = computeSec(); if (c) { setActive(c.getAttribute("data-section"), false); } if (cb) { cb(); } }, reduce ? 220 : 1150);
  }
  function fabUpdate() {
    var y = win.pageYOffset, atEnd = innerHeight + y >= doc.documentElement.scrollHeight - 90;
    body.classList.toggle("fab-on", body.classList.contains("is-open") && y > innerHeight * .7 && !atEnd && !body.classList.contains("nav-open") && activeId !== "ucapan");
    var secs = visibleSecs(), i = -1, n = 0; secs.forEach(function (s, k) { if (s.getAttribute("data-section") === activeId) { i = k; } });
    secs.slice(i + 1).forEach(function (s) { if (!visited[s.getAttribute("data-section")]) { n += 1; } });
    $("fab-n").textContent = n ? String(n) : "";
  }
  $("fab").addEventListener("click", function () { audioInit(); sfx("tick"); goTo("next"); });
  doc.addEventListener("click", function (e) {
    var g = e.target.closest("[data-go]"); if (!g || g.closest("[data-nav-target]")) { return; }
    e.preventDefault(); menu(false); att(false); closeNav(); goTo(g.getAttribute("data-go"));
  });

  /* ================= COMPOSER · ATTACH ================= */
  function att(open) {
    var a = $("att"); open = open == null ? !a.classList.contains("is-open") : open;
    if (open) { var k = 0; qsa(".att-i", a).forEach(function (b) { var s = secEl(b.getAttribute("data-go")); b.hidden = !(s && shown(s)); if (!b.hidden) { b.style.setProperty("--k", k); k += 1; } }); }
    a.classList.toggle("is-open", open); $("cp-attach").setAttribute("aria-expanded", open ? "true" : "false");
  }
  $("cp-attach").addEventListener("click", function (e) { e.stopPropagation(); audioInit(); sfx("tick"); att(); });
  function toWish() { audioInit(); goTo("ucapan", function () { var t = $("wish-msg"); if (t) { try { t.focus({ preventScroll: true }); } catch (e) {} } }); }
  $("cp-field").addEventListener("click", toWish); $("cp-send").addEventListener("click", toWish);
  $("cp-emoji").addEventListener("click", function () { audioInit(); var r = $("cp-emoji").getBoundingClientRect(); burst("emoji", { x: r.left + r.width / 2, y: r.top }, { set: ["❤️", "🥰", "🎉", "💍", "✨", "🥹", "👏"] }); sfx("pop"); vibrate(6); });
  $("cp-lock").addEventListener("click", function () { toast(win.riwayatText("Ini riwayat lama, jadi cuma bisa dibaca 😄 Balas di grup ucapan, ya!")); });
  doc.addEventListener("click", function (e) {
    if (!e.target.closest("#ab-menu") && !e.target.closest("#ab-more")) { menu(false); }
    if (!e.target.closest("#att") && !e.target.closest("#cp-attach")) { att(false); }
  });

  /* ================= REACTIONS ================= */
  var rbar = $("rbar"), rTarget = null, tapT = 0, lastTapM = null, lastTapAt = 0;
  function openRbar(m) {
    var b = m.querySelector(".bub"); if (!b) { return; }
    rTarget = m; var r = b.getBoundingClientRect(), w = rbar.offsetWidth || 290;
    var x = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8), y = r.top - 58; if (y < hdrH() + 6) { y = r.bottom + 8; }
    rbar.style.setProperty("--x", x + "px"); rbar.style.setProperty("--y", y + "px");
    qsa(".rb", rbar).forEach(function (x2) { x2.classList.toggle("is-on", RX[m.id] === x2.getAttribute("data-e")); });
    rbar.classList.add("is-open"); sfx("tick");
  }
  function closeRbar() { rbar.classList.remove("is-open"); rTarget = null; }
  doc.addEventListener("click", function (e) {
    if (e.target.closest("#rbar")) { return; }
    var bub = e.target.closest(".msg .bub");
    if (!bub || e.target.closest("a,button,input,textarea,select,img,.ac,iframe,video,form,label")) { closeRbar(); return; }
    var m = bub.closest(".msg"); if (!m || m.classList.contains("pend") || !m.id) { return; }
    audioInit();
    var t = Date.now();
    if (lastTapM === m && t - lastTapAt < 330) { clearTimeout(tapT); closeRbar(); if (RX[m.id] !== "❤️") { setRx(m, "❤️"); } lastTapM = null; return; }
    lastTapM = m; lastTapAt = t; clearTimeout(tapT);
    tapT = setTimeout(function () { openRbar(m); }, 270);
  });
  qsa(".rb", rbar).forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); if (rTarget) { setRx(rTarget, b.getAttribute("data-e")); } closeRbar(); }); });

  /* ================= REVEAL OBSERVER ================= */
  var HERO = $("sec-hero"), heroDone = false, io = null, WATCH = [];
  function revealHero() { if (heroDone) { return; } heroDone = true; if (HERO) { HERO.classList.add("in-view"); } }
  function reveal(t) {
    if (t.__rev) { return; } t.__rev = 1;
    if (t.classList.contains("msg")) { enqueue(t); } else { t.classList.add("in-view"); }
    if (t.__onReveal) { var f = t.__onReveal; t.__onReveal = null; f(); }
  }
  function watch(t) { if (!t || t.__w) { return; } t.__w = 1; WATCH.push(t); if (io) { io.observe(t); } else { reveal(t); } }
  function bottomRelease() {
    if (innerHeight + win.pageYOffset < doc.documentElement.scrollHeight - 4) { return; }
    WATCH.forEach(function (t) { if (t.__rev) { return; } if (io) { io.unobserve(t); } if (t.classList.contains("msg")) { t.__rev = 1; if (t.classList.contains("pend")) { arrive(t, true); } } else { reveal(t); } });
  }
  var hinted = store.get("hint", false);
  function setupReveal() {
    if ("IntersectionObserver" in win) { io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); reveal(en.target); } }); }, { threshold: 0, rootMargin: "0px 0px -33% 0px" }); }
    qsa("body > [data-section]").forEach(function (s) {
      if (s.id === "sec-cover" || s.id === "sec-hero") { return; }
      qsa(".topic", s).forEach(watch);
      qsa(".rv, .msg", s).forEach(function (t) { if (t.closest("template")) { return; } if (t.classList.contains("msg") && !t.classList.contains("pend")) { return; } watch(t); });
    });
    var firstK = qsa("#sec-kisah .msg")[0];
    if (firstK && !hinted) { var prev = firstK.__onArrive; firstK.__onArrive = function () { if (prev) { prev(); } if (!hinted) { hinted = true; store.set("hint", true); setTimeout(function () { toast(win.riwayatText("Tips: ketuk pesan untuk memberi reaksi · ketuk dua kali untuk ❤️")); }, 1400); } }; }
  }

  /* ================= SCROLL LOOP ================= */
  var ticking = false;
  function frame() {
    ticking = false; gPaint();
    var s = computeSec(); if (s && Date.now() >= lockUntil) { setActive(s.getAttribute("data-section"), false); }
    storyHeader(); fabUpdate(); bottomRelease();
  }
  win.addEventListener("scroll", function () { if (rTarget) { closeRbar(); } if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  win.addEventListener("resize", function () { setVH(); fxSize(); ambSize(); if (!amb.run && amb.ctx) { ambDraw(0); } centerNav(false); frame(); });

  /* ================= COVER ================= */
  var cover = $("sec-cover"), opened = false, clockT = 0;
  function coverClock() { var d = new Date(); $("cv-clock").textContent = hmNow(d); $("cv-bar-time").textContent = hmNow(d); $("cv-date").textContent = DOW[d.getDay()] + ", " + d.getDate() + " " + MON[d.getMonth()]; }
  function afterOpen() {
    navTimes(); badges(); frame();
    if (!store.get("opened", false)) { store.set("opened", true); }
  }
  function openCover(src) {
    if (opened) { return; } opened = true;
    audioInit(); sfx("unlock"); vibrate(14); clearInterval(clockT);
    var tapped = src && src.closest ? src.closest(".cv-n") : null; if (!tapped) { tapped = $("cv-n1"); }
    var scr = $("cv-screen"), L = $("cv-launch");
    if (tapped && scr && L && !reduce) {
      var sr = scr.getBoundingClientRect(), r = tapped.getBoundingClientRect(); tapped.classList.add("is-tapped");
      L.style.left = (r.left - sr.left) + "px"; L.style.top = (r.top - sr.top) + "px"; L.style.width = r.width + "px"; L.style.height = r.height + "px"; void L.offsetWidth;
      setTimeout(function () { cover.classList.add("is-launching"); L.style.left = "0px"; L.style.top = "0px"; L.style.width = sr.width + "px"; L.style.height = sr.height + "px"; L.style.borderRadius = getComputedStyle(scr).borderTopLeftRadius; }, 40);
    }
    cover.classList.add("is-opening", "is-gone");
    body.classList.remove("is-locked");
    setTimeout(function () { body.classList.add("is-open"); frame(); }, reduce ? 0 : 560);
    if (reduce) { revealHero(); } else { setTimeout(revealHero, 640); }
    var fin = false, gone = function (e) { if (e && (e.target !== cover || e.propertyName !== "opacity")) { return; } if (fin) { return; } fin = true; cover.style.display = "none"; cover.removeEventListener("transitionend", gone); afterOpen(); };
    cover.addEventListener("transitionend", gone); setTimeout(gone, 2600);
    if (bgmSrc && bgmWant) { musicSet(true, true); }
    ambStart(); fxSize();
    setTimeout(function () { sfx("chime"); }, 900);
  }

  /* ================= INIT ================= */
  try { if ("scrollRestoration" in win.history) { win.history.scrollRestoration = "manual"; } } catch (e) {}
  if (cover && $("cv-n1") && !win.__RIWAYAT.resumeOpen) { win.scrollTo(0, 0); }
  (function todayPill() { var f = TODAY.filter(shown)[0]; if (f) { var dp = f.querySelector(".dp-today"); if (dp) { dp.hidden = false; } } })();
  hydrateToday();
  navPreview(); navTimes();
  setupReveal();
  if (cover && $("cv-n1") && !win.__RIWAYAT.resumeOpen) {
    coverClock(); clockT = setInterval(coverClock, 1000);
    qsa(".cv-n", cover).forEach(function (n) { n.addEventListener("click", function () { openCover(n); }); });
    var sy0 = null, lw = $("cv-lockwrap");
    cover.addEventListener("pointerdown", function (e) { sy0 = e.clientY; }, { passive: true });
    cover.addEventListener("pointermove", function (e) { if (sy0 == null || opened) { return; } var dy = Math.min(0, e.clientY - sy0); lw.style.transform = dy ? "translateY(" + (dy * .4).toFixed(1) + "px)" : ""; }, { passive: true });
    var up = function (e) { if (sy0 == null) { return; } var dy = e.clientY - sy0; sy0 = null; lw.style.transform = ""; if (dy < -70) { openCover(null); } };
    cover.addEventListener("pointerup", up); cover.addEventListener("pointercancel", function () { sy0 = null; lw.style.transform = ""; });
    cover.addEventListener("keydown", function (e) { if (e.key === "ArrowUp") { openCover(null); } });
  } else {
    if (cover) { cover.style.display = "none"; }
    body.classList.remove("is-locked"); body.classList.add("is-open"); revealHero(); ambStart(); afterOpen();
  }
  doc.addEventListener("keydown", function (e) {
    if (VW.open) { if (e.key === "ArrowLeft") { show(VW.i - 1); } else if (e.key === "ArrowRight") { show(VW.i + 1); } else if (e.key === "Escape") { closeViewer(); } return; }
    if (ST.open) { if (e.key === "ArrowLeft") { stGo(ST.i - 1); } else if (e.key === "ArrowRight") { stGo(ST.i + 1); } else if (e.key === "Escape") { closeStatus(); } return; }
    if (e.key !== "Escape") { return; }
    if (CALL.open) { closeCall(); return; }
    if (!$("dlg").hidden) { dialogClose(false); return; }
    if ($("ab-menu").classList.contains("is-open")) { menu(false); return; }
    if ($("att").classList.contains("is-open")) { att(false); return; }
    if (rbar.classList.contains("is-open")) { closeRbar(); return; }
    closeNav();
  });
  badges(); frame();
  win.riwayatRSVPSaved = function(text) { sendMsg($("rsvp-thread"),{text:text,side:"r",from:"me",group:false}); };
  if (!win.__RIWAYAT.preview && bgmSrc && bgmWant) { musicSet(true, true); }
})();
