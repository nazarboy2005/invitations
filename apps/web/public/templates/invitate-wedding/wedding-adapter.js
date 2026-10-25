(() => {
  const labels = {
    uz: { label: "Nikoh to‘yiga taklifnoma", countdown: "Vaqt hisobi", until: "To‘ygacha qolgan vaqt", invitation: "Taklif", guests: "Qadrli mehmonlarimiz", program: "Kun rejasi", programTitle: "Kunning dasturi", photos: "Rasmlar", gallery: "Foto to‘plami", dress: "Kiyinish uslubi", location: "Manzil", venue: "To‘yxona manzili", rsvp: "Tasdiqlash", rsvpTitle: "Ishtirokingizni tasdiqlang", map: "Xaritadan ko‘rish", days: "Kun", hours: "Soat", minutes: "Daqiqa", seconds: "Soniya", name: "Ismingiz va familiyangiz", attend: "Ishtirok etasizmi?", yes: "Kelaman", no: "Kela olmayman", party: "Kim bilan kelasiz?", alone: "Bir o‘zim", companion: "Yaqinim bilan", send: "Tasdiqlashni yuborish", thanks: "Rahmat!", success: "Javobingiz yuborildi.", error: "Javob yuborilmadi. Qayta urinib ko‘ring.", close: "Yopish", deadline: "Iltimos, {date} gacha javob bering.", dressTitle: "Dress Code" },
    "uz-Cyrl": { label: "Никоҳ тўйига таклифнома", countdown: "Вақт ҳисоби", until: "Тўйгача қолган вақт", invitation: "Таклиф", guests: "Қадрли меҳмонларимиз", program: "Кун режаси", programTitle: "Кун дастури", photos: "Суратлар", gallery: "Фото тўплами", dress: "Кийиниш услуби", location: "Манзил", venue: "Тўйхона манзили", rsvp: "Тасдиқлаш", rsvpTitle: "Иштирокингизни тасдиқланг", map: "Харитадан кўриш", days: "Кун", hours: "Соат", minutes: "Дақиқа", seconds: "Сония", name: "Исмингиз ва фамилиянгиз", attend: "Иштирок этасизми?", yes: "Келаман", no: "Кела олмайман", party: "Ким билан келасиз?", alone: "Ёлғиз", companion: "Яқиним билан", send: "Тасдиқлашни юбориш", thanks: "Раҳмат!", success: "Жавобингиз юборилди.", error: "Жавоб юборилмади. Қайта уриниб кўринг.", close: "Ёпиш", deadline: "Илтимос, {date} гача жавоб беринг.", dressTitle: "Dress Code" },
    en: { label: "Wedding invitation", countdown: "Countdown", until: "Time until our wedding", invitation: "Invitation", guests: "Dear guests", program: "Schedule", programTitle: "The day’s program", photos: "Photos", gallery: "Photo gallery", dress: "Dress code", location: "Location", venue: "Venue", rsvp: "RSVP", rsvpTitle: "Please confirm your attendance", map: "View map", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds", name: "Your full name", attend: "Will you attend?", yes: "I will attend", no: "I cannot attend", party: "Who will accompany you?", alone: "Just me", companion: "With a guest", send: "Send response", thanks: "Thank you!", success: "Your response was sent.", error: "Your response could not be sent. Please try again.", close: "Close", deadline: "Please respond by {date}.", dressTitle: "Dress code" },
    ru: { label: "Приглашение на свадьбу", countdown: "Обратный отсчёт", until: "До нашей свадьбы осталось", invitation: "Приглашение", guests: "Дорогие гости", program: "Расписание", programTitle: "Программа дня", photos: "Фото", gallery: "Фотогалерея", dress: "Стиль одежды", location: "Адрес", venue: "Адрес банкетного зала", rsvp: "Подтверждение", rsvpTitle: "Подтвердите участие", map: "Посмотреть на карте", days: "Дней", hours: "Часов", minutes: "Минут", seconds: "Секунд", name: "Имя и фамилия", attend: "Вы придёте?", yes: "Приду", no: "Не смогу прийти", party: "С кем вы придёте?", alone: "Один/одна", companion: "С близким человеком", send: "Отправить ответ", thanks: "Спасибо!", success: "Ваш ответ отправлен.", error: "Не удалось отправить ответ. Попробуйте ещё раз.", close: "Закрыть", deadline: "Пожалуйста, ответьте до {date}.", dressTitle: "Дресс-код" },
  };
  let data = {};
  const byId = (id) => document.getElementById(id);
  const programTemplate = document.querySelector(".program-list .prog-item")?.cloneNode(true);
  const galleryTemplate = document.querySelector(".gallery-grid .g-item")?.cloneNode(true);
  const artistTemplate = document.querySelector(".artists-grid .artist-card")?.cloneNode(true);
  const artistLabels = {
    uz: ["San’at kechasi", "Mashhur san’atkorlar"],
    "uz-Cyrl": ["Санъат кечаси", "Машҳур санъаткорлар"],
    en: ["Entertainment", "Featured artists"],
    ru: ["Музыкальный вечер", "Приглашённые артисты"],
  };
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value || "";
  };
  const tr = (key) => (labels[data.locale] || labels.uz)[key];
  const update = (next) => {
    data = next || {};
    const people = data.people || [data.groom || "", data.bride || ""];
    const date = data.date || {};
    const names = people.filter(Boolean).join(" & ");
    document.title = names ? `${names} · ${date.short || ""}` : "Wedding invitation";
    document.documentElement.lang = data.locale || "uz";
    setText(".hero-label", tr("label"));
    const heroNames = document.querySelector(".hero-names");
    if (heroNames) {
      const amp = document.createElement("span"); amp.className = "hero-amp"; amp.textContent = " & ";
      heroNames.replaceChildren(document.createTextNode(people[0] || ""), amp, document.createTextNode(people[1] || ""));
    }
    setText(".hero-date", date.day ? `${date.day} · ${date.month} · ${date.year}` : "");
    setText(".hero-loc", data.venueName || data.venue?.name);
    setText(".footer-names", names);
    setText(".footer-date", date.day ? `${date.day} · ${date.month} · ${date.year}` : "");
    setText(".footer-copy", "");
    const footerLinks = document.querySelectorAll("footer a");
    footerLinks.forEach((link, index) => {
      const value = index === 0 ? data.phoneNumber : index === 1 ? data.telegramUsername : "";
      if (!value) { link.hidden = true; return; }
      link.hidden = false;
      link.href = index === 0 ? `tel:${value}` : `https://t.me/${String(value).replace(/^@/, "")}`;
      link.setAttribute("aria-label", index === 0 ? "Phone" : "Telegram");
    });
    document.querySelectorAll("#countdown .section-tag").forEach((n) => n.textContent = tr("countdown"));
    document.querySelectorAll(".cd-lbl").forEach((n, i) => n.textContent = [tr("days"), tr("hours"), tr("minutes"), tr("seconds")][i] || "");
    window.setWeddingTarget?.(data.dateTime);
    setText("#countdown .section-title", tr("until"));
    setText("#invitation .section-tag", tr("invitation"));
    setText("#invitation .section-title", data.greeting || tr("guests"));
    setText("#program .section-tag", tr("program"));
    setText("#program .section-title", data.programHeading || tr("programTitle"));
    setText("#artists .section-tag", (artistLabels[data.locale] || artistLabels.uz)[0]);
    setText("#artists .section-title", (artistLabels[data.locale] || artistLabels.uz)[1]);
    setText("#gallery .section-tag", tr("photos"));
    setText("#gallery .section-title", tr("gallery"));
    setText("#dresscode .section-tag", tr("dress"));
    setText("#dresscode .section-title", tr("dressTitle"));
    setText("#location .section-tag", tr("location"));
    setText("#location .section-title", tr("venue"));
    setText("#rsvp .section-tag", tr("rsvp"));
    setText("#rsvp .section-title", tr("rsvpTitle"));
    setText("#rsvp .section-inner > p", data.rsvpDeadline ? tr("deadline").replace("{date}", data.rsvpDeadline) : "");
    const copy = document.querySelector(".invite-text");
    if (copy) copy.textContent = data.message || data.greeting || "";
    setText(".venue-name", data.venueName || data.venue?.name);
    const address = document.querySelector(".venue-addr");
    if (address) {
      address.replaceChildren(document.createTextNode(data.venueAddress || data.venue?.address || ""));
      if (date.short || date.time) { address.append(document.createElement("br"), document.createElement("br")); const time = document.createElement("strong"); time.textContent = [date.short, date.time].filter(Boolean).join(" · "); address.append(time); }
    }
    const map = document.querySelector(".gold-btn");
    if (map) { map.href = data.mapUrl || data.venue?.mapUrl || "#location"; map.textContent = tr("map"); }
    const programRoot = document.querySelector(".program-list");
    if (programRoot) {
      programRoot.replaceChildren();
      (data.program || []).filter((item) => item.title || item.time || item.description).forEach((item) => {
        const row = programTemplate?.cloneNode(true);
        if (!row) return;
        row.querySelector(".prog-time").textContent = item.time || "";
        row.querySelector(".prog-title").textContent = item.title || "";
        row.querySelector(".prog-desc").textContent = item.description || "";
        row.classList.remove("vis"); programRoot.append(row);
      });
      programRoot.closest("#program").hidden = !programRoot.children.length;
    }
    const gallery = (data.gallery || []).filter((item) => item.src);
    const galleryRoot = document.querySelector(".gallery-grid");
    if (galleryRoot) {
      galleryRoot.replaceChildren();
      gallery.forEach((item, index) => {
        const card = galleryTemplate?.cloneNode(true);
        if (!card) return;
        const image = card.querySelector("img"); image.src = item.src; image.alt = item.alt || item.caption || ""; image.loading = "lazy";
        card.onclick = () => { byId("lb-img").src = image.src; byId("lightbox").classList.add("active"); };
        galleryRoot.append(card);
      });
      document.querySelector("#gallery").hidden = !gallery.length;
    }
    const dress = data.dressCode || {};
    const dressSection = byId("dresscode");
    if (!dress.enabled) dressSection.hidden = true;
    else {
      const palette = document.querySelector(".palette");
      palette.replaceChildren();
      (dress.colors || []).forEach((color) => { const item = document.createElement("div"); item.className = "swatch vis"; const circle = document.createElement("div"); circle.className = "sw-circle"; circle.style.backgroundColor = color.hex || "#c9a84c"; const name = document.createElement("span"); name.className = "sw-lbl"; name.textContent = color.name || ""; item.append(circle, name); palette.append(item); });
      const note = document.querySelector(".dc-note"); if (note) note.textContent = dress.text || dress.note || dress.style || "";
    }
    const artistRows = (data.artists || []).filter((item) => item.name || item.role || item.imageUrl);
    const artistGrid = document.querySelector(".artists-grid");
    if (artistGrid) {
      artistGrid.replaceChildren();
      artistRows.forEach((item) => {
        const card = artistTemplate?.cloneNode(true);
        if (!card) return;
        const image = card.querySelector("img");
        if (image) { image.src = item.imageUrl || ""; image.alt = item.name || ""; image.hidden = !item.imageUrl; }
        const role = card.querySelector(".artist-role");
        if (role) role.textContent = item.role || "";
        const name = card.querySelector(".artist-name");
        if (name) name.textContent = item.name || "";
        artistGrid.append(card);
      });
    }
    const artists = byId("artists");
    if (artists) artists.hidden = artistRows.length === 0;
    if (!data.rsvpEnabled) byId("rsvp").hidden = true;
    if (data.preview) { const previewButton = byId("submitBtn"); if (previewButton) previewButton.disabled = true; }
    const formName = document.querySelector('#rsvpForm input[name="name"]');
    if (formName) { formName.placeholder = tr("name"); if (data.guestName) formName.value = data.guestName; }
    document.querySelectorAll(".field-lbl").forEach((node, i) => node.textContent = i === 0 ? tr("attend") : tr("party"));
    const radios = document.querySelectorAll("#rsvpForm .rl");
    if (radios.length >= 4) [tr("yes"), tr("no"), tr("alone"), tr("companion")].forEach((text, i) => { const span = radios[i].querySelectorAll("span"); if (span[1]) span[1].textContent = text; });
    const submit = byId("submitBtn"); if (submit) submit.textContent = tr("send");
    const close = document.querySelector(".popup-close"); if (close) close.textContent = tr("close");
    const music = byId("bgAudio"), button = byId("audioBtn");
    if (music && data.music?.enabled && data.music.url) { music.replaceChildren(Object.assign(document.createElement("source"), { src: data.music.url, type: "audio/mpeg" })); button.hidden = false; }
    else if (button) button.hidden = true;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || data.reducedMotion;
    document.body.classList.toggle("reduced-motion", Boolean(reduceMotion));
    if (reduceMotion) document.querySelectorAll("video").forEach((video) => { video.pause(); video.removeAttribute("autoplay"); });
    document.body.classList.remove("template-loading"); document.body.classList.add("template-ready");
  };
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.data?.type !== "invitate-wedding:update") return;
    update(event.data.payload);
  });
  try { if (window.name) update(JSON.parse(window.name)); } catch {}
  const form = byId("rsvpForm");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = byId("submitBtn"), loading = byId("loadingText");
    const name = form.elements.namedItem("name").value.trim();
    const selected = form.querySelector('input[name="answer"]:checked');
    if (!data.apiBase || !name || !selected || data.preview) { if (loading) { loading.style.display = "block"; loading.textContent = data.preview ? "" : tr("error"); } return; }
    button.disabled = true; if (loading) { loading.style.display = "block"; loading.textContent = ""; }
    try {
      const companion = form.querySelector('input[name="sastav"]:checked');
      const affirmative = [...form.querySelectorAll('input[name="answer"]')].indexOf(selected) === 0;
      const withGuest = companion && [...form.querySelectorAll('input[name="sastav"]')].indexOf(companion) === 1;
      const response = await fetch(`${data.apiBase}/rsvp`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, status: affirmative ? "yes" : "no", partySize: affirmative ? (withGuest ? 2 : 1) : 0, guestToken: data.guestToken || undefined }) });
      if (!response.ok) throw new Error("RSVP failed");
      byId("popupOverlay").classList.add("active");
      setText(".popup-title", tr("thanks")); setText(".popup-text", tr("success")); form.reset();
    } catch { if (loading) loading.textContent = tr("error"); }
    finally { button.disabled = false; }
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") byId("lightbox")?.classList.remove("active"); });
})();
