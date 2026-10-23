(() => {
  "use strict";

  const templateId = "cloud-castle";
  const copy = {
    "uz-Latn": {
      openInvitation: "Taklifnomani ochish",
      languageLabel: "Tilni tanlang",
      musicToggleLabel: "Musiqani yoqish yoki o?chirish",
      openingGreeting: "Assalomu alaykum, aziz mehmon",
      invitationTitle: "Taklifnoma",
      storyTitle: "Bizning hikoyamiz",
      eventDetailsTitle: "To‘y tantanasi haqida",
      countdownTitle: "Sanoq boshlandi",
      venueTitle: "To‘y manzili",
      programTitle: "To‘y kuni dasturi",
      wishesTitle: "Tilaklar",
      rsvpTitle: "Kelasizmi?",
      rsvpPrompt: "Iltimos, javobingizni bildiring.",
      giftTitle: "Sovg‘a yuborish",
      contactsTitle: "Bog‘lanish uchun",
      footerNote: "Tashrifingiz biz uchun katta baxt.",
      hostsLabel: "Hurmat bilan:",
      giftOpenHint: "Ochish uchun bosing",
      rsvpYes: "Kelaman",
      rsvpNo: "Kela olmayman",
      submit: "Yuborish",
      sendWish: "Tilak yuborish",
      dayUnit: "Kun",
      hourUnit: "Soat",
      minuteUnit: "Daqiqa",
      secondUnit: "Soniya",
      coupleLabel: "Kuyov va kelin",
      responseLabel: "Javobingiz",
      calendarAction: "Kalendariga qo‘shish",
      invitationMessage: "Sizni tantanamizga taklif etamiz:",
      name: "Ismingiz",
      wish: "Kelin-kuyovga tilagingiz",
      galleryMore: "Yana {count} ta suratni ochish",
      party: "Mehmonlar soni",
      phone: "Telefon",
      telegram: "Telegram",
      map: "Xaritada ko‘rish",
      giftNumber: "Karta raqami",
      giftHolder: "Karta egasi",
      wishSent: "Tilagingiz taklifnoma egasiga yuborildi.",
      rsvpSent: "Javobingiz saqlandi. Rahmat!",
      previewOnly: "Ko‘rish rejimida yuborish o‘chiq.",
      failure: "Yubarrishda xatolik. Qayta urinib ko‘ring.",
      noProgram: "",
      weekdays: ["Du", "Se", "Cho", "Pay", "Ju", "Sha", "Ya"],
      months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    },
    "uz-Cyrl": {
      openInvitation: "???????????? ????",
      languageLabel: "????? ???????",
      musicToggleLabel: "???????? ???? ??? ??????",
      openingGreeting: "Ассалому алайкум, азиз меҳмон",
      invitationTitle: "Таклифнома",
      storyTitle: "Бизнинг ҳикоямиз",
      eventDetailsTitle: "Тўй тантанаси ҳақида",
      countdownTitle: "Тўйга қолган вақт",
      venueTitle: "Тўй манзили",
      programTitle: "Тўй куни дастури",
      wishesTitle: "Тилаклар",
      rsvpTitle: "Келасизми?",
      rsvpPrompt: "Илтимос, жавобингизни билдиринг.",
      giftTitle: "Совға юбориш",
      contactsTitle: "Боғланиш учун",
      footerNote: "Ташрифингиз биз учун катта бахт.",
      hostsLabel: "Ҳурмат билан:",
      giftOpenHint: "Очилиши учун босинг",
      rsvpYes: "Келаман",
      rsvpNo: "Кела олмайман",
      submit: "Юбориш",
      sendWish: "Тилак юбориш",
      dayUnit: "Кун",
      hourUnit: "Соат",
      minuteUnit: "Дақиқа",
      secondUnit: "Сония",
      coupleLabel: "Куёв ва келин",
      responseLabel: "Жавобингиз",
      calendarAction: "Тақвимга қўшиш",
      invitationMessage: "Сизни тантанамизга таклиф этамиз:",
      name: "Исмингиз",
      wish: "Келин-куёвга тилагингиз",
      galleryMore: "Яна {count} та суратни очиш",
      party: "Меҳмонлар сони",
      phone: "Телефон",
      telegram: "Телеграм",
      map: "Харитада кўриш",
      giftNumber: "Карта рақами",
      giftHolder: "Карта эгаси",
      wishSent: "Тилагингиз таклифнома эгасига юборилди.",
      rsvpSent: "Жавобингиз сақланди. Раҳмат!",
      previewOnly: "Кўриш режимида юбориш ўчиқ.",
      failure: "Юборишда хатолик. Қайта уриниб кўринг.",
      noProgram: "",
      weekdays: ["Ду", "Се", "Чо", "Пай", "Жу", "Ша", "Як"],
      months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    },
    en: {
      openInvitation: "Open invitation",
      languageLabel: "Choose language",
      musicToggleLabel: "Toggle music",
      openingGreeting: "Welcome, dear guest",
      invitationTitle: "Invitation",
      storyTitle: "Our story",
      eventDetailsTitle: "About the celebration",
      countdownTitle: "Counting down",
      venueTitle: "Venue",
      programTitle: "Event program",
      wishesTitle: "Wishes",
      rsvpTitle: "Will you attend?",
      rsvpPrompt: "Please let us know if you can join us.",
      giftTitle: "Send a gift",
      contactsTitle: "Contact us",
      footerNote: "Your presence would mean so much to us.",
      hostsLabel: "With love from:",
      giftOpenHint: "Tap to open",
      rsvpYes: "I’ll attend",
      rsvpNo: "I can’t attend",
      submit: "Submit",
      sendWish: "Send a wish",
      dayUnit: "Days",
      hourUnit: "Hours",
      minuteUnit: "Minutes",
      secondUnit: "Seconds",
      coupleLabel: "The couple",
      responseLabel: "Your response",
      calendarAction: "Add to calendar",
      invitationMessage: "You are warmly invited to celebrate with us:",
      name: "Your name",
      wish: "Your message to the couple",
      galleryMore: "Open {count} more photos",
      party: "Guest count",
      phone: "Phone",
      telegram: "Telegram",
      map: "Open map",
      giftNumber: "Card number",
      giftHolder: "Cardholder",
      wishSent: "Your wish was sent to the invitation owner.",
      rsvpSent: "Your response was saved. Thank you!",
      previewOnly: "Submissions are disabled in preview.",
      failure: "Could not submit. Please try again.",
      noProgram: "",
      weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
    ru: {
      openInvitation: "??????? ???????????",
      languageLabel: "??????? ????",
      musicToggleLabel: "???????? ??? ????????? ??????",
      openingGreeting: "Здравствуйте, дорогой гость",
      invitationTitle: "Приглашение",
      storyTitle: "Наша история",
      eventDetailsTitle: "О торжестве",
      countdownTitle: "До торжества осталось",
      venueTitle: "Место проведения",
      programTitle: "Программа дня",
      wishesTitle: "Пожелания",
      rsvpTitle: "Вы придёте?",
      rsvpPrompt: "Пожалуйста, сообщите, сможете ли вы прийти.",
      giftTitle: "Отправить подарок",
      contactsTitle: "Связаться с нами",
      footerNote: "Ваше присутствие будет для нас большой радостью.",
      hostsLabel: "С уважением:",
      giftOpenHint: "Нажмите, чтобы открыть",
      rsvpYes: "Я приду",
      rsvpNo: "Не смогу прийти",
      submit: "Отправить",
      sendWish: "Отправить пожелание",
      dayUnit: "Дней",
      hourUnit: "Часов",
      minuteUnit: "Минут",
      secondUnit: "Секунд",
      coupleLabel: "Жених и невеста",
      responseLabel: "Ваш ответ",
      calendarAction: "Добавить в календарь",
      invitationMessage: "Приглашаем вас разделить с нами этот счастливый день:",
      name: "Ваше имя",
      wish: "Ваше пожелание паре",
      galleryMore: "Открыть ещё фото: {count}",
      party: "Количество гостей",
      phone: "Телефон",
      telegram: "Телеграм",
      map: "Открыть карту",
      giftNumber: "Номер карты",
      giftHolder: "Владелец карты",
      wishSent: "Ваше пожелание отправлено владельцу приглашения.",
      rsvpSent: "Ваш ответ сохранён. Спасибо!",
      previewOnly: "Отправка в режиме просмотра отключена.",
      failure: "Не удалось отправить. Попробуйте ещё раз.",
      noProgram: "",
      weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    },
  };
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  const root = document.querySelector('[data-chorlove-template="cloud-castle"]');
  if (!root) return;

  let state = null;
  let countdownTimer = 0;
  const text = (node, value) => { if (node) node.textContent = value == null ? "" : String(value); };
  const hide = (node, hidden) => { if (node) node.hidden = Boolean(hidden); };
  let sourceOpeningBound = false;
  let sourceHeroBound = false;
  let sourceGiftMotionBound = false;
  let sourcePageOpened = false;
  let sourceRevealBound = false;

  function sourceReducedMotion() {
    return Boolean(state?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("qaReducedMotion") === "1";
  }

  function bindSourceOpening() {
    if (sourceOpeningBound) return;
    const opening = document.querySelector('[data-landing-screenshot-id="invite-envelope"]');
    if (!opening) return;
    sourceOpeningBound = true;
    const page = root.querySelector("main");
    if (page) page.style.visibility = "hidden";
    const card = opening.querySelector(".z-10.relative");
    const heart = opening.querySelector('[class*="left-1/2"][class*="top-0"]');
    const floralEdges = [...opening.querySelectorAll('img[src*="/assets/hoa.webp"]')];
    const button = opening.querySelector("[data-chorlove-open]");
    const sheen = button?.querySelector(".absolute.top-0.h-full.w-8");
    const particleLayer = opening.querySelector(".absolute.inset-0.pointer-events-none.overflow-hidden");
    let opened = false;
    const particles = [];
    const fraction = (value) => value - Math.floor(value);
    for (let index = 0; index < 32; index += 1) {
      const random = (seed) => fraction(43758.5453 * Math.sin(12.9898 * (17 * index + seed)));
      const angle = index / 32 * 2 * Math.PI + (random(1) - 0.5) * 0.4;
      const radius = 250 + 350 * random(2);
      const item = {
        left: `${index / 32 * 100 + (6 * random(3) - 3)}%`,
        initialY: 120 * random(4) - 20,
        size: Math.floor(14 + 18 * random(5)),
        duration: 7 + 7 * random(6),
        delay: 5 * random(7),
        sway: 60 * random(8) - 30,
        burstX: Math.cos(angle) * radius,
        burstY: Math.sin(angle) * radius,
        opacity: 0.35 + 0.45 * random(9),
      };
      const outer = document.createElement("span");
      const inner = document.createElement("span");
      outer.className = "cc-source-petal";
      outer.style.left = item.left;
      outer.style.top = `${item.initialY}vh`;
      outer.style.fontSize = `${item.size}px`;
      outer.setAttribute("aria-hidden", "true");
      inner.className = "cc-source-petal-inner";
      inner.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><g><ellipse cx="12" cy="5" rx="2.2" ry="4.5"></ellipse><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(60 12 12)"></ellipse><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(120 12 12)"></ellipse><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(180 12 12)"></ellipse><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(240 12 12)"></ellipse><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(300 12 12)"></ellipse></g><circle cx="12" cy="12" r="1.8" fill-opacity=".45"></circle></svg>';
      outer.append(inner);
      particleLayer?.append(outer);
      particles.push({ ...item, outer, inner });
    }
    const reduced = sourceReducedMotion();
    if (!reduced) {
      for (const particle of particles) {
        const { outer, inner, duration, delay, sway, opacity } = particle;
        outer.animate([{ translate: "0 0" }, { translate: "0 110vh" }], { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: "linear" });
        inner.animate([{ translate: "0 0" }, { translate: `${sway}px 0` }, { translate: "0 0" }], { duration: duration * 500, delay: delay * 1000, iterations: Infinity, easing: "ease-in-out" });
        inner.animate([{ rotate: "0deg" }, { rotate: "360deg" }], { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: "linear" });
        inner.animate([{ opacity }, { opacity: 0.8 * opacity }, { opacity }], { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: "linear" });
      }
      heart?.animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 2000, iterations: Infinity, easing: "ease-in-out" });
      sheen?.animate([{ translate: "-100px 0" }, { translate: "260px 0" }], { duration: 3000, iterations: Infinity, easing: "ease-in-out" });
    }
    const open = (event) => {
      if (opened) return;
      if (event?.target === button || button?.contains(event?.target)) event.stopPropagation();
      opened = true;
      sourcePageOpened = true;
      if (page) page.style.visibility = "";
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      const audio = root.querySelector("audio[data-chorlove-audio]");
      if (audio && state?.data.music?.url && !state.silentPlayback) audio.play().catch(() => {});
      if (reduced) {
        opening.hidden = true;
        bindSourceHeroMotion();
        restoreCapturedMotion();
        return;
      }
      for (const particle of particles) {
        const { outer, inner, burstX, burstY, sway, opacity } = particle;
        outer.getAnimations().forEach((animation) => animation.cancel());
        inner.getAnimations().forEach((animation) => animation.cancel());
        outer.animate([{ translate: "0 0" }, { translate: `${burstX}px ${burstY}px` }], { duration: 850, easing: "ease-out", fill: "forwards" });
        inner.animate([{ scale: 1, offset: 0 }, { scale: 2.2, offset: 0.5 }, { scale: 0, offset: 1 }], { duration: 850, easing: "ease-out", fill: "forwards" });
        inner.animate([{ opacity }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 850, easing: "ease-out", fill: "forwards" });
        inner.animate([{ rotate: "0deg" }, { rotate: `${12 * sway}deg` }], { duration: 850, easing: "ease-out", fill: "forwards" });
      }
      card?.animate([{ transform: "translateY(0) scale(1)", opacity: 1 }, { transform: "translateY(-35px) scale(1.08)", opacity: 0 }], { duration: 800, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
      for (const flower of floralEdges) flower.animate([{ scale: 1, opacity: 0.18 }, { scale: 3.2, opacity: 0 }], { duration: 800, easing: "ease-out", fill: "forwards" });
      opening.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: 450, easing: "ease-in-out", fill: "forwards" });
      window.setTimeout(() => { opening.hidden = true; }, 1050);
      bindSourceHeroMotion();
      restoreCapturedMotion();
    };
    opening.addEventListener("click", open);
    button?.addEventListener("click", open);
  }

  function bindSourceHeroMotion() {
    if (sourceHeroBound) return;
    sourceHeroBound = true;
    const hero = root.querySelector("[data-cloud-castle-hero]");
    if (!hero) return;
    const header = hero.querySelector("header");
    const logo = header?.querySelector('img[src*="asset-2.webp"]');
    const greeting = header?.children[1];
    const names = header?.children[2];
    const page = root.querySelector("main");
    const reveal = (element, duration, delay, initial, targetOpacity = 1, amount = 0.5) => {
      if (!element) return;
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (sourceReducedMotion()) { element.style.opacity = String(targetOpacity); element.style.transform = "none"; continue; }
          if (entry.isIntersecting) element.animate([{ opacity: 0, transform: initial }, { opacity: targetOpacity, transform: "none" }], { duration: duration * 1000, delay: delay * 1000, easing: "ease-out", fill: "both" });
          else element.getAnimations().forEach((animation) => animation.cancel());
        }
      }, { threshold: amount });
      observer.observe(element);
    };
    const reduced = sourceReducedMotion();
    if (reduced) {
      [logo, greeting, names].forEach((element, index) => { if (element) { element.style.opacity = index === 0 ? ".95" : "1"; element.style.transform = "none"; } });
      return;
    }
    reveal(logo, 0.75, 0, "translateY(-24px) scale(.9)", 0.95, 0.5);
    reveal(greeting, 0.75, 0.08, "translateY(24px)", 1, 0.5);
    reveal(names, 0.9, 0.14, "translateY(38px) scale(.92)", 1, 0.35);
    bindSourceGiftMotion();
    const clouds = [...hero.querySelectorAll('img[src*="/assets/cloud-"]')];
    const castle = hero.querySelector('img[src*="/assets/home.webp"]');
    const ornaments = [...(page?.querySelectorAll('img[src*="/assets/hoa.webp"]') || [])];
    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
        if (castle) { castle.style.translate = `0 ${90 * progress}px`; castle.style.scale = String(0.8 + 0.7 * progress); }
        [-90 + 330 * progress, 145 - 405 * progress, -320 + 510 * progress].forEach((x, index) => { if (clouds[index]) clouds[index].style.translate = `${x}px 0`; });
        const viewport = window.innerHeight;
        ornaments.forEach((ornament, index) => {
          const box = ornament.getBoundingClientRect();
          const priorOffset = Number(ornament.dataset.ccParallaxY || 0);
          const p = Math.max(0, Math.min(1, (viewport - (box.top - priorOffset)) / (viewport + Math.max(box.height, 1))));
          const nextOffset = -80 + 260 * p;
          ornament.style.translate = `0 ${nextOffset}px`;
          ornament.dataset.ccParallaxY = String(nextOffset);
        });
      });
    };
    window.addEventListener("scroll", sync, { passive: true, capture: true });
    window.addEventListener("resize", sync);
    sync();
  }

  function bindSourceGiftMotion() {
    if (sourceGiftMotionBound || sourceReducedMotion()) return;
    sourceGiftMotionBound = true;
    const motion = {
      "qasr_green.webp": [6, -22, -18, 3.2, 0],
      "brocade_flower_red.webp": [7, 20, 24, 3.6, 0.3],
      "double_dragon_green.webp": [5, -18, -14, 2.9, 0.6],
      "chibi_red.webp": [6, 14, 18, 3.4, 0.2],
      "boho_floral_green.webp": [5, 8, 12, 3.1, 0.4],
      "silk_flora_brown.webp": [6, -10, -6, 3.5, 0.7],
      "spring_garden_red.webp": [5, -14, -10, 3.3, 0.1],
    };
    for (const image of root.querySelectorAll('img[src*="/assets/gift/"]')) {
      const file = image.getAttribute("src")?.split("/").pop();
      const config = motion[file];
      if (!config) continue;
      const [lift, startAngle, endAngle, duration, delay] = config;
      image.animate([
        { translate: "0 0", rotate: `${startAngle}deg` },
        { translate: `0 ${-lift}px`, rotate: `${endAngle}deg` },
        { translate: "0 0", rotate: `${startAngle}deg` },
      ], { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: "ease-in-out" });
    }
  }

  function sourceRevealProfile(element) {
    const transform = (element.dataset.ccInitialTransform || "").replace(/\s+/g, "").toLowerCase();
    const section = element.closest("[data-chorlove-gallery], [data-chorlove-wishes], [data-chorlove-rsvp], [data-chorlove-gift], [data-landing-screenshot-id]");
    if (/translatey\(18px\)scale\(0\.96\)/.test(transform)) {
      const links = [...(element.parentElement?.querySelectorAll("a") || [])];
      return { duration: 0.55, threshold: 0.3, delay: 0.12 + 0.1 * Math.max(0, links.indexOf(element)), easing: "ease-out" };
    }
    if (/translatey\(20px\)/.test(transform)) return { duration: 0.75, threshold: 0.2, delay: 0, easing: "ease-out" };
    if (/scale\(0\.86\)/.test(transform)) {
      const field = element.matches('[data-chorlove-field^="program"]') ? element : element.querySelector('[data-chorlove-field^="program"]');
      const programIndex = Number(field?.dataset.chorloveField?.match(/^program(\d+)/)?.[1]);
      if (field && Number.isFinite(programIndex)) return { duration: 0.45, threshold: 0.2, delay: 0.09 * Math.max(0, programIndex - 1), easing: "cubic-bezier(.22,1,.36,1)" };
      const galleryItem = element.matches("[data-chorlove-gallery-item]") ? element : element.querySelector("[data-chorlove-gallery-item]");
      if (galleryItem) {
        const items = [...root.querySelectorAll("[data-chorlove-gallery-item]")];
        return { duration: 0.45, threshold: 0.2, delay: [0.06, 0.14, 0.22, 0.3, 0.38][Math.max(0, items.indexOf(galleryItem))] || 0, easing: "cubic-bezier(.22,1,.36,1)" };
      }
      return { duration: 0.45, threshold: 0.2, delay: 0, easing: "cubic-bezier(.22,1,.36,1)" };
    }
    if (/translatey\(24px\)/.test(transform)) return { duration: 0.75, threshold: 0.2, delay: 0, easing: "ease-out" };
    if (/scale\(0\.88\)/.test(transform) && element.closest("[data-chorlove-gift]")) {
      return { duration: 1, threshold: 0.5, delay: 0, easing: "cubic-bezier(.22,1,.36,1)" };
    }
    if (element.closest("[data-cc-contact-group]")) {
      if (element.querySelector('[data-chorlove-i18n="contactsTitle"]')) return { duration: 0.48, threshold: 0.5, delay: 0.08, easing: "cubic-bezier(.22,1,.36,1)" };
      if (element.querySelector('[data-chorlove-i18n="footerNote"]')) return { duration: 0.48, threshold: 0.5, delay: 0.1, easing: "cubic-bezier(.22,1,.36,1)" };
      if (element.classList.contains("py-4")) return { duration: 0.48, threshold: 0.5, delay: 0.12, easing: "cubic-bezier(.22,1,.36,1)" };
      return { duration: 0.48, threshold: 0.5, delay: 0, easing: "cubic-bezier(.22,1,.36,1)" };
    }
    if (element.closest("[data-chorlove-wishes]")) {
      const revealNodes = [...element.closest("[data-chorlove-wishes]").querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]')];
      const index = revealNodes.indexOf(element);
      return { duration: 0.48, threshold: 0.5, delay: index === 0 ? 0 : index === 1 ? 0.08 : 0.14 + Math.max(0, index - 2) * 0.08, easing: "cubic-bezier(.22,1,.36,1)" };
    }
    if (section?.getAttribute("data-landing-screenshot-id") === "invite-map") return { duration: 0.48, threshold: 0.5, delay: 0, easing: "cubic-bezier(.22,1,.36,1)" };
    if ((element.matches('img[src$="/hoa-ngang.webp"]') || element.querySelector('img[src$="/hoa-ngang.webp"]')) && element.classList.contains("py-2")) {
      return { duration: 0.48, threshold: 0.2, delay: 0.18, easing: "cubic-bezier(.22,1,.36,1)" };
    }
    if (element.querySelector("[data-chorlove-gallery-item]")) return { duration: 0.48, threshold: 0.2, delay: 0.18, easing: "cubic-bezier(.22,1,.36,1)" };
    if (element.closest("[data-chorlove-gift]")) return { duration: 1, threshold: 0.5, delay: 0, easing: "cubic-bezier(.22,1,.36,1)" };
    return { duration: 0.48, threshold: 0.5, delay: 0, easing: "cubic-bezier(.22,1,.36,1)" };
  }

  function restoreCapturedMotion() {
    const reduce = sourceReducedMotion();
    document.documentElement.classList.toggle("cc-reduced-motion", reduce);
    if (!sourcePageOpened || sourceRevealBound) return;
    sourceRevealBound = true;
    const hero = root.querySelector("[data-cloud-castle-hero]");
    root.querySelector('img[src$="/chim.webp"]')?.closest(".relative.flex.flex-col.items-center.overflow-hidden")?.setAttribute("data-cc-contact-group", "");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target;
        if (reduce) { element.style.opacity = ""; element.style.transform = ""; continue; }
        const profile = sourceRevealProfile(element);
        if (entry.isIntersecting && entry.intersectionRatio >= profile.threshold) {
          const initialTransform = element.dataset.ccInitialTransform || "translateY(10px)";
          const initialOpacity = Number(element.dataset.ccInitialOpacity || 0);
          element.animate([{ opacity: initialOpacity, transform: initialTransform }, { opacity: 1, transform: "none" }], { duration: profile.duration * 1000, delay: profile.delay * 1000, easing: profile.easing, fill: "both" });
        } else element.getAnimations().forEach((animation) => animation.cancel());
      }
    }, { threshold: [0.2, 0.3, 0.5] });
    root.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]').forEach((element) => {
      if (hero?.contains(element)) return;
      element.dataset.ccInitialTransform = element.style.transform || "translateY(10px)";
      element.dataset.ccInitialOpacity = element.style.opacity || "0";
      observer.observe(element);
    });
  }

  function localCopy() { return copy[state?.locale] || copy["uz-Latn"]; }
  function bindField(data, key, value) {
    for (const node of root.querySelectorAll(`[data-chorlove-field="${key}"]`)) text(node, value);
  }
  function setVisibleFields(data) {
    bindField(data, "groom", data.groom);
    bindField(data, "bride", data.bride);
    bindField(data, "eventLabel", data.eventType);
    bindField(data, "coupleLabel", localCopy().coupleLabel);
    bindField(data, "weekday", data.date?.weekday || "");
    bindField(data, "day", data.date?.day || "");
    bindField(data, "month", data.date?.month || "");
    bindField(data, "year", data.date?.year || "");
    bindField(data, "eventTime", data.date?.time || "");
    bindField(data, "message", data.message);
    bindField(data, "title", data.title || localCopy().invitationTitle);
    bindField(data, "hosts", data.hosts);
    bindField(data, "personalGreeting", data.greeting || data.title);
    bindField(data, "venueName", data.venue?.name);
    bindField(data, "address", data.venue?.address);
    bindField(data, "calendarAction", localCopy().calendarAction);
    const responseLabel = root.querySelector('[data-chorlove-i18n="responseLabel"]');
    if (responseLabel) text(responseLabel, localCopy().responseLabel);
    const programHeading = root.querySelector('[data-chorlove-i18n="programTitle"]');
    if (data.programHeading) text(programHeading, data.programHeading);
    for (const node of root.querySelectorAll('[data-chorlove-i18n]')) {
      const key = node.dataset.chorloveI18n;
      text(node, localCopy()[key] ?? node.textContent);
    }
    const openInvitation = root.querySelector("[data-chorlove-open]");
    if (openInvitation) openInvitation.setAttribute("aria-label", localCopy().openInvitation);
    for (const field of root.querySelectorAll('[data-chorlove-field="calendarMonth"]')) {
      const date = data.date;
      const monthIndex = Number(date?.monthNumber) - 1;
      const month = Number.isInteger(monthIndex) && monthIndex >= 0
        ? localCopy().months[monthIndex]
        : date?.month || "";
      text(field, [month, date?.year].filter(Boolean).join(" "));
    }
    const start = data.dateTime ? new Date(data.dateTime) : null;
    const hasDate = start && Number.isFinite(start.getTime());
    const dateBlock = root.querySelector('[data-chorlove-field="day"]')?.closest(".flex.flex-col.items-center.gap-4");
    hide(dateBlock, !hasDate);
    const dateSection = root.querySelector('[data-chorlove-field="eventTime"]')?.closest("section");
    if (dateSection) dateSection.hidden = !hasDate;
  }

  function renderCalendar(data) {
    const start = data.dateTime ? new Date(data.dateTime) : null;
    if (!start || !Number.isFinite(start.getTime())) return;
    const cells = root.querySelectorAll("[data-chorlove-calendar-cell]");
    if (!cells.length) return;
    const grid = cells[0].parentElement;
    const allCells = [...grid.children];
    const dayTemplate = allCells.find((cell) => cell.querySelector("[data-chorlove-calendar-number]"));
    const blankTemplate = allCells.find((cell) => !cell.querySelector("[data-chorlove-calendar-number]")) || dayTemplate;
    if (!dayTemplate) return;
    const year = Number(data.date.year);
    const monthIndex = Number(data.date.monthNumber) - 1;
    if (!Number.isInteger(year) || monthIndex < 0 || monthIndex > 11) return;
    const offset = (new Date(Date.UTC(year, monthIndex, 1)).getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const count = Math.ceil((offset + days) / 7) * 7;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < count; index += 1) {
      const day = index - offset + 1;
      const cell = (day < 1 || day > days ? blankTemplate : dayTemplate).cloneNode(true);
      cell.removeAttribute("data-chorlove-calendar-cell");
      cell.setAttribute("data-chorlove-calendar-cell", "");
      cell.removeAttribute("data-event-day");
      const number = cell.querySelector("[data-chorlove-calendar-number]");
      if (number) {
        number.textContent = day >= 1 && day <= days ? String(day) : "";
        number.removeAttribute("data-chorlove-calendar-number");
        number.setAttribute("data-chorlove-calendar-number", "");
        if (day === Number(data.date.day)) cell.dataset.eventDay = "true";
      }
      fragment.append(cell);
    }
    grid.replaceChildren(fragment);
    const weekdayGrid = root.querySelector(".grid.grid-cols-7.border-b-2");
    if (weekdayGrid) [...weekdayGrid.children].forEach((node, index) => text(node, localCopy().weekdays[index]));
  }

  function renderProgram(data) {
    const first = root.querySelector('[data-chorlove-field="program1Time"]');
    const grid = root.querySelector("[data-chorlove-program-grid]") || first?.parentElement;
    if (!grid) return;
    grid.dataset.chorloveProgramGrid = "";
    const original = [...grid.children];
    const groups = [];
    for (let i = 0; i < original.length; i += 3) groups.push(original.slice(i, i + 3));
    if (!groups.length) return;
    const rows = data.program || [];
    const fragment = document.createDocumentFragment();
    rows.forEach((item, index) => {
      const group = groups[index % groups.length];
      for (const source of group) {
        const cell = source.cloneNode(true);
        const time = cell.querySelector('[data-chorlove-field$="Time"]');
        const title = cell.querySelector('[data-chorlove-field$="Title"]');
        if (time) text(time, item.time);
        if (title) text(title, item.title);
        fragment.append(cell);
      }
    });
    grid.replaceChildren(fragment);
    const section = grid.closest("section");
    hide(section, rows.length === 0);
  }

  function renderStoryAndGallery(data) {
    const storySection = root.querySelector("[data-chorlove-story]");
    if (!storySection) return;
    storySection.querySelectorAll(".cc-story-copy").forEach((node) => node.remove());
    const chapters = data.story || [];
    if (chapters.length) {
      const copyHost = document.createElement("div");
      copyHost.className = "cc-story-copy";
      for (const chapter of chapters) {
        const card = document.createElement("article");
        const title = document.createElement("h3");
        const body = document.createElement("p");
        title.textContent = chapter.title || "";
        body.textContent = chapter.text || "";
        card.append(title, body);
        copyHost.append(card);
      }
      storySection.append(copyHost);
    }
    const slots = [...storySection.querySelectorAll("[data-chorlove-gallery-item]")];
    const gallery = data.gallery || [];
    const usableGallery = gallery.filter((item) => item?.src);
    slots.forEach((image, index) => {
      const item = usableGallery[index];
      if (item?.src) {
        image.src = item.src;
        image.alt = item.alt || item.caption || "";
        image.classList.remove("cc-gallery-empty");
        image.dataset.galleryLightbox = "";
      } else {
        image.removeAttribute("src");
        image.alt = "";
        image.classList.add("cc-gallery-empty");
        image.removeAttribute("data-gallery-lightbox");
      }
      hide(image.parentElement || image, !item);
    });
    const more = storySection.querySelector("[data-chorlove-gallery-more]");
    if (more) {
      const remaining = Math.max(0, usableGallery.length - slots.length);
      text(more, remaining ? `+${remaining}` : "");
      hide(more, remaining === 0);
      more.tabIndex = remaining ? 0 : -1;
      more.setAttribute("role", remaining ? "button" : "presentation");
      more.setAttribute("aria-label", localCopy().galleryMore.replace("{count}", String(remaining)));
    }
    const showGallery = usableGallery.length > 0;
    hide(storySection, !chapters.length && !showGallery);
  }

  function renderContacts(data) {
    const section = root.querySelector("[data-chorlove-contacts]");
    if (!section) return;
    section.querySelectorAll(".cc-extra-links").forEach((node) => node.remove());
    const contacts = data.contacts || [];
    hide(section, contacts.length === 0);
    if (!contacts.length) return;
    const links = document.createElement("div");
    links.className = "cc-extra-links";
    for (const contact of contacts) {
      const a = document.createElement("a");
      a.href = contact.href;
      a.textContent = `${contact.label}: ${contact.value}`;
      links.append(a);
    }
    section.append(links);
  }

  async function renderWishes(data) {
    const section = root.querySelector("[data-chorlove-wishes]");
    if (!section) return;
    const list = section.querySelector("[data-chorlove-wish-list]") || document.createElement("div");
    list.dataset.chorloveWishList = "";
    if (!list.isConnected) section.append(list);
    const form = section.querySelector("form");
    const magicButton = section.querySelector('button[title*="Generate wish"], button[aria-label*="Generate wish"]');
    if (magicButton) { magicButton.hidden = true; magicButton.tabIndex = -1; }
    if (form) form.dataset.chorloveWishForm = "";
    const status = section.querySelector(".cc-status") || document.createElement("p");
    status.className = "cc-status";
    if (!status.isConnected) section.append(status);
    hide(section, !data.wishesEnabled);
    if (!data.wishesEnabled) return;
    const wishes = state.preview
      ? (data.wishes || []).map((wish) => ({ name: wish.name, message: wish.text }))
      : await fetch(`${state.apiBase}/wishes`, { cache: "no-store" })
          .then((response) => response.ok ? response.json() : { wishes: [] })
          .then((body) => body.wishes || [])
          .catch(() => []);
    list.replaceChildren();
    for (const wish of wishes) {
      const card = document.createElement("article");
      card.className = "rounded-xl border p-4 text-sm shadow-sm";
      const name = document.createElement("strong");
      name.textContent = wish.name;
      const message = document.createElement("p");
      message.textContent = wish.message;
      card.append(name, message);
      list.append(card);
    }
    if (form) {
      const submit = form.querySelector('button[type="submit"]');
      if (submit) text(submit, localCopy().sendWish);
      const name = form.querySelector("input");
      const message = form.querySelector("textarea");
      if (name) { name.value = state.guestName || ""; name.placeholder = `${localCopy().name}*`; name.setAttribute("aria-label", localCopy().name); name.autocomplete = "name"; }
      if (message) message.placeholder = `${localCopy().wish}*`;
      form.onsubmit = async (event) => {
        event.preventDefault();
        if (state.preview) { text(status, localCopy().previewOnly); return; }
        const button = form.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        try {
          const response = await fetch(`${state.apiBase}/wishes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.value, message: message.value, guestToken: state.guestToken || undefined }),
          });
          if (!response.ok) throw new Error("wish submission failed");
          form.reset();
          text(status, localCopy().wishSent);
        } catch { text(status, localCopy().failure); }
        finally { if (button) button.disabled = false; }
      };
    }
  }

  function renderRsvp(data) {
    const section = root.querySelector("[data-chorlove-rsvp]");
    if (!section) return;
    hide(section, !data.rsvp?.enabled);
    if (!data.rsvp?.enabled) return;
    const form = section.querySelector("form");
    const name = form?.querySelector("input");
    const magicButton = section.querySelector('button[title*="Generate wish"], button[aria-label*="Generate wish"]');
    if (magicButton) magicButton.hidden = true;
    const submit = section.querySelector("[data-chorlove-submit-rsvp]");
    const responseGroup = section.querySelector('[role="radiogroup"]');
    if (responseGroup) responseGroup.setAttribute("aria-label", localCopy().responseLabel);
    const status = section.querySelector(".cc-status") || document.createElement("p");
    status.className = "cc-status";
    if (!status.isConnected) section.append(status);
    if (name) { name.value = state.guestName || ""; name.placeholder = `${localCopy().name}*`; name.setAttribute("aria-label", localCopy().name); name.autocomplete = "name"; }
    for (const button of section.querySelectorAll("[data-chorlove-rsvp]")) {
      text(button, button.dataset.chorloveRsvp === "yes" ? localCopy().rsvpYes : localCopy().rsvpNo);
      button.setAttribute("aria-pressed", button.dataset.selected === "true" ? "true" : "false");
      button.onclick = () => {
        section.querySelectorAll("[data-chorlove-rsvp]").forEach((candidate) => {
          candidate.dataset.selected = String(candidate === button);
          candidate.setAttribute("aria-pressed", String(candidate === button));
        });
      };
    }
    let party = form?.querySelector(".cc-party-size");
    if (form && !party) {
      party = document.createElement("label");
      party.className = "cc-party-size";
      party.append(document.createTextNode(localCopy().party));
      const select = document.createElement("select");
      select.name = "partySize";
      for (let n = 1; n <= Math.min(Number(data.rsvp.maxPartySize) || 1, 20); n += 1) {
        const option = document.createElement("option"); option.value = String(n); option.textContent = String(n); select.append(option);
      }
      party.append(select);
      form.append(party);
    }
    if (party) {
      if (party.firstChild?.nodeType === Node.TEXT_NODE) party.firstChild.textContent = localCopy().party;
      const select = party.querySelector("select");
      if (select) select.setAttribute("aria-label", localCopy().party);
    }
    if (submit) text(submit, localCopy().submit);
    if (form) form.onsubmit = async (event) => {
      event.preventDefault();
      if (state.preview) { text(status, localCopy().previewOnly); return; }
      const selected = section.querySelector('[data-chorlove-rsvp][data-selected="true"]');
      if (!selected) { text(status, localCopy().failure); return; }
      if (submit) submit.disabled = true;
      try {
        const response = await fetch(`${state.apiBase}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name?.value || state.guestName || "Guest", status: selected.dataset.chorloveRsvp, partySize: selected.dataset.chorloveRsvp === "yes" ? Number(form.querySelector('[name="partySize"]')?.value || 1) : 0, guestToken: state.guestToken || undefined }),
        });
        if (!response.ok) throw new Error("rsvp submission failed");
        text(status, localCopy().rsvpSent);
      } catch { text(status, localCopy().failure); }
      finally { if (submit) submit.disabled = false; }
    };
  }

  function renderGift(data) {
    const section = root.querySelector("[data-chorlove-gift]");
    if (!section) return;
    hide(section, !data.toyona?.enabled);
    if (!data.toyona?.enabled) return;
    let details = section.querySelector(".cc-gift-details");
    if (!details) {
      details = document.createElement("div");
      details.className = "cc-gift-details";
      const label = document.createElement("p"); label.textContent = localCopy().giftNumber;
      const number = document.createElement("strong"); number.dataset.giftNumber = "";
      const holder = document.createElement("p"); holder.dataset.giftHolder = "";
      const note = document.createElement("p"); note.dataset.giftNote = "";
      details.append(label, number, holder, note);
      section.append(details);
    }
    text(details.querySelector("[data-gift-number]"), data.toyona.cardNumber);
    text(details.querySelector("[data-gift-holder]"), data.toyona.cardHolder ? `${localCopy().giftHolder}: ${data.toyona.cardHolder}` : "");
    text(details.querySelector("[data-gift-note]"), data.toyona.note);
    const hint = section.querySelector('[data-chorlove-i18n="giftOpenHint"]');
    const card = hint?.closest(".cursor-pointer") || hint?.parentElement;
    if (card) {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", localCopy().giftOpenHint);
      card.onclick = () => { details.dataset.open = details.dataset.open !== "true"; };
      card.onkeydown = (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); card.click(); } };
    }
  }

  function renderVenue(data) {
    const section = root.querySelector('[data-chorlove-field="venueName"]')?.closest("section");
    if (!section) return;
    const venue = data.venue || {};
    const present = Boolean(venue.name || venue.address);
    hide(section, !present);
    if (!present) return;
    let map = section.querySelector(".cc-map-link");
    const href = venue.mapUrl || (venue.lat != null && venue.lng != null ? `https://maps.google.com/?q=${venue.lat},${venue.lng}` : "");
    if (href) {
      if (!map) { map = document.createElement("a"); map.className = "cc-map-link inline-flex items-center justify-center mt-4 rounded-full border px-5 py-2 text-sm"; section.append(map); }
      map.href = href; map.target = "_blank"; map.rel = "noreferrer"; text(map, localCopy().map);
    } else if (map) map.remove();
  }

  function renderCalendarLink(data) {
    const link = root.querySelector("[data-chorlove-calendar]");
    const start = data.dateTime ? new Date(data.dateTime) : null;
    if (!link || !start || !Number.isFinite(start.getTime())) return;
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const location = [data.venue?.name, data.venue?.address].filter(Boolean).join(", ");
    const url = new URL("https://calendar.google.com/calendar/render");
    url.search = new URLSearchParams({ action: "TEMPLATE", text: [data.groom, data.bride].filter(Boolean).join(" & "), dates: `${stamp(start)}/${stamp(end)}`, location }).toString();
    link.href = url.toString();
    link.target = "_blank";
    link.rel = "noreferrer";
  }

  function renderCountdown(data) {
    window.clearInterval(countdownTimer);
    const heading = root.querySelector('[data-chorlove-i18n="countdownTitle"]');
    const holder = heading?.parentElement?.parentElement;
    const start = data.dateTime ? new Date(data.dateTime).getTime() : 0;
    const update = () => {
      const remaining = Math.max(0, start - Date.now());
      const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
      const nodes = holder?.querySelectorAll("[data-countdown-value]") || [];
      values.forEach((value, index) => { if (nodes[index]) text(nodes[index], value); });
    };
    const values = holder ? [...holder.querySelectorAll("span")].filter((node) => node.classList.contains("text-xl") && node.classList.contains("font-bold") && /^\d+$/.test(node.textContent.trim())) : [];
    values.slice(0, 4).forEach((node) => node.setAttribute("data-countdown-value", ""));
    if (start) { update(); countdownTimer = window.setInterval(update, 1000); }
  }

  function renderMusic(payload) {
    let audio = root.querySelector("audio[data-chorlove-audio]");
    if (!audio) { audio = document.createElement("audio"); audio.loop = true; audio.preload = "metadata"; audio.dataset.chorloveAudio = ""; root.append(audio); }
    const source = payload.data.music?.url || "";
    if (audio.getAttribute("src") !== source) audio.src = source;
    const toggle = root.querySelector('[aria-label="Toggle music"]') || document.createElement("button");
    toggle.className = "cc-music-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", payload.locale === "en" ? "Toggle music" : payload.locale === "ru" ? "Включить или выключить музыку" : "Musiqani yoqish yoki o‘chirish");
    toggle.textContent = audio.paused ? "♫" : "Ⅱ";
    hide(toggle, !audio.src);
    if (!toggle.isConnected) root.append(toggle);
    toggle.onclick = async () => {
      if (audio.paused) { try { await audio.play(); toggle.textContent = "Ⅱ"; } catch { toggle.setAttribute("aria-label", "Music unavailable"); } }
      else { audio.pause(); toggle.textContent = "♫"; }
    };
    if (payload.silentPlayback) { audio.pause(); audio.muted = true; }
    else audio.muted = false;
    if (!payload.preview) audio.volume = 0.35;
    if (payload.reducedMotion) document.documentElement.classList.add("cc-reduced-motion");
    else document.documentElement.classList.remove("cc-reduced-motion");
  }

  function renderLanguages(payload) {
    let picker = root.querySelector(".cc-language-picker");
    if (!picker) { picker = document.createElement("nav"); picker.className = "cc-language-picker"; root.append(picker); }
    picker.setAttribute("aria-label", localCopy().languageLabel);
    picker.replaceChildren();
    const available = payload.enabledLocales?.length ? payload.enabledLocales : locales;
    for (const locale of available) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = ({ "uz-Latn": "Uz", "uz-Cyrl": "Ўз", en: "En", ru: "Ru" })[locale] || locale;
      button.setAttribute("aria-pressed", String(payload.locale === locale));
      button.onclick = () => parent.postMessage({ type: `${templateId}:language`, locale }, location.origin);
      picker.append(button);
    }
  }

  function ensureGalleryLightbox() {
    let dialog = root.querySelector(".cc-gallery-lightbox");
    if (!dialog) {
      dialog = document.createElement("div"); dialog.className = "cc-gallery-lightbox"; dialog.hidden = true;
      const image = document.createElement("img"); image.alt = "";
      const close = document.createElement("button"); close.type = "button"; close.textContent = "×"; close.setAttribute("aria-label", "Close image");
      close.onclick = () => { dialog.hidden = true; };
      dialog.onclick = (event) => { if (event.target === dialog) dialog.hidden = true; };
      dialog.append(image, close); root.append(dialog);
    }
    root.querySelectorAll("[data-gallery-lightbox]").forEach((image) => { image.onclick = () => { dialog.querySelector("img").src = image.src; dialog.hidden = false; }; });
    root.querySelectorAll("[data-chorlove-gallery-more]").forEach((more) => {
      const openNext = () => {
        const images = (state?.data?.gallery || []).filter((item) => item?.src);
        const visibleSlotCount = root.querySelectorAll("[data-chorlove-gallery-item]").length;
        const nextImage = images[visibleSlotCount];
        if (!nextImage?.src) return;
        dialog.querySelector("img").src = nextImage.src;
        dialog.querySelector("img").alt = nextImage.alt || nextImage.caption || "";
        dialog.hidden = false;
      };
      more.onclick = openNext;
      more.onkeydown = (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openNext(); } };
    });
  }

  function render(payload) {
    if (!payload?.data || payload.templateId !== templateId) return;
    state = { ...payload, apiBase: `/api/public/invitations/${encodeURIComponent(payload.invitationId || "")}` };
    document.documentElement.lang = payload.locale || "uz-Latn";
    setVisibleFields(payload.data);
    renderCalendar(payload.data);
    renderProgram(payload.data);
    renderStoryAndGallery(payload.data);
    renderContacts(payload.data);
    renderRsvp(payload.data);
    renderGift(payload.data);
    renderVenue(payload.data);
    renderCalendarLink(payload.data);
    renderCountdown(payload.data);
    renderMusic(payload);
    renderLanguages(payload);
    ensureGalleryLightbox();
    renderWishes(payload.data);
    restoreCapturedMotion();
  }

  bindSourceOpening();

  const initial = (() => { try { return JSON.parse(window.name); } catch { return null; } })();
  restoreCapturedMotion();
  if (initial?.type === `${templateId}:update`) render(initial.payload);
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.data?.type !== `${templateId}:update`) return;
    render(event.data.payload);
  });
})();
