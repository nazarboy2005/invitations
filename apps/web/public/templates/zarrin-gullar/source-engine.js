(function(){"use strict";var $=function(s){return document.querySelector(s)};
  /* ── splash open ── */
  (function () {
    var splash = $("#mw-splash");
    var opened = false;
    if (splash) document.body.style.overflow = "hidden";
    function open() {
      if (opened) return; opened = true;
      if (splash) { splash.style.opacity = "0"; splash.style.transform = "translateX(-50%) scale(1.04)"; splash.style.pointerEvents = "none"; setTimeout(function () { splash.style.display = "none"; }, 700); }
      document.body.style.overflow = "";
    }
    var ob = $("#mw-open");
    if (ob) ob.addEventListener("click", open);
    if (!splash) document.body.style.overflow = "";
  })();

  /* ── reveal on scroll ── */
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) { for (var i = 0; i < els.length; i++) els[i].classList.add("mw-in"); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("mw-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  })();

  /* ── falling petals ── */
  (function () {
    var host = $("#mw-petals");
    if (!host) return;
    var specs = [
      [4,13,15,"#e2953f",".55",12,0],[12,9,11,"#c67139",".45",15,-4],[22,15,12,"#e8a54b",".5",10.5,-8],
      [31,8,10,"#aebf92",".4",16,-2],[41,12,14,"#d3792c",".55",11,-6],[52,10,12,"#e2953f",".5",13.5,-10],
      [62,14,11,"#f6a06b",".5",12.5,-3],[71,9,11,"#8fa073",".38",17,-12],[80,13,15,"#c67139",".55",11.5,-7],
      [90,11,13,"#e8a54b",".5",14,-5]
    ];
    var rads = ["62% 38% 55% 45%/48% 62% 38% 52%","55% 45% 60% 40%/55% 45% 60% 40%","48% 52% 40% 60%/62% 38% 55% 45%"];
    specs.forEach(function (p, i) {
      var d = document.createElement("div");
      d.style.cssText = "position:absolute;top:-26px;left:" + p[0] + "%;width:" + p[1] + "px;height:" + p[2] +
        "px;background:" + p[3] + ";border-radius:" + rads[i % rads.length] + ";opacity:" + p[4] +
        ";animation:mw-fall " + p[5] + "s linear " + p[6] + "s infinite;";
      host.appendChild(d);
    });
  })();

  function buildPanel(accent) {
    var panel = document.createElement("div");
    panel.className = "wish-closed";
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    panel.style.cssText = [
      "max-width:540px",
      "margin:0 auto",
      "padding:36px 28px",
      "border:1px solid " + accent + "55",
      "background:linear-gradient(to bottom, transparent, " + accent + "0d)",
      "text-align:center",
      "color:inherit",
    ].join(";");

    panel.innerHTML =
      // Hairline rule with a centered diamond ornament — same motif as
      // the rest of the editorial system.
      '<div aria-hidden="true" style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:20px;color:' + accent + ';">' +
        '<span style="flex:0 0 56px;height:1px;background:linear-gradient(to right, transparent, ' + accent + ');"></span>' +
        '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
          '<path d="M8 1 L11 8 L8 15 L5 8 Z" stroke="' + accent + '" stroke-width="0.8"/>' +
          '<circle cx="8" cy="8" r="1.2" fill="' + accent + '"/>' +
        "</svg>" +
        '<span style="flex:0 0 56px;height:1px;background:linear-gradient(to left, transparent, ' + accent + ');"></span>' +
      "</div>" +
      '<div style="font-family:inherit;font-size:11px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:' + accent + ';margin-bottom:12px;">Daftar yopildi</div>' +
      "<div style=\"font-family:inherit;font-size:24px;font-style:italic;line-height:1.2;margin-bottom:12px;color:inherit;\">Bayram o’tdi — rahmat</div>" +
      "<p style=\"font-family:inherit;font-style:italic;font-size:15px;line-height:1.55;opacity:0.78;margin:0;color:inherit;\">Yangi tilaklarni qabul qilish to’xtatildi. Mehmonlar qoldirgan so’zlar bayram esi sifatida saqlanadi.</p>";

    return panel;
  }


window.marigoldClosePanel=buildPanel;
})();
