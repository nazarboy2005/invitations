(function () {
  "use strict";
  var intro = document.getElementById("intro");
  var button = document.getElementById("open-invitation");
  var hero = document.getElementById("hero");
  var sceneCanvas = document.querySelector(".intro__canvas");
  if (!intro || !button || !hero) return;

  var opening = false, finishTimer = 0, renderer = null, scene = null, camera = null, object = null, particles = null, raf = 0, visible = true;
  var reduced = window.Marhamat && window.Marhamat.reducedMotion;

  function disposeScene() {
    if (raf) cancelAnimationFrame(raf);
    if (scene) scene.traverse(function (node) {
      if (node.geometry && node.geometry.dispose) node.geometry.dispose();
      if (node.material) (Array.isArray(node.material) ? node.material : [node.material]).forEach(function (material) {
        if (material.map && material.map.dispose) material.map.dispose();
        if (material.dispose) material.dispose();
      });
    });
    if (scene && scene.environment && scene.environment.dispose) scene.environment.dispose();
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      renderer = null;
    }
    scene = camera = object = particles = null;
    if (sceneCanvas) sceneCanvas.style.opacity = "0";
  }

  function finish() {
    window.clearTimeout(finishTimer);
    if (sceneCanvas) {
      var artHost = hero.querySelector(".hero__art") || hero;
      artHost.insertBefore(sceneCanvas, artHost.firstChild);
      if (renderer) hero.classList.add("has-3d");
      sceneCanvas.classList.add("is-hero-canvas");
      sceneCanvas.style.position = "absolute";
      sceneCanvas.style.inset = "0";
      sceneCanvas.style.width = "100%";
      sceneCanvas.style.height = "100%";
      sceneCanvas.style.zIndex = "1";
      sceneCanvas.style.opacity = renderer ? ".72" : "0";
      if (renderer) resizeScene();
    }
    document.documentElement.classList.remove("is-locked");
    document.body.classList.add("is-open");
    intro.setAttribute("aria-hidden", "true");
    intro.style.visibility = "hidden";
    hero.scrollIntoView({ block: "start", behavior: "auto" });
  }

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    if (opening) { finish(); return; }
    opening = true;
    if (window.Marhamat && typeof window.Marhamat.open === "function") window.Marhamat.open();
    document.body.classList.add("is-opening");
    intro.classList.add("is-opening");
    finishTimer = window.setTimeout(finish, reduced ? 0 : (window.Marhamat && window.Marhamat.tier === "lite" ? 850 : 1500));
  });
  intro.addEventListener("click", function () { if (opening) finish(); });

  function resizeScene() {
    if (!renderer || !camera || !sceneCanvas) return;
    var host = sceneCanvas.parentElement;
    var rect = host.getBoundingClientRect();
    var w = Math.max(1, rect.width), h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (object) object.position.y = sceneCanvas.classList.contains("is-hero-canvas") ? .1 : 0;
  }

  function startRenderLoop() {
    if (!renderer || raf || !visible || document.hidden) return;
    function draw() {
      raf = 0;
      if (!renderer || !visible || document.hidden) return;
      if (object) object.rotation.y += (object.userData.targetY - object.rotation.y) * .045;
      if (particles) {
        var coords = particles.geometry.attributes.position.array;
        for (var i = 1; i < coords.length; i += 3) { coords[i] += .006; if (coords[i] > 2.7) coords[i] = -2.7; }
        particles.geometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
  }

  function initializeThree() {
    if (!sceneCanvas || !window.THREE || !window.Marhamat || window.Marhamat.tier !== "full" || reduced) return;
    var THREE = window.THREE;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas, alpha: true, antialias: false, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(35, 1, .1, 40);
      camera.position.set(0, .1, 8);
      scene.add(new THREE.HemisphereLight(0xcad9ff, 0x10131a, 2.1));
      var key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(-3, 5, 6); scene.add(key);
      var blue = new THREE.PointLight(0x4f7cff, 14, 12); blue.position.set(3, 0, 3); scene.add(blue);
      if (THREE.RoomEnvironment && THREE.PMREMGenerator) {
        var pmrem = new THREE.PMREMGenerator(renderer);
        var env = pmrem.fromScene(new THREE.RoomEnvironment(), .04).texture;
        scene.environment = env;
        pmrem.dispose();
      }
      var shape = THREE.RoundedBoxGeometry ? new THREE.RoundedBoxGeometry(1.15, 3.6, .28, 4, .08) : new THREE.BoxGeometry(1.15, 3.6, .28, 2, 2, 1);
      var glass = new THREE.MeshPhysicalMaterial({ color: 0xeaf2ff, metalness: .04, roughness: .12, transmission: .94, thickness: 1.2, ior: 1.32, clearcoat: 1, clearcoatRoughness: .08, envMapIntensity: 1.4 });
      object = new THREE.Mesh(shape, glass);
      object.position.y = -.1;
      object.userData.targetY = -.18;
      scene.add(object);
      var edge = new THREE.Mesh(new THREE.EdgesGeometry(shape), new THREE.LineBasicMaterial({ color: 0xbdd0ff, transparent: true, opacity: .58 }));
      object.add(edge);
      var points = new THREE.BufferGeometry();
      var positions = new Float32Array(54 * 3);
      for (var i = 0; i < positions.length; i += 3) { positions[i] = (Math.random() - .5) * 4; positions[i + 1] = (Math.random() - .5) * 5; positions[i + 2] = .8 + Math.random() * 1.3; }
      points.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particles = new THREE.Points(points, new THREE.PointsMaterial({ color: 0x8cacff, size: .025, transparent: true, opacity: .7 }));
      scene.add(particles);
      if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        [".section--letter", ".section--date", ".section--program", ".section--venue", ".section--gallery", ".section--rsvp"].forEach(function (selector, index) {
          ScrollTrigger.create({ trigger: selector, start: "top bottom", end: "bottom top", scrub: .8, onUpdate: function (self) {
            if (!object) return;
            object.userData.targetY = (index % 2 ? 1 : -1) * (.12 + self.progress * .42);
            object.rotation.x = (index % 2 ? -1 : 1) * self.progress * .08;
          } });
        });
      }
      sceneCanvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); disposeScene(); }, { once: true });
      sceneCanvas.addEventListener("webglcontextrestored", function () { renderer = null; initializeThree(); }, { once: true });
      resizeScene();
      sceneCanvas.style.opacity = ".8";
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; if (visible) startRenderLoop(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } }).observe(sceneCanvas);
      window.addEventListener("resize", resizeScene, { passive: true });
      document.addEventListener("visibilitychange", function () { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; } else startRenderLoop(); });
      startRenderLoop();
    } catch (err) { disposeScene(); }
  }

  function loadThree() {
    if (!window.Marhamat || window.Marhamat.tier !== "full" || reduced) return;
    var script = document.createElement("script");
    script.src = "../shared/nikoh/vendor/three/three.bundle.min.js";
    script.async = true;
    script.onload = initializeThree;
    script.onerror = function () { /* The CSS poster remains the complete fallback. */ };
    document.head.appendChild(script);
  }
  if (window.requestIdleCallback) requestIdleCallback(loadThree, { timeout: 1800 }); else window.setTimeout(loadThree, 700);
  if (window.Marhamat && typeof window.Marhamat.on === "function") {
    window.Marhamat.on("tier", function (tier) { if (tier === "lite") disposeScene(); });
    window.Marhamat.on("rsvp", function (answer) {
      if (!answer || answer.status !== "yes" || reduced) return;
      var done = document.querySelector("[data-rsvp-done]");
      if (done && done.animate) done.animate([{ transform: "scale(.985)", opacity: .7 }, { transform: "scale(1)", opacity: 1 }], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }

  function motionSetup() {
    if (window.Marhamat && (window.Marhamat.reducedMotion || window.Marhamat.tier === "lite")) {
      document.documentElement.dataset.tier = "lite";
    }
    document.querySelectorAll("[data-section]").forEach(function (section) {
      if (section.id === "hero" || section.id === "footer") return;
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { section.classList.add("is-visible"); if (section.id === "dresscode") section.classList.add("dc-in"); }
      }, { threshold: .2 }).observe(section);
    });
    document.querySelectorAll(".program__item").forEach(function (item, index) {
      var badge = item.querySelector(".program__index"); if (badge) badge.textContent = String(index + 1).padStart(2, "0");
    });
    var rail = document.querySelector(".agenda__rail i"), marker = document.querySelector(".agenda__rail b");
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      if (rail) gsap.to(rail, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".agenda", start: "top 72%", end: "bottom 48%", scrub: .7 } });
      if (marker) gsap.to(marker, { y: function () { return Math.max(0, document.querySelector(".agenda").clientHeight - 9); }, ease: "none", scrollTrigger: { trigger: ".agenda", start: "top 72%", end: "bottom 48%", scrub: .7 } });
      if (object) {
        [".section--letter", ".section--date", ".section--program", ".section--venue", ".section--gallery", ".section--rsvp"].forEach(function (selector, index) {
          ScrollTrigger.create({ trigger: selector, start: "top bottom", end: "bottom top", scrub: .8, onUpdate: function (self) { if (object) object.userData.targetY = (index % 2 ? 1 : -1) * (.18 + self.progress * .35); } });
        });
      }
      gsap.to(".hero__grid", { y: 110, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .8 } });
      gsap.to(".hero__orb", { y: 46, scale: 1.16, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .8 } });
      gsap.to(".venue__map svg", { x: -14, ease: "none", scrollTrigger: { trigger: ".section--venue", start: "top bottom", end: "bottom top", scrub: .7 } });
    } else {
      var ticking = false;
      window.addEventListener("scroll", function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { if (rail) { var box = document.querySelector(".agenda").getBoundingClientRect(); var progress = Math.max(0, Math.min(1, (innerHeight * .72 - box.top) / box.height)); rail.style.transform = "scaleY(" + progress + ")"; if (marker) marker.style.transform = "translateY(" + (Math.max(0, box.height - 9) * progress) + "px)"; } ticking = false; }); }, { passive: true });
    }
  }
  if (window.Marhamat && typeof window.Marhamat.on === "function") window.Marhamat.on("ready", motionSetup); else document.addEventListener("DOMContentLoaded", motionSetup, { once: true });
})();
