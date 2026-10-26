(() => {
  "use strict";

  const words = {
    "uz-Latn": { dear: "Hurmatli", guests: "mehmonlar", night: "kechasi", edition: "tug‘ilgan kun", party: "Bayram", days: "kun", hours: "soat", minutes: "daqiqa", seconds: "soniya", timing: "Dastur", timingParts: ["kun", "dasturi"], timingIntro: "Bayramimizning har bir lahzasi mehr bilan rejalashtirilgan.", arrival: "Mehmonlar tashrifi", location: "Manzil", locationDesc: "Bayram o‘tkaziladigan joy", map: "Xaritadan ko‘rish", dress: "KIYINISH USLUBI", rsvp: "Ishtirokingizni tasdiqlang", rsvpDesc: "Bayramda qatnasha olishingizni bildiring.", nameLabel: "Ism-familiyangiz", name: "Ism va familiyangiz", question: "Qatnasha olasizmi?", yes: "Ha, mamnuniyat bilan", no: "Afsuski, qatnasha olmayman", wishLabel: "Tilak qoldiring", wish: "Iliq tilagingizni yozing…", send: "Yuborish", sending: "Yuborilmoqda…", errorTitle: "Tekshirib ko‘ring", error: "Ismingizni yozing va javobni tanlang.", preview: "Ko‘rish rejimida javob yuborib bo‘lmaydi.", failure: "Javob yuborilmadi. Qayta urinib ko‘ring.", wishFailure: "Javobingiz saqlandi, ammo tilak yuborilmadi.", thanks: "Rahmat!", thanksYes: "Sizni intizorlik bilan kutamiz.", thanksNo: "Javobingiz uchun rahmat.", close: "Yopish", closing: "Siz bilan birga nishonlashni intiqlik bilan kutamiz.", rights: "Taklifnoma" },
    "uz-Cyrl": { dear: "Ҳурматли", guests: "меҳмонлар", night: "кечаси", edition: "туғилган кун", party: "Байрам", days: "кун", hours: "соат", minutes: "дақиқа", seconds: "сония", timing: "Дастур", timingParts: ["кун", "дастури"], timingIntro: "Байрамимизнинг ҳар бир лаҳзаси меҳр билан режалаштирилган.", arrival: "Меҳмонлар ташрифи", location: "Манзил", locationDesc: "Байрам ўтказиладиган жой", map: "Харитадан кўриш", dress: "КИЙИНИШ УСЛУБИ", rsvp: "Иштирокингизни тасдиқланг", rsvpDesc: "Байрамда қатнашишингиз мумкинлигини билдиринг.", nameLabel: "Исм-фамилиянгиз", name: "Исм ва фамилиянгиз", question: "Қатнаша оласизми?", yes: "Ҳа, мамнуният билан", no: "Афсуски, қатнаша олмайман", wishLabel: "Тилак қолдиринг", wish: "Илиқ тилагингизни ёзинг…", send: "Юбориш", sending: "Юборилмоқда…", errorTitle: "Текшириб кўринг", error: "Исмингизни ёзинг ва жавобни танланг.", preview: "Кўриш режимида жавоб юбориб бўлмайди.", failure: "Жавоб юборилмади. Қайта уриниб кўринг.", wishFailure: "Жавобингиз сақланди, аммо тилак юборилмади.", thanks: "Раҳмат!", thanksYes: "Сизни интизорлик билан кутамиз.", thanksNo: "Жавобингиз учун раҳмат.", close: "Ёпиш", closing: "Сиз билан бирга нишонлашни интиқлик билан кутамиз.", rights: "Таклифнома" },
    en: { dear: "Dear", guests: "Guests", night: "night", edition: "birthday", party: "Celebration", days: "days", hours: "hours", minutes: "mins", seconds: "secs", timing: "Timing", timingParts: ["of", "the", "day"], timingIntro: "Every moment of this celebration has been planned with love.", arrival: "Guest Arrival", location: "Location", locationDesc: "Where the celebration takes place", map: "View on the Map", dress: "DRESS CODE", rsvp: "Confirm Attendance", rsvpDesc: "Please let us know if you can join the celebration.", nameLabel: "Full name", name: "Your name & surname", question: "Will you be attending?", yes: "Joyfully accepts", no: "Regretfully declines", wishLabel: "Leave a wish", wish: "Write your warm wishes here…", send: "Send", sending: "Sending…", errorTitle: "Please check your response", error: "Please enter your name and choose a response.", preview: "Responses cannot be sent in preview.", failure: "Your response could not be sent. Please try again.", wishFailure: "Your RSVP was saved, but your wish could not be sent.", thanks: "Thank you!", thanksYes: "We look forward to celebrating with you.", thanksNo: "Thank you for letting us know.", close: "Close", closing: "We can’t wait to celebrate with you.", rights: "Invitation" },
    ru: { dear: "Дорогие", guests: "гости", night: "вечер", edition: "день рождения", party: "Праздник", days: "дней", hours: "часов", minutes: "минут", seconds: "секунд", timing: "Программа", timingParts: ["праздника"], timingIntro: "Каждый момент праздника мы спланировали с любовью.", arrival: "Сбор гостей", location: "Место проведения", locationDesc: "Где состоится праздник", map: "Открыть карту", dress: "ДРЕСС-КОД", rsvp: "Подтвердите участие", rsvpDesc: "Сообщите, сможете ли вы присоединиться к празднику.", nameLabel: "Имя и фамилия", name: "Ваше имя и фамилия", question: "Вы будете присутствовать?", yes: "С радостью буду", no: "К сожалению, не смогу", wishLabel: "Оставьте пожелание", wish: "Напишите тёплые слова…", send: "Отправить", sending: "Отправка…", errorTitle: "Проверьте ответ", error: "Введите имя и выберите вариант ответа.", preview: "В режиме просмотра ответ отправить нельзя.", failure: "Не удалось отправить ответ. Попробуйте ещё раз.", wishFailure: "Ответ сохранён, но пожелание отправить не удалось.", thanks: "Спасибо!", thanksYes: "Будем ждать встречи с вами.", thanksNo: "Спасибо, что сообщили.", close: "Закрыть", closing: "Будем рады отпраздновать этот день вместе с вами.", rights: "Приглашение" },
  };

  let data = {};
  try { data = JSON.parse(window.name || "{}"); } catch { data = {}; }
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const text = (node, value) => { if (node) node.textContent = value || ""; };
  const src = (file) => `./assets/images/golden-hour/${file}`;
  const localeWords = () => words[data.locale] || words.en;
  const previewAssets = ["pink.png", "flowers.png", "flocake.png", "location.png", "footerimage.png"];

  function localize() {
    const t = localeWords();
    document.documentElement.lang = data.locale === "uz-Latn" ? "uz" : data.locale || "en";
    const map = {
      ".dear": t.dear,
      ".guests-title": data.guestName || t.guests,
      ".party-label": data.eventType || t.party,
      ".timing-title": t.timing,
      ".timing-intro": t.timingIntro,
      ".location-title": t.location,
      ".location-desc": t.locationDesc,
      ".dress-title": t.dress,
      ".rsvp-desc": t.rsvpDesc,
      ".footer-brand": t.rights,
      ".footer-rights": "",
      ".rsvp-field label[for='fullname']": t.nameLabel,
      "#fullname": null,
      ".rsvp-submit": t.send,
      "#rsvpPopupClose": t.close,
    };
    Object.entries(map).forEach(([selector, value]) => {
      const node = $(selector);
      if (value !== null) text(node, value);
    });
    const subtitleWords = (data.programHeading || t.timingParts?.filter(Boolean).join(" ") || "").split(/\s+/).filter(Boolean);
    $$(".timing-subtitle span").forEach((node, index) => text(node, subtitleWords[index] || ""));
    const rsvpTitle = $(".rsvp-title");
    const rsvpTitleLine = $(".line2", rsvpTitle || document);
    if (rsvpTitle && rsvpTitleLine) {
      const parts = t.rsvp.split(" ");
      text(rsvpTitle.firstChild, `${parts.shift()} `);
      text(rsvpTitleLine, parts.join(" "));
    }
    const labels = $$(".countdown-label");
    [t.days, t.hours, t.minutes, t.seconds].forEach((label, index) => text(labels[index], label));
    const nameInput = $("#fullname");
    if (nameInput) nameInput.placeholder = t.name;
    const wish = $("#wishlist");
    if (wish) wish.placeholder = t.wish;
    const fields = $$(".rsvp-field > label");
    if (fields[1]) text(fields[1], t.question);
    if (fields[2]) text(fields[2], t.wishLabel);
    const radios = $$(".rsvp-radio");
    if (radios[0]) radios[0].lastChild.textContent = ` ${t.yes}`;
    if (radios[1]) radios[1].lastChild.textContent = ` ${t.no}`;
    const mapButton = $(".location-btn");
    if (mapButton) text(mapButton, t.map);
  }

  function setImage(image, url, alt) {
    if (!image) return;
    if (url) {
      image.src = url;
      image.alt = alt || "";
      image.hidden = false;
    } else {
      image.removeAttribute("src");
      image.alt = "";
      image.hidden = true;
    }
  }

  function setCaptionAfter(image, caption, className) {
    if (!image?.parentElement) return;
    let node = image.parentElement.querySelector(`:scope > .${className}`);
    if (!caption) { node?.remove(); return; }
    if (!node) {
      node = document.createElement("p");
      node.className = className;
      image.after(node);
    }
    text(node, caption);
  }

  function renderGallery() {
    const photos = (data.gallery || []).filter((photo) => photo.src);
    const preview = Boolean(data.catalogPreview);
    const media = photos.length ? photos.map((photo) => ({ src: photo.src, alt: photo.alt || photo.caption || "", caption: photo.caption || "" })) : preview ? previewAssets.map((file) => ({ src: src(file), alt: "", caption: "" })) : [];
    setImage($(".hero-photo"), media[0]?.src, media[0]?.alt);
    const heroCaption = $(".hero-photo-caption");
    if (heroCaption) { text(heroCaption, media[0]?.caption); heroCaption.hidden = !media[0]?.caption; }
    const guestImages = $$(".guests-photos img");
    guestImages.forEach((image, index) => {
      setImage(image, media[index + 1]?.src, media[index + 1]?.alt);
      setCaptionAfter(image, media[index + 1]?.caption, "guest-photo-caption");
    });
    const guestPhotos = $(".guests-photos");
    if (guestPhotos) guestPhotos.hidden = !media[1] && !media[2];
    const locationImage = $(".location-photo img");
    setImage(locationImage, media[3]?.src, media[3]?.alt);
    const locationCaption = $(".location-photo-caption");
    if (locationCaption) { text(locationCaption, media[3]?.caption); locationCaption.hidden = !media[3]?.caption; }
    const locationPhoto = $(".location-photo");
    if (locationPhoto) locationPhoto.hidden = !media[3];
    const closingImage = $(".closing-photo-wrap img");
    setImage(closingImage, media[4]?.src, media[4]?.alt);
    const closingCaption = $(".closing-photo-caption");
    if (closingCaption) { text(closingCaption, media[4]?.caption); closingCaption.hidden = !media[4]?.caption; }
    const closingWrap = $(".closing-photo-wrap");
    if (closingWrap) closingWrap.hidden = !media[4];
    const closingSection = $(".closing");
    $$(".closing-photo-wrap[data-additional-photo]").forEach((node) => node.remove());
    media.slice(5).forEach((photo) => {
      if (!closingSection) return;
      const wrap = document.createElement("div");
      wrap.className = "closing-photo-wrap reveal-scale is-visible";
      wrap.dataset.additionalPhoto = "";
      const image = document.createElement("img");
      setImage(image, photo.src, photo.alt);
      wrap.append(image);
      if (photo.caption) {
        const caption = document.createElement("span");
        caption.className = "closing-photo-caption";
        text(caption, photo.caption);
        wrap.append(caption);
      }
      closingSection.append(wrap);
    });
  }

  function renderProgram() {
    const section = $(".timing");
    const timeline = $(".timeline");
    const items = (data.program || []).filter((item) => item.title || item.time);
    if (!section || !timeline) return;
    section.hidden = !items.length;
    timeline.replaceChildren();
    items.forEach((item, index) => {
      const time = item.time || "";
      if (index === 0) {
        const featured = document.createElement("div");
        featured.className = "timeline-featured reveal-scale is-visible";
        const timeNode = document.createElement("div"); timeNode.className = "feature-time"; text(timeNode, time);
        const title = document.createElement("div"); title.className = "feature-title"; text(title, item.title);
        featured.append(timeNode, title);
        timeline.append(featured);
        return;
      }
      const connector = document.createElement("div"); connector.className = "timeline-connector reveal is-visible";
      const line = document.createElement("span"); line.className = "connector-line";
      const stamp = document.createElement("span"); stamp.className = "connector-time"; text(stamp, time);
      connector.append(line, stamp);
      const title = document.createElement("div"); title.className = "timeline-item reveal is-visible"; text(title, item.title);
      timeline.append(connector, title);
    });
  }

  function renderDressCode() {
    const section = $(".dresscode");
    const dress = data.dressCode || {};
    const visible = Boolean(dress.enabled && (dress.style || dress.text || dress.note || dress.colors?.length));
    if (section) section.hidden = !visible;
    if (!section || !visible) return;
    const description = $(".dress-desc");
    text(description, [dress.style, dress.text, dress.note].filter(Boolean).join(". "));
    const swatches = $(".dress-swatches");
    if (!swatches) return;
    swatches.replaceChildren();
    (dress.colors || []).forEach((color) => {
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.backgroundColor = color.hex;
      swatch.title = color.name || "";
      swatches.append(swatch);
    });
    swatches.hidden = !(dress.colors || []).length;
  }

  function renderVenue() {
    const venue = data.venue || {};
    const section = $(".location");
    const address = [venue.name, venue.address].filter(Boolean).join(", ");
    const hasCoordinates = venue.lat != null && venue.lng != null && Number.isFinite(Number(venue.lat)) && Number.isFinite(Number(venue.lng));
    if (section) section.hidden = !address && !venue.mapUrl && !hasCoordinates;
    text($(".location-address"), address);
    const link = $(".location-btn");
    if (link) {
      const href = venue.mapUrl || (hasCoordinates ? `https://maps.google.com/?q=${venue.lat},${venue.lng}` : "");
      link.hidden = !href;
      if (href) link.href = href; else link.removeAttribute("href");
    }
  }

  function render() {
    document.title = data.title || data.eventType || "Golden Hour";
    localize();
    const t = localeWords();
    const title = data.title || data.eventType || t.party;
    text($(".hero-masthead .title"), t.edition);
    text($(".hero-masthead .subtitle"), title);
    const person = [data.groom, data.bride].filter(Boolean).join(" & ");
    const sig = $(".hero-signature .name-line");
    text(sig, [person, data.eventType || t.edition].filter(Boolean).join(" · "));
    text($(".dear"), data.greeting || t.dear);
    text($(".guests-text"), data.message);
    text($(".closing-text"), [data.hosts, t.closing].filter(Boolean).join(" · "));
    const displayLocale = ({ "uz-Latn": "uz-UZ", "uz-Cyrl": "uz-Cyrl-UZ", en: "en-US", ru: "ru-RU" })[data.locale] || "en-US";
    const dateLabel = data.dateTime && Number.isFinite(new Date(data.dateTime).getTime())
      ? (data.date?.short || new Intl.DateTimeFormat(displayLocale, { day: "2-digit", month: "short", year: "numeric", timeZone: data.timezone || "UTC" }).format(new Date(data.dateTime)))
      : "";
    text($(".date-big"), dateLabel);
    const dateSection = $(".date-section"); if (dateSection) dateSection.hidden = !dateLabel;
    renderProgram();
    renderVenue();
    renderDressCode();
    renderGallery();
    const rsvp = $(".rsvp");
    if (rsvp) rsvp.hidden = !data.rsvp?.enabled && !data.wishesEnabled;
    const wish = $("#wishlist");
    const wishField = wish?.closest(".rsvp-field");
    if (wishField) wishField.hidden = !data.wishesEnabled;
    const attendanceField = $(".rsvp-radios")?.closest(".rsvp-field");
    if (attendanceField) attendanceField.hidden = !data.rsvp?.enabled;
    const name = $("#fullname"); if (name && data.guestName) name.value = data.guestName;
    const musicUrl = data.music?.enabled && data.music?.url ? data.music.url : "";
    $$(".footer-icons a").forEach((link) => { link.hidden = true; link.removeAttribute("href"); });
    const footerLinks = $$(".footer-icons a");
    if (data.contacts?.[0] && footerLinks[0]) {
      footerLinks[0].href = data.contacts[0].href; footerLinks[0].hidden = false;
      footerLinks[0].setAttribute("aria-label", data.contacts[0].label);
    }
    if (data.contacts?.[1] && footerLinks[1]) {
      footerLinks[1].href = data.contacts[1].href; footerLinks[1].hidden = false;
      footerLinks[1].setAttribute("aria-label", data.contacts[1].label);
    }
    document.documentElement.classList.remove("golden-hour-loading");
    document.documentElement.classList.add("golden-hour-ready");
    window.GoldenHourSource?.initialize(data.dateTime, musicUrl);
  }

  const form = $(".rsvp-form");
  const popup = $("#rsvpPopup");
  const statusNode = $(".rsvp-popup-text");
  const submit = $(".rsvp-submit");
  const closePopup = () => popup?.classList.remove("is-open");
  $("#rsvpPopupClose")?.addEventListener("click", closePopup);
  popup?.addEventListener("click", (event) => { if (event.target === popup) closePopup(); });
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const t = localeWords();
    const name = $("#fullname")?.value.trim() || "";
    const answer = $("input[name='attending']:checked", form)?.value;
    const wish = $("#wishlist")?.value.trim() || "";
    if (!name || (data.rsvp?.enabled && !answer) || (!data.rsvp?.enabled && data.wishesEnabled && !wish)) {
      if (statusNode) statusNode.textContent = t.error;
      text($(".rsvp-popup-title"), t.errorTitle);
      popup?.classList.add("is-open"); return;
    }
    if (data.preview || !data.apiBase) {
      if (statusNode) statusNode.textContent = t.preview;
      text($(".rsvp-popup-title"), t.errorTitle);
      popup?.classList.add("is-open"); return;
    }
    submit.disabled = true;
    text(submit, t.sending);
    try {
      if (data.rsvp?.enabled) {
        const response = await fetch(`${data.apiBase}/rsvp`, {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, status: answer, partySize: answer === "yes" ? 1 : 0, guestToken: data.guestToken || undefined }),
        });
        if (!response.ok) throw new Error("rsvp");
      }
      if (wish && data.wishesEnabled) {
        const wishResponse = await fetch(`${data.apiBase}/wishes`, {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, message: wish, guestToken: data.guestToken || undefined }),
        });
        if (!wishResponse.ok) {
          if (statusNode) statusNode.textContent = t.wishFailure;
          text($(".rsvp-popup-title"), t.errorTitle);
          popup?.classList.add("is-open");
          return;
        }
      }
      if (statusNode) statusNode.textContent = data.rsvp?.enabled ? (answer === "yes" ? t.thanksYes : t.thanksNo) : t.thanks;
      text($(".rsvp-popup-title"), t.thanks);
      popup?.classList.add("is-open");
      form.reset();
    } catch {
      if (statusNode) statusNode.textContent = t.failure;
      text($(".rsvp-popup-title"), t.errorTitle);
      popup?.classList.add("is-open");
    } finally {
      submit.disabled = false;
      text(submit, t.send);
    }
  });

  function acceptMessage(event) {
    if (event.origin !== window.location.origin || event.data?.type !== "golden-hour:update") return;
    data = event.data.payload || {};
    render();
  }
  window.addEventListener("message", acceptMessage);
  render();
})();

