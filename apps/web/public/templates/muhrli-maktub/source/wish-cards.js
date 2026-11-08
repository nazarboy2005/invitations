window.renderEnvelopeWishes = function(items,locale) {
  var list=document.querySelector('#env-wish-list'),empty=document.querySelector('#env-wish-empty');
  var esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  var norm = () => locale;
  var MON = {};
    var rots = [-1.8, 1.3, -.7, 1.9, -1.2, .8, -2, 1.5, -.5, 1.1, -1.6, .9];
    var lastItems = [];

    function fmtShort(ts,lang) { var d=new Date(ts); return isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat(lang === 'uz-Latn' ? 'uz-UZ' : lang === 'uz-Cyrl' ? 'uz-Cyrl-UZ' : lang,{day:'numeric',month:'short'}).format(d); }
    function render(items) {
      lastItems = items || [];
      var lang = norm(window.__takliflaLang);
      list.innerHTML = "";
      if (!lastItems.length) { if (empty) empty.style.display = "block"; return; }
      if (empty) empty.style.display = "none";
      lastItems.forEach(function (w, i) {
        var name = w.name || "";
        var msg = w.message || "";
        var when = w.submittedAt ? fmtShort(w.submittedAt, lang) : "";
        var c = document.createElement("div");
        c.style.cssText = "background:#fdf8ec;border:1px solid #e2d2ac;border-radius:4px;padding:14px 16px;box-shadow:0 8px 20px -12px rgba(58,28,20,.35);transform:rotate(" + rots[i % rots.length] + "deg);";
        c.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;">' +
          '<div style="font-family:\'Prata\',serif;font-size:13.5px;color:#8a5a3b;">' + esc(name) + '</div>' +
          (when ? '<div style="font-size:11px;color:rgba(74,35,64,.5);">' + esc(when) + '</div>' : '') + '</div>' +
          '<div style="font-size:14.5px;line-height:1.55;color:#4a2340;margin-top:6px;white-space:pre-wrap;">' + esc(msg) + '</div>';
        list.appendChild(c);
      });
    }

  render(items);
};
