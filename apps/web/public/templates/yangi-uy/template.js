(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = () => !!(window.Marhamat && window.Marhamat.reducedMotion);
  let renderer, scene, camera, houseRoot, doorPivot, windows = [], warmLight;
  let raf = 0, introVisible = true, heroVisible = false, canvasVisible = true, opened = false, opening = false;
  let particles = [], ambient, ambientCtx, lastTime = 0, tick = 0, openTl;
  const intro = $("#intro"), hero = $("#hero"), canvas = $("#house-canvas");
  const liveObjects = { cameraYaw: 0, cameraZoom: 1, houseLift: 0, door: 0, lights: 0 };

  function mat(THREE, color, roughness = .86, extra = {}) { return new THREE.MeshStandardMaterial({ color, roughness, ...extra }); }
  function box(THREE, parent, size, color, position, rotation = [0, 0, 0], material = null) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material || mat(THREE, color));
    mesh.position.set(...position); mesh.rotation.set(...rotation); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function makeHouse(THREE) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
    camera.position.set(5.1, 4.1, 7.2); camera.lookAt(0, 1.15, 0);
    const hemi = new THREE.HemisphereLight(0xffefd3, 0x738159, 2.15); scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffe2ad, 3.1); sun.position.set(-3, 7, 5); sun.castShadow = true; sun.shadow.mapSize.set(512, 512); sun.shadow.camera.left = -4; sun.shadow.camera.right = 4; sun.shadow.camera.top = 4; sun.shadow.camera.bottom = -4; sun.shadow.bias = -.001; scene.add(sun);
    warmLight = new THREE.PointLight(0xffc862, 0, 6); warmLight.position.set(0, 1.8, 1.5); scene.add(warmLight);
    houseRoot = new THREE.Group(); scene.add(houseRoot);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(6.4, 48), mat(THREE, 0xa4bb7c)); ground.rotation.x = -Math.PI / 2; ground.position.y = -.15; scene.add(ground);
    // Build the plaster walls from separate blocks so Act 1 can stack the home piece by piece.
    const wallMat = mat(THREE, 0xf1d3ae), sideMat = mat(THREE, 0xdca77d), brickSize = [.58, .42, .74];
    const blocks = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const x = -.87 + col * .58 + (row % 2 ? .05 : 0), y = .27 + row * .42;
        const block = box(THREE, houseRoot, brickSize, row === 0 ? sideMat.color : wallMat.color, [x, y, .14], [0, 0, 0], row === 0 ? sideMat : wallMat);
        block.userData.homeY = y; block.position.y = y - 1.9 - (3 - row) * .1; block.scale.y = .96; blocks.push(block);
      }
    }
    // Return wall and sunlit side create the Uzbek courtyard-house volume.
    box(THREE, houseRoot, [2.32, 1.25, .12], 0xd69b70, [0, .89, -.57]);
    box(THREE, houseRoot, [.12, 1.25, 1.45], 0xe1b28a, [-1.17, .89, -.19]);
    // Teal pitched roof, split into two broad roof planes with timber fascia.
    box(THREE, houseRoot, [1.42, .13, 1.86], 0x2f6f73, [-.38, 1.76, .03], [0, 0, -.57]);
    box(THREE, houseRoot, [1.42, .13, 1.86], 0x397f7b, [.38, 1.76, .03], [0, 0, .57]);
    box(THREE, houseRoot, [.16, .12, 1.93], 0x245a5e, [0, 2.24, .03], [0, 0, 0]);
    const door = new THREE.Group(); door.position.set(-.42, .03, .76); houseRoot.add(door); doorPivot = door;
    box(THREE, door, [.38, .78, .08], 0xa95237, [.19, .39, 0]);
    box(THREE, door, [.035, .79, .1], 0xf2bd78, [.19, .39, .054]);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), mat(THREE, 0xffd27a, .35, { emissive: 0x7c4a17 })); knob.position.set(.32, .37, .11); door.add(knob);
    const glass = mat(THREE, 0x75533b, .26, { emissive: 0x000000, emissiveIntensity: 0 });
    windows = [];
    [[-.82, 1.02, .75], [.42, 1.02, .75], [-.55, 1.02, -.66], [.55, 1.02, -.66]].forEach(([x, y, z]) => {
      const frame = box(THREE, houseRoot, [.36, .39, .08], 0x936042, [x, y, z]);
      const pane = box(THREE, houseRoot, [.27, .3, .04], 0x382f27, [x, y, z + (z > 0 ? .055 : -.055)], [0, 0, 0], glass.clone());
      box(THREE, houseRoot, [.035, .33, .05], 0xd0a478, [x, y, z + (z > 0 ? .09 : -.09)]);
      box(THREE, houseRoot, [.31, .035, .05], 0xd0a478, [x, y, z + (z > 0 ? .09 : -.09)]);
      pane.userData.frame = frame; windows.push(pane);
    });
    // Garden furniture: the ishkom, vine and small clay tandir are separate readable forms.
    for (const x of [-2.05, -1.46]) box(THREE, houseRoot, [.09, 1.34, .09], 0x8d6541, [x, .58, -.2]);
    for (const y of [.83, 1.13]) box(THREE, houseRoot, [.72, .055, .08], 0x9e7148, [-1.75, y, -.2]);
    const vineMat = mat(THREE, 0x5d8c4e); for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(.105, 7, 6), vineMat); leaf.scale.set(1.35, .62, .55); leaf.position.set(-2.03 + (i % 3) * .23, .46 + Math.floor(i / 3) * .25, .05); houseRoot.add(leaf);
    }
    const tandir = new THREE.Mesh(new THREE.CylinderGeometry(.19, .25, .42, 9, 1), mat(THREE, 0xb95d3d)); tandir.position.set(1.52, .1, .65); houseRoot.add(tandir);
    const mouth = new THREE.Mesh(new THREE.CircleGeometry(.12, 10), mat(THREE, 0x462f28)); mouth.position.set(1.52, .22, .88); houseRoot.add(mouth);
    // Low garden walls and stepping-stone path.
    for (let i = 0; i < 4; i++) { const stone = new THREE.Mesh(new THREE.CylinderGeometry(.21, .24, .05, 6), mat(THREE, i % 2 ? 0xdcc8a7 : 0xe9d6b7)); stone.rotation.x = -Math.PI / 2; stone.position.set(.28 + i * .31, -.08, 1.55 + i * .23); houseRoot.add(stone); }
    return blocks;
  }

  function resizeScene() {
    if (!renderer || !canvas) return;
    const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr); renderer.setSize(rect.width, rect.height, false);
    if (camera) { camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); }
  }
  function updateHouse() {
    if (!houseRoot || !camera) return;
    houseRoot.rotation.y += (liveObjects.cameraYaw - houseRoot.rotation.y) * .085;
    houseRoot.position.y += (liveObjects.houseLift - houseRoot.position.y) * .09;
    camera.position.z += (7.2 / liveObjects.cameraZoom - camera.position.z) * .08;
    camera.lookAt(0, 1.05, 0);
    if (doorPivot) doorPivot.rotation.y += (liveObjects.door - doorPivot.rotation.y) * .12;
    windows.forEach((pane, index) => { const material = pane.material; material.emissive.setHex(0xffd27a); const target = Math.max(0, Math.min(1, liveObjects.lights * windows.length - index)); material.emissiveIntensity += (target - material.emissiveIntensity) * .09; });
    if (warmLight) warmLight.intensity += (liveObjects.lights * 2.4 - warmLight.intensity) * .06;
  }
  function seedDust() {
    const count = reduced() ? 0 : window.Marhamat?.tier === "lite" ? 9 : 48;
    particles = Array.from({ length: count }, (_, i) => ({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.3, drift: .00003 + Math.random() * .00008, phase: Math.random() * 6.28, alpha: .13 + Math.random() * .3, gold: i % 3 === 0 }));
  }
  function resizeAmbient() {
    if (!ambient || !ambientCtx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, window.Marhamat?.tier === "lite" ? 1.5 : 2);
    ambient.width = Math.round(innerWidth * dpr); ambient.height = Math.round(innerHeight * dpr);
    ambient.style.width = innerWidth + "px"; ambient.style.height = innerHeight + "px"; ambientCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function drawDust(now) {
    if (!ambientCtx) return;
    ambientCtx.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach(p => {
      p.y -= p.drift * (document.hidden ? 0 : 1); if (p.y < -.04) p.y = 1.04;
      const x = (p.x + Math.sin(now * .0003 + p.phase) * .009) * innerWidth, y = p.y * innerHeight;
      ambientCtx.globalAlpha = p.alpha; ambientCtx.fillStyle = p.gold ? "#d9a74f" : "#fff8e7";
      ambientCtx.beginPath(); ambientCtx.arc(x, y, p.r, 0, Math.PI * 2); ambientCtx.fill();
    }); ambientCtx.globalAlpha = 1;
  }
  function loop(now) {
    raf = 0; if (document.hidden || (!introVisible && !heroVisible && !opened)) return;
    tick++; if (renderer && scene && camera && canvasVisible) { updateHouse(); renderer.render(scene, camera); }
    if (opened) drawDust(now);
    if (renderer && opened && heroVisible && tick % 60 === 0 && now - lastTime > 0) {
      const fps = 60000 / (now - lastTime); if (fps < 45) switchToFallback(); lastTime = now;
    } else if (tick % 60 === 0) lastTime = now;
    raf = requestAnimationFrame(loop);
  }
  function startLoop() { if (!raf && !document.hidden) raf = requestAnimationFrame(loop); }
  function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function switchToFallback() {
    if (scene) {
      const geometries = new Set(), materials = new Set();
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (Array.isArray(object.material)) object.material.forEach(material => materials.add(material));
        else if (object.material) materials.add(object.material);
      });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
    }
    if (renderer) { renderer.dispose(); renderer = null; } scene = null; camera = null; houseRoot = null; windows = [];
    canvas?.classList.remove("is-ready"); intro?.classList.remove("has-webgl"); document.documentElement.classList.add("is-fallback");
  }

  function buildThree() {
    if (window.Marhamat?.tier !== "full" || reduced() || !canvas || !("WebGLRenderingContext" in window)) return;
    const script = document.createElement("script"); script.src = "vendor/three/three.bundle.min.js";
    script.onload = () => {
      try {
        const THREE = window.THREE; if (!THREE) return;
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); renderer.setClearColor(0x000000, 0); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const blocks = makeHouse(THREE); resizeScene(); canvas.classList.add("is-ready"); intro?.classList.add("has-webgl");
        blocks.forEach((block, i) => {
          if (!window.gsap) { block.position.y = block.userData.homeY; return; }
          gsap.to(block.position, { y: block.userData.homeY, duration: .6, delay: .36 + i * .055, ease: "back.out(1.25)", onStart() { block.visible = true; } });
        });
        const allHouse = houseRoot.children; for (let i = 0; i < allHouse.length; i++) { const item = allHouse[i]; if (!blocks.includes(item) && item.position.y > .4 && item.position.y < 2.3) { const y = item.position.y; item.position.y = y - .8; if (window.gsap) gsap.to(item.position, { y, duration: .62, delay: 1.5 + i * .025, ease: "back.out(1.2)" }); } }
        canvas.addEventListener("webglcontextlost", event => { event.preventDefault(); switchToFallback(); }, { once: true }); startLoop();
      } catch (_) { switchToFallback(); }
    };
    script.onerror = switchToFallback; document.head.appendChild(script);
  }

  function moveCanvasToHero() {
    if (canvas && hero && canvas.parentElement !== hero) hero.appendChild(canvas);
    resizeScene(); introVisible = false; heroVisible = true; canvasVisible = true; startLoop();
  }
  function finishOpen() {
    if (opened) return; opened = true; opening = false; introVisible = false; heroVisible = true;
    if (openTl) openTl.progress(1); document.documentElement.classList.remove("is-locked"); document.body.classList.add("is-open"); intro?.setAttribute("aria-hidden", "true");
    moveCanvasToHero(); hero?.scrollIntoView({ block: "start", behavior: "auto" });
    if (ambient) ambient.classList.add("is-visible"); startLoop();
  }
  function beginOpen() {
    if (opened) return; if (opening) { finishOpen(); return; } opening = true;
    window.Marhamat?.open?.(); document.body.classList.add("is-opening");
    liveObjects.door = -1.12; liveObjects.lights = 1;
    if (!window.gsap || reduced()) { window.setTimeout(finishOpen, reduced() ? 0 : 500); return; }
    const lite = window.Marhamat?.tier === "lite", duration = lite ? 1.1 : 2.35;
    openTl = gsap.timeline({ onComplete: finishOpen });
    openTl.to(liveObjects, { cameraZoom: 1.32, cameraYaw: 1.24, duration: duration * .88, ease: "power2.inOut" }, 0)
      .to(".intro__copy", { y: -30, autoAlpha: 0, duration: .48, ease: "power2.in" }, .08)
      .to(".intro__act-three", { autoAlpha: 1, duration: .35, ease: "power2.out" }, duration * .48)
      .to(".intro__act-three i", { rotation: 70, duration: .5, ease: "power2.inOut" }, duration * .58)
      .to({}, { duration: .28, onStart: moveCanvasToHero }, duration * .72);
  }
  function setInteractions() {
    $("#open-invitation")?.addEventListener("click", event => { event.stopPropagation(); beginOpen(); });
    intro?.addEventListener("click", () => { if (opening) finishOpen(); });
    if (window.Marhamat?.on) {
      window.Marhamat.on("rsvp", answer => {
        if (answer?.status !== "yes" || reduced()) return;
        const warmth = $(".rsvp__warmth"); warmth?.animate?.([{ transform: "scale(.5) rotate(-30deg)", opacity: .2 }, { transform: "scale(1.25) rotate(12deg)", opacity: 1 }, { transform: "scale(1) rotate(0)" }], { duration: 840, easing: "cubic-bezier(.18,.74,.25,1)" });
        const cap = window.Marhamat?.tier === "lite" ? 15 : 60, burst = window.Marhamat?.tier === "lite" ? 6 : 12;
        if (particles.length + burst > cap) particles.splice(0, particles.length + burst - cap);
        for (let i = 0; i < burst && particles.length < cap; i++) particles.push({ x: .35 + Math.random() * .3, y: .8, r: 2 + Math.random() * 3, drift: .00025 + Math.random() * .0002, phase: Math.random() * 6.28, alpha: .7, gold: true }); startLoop();
      });
      window.Marhamat.on("tier", () => { seedDust(); resizeAmbient(); if (window.Marhamat.tier === "lite") switchToFallback(); startLoop(); });
    }
  }
  function choreograph() {
    const sections = $$("[data-section]");
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle("is-seen", entry.isIntersecting);
      if (entry.target === hero) { heroVisible = entry.isIntersecting; if (heroVisible) { moveCanvasToHero(); startLoop(); } }
      if (entry.isIntersecting && ["date", "program"].includes(entry.target.id) && canvas && window.Marhamat?.tier === "full" && !reduced()) {
        const mount = entry.target.querySelector(".room__vignette");
        if (mount && canvas.parentElement !== mount) { mount.appendChild(canvas); canvasVisible = true; resizeScene(); }
        startLoop();
      }
      if (entry.isIntersecting && !["hero", "date", "program"].includes(entry.target.id) && canvas?.parentElement?.closest("#date,#program")) canvasVisible = false;
    }), { threshold: .12 }); sections.forEach(section => io.observe(section));
    const stageIO = new IntersectionObserver(entries => entries.forEach(e => { if (e.target === intro) introVisible = e.isIntersecting; if (e.isIntersecting) startLoop(); else if (!heroVisible && !opened) stopLoop(); }), { threshold: .08 });
    if (intro) stageIO.observe(intro); if (hero) stageIO.observe(hero);
    if (!window.gsap || !window.ScrollTrigger || reduced()) return;
    gsap.registerPlugin(ScrollTrigger);
    // Scrub 1: the house settles in its landscape while its Three.js viewpoint makes a gentle quarter-orbit.
    gsap.to(".hero__house-wrap", { yPercent: 12, scale: 1.05, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .8 } });
    gsap.to(liveObjects, { cameraYaw: .55, cameraZoom: 1.05, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .7 } });
    // Scrub 2: calendar slips forward like a page in a wall planner.
    gsap.to(".calendar-frame", { rotateX: 5, y: -12, ease: "none", transformOrigin: "center top", scrollTrigger: { trigger: "#date", start: "top bottom", end: "center center", scrub: .8 } });
    // Scrub 3: the kitchen timeline draws as the evening unfolds.
    gsap.fromTo(".program:before", { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#program", start: "top 78%", end: "bottom 48%", scrub: .7 } });
    // Scrub 4: a second Three.js beat lowers the living house into its garden; room accents warm as it arrives.
    gsap.to(liveObjects, { houseLift: -.28, lights: 1, ease: "none", scrollTrigger: { trigger: "#program", start: "top bottom", end: "bottom center", scrub: .9 } });
    // Scrub 5: the illustrated entrance door opens into the address card.
    gsap.to(".door__frame", { rotateY: -10, x: -5, ease: "none", transformOrigin: "left center", scrollTrigger: { trigger: "#venue", start: "top bottom", end: "center center", scrub: .8 } });
    // Scrub 6: garden trellis and gallery cards rise at different depths.
    gsap.to(".garden-scenery__trellis", { y: -18, rotateZ: -4, ease: "none", scrollTrigger: { trigger: "#gallery", start: "top bottom", end: "center center", scrub: .8 } });
    gsap.fromTo(".gallery__item", { rotateY: 5, y: 18 }, { rotateY: 0, y: 0, stagger: .08, ease: "none", scrollTrigger: { trigger: "#gallery", start: "top bottom", end: "center center", scrub: .7 } });
    // Scrub 7: the three RSVP doors ease apart to invite an answer.
    gsap.to(".rsvp-doors i", { rotateY: 10, stagger: .06, ease: "none", scrollTrigger: { trigger: "#rsvp", start: "top bottom", end: "center center", scrub: .7 } });
    gsap.to(".gift-box", { rotateY: 14, rotateX: -8, y: -8, ease: "none", scrollTrigger: { trigger: "#toyona", start: "top bottom", end: "center center", scrub: .8 } });
  }
  function init() {
    ambient = document.createElement("canvas"); ambient.className = "ambient-canvas"; ambient.setAttribute("aria-hidden", "true"); document.body.appendChild(ambient); ambientCtx = ambient.getContext("2d"); seedDust(); resizeAmbient();
    setInteractions(); choreograph();
    if (window.gsap && !reduced()) {
      const pace = window.Marhamat?.tier === "lite" ? .78 : 1;
      gsap.set(".intro__greeting,.intro__kicker,.intro__title,.intro__hosts,.intro__date,.open-button", { autoAlpha: 0, y: 14 });
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(".intro__greeting", { autoAlpha: 1, y: 0, duration: .58 * pace }, .12)
        .to(".intro__kicker", { autoAlpha: 1, y: 0, duration: .48 * pace }, .48 * pace)
        .to(".intro__title", { autoAlpha: 1, y: 0, duration: .65 * pace }, .83 * pace)
        .to(".intro__hosts", { autoAlpha: 1, y: 0, duration: .5 * pace }, 1.22 * pace)
        .to(".intro__date", { autoAlpha: 1, y: 0, duration: .44 * pace }, 1.58 * pace)
        .to(".open-button", { autoAlpha: 1, y: 0, duration: .55 * pace }, 1.98 * pace);
      const entrances = [
        { y: 23, rotateX: -3 }, { y: 18, scale: .96 }, { y: 25, rotateY: -5 },
        { y: 18, rotateX: 4 }, { y: 22, scale: .97 }, { y: 16, rotateY: 4 },
        { y: 26, rotateX: -4 }, { y: 18, scale: .95 }, { y: 23, rotateY: 5 },
        { y: 18, rotateX: 3 }, { y: 21, scale: .97 }
      ];
      gsap.utils.toArray(".section").forEach((section, index) => {
        const entrance = entrances[index % entrances.length];
        gsap.fromTo(section.querySelectorAll(".eyebrow,.section__title,.section__note,.hosts-card,.calendar-frame,.program__item,.venue-card,.dresscode,.gallery__item,.rsvp__fields,.wishes__item,.gift,.contacts li"),
          { ...entrance, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, rotateX: 0, duration: .72, stagger: .075, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 76%", once: true } });
      });
      gsap.fromTo(".hero__copy > *", { y: 19, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .68, stagger: .09, ease: "power3.out", scrollTrigger: { trigger: hero, start: "top 72%", once: true } });
    }
    addEventListener("resize", () => { resizeScene(); resizeAmbient(); }, { passive: true });
    document.addEventListener("visibilitychange", () => { if (document.hidden) stopLoop(); else startLoop(); });
    if (window.Marhamat?.tier === "full" && !reduced()) {
      const later = window.requestIdleCallback || (fn => setTimeout(fn, 220)); later(buildThree, { timeout: 1100 });
    }
    if (reduced() || window.Marhamat?.tier === "lite") document.documentElement.classList.add("is-fallback");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
