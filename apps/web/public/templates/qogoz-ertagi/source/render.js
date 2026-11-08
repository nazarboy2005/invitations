(function(){var $=s=>document.querySelector(s),esc=v=>{var d=document.createElement("div");d.textContent=String(v ?? "");return d.innerHTML;};
window.renderQogozProgram=function(rows){
    var section = $("#qg-events-section");
    section.hidden=!rows.length;
    var live = rows.filter(function (r) { return r && (r.title || r.description || r.time || r.place); });
    if (!live.length) { $("#qg-events").replaceChildren(); return; }
    var host = $("#qg-events");
    host.innerHTML = "";
    live.forEach(function (r) {
      var desc = [r.place, r.description].filter(Boolean).join(" · ");
      var row = document.createElement("div");
      row.setAttribute("data-pop", "");row.dataset.itemId=r.id;
      row.style.position = "relative";
      row.innerHTML =
        '<div style="position:absolute;left:-32px;top:3px;width:13px;height:13px;border-radius:50%;background:#c9a24b;border:3px solid #fffdf4;box-shadow:0 2px 6px rgba(120,80,30,.35)"></div>' +
        (r.time ? '<div style="font-family:Amarante,serif;font-size:14px;letter-spacing:2px;color:#b98d3e;">' + esc(r.time) + '</div>' : '') +
        (r.title ? '<div style="font-weight:700;font-size:17px;margin-top:2px;">' + esc(r.title) + '</div>' : '') +
        (desc ? '<div style="font-size:13.5px;line-height:1.6;color:#7a654a;margin-top:3px;">' + esc(desc) + '</div>' : '');
      host.appendChild(row);
    });
    // freshly-built rows have no prior IO observation — reveal immediately
    Array.prototype.forEach.call(host.querySelectorAll("[data-pop]"), function (n) { n.style.opacity = "1"; });};
var list=$("#qg-wish-list"),empty=$("#qg-wish-empty");
    window.renderQogozWishes=function(items) {
      list.innerHTML = "";
      if (!items || !items.length) { if (empty) empty.style.display = "block"; return; }
      if (empty) empty.style.display = "none";
      items.forEach(function (w) {
        var name = w.name || w.n || "";
        var msg = w.message || w.text || w.m || "";
        var c = document.createElement("div");
        c.style.cssText = "background:#fffdf4;border:1px solid #e6d6b4;border-radius:12px;padding:14px 16px;box-shadow:0 3px 10px rgba(120,85,40,.12);";
        c.innerHTML = '<div style="font-family:Amarante,serif;font-size:14px;color:#8a6238;">' + esc(name) + '</div>' +
          '<div style="font-size:14px;line-height:1.6;color:#5d4a32;margin-top:5px;overflow-wrap:anywhere;white-space:pre-wrap;">' + esc(msg) + '</div>';
        list.appendChild(c);
      });
    }
})();
