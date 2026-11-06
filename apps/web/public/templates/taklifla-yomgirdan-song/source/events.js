window.renderYomgirEvents = function(live) {
var $ = s => document.querySelector(s), esc = window.yomgirEscape;
    var host = $("#yg-events");
    var spine = host.firstElementChild;
    host.innerHTML = "";
    if (spine) host.appendChild(spine);
    live.forEach(function (r) {
      var desc = [r.place, r.description].filter(Boolean).join(" · ");
      var row = document.createElement("div");
      row.className = "yg-ev-row";
      row.style.position = "relative";
      row.innerHTML =
        '<div style="position:absolute;left:-29px;top:18px;width:16px;height:16px;border-radius:50%;background:#f2c078;border:3px solid rgba(255,250,240,.9);box-shadow:0 0 12px rgba(242,192,120,.7);"></div>' +
        '<div style="background:rgba(255,250,240,.93);border-radius:14px;padding:16px 18px;box-shadow:0 10px 30px rgba(110,60,70,.18);">' +
          '<div style="display:flex;align-items:baseline;gap:10px;">' +
            (r.time ? '<span style="font-family:\'Milonga\',serif;font-size:20px;color:#a5533f;">' + esc(r.time) + '</span>' : '') +
            (r.title ? '<span style="font-size:17px;font-weight:700;color:#46333e;">' + esc(r.title) + '</span>' : '') +
          '</div>' +
          (desc ? '<div style="margin-top:5px;font-size:14.5px;line-height:1.5;color:#6b5560;">' + esc(desc) + '</div>' : '') +
        '</div>';
      host.appendChild(row);
    });

};
