(() => {
  const id = "safir";
  const text = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value || "";
  };
  const dict = {
    ru: { wedding: "Свадьба", welcome: "Дорогие родные и друзья!", saveDate: "Сохраните дату", venue: "Место проведения", venueLead: "Вас ждёт уютная атмосфера и незабываемый праздник в ресторане", map: "Посмотреть на карте", program: "Программа дня", dress: "Дресс-код", contact: "Связаться", contactLead: "По вопросам и сюрпризам свяжитесь с организатором.", rsvp: "Анкета", rsvpLead: "Пожалуйста, заполните форму, чтобы мы могли подготовиться к празднику.", attend: "Вы придёте?", yes: "Да, приду", no: "Не смогу", wishes: "Пожелания", send: "Отправить", sent: "Отправлено!", thanks: "Спасибо, ваш ответ получен", partial: "Ответ записан, но пожелание отправить не удалось.", preview: "В режиме предпросмотра ответы не отправляются.", name: "Ваше имя", placeholder: "Введите ваше имя", close: "Закрыть", final: "Ждём вас!", music: "Музыка", error: "Не удалось отправить. Попробуйте ещё раз." },
    en: { wedding: "Wedding Day", welcome: "Dear family and friends!", saveDate: "Save the date", venue: "Venue", venueLead: "Join us for a warm evening and an unforgettable celebration at", map: "View map", program: "The day", dress: "Dress code", contact: "Contact", contactLead: "For questions or surprises, please contact our organizer.", rsvp: "RSVP", rsvpLead: "Please reply so we can prepare for the celebration.", attend: "Will you attend?", yes: "Yes, I will", no: "Sorry, I can't", wishes: "Wishes", send: "Send", sent: "Sent!", thanks: "Thank you, your response was received", partial: "Your RSVP was saved, but the wish could not be sent.", preview: "Preview only — responses are not sent.", name: "Your name", placeholder: "Enter your name", close: "Close", final: "We hope to see you!", music: "Music", error: "Unable to send. Please try again." },
    uz: { wedding: "To‘y kuni", welcome: "Aziz oila a’zolari va do‘stlar!", saveDate: "Sanani saqlab qo‘ying", venue: "Manzil", venueLead: "Sizni restorandagi shinam muhit va unutilmas bayram kutmoqda", map: "Xaritada ko‘rish", program: "Kun dasturi", dress: "Kiyim uslubi", contact: "Bog‘lanish", contactLead: "Savol va takliflaringiz bo‘lsa, tashkilotchiga murojaat qiling.", rsvp: "Javob", rsvpLead: "Bayramga tayyorgarlik ko‘rishimiz uchun javobingizni yuboring.", attend: "Kelasizmi?", yes: "Ha, kelaman", no: "Kela olmayman", wishes: "Tilaklar", send: "Yuborish", sent: "Yuborildi!", thanks: "Rahmat, javobingiz qabul qilindi", partial: "Javobingiz saqlandi, ammo tilak yuborilmadi.", preview: "Bu ko‘rib chiqish namunasi — javob yuborilmaydi.", name: "Ismingiz", placeholder: "Ismingizni kiriting", close: "Yopish", final: "Sizni kutamiz!", music: "Musiqa", error: "Yuborib bo‘lmadi. Qayta urinib ko‘ring." },
    "uz-Cyrl": { wedding: "Тўй куни", welcome: "Азиз оила аъзолари ва дўстлар!", saveDate: "Санани сақлаб қўйинг", venue: "Манзил", venueLead: "Сизни ресторандаги шинам муҳит ва унутилмас байрам кутмоқда", map: "Харитада кўриш", program: "Кун дастури", dress: "Кийиниш услуби", contact: "Боғланиш", contactLead: "Савол ва таклифларингиз бўлса, ташкилотчига мурожаат қилинг.", rsvp: "Жавоб", rsvpLead: "Байрамга тайёргарлик кўришимиз учун жавобингизни юборинг.", attend: "Келасизми?", yes: "Ҳа, келаман", no: "Кела олмайман", wishes: "Тилаклар", send: "Юбориш", sent: "Юборилди!", thanks: "Раҳмат, жавобингиз қабул қилинди", partial: "Жавобингиз сақланди, аммо тилак юборилмади.", preview: "Бу кўриб чиқиш намунаси — жавоб юборилмайди.", name: "Исмингиз", placeholder: "Исмингизни киритинг", close: "Ёпиш", final: "Сизни кутиб қоламиз!", music: "Мусиқа", error: "Юбориб бўлмади. Қайта уриниб кўринг." },
  };
  const programItemTemplate = document.querySelector(".timing-item")?.cloneNode(true);
  const normalize = (p) => {
    const loc = p.locale === "uz-Cyrl" ? "uz-Cyrl" : p.locale === "en" ? "en" : p.locale === "ru" ? "ru" : "uz";
    return { ...p, locale: loc, labels: dict[loc] };
  };
  let motionObserver = null;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    motionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        motionObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
  }
  function observeMotion(elements) {
    for (const element of elements) {
      if (motionObserver) motionObserver.observe(element);
      else element.classList.add("active");
    }
  }
  function render(raw) {
    const p = normalize(raw), l = p.labels, date = p.date?.short || "";
    const captureMode = new URLSearchParams(location.search).has("qaCapture");
    document.documentElement.lang = p.locale;
    let languageControl = document.querySelector("#safir-language");
    if (!languageControl) {
      languageControl = document.createElement("select");
      languageControl.id = "safir-language";
      languageControl.setAttribute("aria-label", "Language / Тил / Язык");
      languageControl.className = "safir-language";
      languageControl.innerHTML = '<option value="uz">O‘zbekcha</option><option value="uz-Cyrl">Ўзбекча</option><option value="en">English</option><option value="ru">Русский</option>';
      languageControl.addEventListener("change", () => window.parent.postMessage({ type: `${id}:language`, locale: languageControl.value }, location.origin));
      document.body.append(languageControl);
    }
    languageControl.value = p.locale;
    languageControl.hidden = captureMode || (p.languages || []).length < 2;
    languageControl.style.display = languageControl.hidden ? "none" : "";
    [...languageControl.options].forEach((option) => { option.hidden = !(p.languages || []).includes(option.value); });
    text(".hero-title", l.wedding); text(".hero-subtitle", [p.groom, p.bride].filter(Boolean).join(" & "));
    text(".hero-desctitle", date); text(".name-title", p.greeting || l.welcome);
    text(".subtitle", p.message); text(".date-subtitle", date);
    text(".block-title", l.venue); text(".block-subtitle", l.venueLead);
    const hasVenue = Boolean(p.venue?.name || p.venue?.address || p.venue?.landmark || p.venue?.mapUrl || (p.venue?.lat && p.venue?.lng));
    document.querySelector(".info-block").hidden = !hasVenue;
    text(".block-desc", [p.venue?.name, p.venue?.address, p.venue?.landmark].filter(Boolean).join(" · ")); text(".map-btn", l.map);
    const map = document.querySelector(".map-btn"); if (map) { map.href = p.venue?.mapUrl || (p.venue?.lat && p.venue?.lng ? `https://maps.google.com/?q=${p.venue.lat},${p.venue.lng}` : "#"); map.hidden = !p.venue?.mapUrl && !(p.venue?.lat && p.venue?.lng); }
    const programHeading = document.querySelector(".time-card-block .main-title");
    if (programHeading) programHeading.textContent = p.programHeading || l.program;
    const wrapper = document.querySelector(".timing-wrapper");
    const sourceItem = programItemTemplate;
    const icons = ["guest.svg", "banquet.svg", "tort.svg", "zav.svg"];
    if (wrapper && sourceItem) {
      wrapper.replaceChildren(...(p.program || []).map((entry) => {
        const el = sourceItem.cloneNode(true);
        el.querySelector(".timing-icon").src = `./assets/images/safir/${icons[Math.min(icons.length - 1, (p.program || []).indexOf(entry))]}`;
        el.querySelector(".timing-time").textContent = entry.time || "";
        el.querySelector(".timing-title").textContent = entry.title || "";
        el.querySelector(".timing-desc").textContent = "";
        el.querySelectorAll("br").forEach((br) => br.remove());
        return el;
      }));
      wrapper.closest(".time-card-block").hidden = !(p.program || []).length;
      observeMotion(wrapper.querySelectorAll(".timing-item"));
    }
    const dress = document.querySelector(".dresscode-block"); dress.hidden = !p.dressCode?.enabled;
    if (p.dressCode?.enabled) { text(".dresscode-content .main-title", l.dress); const copy = dress.querySelectorAll(".subtitle"); if (copy[0]) copy[0].textContent = [p.dressCode.style, p.dressCode.text].filter(Boolean).join(" · "); if (copy[1]) copy[1].textContent = p.dressCode.note || ""; }
    const palette = document.querySelector(".dresscode-palette");
    if (palette) { palette.replaceChildren(...(p.dressCode?.colors || []).map((color) => { const swatch = document.createElement("span"); swatch.className = "color-circle"; swatch.style.background = color.hex; swatch.title = color.name || color.hex; swatch.setAttribute("aria-label", swatch.title); return swatch; })); }
    const phone = p.contacts?.find((c) => c.type === "phone");
    text(".contact-subblock .main-title", l.contact); text(".contact-subblock .block-desc", l.contactLead);
    const contactSection = document.querySelector(".contact-subblock"); contactSection.hidden = !phone;
    const contact = document.querySelector(".ctc-btn"); if (contact) { contact.href = phone?.href || "#"; contact.textContent = l.contact; }
    const formSection = document.querySelector(".form-subblock"); formSection.hidden = !p.rsvp?.enabled;
    text(".form-subblock .main-title", l.rsvp); text(".form-subblock .subtitle", l.rsvpLead); const rsvpButton = document.querySelector("#openRsvpBtn"); if (rsvpButton) { rsvpButton.textContent = l.rsvp; }
    text("[data-label='save-date']", l.saveDate);
    text("#closeRsvpBtn", "×"); document.querySelector("#closeRsvpBtn")?.setAttribute("aria-label", l.close);
    text("#rsvpFormView .rsvp-title", l.rsvp); text("#rsvpFormView .rsvp-subtitle", p.rsvpIntro || "");
    text(".rsvp-label", l.name); const name = document.querySelector("#rsvpName"); if (name) name.placeholder = l.placeholder;
    const attend = document.querySelector(".rsvp-radio-group"); if (attend) { attend.previousElementSibling.textContent = l.attend; attend.querySelectorAll("label span")[0].textContent = l.yes; attend.querySelectorAll("label span")[1].textContent = l.no; }
    const wish = document.querySelector("#rsvpWishes"); if (wish) { wish.previousElementSibling.textContent = l.wishes; wish.previousElementSibling.hidden = !p.wishesEnabled; wish.hidden = !p.wishesEnabled; }
    text("#rsvpSubmitBtn", l.send); text("#rsvpSuccessView .rsvp-title", l.sent); text("#rsvpSuccessView .rsvp-subtitle", l.thanks); text(".final-text", l.final);
    const cardBlocks = document.querySelectorAll(".time-card-block");
    if (cardBlocks[0]) textWithin(cardBlocks[0], ".main-title", p.programHeading || l.program);
    if (cardBlocks[1]) { const ambience = cardBlocks[1].querySelectorAll(":scope > .main-title,:scope > .block-desc"); ambience.forEach((el) => { el.hidden = true; }); }
    const closing = document.querySelector(".final-title"); if (closing) closing.hidden = true;
    const musicUrl = p.silentPlayback ? "" : p.music;
    const audio = document.querySelector("#bgMusic"); if (audio) { if (audio.src !== new URL(musicUrl || "about:blank", location.href).href) audio.src = musicUrl || ""; audio.hidden = !musicUrl; const musicButton = document.querySelector("#soundToggle"); musicButton.hidden = !musicUrl; musicButton.title = l.music; musicButton.setAttribute("aria-label", l.music); if (!musicUrl) audio.pause(); }
    document.querySelector("#soundToggle")?.setAttribute("aria-label", l.music);
    const heroImg = document.querySelector(".card-main-img"); const firstPhoto = p.gallery?.[0]; if (heroImg && firstPhoto?.src) heroImg.src = firstPhoto.src;
    window.__safirPayload = p;
  }
  function textWithin(parent, selector, value) { const el = parent.querySelector(selector); if (el) el.textContent = value || ""; }
  window.addEventListener("message", (event) => { if (event.origin !== location.origin || event.data?.type !== `${id}:update`) return; render(event.data.payload); });
  const seed = (() => { try { return JSON.parse(window.name || "{}"); } catch { return {}; } })();
  if (seed.groom || seed.locale) render(seed);
  window.name = "";
  const openingCapture = new URLSearchParams(location.search).has("qaCapture");
  if (openingCapture) {
    document.querySelector("#soundToggle")?.setAttribute("hidden", "");
    document.documentElement.style.scrollbarWidth = "none";
    const captureStyles = document.createElement("style");
    captureStyles.textContent = "::-webkit-scrollbar{display:none!important}";
    document.head.append(captureStyles);
    document.querySelectorAll(".hero-section .animate-up,.hero-section .animate-fade,.hero-section .animate-zoom").forEach((el) => { el.style.animation = "none"; el.style.opacity = "1"; });
  }
  observeMotion(document.querySelectorAll(".animate-up,.animate-fade,.animate-zoom"));
  const overlay = document.querySelector("#rsvpOverlay");
  const closeModal = () => { overlay.classList.remove("open"); document.body.style.overflow = ""; };
  document.querySelector("#openRsvpBtn")?.addEventListener("click", () => { overlay.classList.add("open"); document.body.style.overflow = "hidden"; document.querySelector("#rsvpName").focus(); });
  document.querySelector("#closeRsvpBtn")?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", (event) => { if (event.target === overlay) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
  const music = document.querySelector("#bgMusic"), toggle = document.querySelector("#soundToggle");
  const setMusicState = () => { const playing = music && !music.paused; document.querySelector("#soundIconOn").style.display = playing ? "block" : "none"; document.querySelector("#soundIconOff").style.display = playing ? "none" : "block"; };
  toggle?.addEventListener("click", async () => { try { if (music.paused) await music.play(); else music.pause(); } catch {} setMusicState(); });
  music?.addEventListener("play", setMusicState); music?.addEventListener("pause", setMusicState);
  window.parent.postMessage({ type: `${id}:ready` }, location.origin);
  const form = document.querySelector("#rsvpForm"), error = document.querySelector("#rsvpError");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault(); error.textContent = "";
    const p = window.__safirPayload || {}, name = document.querySelector("#rsvpName").value.trim(), attend = form.querySelector('input[name="attend"]:checked'), wishes = document.querySelector("#rsvpWishes").value.trim();
    if (!name || !attend) { error.textContent = p.labels?.error || "Please complete the required fields."; return; }
    if (p.preview) { error.textContent = p.labels?.preview || "Preview responses are not saved."; return; }
    const btn = document.querySelector("#rsvpSubmitBtn"), old = btn.textContent; btn.disabled = true;
    let rsvpSaved = false;
    try {
      const response = await fetch(`${p.apiBase}/rsvp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, status: attend.value, partySize: attend.value === "yes" ? 1 : 0, note: "", guestToken: p.guestToken || undefined }) });
      if (!response.ok) throw new Error("RSVP failed");
      rsvpSaved = true;
      if (wishes && p.wishesEnabled) {
        const wishResponse = await fetch(`${p.apiBase}/wishes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message: wishes, guestToken: p.guestToken || undefined }) });
        if (!wishResponse.ok) throw new Error("Wish submission failed after RSVP was saved");
      }
      document.querySelector("#rsvpFormView").classList.add("hide"); document.querySelector("#rsvpSuccessView").classList.add("show");
    } catch {
      if (rsvpSaved) {
        document.querySelector("#rsvpFormView").classList.add("hide");
        document.querySelector("#rsvpSuccessView").classList.add("show");
        document.querySelector("#rsvpSuccessView .rsvp-subtitle").textContent = p.labels?.partial || p.labels?.thanks || "";
      } else {
        error.textContent = p.labels?.error || "Unable to submit your response.";
        btn.disabled = false;
        btn.textContent = old;
      }
    }
  });
})();
