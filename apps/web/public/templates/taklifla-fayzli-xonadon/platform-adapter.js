(function () {
  "use strict";
  const TYPE = "taklifla-fayzli-xonadon:update";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const text = (selector, value) => { const node = $(selector); if (node) node.textContent = value || ""; };
  const safeUrl = (value) => typeof value === "string" && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) ? value : "";
  let data, copy = window.XonadonCopy["uz-Latn"], observer, submitted = false, busy = false, userPaused = false, musicAttempted = false, requestVersion = 0;
  const form = $("#rsvp-form"), thanks = $("#rsvp-thanks"), audio = $("#bgMusic"), music = $("#taklifla-music-btn");
  const menuCard=$(".menu-course").cloneNode(true);
  const status = document.createElement("p");
  status.className = "rsvp-status"; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite"); form.after(status);
  function musicState() {
    const playing = !audio.paused && !audio.ended;
    music.classList.toggle("playing", playing);
    text(".taklifla-music-label", playing ? copy.pause : copy.music);
    music.setAttribute("aria-label", playing ? copy.pause : copy.music);
    music.setAttribute("aria-pressed", String(playing));
  }
  async function play() {
    if (!audio.getAttribute("src") || !data || data.silentPlayback || userPaused) return;
    try { await audio.play(); } catch (_) { music.setAttribute("aria-label", copy.blocked); }
    musicState();
  }
  music.addEventListener("click", () => {
    if (!audio.paused) { userPaused = true; audio.pause(); }
    else { userPaused = false; play(); }
  });
  audio.addEventListener("play", musicState); audio.addEventListener("pause", musicState); audio.addEventListener("error", musicState);
  // Retry blocked public autoplay only on a guest gesture; a deliberate pause is preserved.
  document.addEventListener("pointerdown", (event) => {
    if (data && !data.silentPlayback && !userPaused && audio.paused && !music.contains(event.target)) play();
  });
  const switcher = $(".taklifla-lang-switch"), toggle = $(".taklifla-lang-toggle"), menu = $(".taklifla-lang-menu");
  function closeMenu() { switcher.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", () => {
    const open = switcher.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open));
    if (open) menu.querySelector("button")?.focus();
  });
  document.addEventListener("click", (e) => { if (!switcher.contains(e.target)) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && switcher.classList.contains("open")) { closeMenu(); toggle.focus(); } });
  menu.addEventListener("keydown", (e) => {
    const buttons = Array.from(menu.querySelectorAll("button")); const at = buttons.indexOf(document.activeElement);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault(); buttons[e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : (at + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
    }
  });
  function reveal(reduced) {
    document.documentElement.toggleAttribute("data-reduced-motion", reduced);
    if(reduced) $$(".reveal").forEach(el=>el.classList.add("in"));
  }
  function fitName() {
    const el = $(".hero-names"); el.style.fontSize = "";
    const natural = parseFloat(getComputedStyle(el).fontSize);
    if (el.scrollWidth > el.clientWidth) {
      let size = natural;
      while (el.scrollWidth > el.clientWidth && size > 24) { size--; el.style.fontSize = size + "px"; }
    }
  }
  window.addEventListener("resize", fitName);
  function apply(message) {
    if (!message || message.type !== TYPE || !message.payload || !window.XonadonCopy[message.payload.locale]) return;
    const incoming = message.payload;
    if (data && data.invitationId !== incoming.invitationId) {
      submitted = false; requestVersion++; $("#rsvp-name").value = "";
    }
    data = incoming; copy = window.XonadonCopy[data.locale];
    const c = data.content;
    document.documentElement.lang = data.locale;
    document.title = [c.hosts, c.eventLabel || copy.event, data.dateLabel].filter(Boolean).join(" — ");
    text(".hero-eyebrow", c.eventLabel || copy.event); text(".hero-occasion", copy.occasion);
    text(".hero-names", c.hosts); text(".welcome-attr", c.hosts);
    $$(".hero-meta-label").forEach((el, i) => el.textContent = [copy.date, copy.time][i]);
    $$(".hero-meta-val").forEach((el, i) => el.textContent = [data.dateLabel, data.timeLabel][i]);
    $(".hero-meta").hidden=!(data.dateLabel || data.timeLabel);
    text(".scroll-hint", copy.scroll); text(".welcome .eyebrow", c.greeting || copy.welcome);
    text(".welcome-quote", c.message); $(".welcome").hidden = !c.greeting && !c.message && !c.hosts;
    text(".floorplan .eyebrow", copy.plan); text(".floorplan h2", copy.house); text(".floorplan-sub", copy.planSub);
    $$(".fp-label").forEach((el, i) => el.textContent = copy.rooms[i]);
    $$(".fp-sublabel").forEach((el, i) => el.textContent = i === 0 ? copy.entry : copy.rooms[i - 1]);
    $$(".floorplan-legend span").forEach((el, i) => el.textContent = copy.legend[i]);
    $(".menu-list").replaceChildren(...data.menu.map((item,index)=>{const el=menuCard.cloneNode(true);el.dataset.itemId=item.id;el.querySelector(".menu-num").textContent=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][index];for(const key of ["label","name","description"]){el.querySelector(key==="description"?".menu-course-desc":".menu-course-"+key).textContent=item[key];}return el;}));
    $(".menu").hidden=!data.menu.length;
    text(".menu .eyebrow",copy.menuEye);text(".menu h2",copy.menuTitle);text(".menu-sub",copy.menuSub);
    text(".address .eyebrow", copy.address); text(".address h2", copy.home); text(".address-line", c.venueName);
    text(".address-sub", [c.address, c.landmark].filter(Boolean).join("\n"));
    const map = safeUrl(data.mapUrl); $(".map-card").hidden = !map; $(".map-card").href = map || "#";
    text(".map-cta span", copy.map); $(".address").hidden = !c.venueName && !c.address && !map;
    const dress = data.dressCode;
    $(".dress").hidden = !dress.enabled || !(dress.style || dress.text || dress.note || dress.colors.length);
    text(".dress .eyebrow", copy.dress); text(".dress-value", dress.style); text(".dress-desc", [dress.text, dress.note].filter(Boolean).join("\n"));
    $(".dress-swatches").replaceChildren(...dress.colors.map(color => {
      const swatch = document.createElement("div"), circle = document.createElement("div"), label = document.createElement("div");
      swatch.className = "swatch"; swatch.dataset.id = color.id; circle.className = "swatch-circle"; label.className = "swatch-label";
      if (/^#[0-9a-f]{3,8}$/i.test(color.hex)) circle.style.background = color.hex;
      label.textContent = color.name; swatch.append(circle, label); return swatch;
    }));
    $(".rsvp").hidden = !data.rsvp.enabled;
    text(".rsvp .eyebrow", copy.confirmation); text(".rsvp h2", copy.rsvp);
    text(".rsvp-sub", data.rsvp.deadlineLabel ? copy.deadline.replace("{date}", data.rsvp.deadlineLabel) : copy.invite);
    text('label[for="rsvp-name"]', copy.name); text('label[for="rsvp-attend"]', copy.attend);
    $$("#rsvp-attend option").forEach((el, i) => el.textContent = copy.choices[i]);
    text(".btn span", busy ? copy.sending : copy.send); text("#rsvp-thanks", copy.thanks);
    if (!$("#rsvp-name").value && data.guestName) $("#rsvp-name").value = data.guestName;
    const closed = data.rsvp.deadline && Date.now() > Date.parse(data.rsvp.deadline) + 86400000;
    form.hidden = submitted || Boolean(closed); thanks.classList.toggle("show", submitted); status.textContent = closed ? copy.closed : "";
    text(".closing-mono", Array.from(c.hosts || "")[0]?.toLocaleUpperCase() || "");
    text(".closing-line", copy.closing); text(".closing-meta", [data.dateLabel, data.timeLabel, c.venueName].filter(Boolean).join(" · "));
    switcher.hidden = data.enabledLocales.length < 2; switcher.setAttribute("aria-label", copy.language);
    toggle.setAttribute("aria-label", copy.language);
    const labels = {"uz-Latn":"Uz", "uz-Cyrl":"Уз", en:"En", ru:"Ru"};
    text(".taklifla-lang-current", labels[data.locale]);
    menu.replaceChildren(...data.enabledLocales.filter(locale => labels[locale]).map(locale => {
      const btn = document.createElement("button"); btn.type = "button"; btn.textContent = labels[locale]; btn.setAttribute("role", "menuitemradio"); btn.setAttribute("aria-checked", String(locale === data.locale)); btn.classList.toggle("active", locale === data.locale);
      btn.addEventListener("click", () => {
        if (parent !== window) parent.postMessage({ type: "taklifla-fayzli-xonadon:locale", locale }, location.origin);
        closeMenu(); toggle.focus();
      }); return btn;
    }));
    const url = data.music.enabled ? safeUrl(data.music.url) : "";
    music.hidden = !url || Boolean(data.silentPlayback);
    if (audio.getAttribute("src") !== url) {
      audio.pause(); if (url) audio.src = url; else audio.removeAttribute("src");
      musicAttempted = false; userPaused = false;
    }
    if (!data.preview && url && !musicAttempted) { musicAttempted = true; play(); }
    if (data.silentPlayback) audio.pause();
    musicState();
    reveal(Boolean(data.reducedMotion) || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    document.documentElement.setAttribute("data-ready", "");
    fitName(); document.fonts?.ready.then(fitName);
  }
  form.addEventListener("submit", async event => {
    event.preventDefault(); if (!data || busy) return;
    const name = $("#rsvp-name").value.trim();
    $("#rsvp-name").setCustomValidity(name ? "" : copy.required);
    if (!form.reportValidity()) return;
    if (data.preview) { status.textContent = copy.preview; return; }
    const statusValue = $("#rsvp-attend").value;
    const version = requestVersion;
    busy = true; $(".btn").disabled = true; text(".btn span", copy.sending); status.textContent = "";
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(data.invitationId)}/rsvp`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, status: statusValue, partySize: statusValue === "yes" ? 1 : 0, guestToken: data.guestToken || undefined }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("RSVP failed");
      if (version === requestVersion) { submitted = true; form.hidden = true; thanks.classList.add("show"); }
    } catch (_) { if (version === requestVersion) status.textContent = copy.failed; }
    finally { busy = false; $(".btn").disabled = false; text(".btn span", copy.send); }
  });
  $("#rsvp-name").addEventListener("input", () => $("#rsvp-name").setCustomValidity(""));
  window.addEventListener("message", event => {
    if (event.origin !== location.origin || event.source !== parent) return;
    apply(event.data);
  });
  try { apply(JSON.parse(window.name)); } catch (_) { /* No demo fallback or remote runtime. */ }
})();
