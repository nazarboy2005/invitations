/* Captured Stained Glass timings and scratch behavior, independent of provider runtime. */
(() => {
  let installed = false,
    opened = false,
    revealed = false,
    reduced = false,
    root,
    video,
    button,
    onOpen,
    fallback = 0;
  const all = (s, b = root) => [...b.querySelectorAll(s)];
  function animate(n, delay = 0, duration = 900) {
    const transform =
      n.dataset.initial?.match(/transform:([^;]+)/)?.[1] || "translateY(24px)";
    n.style.opacity = "1";
    if (!reduced)
      n.animate(
        [
          { opacity: 0, transform },
          { opacity: 1, transform: "none" },
        ],
        {
          duration,
          delay,
          easing: "cubic-bezier(0,0,.58,1)",
          fill: "backwards",
        },
      );
  }
  function finish() {
    if (revealed) return;
    revealed = true;
    clearTimeout(fallback);
    root.dataset.opened = "true";
    const hero = root.querySelector("[data-section=hero]"),
      final = hero.querySelector("video")?.nextElementSibling;
    if (final) {
      final.removeAttribute("data-reveal");
      final.style.opacity = "1";
      if (!reduced)
        final.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
      for (const cls of ["sg-shimmer", "sg-sunlight"]) {
        const n = document.createElement("div");
        n.className = cls + " pointer-events-none absolute inset-0";
        n.style.cssText =
          "mask-image:url(/templates/stained-glass/assets/hero-final.webp);-webkit-mask-image:url(/templates/stained-glass/assets/hero-final.webp);mask-size:cover;-webkit-mask-size:cover;mask-position:center;mask-mode:luminance";
        final.append(n);
      }
    }
    all("[data-hero-reveal]")
      .filter((n) => n !== final)
      .forEach((n, i) => animate(n, 200 + i * 200, 1100));
    const scroll = document.createElement("button");
    scroll.type = "button";
    scroll.className =
      "absolute inset-x-0 bottom-[11%] z-10 mx-auto flex w-fit flex-col items-center gap-1 text-[#4c5b47]";
    const label = document.createElement("span");
    label.className = "sg-body text-[11px] uppercase tracking-[0.3em]";
    label.textContent =
      {
        uz: "Pastga suring",
        "uz-Latn": "Pastga suring",
        "uz-Cyrl": "Пастга суринг",
        en: "Scroll down",
        ru: "Листайте вниз",
      }[document.documentElement.lang] || "Scroll down";
    scroll.dataset.scrollCue = "";
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrow.setAttribute("width", "20");
    arrow.setAttribute("height", "20");
    arrow.setAttribute("viewBox", "0 0 24 24");
    arrow.setAttribute("fill", "none");
    arrow.setAttribute("stroke", "currentColor");
    arrow.setAttribute("stroke-width", "2");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", "m6 9 6 6 6-6");
    arrow.append(line);
    scroll.append(label, arrow);
    if (!reduced)
      arrow.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(5px)" },
          { transform: "translateY(0)" },
        ],
        { duration: 1600, iterations: Infinity, easing: "ease-in-out" },
      );
    scroll.setAttribute("aria-label", label.textContent);
    scroll.onclick = () =>
      hero.nextElementSibling.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
      });
    hero.append(scroll);
    if (!reduced)
      scroll.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 800,
        delay: 1900,
        fill: "backwards",
      });
  }
  function open() {
    if (opened) return;
    opened = true;
    button.hidden = true;
    onOpen?.();
    if (reduced || !video) {
      finish();
      return;
    }
    fallback = setTimeout(finish, 9000);
    video.play().catch(finish);
  }
  function scratch() {
    const canvas = root.querySelector("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d"),
      image = new Image();
    let drawing = false,
      last = null,
      moves = 0,
      cleared = false,
      started = false;
    image.src = "/templates/stained-glass/assets/glass-texture.webp";
    const hint = canvas.parentElement.nextElementSibling?.nextElementSibling;
    const paint = () => {
      if (cleared || started) return;
      const rect = canvas.getBoundingClientRect(),
        ratio = Math.min(devicePixelRatio || 1, 2);
      if (!rect.width || !rect.height) return;
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      ctx.globalCompositeOperation = "source-over";
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, "#f3e6dc");
      gradient.addColorStop(0.5, "#fbf4ea");
      gradient.addColorStop(1, "#e7d3c8");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (image.complete && image.naturalWidth) {
        ctx.globalAlpha = 0.55;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }
    };
    image.onload = paint;
    new ResizeObserver(paint).observe(canvas);
    paint();
    const clear = () => {
      if (cleared) return;
      cleared = true;
      drawing = false;
      canvas.parentElement.style.opacity = "0";
      canvas.parentElement.style.pointerEvents = "none";
      if (!reduced)
        canvas.parentElement.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 900,
        });
    };
    const check = () => {
      let transparent = 0,
        count = 0;
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 3; i < pixels.length; i += 96) {
        count++;
        if (pixels[i] === 0) transparent++;
      }
      if (count && transparent / count >= 0.39) clear();
    };
    const draw = (e) => {
      const rect = canvas.getBoundingClientRect(),
        point = {
          x: ((e.clientX - rect.left) / rect.width) * canvas.width,
          y: ((e.clientY - rect.top) / rect.height) * canvas.height,
        },
        previous = last || point;
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = (52 * canvas.width) / rect.width;
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      last = point;
      if (++moves % 12 === 0) check();
    };
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "button");
    canvas.setAttribute("aria-label", "Scratch to reveal");
    canvas.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        clear();
      }
    };
    canvas.onpointerdown = (e) => {
      if (cleared) return;
      drawing = true;
      started = true;
      last = null;
      if (hint) hint.style.opacity = "0";
      canvas.setPointerCapture(e.pointerId);
      draw(e);
    };
    canvas.onpointermove = (e) => {
      if (drawing && !cleared) draw(e);
    };
    canvas.onpointerup = () => {
      drawing = false;
      last = null;
      check();
    };
    canvas.onpointercancel = () => {
      drawing = false;
      last = null;
    };
  }
  window.ChorloveMotion = {
    reveal: (n) => {
      if (n.dataset.revealed) return;
      n.dataset.revealed = "true";
      animate(n);
    },
    update: (options) => {
      root = options.root;
      onOpen = options.onOpen;
      reduced = root.classList.contains("three-reduced-motion");
      if (installed) return;
      installed = true;
      const hero = root.querySelector("[data-section=hero]");
      video = hero.querySelector("video");
      button = hero.querySelector("button");
      button.onclick = open;
      video.addEventListener("ended", finish);
      video.addEventListener("error", () => {
        if (opened) finish();
      });
      const hint = button.querySelector("span");
      if (hint && !reduced)
        hint.animate([{ opacity: 0.55 }, { opacity: 1 }, { opacity: 0.55 }], {
          duration: 2400,
          iterations: Infinity,
          easing: "ease-in-out",
        });
      // Source gazebo vines grow upwards over 2.4s with a .3s delay.
      for (const n of all('[style*="clip-path:inset(100%"]')) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              n.style.clipPath = "inset(0% 0 0 0)";
              if (!reduced)
                n.animate(
                  [
                    { clipPath: "inset(100% 0 0 0)" },
                    { clipPath: "inset(0% 0 0 0)" },
                  ],
                  {
                    duration: 2400,
                    delay: 300,
                    easing: "ease-out",
                    fill: "backwards",
                  },
                );
              observer.disconnect();
            }
          },
          { threshold: 0.25 },
        );
        observer.observe(n);
      }
      scratch();
    },
  };
})();
