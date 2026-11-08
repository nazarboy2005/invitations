(() => {
  "use strict";
  const locales = { uz: "uz-Latn", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" };
  const labelsByLocale = {
    "uz-Latn": { program: "To'y dasturi", map: "Xaritada ochish", contact: "Bog'lanish", gift: "To'yona", copy: "Karta raqamini nusxalash", copied: "Nusxa olindi", name: "Ismingiz", attend: "To'yga kelasizmi?", yes: "Ha, albatta boraman", no: "Afsus, bora olmayman", wish: "Tilagingiz", submit: "Yuborish", thanks: "Tilagingiz uchun rahmat!", days: ["Kun", "Soat", "Daqiqa", "Soniya"], weekdays: ["Du", "Se", "Chor", "Pay", "Ju", "Sha", "Ya"] },
    "uz-Cyrl": { program: "\u0422\u045e\u0439 \u0434\u0430\u0441\u0442\u0443\u0440\u0438", map: "\u0425\u0430\u0440\u0438\u0442\u0430\u0434\u0430 \u043e\u0447\u0438\u0448", contact: "\u0411\u043e\u0493\u043b\u0430\u043d\u0438\u0448", gift: "\u0422\u045e\u0451\u043d\u0430", copy: "\u041a\u0430\u0440\u0442\u0430 \u0440\u0430\u049b\u0430\u043c\u0438\u043d\u0438 \u043d\u0443\u0441\u0445\u0430\u043b\u0430\u0448", copied: "\u041d\u0443\u0441\u0445\u0430 \u043e\u043b\u0438\u043d\u0434\u0438", name: "\u0418\u0441\u043c\u0438\u043d\u0433\u0438\u0437", attend: "\u0422\u045e\u0439\u0433\u0430 \u043a\u0435\u043b\u0430\u0441\u0438\u0437\u043c\u0438?", yes: "\u04b2\u0430, \u0431\u043e\u0440\u0430\u043c\u0430\u043d", no: "\u0411\u043e\u0440\u0430 \u043e\u043b\u043c\u0430\u0439\u043c\u0430\u043d", wish: "\u0422\u0438\u043b\u0430\u0433\u0438\u043d\u0433\u0438\u0437", submit: "\u042e\u0431\u043e\u0440\u0438\u0448", thanks: "\u0420\u0430\u04b3\u043c\u0430\u0442!", days: ["\u041a\u0443\u043d", "\u0421\u043e\u0430\u0442", "\u0414\u0430\u049b\u0438\u049b\u0430", "\u0421\u043e\u043d\u0438\u044f"], weekdays: ["\u0414\u0443", "\u0421\u0435", "\u0427\u043e\u0440", "\u041f\u0430\u0439", "\u0416\u0443", "\u0428\u0430", "\u042f\u043a"] },
    en: { program: "Program", map: "Open map", contact: "Contact", gift: "Wedding gift", copy: "Copy card number", copied: "Copied", name: "Your name", attend: "Will you attend?", yes: "Yes, I will", no: "Sorry, I cannot attend", wish: "Your wish", submit: "Send", thanks: "Thank you for your kind words!", days: ["Days", "Hours", "Minutes", "Seconds"], weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    ru: { program: "\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430", map: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0430\u0440\u0442\u0443", contact: "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b", gift: "\u041f\u043e\u0434\u0430\u0440\u043e\u043a \u043c\u043e\u043b\u043e\u0434\u043e\u0436\u0451\u043d\u0430\u043c", copy: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043d\u043e\u043c\u0435\u0440 \u043a\u0430\u0440\u0442\u044b", copied: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u043e", name: "\u0412\u0430\u0448\u0435 \u0438\u043c\u044f", attend: "\u0412\u044b \u043f\u0440\u0438\u0434\u0451\u0442\u0435?", yes: "\u0414\u0430, \u0431\u0443\u0434\u0443", no: "\u041a \u0441\u043e\u0436\u0430\u043b\u0435\u043d\u0438\u044e, \u043d\u0435 \u0441\u043c\u043e\u0433\u0443", wish: "\u0412\u0430\u0448\u0435 \u043f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u0435", submit: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c", thanks: "\u0421\u043f\u0430\u0441\u0438\u0431\u043e!", days: ["\u0414\u043d\u0438", "\u0427\u0430\u0441\u044b", "\u041c\u0438\u043d\u0443\u0442\u044b", "\u0421\u0435\u043a\u0443\u043d\u0434\u044b"], weekdays: ["\u041f\u043d", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041f\u0442", "\u0421\u0431", "\u0412\u0441"] },
  };
  let data = {};
  try { data = JSON.parse(window.name || "{}"); } catch {}
  const locale = locales[data.defaultLang] || "uz-Latn";
  const labels = labelsByLocale[locale] || labelsByLocale["uz-Latn"];
  const months = {
    "uz-Latn": ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
    "uz-Cyrl": ["\u044f\u043d\u0432\u0430\u0440", "\u0444\u0435\u0432\u0440\u0430\u043b", "\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440\u0435\u043b", "\u043c\u0430\u0439", "\u0438\u044e\u043d", "\u0438\u044e\u043b", "\u0430\u0432\u0433\u0443\u0441\u0442", "\u0441\u0435\u043d\u0442\u044f\u0431\u0440", "\u043e\u043a\u0442\u044f\u0431\u0440", "\u043d\u043e\u044f\u0431\u0440", "\u0434\u0435\u043a\u0430\u0431\u0440"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    ru: ["\u044f\u043d\u0432\u0430\u0440\u044f", "\u0444\u0435\u0432\u0440\u0430\u043b\u044f", "\u043c\u0430\u0440\u0442\u0430", "\u0430\u043f\u0440\u0435\u043b\u044f", "\u043c\u0430\u044f", "\u0438\u044e\u043d\u044f", "\u0438\u044e\u043b\u044f", "\u0430\u0432\u0433\u0443\u0441\u0442\u0430", "\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f", "\u043e\u043a\u0442\u044f\u0431\u0440\u044f", "\u043d\u043e\u044f\u0431\u0440\u044f", "\u0434\u0435\u043a\u0430\u0431\u0440\u044f"]
  };
  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const set = (selector, value) => { const node = one(selector); if (node) node.textContent = value || ""; };
  const visible = (node, show) => { if (node) node.hidden = !show; };
  document.documentElement.lang = data.defaultLang || "uz";
  document.title = data.title || [data.groom, data.bride].filter(Boolean).join(" & ") || "Taklifnoma";
  set(".hero-event", data.eventType || "");
  set(".hero-groom", data.groom || "");
  set(".hero-bride", data.bride || "");
  [one(".hero-groom"), one(".hero-bride")].forEach(node => { if (node) node.style.fontSize = (node.textContent.length > 14 ? 70 : node.textContent.length > 10 ? 88 : node.textContent.length > 7 ? 102 : 120) + "px"; });
  set(".greeting", data.greeting || "");
  set(".invite-copy", data.message || "");
  set(".venue-name", data.venue && data.venue.name || "");
  set(".venue-address", data.venue && data.venue.address || "");
  const day = Number(data.date && data.date.day), month = Number(data.date && data.date.monthNumber), year = Number(data.date && data.date.year);
  if (day && month && year) {
    const eventDate = new Date(year, month - 1, day);
    const monday = new Date(eventDate);
    monday.setDate(eventDate.getDate() - ((eventDate.getDay() + 6) % 7));
    const heartTemplate = one("svg.cal-heart")?.cloneNode(true);
    const values = all(".cal-days span");
    values.forEach((node, index) => {
      const current = new Date(monday); current.setDate(monday.getDate() + index);
      const selected = current.getMonth() === month - 1 && current.getDate() === day;
      node.classList.toggle("cal-day--mark", selected);
      node.replaceChildren(document.createTextNode(String(current.getDate())));
      if (selected && heartTemplate) node.append(heartTemplate.cloneNode(true));
    });
    all(".cal-week span").forEach((node, index) => { node.textContent = labels.weekdays[index]; });
    const heading = one(".calendar-heading");
    if (heading) heading.textContent = ((months[locale] || months["uz-Latn"])[month - 1] + " " + year) + (data.date.time ? " ? " + data.date.time : "");
  } else {
    visible(one(".calendar-heading"), false);
    visible(one(".cal-row"), false);
    all(".cal-row").forEach(node => visible(node, false));
  }
  const countdown = one("#p2-cd");
  if (countdown) { countdown.dataset.target = data.dateTime || ""; visible(countdown, Boolean(data.dateTime)); }
  const audio = one("#bg-audio"), musicUrl = data.music || "";
  if (audio) {
    all("source", audio).forEach(node => node.remove());
    audio.pause(); audio.removeAttribute("src"); audio.muted = Boolean(data.silentPlayback);
    if (musicUrl) { audio.src = musicUrl; audio.load(); }
    visible(one("#musicBtn"), Boolean(musicUrl));
  }
  const mapUrl = data.venue && data.venue.mapUrl;
  if (mapUrl && /^https?:\/\//i.test(mapUrl)) {
    const link = document.createElement("a");
    link.className = "tm-map"; link.href = mapUrl; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = labels.map;
    one(".addr") && one(".addr").append(link);
  }
  const form = one("#wishForm"), rsvpEnabled = Boolean(data.rsvp && data.rsvp.enabled), wishesEnabled = Boolean(data.wishesEnabled);
  const contacts = (data.contacts || []).filter(item => item.href && item.value);
  if (form) {
    const fields = all(".rsvp__label", form);
    if (fields[0]) fields[0].textContent = labels.name;
    if (fields[1]) fields[1].textContent = labels.attend;
    if (fields[2]) fields[2].textContent = labels.wish;
    const radios = all(".rsvp__radio", form);
    radios.forEach((label, index) => {
      visible(label, rsvpEnabled);
      const input = one("input", label);
      if (input) { input.required = rsvpEnabled && index === 0; input.value = index === 1 ? "no" : "yes"; }
      if (label.lastChild && label.lastChild.nodeType === Node.TEXT_NODE) label.lastChild.textContent = index === 1 ? labels.no : labels.yes;
    });
    if (fields[1]) visible(fields[1], rsvpEnabled);
    if (fields[2]) visible(fields[2], wishesEnabled);
    const nameInput = one('[name="name"]', form);
    if (nameInput) { nameInput.placeholder = labels.name; nameInput.maxLength = 100; if (data.name) nameInput.value = data.name; }
    const wishInput = one('[name="wish"]', form);
    if (wishInput) { wishInput.placeholder = labels.wish; wishInput.maxLength = 2000; visible(wishInput, wishesEnabled); }
    const submit = one('button[type="submit"]', form); if (submit) submit.textContent = labels.submit;
    const thanks = one(".rsvp__thanks", form); if (thanks) thanks.textContent = labels.thanks;
    visible(form, rsvpEnabled || wishesEnabled);
    form.addEventListener("submit", async event => {
      event.preventDefault(); event.stopImmediatePropagation();
      const guestName = one('[name="name"]', form).value.trim();
      const wish = one('[name="wish"]', form).value.trim();
      const selected = one('[name="attend"]:checked', form);
      const error = one(".rsvp__error", form);
      if (error) error.textContent = "";
      if (!guestName || (rsvpEnabled && !selected) || (wishesEnabled && !wish)) { if (error) error.textContent = labels.name; return; }
      if (data.preview || !data.slug) { form.classList.add("done"); return; }
      if (submit) submit.disabled = true;
      const base = data.apiBase || "/api/public/invitations/" + encodeURIComponent(data.slug);
      const status = selected && selected.value === "no" ? "no" : "yes";
      const requests = [];
      if (rsvpEnabled) requests.push(fetch(base + "/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: guestName, status, partySize: status === "yes" ? 1 : 0, guestToken: data.guestToken || undefined }) }));
      if (wishesEnabled && wish) requests.push(fetch(base + "/wishes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: guestName, message: wish, guestToken: data.guestToken || undefined }) }));
      try {
        const responses = await Promise.all(requests);
        for (const response of responses) { const result = await response.json().catch(() => ({})); if (!response.ok) throw new Error(result.message || result.error || "Please try again."); }
        form.classList.add("done");
      } catch (errorValue) { if (error) error.textContent = errorValue.message || "Please try again."; }
      finally { if (submit) submit.disabled = false; }
    }, true);
  }
  const extras = document.createElement("div");
  extras.className = "tm-extras";
  const design = one("#design");
  if (design) design.append(extras);
  function addSection(className, title) {
    const section = document.createElement("section"); section.className = "tm-extra " + className;
    if (title) { const heading = document.createElement("h2"); heading.textContent = title; section.append(heading); }
    extras.append(section); return section;
  }
  const program = (data.program || []).filter(item => item.title || item.time);
  if (program.length) {
    const section = addSection("tm-program", data.programHeading || labels.program);
    program.forEach(item => { const row = document.createElement("div"); row.className = "tm-program-row"; const time = document.createElement("span"); time.textContent = item.time || ""; const title = document.createElement("span"); title.textContent = item.title || ""; row.append(time, title); section.append(row); });
  }
  if (contacts.length) {
    const section = addSection("tm-contacts", labels.contact);
    contacts.forEach(item => { const link = document.createElement("a"); link.href = item.href; link.textContent = item.label ? item.label + ": " + item.value : item.value; if (item.href.startsWith("http")) { link.target = "_blank"; link.rel = "noopener noreferrer"; } section.append(link); });
  }
  const photos = (data.gallery || []).filter(item => item.src);
  if (photos.length) {
    const section = addSection("tm-gallery", "");
    const grid = document.createElement("div"); grid.className = "tm-gallery-grid";
    photos.forEach(item => { const figure = document.createElement("figure"); const image = document.createElement("img"); image.src = item.src; image.alt = item.alt || item.caption || ""; figure.append(image); grid.append(figure); });
    section.append(grid);
  }
  const gift = data.toyona || {};
  if (!data.catalogPreview && gift.enabled && gift.cardNumber && gift.cardHolder) {
    const section = addSection("tm-gift", labels.gift);
    const ornament = document.createElement("div"); ornament.className = "tm-gift-ornament"; ornament.setAttribute("aria-hidden", "true"); ornament.textContent = "\u2766";
    const number = document.createElement("p"); number.className = "tm-gift-number"; number.dir = "ltr"; number.textContent = gift.cardNumber;
    const holder = document.createElement("p"); holder.className = "tm-gift-holder"; holder.textContent = gift.cardHolder;
    const button = document.createElement("button"); button.type = "button"; button.className = "tm-gift-copy"; button.textContent = labels.copy;
    button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(gift.cardNumber); } catch { const field = document.createElement("textarea"); field.value = gift.cardNumber; document.body.append(field); field.select(); document.execCommand("copy"); field.remove(); } button.textContent = labels.copied; setTimeout(() => { if (button.isConnected) button.textContent = labels.copy; }, 1800); });
    section.append(ornament, number, holder, button);
  }
  extras.style.position = "absolute"; extras.style.left = "24px"; extras.style.top = "4180px"; extras.style.width = "442px";
  if (design) design.style.height = Math.max(4451, 4180 + extras.scrollHeight + 100) + "px";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("qaReducedMotion") === "1") document.documentElement.dataset.reducedMotion = "true";
  window.addEventListener("message", event => {
    if (event.origin !== location.origin || event.data?.type !== "marxaba:update" || !event.data.payload) return;
    const next = JSON.stringify(event.data.payload);
    if (next !== window.name) { window.name = next; location.reload(); }
  });
})();
