(() => {
  "use strict";

  // Keep the reference typography at its authored size whenever it fits. Some
  // name lockups are a single flex row, though, and longer real names can be
  // clipped by their source container. Only those overflowing lockups receive
  // a small font-size reduction and a final wrapping fallback.
  const fitStyles = document.createElement("style");
  fitStyles.dataset.platformNameFit = "";
  if (location.pathname.includes("/sahifa/"))
    document.documentElement.classList.add("platform-lang-offset");
  if (location.pathname.includes("/bogi-eram/"))
    document.documentElement.classList.add("platform-lang-below-greeting");
  fitStyles.textContent = `
    .intro__content,
    .intro__names,
    .hero__content {
      min-width: 0 !important;
      max-width: 100% !important;
    }
    .decode-name {
      min-width: 0 !important;
      overflow: visible !important;
    }
    .platform-name-fit--wrap {
      max-width: 100% !important;
      overflow-wrap: anywhere !important;
    }
    .platform-name-fit--wrap > [data-slot="groom"]:not(.decode-name),
    .platform-name-fit--wrap > [data-slot="bride"]:not(.decode-name) {
      min-width: 0 !important;
      max-width: 100% !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
    }
    [data-slot="groom"].platform-name-fit--single-wrap,
    [data-slot="bride"].platform-name-fit--single-wrap {
      display: block !important;
      min-width: 0 !important;
      max-width: var(--platform-name-fit-width, 100%) !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
    }
    [data-slot="groom"]:not(.decode-name),
    [data-slot="bride"]:not(.decode-name) {
      white-space: nowrap !important;
      overflow-wrap: normal !important;
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
    @media (max-width: 380px) {
      [data-slot="groom"].platform-name-fit--long,
      [data-slot="bride"].platform-name-fit--long {
        display: block !important;
        max-width: 100% !important;
        font-size: clamp(18px, 7vw, 28px) !important;
        line-height: 1.1 !important;
        white-space: normal !important;
        overflow-wrap: anywhere !important;
      }
      .decode-name.platform-name-fit--long {
        width: 100% !important;
        height: auto !important;
        max-width: 100% !important;
        overflow: visible !important;
        font-size: clamp(18px, 7vw, 28px) !important;
        line-height: 1.1 !important;
        letter-spacing: normal !important;
        white-space: normal !important;
        overflow-wrap: anywhere !important;
        text-align: center !important;
      }
      .decode-name.platform-name-fit--long > .glyph {
        min-width: 0.42em !important;
        white-space: normal !important;
      }
    }
    .platform-name-fit--wrap:is(.intro__names, .hero__names, .footer__names, .finale__names) {
      flex-wrap: wrap !important;
    }
    @media (max-width: 520px) {
      .mh-lang {
        top: calc(env(safe-area-inset-top, 0px) + 6px) !important;
        right: 8px !important;
        padding: 2px !important;
      }
      .platform-lang-offset .mh-lang {
        top: calc(env(safe-area-inset-top, 0px) + 64px) !important;
      }
      .platform-lang-below-greeting .mh-lang {
        top: calc(env(safe-area-inset-top, 0px) + 100px) !important;
      }
      .mh-lang button {
        min-width: 26px !important;
        min-height: 26px !important;
        padding: 0 4px !important;
        font-size: 10px !important;
      }
    }
    @media (max-width: 360px) {
      html,
      body {
        max-width: 100% !important;
        overflow-x: clip !important;
      }
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
    // Preserve each template's authored type whenever it fits its clipping
    // canvas. If a name crosses that canvas, cap only that person's line and
    // allow it to wrap instead of distorting or cutting off the text.
    document
      .querySelectorAll('[data-slot="groom"], [data-slot="bride"]')
      .forEach((name) => {
        if (name.closest(".marquee, .shoot-marquee")) return;

        const hasLongName = (name.textContent || "").trim().length > 24;
        name.classList.toggle(
          "platform-name-fit--long",
          hasLongName && window.matchMedia("(max-width: 380px)").matches,
        );

        name.classList.remove("platform-name-fit--single-wrap");
        name.style.removeProperty("--platform-name-fit-width");
        const range = document.createRange();
        range.selectNodeContents(name);
        const textRect = range.getBoundingClientRect();
        if (!textRect.width || !textRect.height) return;

        const clippingAncestors = [];
        for (let ancestor = name.parentElement; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor);
          if (!/(hidden|clip)/.test(`${style.overflowX} ${style.overflowY}`)) continue;
          const rect = ancestor.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) clippingAncestors.push(rect);
        }
        if (!clippingAncestors.length) return;

        const rightEdge = Math.min(...clippingAncestors.map((rect) => rect.right));
        if (textRect.right <= rightEdge + 1) return;

        const available = Math.floor(rightEdge - textRect.left - 1);
        if (available < 24) return;
        name.style.setProperty("--platform-name-fit-width", `${available}px`);
        name.classList.add("platform-name-fit--single-wrap");
      });

    // Sahifa reveals each name as animated glyph spans in an overflow-hidden
    // element. Its parent cannot report the clipped text width, so measure and
    // fit each name directly while leaving the original glyph animation intact.
    document.querySelectorAll(".decode-name").forEach((name) => {
      const hasLongName = (name.textContent || "").trim().length > 24;
      name.classList.toggle(
        "platform-name-fit--long",
        hasLongName && window.matchMedia("(max-width: 380px)").matches,
      );
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
  const visibilityClassObserver = new MutationObserver((records) => {
    if (
      records.some(
        ({ target }) =>
          target === document.documentElement ||
          (target instanceof Element &&
            target.matches("body, .intro, .hero, .page")),
      )
    )
      scheduleNameFit();
  });
  visibilityClassObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
    subtree: true,
  });
  window.addEventListener("resize", scheduleNameFit, { passive: true });
  document.addEventListener("transitionend", scheduleNameFit, true);
  document.addEventListener("animationend", scheduleNameFit, true);
  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element) || !event.target.closest("#open-invitation, .seal"))
        return;
      let attempts = 0;
      const revealFit = window.setInterval(() => {
        scheduleNameFit();
        attempts += 1;
        if (attempts >= 16) window.clearInterval(revealFit);
      }, 100);
    },
    true,
  );
  window.addEventListener("load", scheduleNameFit, { once: true });
  if (document.fonts?.ready) document.fonts.ready.then(scheduleNameFit);
  scheduleNameFit();

  function connectInvitationData() {
    const api = window.Marhamat;
    if (!api?.on) return false;
    api.on("ready", () => syncHeroDate(api.data));
    api.on("open", () => {
      scheduleNameFit();
      window.setTimeout(scheduleNameFit, 300);
      window.setTimeout(scheduleNameFit, 1000);
    });
    syncHeroDate(api.data);
    return true;
  }

  // The Sahifa source initializes this day slot as "00" in its hero even
  // though the shared runtime has already populated the rest of the date.
  // Read the canonical date from the same invitation payload and repair only
  // that mismatched hero slot; all other template-authored date layouts remain
  // untouched.
  function syncHeroDate(data) {
    const day = data?.date?.day;
    if (day == null || day === "") return;
    const heroDay = document.querySelector('.hero__date [data-slot="date.day"]');
    if (heroDay && heroDay.textContent?.trim() !== String(day))
      heroDay.textContent = String(day);
  }

  window.addEventListener("load", () => {
    if (!connectInvitationData()) {
      const retry = window.setInterval(() => {
        if (connectInvitationData()) window.clearInterval(retry);
      }, 100);
      window.setTimeout(() => window.clearInterval(retry), 5000);
    }
  }, { once: true });
  window.addEventListener("message", (event) => {
    if (
      event.origin !== window.location.origin ||
      event.source !== window.parent ||
      event.data?.type !== "marxaba:update"
    ) return;
    requestAnimationFrame(() => syncHeroDate(event.data.payload));
  });

  document.addEventListener("click", () => {
    if (document.documentElement.classList.contains("is-locked")) return;
    // Some reference templates remove the root lock themselves without
    // emitting Marhamat's `open` event. Reveal the shared locale control once
    // that same unlock has happened so language switching remains available.
    document.querySelectorAll(".mh-lang.is-hidden").forEach((control) => {
      control.classList.remove("is-hidden");
    });
  }, true);

  // A few source openers remove `is-locked` during their own click handler,
  // after the capture-phase click above. Observe that transition so language
  // controls remain available.
  new MutationObserver(() => {
    if (document.documentElement.classList.contains("is-locked")) return;
    document.querySelectorAll(".mh-lang.is-hidden").forEach((control) => {
      control.classList.remove("is-hidden");
    });
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

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
