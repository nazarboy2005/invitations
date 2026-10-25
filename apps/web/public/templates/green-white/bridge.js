(() => {
  "use strict";
  const id = "green-white";
  const root = document.querySelector('[data-chorlove-template="green-white"]');
  if (!root) return;
  const sections = [...root.querySelectorAll("section")];
  const copy = {
    "uz-Latn": { welcome: "Assalomu alaykum", title: "Taklifnoma", couple: "Kelin & Kuyov", invite: "Sizni hayotimizdagi eng baxtli kunimizga taklif qilamiz", date: "To'y sanasi", countdown: "Baxtli onlargacha...", countdownCaption: "Soniya sayin yaqinlashmoqdamiz", venue: "To'y manzili", map: "Xaritada ko'rish", gift: "Sovg'a o'rniga karta orqali tabriklashingiz mumkin", giftHeading: "To'yona", cardHolder: "Karta egasi", copy: "Nusxa olish", copied: "Karta raqami nusxalandi.", copyError: "Nusxa olib bo'lmadi.", gallery: "Galereya", dressCode: "Dress-kod", dressIntro: "Qanday kiyinish kerak", wishes: "Tilaklar", wishIntro: "To'y egalariga o'z ezgu tilaklaringizni qoldiring", wish: "Kelin-kuyovga tilagingiz...", rsvp: "Kelasizmi?", rsvpPrompt: "Iltimos, javobingizni bildiring.", yes: "Kelaman", no: "Kela olmayman", send: "Yuborish", guest: "Ismingiz", guestFull: "Ism va familiyangiz", saved: "Javobingiz saqlandi. Rahmat!", submitted: "Tilagingiz yuborildi.", error: "Yuborilmadi. Qayta urinib ko'ring.", preview: "Ko'rish rejimida yuborish o'chiq.", guestRequired: "Ismingizni kiriting.", wishRequired: "Tilagingizni yozing.", chooseResponse: "Javobingizni tanlang.", responseLabel: "Javobingiz", days: "Kun", hours: "Soat", minutes: "Daq", seconds: "Son", photo: "Surat", close: "Yopish", next: "Keyingi", previous: "Oldingi", zoomIn: "Kattalashtirish", zoomOut: "Kichraytirish", fullscreen: "To'liq ekran", hosts: "Hurmat bilan", contact: "Bog'lanish uchun", language: "Til", playMusic: "Musiqani yoqish", pauseMusic: "Musiqani to'xtatish", musicUnavailable: "Musiqa mavjud emas", footer: "Taklifnoma" },
    "uz-Cyrl": { welcome: "Ассалому алайкум", title: "Таклифнома", couple: "Келин & Куёв", invite: "Сизни ҳаётимиздаги энг бахтли кунимизга таклиф қиламиз", date: "Тўй санаси", countdown: "Бахтли онларгача...", countdownCaption: "Сония сайин яқинлашмоқдамиз", venue: "Тўй манзили", map: "Харитада кўриш", gift: "Совға ўрнига карта орқали табриклашингиз мумкин", giftHeading: "Тўёна", cardHolder: "Карта эгаси", copy: "Нусха олиш", copied: "Карта рақами нусхаланди.", copyError: "Копиялашнинг иложи бўлмади.", gallery: "Галерея", dressCode: "Dress-kod", dressIntro: "Қандай кийиниш керак", wishes: "Тилаклар", wishIntro: "Тўй эгаларига эзгу тилакларингизни қолдиринг", wish: "Келин-куёвга тилагингиз...", rsvp: "Келасизми?", rsvpPrompt: "Илтимос, жавобингизни билдиринг.", yes: "Келаман", no: "Кела олмайман", send: "Юбориш", guest: "Исмигиз", guestFull: "Исм ва фамилиянгиз", saved: "Жавобингиз сақланди. Раҳмат!", submitted: "Тилагингиз юборилди.", error: "Юборилмади. Қайта уриниб кўринг.", preview: "Кўриш режимида юбориш ўчиқ.", guestRequired: "Исмигизни киритинг.", wishRequired: "Тилагингизни ёзинг.", chooseResponse: "Жавобингизни танланг.", responseLabel: "Жавобингиз", days: "Кун", hours: "Соат", minutes: "Дақ", seconds: "Сон", photo: "Сурат", close: "Ёпиш", next: "Кейинги", previous: "Олдинги", zoomIn: "Катталаштириш", zoomOut: "Кичрайтириш", fullscreen: "Тўлиқ экран", hosts: "Ҳурмат билан", contact: "Боғланиш учун", language: "Тил", playMusic: "Мусиқани ёқиш", pauseMusic: "Мусиқани тўхтатиш", musicUnavailable: "Мусиқа мавжуд эмас", footer: "Таклифнома" },
    en: { welcome: "Welcome", title: "Invitation", couple: "The couple", invite: "You are invited to the happiest day of our lives", date: "Wedding date", countdown: "Until our happy day...", countdownCaption: "Every second brings us closer", venue: "Venue", map: "Open map", gift: "You can send your congratulations by card", giftHeading: "Wedding gift", cardHolder: "Card holder", copy: "Copy card number", copied: "Card number copied.", copyError: "Could not copy the card number.", gallery: "Gallery", dressCode: "Dress code", dressIntro: "What to wear", wishes: "Wishes", wishIntro: "Leave your wishes for the couple", wish: "Your wish...", rsvp: "Will you join us?", rsvpPrompt: "Please let us know if you can attend.", yes: "I'll attend", no: "I can't attend", send: "Submit", guest: "Your name", guestFull: "Your full name", saved: "Your response was saved. Thank you!", submitted: "Your wish was sent.", error: "Could not submit. Please try again.", preview: "Submissions are disabled in preview.", guestRequired: "Enter your name.", wishRequired: "Write a wish.", chooseResponse: "Choose your RSVP response.", responseLabel: "Your response", days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec", photo: "Photo", close: "Close", next: "Next", previous: "Previous", zoomIn: "Zoom in", zoomOut: "Zoom out", fullscreen: "Toggle full screen", hosts: "With love from", contact: "Contact us", language: "Language", playMusic: "Play music", pauseMusic: "Pause music", musicUnavailable: "Music unavailable", footer: "Invitation" },
    ru: { welcome: "Добро пожаловать", title: "Приглашение", couple: "Жених и невеста", invite: "Приглашаем вас на самый счастливый день нашей жизни", date: "Дата свадьбы", countdown: "До нашего счастливого дня...", countdownCaption: "С каждой секундой мы ближе", venue: "Место проведения", map: "Открыть карту", gift: "Вы можете отправить поздравление на карту", giftHeading: "Подарок", cardHolder: "Держатель карты", copy: "Скопировать номер", copied: "Номер карты скопирован.", copyError: "Не удалось скопировать номер карты.", gallery: "Галерея", dressCode: "Дресс-код", dressIntro: "Как одеться", wishes: "Пожелания", wishIntro: "Оставьте пожелания молодожёнам", wish: "Ваше пожелание...", rsvp: "Вы придёте?", rsvpPrompt: "Пожалуйста, сообщите, сможете ли вы прийти.", yes: "Приду", no: "Не смогу прийти", send: "Отправить", guest: "Ваше имя", guestFull: "Ваши имя и фамилия", saved: "Ваш ответ сохранён. Спасибо!", submitted: "Ваше пожелание отправлено.", error: "Не удалось отправить. Попробуйте ещё раз.", preview: "Отправка в режиме просмотра отключена.", guestRequired: "Введите ваше имя.", wishRequired: "Напишите пожелание.", chooseResponse: "Выберите ваш ответ.", responseLabel: "Ваш ответ", days: "Дней", hours: "Часов", minutes: "Мин", seconds: "Сек", photo: "Фото", close: "Закрыть", next: "Далее", previous: "Назад", zoomIn: "Увеличить", zoomOut: "Уменьшить", fullscreen: "Полный экран", hosts: "С уважением", contact: "Связаться с нами", language: "Язык", playMusic: "Включить музыку", pauseMusic: "Выключить музыку", musicUnavailable: "Музыка недоступна", footer: "Приглашение" },
  };
  let payload;
  let timer;
  let motionPrepared = false;
  let openingStarted = false;
  let motionReduced = false;
  let sourceObserver = null;
  const $ = (selector, base = root) => base.querySelector(selector);
  const tx = (node, value) => { if (node) node.textContent = value == null ? "" : String(value); };
  const hide = (node, value) => { if (node) node.hidden = Boolean(value); };
  const setButtonText = (button, value) => {
    if (!button) return;
    const text = [...button.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (text) text.textContent = value;
    else if (button.querySelector("span")) tx(button.querySelector("span"), value);
    else button.append(document.createTextNode(value));
  };
  const section = (index) => sections[index];

  function clearMotionStyle(node) {
    const initial = {
      opacity: node.style.opacity,
      filter: node.style.filter,
      transform: node.style.transform,
    };
    node.style.removeProperty("opacity");
    node.style.removeProperty("filter");
    node.style.removeProperty("transform");
    const base = getComputedStyle(node);
    return {
      ...initial,
      baseTransform: base.transform === "none" ? "" : base.transform,
      baseFilter: base.filter === "none" ? "" : base.filter,
    };
  }

  function animateSourceElement(node, options = {}) {
    if (!node || typeof node.animate !== "function") return;
    const initial = clearMotionStyle(node);
    const startTransform = [initial.transform, initial.baseTransform].filter(Boolean).join(" ") || "none";
    const endTransform = initial.baseTransform || "none";
    const frames = [{
      ...(initial.opacity ? { opacity: initial.opacity } : {}),
      ...(initial.filter ? { filter: initial.filter } : {}),
      ...(options.fromTransform ? { transform: [options.fromTransform, initial.baseTransform].filter(Boolean).join(" ") || "none" } : { transform: startTransform }),
    }, {
      ...(options.toOpacity != null ? { opacity: options.toOpacity } : initial.opacity ? { opacity: 1 } : {}),
      ...(initial.filter ? { filter: initial.baseFilter || "none" } : {}),
      transform: options.toTransform || endTransform,
    }];
    const animation = node.animate(frames, {
      duration: options.duration ?? 900,
      delay: options.delay ?? 0,
      easing: options.easing || "ease-out",
      fill: "both",
    });
    animation.onfinish = () => {
      animation.cancel();
      if (initial.opacity) node.style.opacity = String(options.toOpacity ?? 1);
      if (initial.filter) node.style.filter = initial.baseFilter;
    };
    return animation;
  }

  function appendOpening(p, c) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#2d321b] gw-source-opening";
    overlay.dataset.gwSourceOpening = "";
    overlay.style.backgroundColor = "#2d321b";
    overlay.style.opacity = "1";

    const top = document.createElement("div");
    top.className = "absolute inset-0 origin-top bg-white";
    top.style.backgroundColor = "#fff";
    top.style.transformOrigin = "top";
    top.style.transform = "scaleY(1)";
    const bottom = document.createElement("div");
    bottom.className = "absolute inset-0 origin-bottom bg-[#666947]";
    bottom.style.backgroundColor = "#666947";
    bottom.style.transformOrigin = "bottom";
    bottom.style.transform = "scaleY(1)";

    const title = document.createElement("div");
    title.className = "relative z-10 text-center text-white px-8 gw-opening-copy";
    title.style.opacity = "0";
    title.style.transform = "translateY(20px) scale(.86)";
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("width", "28");
    icon.setAttribute("height", "28");
    icon.setAttribute("fill", "none");
    icon.setAttribute("stroke", "currentColor");
    icon.setAttribute("stroke-width", "2");
    icon.setAttribute("stroke-linecap", "round");
    icon.setAttribute("stroke-linejoin", "round");
    icon.setAttribute("aria-hidden", "true");
    icon.classList.add("mx-auto", "mb-5", "text-green-100");
    icon.classList.add("gw-opening-sparkles");
    const rays = document.createElementNS(icon.namespaceURI, "path");
    rays.setAttribute("d", "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z");
    const shine = document.createElementNS(icon.namespaceURI, "path");
    shine.setAttribute("d", "M20 2v4M22 4h-4");
    const dot = document.createElementNS(icon.namespaceURI, "circle");
    dot.setAttribute("cx", "4"); dot.setAttribute("cy", "20"); dot.setAttribute("r", "2");
    icon.append(rays, shine, dot);
    const label = document.createElement("p");
    label.className = "text-[10px] uppercase tracking-[0.45em] text-green-100/80";
    label.dataset.gwOpeningLabel = "";
    const names = document.createElement("h2");
    names.className = "mt-5 text-4xl italic leading-tight";
    names.dataset.gwOpeningNames = "";
    title.append(icon, label, names);
    overlay.append(top, bottom, title);
    document.body.append(overlay);
    updateOpeningCopy(p, c);
    return { overlay, top, bottom, title };
  }

  function updateOpeningCopy(p, c) {
    const label = document.querySelector("[data-gw-opening-label]");
    const names = document.querySelector("[data-gw-opening-names]");
    tx(label, c.title);
    if (!names) return;
    names.replaceChildren();
    names.append(document.createTextNode(p.data?.groom || ""), document.createTextNode(" "));
    const ampersand = document.createElement("span");
    ampersand.className = "text-green-100";
    ampersand.textContent = "&";
    names.append(ampersand, document.createTextNode(" "), document.createTextNode(p.data?.bride || ""));
  }

  function playOpening(p, c, reduced) {
    if (openingStarted) { updateOpeningCopy(p, c); return; }
    openingStarted = true;
    const opening = appendOpening(p, c);
    if (reduced) { opening.overlay.remove(); return; }
    const easing = "cubic-bezier(.83,0,.17,1)";
    opening.top.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { duration: 1000, delay: 1450, easing, fill: "forwards" });
    opening.bottom.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { duration: 1000, delay: 1650, easing, fill: "forwards" });
    opening.title.animate([
      { opacity: 0, transform: "translateY(20px) scale(.86)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
      { opacity: 0, transform: "translateY(-18px) scale(1.08)" },
    ], { duration: 2000, easing: "ease-out", fill: "forwards" });
    opening.overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800, delay: 2150, easing: "ease-in-out", fill: "forwards" });
    window.setTimeout(() => opening.overlay.remove(), 3000);
  }

  function revealOptions(node, initialTransform) {
    if (initialTransform.includes("scale(0.78) rotate(-8deg)")) return { duration: 1000, easing: "cubic-bezier(.22,1,.36,1)" };
    if (initialTransform.includes("translateY(56px) scale(0.94)")) return { duration: 950, easing: "cubic-bezier(.22,1,.36,1)" };
    if (initialTransform.includes("translateY(54px) scale(0.94)")) return { duration: 950, easing: "cubic-bezier(.22,1,.36,1)" };
    if (initialTransform.includes("translateY(-35px) scale(0.9)") || initialTransform.includes("translateY(35px) scale(0.9)")) return { duration: 800, delay: 250, easing: "ease-out" };
    if (initialTransform.includes("translateY(24px)")) return { duration: 700, delay: node.tagName === "LI" ? [...node.parentElement.children].indexOf(node) * 120 : 0, easing: "ease-out" };
    if (initialTransform.includes("translateY(30px)")) return { duration: 700, delay: node.tagName === "BUTTON" ? ([...node.parentElement.children].indexOf(node) % 2) * 120 : 0, easing: "ease-out" };
    if (initialTransform.includes("translateY(18px) scale(0.6)")) return { duration: 550, delay: [...node.parentElement.children].indexOf(node) * 90, easing: "ease-out" };
    if (initialTransform.includes("translateY(18px) scale(0.9)")) return { duration: 600, easing: "ease-out" };
    if (initialTransform.includes("translateY(40px) rotate(-4deg)")) return { duration: 1000, easing: "cubic-bezier(.22,1,.36,1)" };
    if (initialTransform.includes("translateX(24px)") || initialTransform.includes("translateX(-24px)")) return { duration: 600, easing: "ease-out" };
    if (node.style.filter.includes("blur(8px)")) {
      const peers = [...(node.parentElement?.children || [])].filter((peer) => peer.style.opacity === "0" && peer.style.filter.includes("blur(8px)"));
      const index = peers.indexOf(node);
      return { duration: 900, delay: peers.length > 1 ? 100 + index * 140 : 0, easing: "ease-out" };
    }
    return { duration: 900, easing: "ease-out" };
  }

  function playHeroMotion(reduced) {
    const hero = section(0);
    if (!hero) return;
    const find = (includes) => [...hero.querySelectorAll("div")].find((node) => String(node.className).includes(includes));
    const background = find("h-[43vh]");
    const artwork = find("top-[22vh]");
    const flowers = find("bottom-8 left-0");
    if (reduced) {
      for (const node of [background, artwork, flowers, ...hero.querySelectorAll('[style*="translateX(-105%)"]'), ...hero.querySelectorAll(".pt-5.text-green-950\\/70")]) {
        if (!node) continue;
        node.style.removeProperty("opacity"); node.style.removeProperty("transform");
      }
      return;
    }
    animateSourceElement(background, { duration: 1400, easing: "cubic-bezier(.22,1,.36,1)" });
    animateSourceElement(artwork, { duration: 1350, delay: 350, easing: "cubic-bezier(.22,1,.36,1)" });
    animateSourceElement(flowers, { duration: 1000, delay: 1000, easing: "ease" });
    const divider = hero.querySelector('[style*="translateX(-105%)"]');
    if (divider) animateSourceElement(divider, { fromTransform: "translateX(-105%)", toOpacity: null, duration: 900, delay: 1250, easing: "cubic-bezier(.22,1,.36,1)" });
    const chevron = hero.querySelector(".pt-5.text-green-950\\/70");
    if (chevron) {
      chevron.style.removeProperty("opacity"); chevron.style.removeProperty("transform");
      chevron.animate([{ opacity: 0, translate: "0 -8px" }, { opacity: 1, translate: "0 0" }], { duration: 350, delay: 2400, easing: "ease-out", fill: "forwards" });
      chevron.animate([{ translate: "0 0" }, { translate: "0 8px" }, { translate: "0 0" }], { duration: 1800, delay: 2400, easing: "ease-in-out", iterations: Infinity });
    }
    if (artwork?.firstElementChild) artwork.firstElementChild.animate([{ translate: "0 0" }, { translate: "0 -10px" }, { translate: "0 0" }], { duration: 6000, easing: "ease-in-out", iterations: Infinity });
    if (flowers) {
      flowers.children[0]?.animate([{ rotate: "0deg" }, { rotate: "-2deg" }, { rotate: "0deg" }], { duration: 5000, easing: "ease-in-out", iterations: Infinity });
      flowers.children[1]?.animate([{ rotate: "0deg" }, { rotate: "2deg" }, { rotate: "0deg" }], { duration: 5500, easing: "ease-in-out", iterations: Infinity });
    }
    const ring = hero.querySelector('img[src$="/rings.webp"]');
    if (ring?.parentElement) ring.parentElement.animate([{ scale: 1, rotate: "0deg" }, { scale: 1.08, rotate: "-6deg" }, { scale: 1, rotate: "6deg" }, { scale: 1, rotate: "0deg" }], { duration: 3800, easing: "ease-in-out", iterations: Infinity });
  }

  function playSourceDecorations(reduced) {
    if (reduced) return;
    const stars = [...root.querySelectorAll('div[style*="left:"][style*="top:"]')].filter((node) => node.style.left.endsWith("%") && node.style.top.endsWith("%") && node.querySelector("svg"));
    stars.forEach((star, index) => {
      const delay = (index % 12) * 450, duration = 3600 + (index % 7) * 550, drift = 8 + (index % 4) * 5;
      star.style.removeProperty("opacity"); star.style.removeProperty("transform");
      star.animate([{ opacity: 0, scale: 0.35, rotate: "-25deg" }, { opacity: 0.9, scale: 1.25, rotate: "10deg" }, { opacity: 0.35, scale: 0.72, rotate: "35deg" }, { opacity: 1, scale: 1, rotate: "0deg" }, { opacity: 0, scale: 0.35, rotate: "-25deg" }], { duration, delay, easing: "ease-in-out", iterations: Infinity });
      star.animate([{ translate: "0 0" }, { translate: `0 -${drift}px` }, { translate: "0 0" }], { duration, delay, easing: "ease-in-out", iterations: Infinity });
    });
    for (const sectionNode of sections) {
      for (const side of ["-left-44", "-right-44"]) {
        const cloud = [...sectionNode.querySelectorAll("div")].find((node) => String(node.className).includes(side));
        const moving = cloud?.firstElementChild;
        if (!moving) continue;
        const values = side === "-left-44" ? ["-14px -5px", "16px 8px", "-14px -5px"] : ["14px 8px", "-16px -5px", "14px 8px"];
        moving.animate(values.map((translate) => ({ translate })), { duration: side === "-left-44" ? 11000 : 13000, easing: "ease-in-out", iterations: Infinity });
      }
    }
  }

  function prepareMotion(p, c) {
    if (motionPrepared) return;
    motionPrepared = true;
    motionReduced = Boolean(p.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("qaReducedMotion") === "1";
    playOpening(p, c, motionReduced);
    playHeroMotion(motionReduced);
    playSourceDecorations(motionReduced);
    const hero = section(0);
    const reveals = [];
    for (const node of root.querySelectorAll('[style*="opacity:0"]')) {
      if (node.style.left.endsWith("%") && node.style.top.endsWith("%") && node.querySelector("svg")) continue;
      if (hero?.contains(node) && (String(node.className).includes("h-[43vh]") || String(node.className).includes("top-[22vh]") || String(node.className).includes("bottom-8 left-0"))) continue;
      const initialTransform = node.style.transform || "";
      const initialFilter = node.style.filter || "";
      if (motionReduced) {
        node.style.removeProperty("opacity"); node.style.removeProperty("filter"); node.style.removeProperty("transform");
        continue;
      }
      const options = revealOptions(node, initialTransform);
      const state = clearMotionStyle(node);
      node.dataset.gwSourceReveal = "";
      reveals.push({ node, options, state });
    }
    const springs = [...root.querySelectorAll('[style*="scale(0.55)"]')].map((node) => ({ node, state: clearMotionStyle(node) }));
    if (motionReduced) springs.forEach(({ node }) => { node.style.removeProperty("transform"); });
    const animateReveal = ({ node, options, state }) => {
      const baselineTransform = state.baseTransform || "none";
      const initialTransform = [state.transform, state.baseTransform].filter(Boolean).join(" ") || baselineTransform;
      const animation = node.animate([
        { opacity: 0, ...(state.filter ? { filter: state.filter } : {}), transform: initialTransform },
        { opacity: 1, ...(state.filter ? { filter: state.baseFilter || "none" } : {}), transform: baselineTransform },
      ], { duration: options.duration, delay: options.delay, easing: options.easing, fill: "both" });
      animation.onfinish = () => { animation.cancel(); node.style.opacity = "1"; if (state.filter) node.style.filter = state.baseFilter; };
    };
    if (motionReduced || !("IntersectionObserver" in window)) {
      reveals.forEach(animateReveal);
      root.querySelectorAll('[style*="scale(0.55)"]').forEach((node) => { node.style.removeProperty("transform"); });
      return;
    }
    sourceObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const dynamicOptions = entry.target.dataset.gwDynamicSourceReveal;
        if (dynamicOptions) {
          delete entry.target.dataset.gwDynamicSourceReveal;
          animateSourceElement(entry.target, JSON.parse(dynamicOptions));
          sourceObserver.unobserve(entry.target);
          continue;
        }
        const reveal = reveals.find((item) => item.node === entry.target);
        if (reveal) animateReveal(reveal);
        const spring = springs.find((item) => item.node === entry.target);
        if (spring) {
          const baseline = spring.state.baseTransform || "none";
          const start = [spring.state.transform, spring.state.baseTransform].filter(Boolean).join(" ") || baseline;
          const animation = spring.node.animate([{ transform: start }, { transform: baseline }], { duration: 700, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "both" });
          animation.onfinish = () => animation.cancel();
        }
        sourceObserver.unobserve(entry.target);
      }
    }, { root, threshold: 0.35 });
    reveals.forEach(({ node }) => sourceObserver.observe(node));
    springs.forEach(({ node }) => sourceObserver.observe(node));
  }

  function observeDynamicSourceReveal(node, options) {
    if (motionReduced) {
      node.style.removeProperty("opacity");
      node.style.removeProperty("filter");
      node.style.removeProperty("transform");
      return;
    }
    if (!sourceObserver) {
      animateSourceElement(node, options);
      return;
    }
    node.dataset.gwDynamicSourceReveal = JSON.stringify(options);
    sourceObserver.observe(node);
  }

  function render(p) {
    payload = p;
    const d = p.data || {};
    const c = copy[p.locale] || copy["uz-Latn"];
    document.documentElement.lang = p.locale === "uz-Latn" ? "uz" : p.locale;
    tx(section(0)?.querySelector("p.text-xs"), d.greeting || c.welcome);
    tx(section(0)?.querySelector("h1"), d.title || c.title);
    tx(section(0)?.querySelector("h2"), [d.groom, d.bride].filter(Boolean).join(" & "));
    tx(section(1)?.querySelector("p"), c.couple);
    const couple = section(1)?.querySelectorAll("h2") || [];
    tx(couple[0], d.groom); tx(couple[1], d.bride);
    tx(section(3)?.querySelector("p"), d.message || c.invite);
    renderDate(d, p, c);
    renderVenue(d.venue || {}, c);
    renderGift(d.toyona || {}, c);
    renderGallery(d.gallery || [], p, c);
    renderDressCode(d.dressCode || {}, c);
    renderWishes(d.wishes || [], p, c);
    renderContacts(d.contacts || [], c);
    renderFooter(d, c);
    prepareMotion(p, c);
    tx(section(5)?.querySelector("p"), c.countdownCaption);
    tx(section(8)?.querySelector("h2"), c.gallery);
    tx(section(11)?.querySelector(".relative.z-20.text-center h2"), c.rsvp);
    tx(section(11)?.querySelector(".relative.z-20.text-center p"), c.rsvpPrompt);
    wireForm(section(10), "wishes", c);
    wireForm(section(11), "rsvp", c);
    installLocales(p, c);
    installMusic(d, p, c);
    root.classList.toggle("gw-reduced-motion", Boolean(p.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function renderDate(d, p, c) {
    const dateSection = section(4), countdown = section(5), date = d.date || {};
    const target = Date.parse(d.dateTime || "");
    const valid = Number.isFinite(target);
    hide(dateSection, !valid); hide(countdown, !valid);
    tx(dateSection?.querySelector("h3"), date.long || c.date);
    tx(dateSection?.querySelector(".flex.items-center.justify-center.gap-2 span"), date.time);
    tx(dateSection?.querySelector("span.text-base.font-serif"), [date.month, date.year].filter(Boolean).join(" "));
    const grids = [...(dateSection?.querySelectorAll("[class*=grid-cols-7]") || [])];
    const locale = p.locale === "uz-Latn" ? "uz-Latn" : p.locale;
    if (grids[0]) {
      const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + i))));
      grids[0].replaceChildren(...weekdays.map((value) => { const n = document.createElement("span"); n.textContent = value; return n; }));
    }
    const grid = grids[1];
    const month = Number(date.monthNumber), year = Number(date.year), day = Number(date.day);
    if (grid && month >= 1 && month <= 12 && year) {
      const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
      const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
      grid.replaceChildren(...Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, i) => {
        const cell = document.createElement("span");
        const value = i - offset + 1;
        if (value > 0 && value <= count) {
          cell.textContent = String(value);
          cell.className = value === day ? "grid h-8 w-8 place-items-center rounded-full bg-green-800 text-white" : "grid h-8 w-8 place-items-center text-slate-800";
          if (value === day) cell.setAttribute("aria-current", "date");
        }
        return cell;
      }));
    }
    if (valid) {
      tx(countdown?.querySelector("h3"), c.countdown);
      const tick = () => {
        const left = Math.max(0, target - Date.now());
        const nums = [Math.floor(left / 86400000), Math.floor(left % 86400000 / 3600000), Math.floor(left % 3600000 / 60000), Math.floor(left % 60000 / 1000)];
        const rows = [...(countdown?.querySelectorAll(".grid > div") || [])];
        [c.days, c.hours, c.minutes, c.seconds].forEach((label, i) => { tx(rows[i]?.querySelector("div:first-child"), String(nums[i]).padStart(2, "0")); tx(rows[i]?.querySelector("div:nth-child(2)"), label); });
      };
      clearInterval(timer); tick(); timer = setInterval(tick, 1000);
    } else { clearInterval(timer); timer = undefined; }
  }

  function renderVenue(venue, c) {
    const node = section(6), paragraphs = node?.querySelectorAll("p") || [];
    tx(paragraphs[0], venue.name); tx(paragraphs[1], venue.address);
    const link = node?.querySelector("a");
    const query = [venue.name, venue.address].filter(Boolean).join(" ");
    const url = venue.mapUrl || (venue.lat != null && venue.lng != null ? `https://maps.google.com/?q=${venue.lat},${venue.lng}` : query ? `https://maps.google.com/?q=${encodeURIComponent(query)}` : "");
    if (link) { link.href = url || "#"; tx(link, c.map); hide(link, !url); }
    const frame = node?.querySelector("iframe");
    if (frame && venue.lat != null && venue.lng != null) { frame.src = `https://maps.google.com/maps?q=${venue.lat},${venue.lng}&z=15&output=embed`; hide(frame, false); }
    else if (frame) { frame.removeAttribute("src"); hide(frame, true); }
    hide(node, !venue.name && !venue.address && !url);
  }

  function renderGift(gift, c) {
    const node = section(7), paragraphs = node?.querySelectorAll("p") || [];
    hide(node, !gift.enabled);
    tx(paragraphs[0], c.giftHeading); tx(paragraphs[1], c.gift);
    const number = node?.querySelector("p.whitespace-nowrap");
    const holder = node?.querySelector("p.truncate");
    tx(number, gift.cardNumber); tx(holder, gift.cardHolder);
    tx(paragraphs[3], c.cardHolder);
    const button = node?.querySelector("button");
    if (button) {
      hide(button, !gift.cardNumber);
      button.type = "button"; setButtonText(button, c.copy);
      button.setAttribute("aria-label", c.copy);
      let status = node.querySelector("[data-gw-copy-status]");
      if (!status) { status = document.createElement("p"); status.dataset.gwCopyStatus = ""; status.className = "gw-copy-status"; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite"); button.after(status); }
      button.onclick = async () => {
        try { await navigator.clipboard.writeText(String(gift.cardNumber || "")); tx(status, c.copied); }
        catch { tx(status, c.copyError); }
      };
    }
  }

  function renderGallery(gallery, p, c) {
    const node = section(8), grid = node?.querySelector(".grid.grid-cols-2");
    if (!node || !grid) return;
    const photos = gallery.filter((photo) => photo?.src);
    grid.replaceChildren();
    photos.forEach((item, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `block cursor-zoom-in overflow-hidden rounded-t-full bg-white p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.25)] ${i % 2 ? "mt-10" : ""}`;
      button.setAttribute("aria-label", `${c.gallery} ${i + 1}`);
      button.style.opacity = "0";
      button.style.transform = "translateY(30px)";
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = "";
      image.loading = "lazy";
      image.className = "aspect-[3/4] w-full rounded-t-full object-cover";
      button.append(image);
      button.onclick = () => showLightbox(photos, i, c, button);
      grid.append(button);
      if (motionPrepared) observeDynamicSourceReveal(button, { duration: 700, delay: (i % 2) * 120, easing: "ease-out" });
    });
    hide(node, !photos.length);
  }

  function showLightbox(items, start, c, opener) {
    if (!items.length) return;
    const dialog = document.createElement("dialog");
    dialog.className = "yarl__portal gw-source-lightbox";
    dialog.setAttribute("aria-label", c.gallery);
    dialog.setAttribute("aria-modal", "true");
    const fadeDuration = motionReduced ? 0 : 250;
    dialog.style.setProperty("--yarl__fade_animation_duration", `${fadeDuration}ms`);
    let closing = false;
    const closeLightbox = () => {
      if (closing) return;
      closing = true;
      dialog.classList.remove("yarl__portal_open");
      window.setTimeout(() => { if (dialog.open) dialog.close(); }, fadeDuration);
    };
    const container = document.createElement("div");
    container.className = "yarl__container";
    container.tabIndex = -1;
    const toolbar = document.createElement("div");
    toolbar.className = "yarl__toolbar";
    const counter = document.createElement("div");
    counter.className = "yarl__counter";
    counter.setAttribute("aria-live", "polite");
    const slide = document.createElement("div");
    slide.className = "yarl__slide yarl__flex_center";
    let image = document.createElement("img");
    image.className = "yarl__slide_image";
    image.alt = "";
    image.draggable = false;
    slide.append(image);
    const makeButton = (label, icon, className = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `yarl__button ${className}`.trim();
      button.setAttribute("aria-label", label);
      button.title = label;
      button.innerHTML = `<svg class="yarl__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>`;
      return button;
    };
    const close = makeButton(c.close, '<path d="m18 6-12 12M6 6l12 12"/>');
    const zoom = makeButton(c.zoomIn, '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/>');
    const fullscreen = makeButton(c.fullscreen, '<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/>');
    const previous = makeButton(c.previous, '<path d="m15 18-6-6 6-6"/>', "yarl__navigation_prev");
    const next = makeButton(c.next, '<path d="m9 18 6-6-6-6"/>', "yarl__navigation_next");
    toolbar.append(zoom, fullscreen, close);
    const thumbnailBar = document.createElement("div");
    thumbnailBar.className = "yarl__thumbnails yarl__thumbnails_bottom";
    thumbnailBar.style.cssText = "height:74px;--yarl__thumbnails_container_padding:8px;--yarl__thumbnails_thumbnail_width:84px;--yarl__thumbnails_thumbnail_height:56px;--yarl__thumbnails_thumbnail_border:1px;--yarl__thumbnails_thumbnail_border_radius:8px;--yarl__thumbnails_thumbnail_padding:0px;--yarl__thumbnails_thumbnail_gap:8px";
    const thumbnailContainer = document.createElement("div");
    thumbnailContainer.className = "yarl__thumbnails_container yarl__thumbnails_bottom";
    const thumbnailWrapper = document.createElement("div");
    thumbnailWrapper.className = "yarl__thumbnails_wrapper";
    thumbnailWrapper.style.overflow = "hidden";
    const thumbnailTrack = document.createElement("div");
    thumbnailTrack.className = "yarl__thumbnails_track";
    thumbnailTrack.tabIndex = 0;
    thumbnailTrack.setAttribute("role", "listbox");
    thumbnailTrack.style.transition = "transform 250ms ease";
    const thumbnails = items.map((item, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "yarl__thumbnails_thumbnail";
      button.setAttribute("role", "option");
      button.setAttribute("aria-label", `${c.photo} ${i + 1}`);
      button.style.backgroundImage = `url("${String(item.src).replaceAll('"', "%22")}")`;
      button.style.backgroundPosition = "center";
      button.style.backgroundSize = "cover";
      button.onclick = () => show(i, i === index ? 0 : i > index ? -1 : 1);
      thumbnailTrack.append(button);
      return button;
    });
    thumbnailWrapper.append(thumbnailTrack);
    thumbnailContainer.append(thumbnailWrapper);
    thumbnailBar.append(thumbnailContainer);
    let index = start, zoomed = false, pointerX = null, transitioning = false;
    const show = (nextIndex, direction = 0) => {
      if (transitioning) return;
      const previousImage = image;
      index = (nextIndex + items.length) % items.length;
      const slideItem = items[index];
      const useSlideTransition = Boolean(direction) && !motionReduced && items.length > 1;
      if (useSlideTransition) {
        const incoming = previousImage.cloneNode(false);
        incoming.src = slideItem.src;
        incoming.alt = slideItem.alt || slideItem.caption || "";
        incoming.style.transform = "translate(-50%, -50%) scale(1)";
        const width = slide.clientWidth || document.documentElement.clientWidth;
        incoming.style.translate = `${-direction * width}px 0`;
        previousImage.style.transform = "translate(-50%, -50%) scale(1)";
        slide.append(incoming);
        transitioning = true;
        const incomingMotion = incoming.animate(
          [{ translate: `${-direction * width}px 0` }, { translate: "0px 0px" }],
          { duration: 250, easing: "ease-out" },
        );
        const outgoingMotion = previousImage.animate(
          [{ translate: "0px 0px" }, { translate: `${direction * width}px 0px` }],
          { duration: 250, easing: "ease-out" },
        );
        Promise.all([incomingMotion.finished, outgoingMotion.finished]).then(() => {
          incoming.style.translate = "0px 0px";
          incomingMotion.cancel();
          outgoingMotion.cancel();
          previousImage.remove();
          image = incoming;
          transitioning = false;
        }).catch(() => { transitioning = false; });
      } else {
        image.src = slideItem.src;
        image.alt = slideItem.alt || slideItem.caption || "";
        image.style.transform = "translate(-50%, -50%) scale(1)";
        image.style.translate = "0px 0px";
      }
      zoomed = false;
      counter.textContent = `${index + 1} / ${items.length}`;
      thumbnails.forEach((button, i) => {
        button.classList.toggle("yarl__thumbnails_thumbnail_active", i === index);
        button.setAttribute("aria-selected", String(i === index));
      });
      const activeThumbnail = thumbnails[index];
      if (activeThumbnail && thumbnailWrapper.clientWidth) {
        const sidePadding = Math.max(0, (thumbnailWrapper.clientWidth - activeThumbnail.offsetWidth) / 2);
        thumbnailTrack.style.paddingInline = `${sidePadding}px`;
        const viewport = thumbnailWrapper.getBoundingClientRect();
        const thumb = activeThumbnail.getBoundingClientRect();
        const transform = getComputedStyle(thumbnailTrack).transform;
        const currentX = transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
        const centerDelta = thumb.left + thumb.width / 2 - (viewport.left + viewport.width / 2);
        thumbnailTrack.style.transform = `translateX(${currentX - centerDelta}px)`;
      }
    };
    previous.onclick = () => show(index - 1, 1);
    next.onclick = () => show(index + 1, -1);
    close.onclick = closeLightbox;
    zoom.onclick = () => {
      zoomed = !zoomed;
      image.style.transform = `translate(-50%, -50%) scale(${zoomed ? 2 : 1})`;
      zoom.setAttribute("aria-label", zoomed ? c.zoomOut : c.zoomIn);
      zoom.title = zoomed ? c.zoomOut : c.zoomIn;
    };
    fullscreen.onclick = async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await dialog.requestFullscreen();
      } catch { /* Fullscreen can be unavailable in an embedded preview. */ }
    };
    slide.addEventListener("dblclick", (event) => {
      if (event.target.closest(".yarl__slide_image")) zoom.onclick();
    });
    slide.addEventListener("pointerdown", (event) => {
      if (!event.target.closest(".yarl__slide_image")) return;
      pointerX = event.clientX;
      try { slide.setPointerCapture(event.pointerId); } catch { /* Pointer capture may be unavailable. */ }
    });
    slide.addEventListener("pointerup", (event) => {
      if (pointerX == null) return;
      const delta = event.clientX - pointerX;
      pointerX = null;
      if (Math.abs(delta) < 40) return;
      if (delta > 0) previous.click(); else next.click();
    });
    slide.addEventListener("pointercancel", () => { pointerX = null; });
    container.addEventListener("wheel", (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoomed = event.deltaY < 0;
      image.style.transform = `translate(-50%, -50%) scale(${zoomed ? 2 : 1})`;
    }, { passive: false });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); previous.click(); }
      else if (event.key === "ArrowRight") { event.preventDefault(); next.click(); }
      else if (event.key === "Home") { event.preventDefault(); show(0); }
      else if (event.key === "End") { event.preventDefault(); show(items.length - 1); }
    });
    dialog.addEventListener("click", (event) => { if (event.target === dialog || event.target === container) closeLightbox(); });
    dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeLightbox(); });
    dialog.addEventListener("close", () => {
      if (document.fullscreenElement === dialog) document.exitFullscreen().catch(() => {});
      dialog.remove();
      opener?.focus();
    }, { once: true });
    container.append(counter, toolbar, previous, slide, next, thumbnailBar);
    dialog.append(container);
    root.append(dialog);
    dialog.showModal();
    requestAnimationFrame(() => {
      dialog.classList.add("yarl__portal_open");
      show(start);
      });
    container.focus();
  }

  function renderDressCode(dress, c) {
    const node = section(9), headings = node?.querySelector("h3"), paragraphs = node?.querySelectorAll("p") || [];
    hide(node, !dress.enabled);
    tx(headings, c.dressCode); tx(paragraphs[0], c.dressIntro);
    tx(paragraphs[1], [dress.style, dress.text, dress.note].filter(Boolean).join(" · "));
    const colors = dress.colors || [];
    const swatches = [...(node?.querySelectorAll("span.rounded-full.border-2") || [])];
    swatches.forEach((swatch, i) => { const color = colors[i]; hide(swatch, !color); if (color) { swatch.style.backgroundColor = color.hex; swatch.setAttribute("aria-label", color.name || color.hex); swatch.title = color.name || color.hex; } });
  }

  async function renderWishes(wishes, p, c) {
    const node = section(10), list = node?.querySelector("ul");
    tx(node?.querySelector("h2"), c.wishes); tx(node?.querySelector(":scope > div p"), c.wishIntro);
    if (!list) return;
    list.replaceChildren();
    const values = p.preview ? wishes : await fetch(`/api/public/invitations/${encodeURIComponent(p.invitationId || "")}/wishes`, { cache: "no-store" }).then((r) => r.ok ? r.json() : { wishes: [] }).then((r) => r.wishes || []).catch(() => []);
    values.forEach((wish, i) => {
      const item = document.createElement("li"); item.className = "max-w-[88%] rounded-3xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"; item.classList.add(i % 2 ? "ml-auto" : "rounded-bl-md", ...(i % 2 ? ["rounded-br-md"] : []));
      item.style.opacity = "0"; item.style.transform = "translateY(18px) scale(0.9)";
      const name = document.createElement("p"), message = document.createElement("p"); name.className = "font-serif text-sm italic text-green-100 [overflow-wrap:anywhere]"; message.className = "mt-1 text-xs leading-relaxed text-white/85 [overflow-wrap:anywhere]"; name.textContent = wish.name || ""; message.textContent = wish.text || wish.message || ""; item.append(name, message); list.append(item);
      if (motionPrepared) observeDynamicSourceReveal(item, { duration: 600, easing: "ease-out" });
    });
    hide(node, !p.preview && !p.data?.wishesEnabled);
  }

  function renderContacts(contacts, c) {
    const node = section(12), links = [...(node?.querySelectorAll("a") || [])];
    tx(node?.querySelector("h3"), c.contact);
    links.forEach((link, index) => {
      const spans = [...link.querySelectorAll("span")];
      const typeLabel = spans.find((span) => span.classList.contains("uppercase") && span.className.includes("tracking"));
      const valueLabel = link.querySelector("span.truncate");
      const item = index === 0 ? contacts.find((contact) => contact.type === "telegram") : index === 1 ? contacts.find((contact) => contact.type === "phone") : undefined;
      hide(link, !item);
      if (item) { link.href = item.href || "#"; tx(typeLabel, item.label); tx(valueLabel, item.value); }
    });
    hide(node, !contacts.length);
  }

  function renderFooter(d, c) {
    const node = section(13), paragraphs = node?.querySelectorAll("p") || [];
    tx(paragraphs[0], d.greeting || c.welcome);
    tx(paragraphs[1], [d.groom, d.bride].filter(Boolean).join(" & "));
    tx(paragraphs[2], d.date?.short || d.date?.long);
    tx(paragraphs[3], c.hosts); tx(paragraphs[4], d.hosts);
    const link = node?.querySelector("a"); if (link) { link.href = "/"; tx(link, c.footer); }
  }

  function installLocales(p, c) {
    let nav = $("[data-gw-languages]");
    if (!nav) { nav = document.createElement("nav"); nav.dataset.gwLanguages = ""; nav.className = "gw-language-picker"; root.append(nav); }
    nav.setAttribute("aria-label", c.language); nav.replaceChildren();
    for (const locale of p.enabledLocales || ["uz-Latn", "uz-Cyrl", "en", "ru"]) {
      const button = document.createElement("button"); button.type = "button"; button.textContent = ({ "uz-Latn": "Uz", "uz-Cyrl": "Ўз", en: "En", ru: "Ru" })[locale] || locale; button.setAttribute("aria-pressed", String(locale === p.locale));
      button.onclick = () => parent.postMessage({ type: `${id}:language`, locale }, location.origin); nav.append(button);
    }
  }

  function wireForm(node, kind, c) {
    const form = node?.querySelector("form"); if (!form) return;
    const input = form.querySelector("input"), area = form.querySelector("textarea"), submit = form.querySelector('button[type="submit"]');
    if (input) { input.disabled = false; input.required = !payload.preview; if (!input.dataset.gwInitialized) { input.value = payload.guestName || ""; input.dataset.gwInitialized = "true"; } input.placeholder = kind === "rsvp" ? c.guestFull : c.guest; input.setAttribute("aria-label", input.placeholder); input.setAttribute("aria-invalid", "false"); input.oninput = () => input.setAttribute("aria-invalid", "false"); }
    if (area) { area.disabled = false; area.required = !payload.preview; area.maxLength = 2000; area.placeholder = c.wish; area.setAttribute("aria-label", c.wish); area.setAttribute("aria-invalid", "false"); area.oninput = () => area.setAttribute("aria-invalid", "false"); }
    const choices = [...form.querySelectorAll("button")].filter((button) => button !== submit);
    choices.forEach((button, i) => { button.type = "button"; button.setAttribute("role", "radio"); button.setAttribute("aria-checked", "false"); button.setAttribute("aria-label", i ? c.no : c.yes); button.tabIndex = i ? -1 : 0; tx(button.querySelector("span"), i ? c.no : c.yes); button.onclick = () => select(i); button.onkeydown = (event) => { if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return; event.preventDefault(); const current = choices.findIndex((item) => item.getAttribute("aria-checked") === "true"); const next = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : (current + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + choices.length) % choices.length; select(next, true); }; });
    function select(index, focus = false) { choices.forEach((button, i) => { const checked = index === i; button.setAttribute("aria-checked", String(checked)); button.tabIndex = checked || (index < 0 && i === 0) ? 0 : -1; }); if (focus) choices[index]?.focus(); }
    if (submit) { submit.disabled = false; setButtonText(submit, c.send); }
    let status = form.querySelector("[data-gw-status]"); if (!status) { status = document.createElement("p"); status.dataset.gwStatus = ""; form.append(status); }
    status.id = status.id || `gw-${kind}-status`; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite"); input?.setAttribute("aria-describedby", status.id); area?.setAttribute("aria-describedby", status.id);
    const announce = (message, alert = false) => { status.setAttribute("role", alert ? "alert" : "status"); status.setAttribute("aria-live", alert ? "assertive" : "polite"); tx(status, message); };
    form.onsubmit = async (event) => {
      event.preventDefault(); if (payload.preview) { announce(c.preview); return; }
      const name = String(input?.value || payload.guestName || "").trim();
      if (!name) { input?.setAttribute("aria-invalid", "true"); announce(c.guestRequired, true); input?.focus(); return; }
      let body;
      if (kind === "wishes") { const message = String(area?.value || "").trim(); if (!message) { area?.setAttribute("aria-invalid", "true"); announce(c.wishRequired, true); area?.focus(); return; } body = { name, message, guestToken: payload.guestToken || undefined }; }
      else { const choice = choices.findIndex((button) => button.getAttribute("aria-checked") === "true"); if (choice < 0) { announce(c.chooseResponse, true); choices[0]?.focus(); return; } body = { name, status: choice ? "no" : "yes", partySize: choice ? 0 : 1, guestToken: payload.guestToken || undefined }; }
      if (submit) submit.disabled = true;
      try { const response = await fetch(`/api/public/invitations/${encodeURIComponent(payload.invitationId || "")}/${kind}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!response.ok) throw Error(); announce(kind === "wishes" ? c.submitted : c.saved); form.reset(); if (input) input.setAttribute("aria-invalid", "false"); if (area) area.setAttribute("aria-invalid", "false"); select(-1); }
      catch { announce(c.error, true); }
      finally { if (submit) submit.disabled = false; }
    };
  }

  function installMusic(d, p, c) {
    let audio = $("[data-gw-audio]");
    if (!audio) { audio = document.createElement("audio"); audio.dataset.gwAudio = ""; audio.loop = true; audio.preload = "none"; root.append(audio); }
    const button = root.querySelector('[aria-label="Toggle music"]') || $(".gw-music-toggle");
    const url = d.music?.url || ""; audio.src = url; audio.muted = Boolean(p.preview && p.silentPlayback); hide(button, !url || Boolean(p.preview && p.silentPlayback));
    const setIcon = (playing) => {
      if (!button) return;
      button.setAttribute("aria-label", playing ? c.pauseMusic : c.playMusic);
      button.innerHTML = playing
        ? '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>'
        : '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
    };
    if (button) { setIcon(!audio.paused); button.onclick = async () => { if (audio.paused) { try { await audio.play(); setIcon(true); } catch { button.setAttribute("aria-label", c.musicUnavailable); } } else { audio.pause(); setIcon(false); } }; }
  }

  addEventListener("message", (event) => { if (event.source === parent && event.origin === location.origin && event.data?.type === `${id}:update`) render(event.data.payload); });
  try { const initial = JSON.parse(window.name); if (initial?.type === `${id}:update`) render(initial.payload); } catch {}
})();
