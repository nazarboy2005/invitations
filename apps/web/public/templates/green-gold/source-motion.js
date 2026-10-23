/*
 * Green Gold's original page choreography, isolated from the Chorlove app
 * bundle. Values below are transcribed from the captured Green Gold route
 * module; this file only implements template-level motion.
 */
(() => {
  "use strict";

  const rotations = [
    [1, 30], [1, 40], [-1, 25], [-1, 50], [1, 30], [1, 45], [-1, 30],
    [1, 40], [-1, 45], [1, 28], [1, 55], [-1, 35], [1, 40], [-1, 25],
    [-1, 45], [1, 30], [1, 50], [1, 50],
  ];

  function install(root, payload) {
    if (!root || root.dataset.ggMotionInstalled === "true") return;
    root.dataset.ggMotionInstalled = "true";

    const sections = [...root.querySelectorAll(":scope > section")];
    const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set();
    const revealTargets = new Set();
    let observer;

    const reduced = () => Boolean(payload?.reducedMotion || reducedQuery.matches);
    const track = (element, animation) => {
      if (!element || reduced()) return null;
      const handle = element.animate(animation.frames, {
        duration: animation.duration,
        delay: animation.delay || 0,
        easing: animation.easing || "ease-out",
        fill: "both",
        iterations: animation.iterations || 1,
      });
      animations.add(handle);
      handle.onfinish = () => {
        if (animation.iterations === Infinity) return;
        animations.delete(handle);
      };
      return handle;
    };

    function reveal(element, from, { duration = 300, delay = 0, amount = 0, once = false } = {}) {
      if (!element) return;
      const state = { element, from, duration, delay, amount, once, entered: false, animation: null };
      revealTargets.add(state);
      if (reduced()) {
        element.style.opacity = "1";
        element.style.transform = "none";
      } else {
        element.style.opacity = "0";
        element.style.transform = from;
      }
    }

    function show(state, visible) {
      if (state.once && state.entered && !visible) return;
      if (visible && state.entered && state.once) return;
      state.animation?.cancel();
      if (visible) {
        state.entered = true;
        state.animation = track(state.element, {
          frames: [
            { opacity: 0, transform: state.from },
            { opacity: 1, transform: "none" },
          ],
          duration: state.duration,
          delay: state.delay,
        });
      } else if (state.entered) {
        state.animation = track(state.element, {
          frames: [
            { opacity: 1, transform: "none" },
            { opacity: 0, transform: state.from },
          ],
          duration: state.duration,
        });
      }
    }

    const observed = [...revealTargets];
    if (!reduced() && observed.length && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const state = [...revealTargets].find((item) => item.element === entry.target);
          if (!state) continue;
          const visible = entry.isIntersecting && entry.intersectionRatio >= state.amount;
          if (visible !== state.entered) show(state, visible);
        }
      }, {
        root,
        threshold: [...new Set([0, ...observed.map((item) => item.amount)])].sort((a, b) => a - b),
      });
      for (const state of revealTargets) observer.observe(state.element);
    } else {
      for (const state of revealTargets) {
        state.element.style.opacity = "1";
        state.element.style.transform = "none";
      }
    }

    // The cover's staggered entrance and pulsing down indicator.
    const intro = sections[0]?.querySelector(".relative.z-20.flex.flex-col.items-center.text-center.space-y-8");
    const introParts = intro ? [...intro.children] : [];
    const introLogo = introParts[0];
    const introGreeting = introParts[1];
    const introRule = introParts[2];
    const introTitle = introParts[3];
    const introArrow = introParts[4]?.firstElementChild;
    if (reduced()) {
      for (const element of [introLogo, introGreeting, introTitle]) {
        if (element) { element.style.opacity = "1"; element.style.transform = "none"; }
      }
      if (introRule) introRule.style.width = "80%";
      if (introArrow) introArrow.style.transform = "none";
    } else {
      track(introLogo, { frames: [{ opacity: 0, transform: "translateY(-20px)" }, { opacity: 1, transform: "none" }], duration: 1000 });
      track(introGreeting, { frames: [{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "none" }], duration: 1000, delay: 500 });
      track(introRule, { frames: [{ width: "0%" }, { width: "80%" }], duration: 1500, delay: 1000 });
      track(introTitle, { frames: [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }], duration: 1000, delay: 1200 });
      track(introArrow, { frames: [{ transform: "translateY(0px)" }, { transform: "translateY(10px)" }, { transform: "translateY(0px)" }], duration: 2000, iterations: Infinity, easing: "ease-in-out" });
    }

    // Source whileInView declarations for the named couple, story and date sections.
    const coupleContent = sections[1]?.querySelector(".relative.z-10.text-center.px-8.space-y-8");
    if (coupleContent) {
      reveal(coupleContent.children[0], "translateY(10px)");
      reveal(coupleContent.children[1], "scale(.95)", { duration: 800, delay: 300 });
    }
    const storyCopy = sections[2]?.querySelector(".relative.z-20.text-center.space-y-10.max-w-sm");
    reveal(storyCopy?.querySelector("p"), "scale(.9)", { duration: 800 });
    reveal(sections[3]?.querySelector("p"), "scale(.9)", { duration: 800 });

    const dateContent = sections[4]?.querySelector(".relative.z-10.flex.flex-col.items-center.text-center.space-y-4.px-6");
    if (dateContent) {
      reveal(dateContent.children[0], "translateY(10px)");
      reveal(dateContent.children[1], "scale(.95)");
    }

    const countdownContent = sections[5]?.querySelector(".relative.z-10.text-center.space-y-10");
    if (countdownContent) {
      reveal(countdownContent.children[0], "translateX(20px)", { duration: 800 });
      [...(countdownContent.querySelectorAll(".grid > div") || [])].forEach((card, index) => {
        reveal(card, "scale(.9)", { duration: 500, delay: index * 100 });
      });
    }

    // Both responsive source galleries use their own stagger and initial state.
    const gallery = sections[9];
    const galleryGrids = [...(gallery?.querySelectorAll(".grid") || [])];
    for (const grid of galleryGrids) {
      const desktop = grid.classList.contains("md:grid");
      [...grid.children].forEach((tile, index) => {
        reveal(tile, desktop ? "scale(.96)" : "translateY(18px)", {
          duration: 300,
          delay: index * (desktop ? 50 : 40),
          amount: 0.35,
          once: true,
        });
      });
    }

    const rsvp = sections[11];
    reveal(rsvp?.querySelector(".text-center"), "translateY(15px)", { duration: 600, amount: 0.2 });
    reveal(rsvp?.querySelector(".mt-6"), "translateY(15px)", { duration: 600, amount: 0.2 });

    // The source creates 30 randomized starbursts with these exact ranges/keyframes.
    const stars = root.firstElementChild?.children || [];
    for (const star of stars) {
      const random = Math.random;
      star.style.left = `${100 * random()}%`;
      star.style.top = `${100 * random()}%`;
      const size = 8 + 12 * random();
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      if (reduced()) {
        star.style.opacity = "0";
        star.style.transform = "scale(0)";
      } else {
        const delay = 10 * random();
        const duration = 3 + 4 * random();
        track(star, {
          frames: [
            { opacity: 0, transform: "scale(.5)" },
            { opacity: 1, transform: "scale(1.2)", offset: 0.25 },
            { opacity: 0.5, transform: "scale(.8)", offset: 0.5 },
            { opacity: 1, transform: "scale(1.1)", offset: 0.75 },
            { opacity: 0, transform: "scale(.5)" },
          ],
          duration: duration * 1000,
          delay: delay * 1000,
          iterations: Infinity,
          easing: "ease-in-out",
        });
      }
    }

    // Original ornamental naqsh loops, in DOM order, keep their captured directions and periods.
    const ornaments = [...root.querySelectorAll('img[src*="/naqsh.png"]')];
    ornaments.forEach((image, index) => {
      const [direction, seconds] = rotations[index] || [1, 40];
      const target = image.parentElement;
      track(target, {
        frames: [{ transform: "rotate(0deg)" }, { transform: `rotate(${direction * 360}deg)` }],
        duration: seconds * 1000,
        iterations: Infinity,
        easing: "linear",
      });
    });

    function updateWishes() {
      const list = sections[10]?.querySelector(".space-y-3.py-1");
      if (!list) return;
      list.getAnimations().forEach((animation) => animation.cancel());
      if (reduced() || list.children.length <= 3) {
        list.style.transform = "none";
        return;
      }
      track(list, {
        frames: [{ transform: "translateY(0%)" }, { transform: "translateY(-50%)" }],
        duration: Math.max(2.2 * list.children.length, 16) * 1000,
        iterations: Infinity,
        easing: "linear",
      });
    }

    function updateReducedMotion() {
      if (reduced()) {
        observer?.disconnect();
        for (const animation of animations) animation.cancel();
        animations.clear();
        for (const state of revealTargets) {
          state.animation?.cancel();
          state.element.style.opacity = "1";
          state.element.style.transform = "none";
        }
        for (const element of [introLogo, introGreeting, introTitle]) {
          if (element) { element.style.opacity = "1"; element.style.transform = "none"; }
        }
        if (introRule) introRule.style.width = "80%";
        for (const star of stars) { star.style.opacity = "0"; star.style.transform = "scale(0)"; }
        for (const image of ornaments) image.parentElement?.getAnimations().forEach((animation) => animation.cancel());
      } else {
        updateWishes();
      }
    }

    reducedQuery.addEventListener?.("change", updateReducedMotion);
    root.addEventListener("gg:wishes-updated", updateWishes);
    root.addEventListener("gg:reduced-motion-updated", updateReducedMotion);
    updateWishes();

    return {
      reveal,
      updateWishes,
      animateGallery(dialog, image) {
        if (reduced()) return;
        track(dialog, { frames: [{ opacity: 0 }, { opacity: 1 }], duration: 200, easing: "ease-out" });
        track(image, { frames: [{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "scale(1)" }], duration: 250, easing: "ease-out" });
      },
      closeGallery(dialog, onFinish) {
        if (reduced()) { onFinish(); return; }
        const animation = track(dialog, { frames: [{ opacity: 1 }, { opacity: 0 }], duration: 180, easing: "ease-in" });
        if (animation) animation.onfinish = onFinish;
        else onFinish();
      },
    };
  }

  window.GreenGoldSourceMotion = { install };
})();
