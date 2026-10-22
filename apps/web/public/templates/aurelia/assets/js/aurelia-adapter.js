(() => {
  "use strict";
  const strings = {
    "uz-Latn": { scroll: "Pastga suring", venueLabel: "To‘yxona", map: "Xaritadan ko‘rish", countdown: "Baxtli onlargacha", days: "Kun", hours: "Soat", minutes: "Daqiqa", seconds: "Soniya", venuePhoto: "To‘yxona rasmi", featurePhoto: "To‘y bayrami rasmi", rsvp: "Tasdiqlash", nameLabel: "Ismingiz", name: "Ism va familiyangiz", question: "Kelasizmi?", yes: "Ha, boraman", no: "Afsuski, bora olmayman", wishLabel: "Tilaklar", wish: "Bir necha iliq so‘z", error: "Iltimos, ismingizni yozing va javobni tanlang.", send: "Yuborish", thanks: "Rahmat,", thanksYes: "Sizni intizorlik bilan kutamiz.", thanksNo: "Javobingiz uchun rahmat.", editResponse: "Javobni o‘zgartirish", toyonaTitle: "To‘yona", revealCard: "To‘yona ma’lumotlarini ko‘rish", hideCard: "Kartani yopish", cardHolderLabel: "Karta egasi", cardNumberLabel: "Karta raqami", copyCard: "Raqamni nusxalash", copied: "Karta raqami nusxalandi", copyFailed: "Nusxalab bo‘lmadi. Raqamni belgilang.", rights: "© Taklifnoma", preview: "Ko‘rish rejimida javob yuborib bo‘lmaydi.", failure: "Javob yuborilmadi. Iltimos, qayta urinib ko‘ring." },
    "uz-Cyrl": { scroll: "Пастга суринг", venueLabel: "Тўйхона", map: "Харитадан кўриш", countdown: "Бахтли онларгача", days: "Кун", hours: "Соат", minutes: "Дақиқа", seconds: "Сония", venuePhoto: "Тўйхона сурати", featurePhoto: "Тўй байрами сурати", rsvp: "Тасдиқлаш", nameLabel: "Исмингиз", name: "Исм ва фамилиянгиз", question: "Келасизми?", yes: "Ҳа, бораман", no: "Афсуски, бора олмайман", wishLabel: "Тилаклар", wish: "Бир неча илиқ сўз", error: "Илтимос, исмингизни ёзинг ва жавобни танланг.", send: "Юбориш", thanks: "Раҳмат,", thanksYes: "Сизни интизорлик билан кутамиз.", thanksNo: "Жавобингиз учун раҳмат.", editResponse: "Жавобни ўзгартириш", toyonaTitle: "Тўёна", revealCard: "Тўёна маълумотларини кўриш", hideCard: "Картани ёпиш", cardHolderLabel: "Карта эгаси", cardNumberLabel: "Карта рақами", copyCard: "Рақамни нусхалаш", copied: "Карта рақами нусхаланди", copyFailed: "Нусхалаб бўлмади. Рақамни белгиланг.", rights: "© Таклифнома", preview: "Кўриш режимида жавоб юбориб бўлмайди.", failure: "Жавоб юборилмади. Илтимос, қайта уриниб кўринг." },
    en: { scroll: "Scroll down", venueLabel: "Wedding venue", map: "View on map", countdown: "Until our happy day", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds", venuePhoto: "Wedding venue", featurePhoto: "Wedding celebration", rsvp: "RSVP", nameLabel: "Your name", name: "Full name", question: "Will you attend?", yes: "Yes, I’ll be there", no: "Sorry, I can’t attend", wishLabel: "Your wishes", wish: "Write a few kind words", error: "Please enter your name and choose a response.", send: "Send response", thanks: "Thank you,", thanksYes: "We look forward to seeing you.", thanksNo: "Thank you for letting us know.", editResponse: "Change response", toyonaTitle: "Wedding gift", revealCard: "Reveal transfer details", hideCard: "Hide card details", cardHolderLabel: "Cardholder", cardNumberLabel: "Card number", copyCard: "Copy card number", copied: "Card number copied", copyFailed: "Could not copy. Please select the number.", rights: "© Invitation", preview: "Responses cannot be sent in preview.", failure: "Your response could not be sent. Please try again." },
    ru: { scroll: "Листайте вниз", venueLabel: "Место проведения", map: "Открыть карту", countdown: "До нашего счастливого дня", days: "Дней", hours: "Часов", minutes: "Минут", seconds: "Секунд", venuePhoto: "Место проведения", featurePhoto: "Свадебное торжество", rsvp: "Подтверждение", nameLabel: "Ваше имя", name: "Имя и фамилия", question: "Вы придёте?", yes: "Да, буду", no: "К сожалению, не смогу", wishLabel: "Пожелания", wish: "Напишите несколько тёплых слов", error: "Введите имя и выберите вариант ответа.", send: "Отправить", thanks: "Спасибо,", thanksYes: "Будем ждать вас.", thanksNo: "Спасибо за ваш ответ.", editResponse: "Изменить ответ", toyonaTitle: "Подарок молодожёнам", revealCard: "Показать данные для перевода", hideCard: "Скрыть данные карты", cardHolderLabel: "Владелец карты", cardNumberLabel: "Номер карты", copyCard: "Скопировать номер карты", copied: "Номер карты скопирован", copyFailed: "Не удалось скопировать. Выделите номер.", rights: "© Приглашение", preview: "В режиме просмотра ответ отправить нельзя.", failure: "Не удалось отправить ответ. Попробуйте ещё раз." },
  };
  let data = {};
  try { data = JSON.parse(window.name || "{}"); } catch { data = {}; }
  window.__AURELIA_DATA = data;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const sourceLocale = { uz: "uz-Latn", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" };
  const currentStrings = () => strings[sourceLocale[data.locale] || data.locale] || strings["uz-Latn"];
  const put = (selector, value) => { const node = $(selector); if (node) node.textContent = value || ""; return node; };
  function render(next) {
    data = next || {};
    window.__AURELIA_DATA = data;
    const t = currentStrings();
    document.documentElement.lang = data.locale || "uz";
    put('[data-field="groom"]', data.groom);
    put('[data-field="bride"]', data.bride);
    put('[data-field="couple"]', [data.groom, data.bride].filter(Boolean).join(" & "));
    put('[data-field="greeting"]', data.greeting);
    put('[data-field="message"]', data.message);
    put('[data-field="programHeading"]', data.programHeading);
    put('[data-field="venueName"]', data.venue?.name);
    put('[data-field="venueAddress"]', data.venue?.address);
    $$('[data-copy]').forEach((node) => { const key = node.dataset.copy; if (key in t) node.textContent = t[key]; });
    $$('[data-copy-placeholder]').forEach((node) => { const key = node.dataset.copyPlaceholder; node.placeholder = t[key] || ""; });

    const gift=data.toyona||{};const giftSection=$("#toyonaSection");const giftNumber=$("#toyonaNumber");const giftHolder=$("#toyonaHolder");const giftCopy=$("#toyonaCopy");if(giftSection){giftSection.hidden=!(gift.enabled&&gift.cardNumber);if(giftNumber)giftNumber.textContent=gift.cardNumber||"";if(giftHolder){giftHolder.textContent=gift.cardHolder||"";giftHolder.hidden=!gift.cardHolder;}if(giftCopy)giftCopy.setAttribute("aria-label",t.copyCard+": "+(gift.cardNumber||""));if(giftSection.hidden)setToyonaRevealed(false);}
    const date = data.date || {};
    put('[data-field="day"]', date.day ? String(date.day).padStart(2, "0") : "");
    put('[data-field="month"]', date.monthNumber ? String(date.monthNumber).padStart(2, "0") : "");
    put('[data-field="year"]', date.year ? String(date.year).slice(-2) : "");
    const venueDate = $(".venue-date"); if (venueDate) venueDate.hidden = !date.day;
    const countdown = $(".countdown"); if (countdown) countdown.hidden = !data.dateTime;
    const venue = $(".venue"); if (venue) venue.hidden = !(data.venue?.name || data.venue?.address || data.venue?.mapUrl || data.venue?.lat != null);
    const map = $("#venueMap");
    const mapUrl = data.venue?.mapUrl || (data.venue?.lat != null && data.venue?.lng != null ? `https://maps.google.com/?q=${data.venue.lat},${data.venue.lng}` : "");
    if (map) { map.href = mapUrl; map.hidden = !mapUrl; map.textContent = t.map; }

    const gallery = (data.gallery || []).filter((item) => item.src);
    const venuePhoto = $('[data-field="venuePhoto"]');
    const venueWrap = venuePhoto?.closest(".venue-photo");
    if (venuePhoto && venueWrap) {
      const venueImage = gallery[1];
      venuePhoto.src = venueImage?.src || "./assets/images/yakk.png";
      venuePhoto.alt = venueImage?.alt || venueImage?.caption || t.venuePhoto;
      venueWrap.hidden = false;
    }
    const galleryPhoto = $('[data-field="galleryPhoto"]');
    const photoBlock = galleryPhoto?.closest(".photo-block");
    if (galleryPhoto && photoBlock) {
      const featureImage = gallery[0];
      galleryPhoto.src = featureImage?.src || "./assets/images/0310/1.png";
      galleryPhoto.alt = featureImage?.alt || featureImage?.caption || t.featurePhoto;
      photoBlock.hidden = false;
    }

    const timing = $("#timingList");
    if (timing) {
      timing.replaceChildren();
      (data.program || []).forEach((item) => {
        if (!item.time && !item.title) return;
        const row = document.createElement("div"); row.className = "timing-row";
        const time = document.createElement("strong"); time.textContent = item.time || "";
        const title = document.createElement("span"); title.textContent = item.title || "";
        row.append(time, title); timing.append(row);
      });
      const section = timing.closest(".timing"); if (section) section.hidden = !timing.childElementCount;
    }

    const form = $("#rsvpForm");
    if (form) {
      form.hidden = !data.rsvp?.enabled;
      const name = $("#rsvpName"); if (name) name.value = data.guestName || name.value || "";
      const wish = $("#rsvpWish"); if (wish) wish.hidden = !data.wishesEnabled;
      const yes = $("#rsvpYes"), no = $("#rsvpNo"); if (yes) yes.required = true; if (no) no.required = true;
    }
    const contacts = data.contacts || [];
    const phone = contacts.find((item) => item.type === "phone");
    const telegram = contacts.find((item) => item.type === "telegram");
    const phoneLink = $('[data-contact="phone"]');
    if (phoneLink) { phoneLink.href = phone?.href || ""; phoneLink.hidden = !phone; phoneLink.setAttribute("aria-label", phone ? `${phone.label}: ${phone.value}` : "Phone"); }
    const telegramLink = $('[data-contact="telegram"]');
    if (telegramLink) { telegramLink.href = telegram?.href || ""; telegramLink.hidden = !telegram; telegramLink.setAttribute("aria-label", telegram ? `${telegram.label}: ${telegram.value}` : "Telegram"); }
    $('[data-contact="website"]')?.remove(); $('[data-contact="instagram"]')?.remove();

    const old = $(".invitate-languages"); old?.remove();
    const languages = data.languages || [];
    if (languages.length > 1) {
      const nav = document.createElement("nav"); nav.className = "invitate-languages";
      nav.setAttribute("aria-label", data.locale === "en" ? "Invitation language" : data.locale === "ru" ? "Язык приглашения" : data.locale === "uz-Cyrl" ? "Таклифнома тили" : "Taklifnoma tili");
      const names = { uz: "Uz", "uz-Cyrl": "Уз", en: "En", ru: "Ru" };
      languages.forEach((code) => {
        const button = document.createElement("button"); button.type = "button"; button.textContent = names[code] || code;
        button.classList.toggle("is-active", code === data.locale); button.setAttribute("aria-pressed", String(code === data.locale));
        button.addEventListener("click", () => parent.postMessage({ type: "aurelia:language", locale: code }, location.origin)); nav.append(button);
      });
      document.body.append(nav);
    }
    window.dispatchEvent(new CustomEvent("aurelia:data", { detail: data }));
  }

  function setToyonaRevealed(revealed){const card=$("#toyonaCard");const front=$("#toyonaCardFront");const back=$("#toyonaCardBack");const reveal=$("#toyonaReveal");const copyButton=$("#toyonaCopy");const hide=$("#toyonaHide");card?.classList.toggle("is-revealed",revealed);front?.setAttribute("aria-hidden",String(revealed));back?.setAttribute("aria-hidden",String(!revealed));if(reveal){reveal.setAttribute("aria-expanded",String(revealed));reveal.tabIndex=revealed?-1:0;}if(copyButton)copyButton.tabIndex=revealed?0:-1;if(hide)hide.tabIndex=revealed?0:-1;}
  function bindToyona(){const reveal=$("#toyonaReveal");const hide=$("#toyonaHide");reveal?.addEventListener("click",()=>setToyonaRevealed(true));hide?.addEventListener("click",()=>setToyonaRevealed(false));const button=$("#toyonaCopy");if(!button)return;button.addEventListener("click",async()=>{const number=$("#toyonaNumber")?.textContent||"";const status=$("#toyonaStatus");const t=currentStrings();try{await navigator.clipboard.writeText(number);if(status)status.textContent=t.copied;}catch{const field=document.createElement("textarea");field.value=number;field.setAttribute("readonly","");field.style.position="fixed";field.style.opacity="0";document.body.append(field);field.select();let copied=false;try{copied=document.execCommand("copy");}catch{}field.remove();if(status)status.textContent=copied?t.copied:t.copyFailed;if(!copied){const selection=window.getSelection();const range=document.createRange();range.selectNodeContents($("#toyonaNumber"));selection?.removeAllRanges();selection?.addRange(range);}}});}
  function bindResponse() {
    const button = $("#rsvpSubmit"); if (!button) return;
    button.addEventListener("click", async (event) => {
      event.preventDefault(); event.stopImmediatePropagation();
      const t = currentStrings(); const nameInput = $("#rsvpName");
      const error = $("#rsvpError"); const answer = $("#rsvpYes").checked ? "yes" : $("#rsvpNo").checked ? "no" : "";
      const name = nameInput.value.trim();
      if (data.preview) { error.textContent = t.preview; error.style.display = "block"; return; }
      if (!name || !answer) { error.textContent = t.error; error.style.display = "block"; return; }
      const wish = $("#rsvpWish").value.trim(); button.disabled = true; error.textContent = ""; error.style.display = "none";
      try {
        const base = data.apiBase; if (!base) throw new Error("Missing invitation endpoint");
        const response = await fetch(`${base}/rsvp`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, status: answer, partySize: answer === "yes" ? 1 : 0, guestToken: data.guestToken || undefined }) });
        if (!response.ok) throw new Error("RSVP failed");
        if (wish && data.wishesEnabled) {
          const wishes = await fetch(`${base}/wishes`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, message: wish, guestToken: data.guestToken || undefined }) });
          if (!wishes.ok) throw new Error("Wish failed");
        }
        $("#rsvpGuestName").textContent = name;
        $("#rsvpMsgYes").style.display = answer === "yes" ? "block" : "none";
        $("#rsvpMsgNo").style.display = answer === "no" ? "block" : "none";
        $("#rsvpForm").style.display = "none"; $("#rsvpSent").style.display = "block";
      } catch {
        error.textContent = t.failure; error.style.display = "block";
      } finally { button.disabled = false; }
    }, true);
  }

  bindResponse();
  bindToyona();
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== `${location.pathname.split("/")[2]}:update`) return;
    render(event.data.payload);
  });
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const heroVideo = $(".hero-video");
  if (motion.matches) heroVideo?.pause();
  motion.addEventListener?.("change", (event) => { if (event.matches) heroVideo?.pause(); else heroVideo?.play().catch(() => {}); });
  render(data);
})();
