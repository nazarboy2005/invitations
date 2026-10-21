/* Local motion in the original painting. Called by the template's single ambient loop. */
(function () {
  "use strict";
  var W = 780, H = 1688;
  var WATER = [[307,1139],[546,1139],[778,1329],[779,1442],[748,1496],[340,1498],[337,1476],[301,1462],[308,1433],[268,1420],[244,1394],[220,1369],[210,1346],[178,1340],[172,1313],[141,1302],[111,1300],[95,1288]];
  var PLANTS = [
    { channel: 1, pivot: [55,920], gain: 1, phase: 0, polygon: [[0,391],[42,382],[94,418],[104,455],[169,502],[188,539],[234,558],[248,604],[275,646],[301,690],[320,747],[307,778],[272,758],[247,720],[208,749],[176,729],[143,761],[111,787],[81,818],[47,816],[44,876],[15,941],[0,943]] },
    { channel: 2, pivot: [780,470], gain: .8, phase: 1.7, polygon: [[507,547],[550,516],[579,484],[590,448],[638,448],[680,471],[728,447],[780,415],[780,646],[734,635],[711,604],[680,591],[648,606],[613,571],[554,585],[508,575]] },
    { channel: 2, pivot: [680,1073], gain: .55, phase: .8, polygon: [[574,999],[599,956],[617,912],[635,860],[665,836],[691,863],[715,888],[735,931],[727,975],[710,1008],[729,1048],[698,1071],[672,1050],[642,1024],[611,1037]] },
    { channel: 1, pivot: [50,1688], gain: .8, phase: 2.3, polygon: [[0,1173],[67,1178],[95,1211],[112,1278],[144,1283],[173,1311],[199,1332],[226,1369],[251,1390],[271,1424],[316,1447],[351,1487],[319,1535],[274,1526],[247,1579],[261,1638],[237,1688],[0,1688]] },
    { channel: 2, pivot: [780,1688], gain: .65, phase: 3.7, polygon: [[587,1688],[582,1646],[607,1587],[656,1530],[708,1506],[758,1463],[780,1442],[780,1688]] }
  ];
  function trace(ctx, points) {
    ctx.beginPath();
    points.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    ctx.closePath();
  }
  function shader(gl, type, source) {
    var item = gl.createShader(type); gl.shaderSource(item, source); gl.compileShader(item);
    if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) { var message = gl.getShaderInfoLog(item); gl.deleteShader(item); throw new Error(message); }
    return item;
  }
  var VERTEX = [
    "attribute vec2 aPosition;",
    "varying vec2 vUV;",
    "void main(){ vUV=vec2(aPosition.x*.5+.5,.5-aPosition.y*.5); gl_Position=vec4(aPosition,0.,1.); }"
  ].join("\n");
  var FRAGMENT = [
    "precision mediump float;",
    "uniform sampler2D uImage; uniform sampler2D uMask;",
    "uniform vec2 uView; uniform float uTime; uniform float uStrength;",
    "varying vec2 vUV;",
    "void main(){",
    "  vec2 size=vec2(780.,1688.);",
    "  float cover=max(uView.x/size.x,uView.y/size.y);",
    "  vec2 visible=uView/(size*cover);",
    "  vec2 uv=vec2(.5+(vUV.x-.5)*visible.x,vUV.y*visible.y);",
    "  vec3 masks=texture2D(uMask,uv).rgb;",
    "  float t=uTime;",
    "  float depth=clamp((uv.y-.675)/.214,0.,1.);",
    // water: slow swells, a current drifting toward the viewer, and fine chop on top
    "  float swell=sin(uv.y*150.-t*1.25+sin(uv.x*9.+t*.31)*1.2);",
    "  float current=sin(uv.y*260.-t*2.1+uv.x*11.);",
    "  float chop=sin(uv.y*620.+t*1.7+uv.x*31.)*.45+sin(uv.x*90.-t*1.3+uv.y*40.)*.35;",
    "  float wave=swell*.55+current*.45;",
    "  vec2 water=vec2((swell*1.6+current*1.1+chop)*(2.4+depth*4.2),",
    "    (sin(uv.y*210.-t*1.6+uv.x*19.)*1.2+chop*.6)*(.8+depth*1.6));",
    // breeze: the whole branch bends with the gust, and each leaf flutters on its own
    "  float gust=sin(t*.49)*.58+sin(t*.87+1.4)*.27+sin(t*1.73)*.15;",
    "  float nearLeaf=smoothstep(.63,.91,uv.y);",
    "  float bend=6.+nearLeaf*4.;",
    "  float left=gust+sin(t*.63+uv.y*7.)*.3;",
    "  float right=sin(t*.46+1.7)*.62+sin(t*.92+uv.y*6.)*.3;",
    "  float leafx=sin(t*3.1+uv.x*140.+uv.y*120.)*1.7+sin(t*4.7+uv.y*230.+uv.x*60.)*1.;",
    "  float leafy=sin(t*3.6+uv.x*170.-uv.y*90.)*1.3+cos(t*5.3+uv.y*260.)*.7;",
    "  float leafAmt=(.55+.45*abs(gust))*(masks.g+masks.b);",
    "  vec2 breeze=vec2((left*masks.g+right*masks.b)*bend+leafx*leafAmt,",
    "    (sin(t*.71+uv.y*5.)*masks.g+sin(t*.65+2.1)*masks.b)*1.6+leafy*leafAmt);",
    "  vec2 offset=(water*masks.r+breeze)*uStrength/size;",
    "  vec3 color=texture2D(uImage,clamp(uv+offset,vec2(.0001),vec2(.9999))).rgb;",
    // light on the water: moving bright streaks and a gentle shimmer of the reflected sky
    "  float streak=pow(max(0.,sin(uv.y*300.-t*2.1+sin(uv.x*20.+t*.4)*1.3)),10.)*(.4+.6*smoothstep(.0,.6,sin(uv.x*13.+t*.5)*.5+.5));",
    "  float shimmer=sin(uv.y*140.-t*1.25+uv.x*7.)*.5+.5;",
    "  color=mix(color,color*(1.+(shimmer-.5)*.16),masks.r*uStrength);",
    "  color+=vec3(1.,.93,.74)*streak*.14*masks.r*uStrength;",
    "  color+=vec3(1.,.9,.7)*pow(max(0.,leafx*.5),3.)*.035*(masks.g+masks.b)*uStrength;",
    "  gl_FragColor=vec4(color,1.);",
    "}"
  ].join("\n");

  function Scene(options) {
    this.canvas = options.canvas; this.image = options.image;
    this.reduced = options.reduced; this.lite = options.lite;
    this.ready = false; this.mode = "static"; this.width = 1; this.height = 1;
    var self = this, source = new Image();
    // A data URI keeps the texture origin-clean when the invitation is opened with file://.
    source.onload = function () {
      self.source = source;
      self.image.src = source.src;
      var backdrop = document.querySelector(".courtyard-backdrop");
      if (backdrop) backdrop.style.backgroundImage = 'linear-gradient(#514a3c66,#71624b99),url("' + source.src + '")';
      if (self.reduced) { self.canvas.hidden = true; return; }
      self.build(); self.resize(); self.render(0);
      self.canvas.classList.add("is-ready");
    };
    source.onerror = function () { self.canvas.hidden = true; self.image.src = "art/court-scene-painted.webp"; };
    source.src = window.GANCH_SCENE_TEXTURE || "art/court-scene-painted.webp";
    this.canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); self.ready = false; self.canvas.classList.remove("is-ready"); });
    this.canvas.addEventListener("webglcontextrestored", function () { self.build(); self.resize(); self.render(0); self.canvas.classList.add("is-ready"); });
  }
  Scene.prototype.mask = function () {
    var canvas = document.createElement("canvas"); canvas.width = 390; canvas.height = 844;
    var ctx = canvas.getContext("2d"); ctx.scale(.5,.5);
    // Red is restricted to the water's inner edge; the stone rim and foreground roses stay still.
    trace(ctx,WATER); ctx.save(); ctx.clip();
    ctx.fillStyle = "#ff0000"; ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 2;
    ctx.fill(); ctx.restore();
    // Slightly softened foliage masks let branch tips bend without hard patch boundaries.
    ctx.globalCompositeOperation = "lighter";
    PLANTS.forEach(function (plant) {
      ctx.save(); trace(ctx,plant.polygon);
      var color = plant.channel === 1 ? "#00ff00" : "#0000ff";
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 14;
      ctx.globalAlpha = plant.gain; ctx.fill(); ctx.restore();
    });
    return canvas;
  };
  Scene.prototype.build = function () {
    var gl;
    try {
      gl = this.canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: "low-power" });
      if (!gl) throw new Error("WebGL unavailable");
      var vertex = shader(gl,gl.VERTEX_SHADER,VERTEX), fragment = shader(gl,gl.FRAGMENT_SHADER,FRAGMENT);
      var program = gl.createProgram(); gl.attachShader(program,vertex); gl.attachShader(program,fragment); gl.linkProgram(program);
      gl.deleteShader(vertex); gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      var buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
      var position = gl.getAttribLocation(program,"aPosition"); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
      var self = this;
      [this.source,this.mask()].forEach(function (picture,index) {
        var texture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0+index); gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,picture);
        gl.uniform1i(gl.getUniformLocation(program,index ? "uMask" : "uImage"),index);
      });
      this.gl = gl; this.uniforms = {};
      ["uView","uTime","uStrength"].forEach(function (name) { self.uniforms[name] = gl.getUniformLocation(program,name); });
      this.mode = "webgl"; this.ready = true;
    } catch (_) {
      if (gl) { var extension = gl.getExtension("WEBGL_lose_context"); if (extension) extension.loseContext(); }
      // A canvas cannot change context type after getContext; replace it for the 2D fallback.
      var replacement = document.createElement("canvas"); replacement.className = this.canvas.className; replacement.setAttribute("aria-hidden","true");
      this.canvas.replaceWith(replacement); this.canvas = replacement;
      this.ctx = this.canvas.getContext("2d"); this.mode = this.ctx ? "2d" : "static"; this.ready = !!this.ctx;
      if (!this.ready) this.canvas.hidden = true;
    }
  };
  Scene.prototype.resize = function () {
    var box = this.canvas.parentElement;
    this.width = box.clientWidth || 390; this.height = box.clientHeight || 844;
    var low = this.lite(), ratio = Math.min(window.devicePixelRatio || 1,low ? 1 : 1.5);
    this.canvas.width = Math.round(this.width*ratio); this.canvas.height = Math.round(this.height*ratio);
    if (this.gl && this.mode === "webgl") this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
    this.ratio = ratio;
  };
  Scene.prototype.render = function (time) {
    if (!this.ready) return;
    var strength = Math.min(1,time/1.4)*(this.lite() ? .85 : 1);
    if (this.mode === "webgl") {
      var gl = this.gl;
      gl.uniform2f(this.uniforms.uView,this.width,this.height);
      gl.uniform1f(this.uniforms.uTime,time); gl.uniform1f(this.uniforms.uStrength,strength);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    } else this.draw2D(time,strength);
  };
  Scene.prototype.draw2D = function (time,strength) {
    var ctx = this.ctx, image = this.source, cover = Math.max(this.width/W,this.height/H);
    ctx.setTransform(this.ratio*cover,0,0,this.ratio*cover,this.ratio*(this.width-W*cover)*.5,0);
    ctx.drawImage(image,0,0,W,H);
    ctx.save(); trace(ctx,WATER); ctx.clip();
    var step = this.lite() ? 5 : 3;
    for (var y = 1136; y < 1505; y += step) {
      var depth = (y-1136)/369;
      var dx = (Math.sin(y*.09-time*1.25)*1.6+Math.sin(y*.16-time*2.1)*1.1+Math.sin(y*.433+time*.93)*.45)*(2.6+depth*6.5)*strength;
      var dy = Math.sin(y*.21-time*1.6)*(.8+depth*2.2)*strength;
      ctx.drawImage(image,0,y+dy,W,step+1,dx,y,W,step+1);
    }
    ctx.restore();
    // Small rigid bends preserve the hand-painted texture on devices without WebGL.
    PLANTS.forEach(function (plant) {
      var angle = (Math.sin(time*.49+plant.phase)*.008+Math.sin(time*.91+plant.phase)*.003+Math.sin(time*3.1+plant.phase)*.0015)*plant.gain*strength;
      ctx.save(); trace(ctx,plant.polygon); ctx.clip();
      ctx.translate(plant.pivot[0],plant.pivot[1]); ctx.rotate(angle); ctx.translate(-plant.pivot[0],-plant.pivot[1]);
      ctx.drawImage(image,0,0,W,H); ctx.restore();
    });
  };
  window.GanchScene = Scene;

  /* Life on top of the painting: rose petals drifting on the pool, petals and leaves the breeze
     carries down from the pomegranate tree and the rose bushes (some land and float), and sun glints. */
  function inside(poly, x, y) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  var SOURCES = [ // where the breeze picks things up: [x0, y0, x1, y1, kind]
    [10, 420, 300, 760, "leaf"], [20, 430, 290, 700, "petal"], [600, 880, 760, 1000, "petal"], [0, 1210, 200, 1420, "petal"]
  ];
  function Life(canvas, lite) {
    this.canvas = canvas; this.ctx = canvas.getContext("2d"); this.lite = lite;
    this.floaters = []; this.fallers = []; this.glints = []; this.t = 0; this.nextFall = 1.5;
  }
  Life.prototype.resize = function () {
    var box = this.canvas.parentElement, ratio = Math.min(window.devicePixelRatio || 1, this.lite() ? 1 : 1.5);
    this.w = box.clientWidth || 390; this.h = box.clientHeight || 844;
    this.canvas.width = Math.round(this.w * ratio); this.canvas.height = Math.round(this.h * ratio);
    this.s = Math.max(this.w / W, this.h / H); this.ox = (this.w - W * this.s) / 2;
    this.ctx.setTransform(ratio * this.s, 0, 0, ratio * this.s, ratio * this.ox, 0);   // draw in painting pixels
  };
  Life.prototype.depth = function (y) { return Math.max(0, Math.min(1, (y - 1136) / 370)); };
  Life.prototype.addFloater = function (x, y) {
    this.floaters.push({ x: x, y: y, vx: -3 - Math.random() * 5, vy: .6 + Math.random() * 1.2, r: Math.random() * 6.28, vr: (Math.random() - .5) * .25, bob: Math.random() * 6.28, hue: Math.random() });
  };
  Life.prototype.seed = function () {
    var want = this.lite() ? 4 : 8, tries = 0;
    while (this.floaters.length < want && tries++ < 400) {
      var x = 120 + Math.random() * 640, y = 1150 + Math.random() * 330;
      if (inside(WATER, x, y)) this.addFloater(x, y);
    }
    for (var i = 0; i < (this.lite() ? 5 : 12); i++) this.glints.push({ x: 0, y: 0, life: 0, age: 1 + Math.random() });
  };
  Life.prototype.spawnFaller = function () {
    var src = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    this.fallers.push({ x: src[0] + Math.random() * (src[2] - src[0]), y: src[1] + Math.random() * (src[3] - src[1]), vx: 14 + Math.random() * 18, vy: 18 + Math.random() * 14,
      r: Math.random() * 6.28, spin: (Math.random() - .5) * 2.4, flip: Math.random() * 6.28, kind: src[4], age: 0, sway: .8 + Math.random() * .8, size: src[4] === "leaf" ? 1.1 + Math.random() * .5 : .9 + Math.random() * .4 });
  };
  Life.prototype.petal = function (g, size, hue, alpha, squash) {
    var c1 = hue > .5 ? "rgba(246,170,176," + alpha + ")" : "rgba(240,150,160," + alpha + ")", c2 = "rgba(206,96,112," + alpha + ")";
    var gr = g.createRadialGradient(-2 * size, -2 * size, 0, 0, 0, 10 * size); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.beginPath();
    g.moveTo(0, -8 * size * squash); g.bezierCurveTo(7 * size, -7 * size * squash, 8 * size, 5 * size * squash, 0, 8 * size * squash);
    g.bezierCurveTo(-8 * size, 5 * size * squash, -7 * size, -7 * size * squash, 0, -8 * size * squash); g.fill();
  };
  Life.prototype.leaf = function (g, size, alpha, squash) {
    g.fillStyle = "rgba(118,140,78," + alpha + ")"; g.beginPath();
    g.moveTo(-10 * size, 0); g.quadraticCurveTo(0, -6 * size * squash, 11 * size, 0); g.quadraticCurveTo(0, 6 * size * squash, -10 * size, 0); g.fill();
    g.strokeStyle = "rgba(80,96,52," + alpha * .8 + ")"; g.lineWidth = .8; g.beginPath(); g.moveTo(-9 * size, 0); g.lineTo(10 * size, 0); g.stroke();
  };
  Life.prototype.frame = function (dt, wind) {
    var g = this.ctx, self = this; this.t += dt;
    if (!this.floaters.length) this.seed();
    g.clearRect(0, 0, W, H);
    // sun glints twinkle on the far half of the pool, where the sky is reflected
    this.glints.forEach(function (p) {
      p.age += dt;
      if (p.age > p.life) { var tries = 0; do { p.x = 200 + Math.random() * 560; p.y = 1150 + Math.random() * 200; } while (!inside(WATER, p.x, p.y) && tries++ < 30); p.age = 0; p.life = .6 + Math.random() * 1.2; }
      var a = Math.sin(Math.PI * Math.min(1, p.age / p.life)), k = 1 - self.depth(p.y) * .5;
      g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = a * .55;
      g.fillStyle = "#fff6dc"; g.beginPath(); g.ellipse(p.x, p.y, 7 * k, 1.1 * k, 0, 0, 6.29); g.fill(); g.restore();
    });
    // petals floating on the water: they drift with the current, bob, and turn slowly
    this.floaters.forEach(function (p) {
      p.x += (p.vx + wind * 4) * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.bob += dt * 1.6;
      if (!inside(WATER, p.x, p.y)) { var tries = 0; do { p.x = 600 + Math.random() * 170; p.y = 1150 + Math.random() * 280; } while (!inside(WATER, p.x, p.y) && tries++ < 40); }
      var d = self.depth(p.y), size = .55 + d * .6, squash = .38 + d * .15;
      g.save(); g.translate(p.x, p.y + Math.sin(p.bob) * 1.2);
      g.fillStyle = "rgba(40,70,70,.18)"; g.beginPath(); g.ellipse(2, 3, 8 * size, 3 * size, 0, 0, 6.29); g.fill();   // its soft shadow on the water
      g.rotate(p.r); self.petal(g, size, p.hue, .92, squash); g.restore();
    });
    // the breeze carries petals and leaves down from the trees
    this.nextFall -= dt;
    if (this.nextFall <= 0 && this.fallers.length < (this.lite() ? 3 : 8)) { this.spawnFaller(); this.nextFall = (this.lite() ? 3.5 : 1.6) + Math.random() * 1.8; }
    for (var i = this.fallers.length - 1; i >= 0; i--) {
      var f = this.fallers[i]; f.age += dt;
      f.vx += (wind * 22 - f.vx * .4) * dt; f.vy = 20 + Math.sin(f.age * f.sway * 2.2) * 9;
      f.x += (f.vx + Math.sin(f.age * f.sway * 3) * 16) * dt; f.y += f.vy * dt; f.r += f.spin * dt; f.flip += dt * 3.2;
      if (f.kind === "petal" && f.y > 1150 && inside(WATER, f.x, f.y) && Math.random() < .5) { this.addFloater(f.x, f.y); this.fallers.splice(i, 1); if (this.floaters.length > (this.lite() ? 6 : 12)) this.floaters.shift(); continue; }
      if (f.y > H + 20 || f.x > W + 30 || f.age > 40) { this.fallers.splice(i, 1); continue; }
      var a = Math.min(1, f.age * 1.5);
      g.save(); g.translate(f.x, f.y); g.rotate(f.r);
      var squash = Math.abs(Math.cos(f.flip)) * .8 + .2;
      if (f.kind === "leaf") this.leaf(g, f.size, a * .95, squash); else this.petal(g, f.size, .7, a * .95, squash);
      g.restore();
    }
  };
  window.GanchLife = Life;
})();
