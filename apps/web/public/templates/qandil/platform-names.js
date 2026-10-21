(function () {
  "use strict";

  var selector = '.names text[data-name="groom"], .names text[data-name="bride"]';
  var queued = false;

  function fitNames() {
    queued = false;
    var names = Array.prototype.slice.call(document.querySelectorAll(selector));
    var populated = names.filter(function (name) {
      return name.textContent.trim();
    });
    if (!populated.length) return;

    var fontLoads = populated.map(function (name) {
      return document.fonts && document.fonts.load
        ? document.fonts.load('56px "Great Vibes"', name.textContent.trim()).catch(function () {})
        : Promise.resolve();
    });

    Promise.all(fontLoads).then(function () {
      requestAnimationFrame(function () {
        populated.forEach(function (name) {
          name.setAttribute("font-family", '"Great Vibes", "Cormorant Garamond", cursive');
          name.setAttribute("font-size", "56");
          var width = name.getBBox().width;
          if (width > 330) {
            name.setAttribute("font-size", String((56 * 330) / width));
            // Keep the final painted text inside the source SVG's 360-unit
            // canvas even when its font metrics change after font loading.
            name.setAttribute("textLength", "330");
            name.setAttribute("lengthAdjust", "spacingAndGlyphs");
          } else {
            name.removeAttribute("textLength");
            name.removeAttribute("lengthAdjust");
          }
        });
      });
    });
  }

  function scheduleFit() {
    if (queued) return;
    queued = true;
    fitNames();
  }

  var observer = new MutationObserver(scheduleFit);
  document.querySelectorAll(selector).forEach(function (name) {
    observer.observe(name, { characterData: true, childList: true, subtree: true });
  });
  scheduleFit();
})();
