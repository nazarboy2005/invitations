(() => {
  "use strict";
  const locales = { uz: "uz-Latn", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" };
  const text = {
    "uz-Latn": { invite: "Taklifnoma", event: "Nikoh kuni", date: "To'yimiz vaqti", place: "Manzil", wishes: "Mehmonlar tilaklari", wishesHint: "Samimiy tilaklaringizni bildirish uchun pastdagi tugmani bosing", open: "Tilak bildirish", submit: "Yuborish", name: "Ismingiz", attend: "To'yga kelasizmi?", choose: "Tanlang...", yes: "Ha, albatta kelaman", no: "Afsus, kela olmayman", maybe: "Keyinroq aniq aytaman", wish: "Tilagingiz", thanks: "Rahmat!", map: "Xaritada ko'rish", replyBy: "Javob berish muddati", gift: "To'yona", copy: "Karta raqamini nusxalash", copied: "Nusxa olindi", days: ["Kun", "Soat", "Daqiqa", "Soniya"], until: "To'yimizgacha" },
    "uz-Cyrl": { invite: "Taklifnoma", event: "Nikoh kuni", date: "To'yimiz vaqti", place: "Manzil", wishes: "Mehmonlar tilaklari", wishesHint: "Samimiy tilaklaringizni bildiring", open: "Tilak bildirish", submit: "Yuborish", name: "Ismingiz", attend: "To'yga kelasizmi?", choose: "Tanlang...", yes: "Ha, kelaman", no: "Kela olmayman", maybe: "Keyinroq aytaman", wish: "Tilagingiz", thanks: "Rahmat!", map: "Xaritani ochish", replyBy: "Javob muddati", gift: "To'yona", copy: "Karta raqamini nusxalash", copied: "Nusxa olindi", days: ["Kun", "Soat", "Daqiqa", "Soniya"], until: "To'yimizgacha" },
    en: { invite: "Invitation", event: "Wedding day", date: "Our celebration", place: "Location", wishes: "Guest wishes", wishesHint: "Share a few kind words with us", open: "RSVP or send a wish", submit: "Send", name: "Your name", attend: "Will you attend?", choose: "Please choose...", yes: "Yes, I will", no: "Sorry, I cannot attend", maybe: "I will confirm later", wish: "Your wish", thanks: "Thank you!", map: "Open map", replyBy: "Please reply by", gift: "Wedding gift", copy: "Copy card number", copied: "Copied", days: ["Days", "Hours", "Minutes", "Seconds"], until: "Until the celebration" },
    ru: { invite: "\u041f\u0440\u0438\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435", event: "\u0414\u0435\u043d\u044c \u0441\u0432\u0430\u0434\u044c\u0431\u044b", date: "\u0412\u0440\u0435\u043c\u044f \u0442\u043e\u0440\u0436\u0435\u0441\u0442\u0432\u0430", place: "\u041c\u0435\u0441\u0442\u043e", wishes: "\u041f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u044f \u0433\u043e\u0441\u0442\u0435\u0439", wishesHint: "\u041e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u043d\u0430\u043c \u0434\u043e\u0431\u0440\u044b\u0435 \u0441\u043b\u043e\u0432\u0430", open: "\u041e\u0442\u0432\u0435\u0442\u0438\u0442\u044c", submit: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c", name: "\u0412\u0430\u0448\u0435 \u0438\u043c\u044f", attend: "\u0412\u044b \u043f\u0440\u0438\u0434\u0451\u0442\u0435?", choose: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435...", yes: "\u0414\u0430, \u0431\u0443\u0434\u0443", no: "\u041d\u0435 \u0441\u043c\u043e\u0433\u0443", maybe: "\u0421\u043e\u043e\u0431\u0449\u0443 \u043f\u043e\u0437\u0436\u0435", wish: "\u041f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u0435", thanks: "\u0421\u043f\u0430\u0441\u0438\u0431\u043e!", map: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0430\u0440\u0442\u0443", replyBy: "\u041e\u0442\u0432\u0435\u0442 \u0434\u043e", gift: "\u041f\u043e\u0434\u0430\u0440\u043e\u043a", copy: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043d\u043e\u043c\u0435\u0440", copied: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u043e", days: ["\u0414\u043d\u0438", "\u0427\u0430\u0441\u044b", "\u041c\u0438\u043d\u0443\u0442\u044b", "\u0421\u0435\u043a\u0443\u043d\u0434\u044b"], until: "\u0414\u043e \u0442\u043e\u0440\u0436\u0435\u0441\u0442\u0432\u0430" },
  };
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const read = () => { try { return JSON.parse(window.name || "{}"); } catch { return {}; } };
  const data = read();
  window.__taklifnomaPayload = data;
  const locale = locales[data.defaultLang] || "uz-Latn";
  const labels = text[locale];
  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const set = (selector, value) => { const node = one(selector); if (node) node.textContent = value || ""; };
  const visible = (node, show) => { if (node) node.hidden = !show; };
  const people = [data.groom, data.bride].filter(Boolean);
  const displayNames = people.join(" & ");
  const fullDate = data.date?.long || data.date?.short || "";
  document.documentElement.lang = data.defaultLang || "uz";
  document.title = data.title || displayNames || labels.invite;
  set(".intro__eyebrow", data.title || labels.invite);
  set(".intro__names", displayNames);
  set(".intro__date", fullDate);
  set(".hero__event", data.eventType || labels.event);
  set(".hero__date", fullDate);
  const heroNames = one(".hero__names");
  if (heroNames) {
    heroNames.replaceChildren();
    if (people[0]) heroNames.append(document.createTextNode(people[0]));
    const ampersand = document.createElement("span"); ampersand.textContent = "&";
    const lineBreak = document.createElement("br");
    heroNames.append(lineBreak, ampersand, document.createElement("br"));
    if (people[1]) heroNames.append(document.createTextNode(people[1]));
  }
  set(".greet", data.greeting || "");
  set(".invite-copy", data.message || "");
  set(".venue__name", data.venue?.name || "");
  set(".venue__city", data.venue?.address || "");
  set(".date-heading", labels.date);
  set(".venue-heading", labels.place);
  set(".wishes-title", labels.wishes);
  set(".wishes-hint", labels.wishesHint);
  set(".countdown-title", labels.until);
  const pill = one(".pill");
  if (pill) pill.childNodes[0].textContent = locale === "en" ? "Scroll down " : locale === "ru" ? "Prokrutite vniz " : "Pastga suring ";
  set(".greet-title", data.greeting || "");
  const dateSection = one("#sec-date");
  if (dateSection) {
    const date = data.date || {};
    const values = [date.day, date.monthNumber ? String(date.monthNumber).padStart(2, "0") : "", date.year];
    all(".scard__val").forEach((node, index) => { node.textContent = values[index] || ""; });
    const dateLabels = locale === "en" ? ["DAY", "MONTH", "YEAR"] : locale === "ru" ? ["Day", "...", "?"] : locale === "uz-Cyrl" ? ["?", "Day", "?"] : ["Kun", "Oy", "Yil"];
    all(".scard .lbl").forEach((node, index) => { node.textContent = dateLabels[index] || ""; });
  }
  const countdown = one("#sec-cd");
  if (countdown) { countdown.dataset.target = data.dateTime || ""; visible(countdown, Boolean(data.dateTime)); visible(one(".countdown-title"), Boolean(data.dateTime)); all(".cd-lbl").forEach((node) => visible(node, Boolean(data.dateTime))); }
  const startTime = data.rsvpDetails?.deadline;
  if (startTime) {
    const deadline = document.createElement("p");
    deadline.className = "tm-reply-deadline";
    deadline.textContent = `${labels.replyBy}: ${new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: data.timezone || "Asia/Tashkent" }).format(new Date(`${startTime}T12:00:00Z`))}`;
    one("#sec-cd")?.after(deadline);
  }
  const video = one(".hero__video");
  const heroImage = data.gallery?.[0]?.src;
  if (video && heroImage) {
    const poster = heroImage;
    video.poster = poster;
  }
  const audio = one("#bg-audio");
  const musicUrl = data.music || "";
  if (audio) {
    all("source", audio).forEach((source) => source.remove());
    audio.muted = Boolean(data.silentPlayback);
    if (musicUrl) { audio.src = musicUrl; audio.load(); }
    else { audio.pause(); audio.removeAttribute("src"); }
    visible(one("#musicBtn"), Boolean(musicUrl));
  }
  const mapUrl = data.venue?.mapUrl;
  if (mapUrl && /^https?:\/\//i.test(mapUrl)) {
    const link = document.createElement("a");
    link.className = "tm-map-link";
    link.href = mapUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = labels.map;
    one(".venue")?.append(link);
  }
  const rsvpEnabled = Boolean(data.rsvp?.enabled);
  const wishesEnabled = Boolean(data.wishesEnabled);
  visible(one("#openWish"), rsvpEnabled || wishesEnabled);
  const modal = one("#wishModal");
  const form = one("#wishForm");
  const attend = one('[name="attend"]', form || document);
  const wish = one('[name="wish"]', form || document);
  if (form) {
    const nameInput = one('[name="name"]', form);
    if (nameInput) {
      nameInput.placeholder = labels.name; nameInput.maxLength = 100;
      const nameLabel = nameInput.closest("label");
      if (nameLabel?.firstChild?.nodeType === Node.TEXT_NODE) nameLabel.firstChild.textContent = `${labels.name} `;
    }
    if (attend) {
      const group = attend.closest("label") || attend.closest(".field") || attend.parentElement;
      visible(group, rsvpEnabled);
      if (rsvpEnabled) attend.required = true; else attend.required = false;
      const attendLabel = attend.closest("label");
      if (attendLabel?.firstChild?.nodeType === Node.TEXT_NODE) attendLabel.firstChild.textContent = `${labels.attend} `;
      const options = attend.options;
      if (options.length >= 4) {
        options[0].textContent = labels.choose;
        options[1].textContent = labels.yes;
        options[2].textContent = labels.no;
        options[3].textContent = labels.maybe;
      }
    }
    if (wish) {
      wish.placeholder = labels.wish; wish.maxLength = 2000;
      const wishLabel = wish.closest("label");
      visible(wishLabel || wish.parentElement, wishesEnabled);
      if (wishLabel?.firstChild?.nodeType === Node.TEXT_NODE) wishLabel.firstChild.textContent = `${labels.wish} `;
    }
    const title = one(".modal__title", modal);
    if (title) title.textContent = labels.wishes;
    const modalTitle = one(".modal__box > h2", modal);
    if (modalTitle) modalTitle.textContent = labels.wishes;
    const submit = one('button[type="submit"]', form);
    if (submit) submit.textContent = labels.submit;
    const thanks = one(".modal__thanks", modal);
    if (thanks) thanks.textContent = labels.thanks;
  }
  if (!rsvpEnabled && !wishesEnabled) visible(modal, false);
  document.addEventListener("submit", async (event) => {
    if (event.target?.id !== "wishForm") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const currentForm = event.target;
    const name = one('[name="name"]', currentForm)?.value.trim() || "";
    const message = one('[name="wish"]', currentForm)?.value.trim() || "";
    const attendance = one('[name="attend"]', currentForm)?.value || "";
    const error = one(".modal__error", currentForm);
    if (error) error.textContent = "";
    const button = one('button[type="submit"]', currentForm);
    if (!name || (wishesEnabled && message.length < 1)) {
      if (error) error.textContent = labels.name;
      return;
    }
    if (data.preview || !data.slug) {
      currentForm.closest(".modal")?.classList.add("done");
      window.setTimeout(() => currentForm.closest(".modal")?.classList.remove("open"), 1400);
      return;
    }
    if (button) { button.disabled = true; button.textContent = "…"; }
    const base = `/api/public/invitations/${encodeURIComponent(data.slug)}`;
    const guestToken = data.guestToken || undefined;
    const status = attend?.selectedIndex === 2 ? "no" : attend?.selectedIndex === 3 ? "maybe" : "yes";
    const requests = [];
    if (rsvpEnabled) requests.push(fetch(`${base}/rsvp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, status, partySize: status === "yes" ? 1 : 0, guestToken }) }));
    if (wishesEnabled && message) requests.push(fetch(`${base}/wishes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message, guestToken }) }));
    try {
      const responses = await Promise.all(requests);
      for (const response of responses) {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || "Please try again.");
      }
      currentForm.closest(".modal")?.classList.add("done");
      window.setTimeout(() => currentForm.closest(".modal")?.classList.remove("open"), 1600);
    } catch (err) {
      if (error) error.textContent = err.message || "Please try again.";
    } finally {
      if (button) { button.disabled = false; button.textContent = labels.submit; }
    }
  }, true);
  function makeSection(className, title) {
    const section = document.createElement("section");
    section.className = className + " reveal is-visible";
    const heading = document.createElement("h2");
    heading.className = "tm-section-title";
    heading.textContent = title;
    section.append(heading);
    return section;
  }
  const program = (data.program || []).filter((item) => item.title || item.time);
  if (program.length) {
    const section = makeSection("tm-program", labels.date);
    const list = document.createElement("div"); list.className = "tm-program-list";
    for (const item of program) {
      const row = document.createElement("div"); row.className = "tm-program-row";
      const time = document.createElement("span"); time.textContent = item.time || "";
      const name = document.createElement("span"); name.textContent = item.title || "";
      row.append(time, name); list.append(row);
    }
    section.append(list); one("#sec-date")?.after(section);
  }
  const photos = (data.gallery || []).filter((item) => item.src);
  if (photos.length) {
    const section = makeSection("tm-gallery", labels.wishes);
    const grid = document.createElement("div"); grid.className = "tm-gallery-grid";
    photos.forEach((item) => { const figure = document.createElement("figure"); const image = document.createElement("img"); image.src = item.src; image.alt = item.alt || item.caption || ""; figure.append(image); grid.append(figure); });
    section.append(grid); one(".venue")?.after(section);
  }
  const contacts = (data.contacts || []).filter((item) => item.href && item.value);
  if (contacts.length) {
    const section = document.createElement("div"); section.className = "tm-contacts";
    contacts.forEach((item) => { const link = document.createElement("a"); link.href = item.href; link.textContent = item.label ? `${item.label}: ${item.value}` : item.value; if (item.href.startsWith("http")) { link.target = "_blank"; link.rel = "noopener noreferrer"; } section.append(link); });
    one(".venue")?.append(section);
  }
  const gift = data.toyona || {};
  if (!data.catalogPreview && gift.enabled && gift.cardNumber && gift.cardHolder) {
    const section = makeSection("tm-gift", labels.gift);
    const ornament = document.createElement("div"); ornament.className = "tm-gift-heart"; ornament.setAttribute("aria-hidden", "true"); ornament.textContent = "♡";
    const number = document.createElement("p"); number.className = "tm-gift-number"; number.dir = "ltr"; number.textContent = gift.cardNumber;
    const holder = document.createElement("p"); holder.className = "tm-gift-holder"; holder.textContent = gift.cardHolder;
    const copy = document.createElement("button"); copy.className = "tm-gift-copy"; copy.type = "button"; copy.textContent = labels.copy;
    copy.addEventListener("click", async () => { try { await navigator.clipboard.writeText(gift.cardNumber); } catch { const input = document.createElement("textarea"); input.value = gift.cardNumber; document.body.append(input); input.select(); document.execCommand("copy"); input.remove(); } copy.textContent = labels.copied; window.setTimeout(() => { if (copy.isConnected) copy.textContent = labels.copy; }, 1800); });
    section.append(ornament, number, holder, copy); one("#wishModal")?.before(section);
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("qaReducedMotion") === "1") document.documentElement.dataset.reducedMotion = "true";
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.data?.type !== "marxaba:update" || !event.data.payload) return;
    const next = JSON.stringify(event.data.payload);
    if (next !== window.name) { window.name = next; location.reload(); }
  });
})();
