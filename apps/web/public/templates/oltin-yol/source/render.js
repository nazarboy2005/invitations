(function(){
var $=function(s){return document.querySelector(s)},hide=function(el){el.hidden=true},esc=function(v){var d=document.createElement("div");d.textContent=String(v ?? "");return d.innerHTML};
window.renderOltinTimetable=function(rows){
    function hostClear(){ $("#oy-stops").replaceChildren(); }
    var section = $("#oy-timetable-section");
    if(section)section.hidden=!rows.length;
    var live = rows.filter(function (r) { return r && (r.title || r.description || r.time || r.place); });
    if (!live.length) { hostClear(); return; }
    var host = $("#oy-stops");
    host.innerHTML = "";
    live.forEach(function (r, i) {
      var note = [r.place, r.description].filter(Boolean).join(" · ");
      var dot = i === live.length - 1 ? "#d95b43" : "#f7ecd6";
      var row = document.createElement("div");
      row.className = "oy-stop-row";
      row.style.display = "flex";
      row.style.gap = "16px";
      row.style.paddingBottom = i === live.length - 1 ? "0" : "24px";
      row.innerHTML =
        '<div style="width:21px;flex-shrink:0;display:flex;justify-content:center;"><div style="width:13px;height:13px;border-radius:50%;background:' + dot + ';border:3.5px solid #2f5a52;margin-top:3px;box-shadow:0 0 0 3px #fdf6e6;"></div></div>' +
        '<div style="min-width:0;">' +
          '<div style="display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;">' +
            (r.time ? '<span style="font:800 18px \'Podkova\',serif;color:#b3552f;letter-spacing:.04em;">' + esc(r.time) + '</span>' : '') +
            (r.title ? '<span style="font:700 15px \'Podkova\',serif;letter-spacing:.14em;color:#3f2d20;">' + esc(r.title) + '</span>' : '') +
          '</div>' +
          (note ? '<div style="font:italic 14.5px/1.5 \'Vollkorn\',serif;color:#6b5949;margin-top:2px;">' + esc(note) + '</div>' : '') +
        '</div>';
      host.appendChild(row);
    });
};
var list=$("#oy-wish-list"),empty=$("#oy-wish-empty");
    window.renderOltinWishes=function(items) {
      list.innerHTML = "";
      if (!items || !items.length) { if (empty) empty.style.display = "block"; return; }
      if (empty) empty.style.display = "none";
      items.forEach(function (w) {
        var name = w.name || w.n || "";
        var msg = w.message || w.text || w.m || "";
        var headerEl = $('[data-i18n="telegraph_header"]');
        var headerTxt = headerEl ? headerEl.textContent : "OLTIN YO'L TELEGRAFI";
        var c = document.createElement("div");
        c.style.cssText = "background:#fdf6e6;border:1.5px solid rgba(185,138,63,.4);border-radius:5px;padding:14px 17px;box-shadow:0 6px 16px rgba(96,64,28,.10);";
        c.innerHTML = '<div style="font:600 9px \'Podkova\',serif;letter-spacing:.2em;color:#a8895c;">' + esc(headerTxt) + '</div>' +
          '<div style="margin:9px 0 7px;font:italic 15.5px/1.55 \'Vollkorn\',serif;color:#4a3626;overflow-wrap:break-word;white-space:pre-wrap;">' + esc(msg) + '</div>' +
          '<div style="text-align:right;font:700 12px \'Podkova\',serif;letter-spacing:.14em;color:#2f5a52;text-transform:uppercase;">— ' + esc(name) + '</div>';
        list.appendChild(c);
      });
    }
})();
