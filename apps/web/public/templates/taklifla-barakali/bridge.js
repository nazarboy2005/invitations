/* Shared-contract/API adapter. No provider runtime, demos or browser storage. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const all = (selector) => Array.from(document.querySelectorAll(selector));
  let state, locale, selectedLocale, data, generation = 0, controller, busy = false;
  let musicUrl = "", played = false, pausedByGuest = false;
  const audio = $("#music-audio"), music = $("#music-fab");
  const offIcon = $("#music-ico").innerHTML;
  const onIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect class="bar" x="2" y="6" width="2" height="6" rx="1" fill="currentColor"/><rect class="bar" x="6" y="4" width="2" height="10" rx="1" fill="currentColor"/><rect class="bar" x="10" y="6" width="2" height="6" rx="1" fill="currentColor"/><rect class="bar" x="14" y="3" width="2" height="12" rx="1" fill="currentColor"/></svg>';
  const set = (selector, value) => { const node = $(selector); if (node) node.textContent = value || ""; };
  const visible = (selector, show) => { $(selector).hidden = !show; };
  const safeUrl = (value) => {
    if (typeof value !== "string" || !value || !/^https?:\/\/|^\/(?!\/)/i.test(value)) return "";
    try { const url = new URL(value, location.origin); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
  };
  function status(message, error = false) {
    const node = $("#rsvp-thanks"); node.textContent = message;
    node.dataset.error = String(error); node.classList.toggle("show", Boolean(message));
  }
  function drawWishes(wishes) {
    const list = $("#wish-list"); list.replaceChildren();
    for (const wish of wishes || []) {
      const card = document.createElement("div"); card.className = "wish";
      const meta = document.createElement("div"); meta.className = "wish-meta";
      const name = document.createElement("span"); name.className = "wish-name"; name.textContent = wish.name || "";
      const text = document.createElement("div"); text.className = "wish-text"; text.textContent = wish.message || "";
      const date = document.createElement("span"); date.className = "wish-time";
      if (wish.submittedAt && Number.isFinite(Date.parse(wish.submittedAt))) date.textContent = new Intl.DateTimeFormat(locale.startsWith("uz") ? "uz-UZ" : locale, { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(wish.submittedAt));
      meta.append(name, date); card.append(meta, text); list.append(card);
    }
  }
  async function loadWishes() {
    controller?.abort(); controller = new AbortController();
    if (!state.wishesEnabled) return drawWishes([]);
    if (state.preview) return drawWishes(data.wishes);
    const current = generation;
    drawWishes([]);
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(state.invitationId)}/wishes`, { signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error("wishes unavailable");
      const result = await response.json();
      if (current === generation) drawWishes(Array.isArray(result.wishes) ? result.wishes : []);
    } catch (error) {
      if (error.name !== "AbortError" && current === generation) status(data.ui.loadError, true);
    }
  }
  function musicState() {
    if (!data) return;
    const on = !audio.paused && !audio.ended;
    music.classList.toggle("on", on); music.setAttribute("aria-pressed", String(on));
    music.setAttribute("aria-label", on ? data.ui.pause : data.ui.play);
    set("#music-label", on ? data.ui.pause : data.ui.play); $("#music-ico").innerHTML = on ? onIcon : offIcon;
  }
  async function play() {
    if (!musicUrl) return;
    try { await audio.play(); played = true; music.removeAttribute("title"); } catch { music.title = data.ui.musicError; }
    musicState();
  }
  music.addEventListener("click", () => {
    if (!musicUrl) return;
    if (audio.paused) { pausedByGuest = false; void play(); }
    else { pausedByGuest = true; audio.pause(); musicState(); }
  });
  audio.addEventListener("play", musicState); audio.addEventListener("pause", musicState);
  audio.addEventListener("error", () => { if (data) { music.title = data.ui.musicError; musicState(); } });
  // A blocked first attempt may retry once per gesture until it has played.
  document.addEventListener("pointerdown", (event) => {
    if (state && !state.silentPlayback && !played && !pausedByGuest && !music.contains(event.target)) void play();
  });
  function bindMusic() {
    const next = state.music.enabled ? safeUrl(state.music.url) : "";
    visible("#music-fab", Boolean(next)); audio.muted = Boolean(state.silentPlayback);
    if (next !== musicUrl) {
      audio.pause(); audio.removeAttribute("src"); musicUrl = next; played = false; pausedByGuest = false;
      if (next) { audio.src = next; if (!state.preview && !state.silentPlayback) void play(); }
    }
    musicState();
  }
  function tick() {
    if (!data) return;
    const diff = data.target === null ? 0 : Math.max(0, data.target - Date.now());
    const values = [Math.floor(diff / 86400000), Math.floor(diff % 86400000 / 3600000), Math.floor(diff % 3600000 / 60000), Math.floor(diff % 60000 / 1000)];
    ["d", "h", "m", "s"].forEach((key, index) => set(`#cd-${key}`, String(values[index]).padStart(index === 0 ? 3 : 2, "0")));
  }
  setInterval(tick, 1000);
  function apply() {
    data = state.variants[locale]; if (!data) return;
    generation++; document.documentElement.lang = locale;
    document.documentElement.dataset.reduced = String(Boolean(state.reducedMotion));
    document.title = data.title || data.names || "Barakali";
    const u = data.ui;
    for (const [selector, value] of Object.entries({
      ".hero-mono": [data.monogram, data.year].filter(Boolean).join(" · "), ".hero-eye": data.eventLabel,
      ".hero-occasion": u.occasion, ".hero-name": data.names, ".scroll-hint": u.scroll,
      ".greet-eye": data.greeting, ".greet-quote": data.message, ".greet-sign": data.hosts || u.closing,
      ".photo-eye": u.photo, ".photo-cap": data.photo?.caption || data.names,
      ".countdown-eye": u.countdown, ".cd-date": [data.date, data.weekday].filter(Boolean).join(" · "),
      ".details-eye": u.when, ".rsvp-eye": u.wishEye, ".rsvp-title": u.wishTitle,
      ".rsvp-sub": u.wishSub, ".closing-mono": data.names, ".closing-script": u.closing,
      ".closing-meta": [data.date, data.time, data.venue.name].filter(Boolean).join(" · "), ".footer-text": data.year,
    })) set(selector, value);
    $(".hero-name").dataset.long = String(Array.from(data.names).length > 16);
    const heroMeta = all(".hero-meta-cell");
    heroMeta.forEach((node, index) => { node.querySelector(".label").textContent = index ? u.time : u.date; node.querySelector(".hero-meta-val").textContent = index ? data.time : data.date; });
    visible(".hero-meta", Boolean(data.date || data.time));
    visible(".greet", Boolean(data.greeting || data.message || data.hosts));
    visible(".countdown", data.target !== null); tick();
    all(".cd-label").forEach((node, index) => { node.textContent = u.cd[index]; });
    const rows = all(".det-row");
    rows[0].querySelector(".label").textContent = u.dateTime;
    rows[0].querySelector(".det-val").textContent = data.date;
    rows[0].querySelector(".det-sub").textContent = [data.weekday, data.time].filter(Boolean).join(" · ");
    rows[0].hidden = !data.date;
    rows[1].querySelector(".label").textContent = u.address;
    rows[1].querySelector(".det-val").textContent = data.venue.name;
    rows[1].querySelector(".det-sub").textContent = [data.venue.address, data.venue.landmark].filter(Boolean).join(" · ");
    rows[1].hidden = !(data.venue.name || data.venue.address || data.venue.landmark);
    rows[2].querySelector(".label").textContent = u.contact;
    rows[2].querySelector(".det-sub").textContent = u.call;
    rows[2].hidden = !state.phone;
    set("#phone-link", state.phone); $("#phone-link").href = "tel:" + (state.phone || "").replace(/[^+\d]/g, "");
    const hasCoordinates = data.venue.latitude !== null && data.venue.longitude !== null;
    const query = hasCoordinates ? `${data.venue.latitude},${data.venue.longitude}` : [data.venue.name, data.venue.address].filter(Boolean).join(" ");
    $("#map-google").href = safeUrl(data.venue.mapUrl) || `https://maps.google.com/?q=${encodeURIComponent(query)}`;
    $("#map-yandex").href = $("#map-google").href;
    $("#map-yandex").textContent = "Google Maps";
    $("#map-yandex").hidden = $("#map-google").hidden = !(query || safeUrl(data.venue.mapUrl));
    visible(".det-actions", Boolean(query || safeUrl(data.venue.mapUrl)));
    visible(".details", Boolean(data.date || !rows[1].hidden || state.phone || safeUrl(data.venue.mapUrl)));
    const photo = safeUrl(data.photo?.url); visible(".photo-sec", Boolean(photo || state.preview));
    let image = $(".photo-frame img");
    if (photo) {
      if (!image) { image = document.createElement("img"); image.loading = "lazy"; $(".photo-frame").prepend(image); }
      image.dataset.itemId = data.photo.id;
      image.src = photo; image.alt = data.photo.alt || data.names;
      $(".photo-frame").setAttribute("aria-label", image.alt);
    } else image?.remove();
    set(".photo-mono", data.monogram);
    if (!photo) $(".photo-frame").setAttribute("aria-label", data.names || u.photo);
    visible(".photo-mono", !photo);
    visible(".rsvp", state.wishesEnabled);
    $("#g-name").placeholder = u.name; $("#g-name").setAttribute("aria-label", u.name);
    $("#g-text").placeholder = u.message; $("#g-text").setAttribute("aria-label", u.message);
    set("#rsvp-form .btn span:first-child", busy ? u.sending : u.send);
    status("");
    $(".taklifla-lang-current").textContent = ({"uz-Latn":"Uz","uz-Cyrl":"Уз",en:"En",ru:"Ru"})[locale];
    $(".taklifla-lang-toggle").setAttribute("aria-label", u.language);
    visible(".taklifla-lang-switch", state.enabledLocales.length > 1);
    all(".taklifla-lang-menu hr").forEach((node) => { node.hidden = true; });
    all("[data-lang]").forEach((button) => {
      button.hidden = !state.enabledLocales.includes(button.dataset.lang);
      button.classList.toggle("active", button.dataset.lang === locale);
      button.setAttribute("aria-checked", String(button.dataset.lang === locale));
    });
    bindMusic(); void loadWishes(); document.body.dataset.bound = "true";
  }
  const switcher = $(".taklifla-lang-switch"), toggle = $(".taklifla-lang-toggle");
  function menu(open) { switcher.classList.toggle("open", open); toggle.setAttribute("aria-expanded", String(open)); }
  toggle.addEventListener("click", () => menu(!switcher.classList.contains("open")));
  switcher.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang]"); if (!button || !state?.enabledLocales.includes(button.dataset.lang)) return;
    selectedLocale = locale = button.dataset.lang; menu(false); apply(); toggle.focus();
  });
  document.addEventListener("click", (event) => { if (!switcher.contains(event.target)) menu(false); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { menu(false); toggle.focus(); } });
  async function submit(event) {
    event.preventDefault(); if (!state || busy) return;
    const name = $("#g-name").value.trim(), message = $("#g-text").value.trim();
    if (!name || !message) { status(data.ui.required, true); (!name ? $("#g-name") : $("#g-text")).focus(); return; }
    if (state.preview) return status(data.ui.preview);
    if (!state.wishesEnabled) return;
    const current = generation, snapshot = state;
    busy = true; $("#rsvp-form button").disabled = true; set("#rsvp-form .btn span:first-child", data.ui.sending); status("");
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(snapshot.invitationId)}/wishes`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, ...(snapshot.guestToken ? { guestToken: snapshot.guestToken } : {}) }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("wish rejected");
      if (current === generation) { $("#g-text").value = ""; status(data.ui.success); }
      // Pending wish is never optimistically inserted into the approved list.
    } catch { if (current === generation) status(data.ui.error, true); }
    finally { busy = false; $("#rsvp-form button").disabled = false; set("#rsvp-form .btn span:first-child", data.ui.send); }
  }
  $("#rsvp-form").addEventListener("submit", submit);
  $("#g-text").addEventListener("keydown", (event) => { if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) void submit(event); });
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== "taklifla-barakali:update") return;
    const next = event.data.payload;
    if (!next?.enabledLocales?.includes(next.locale) || !next.variants?.[next.locale]) return;
    if (state?.invitationId !== next.invitationId) { selectedLocale = undefined; $("#rsvp-form").reset(); }
    const changedHostLocale = state && state.locale !== next.locale;
    state = next;
    locale = !changedHostLocale && state.enabledLocales.includes(selectedLocale) ? selectedLocale : state.locale;
    if (!$("#g-name").value) $("#g-name").value = state.guestName || "";
    apply();
  });
  parent.postMessage({ type: "taklifla-barakali:ready" }, location.origin);
})();
