/* Contract/service adapter. The captured DOM, CSS and scene engine live in source/. */
(() => {
  "use strict";
  const ID = "wedivo-lanskap-yang-hidup";
  const $ = (id) => document.getElementById(id);
  const put = (id, text) => { const node = $(id); if (node) { node.textContent = text ?? ""; node.classList.toggle("is-empty", !String(text ?? "").trim()); } };
  const show = (id, value) => { const node = $(id); if (node) { node.hidden = !value; node.style.display = value ? "" : "none"; node.classList.toggle("is-empty", !value); } };
  const section = (id, value) => { show(`sec-${id}`, value); show(`ni-${id}`, value); };
  const safeUrl = (value) => { if (!value) return ""; try { const u = new URL(value, location.origin); return ["http:", "https:"].includes(u.protocol) ? u.href : ""; } catch { return ""; } };
  let current, loading = false, started = false, requestGeneration = 0;
  const platform = window.lanskapPlatform = { guestPaused: false, musicPlayed: false };
  const originalFillText = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (text, ...coordinates) { return originalFillText.call(this, window.lanskapTranslate(text), ...coordinates); };
  const template = document.querySelector('template[data-wedivo="comment-template"]');
  function wishes(items) {
    $("wish-list").replaceChildren();
    for (const item of items) {
      const card = template?.content.firstElementChild?.cloneNode(true);
      if (!card) continue;
      card.querySelector('[data-field="name"]').textContent = item.name || "";
      card.querySelector('[data-field="message"]').textContent = item.message || item.text || "";
      const date = card.querySelector('[data-field="date"]');
      if (date) date.textContent = item.createdAt ? new Date(item.createdAt).toLocaleDateString(platform.intlLocale) : "";
      $("wish-list").append(card);
    }
  }
  function bind(payload) {
    const data = payload.data;
    platform.locale = payload.locale;
    platform.intlLocale = { "uz-Latn": "uz-UZ", "uz-Cyrl": "uz-Cyrl-UZ", en: "en-GB", ru: "ru-RU" }[payload.locale] || "en-GB";
    platform.invitationId = payload.invitationId;
    platform.timezone = payload.timezone;
    platform.eventTime = payload.time;
    platform.eventLabel = data.eventType;
    platform.mapUrl = safeUrl(data.venue.mapUrl);
    platform.reducedMotion = payload.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    platform.silentPlayback = Boolean(payload.silentPlayback);
    platform.musicEnabled = Boolean(data.music?.enabled && safeUrl(data.music.url));
    platform.story = data.story || [];
    platform.colors = data.dressCode?.enabled ? data.dressCode.colors || [] : [];
    platform.gallery = (data.gallery || []).filter((item) => safeUrl(item.src));
    document.documentElement.lang = payload.locale;
    document.documentElement.classList.toggle("lanskap-reduced", platform.reducedMotion);
    window.lanskapLocalize();
    for (const [id, value] of Object.entries({
      "cv-bride": data.bride, "hero-bride": data.bride, "close-bride": data.bride,
      "cv-groom": data.groom, "hero-groom": data.groom, "close-groom": data.groom,
      "pf-b-name": data.bride, "pf-g-name": data.groom, "pf-b-full": "", "pf-g-full": "",
      "pf-b-ord": "", "pf-g-ord": "", "pf-b-note": "", "pf-g-note": "",
      "pf-b-parents": "", "pf-g-parents": "", "close-par-b-v": "", "close-par-g-v": "",
      "close-fam": data.hosts, "turut-v": data.hosts, "guest-name": payload.guestName || "", "cv-guest-generic": data.greeting,
      "salam-greet": data.greeting, "salam-invite": data.message, "close-msg": data.message,
      "hero-label": data.eventType, "cv-label": data.eventType, "hero-line": data.title,
      "hero-venue-t": data.venue.name, "loc-name": data.venue.name, "loc-addr": data.venue.address,
      "loc-note": "", "pv-date": payload.date, "pv-time": payload.time,
      "pv-e1end": "", "pv-e2date": "", "pv-e2time": "", "pv-e2end": "", "pv-tz": data.timezone,
      "pv-deadline": data.rsvp?.deadline || "", "ev-1-name": data.eventType,
      "ev-1-venue": data.venue.name, "ev-1-addr": data.venue.address, "ev-1-note": "",
      "ev-2-name": "", "ev-2-venue": "", "ev-2-addr": "", "ev-2-note": "",
      "pv-place": "", "pv-key": "", "pv-live": "", "pv-video": "", "pv-couple": "",
      "salam-ar": "", "salam-verse": "", "salam-src": "", "close-salam": "", "tag-t": "",
      "meet-note": "", "mempelai-intro": "", "kisah-intro": "",
      "busana-text": [data.dressCode?.style, data.dressCode?.text, data.dressCode?.note].filter(Boolean).join("\n\n"),
      "susunan-ttl": data.programHeading,
    })) put(id, value);
    show("salam-rule", false); show("pf-b-par", false); show("pf-g-par", false);
    show("close-par-b", false); show("close-par-g", false); show("tag", false);
    show("turut", Boolean(data.hosts));
    for (const id of ["dress-stage", "swatches", "swatch-hint"]) show(id, platform.colors.length > 0);
    show("ev-2", false); show("checkin", false);
    // These source forms require APIs/fields that the approved contract does not contain.
    section("video", false); section("hadiah", false); section("rambu", false);
    section("rsvp", data.rsvp.enabled); section("doa", data.wishesEnabled);
    section("kisah", platform.story.length > 0); section("susunan", data.program.length > 0);
    section("busana", data.dressCode.enabled && Boolean(platform.colors.length || data.dressCode.text || data.dressCode.style || data.dressCode.note));
    section("galeri", platform.gallery.length > 0);
    section("acara", Boolean(payload.date)); section("menanti", Boolean(payload.date));
    section("lokasi", Boolean(data.venue.name || data.venue.address || data.venue.mapUrl));
    show("hero-venue", Boolean(data.venue.name));
    for (const which of ["b", "g"]) {
      const name = which === "b" ? data.bride : data.groom;
      put(`pf-${which}-ini`, name.trim().charAt(0));
      show(`pf-${which}`, Boolean(name));
      const photo = $("pf-" + which + "-img"); photo.removeAttribute("src");
      $("pf-" + which).classList.add("no-photo");
      const portrait = payload.preview && payload.previewMedia?.[which === "b" ? "bride" : "groom"];
      if (portrait) { photo.src = safeUrl(portrait); photo.alt = name; $("pf-" + which).classList.remove("no-photo"); }
      // The contract has one shared contact set; show that shared Instagram once.
      const ig = data.contacts.find((contact) => contact.type === "instagram");
      show(`pf-${which}-ig`, which === "b" && Boolean(ig));
      put(`pf-${which}-ig-t`, which === "b" ? ig?.value || "" : "");
      if (ig && which === "b") $("pf-b-ig").href = safeUrl(ig.href);
    }
    const coupleImage = platform.gallery[0];
    $("wj").classList.toggle("no-photo", !coupleImage);
    if (coupleImage) { $("wj-img").src = safeUrl(coupleImage.src); $("wj-img").alt = coupleImage.alt || ""; }
    else $("wj-img").removeAttribute("src");
    // Keep every chapter/item ID and order. The original four slots remain the source hooks.
    const bank = $("ks-1-t").parentElement;
    for (let n = 1; n <= Math.max(4, platform.story.length); n++) {
      for (const suffix of ["t", "d", "x"]) {
        let node = $(`ks-${n}-${suffix}`);
        if (!node) { node = document.createElement("span"); node.id = `ks-${n}-${suffix}`; bank.append(node); }
        put(node.id, suffix === "t" ? platform.story[n - 1]?.title || "" : suffix === "x" ? platform.story[n - 1]?.text || "" : "");
      }
    }
    for (let n = 1; n <= Math.max(4, platform.colors.length); n++) {
      for (const suffix of ["c", "n"]) {
        let node = $(`dc-${n}-${suffix}`);
        if (!node) { node = document.createElement("span"); node.id = `dc-${n}-${suffix}`; $("pv").append(node); }
        put(node.id, suffix === "c" ? platform.colors[n - 1]?.hex || "" : platform.colors[n - 1]?.name || "");
      }
    }
    $("wedivo-rundown-data").textContent = JSON.stringify(data.program.map((item) => ({ id: item.id, title: item.title, date: payload.date, startTime: item.time, endTime: "", description: item.description, location: data.venue.name, isAllDay: false })));
    const map = safeUrl(data.venue.mapUrl) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([data.venue.name, data.venue.address].filter(Boolean).join(", "))}`;
    for (const id of ["loc-map", "ev-1-map"]) $(id).href = map;
    // Preserve the source's illustrated map fallback; no provider API key is packaged.
    $("gmap").removeAttribute("src"); $("gmap").removeAttribute("data-src");
    $("map-box").classList.remove("has-embed");
    show("rsvp-pax-l", false); show("pax-box", false); show("rsvp-pax", false);
    $("rsvp-pax")?.parentElement?.setAttribute("hidden", "");
    $("rsvp-pax")?.closest(".field")?.setAttribute("hidden", "");
    if ($( "rsvp-name") && !$("rsvp-name").value) $("rsvp-name").value = payload.guestName || "";
    if ($("wish-name") && !$("wish-name").value) $("wish-name").value = payload.guestName || "";
    document.querySelectorAll("#rsvp-form input, #rsvp-form textarea, #rsvp-form button, #wish-form input, #wish-form textarea, #wish-form button").forEach((node) => { node.disabled = Boolean(payload.preview); });
    wishes(payload.preview ? data.wishes || [] : []);
    const audio = $("bgm"), url = platform.musicEnabled ? safeUrl(data.music.url) : "";
    if (url !== audio.getAttribute("src")) { audio.pause(); if (url) audio.src = url; else audio.removeAttribute("src"); }
    audio.muted = platform.silentPlayback;
    for (const id of ["cv-names", "hero-names", "close-names"]) $(id)?.classList.toggle("long-names", Math.max(data.groom.length, data.bride.length) > 18);
    document.title = [data.bride, data.groom].filter(Boolean).join(" & ") || data.title;
    document.documentElement.classList.add("lanskap-ready");
  }
  async function loadWishes(payload, generation) {
    if (payload.preview || !payload.data.wishesEnabled || !payload.invitationId) return;
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(payload.invitationId)}/wishes`, { credentials: "same-origin" });
      if (!response.ok) return;
      const result = await response.json();
      if (generation === requestGeneration) wishes(result.wishes || []);
    } catch { /* No fictional wishes on service failure. */ }
  }
  function accept(event) {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== `${ID}:update`) return;
    const payload = event.data.payload;
    if (!payload?.data || !["uz-Latn", "uz-Cyrl", "en", "ru"].includes(payload.locale)) return;
    if (JSON.stringify(current) === JSON.stringify(payload)) return;
    current = payload; bind(payload);
    if (!started && !loading) {
      loading = true;
      const script = document.createElement("script"); script.src = "source/template.js";
      script.onload = () => { started = true; loading = false; window.lanskapLocalizeGenerated(); };
      document.body.append(script);
    } else if (started) { window.lanskapRuntime.update(); window.lanskapRuntime.music(); }
    const generation = ++requestGeneration;
    void loadWishes(payload, generation);
  }
  addEventListener("message", accept);
  parent.postMessage({ type: `${ID}:ready` }, location.origin);
  function feedback(form, message, error = false) {
    let node = form.querySelector(".platform-feedback");
    if (!node) { node = document.createElement("p"); node.className = "platform-feedback"; node.setAttribute("role", "status"); node.setAttribute("aria-live", "polite"); form.append(node); }
    node.textContent = message; node.dataset.error = String(error);
  }
  document.querySelectorAll("[data-wedivo-status]").forEach((node) => node.addEventListener("click", () => {
    document.querySelectorAll("[data-wedivo-status]").forEach((button) => { const selected = button === node; button.classList.toggle("is-selected", selected); button.setAttribute("aria-pressed", String(selected)); });
  }));
  $("rsvp-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!current || current.preview || !current.data.rsvp.enabled) return;
    const form = event.currentTarget;
    if (form.dataset.pending === "1") return;
    const status = { attending: "yes", not_attending: "no", maybe: "maybe" }[form.querySelector(".is-selected[data-wedivo-status]")?.dataset.wedivoStatus];
    if (!status) { feedback(form, window.lanskapText("choose"), true); return; }
    const fields = new FormData(form); form.dataset.pending = "1";
    if (!String(fields.get("name") || "").trim()) { delete form.dataset.pending; feedback(form, window.lanskapText("nameRequired"), true); return; }
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/rsvp`, {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fields.get("name"), status, partySize: status === "yes" ? 1 : 0, note: fields.get("message") || "", ...(current.guestToken ? { guestToken: current.guestToken } : {}) }),
      });
      if (!response.ok) throw new Error("rsvp failed");
      form.classList.add("is-submitted"); feedback(form, window.lanskapText("sent"));
    } catch { feedback(form, window.lanskapText("failed"), true); }
    finally { delete form.dataset.pending; }
  });
  $("wish-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!current || current.preview || !current.data.wishesEnabled) return;
    const form = event.currentTarget;
    if (form.dataset.pending === "1") return;
    const fields = new FormData(form); form.dataset.pending = "1";
    if (!String(fields.get("name") || "").trim()) { delete form.dataset.pending; feedback(form, window.lanskapText("nameRequired"), true); return; }
    if (!String(fields.get("message") || "").trim()) { delete form.dataset.pending; feedback(form, window.lanskapText("wishRequired"), true); return; }
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/wishes`, {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fields.get("name"), message: fields.get("message"), ...(current.guestToken ? { guestToken: current.guestToken } : {}) }),
      });
      if (!response.ok) throw new Error("wish failed");
      $("wish-msg").value = ""; feedback(form, window.lanskapText("moderated"));
      // Pending wishes are never inserted into the approved public list/fireflies.
    } catch { feedback(form, window.lanskapText("failed"), true); }
    finally { delete form.dataset.pending; }
  });
  show("wish-more", false);
  $("rsvp-form").noValidate = true;
  $("wish-form").noValidate = true;
  $("gift-form").addEventListener("submit", (event) => event.preventDefault());
})();
