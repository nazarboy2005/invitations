(() => {
  "use strict";

  const root = document.querySelector('[data-chorlove-template="modern-floral"]');
  if (!root) return;

  const registered = new WeakSet();
  const running = new WeakMap();
  const controlAnimations = new WeakMap();
  let observer;
  let initialized = false;
  let reduced = false;
  const flowerDelays = [0, 0.15, 0, 0.15, 0, 0.1, 0, 0, 0];
  const motionReduced = (payload) => Boolean(payload?.reducedMotion) ||
    Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  function targetFor(node) {
    const inline = node.getAttribute("style") || "";
    const transform = node.style.transform || "";
    const target = { opacity: 1 };
    if (inline.includes("filter:blur(8px)")) target.filter = "blur(0px)";
    if (node.matches("section:nth-of-type(2) > div.absolute.inset-0")) target.opacity = 0.03;
    if (transform.includes("translateX(-20px)")) target.transform = "translateX(0px)";
    else if (transform.includes("translateY(5px)")) target.transform = "translateY(0px)";
    else if (transform.includes("translateY(-24px)")) target.transform = "translateY(0px)";
    else if (transform.includes("scale(0)")) target.transform = "scale(1)";
    else if (transform.includes("scale(0.9)")) target.transform = "scale(1)";
    else if (transform.includes("scale(0.95)")) target.transform = "scale(1)";
    else if (transform.includes("scale(0.96)")) target.transform = "scale(1)";
    else if (transform.includes("translateY(18px)")) target.transform = "translateY(0px)";
    else if (transform.includes("translateY(20px)")) target.transform = "translateY(0px)";
    else if (transform.includes("translateY(24px)")) target.transform = "translateY(0px)";
    else if (transform.includes("translateY(28px)")) target.transform = "translateY(0px) scale(1) rotate(0deg)";
    else if (transform.includes("translateY(30px)")) target.transform = "translateY(0px)";
    else if (transform.includes("translateY(32px)")) target.transform = "translateY(0px)";
    else if (transform.includes("translateY(15px)")) target.transform = "translateY(0px)";
    return target;
  }

  function configFor(node, index) {
    const inline = node.getAttribute("style") || "";
    const transform = node.style.transform || "";
    if (transform.includes("translateY(15px)")) return { duration: 600, amount: 0.2, once: false };
    if (transform.includes("translateY(-24px)")) return { duration: 900, amount: 0.35, once: true };
    if (transform.includes("translateY(18px)")) return { spring: true, delay: index * 40, amount: 0.35, once: true };
    if (transform.includes("scale(0.96)")) return { spring: true, delay: index * 50, amount: 0.35, once: true };
    if (node.matches("section:nth-of-type(2) > div.absolute.inset-0")) return { duration: 2000, amount: 0, once: false };
    if (transform.includes("scale(0)")) {
      const sectionIndex = [...root.querySelectorAll("section")].indexOf(node.closest("section"));
      if (sectionIndex === 1 && node.matches(".relative.h-16")) return { spring: true, delay: 500, amount: 0, once: false };
      if (sectionIndex === 3 && node.matches(".absolute.w-9.h-9")) return { spring: true, stiffness: 200, delay: 400, amount: 0, once: false };
      if (sectionIndex === 6 && node.matches(".flex.items-center.justify-center.gap-4")) return { spring: true, delay: 500, amount: 0, once: false };
    }
    if (transform.includes("scale(0.9)") && node.matches(".relative.aspect-square")) return { duration: 800, delay: index * 100, amount: 0, once: false };
    if (transform.includes("translateX(-20px)")) return { spring: true, delay: index * 100, amount: 0, once: false };
    if (transform.includes("scale(0.95)")) return { duration: 1200, amount: 0, once: false };
    if (inline.includes("filter:blur(8px)")) return { duration: 900, amount: 0.35, once: true };
    if (transform.includes("translateY(30px)")) {
      const sectionIndex = [...root.querySelectorAll("section")].indexOf(node.closest("section"));
      return { duration: sectionIndex === 6 ? 1500 : 1200, amount: 0, once: false };
    }
    if (transform.includes("translateY(20px)")) return { duration: 1000, amount: 0, once: false };
    if (transform.includes("translateY(28px)") || transform.includes("translateY(24px)")) return { duration: 900, amount: 0.35, once: true };
    if (transform.includes("scale(0.78)")) return { duration: 900, amount: 0.35, once: true };
    if (transform.includes("translateY(5px)")) return { spring: true, mount: true };
    return { duration: 600, amount: 0, once: false };
  }

  function springProgress(time, stiffness) {
    const mass = 1;
    const damping = 10;
    const omega = Math.sqrt(stiffness / mass);
    const decay = damping / (2 * mass);
    const frequency = Math.sqrt(Math.max(0, omega * omega - decay * decay));
    const envelope = Math.exp(-decay * time);
    const progress = 1 - envelope * (Math.cos(frequency * time) + (decay / frequency) * Math.sin(frequency * time));
    const velocity = envelope * (omega * omega / frequency) * Math.sin(frequency * time);
    return { progress, velocity };
  }

  function interpolateTransform(from, to, progress) {
    const start = [...from.matchAll(/([a-zA-Z0-9]+)\((-?[\d.]+)([a-z%]*)\)/g)];
    const end = [...to.matchAll(/([a-zA-Z0-9]+)\((-?[\d.]+)([a-z%]*)\)/g)];
    if (!start.length || start.length !== end.length || start.some((part, index) => part[1] !== end[index][1])) {
      return progress < 1 ? from : to;
    }
    return start.map((part, index) => {
      const value = Number(part[2]) + (Number(end[index][2]) - Number(part[2])) * progress;
      return `${part[1]}(${value}${part[3]})`;
    }).join(" ");
  }

  function springFrames(initial, target, stiffness = 100) {
    let duration = 0;
    for (let time = 1 / 120; time < 2.5; time += 1 / 120) {
      const state = springProgress(time, stiffness);
      if (Math.abs(1 - state.progress) < 0.01 && Math.abs(state.velocity) < 0.01) {
        duration = time;
        break;
      }
    }
    if (!duration) duration = 2.5;
    const startOpacity = Number(initial.opacity ?? 1);
    const endOpacity = Number(target.opacity ?? 1);
    const frames = [];
    const count = Math.ceil(duration * 60);
    for (let index = 0; index <= count; index += 1) {
      const time = Math.min(duration, index / 60);
      const progress = springProgress(time, stiffness).progress;
      const frame = {
        transform: interpolateTransform(initial.transform, target.transform, progress),
        offset: time / duration,
      };
      if (startOpacity !== endOpacity) frame.opacity = startOpacity + (endOpacity - startOpacity) * progress;
      frames.push(frame);
    }
    return { frames, duration };
  }

  function animateReveal(node, config) {
    if (reduced || node.hidden || !node.isConnected) return;
    running.get(node)?.cancel();
    const initial = {
      opacity: node.style.opacity || "1",
      transform: node.style.transform || "none",
    };
    if ((node.getAttribute("style") || "").includes("filter:blur(8px)")) initial.filter = "blur(8px)";
    const target = targetFor(node);
    if (config.spring) {
      const spring = springFrames(initial, target, config.stiffness || 100);
      running.set(node, node.animate(spring.frames, { duration: spring.duration * 1000, delay: config.delay || 0, easing: "linear", fill: "both" }));
      return;
    }
    running.set(node, node.animate([initial, targetFor(node)], {
      duration: config.duration,
      delay: config.delay || 0,
      easing: "ease-out",
      fill: "both",
    }));
  }

  function registerReveals() {
    const nodes = root.querySelectorAll('section [style*="opacity:0"], section [style*="scale(0)"]');
    for (const node of nodes) {
      if (registered.has(node) || node.closest("[hidden]")) continue;
      registered.add(node);
      const section = node.closest("section");
      const transform = node.style.transform || "";
      let peers = [...section.querySelectorAll(':scope [style*="opacity:0"], :scope [style*="scale(0)"]')];
      if (transform.includes("translateY(18px)") || transform.includes("scale(0.96)")) {
        peers = [...node.parentElement.querySelectorAll(':scope > div[style*="opacity:0"]')];
      } else if (transform.includes("scale(0.9)") && node.matches(".relative.aspect-square")) {
        peers = [...section.querySelectorAll(".relative.aspect-square")];
      } else if (transform.includes("translateX(-20px)")) {
        peers = [...section.querySelectorAll('a[style*="opacity:0"]')];
      }
      const index = Math.max(0, peers.indexOf(node));
      const config = configFor(node, index);
      if (transform.includes("scale(0.78)")) {
        const ornaments = [...root.querySelectorAll('section [style*="scale(0.78)"]')];
        config.delay = (flowerDelays[ornaments.indexOf(node)] || 0) * 1000;
      }
      if (section === root.querySelector("section")) {
        const group = node.closest(".space-y-4, .relative.py-4");
        if (group) {
          const groupNodes = [...group.querySelectorAll(':scope [style*="opacity:0"], :scope [style*="scale(0)"]')];
          config.delay = 2750 + (group.classList.contains("relative") ? 140 : 0) + Math.max(0, groupNodes.indexOf(node)) * 140;
          config.once = true;
        }
      }
      if (section === root.querySelectorAll("section")[1]) {
        const group = section.querySelector(".text-center.z-10.w-full.space-y-12");
        const staggered = group ? [...group.querySelectorAll('[style*="filter:blur(8px)"]')] : [];
        const staggerIndex = staggered.indexOf(node);
        if (staggerIndex >= 0) {
          config.delay = 120 + staggerIndex * 140;
          config.once = true;
        }
      }
      node.dataset.mfMotionConfig = JSON.stringify(config);
      if (config.mount) animateReveal(node, config);
      else observer.observe(node);
    }
  }

  function animateOpening() {
    const opening = root.firstElementChild;
    if (!opening || opening.dataset.mfOpeningStarted) return;
    opening.dataset.mfOpeningStarted = "true";
    if (reduced) {
      opening.hidden = true;
      return;
    }
    const [curtain, greeting] = opening.children;
    curtain?.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], {
      delay: 1450, duration: 1000, easing: "cubic-bezier(.83,0,.17,1)", fill: "forwards",
    });
    greeting?.animate([
      { opacity: 0, transform: "translateY(24px) scale(.84)", offset: 0 },
      { opacity: 1, transform: "translateY(0px) scale(1)", offset: 1 / 3 },
      { opacity: 1, transform: "translateY(0px) scale(1)", offset: 2 / 3 },
      { opacity: 0, transform: "translateY(-18px) scale(1.05)", offset: 1 },
    ], { duration: 2100, easing: "ease-out", fill: "forwards" });
    opening.animate([{ opacity: 1 }, { opacity: 0 }], {
      delay: 2250, duration: 750, easing: "ease-in-out", fill: "forwards",
    });
    window.setTimeout(() => { if (opening.isConnected) opening.hidden = true; }, 3000);
  }

  function animatePetals() {
    const layer = root.children[2];
    if (!layer || layer.dataset.mfPetalsStarted || reduced) return;
    layer.dataset.mfPetalsStarted = "true";
    [...layer.children].forEach((petal, index) => {
      // These values are the captured page's deterministic 34-petal sequence.
      const left = (37 * index) % 100;
      const delay = (index % 16) * 800;
      const duration = (12 + (index % 9) * 1.8) * 1000;
      const rotation = (53 * index) % 360;
      const drift = 8 + (index % 5) * 5;
      const rotate = (degrees) => `rotate(${degrees}deg)`;
      petal.animate([
        { top: "-10%", left: `${left}%`, transform: rotate(rotation), opacity: 0, offset: 0 },
        { top: "30%", left: `${left + drift}%`, transform: rotate(rotation + 240), opacity: 0.3, offset: 1 / 3 },
        { top: "70%", left: `${left - drift}%`, transform: rotate(rotation + 480), opacity: 0.3, offset: 2 / 3 },
        { top: "110%", left: `${left}%`, transform: rotate(rotation + 720), opacity: 0, offset: 1 },
      ], { duration, delay, iterations: Infinity, easing: "linear" });
    });
  }

  function startContinuousMotion() {
    if (reduced) return;
    root.querySelectorAll("section .w-56").forEach((flower) => {
      if (flower.dataset.mfFloatMotion) return;
      flower.dataset.mfFloatMotion = "true";
      const mirrored = flower.classList.contains("scale-x-[-1]");
      const ornament = flower.parentElement;
      const ornaments = [...root.querySelectorAll('section [style*="scale(0.78)"]')];
      const delay = flowerDelays[ornaments.indexOf(ornament)] || 0;
      flower.animate([
        { transform: "translateY(0px) rotate(0deg)" },
        { transform: `translateY(-8px) rotate(${mirrored ? -2 : 2}deg)` },
        { transform: "translateY(0px) rotate(0deg)" },
      ], { duration: (6 + delay) * 1000, iterations: Infinity, easing: "ease-in-out" });
    });
    const heart = root.querySelector("section:first-of-type .relative.py-4 > .absolute.inset-0");
    if (heart && !heart.dataset.mfLoopMotion) {
      heart.dataset.mfLoopMotion = "true";
      heart.animate([
        { transform: "scale(1) rotate(0deg)" }, { transform: "scale(1.05) rotate(5deg)" },
        { transform: "scale(1) rotate(-5deg)" }, { transform: "scale(1) rotate(0deg)" },
      ], { duration: 10000, iterations: Infinity, easing: "ease-in-out" });
    }
    const scrollCue = root.querySelector("section:first-of-type .w-4.h-7");
    if (scrollCue && !scrollCue.dataset.mfLoopMotion) {
      scrollCue.dataset.mfLoopMotion = "true";
      scrollCue.animate([{ transform: "translateY(0px)" }, { transform: "translateY(8px)" }, { transform: "translateY(0px)" }], { duration: 2000, iterations: Infinity });
    }
    const openingHalo = root.querySelector("section:first-of-type .text-center.space-y-6 > .w-12.h-12");
    if (openingHalo && !openingHalo.dataset.mfLoopMotion) {
      openingHalo.dataset.mfLoopMotion = "true";
      openingHalo.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 20000, iterations: Infinity, easing: "linear" });
    }
    const coupleHeart = root.querySelector("section:nth-of-type(2) .relative.h-16 > .z-10");
    if (coupleHeart && !coupleHeart.dataset.mfLoopMotion) {
      coupleHeart.dataset.mfLoopMotion = "true";
      coupleHeart.animate([{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 2000, iterations: Infinity, easing: "ease-in-out" });
    }
    const countdownHeart = [...root.querySelectorAll("section:nth-of-type(5) div")].find((node) =>
      node.classList.contains("text-[#FFB6C1]") && node.classList.contains("opacity-40") && node.querySelector(":scope > .lucide-heart"));
    if (countdownHeart && !countdownHeart.dataset.mfLoopMotion) {
      countdownHeart.dataset.mfLoopMotion = "true";
      countdownHeart.animate([{ transform: "scale(1)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }], { duration: 3000, iterations: Infinity });
    }
    const wishes = root.querySelector("section:nth-of-type(11) .space-y-3.py-1");
    const wishCount = Number(wishes?.dataset.mfSourceWishCount) || wishes?.children.length || 0;
    if (wishes && wishCount > 3 && !wishes.dataset.mfWishLoop) {
      wishes.dataset.mfWishLoop = "true";
      wishes.animate([{ transform: "translateY(0%)" }, { transform: "translateY(-50%)" }], {
        duration: Math.max(2200 * wishCount, 16000), iterations: Infinity, easing: "linear",
      });
    }
  }

  function animateSourceControls() {
    if (reduced) return;
    const animateScale = (node, target) => {
      const matrix = window.getComputedStyle(node).transform;
      const values = matrix.match(/^matrix\(([-\d.]+),\s*([-\d.]+)/);
      const start = values ? Math.hypot(Number(values[1]), Number(values[2])) : 1;
      controlAnimations.get(node)?.cancel();
      const spring = springFrames({ transform: `scale(${start})` }, { transform: `scale(${target})` });
      controlAnimations.set(node, node.animate(spring.frames, {
        duration: spring.duration * 1000, easing: "linear", fill: "forwards",
      }));
    };
    const bindStates = (node, hover, tap) => {
      if (node.dataset.mfMotionBound) return;
      node.dataset.mfMotionBound = "true";
      let hovering = false;
      let pressing = false;
      const update = () => animateScale(node, pressing ? tap : hovering ? hover : 1);
      node.addEventListener("pointerenter", () => { hovering = true; update(); });
      node.addEventListener("pointerleave", () => { hovering = false; pressing = false; update(); });
      node.addEventListener("pointerdown", () => { pressing = true; update(); });
      node.addEventListener("pointerup", () => { pressing = false; update(); });
      node.addEventListener("pointercancel", () => { pressing = false; update(); });
    };
    const music = root.querySelector(".mf-music");
    if (music) bindStates(music, 1.1, 0.9);
    root.querySelectorAll("section:nth-of-type(6) a").forEach((link) => bindStates(link, 1.02, 0.98));
  }

  function finishWithoutMotion() {
    observer?.disconnect();
    root.classList.add("mf-reduced");
    root.querySelectorAll('section [style*="opacity:0"], section [style*="scale(0)"]').forEach((node) => {
      const target = targetFor(node);
      if (target.opacity != null) node.style.opacity = String(target.opacity);
      if (target.transform) node.style.transform = target.transform;
      if (target.filter) node.style.filter = target.filter;
    });
    if (root.children[2]) root.children[2].hidden = true;
    if (root.firstElementChild) root.firstElementChild.hidden = true;
  }

  function openLightbox(layer) {
    if (reduced) return;
    const image = layer.querySelector("img");
    layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out", fill: "both" });
    image?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out", fill: "both" });
    const spring = springFrames({ transform: "scale(.96)" }, { transform: "scale(1)" });
    image?.animate(spring.frames, { duration: spring.duration * 1000, easing: "linear", fill: "both" });
  }

  function closeLightbox(layer, onFinish) {
    if (reduced) {
      onFinish?.();
      return;
    }
    const image = layer.querySelector("img");
    image?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "ease-out", fill: "forwards" });
    const spring = springFrames({ transform: "scale(1)" }, { transform: "scale(.96)" });
    image?.animate(spring.frames, { duration: spring.duration * 1000, easing: "linear", fill: "forwards" });
    const fade = layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "ease-out", fill: "forwards" });
    fade.onfinish = () => {
      fade.cancel();
      onFinish?.();
    };
  }

  function start(payload = {}) {
    reduced = motionReduced(payload);
    if (reduced) {
      finishWithoutMotion();
      return;
    }
    root.classList.remove("mf-reduced");
    if (!initialized) {
      initialized = true;
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const node = entry.target;
          const config = JSON.parse(node.dataset.mfMotionConfig || "{}");
          const reached = entry.isIntersecting && entry.intersectionRatio >= config.amount;
          if (reached) {
            animateReveal(node, config);
            if (config.once) observer.unobserve(node);
          } else if (!config.once) running.get(node)?.cancel();
        }
      }, { root, threshold: [0, 0.2, 0.35] });
      animateOpening();
      animatePetals();
    }
    registerReveals();
    startContinuousMotion();
    animateSourceControls();
  }

  window.ModernFloralSourceMotion = { start, openLightbox, closeLightbox };
  window.addEventListener("message", (event) => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== "modern-floral:update") return;
    window.setTimeout(() => start(event.data.payload), 0);
  });
  try {
    const initial = JSON.parse(window.name);
    if (initial?.type === "modern-floral:update") window.setTimeout(() => start(initial.payload), 0);
  } catch {}
})();
