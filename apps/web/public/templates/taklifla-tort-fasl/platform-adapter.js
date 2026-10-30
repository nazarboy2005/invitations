/* Narrow platform bridge. No query-param sample content, provider runtime or storage. */
(() => {
  "use strict";
  const ID = "taklifla-tort-fasl", $ = (id) => document.getElementById(id);
  const audio = $("fs-audio"), form = $("fs-wish-form"), feedback = $("fs-wish-confirm");
  const nativeReduced = matchMedia("(prefers-reduced-motion: reduce)");
  let current, active = "uz-Latn", started = false, opened = false, userPaused = false;
  let approved = [], generation = 0, pending = false, musicKey = "", loadFailed = false;
  const t = (key) => window.fasllarLabels[active]?.[key] || window.fasllarLabels["uz-Latn"][key] || "";
  const text = (id, value) => { $(id).textContent = value || ""; };
  const visible = (id, show) => { $(id).hidden = !show; };
  const safeUrl = (value) => /^(https?:\/\/|\/(?!\/))/i.test(value || "") ? value : "";
  const reduced = () => nativeReduced.matches || Boolean(current?.reducedMotion);
  function musicIcon() {
    const playing = !audio.paused;
    $("fs-music").textContent = playing ? "♫" : "♪";
    $("fs-music").setAttribute("aria-label", t(playing ? "musicPause" : "musicPlay"));
    $("fs-music").setAttribute("aria-pressed", String(playing));
  }
  function tryPlay() {
    if (!current || !safeUrl(current.music?.url) || !current.music.enabled || current.silentPlayback || userPaused || !audio.paused) return;
    audio.play().then(musicIcon).catch(musicIcon);
  }
  $("fs-music").addEventListener("click", () => {
    if (audio.paused) { userPaused = false; tryPlay(); }
    else { userPaused = true; audio.pause(); musicIcon(); }
  });
  audio.addEventListener("play", musicIcon);
  audio.addEventListener("pause", musicIcon);
  document.addEventListener("pointerdown", (event) => { if (opened && !event.target.closest?.("#fs-music")) tryPlay(); }, { passive: true });
  document.addEventListener("keydown", (event) => { if (opened && !event.target.closest?.("#fs-music")) tryPlay(); });
  $("fs-open").addEventListener("click", () => {
    if (opened) return;
    opened = true;
    $("fs-splash").style.opacity = "0";
    $("fs-splash").style.pointerEvents = "none";
    $("fs-splash").inert = true;
    setTimeout(() => { $("fs-splash").style.display = "none"; }, reduced() ? 0 : 950);
    document.body.style.overflow = "";
    $("fs-hero-names").tabIndex = -1;
    $("fs-hero-names").focus({ preventScroll: true });
    tryPlay();
  });
  document.body.style.overflow = "hidden";
  function fitNames() {
    [["splash",30,15],["hero",50,16],["invite",22,11],["foot",27,14]].forEach(([slot, base, min]) => {
      const el = $(`fs-${slot}-names`);
      el.style.whiteSpace = "nowrap";
      let size = base; el.style.fontSize = `${size}px`;
      while (size > min && el.scrollWidth > el.clientWidth + 1) { size -= 1; el.style.fontSize = `${size}px`; }
      if (el.scrollWidth > el.clientWidth + 1) el.style.whiteSpace = "normal";
    });
  }
  window.addEventListener("resize", fitNames);
  function renderWishes() {
    $("fs-wish-list").replaceChildren();
    visible("fs-wish-empty", current.wishesEnabled && !approved.length && !loadFailed);
    approved.forEach((wish) => {
      const card = document.createElement("div");
      card.style.cssText = "background:rgba(255,248,238,.88);border-radius:16px;padding:14px 16px;box-shadow:0 8px 20px rgba(90,45,15,.2);";
      const name = document.createElement("div"), message = document.createElement("div");
      name.style.cssText = "font-family:'Vollkorn',serif;font-weight:700;font-size:14.5px;color:#8a5a2e;";
      message.style.cssText = "margin-top:4px;font-size:13px;line-height:1.55;color:#6a563f;white-space:pre-wrap;overflow-wrap:anywhere;";
      name.textContent = wish.name; message.textContent = wish.message;
      card.append(name, message); $("fs-wish-list").append(card);
    });
  }
  function status(message, error = false) {
    feedback.hidden = false; feedback.style.display = "block";
    feedback.textContent = message;
    feedback.setAttribute("role", error ? "alert" : "status");
  }
  let closedPanel;
  function closingState() {
    if (!current) return;
    const closed = Boolean(current.instant && Date.now() >= current.instant + 86400000);
    form.hidden = !current.wishesEnabled || closed;
    if (closed && !closedPanel) {
      closedPanel = window.buildFasllarClosingPanel("#a2506f");
      closedPanel.setAttribute("data-source-closed-panel", "");
      form.after(closedPanel);
    }
    if (closedPanel) {
      closedPanel.hidden = !current.wishesEnabled || !closed;
      closedPanel.children[1].textContent = t("closed");
      closedPanel.children[2].textContent = t("closedTitle");
      closedPanel.children[3].textContent = t("closedBody");
    }
  }
  function countdown() {
    if (!current) return;
    const diff = Math.max(0, (current.instant || Date.now()) - Date.now());
    const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
    ["d","h","m","s"].forEach((key, i) => text(`fs-cd-${key}`, current.instant ? String(values[i]).padStart(2,"0") : "—"));
    closingState();
  }
  setInterval(countdown, 1000);
  function render() {
    const v = current.variants[active];
    if (!v) return;
    document.documentElement.lang = active;
    document.documentElement.classList.toggle("fs-reduced", reduced());
    document.title = v.title || "To‘rt fasl";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const label = t(el.dataset.i18n);
      if (label) el.innerHTML = label; // Trusted bundled UI copy only; authored fields use textContent below.
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPh); el.setAttribute("aria-label", t(el.dataset.i18nPh));
    });
    document.querySelector(".fs-lang").setAttribute("aria-label", t("language"));
    document.querySelectorAll(".fs-lang button").forEach((button) => {
      button.hidden = !current.enabledLocales.includes(button.dataset.lang);
      button.classList.toggle("on", button.dataset.lang === active);
      button.setAttribute("aria-pressed", String(button.dataset.lang === active));
    });
    document.querySelector(".fs-lang").hidden = current.enabledLocales.length < 2;
    ["hero","splash","invite","foot"].forEach((slot) => {
      text(`fs-${slot}-n1`, v.people[0]); text(`fs-${slot}-n2`, v.people[1]);
      visible(`fs-${slot}-joiner`, Boolean(v.people[1]));
    });
    text("fs-splash-mono", v.people.slice(0,2).map((name) => Array.from(name)[0]).join(" · "));
    text("fs-hero-date", current.dateNumeric);
    text("fs-foot-date", current.dateNumeric.replaceAll(" · ", "."));
    text("fs-invite-date", v.dateLong); text("fs-winter-date", v.dateLong); text("fs-winter-time", v.time);
    visible("fs-winter-time", Boolean(v.time));
    text("fs-invite-text", v.message); visible("fs-invite-text", Boolean(v.message));
    const greeting = document.querySelector('[data-i18n="invite_heading"]');
    greeting.textContent = v.greeting || t("invite_heading");
    if (v.eventLabel) ["hero_kicker","splash_kicker"].forEach((key) => { document.querySelector(`[data-i18n="${key}"]`).textContent = v.eventLabel; });
    visible("fs-hero-city-wrap", false); // No separate city field; never guess from an authored address.
    ["hero-venue","venue-name","winter-venue"].forEach((id) => text(`fs-${id}`,v.venueName));
    text("fs-venue-addr", v.address);
    const url = safeUrl(current.mapUrl) || (v.address || v.venueName ? `https://yandex.uz/maps/?text=${encodeURIComponent(v.address || v.venueName)}` : "");
    $("fs-map").href = url || "#"; visible("fs-map", Boolean(url));
    $("fs-venue-name").parentElement.hidden = !v.venueName && !v.address && !url;
    text("fs-detail-dress-text", v.dressText); visible("fs-detail-dress", Boolean(v.dressText || v.colors.length));
    const swatches = $("fs-detail-dress").lastElementChild;
    swatches.replaceChildren();
    v.colors.forEach((color) => {
      if (!/^#[0-9a-f]{3,8}$/i.test(color.hex)) return;
      const dot = document.createElement("span");
      dot.style.cssText = `width:15px;height:15px;flex:none;border-radius:50%;background:${color.hex};border:2px solid #fff;`;
      dot.title = color.name; swatches.append(dot);
    });
    swatches.style.flexWrap = "wrap"; swatches.style.maxWidth = "44%";
    const reply = $("fs-detail-rsvp-text"); reply.replaceChildren();
    if (current.replyEnabled && v.deadline) reply.append(t("replyBy") + v.deadline + (current.phone ? " — " : ""));
    if (current.phone) {
      const a = document.createElement("a"); a.href = `tel:${current.phone.replace(/[^+\d]/g,"")}`; a.textContent = current.phone; a.style.fontWeight = "700"; reply.append(a);
    }
    visible("fs-detail-rsvp", Boolean(current.phone || current.replyEnabled && v.deadline));
    visible("fs-detail-flowers", current.wishesEnabled);
    visible("fs-details-card", !$("fs-detail-dress").hidden || !$("fs-detail-rsvp").hidden || !$("fs-detail-flowers").hidden);
    const rows = v.program.filter((row) => row.title || row.time || row.description);
    visible("fs-events-wrap", Boolean(rows.length));
    const host = $("fs-events"), spine = host.firstElementChild; host.replaceChildren(spine);
    rows.forEach((row, i) => {
      const el = $("fs-event-template").content.firstElementChild.cloneNode(true);
      el.dataset.itemId = row.id;
      el.firstElementChild.style.background = ["#f6a8c4","#4f8f4d","#ef953f","#b9c9ec"][i % 4];
      el.querySelector("[data-event-title]").textContent = [row.time,row.title].filter(Boolean).join(" — ");
      el.querySelector("[data-event-description]").textContent = row.description;
      host.append(el);
    });
    if (v.programHeading) document.querySelector('[data-i18n="program_title"]').textContent = v.programHeading;
    ["wishes_script","wishes_title"].forEach((key) => { document.querySelector(`[data-i18n="${key}"]`).hidden = !current.wishesEnabled; });
    visible("fs-wish-list",current.wishesEnabled); feedback.hidden = true;
    if (loadFailed) status(t("loading"), true);
    if(current.preview) approved=v.sampleWishes || [];
    renderWishes(); countdown();
    const musicUrl = current.music.enabled ? safeUrl(current.music.url) : "";
    if (musicUrl !== musicKey) { audio.pause(); userPaused = false; musicKey = musicUrl; if (musicUrl) audio.src = musicUrl; else audio.removeAttribute("src"); }
    audio.muted = Boolean(current.silentPlayback);
    $("fs-music").style.display = musicUrl ? "flex" : "none";
    $("fs-music").style.alignItems = "center"; $("fs-music").style.justifyContent = "center";
    musicIcon();
    if (!started) { started = true; window.startFasllarMotion(); }
    else window.revealFasllar();
    document.documentElement.classList.add("fs-ready");
    fitNames(); document.fonts.ready.then(fitNames);
    if (!current.preview || opened) tryPlay();
  }
  document.querySelector(".fs-lang").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-lang]");
    if (button && current.enabledLocales.includes(button.dataset.lang)) { active = button.dataset.lang; render(); }
  });
  nativeReduced.addEventListener("change", () => { if (current) render(); });
  async function loadWishes(version) {
    if (!current || current.preview || !current.wishesEnabled || !current.invitationId) return;
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/wishes`, { credentials: "same-origin" });
      if (!response.ok) throw new Error("load");
      const result = await response.json();
      if (version !== generation) return;
      approved = Array.isArray(result.wishes) ? result.wishes : []; loadFailed = false; renderWishes();
    } catch { if (version === generation) { loadFailed = true; renderWishes(); status(t("loading"),true); } }
  }
  window.addEventListener("message", (event) => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== `${ID}:update`) return;
    const p = event.data.payload;
    if (!p?.variants || !Array.isArray(p.enabledLocales) || !p.enabledLocales.includes(p.locale) || !p.variants[p.locale]) return;
    const identityChanged = current?.invitationId !== p.invitationId || current?.preview !== p.preview;
    current = p; active = p.locale; generation++;
    if (identityChanged) { approved = []; loadFailed = false; form.reset(); form.elements.wname.value = p.guestName || ""; }
    render(); loadWishes(generation);
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!current || pending || form.hidden) return;
    if (current.preview) { status(t("preview")); return; }
    const name = form.elements.wname.value.trim(), message = form.elements.wmsg.value.trim();
    if (!name || !message) { status(t("required"), true); return; }
    const sentFor = generation, invitationId = current.invitationId;
    pending = true; form.querySelector("button").disabled = true;
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(invitationId)}/wishes`, {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, ...(current.guestToken ? { guestToken: current.guestToken } : {}) }),
      });
      if (!response.ok) throw new Error("submit");
      const result = await response.json();
      if (result.ok !== true) throw new Error("submit");
      if (sentFor === generation) { form.elements.wmsg.value = ""; status(t("wish_thanks")); }
      // Pending submission never enters the public approved list.
    } catch { if (sentFor === generation) status(t("failed"), true); }
    finally { pending = false; form.querySelector("button").disabled = false; }
  });
  parent.postMessage({ type: `${ID}:ready` }, location.origin);
})();
