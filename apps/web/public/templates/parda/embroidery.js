(function () {
  "use strict";
  function first(s) { return Array.from(String(s || "").trim())[0]?.toLocaleUpperCase() || ""; }
  function draw(canvas, initials, size, glow) {
    canvas.width = canvas.height = size;
    var c = canvas.getContext("2d"), d = size, cx = d / 2, cy = d / 2;
    c.clearRect(0, 0, d, d);
    // Satin stitch field: a warm madder couched outline under individually lit gold diagonals.
    c.save(); c.translate(cx, cy); c.scale(1, .93); c.textAlign = "center"; c.textBaseline = "middle";
    var text = initials[0] + " & " + initials[1], fontSize = size * (text.length > 5 ? .19 : .24);
    c.font = fontSize + 'px "Great Vibes", cursive';
    if (glow) c.shadowColor = "rgba(255,198,95,.9)"; c.shadowBlur = glow ? size * .09 : 0;
    c.lineJoin = "round"; c.lineWidth = size * .025; c.strokeStyle = "#55242a"; c.strokeText(text, 0, 0, size * .82);
    c.fillStyle = "#e4bc60"; c.fillText(text, 0, 0, size * .82); c.shadowBlur = 0;
    c.globalAlpha = .45; c.strokeStyle = "#fff0b0"; c.lineWidth = Math.max(1, size * .005);
    var metrics = c.measureText(text), x0 = -Math.min(metrics.width, size * .82) / 2, x1 = -x0;
    for (var x = x0; x < x1; x += Math.max(2, size * .018)) { c.beginPath(); c.moveTo(x, -fontSize * .38); c.lineTo(x - fontSize * .32, fontSize * .36); c.stroke(); }
    c.restore();
  }
  window.PardaEmbroidery = { first: first, draw: draw };
})();
