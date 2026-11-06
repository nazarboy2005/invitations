window.renderYomgirWishes = function(items) {
var list=document.querySelector("#yg-wish-list"),empty=document.querySelector("#yg-wish-empty"),esc=window.yomgirEscape;
    function render(items) {
      list.innerHTML = "";
      if (!items || !items.length) { if (empty) empty.style.display = "block"; return; }
      if (empty) empty.style.display = "none";
      items.forEach(function (w) {
        var name = w.name || w.n || "";
        var msg = w.message || w.m || "";
        var c = document.createElement("div");
        c.style.cssText = "background:rgba(255,255,255,.82);border-radius:12px;padding:13px 16px;box-shadow:0 6px 18px rgba(90,120,150,.12);";
        c.innerHTML = '<div style="font-weight:700;font-size:15px;color:#2d4a63;">' + esc(name) + '</div>' +
          '<div style="margin-top:4px;font-size:14.5px;line-height:1.5;color:#45596b;white-space:pre-wrap;">' + esc(msg) + '</div>';
        list.appendChild(c);
      });
    }

render(items);
};
