(() => {
  "use strict";

  // Keep the reference typography at its authored size whenever it fits. Some
  // name lockups are a single flex row, though, and longer real names can be
  // clipped by their source container. Only those overflowing lockups receive
  // a small font-size reduction and a final wrapping fallback.
  const fitStyles = document.createElement("style");
  fitStyles.dataset.platformNameFit = "";
  fitStyles.textContent = `
    .intro__content,
    .intro__names {
      min-width: 0 !important;
      max-width: 100% !important;
    }
    .decode-name {
      min-width: 0 !important;
    }
    .platform-name-fit--wrap {
      max-width: 100% !important;
      overflow-wrap: anywhere !important;
    }
    .platform-name-fit--wrap > [data-slot="groom"],
    .platform-name-fit--wrap > [data-slot="bride"] {
      min-width: 0 !important;
      max-width: 100% !important;
      overflow-wrap: anywhere !important;
    }
    .decode-name.platform-name-fit--single-wrap {
      height: auto !important;
      max-width: 100% !important;
      overflow: visible !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
    }
    .decode-name.platform-name-fit--single-wrap > .glyph {
      white-space: normal !important;
    }
    .platform-name-fit--wrap:is(.intro__names, .hero__names, .footer__names, .finale__names) {
      flex-wrap: wrap !important;
    }
  `;
  document.head.append(fitStyles);

  const nameLockups = [
    ".intro__name-lockup",
    ".intro__names",
    ".hero__names",
    ".hero h1",
    ".footer__names",
    ".finale__names",
    ".beam-title__names",
  ].join(",");

  function fitLongNames() {
    // Some source designs position their opening name block with both `left`
    // and `right` insets. Keep those authored bounds, then shrink only a name
    // whose painted text is wider than that block. This avoids clipping in
    // narrow invitation cards without changing the source font when it fits.
    document
      .querySelectorAll('[data-slot="groom"], [data-slot="bride"]')
      .forEach((name) => {
        if (name.closest(".marquee, .shoot-marquee")) return;

        const lockup = name.closest(nameLockups);
        const width = lockup?.clientWidth || 0;
        name.style.removeProperty("font-size");
        const baseSize = Number.parseFloat(getComputedStyle(name).fontSize);
        if (!width || !baseSize) return;

        const range = document.createRange();
        range.selectNodeContents(name);
        const paintedWidth = range.getBoundingClientRect().width;
        if (!paintedWidth || paintedWidth <= width - 2) return;

        const scale = Math.max(0.5, Math.min(1, (width - 2) / paintedWidth));
        name.style.fontSize = `${baseSize * scale}px`;
      });

    // Sahifa reveals each name as animated glyph spans in an overflow-hidden
    // element. Its parent cannot report the clipped text width, so measure and
    // fit each name directly while leaving the original glyph animation intact.
    document.querySelectorAll(".decode-name").forEach((name) => {
      name.style.removeProperty("font-size");
      name.classList.remove("platform-name-fit--single-wrap");
      const width = name.clientWidth || name.parentElement?.clientWidth || 0;
      const baseSize = Number.parseFloat(getComputedStyle(name).fontSize);
      if (!width || !baseSize) return;

      // `overflow:hidden` can make scrollWidth under-report glyph spans in
      // this source template. Measure the visible string with the loaded font.
      const style = getComputedStyle(name);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const weight = style.fontWeight || "400";
      const family = style.fontFamily || "serif";
      const letterSpacing = Number.parseFloat(style.letterSpacing) || 0;
      if (context) context.font = `${weight} ${baseSize}px ${family}`;
      const label = name.textContent || "";
      const canvasWidth = context
        ? context.measureText(label).width + Math.max(0, label.length - 1) * letterSpacing
        : name.scrollWidth;
      // The source gives every decoded glyph a `.55em` minimum width. Include
      // that authored minimum because canvas metrics alone can understate the
      // final span width after the source splits the name into glyph elements.
      const glyphWidth = label.length * baseSize * 0.68;
      const measured = Math.max(canvasWidth, glyphWidth);
      if (measured <= width + 1) return;

      const scale = Math.max(0.36, Math.min(1, (width - 2) / measured));
      name.style.fontSize = `${baseSize * scale}px`;
      if (name.scrollWidth > width + 1 && scale <= 0.36)
        name.classList.add("platform-name-fit--single-wrap");
    });

    document.querySelectorAll(nameLockups).forEach((lockup) => {
      if (
        !lockup.querySelector('[data-slot="groom"]') ||
        !lockup.querySelector('[data-slot="bride"]')
      )
        return;

      // Re-read the template's own responsive size before measuring. This also
      // makes resize passes independent from a previous fit adjustment.
      lockup.style.removeProperty("font-size");
      lockup.classList.remove("platform-name-fit--wrap");
      const width = lockup.clientWidth;
      const baseSize = Number.parseFloat(getComputedStyle(lockup).fontSize);
      if (!width || !baseSize || lockup.scrollWidth <= width + 1) return;

      const scale = Math.max(0.68, Math.min(1, (width - 2) / lockup.scrollWidth));
      lockup.style.fontSize = `${baseSize * scale}px`;
      if (lockup.scrollWidth > width + 1)
        lockup.classList.add("platform-name-fit--wrap");
    });
  }

  let fitScheduled = false;
  function scheduleNameFit() {
    if (fitScheduled) return;
    fitScheduled = true;
    requestAnimationFrame(() => {
      fitScheduled = false;
      fitLongNames();
    });
  }

  const nameObserver = new MutationObserver(scheduleNameFit);
  nameObserver.observe(document.documentElement, {
    characterData: true,
    childList: true,
    subtree: true,
  });
  window.addEventListener("resize", scheduleNameFit, { passive: true });
  window.addEventListener("load", scheduleNameFit, { once: true });
  if (document.fonts?.ready) document.fonts.ready.then(scheduleNameFit);
  scheduleNameFit();

  try {
    const value = window.name;
    if (!value || value[0] !== "{") return;
    const data = JSON.parse(value);
    if (data && typeof data === "object" && typeof data.slug === "string") {
      window.MARHAMAT_REMOTE = data;
      window.name = "";
    }
  } catch {
    window.name = "";
  }
})();
