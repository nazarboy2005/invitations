/* Same-origin contract/service adapter. The source presentation lives separately. */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const all = (s) => [...document.querySelectorAll(s)];
  const text = (s, value) => {
    const el = $(s);
    if (el) el.textContent = value || "";
  };
  const show = (s, visible) => {
    const el = $(s);
    if (el) el.hidden = !visible;
  };
  const safeUrl = (value) =>
    /^(https?:\/\/|\/(?!\/))/i.test(value || "") ? value : "";
  let state,
    locale,
    copy,
    data,
    initialized = false,
    generation = 0;
  let wishes = [],
    wishStatus = "",
    submitted = false,
    pending = false;
  let audioKey = "",
    userPaused = false,
    everPlayed = false,
    retryMusic = false;
  const form = $("#tv-wish-form"),
    audio = $("#tv-audio");
  const wishSection = form.closest("section");
  const closedPanel = window.TovusSource.buildClosedPanel("#C6A24A");
  form.after(closedPanel);
  closedPanel.hidden = true;
  const quoteTemplate = $("#tv-inv-quote").cloneNode(false);
  function closed() {
    return (
      Number.isFinite(data?.target) && Date.now() >= data.target + 86400000
    );
  }
  const eventRow = $("#tv-events > .tv-ev-row") || $("#tv-events").children[1];
  const rowTemplate = eventRow.cloneNode(true);
  const spine = $("#tv-events").firstElementChild.cloneNode(true);
  form.elements.wname.required = true;
  form.elements.wname.maxLength = 100;
  form.elements.wmsg.required = true;
  form.elements.wmsg.maxLength = 2000;
  $("#tv-wish-confirm").setAttribute("role", "status");
  $("#tv-wish-confirm").setAttribute("aria-live", "polite");

  function localize() {
    all("[data-i18n]").forEach((el) => {
      const value = copy[el.dataset.i18n];
      if (value != null) el.textContent = value;
    });
    all("[data-i18n-ph]").forEach((el) => {
      el.placeholder = copy[el.dataset.i18nPh] || "";
      el.setAttribute("aria-label", el.placeholder);
    });
    all(".tv-lang button").forEach((button) => {
      button.hidden = !state.enabledLocales.includes(button.dataset.lang);
      button.classList.toggle("on", button.dataset.lang === locale);
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.lang === locale),
      );
    });
    $(".tv-lang").hidden = state.enabledLocales.length < 2;
    document.documentElement.lang = locale;
    $("#tv-music").setAttribute("aria-label", copy.music);
    all('img[src$="crest.webp"]').forEach((image) => (image.alt = copy.crest));
    $('img[src$="garland.webp"]').alt = copy.garland;
  }
  function renderProgram() {
    const host = $("#tv-events");
    host.replaceChildren(spine.cloneNode(true));
    data.program.forEach((item, index) => {
      const row = rowTemplate.cloneNode(true);
      row.classList.add("tv-ev-row");
      row.dataset.itemId = item.id;
      row.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      const card = row.children[1];
      // Original source card: kicker, title, description, when/where metadata.
      card.children[0].hidden = true;
      card.children[1].textContent = item.title;
      card.children[1].hidden = !item.title;
      card.children[2].textContent = item.description;
      card.children[2].hidden = !item.description;
      const when = card.children[3].children[0];
      when.children[0].textContent = copy.ev_when_label;
      when.children[1].textContent = [data.date.long, item.time]
        .filter(Boolean)
        .join(" — ");
      when.hidden = !data.date.long && !item.time;
      const where = card.children[3].children[1];
      where.children[0].textContent = copy.ev_where_label;
      where.children[1].textContent = data.venue.name;
      where.hidden = !data.venue.name;
      row
        .querySelectorAll("[data-i18n]")
        .forEach((el) => el.removeAttribute("data-i18n"));
      row.classList.add("tv-in");
      row.style.transitionDelay = index * 80 + "ms";
      host.appendChild(row);
    });
    show("#tv-events-section", data.program.length > 0);
    text('[data-i18n="ev_title"]', data.programHeading || copy.ev_title);
  }
  function renderWishes() {
    wishSection.hidden = !state.wishesEnabled;
    const list = $("#tv-wish-list");
    list.replaceChildren();
    wishes.forEach((wish) => {
      const card = document.createElement("div");
      card.style.cssText =
        "background:rgba(255,255,255,.66);border:1px solid rgba(198,162,74,.22);border-radius:2px;padding:16px 18px;box-shadow:0 14px 28px -22px rgba(12,30,26,.34);";
      const heading = document.createElement("div");
      heading.style.cssText =
        "display:flex;align-items:center;gap:9px;margin-bottom:6px;";
      const dot = document.createElement("div");
      dot.style.cssText =
        "width:13px;height:13px;border-radius:50%;background:radial-gradient(circle at 50% 45%,var(--peacock) 0 24%,var(--gold) 28% 56%,var(--teal) 60% 100%);flex:none;";
      const name = document.createElement("div");
      name.style.cssText =
        "font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:var(--emerald);";
      name.textContent = wish.name;
      const message = document.createElement("div");
      message.style.cssText =
        "font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.55;color:var(--ink);white-space:pre-wrap;overflow-wrap:anywhere;";
      message.textContent = wish.message;
      heading.append(dot, name);
      card.append(heading, message);
      list.append(card);
    });
    show("#tv-wish-empty", wishes.length === 0);
    form.hidden = submitted || closed();
    closedPanel.hidden = !closed();
    ["closed_title", "closed_subtitle", "closed_body"].forEach(
      (key, i) => (closedPanel.children[i + 1].textContent = copy[key]),
    );
    const status = $("#tv-wish-confirm");
    status.style.display = wishStatus ? "block" : "none";
    status.textContent = copy[wishStatus] || "";
    form.querySelector("button").disabled = pending;
  }
  async function loadWishes() {
    const version = generation;
    if (state.preview || !state.wishesEnabled || !state.invitationId) return;
    try {
      const response = await fetch(
        "/api/public/invitations/" +
          encodeURIComponent(state.invitationId) +
          "/wishes",
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("load");
      const result = await response.json();
      if (!Array.isArray(result.wishes)) throw new Error("shape");
      if (version !== generation) return;
      wishes = result.wishes;
      renderWishes();
    } catch {
      if (version === generation) {
        wishStatus = "loadError";
        renderWishes();
      }
    }
  }
  function icon() {
    const playing = !audio.paused;
    $("#tv-music-on").style.display = playing ? "flex" : "none";
    $("#tv-music-off").style.display = playing ? "none" : "flex";
    $("#tv-music").setAttribute("aria-pressed", String(playing));
  }
  async function playMusic() {
    if (!audioKey || state.silentPlayback || userPaused || document.hidden)
      return;
    try {
      await audio.play();
      everPlayed = true;
      retryMusic = false;
    } catch {
      retryMusic = !everPlayed;
    }
    icon();
  }
  function bindMusic() {
    const next = state.music.enabled ? safeUrl(state.music.url) : "";
    if (next !== audioKey) {
      audio.pause();
      audioKey = next;
      everPlayed = false;
      userPaused = false;
      if (next) audio.src = next;
      else audio.removeAttribute("src");
    }
    show("#tv-music", !!next);
    $("#tv-music").style.display = next ? "flex" : "none";
    audio.muted = !!state.silentPlayback;
    if (state.silentPlayback) audio.pause();
    if (!state.preview && !everPlayed) playMusic();
    icon();
  }
  function tick() {
    if (!data) return;
    const valid = Number.isFinite(data.target);
    const diff = valid ? data.target - Date.now() : 0;
    const arrived = valid && diff <= 0;
    const section = $("#tv-cd-grid").closest("section");
    section.hidden = !valid;
    show("#tv-cd-grid", !arrived);
    show("#tv-cd-arrived", arrived);
    $("#tv-cd-grid").style.display = arrived ? "none" : "flex";
    $("#tv-cd-arrived").style.display = arrived ? "block" : "none";
    const values = [
      Math.floor(diff / 86400000),
      Math.floor((diff % 86400000) / 3600000),
      Math.floor((diff % 3600000) / 60000),
      Math.floor((diff % 60000) / 1000),
    ];
    if (closedPanel) {
      form.hidden = submitted || closed();
      closedPanel.hidden = !closed();
    }
    ["d", "h", "m", "s"].forEach((part, i) =>
      text(
        "#tv-cd-" + part,
        String(Math.max(0, values[i])).padStart(i ? 2 : 1, "0"),
      ),
    );
  }
  // Keep original source sizes for normal names; fit long authored names into their scene.
  function fitNames() {
    const fields = {
      "hero-a": [64, 24, 2],
      "hero-b": [64, 24, 2],
      "splash-names": [52, 20, 3],
      "foot-names": [44, 18, 3],
      "frame-groom": [38, 18, 2],
      "frame-bride": [38, 18, 2],
    };
    for (const [slot, [base, min, lines]] of Object.entries(fields)) {
      const el = document.getElementById("tv-" + slot);
      if (!el || !el.textContent || el.hidden) continue;
      el.style.fontSize = base + "px";
      for (let size = base; size > min; size--) {
        const css = getComputedStyle(el);
        const padding =
          parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);
        const line = parseFloat(css.lineHeight) || size * 1.2;
        if (
          el.scrollHeight <= line * lines + padding + 2 &&
          el.scrollWidth <= el.clientWidth + 1
        )
          break;
        el.style.fontSize = size - 1 + "px";
      }
    }
  }
  addEventListener("resize", fitNames);
  document.fonts.ready.then(fitNames);
  function render() {
    copy = window.TOVUS_COPY[locale];
    data = state.variants[locale];
    document.title = data.title || "Tovus";
    localize();
    const first = data.people[0] || "",
      second = data.people.slice(1).filter(Boolean).join(" & ");
    const pair = data.people.filter(Boolean).join(" & ");
    ["#tv-hero-a", "#tv-frame-groom", "#tv-inv-groom"].forEach((s) =>
      text(s, first),
    );
    ["#tv-hero-b", "#tv-frame-bride", "#tv-inv-bride"].forEach((s) =>
      text(s, second),
    );
    [
      "#tv-hero-b",
      "#tv-frame-bride",
      "#tv-inv-bride-block",
      "#tv-hero-amp",
      "#tv-frame-amp",
      "#tv-inv-amp",
    ].forEach((s) => show(s, !!second));
    text("#tv-splash-names", pair);
    text("#tv-foot-names", pair);
    ["#tv-hero-date", "#tv-splash-date"].forEach((s) =>
      text(s, data.date.numeric),
    );
    text("#tv-frame-date", data.date.long);
    text(
      "#tv-foot-meta",
      [data.date.long, data.venue.name].filter(Boolean).join(" · "),
    );
    text('[data-i18n="splash_kicker"]', data.eventLabel || copy.splash_kicker);
    text('[data-i18n="hero_kicker"]', data.eventLabel || copy.hero_kicker);
    text(
      '[data-i18n="inv_kicker"]',
      [data.greeting, data.hosts].filter(Boolean).join("\n"),
    );
    $('[data-i18n="inv_kicker"]').style.whiteSpace = "pre-line";
    text('[data-i18n="inv_request"]', data.message);
    text("#tv-foot-note", data.greeting);
    show("#tv-foot-note", !!data.greeting);
    [
      "#tv-inv-groom-parents-wrap",
      "#tv-inv-bride-parents-wrap",
      "#tv-info-parking",
    ].forEach((s) => show(s, false));
    const cityMatch = data.venue.address
      .split(",")[0]
      .trim()
      .match(/^(.+?)\s+(?:sh\.?|shahri|шаҳри|ш\.)$|^(?:г|g)\.\s*(.+)$/i);
    const city = cityMatch ? cityMatch[1] || cityMatch[2] : "";
    text("#tv-hero-city", city);
    show("#tv-hero-city-wrap", !!city);
    const quote = $("#tv-quote-wrap");
    quote
      .querySelectorAll("[data-story-id],#tv-inv-quote")
      .forEach((el) => el.remove());
    for (const chapter of data.story || []) {
      const p = quoteTemplate.cloneNode(false);
      p.removeAttribute("id");
      p.removeAttribute("data-i18n");
      p.dataset.storyId = chapter.id;
      p.textContent = [chapter.title, chapter.text].filter(Boolean).join(" — ");
      quote.append(p);
    }
    show("#tv-quote-wrap", !!data.story?.length);
    text("#tv-hero-venue", data.venue.name);
    text("#tv-venue-name", data.venue.name);
    text(
      "#tv-venue-addr",
      [data.venue.address, data.venue.landmark].filter(Boolean).join(" · "),
    );
    show("#tv-venue-name", !!data.venue.name);
    show("#tv-venue-addr", !!data.venue.address || !!data.venue.landmark);
    const map = safeUrl(data.venue.mapUrl);
    show("#tv-map", !!map);
    if (map) $("#tv-map").href = map;
    else $("#tv-map").removeAttribute("href");
    text("#tv-info-dress-text", data.dressCode);
    show("#tv-info-dress", !!data.dressCode);
    const timing =
      data.program
        .map((item) => [item.title, item.time].filter(Boolean).join(" "))
        .filter(Boolean)
        .join(" · ") || data.date.time;
    text("#tv-info-timing-text", timing);
    show("#tv-info-timing", !!timing);
    text(
      "#tv-info-rsvp-text",
      copy.deadline.replace("{date}", data.rsvpDeadline),
    );
    show("#tv-info-rsvp", !!data.rsvpDeadline);
    show("#tv-info-section", !!(data.dressCode || timing || data.rsvpDeadline));
    renderProgram();
    if (state.preview) wishes = data.wishes;
    renderWishes();
    bindMusic();
    tick();
    fitNames();
    document.body.removeAttribute("data-pending");
  }
  function receive(payload) {
    if (!payload || !payload.variants || !Array.isArray(payload.enabledLocales))
      return;
    if (
      !payload.enabledLocales.includes(payload.locale) ||
      !window.TOVUS_COPY[payload.locale] ||
      !payload.variants[payload.locale]
    )
      return;
    const identityChanged =
      !state ||
      state.invitationId !== payload.invitationId ||
      state.preview !== payload.preview;
    state = payload;
    locale = payload.locale;
    generation++;
    if (identityChanged) {
      wishes = [];
      wishStatus = "";
      submitted = false;
      pending = false;
      form.reset();
    }
    window.tvReduced =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (state.preview && state.reducedMotion);
    document.documentElement.toggleAttribute("data-reduced", window.tvReduced);
    render();
    if (!initialized) {
      initialized = true;
      window.initTovusMotion();
    }
    loadWishes();
  }
  window.addEventListener("message", (event) => {
    if (
      event.origin !== location.origin ||
      event.source !== parent ||
      event.data?.type !== "taklifla-tovus:update"
    )
      return;
    receive(event.data.payload);
  });
  $(".tv-lang").addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang]");
    if (!button || !state?.enabledLocales.includes(button.dataset.lang)) return;
    locale = button.dataset.lang;
    render();
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state || pending || submitted || closed()) return;
    if (state.preview) {
      wishStatus = "preview";
      renderWishes();
      return;
    }
    if (!state.wishesEnabled || !state.invitationId || !form.reportValidity())
      return;
    const name = form.elements.wname.value.trim(),
      message = form.elements.wmsg.value.trim();
    if (!name || !message) return;
    pending = true;
    wishStatus = "";
    renderWishes();
    const version = generation;
    try {
      const response = await fetch(
        "/api/public/invitations/" +
          encodeURIComponent(state.invitationId) +
          "/wishes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            message,
            guestToken: state.guestToken || undefined,
          }),
        },
      );
      if (!response.ok) throw new Error("submission");
      const result = await response.json();
      if (result.ok !== true) throw new Error("shape");
      if (version !== generation) return;
      submitted = true;
      wishStatus = "pending";
      form.reset();
    } catch {
      if (version === generation) wishStatus = "error";
    } finally {
      if (version === generation) {
        pending = false;
        renderWishes();
      }
    }
  });
  $("#tv-music").addEventListener("click", () => {
    if (!audio.paused) {
      userPaused = true;
      retryMusic = false;
      audio.pause();
      icon();
    } else {
      userPaused = false;
      playMusic();
    }
  });
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!state || event.target.closest("#tv-music")) return;
      if ((state.preview && !everPlayed && !userPaused) || retryMusic)
        playMusic();
    },
    { passive: true },
  );
  $("#tv-open").addEventListener("click", () => {
    if (!userPaused) playMusic();
  });
  audio.addEventListener("play", icon);
  audio.addEventListener("pause", icon);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      audio.pause();
      icon();
    }
  });
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  motionPreference.addEventListener("change", () => {
    if (!state) return;
    window.tvReduced =
      motionPreference.matches || (state.preview && state.reducedMotion);
    document.documentElement.toggleAttribute("data-reduced", window.tvReduced);
  });
  setInterval(() => {
    if (!document.hidden) tick();
  }, 1000);
})();
