(function(){  function buildPanel(accent) {
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


window.qogozClosePanel=buildPanel;})();
