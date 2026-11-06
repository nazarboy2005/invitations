/* Shared-contract/service bridge. The template engine lives in source/. */
(() => {
  "use strict";
  const ID = "wedivo-angin-empat-musim";
  const $ = (id) => document.getElementById(id);
  const put = (id, value) => {
    if ($(id)) $(id).textContent = value == null ? "" : String(value);
  };
  const show = (id, visible) => {
    if ($(id) && !$(id).hasAttribute("data-unsupported"))
      $(id).hidden = !visible;
  };
  const safeUrl = (value) => {
    if (!value) return "";
    try {
      const url = new URL(value, location.origin);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };
  const copy = {
    "uz-Latn": {
      open: "Taklifnomani ochish",
      hint: "Hikoyamizga kirish uchun shkafcha yoki tugmani bosing.",
      guest: "Aziz mehmon",
      letter: "Siz taklif etilgansiz ♡",
      to: "Siz uchun",
      final: "Yakuniy qism",
      welcome: "Xush kelibsiz",
      couple: "Bosh qahramonlar",
      story: "To‘rt fasl hikoyasi",
      count: "Katta kun sari",
      event: "Tantanamiz",
      venue: "Manzil",
      program: "To‘y dasturi",
      dress: "Liboslar ranglari",
      gallery: "Lahzalar",
      rsvp: "Kelishingiz",
      wishes: "Tilaklar",
      thanks: "Biz bilan bo‘lganingiz uchun rahmat",
      close: "Yopish",
      next: "Keyingi",
      previous: "Oldingi",
      replay: "Qayta ko‘rish",
      skip: "O‘tkazish",
      start: "Boshlash",
      play: "Ijro etish",
      pause: "To‘xtatish",
      name: "Ismingiz",
      note: "Xabar (ixtiyoriy)",
      message: "Tilagingizni yozing",
      yes: "Kelaman",
      no: "Kela olmayman",
      maybe: "Hali aniq emas",
      send: "Yuborish",
      choose: "Javobingizni tanlang",
      sent: "Javobingiz saqlandi. Rahmat!",
      pending: "Tilagingiz yuborildi. Egasi tasdiqlagach ko‘rinadi.",
      fail: "Yuborilmadi. Qayta urinib ko‘ring.",
      preview: "Ko‘rish rejimida yuborish o‘chirilgan.",
      map: "Xaritani ochish",
      address: "Manzilni nusxalash",
      calendar: "Taqvimga qo‘shish",
      download: ".ics yuklab olish",
      copied: "Nusxalandi",
      days: "kun qoldi",
      hours: "Soat",
      minutes: "Daqiqa",
      seconds: "Soniya",
      scene: "Sahna",
      original: "Asl",
      tapPhoto: "Qahramonni almashtirish uchun suratni yoki tugmani bosing.",
      galleryHint:
        "Ko‘rinishni tanlang va suratni kattalashtirish uchun bosing.",
      dressHint: "Libos rangini tanlash uchun bo‘yoqni bosing.",
      credits: "Ishtirokchilar",
      hosts: "Mezbonlar",
      starring: "Bosh rollarda",
      guestCredit: "Aziz mehmon",
      forever: "Abadiy ♡",
      yesterday: "Kecha",
      soundtrack: "Musiqa",
      sound: "Ovoz effektlari",
      scroll: "Pastga",
      transcript: "To‘liq hikoyani o‘qish",
      comments: "Barcha tilaklar",
      commentToggle: "Suzuvchi tilaklar",
      deadline: "Javob muddati",
      occasion: "Tadbir kuni",
      photo: "Surat",
      episode: "Qism",
      date: "Sana",
      time: "Vaqt",
      image: "Tasvir",
      season: "Fasl",
      menu: "Menyu",
      status: "Holat",
      allDay: "Kun davomida",
      listen: "Hikoyani tinglash",
      stopCredits: "Titrlarni to‘xtatish",
      resumeCredits: "Titrlarni davom ettirish",
      guide: "Xaritada yo‘lni ko‘rish",
      narration: "Sizni bayramimizda kutamiz!",
      stamp: "Xotira uchun muhr",
      invitation: "Taklifnoma",
      mainVisual: "Asosiy tasvir",
      allWishes: "Yurakdan",
      route: "Javobingiz",
      select: "Tanlash",
      foreverEnd: "Hikoyamiz davom etadi… ♡",
    },
    "uz-Cyrl": {
      open: "Таклифномани очиш",
      hint: "Ҳикоямизга кириш учун шкафча ёки тугмани босинг.",
      guest: "Азиз меҳмон",
      letter: "Сиз таклиф этилгансиз ♡",
      to: "Сиз учун",
      final: "Якуний қисм",
      welcome: "Хуш келибсиз",
      couple: "Бош қаҳрамонлар",
      story: "Тўрт фасл ҳикояси",
      count: "Катта кун сари",
      event: "Тантанамиз",
      venue: "Манзил",
      program: "Тўй дастури",
      dress: "Либослар ранглари",
      gallery: "Лаҳзалар",
      rsvp: "Келишингиз",
      wishes: "Тилаклар",
      thanks: "Биз билан бўлганингиз учун раҳмат",
      close: "Ёпиш",
      next: "Кейинги",
      previous: "Олдинги",
      replay: "Қайта кўриш",
      skip: "Ўтказиш",
      start: "Бошлаш",
      play: "Ижро этиш",
      pause: "Тўхтатиш",
      name: "Исмингиз",
      note: "Хабар (ихтиёрий)",
      message: "Тилагингизни ёзинг",
      yes: "Келаман",
      no: "Кела олмайман",
      maybe: "Ҳали аниқ эмас",
      send: "Юбориш",
      choose: "Жавобингизни танланг",
      sent: "Жавобингиз сақланди. Раҳмат!",
      pending: "Тилагингиз юборилди. Эгаси тасдиқлагач кўринади.",
      fail: "Юборилмади. Қайта уриниб кўринг.",
      preview: "Кўриш режимида юбориш ўчирилган.",
      map: "Харитани очиш",
      address: "Манзилни нусхалаш",
      calendar: "Тақвимга қўшиш",
      download: ".ics юклаб олиш",
      copied: "Нусхаланди",
      days: "кун қолди",
      hours: "Соат",
      minutes: "Дақиқа",
      seconds: "Сония",
      scene: "Саҳна",
      original: "Асл",
      tapPhoto: "Қаҳрамонни алмаштириш учун суратни ёки тугмани босинг.",
      galleryHint: "Кўринишни танланг ва суратни катталаштириш учун босинг.",
      dressHint: "Либос рангини танлаш учун бўёқни босинг.",
      credits: "Иштирокчилар",
      hosts: "Мезбонлар",
      starring: "Бош ролларда",
      guestCredit: "Азиз меҳмон",
      forever: "Абадий ♡",
      yesterday: "Кеча",
      soundtrack: "Мусиқа",
      sound: "Овоз эффектлари",
      scroll: "Пастга",
      transcript: "Тўлиқ ҳикояни ўқиш",
      comments: "Барча тилаклар",
      commentToggle: "Сузувчи тилаклар",
      deadline: "Жавоб муддати",
      occasion: "Тадбир куни",
      photo: "Сурат",
      episode: "Қисм",
      date: "Сана",
      time: "Вақт",
      image: "Тасвир",
      season: "Фасл",
      menu: "Меню",
      status: "Ҳолат",
      allDay: "Кун давомида",
      listen: "Ҳикояни тинглаш",
      stopCredits: "Титрларни тўхтатиш",
      resumeCredits: "Титрларни давом эттириш",
      guide: "Харитада йўлни кўриш",
      narration: "Сизни байрамимизда кутамиз!",
      stamp: "Хотира учун муҳр",
      invitation: "Таклифнома",
      mainVisual: "Асосий тасвир",
      allWishes: "Юракдан",
      route: "Жавобингиз",
      select: "Танлаш",
      foreverEnd: "Ҳикоямиз давом этади… ♡",
    },
    en: {
      open: "Open invitation",
      hint: "Tap the locker or button to enter our story.",
      guest: "Dear guest",
      letter: "You are invited ♡",
      to: "For you",
      final: "Final episode",
      welcome: "Welcome",
      couple: "Main characters",
      story: "Our four seasons",
      count: "Until our special day",
      event: "Our celebration",
      venue: "Location",
      program: "The programme",
      dress: "Dress colours",
      gallery: "Memories",
      rsvp: "Your attendance",
      wishes: "Wishes",
      thanks: "Thank you for being part of our story",
      close: "Close",
      next: "Next",
      previous: "Previous",
      replay: "Replay",
      skip: "Skip",
      start: "Start watching",
      play: "Play",
      pause: "Pause",
      name: "Your name",
      note: "Message (optional)",
      message: "Write your wish",
      yes: "I will attend",
      no: "I cannot attend",
      maybe: "Not sure yet",
      send: "Send",
      choose: "Choose your answer",
      sent: "Your response was saved. Thank you!",
      pending: "Your wish was sent. It will appear after the host approves it.",
      fail: "Could not send. Please try again.",
      preview: "Sending is disabled in preview.",
      map: "Open map",
      address: "Copy address",
      calendar: "Add to calendar",
      download: "Download .ics",
      copied: "Copied",
      days: "days to go",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      scene: "Scene",
      original: "Original",
      tapPhoto: "Tap a portrait or use the controls to switch characters.",
      galleryHint: "Choose a style, then tap a photograph to look closer.",
      dressHint: "Tap a paint colour to colour the outfits.",
      credits: "Cast and credits",
      hosts: "Hosted by",
      starring: "Starring",
      guestCredit: "Guest of honour",
      forever: "Forever ♡",
      yesterday: "Yesterday",
      soundtrack: "Music",
      sound: "Sound effects",
      scroll: "Scroll",
      transcript: "Read the full story",
      comments: "All wishes",
      commentToggle: "Floating wishes",
      deadline: "Reply by",
      occasion: "Event day",
      photo: "Photo",
      episode: "Episode",
      date: "Date",
      time: "Time",
      image: "Image",
      season: "Season",
      menu: "Menu",
      status: "Status",
      allDay: "All day",
      listen: "Listen to the narrator",
      stopCredits: "Pause credits",
      resumeCredits: "Resume credits",
      guide: "Get directions",
      narration: "We look forward to celebrating with you!",
      stamp: "A keepsake stamp",
      invitation: "Invitation",
      mainVisual: "Main visual",
      allWishes: "From the heart",
      route: "Your answer",
      select: "Select",
      foreverEnd: "To be continued… forever ♡",
    },
    ru: {
      open: "Открыть приглашение",
      hint: "Нажмите на шкафчик или кнопку, чтобы войти в нашу историю.",
      guest: "Дорогой гость",
      letter: "Вы приглашены ♡",
      to: "Для вас",
      final: "Финальная серия",
      welcome: "Добро пожаловать",
      couple: "Главные герои",
      story: "Наши четыре сезона",
      count: "До нашего праздника",
      event: "Наше торжество",
      venue: "Место проведения",
      program: "Программа",
      dress: "Цвета нарядов",
      gallery: "Мгновения",
      rsvp: "Ваше присутствие",
      wishes: "Пожелания",
      thanks: "Спасибо, что стали частью нашей истории",
      close: "Закрыть",
      next: "Далее",
      previous: "Назад",
      replay: "Повторить",
      skip: "Пропустить",
      start: "Начать просмотр",
      play: "Воспроизвести",
      pause: "Приостановить",
      name: "Ваше имя",
      note: "Сообщение (необязательно)",
      message: "Напишите пожелание",
      yes: "Приду",
      no: "Не смогу прийти",
      maybe: "Пока не знаю",
      send: "Отправить",
      choose: "Выберите ответ",
      sent: "Ответ сохранён. Спасибо!",
      pending:
        "Пожелание отправлено. Оно появится после одобрения хозяина приглашения.",
      fail: "Не удалось отправить. Попробуйте ещё раз.",
      preview: "Отправка в режиме просмотра отключена.",
      map: "Открыть карту",
      address: "Скопировать адрес",
      calendar: "Добавить в календарь",
      download: "Скачать .ics",
      copied: "Скопировано",
      days: "дней осталось",
      hours: "Часы",
      minutes: "Минуты",
      seconds: "Секунды",
      scene: "Сцена",
      original: "Оригинал",
      tapPhoto: "Нажмите на портрет или кнопку, чтобы сменить героя.",
      galleryHint: "Выберите стиль и нажмите на фотографию для увеличения.",
      dressHint: "Нажмите на краску, чтобы выбрать цвет наряда.",
      credits: "Участники",
      hosts: "Организаторы",
      starring: "В главных ролях",
      guestCredit: "Почётный гость",
      forever: "Навсегда ♡",
      yesterday: "Вчера",
      soundtrack: "Музыка",
      sound: "Звуковые эффекты",
      scroll: "Листайте",
      transcript: "Прочитать всю историю",
      comments: "Все пожелания",
      commentToggle: "Летящие пожелания",
      deadline: "Ответить до",
      occasion: "День торжества",
      photo: "Фото",
      episode: "Серия",
      date: "Дата",
      time: "Время",
      image: "Изображение",
      season: "Сезон",
      menu: "Меню",
      status: "Статус",
      allDay: "Весь день",
      listen: "Послушать рассказчика",
      stopCredits: "Остановить титры",
      resumeCredits: "Продолжить титры",
      guide: "Построить маршрут",
      narration: "Ждём вас на нашем празднике!",
      stamp: "Памятный штамп",
      invitation: "Приглашение",
      mainVisual: "Главный кадр",
      allWishes: "От всего сердца",
      route: "Ваш ответ",
      select: "Выбрать",
      foreverEnd: "Продолжение следует… навсегда ♡",
    },
  };
  Object.entries({
    "uz-Latn": {
      coverGreeting: "Bu shkafchada siz uchun\nbir maktub bor…",
      closing: "Yakun",
      on: "yoqildi",
      off: "o‘chirildi",
    },
    "uz-Cyrl": {
      coverGreeting: "Бу шкафчада сиз учун\nбир мактуб бор…",
      closing: "Якун",
      on: "ёқилди",
      off: "ўчирилди",
    },
    en: {
      coverGreeting: "There is a letter for you\nin this locker…",
      closing: "Ending",
      on: "enabled",
      off: "disabled",
    },
    ru: {
      coverGreeting: "В этом шкафчике\nдля вас есть письмо…",
      closing: "Завершение",
      on: "включены",
      off: "выключены",
    },
  }).forEach(([locale, values]) => Object.assign(copy[locale], values));
  let active;
  let signature = "";
  let initialized = false;
  let status = "";
  let t;
  function setImage(id, src, alt) {
    const img = $(id);
    if (!img) return;
    const url = safeUrl(src);
    if (url) img.src = url;
    else img.removeAttribute("src");
    img.alt = alt || "";
  }
  function section(id, visible) {
    show(`sec-${id}`, visible);
    show(`nav-${id}`, visible);
  }
  function localize() {
    const bindings = {
      "cover-open-t": "open",
      "cover-hint": "hint",
      "cover-chip-a": "final",
      "letter-card-a": "letter",
      "letter-to-generic": "to",
      "hero-kv-tag": "mainVisual",
      "hero-ep-k": "final",
      "hero-date-l": "date",
      "hero-skip-t": "skip",
      "hero-next-t": "start",
      "hero-scroll-t": "scroll",
      "prolog-title": "welcome",
      "chr-title": "couple",
      "chr-lead": "tapPhoto",
      "chr-role-b-a": "starring",
      "chr-role-g-a": "starring",
      "ep-title": "story",
      "ep-lead": "story",
      "ep-list-h": "story",
      "ep-start-t": "play",
      "ep-next-go-t": "next",
      "ep-next-re-t": "replay",
      "ep-next-k": "next",
      "yk-title": "count",
      "yk-voice-t": "listen",
      "yk-final-k": "final",
      "yk-cap-a": "final",
      "cd-lead": "count",
      "cd-unit": "days",
      "cd-h-l": "hours",
      "cd-m-l": "minutes",
      "cd-s-l": "seconds",
      "cd-gcal-t": "calendar",
      "cd-ics-t": "download",
      "ac-title": "event",
      "ac-led-l": "next",
      "st-1-prev-t": "yesterday",
      "st-1-next-t": "forever",
      "st-1-map-t": "guide",
      "st-1-cal-t": "calendar",
      "st-1-ticket-a": "invitation",
      "sb-title": "program",
      "sb-lead": "program",
      "sb-meta-2-v": "final",
      "sb-col-2": "image",
      "sb-col-3": "scene",
      "sb-col-4": "time",
      "lc-title": "venue",
      "lc-lead": "venue",
      "lc-tag": "venue",
      "lc-go-t": "map",
      "lc-copy-t": "address",
      "sj-lbl-r": "original",
      "sj-lbl-a": "image",
      "lc-stamp-t": "stamp",
      "bs-title": "dress",
      "bs-top-b": "dressHint",
      "gl-title": "gallery",
      "gl-lead": "galleryHint",
      "gl-f-asli": "original",
      "vn-title": "rsvp",
      "vn-aff-l": "route",
      "vn-guest-generic": "welcome",
      "rsvp-name-l": "name",
      "rsvp-status-l": "choose",
      "rsvp-msg-l": "note",
      "vn-ch-yes-t": "yes",
      "vn-ch-no-t": "no",
      "vn-ch-maybe-t": "maybe",
      "rsvp-submit-t": "send",
      "vn-err": "choose",
      "vn-clear-b": "sent",
      "vn-clear-c": "sent",
      "vn-say-t": "rsvp",
      "vn-say-src": "rsvp",
      "dm-title": "wishes",
      "dm-lead": "allWishes",
      "dm-caption-t": "thanks",
      "wish-form-h": "wishes",
      "wish-send-t": "send",
      "wish-list-h-a": "comments",
      "dm-toggle-t": "commentToggle",
      "ed-title": "thanks",
      "ed-msg-t": "thanks",
      "ed-sign-a": "hosts",
      "ed-no-t": "closing",
      "ed-roll-h": "credits",
      "ed-roll-btn-t": "stopCredits",
      "ed-replay-t": "replay",
      "tbc-t": "foreverEnd",
    };
    Object.entries(bindings).forEach(([id, key]) => put(id, t[key]));
    const sourceLabels = {
      "cover-chip-b": "event",
      "cover-to-generic": "coverGreeting",
      "lk-plate-generic": "guest",
      "cr-guest-generic": "guestCredit",
      "cover-logo-jp": "invitation",
      "hero-logo-jp": "invitation",
      "hud-rec": "final",
      "hero-presents": "story",
      "prolog-no-ja": "welcome",
      "prolog-sub": "welcome",
      "chr-no-ja": "couple",
      "chr-sub": "couple",
      "chr-role-b-ja": "starring",
      "chr-role-g-ja": "starring",
      "ep-no-ja": "story",
      "ep-sub": "story",
      "ep-eye-ja": "story",
      "ep-next-ja": "next",
      "yk-no-ja": "count",
      "yk-sub": "count",
      "yk-stamp": "next",
      "ac-no-ja": "event",
      "ac-sub": "event",
      "sb-no-ja": "program",
      "sb-sub": "program",
      "sb-meta-1-k": "invitation",
      "sb-meta-2-k": "episode",
      "sb-meta-3-k": "hosts",
      "sb-ok-a": "program",
      "sb-ok-b": "yes",
      "sb-col-1": "scene",
      "lc-no-ja": "venue",
      "lc-sub": "venue",
      "lc-stamp-ja": "stamp",
      "bs-no-ja": "dress",
      "bs-sub": "dress",
      "gl-no-ja": "gallery",
      "gl-sub": "gallery",
      "gl-f-anime-ja": "image",
      "gl-f-manga-ja": "image",
      "vn-no-ja": "rsvp",
      "vn-sub": "rsvp",
      "dm-no-ja": "wishes",
      "dm-sub": "wishes",
      "dm-live": "wishes",
      "ed-no-ja": "closing",
      "ed-sub": "thanks",
      "ed-no-b": "closing",
      "tbc-ja": "forever",
      "op-cr-1-k": "story",
      "op-cr-1-l": "story",
      "op-cr-2-k": "hosts",
      "op-cr-2-l": "hosts",
    };
    Object.entries(sourceLabels).forEach(([id, key]) => put(id, t[key]));
    document.querySelectorAll(".lk-plate").forEach((node) => {
      if (/^No\.\s*\d+$/.test(node.textContent.trim()))
        node.textContent = node.textContent.replace("No.", "№");
    });
    const navKeys = {
      hero: "welcome",
      prolog: "invitation",
      mempelai: "couple",
      kisah: "story",
      hitung: "count",
      acara: "event",
      rundown: "program",
      lokasi: "venue",
      busana: "dress",
      galeri: "gallery",
      rsvp: "rsvp",
      ucapan: "wishes",
      penutup: "closing",
    };
    Object.entries(navKeys).forEach(([section, key]) => {
      put(`nav-${section}-l`, t[key]);
      const node = $(`sec-${section}`);
      if (node) {
        node.dataset.title = t[key];
        node.dataset.nav = t[key];
      }
      if ($(`nav-${section}`))
        $(`nav-${section}`).setAttribute("aria-label", t[key]);
    });
    // All source instructional attributes get localized as well as visible text.
    document.querySelectorAll("[aria-label],[title]").forEach((node) => {
      if (node.closest("[data-unsupported]")) return;
      const label = node.closest("#nav-benang")
        ? t.menu
        : node.closest("#sec-galeri,#gallery-viewer")
          ? t.gallery
          : node.closest("#sec-rsvp")
            ? t.rsvp
            : node.closest("#sec-mempelai")
              ? t.couple
              : t.invitation;
      if (node.hasAttribute("aria-label"))
        node.setAttribute("aria-label", label);
      if (node.hasAttribute("title")) node.title = label;
    });
    document.querySelectorAll(".ep-no > span:nth-child(2)").forEach((el) => {
      if (el.id !== "ed-no-t") el.textContent = t.scene;
    });
    document
      .querySelectorAll("#ep-transcript summary")
      .forEach((el) => (el.textContent = t.transcript));
    document.querySelectorAll(".cr dt").forEach((el) => {
      el.textContent = el.closest("#cr-3")
        ? t.starring
        : el.closest("#cr-4")
          ? t.hosts
          : t.guestCredit;
    });
    ["rsvp-name", "wish-name"].forEach((id) => {
      $(id).placeholder = t.name;
      $(id).maxLength = 100;
      $(id).setAttribute("aria-label", t.name);
    });
    $("rsvp-msg").placeholder = t.note;
    $("rsvp-msg").maxLength = 1000;
    $("wish-msg").placeholder = t.message;
    $("wish-msg").maxLength = 2000;
    $("wish-msg").setAttribute("aria-label", t.message);
    [
      "gv-close",
      "ep-c-prev",
      "ep-c-next",
      "chr-prev",
      "chr-next",
      "gv-prev",
      "gv-next",
      "ep-c-play",
      "btn-bgm",
      "btn-sfx",
    ].forEach((id) => {
      const key = id.includes("close")
        ? "close"
        : id.includes("prev")
          ? "previous"
          : id.includes("next")
            ? "next"
            : id === "btn-bgm"
              ? "soundtrack"
              : id === "btn-sfx"
                ? "sound"
                : "play";
      if ($(id)) {
        $(id).title = t[key];
        $(id).setAttribute("aria-label", t[key]);
      }
    });
  }
  function renderWishes(wishes) {
    const list = $("wish-list");
    list.replaceChildren();
    wishes.forEach((wish) => {
      const node = document.createElement("article");
      node.className = "comment-card wcard";
      [
        ["name", "comment-name wcard-name", wish.name],
        ["message", "comment-message wcard-msg", wish.message ?? wish.text],
      ].forEach(([field, className, text]) => {
        const p = document.createElement("p");
        p.className = className;
        p.dataset.field = field;
        p.textContent = text || "";
        node.append(p);
      });
      list.append(node);
    });
  }
  function bind(p) {
    active = p;
    t = copy[p.locale] || copy["uz-Latn"];
    const d = p.data;
    document.documentElement.lang = p.locale;
    const reduce =
      !!p.reducedMotion ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.toggleAttribute("data-reduced-motion", reduce);
    localize();
    const names = [d.bride, d.groom].filter(Boolean).join(" & ");
    const guest = p.guestName || t.guest;
    document.title = [names, d.title].filter(Boolean).join(" — ");
    [
      "lk-4-plate",
      "hn-bride-name",
      "chr-tab-b-t",
      "chr-name-b",
      "chr-full-b",
      "cr-3-a",
    ].forEach((id) => put(id, d.bride));
    [
      "lk-6-plate",
      "hn-groom-name",
      "chr-tab-g-t",
      "chr-name-g",
      "chr-full-g",
      "cr-3-b",
    ].forEach((id) => put(id, d.groom));
    ["letter-card-b", "vn-say-name", "ed-sign-b"].forEach((id) =>
      put(id, names),
    );
    [
      "cover-logo-main",
      "hero-logo-main",
      "ep-eye-logo",
      "sb-meta-1-v",
      "cr-end-a",
    ].forEach((id) => put(id, d.title || names));
    put("hero-tagline", d.message);
    put("op-lyric-base", d.message);
    put("op-cr-1-v", names);
    put("op-cr-2-v", d.hosts);
    show("op-cr-3", false);
    show("op-cr-4", false);
    put("prolog-intro", d.message);
    put("prolog-salam-t", d.greeting);
    section("prolog", !!(d.greeting || d.message));
    show("prolog-intro", !!d.message);
    show("prolog-salam", !!d.greeting);
    show("hero-tagline", !!d.message);
    show("hero-date", !!p.eventTimestamp);
    ["cover-guest", "lk-plate-named", "cr-guest-named"].forEach((id) =>
      put(id, guest),
    );
    [
      "cover-to-named",
      "letter-to-named",
      "hero-guest-named",
      "vn-guest-named",
    ].forEach((id) =>
      put(id, d.greeting || `${t.to}: ${p.guestName || ""}`.trim()),
    );
    [
      "lk-plate-generic",
      "cover-to-generic",
      "letter-to-generic",
      "hero-guest-generic",
      "vn-guest-generic",
      "cr-guest-generic",
    ].forEach((id) => show(id, !p.guestName));
    [
      "lk-plate-named",
      "cover-to-named",
      "letter-to-named",
      "hero-guest-named",
      "vn-guest-named",
      "cr-guest-named",
    ].forEach((id) => show(id, !!p.guestName));
    put("cr-4-a", d.hosts);
    put("cr-4-b", "");
    show("cr-4", !!d.hosts);
    put("hero-ep-t", d.eventType);
    put("yk-final-t", d.eventType);
    put("yk-narr", d.message);
    put("hero-date-t", d.date.long);
    if ($("hero-date-t"))
      $("hero-date-t").setAttribute("datetime", p.eventDate);
    put("hero-time-t", d.date.time);
    put("st-1-name", d.eventType);
    put("st-1-date-t", d.date.long);
    if ($("st-1-date-t"))
      $("st-1-date-t").setAttribute("datetime", p.eventDate);
    put("st-1-t0", d.date.time);
    put("st-1-t1", "");
    put("st-1-tz", d.timezone);
    put("st-1-venue-n", d.venue.name);
    put("st-1-venue-a", d.venue.address);
    put("lc-name", d.venue.name);
    put("lc-addr", d.venue.address);
    put("lc-note", "");
    put("sb-title", d.programHeading || t.program);
    put("sb-meta-3-v", d.hosts);
    const map =
      safeUrl(d.venue.mapUrl) ||
      (d.venue.lat !== null && d.venue.lng !== null
        ? `https://www.google.com/maps/search/?api=1&query=${d.venue.lat},${d.venue.lng}`
        : d.venue.address
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.venue.address)}`
          : "");
    ["st-1-map", "lc-go"].forEach((id) => {
      if (map) $(id).href = map;
      else $(id).removeAttribute("href");
      show(id, !!map);
    });
    section("lokasi", !!(d.venue.name || d.venue.address || map));
    section("acara", !!p.eventTimestamp);
    section("hitung", !!p.eventTimestamp);
    const gallery = d.gallery.filter((item) => safeUrl(item.src));
    const photo = gallery[0];
    const second = gallery[1];
    ["hero-photo", "vn-sprite-img", "ed-photo"].forEach((id) =>
      setImage(id, photo?.src, photo?.alt),
    );
    ["chr-tab-b-img", "chr-img-b", "pk-img-b"].forEach((id) =>
      setImage(id, second?.src || photo?.src, second?.alt || photo?.alt),
    );
    ["chr-tab-g-img", "chr-img-g", "pk-img-g"].forEach((id) =>
      setImage(id, photo?.src, photo?.alt),
    );
    section("galeri", gallery.length > 0);
    ["sj", "sj-art"].forEach((id) => show(id, false)); // No venue-photo contract field.
    ["chr-ig-b", "chr-ig-g"].forEach((id) => {
      const link = d.instagram && safeUrl(d.instagram.href);
      show(id, !!link);
      if (link) {
        $(id).href = link;
        put(`${id}-t`, d.instagram.value);
      }
    });
    const slots = [];
    d.story.forEach((chapter, i) => {
      const n = i + 1;
      slots.push(n);
      if (n > 4) {
        // Extend the captured repeatable chapter structure, retaining its own
        // scene geometry and transitions for every stable contract chapter ID.
        [
          ["ep-scene-4", "ep-screen"],
          ["ep-li-4", "ep-list"],
          ["ep-d-4", "ep-tr-body"],
        ].forEach(([id, parent]) => {
          const base = $(id),
            target = $(parent) || base?.parentElement;
          if (!base || !target) return;
          const clone = base.cloneNode(true);
          [clone, ...clone.querySelectorAll("[id]")].forEach((node) => {
            if (node.id) node.id = node.id.replace(/4/g, String(n));
          });
          clone
            .querySelectorAll("[aria-controls],[aria-labelledby],[for]")
            .forEach((node) => {
              ["aria-controls", "aria-labelledby", "for"].forEach((attr) => {
                if (node.hasAttribute(attr))
                  node.setAttribute(
                    attr,
                    node.getAttribute(attr).replace(/-4\b/g, `-${n}`),
                  );
              });
            });
          target.append(clone);
        });
        const style = document.createElement("style");
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              if (
                rule.selectorText &&
                /#ep-(scene|fx|mem|li|d)-4\b/.test(rule.selectorText)
              )
                style.textContent += rule.cssText
                  .replace(/#ep-(scene|fx|mem|li|d)-4\b/g, `#ep-$1-${n}`)
                  .replaceAll("../assets/", `/templates/${ID}/assets/`);
            }
          } catch {}
        }
        document.head.append(style);
      }
      put(`ep-d-${n}-t`, chapter.title);
      put(`ep-d-${n}-x`, chapter.text);
      put(`ep-d-${n}-w`, "");
      if ($(`ep-d-${n}`)) $(`ep-d-${n}`).dataset.contractId = chapter.id;
      setImage(`ep-mem-${n}-img`, gallery[i]?.src, gallery[i]?.alt);
    });
    section("kisah", slots.length > 0);
    const dress = d.dressCode;
    put(
      "bs-text",
      [dress.style, dress.text, dress.note].filter(Boolean).join("\n"),
    );
    dress.colors.forEach((color) => {
      const span = document.createElement("span");
      span.className = "bs-d";
      span.dataset.c = color.hex;
      span.dataset.contractId = color.id;
      span.textContent = color.name;
      $("bs-data").append(span);
    });
    section(
      "busana",
      !!dress.enabled &&
        !!(dress.text || dress.style || dress.note || dress.colors.length),
    );
    $("wedivo-rundown-data").textContent = JSON.stringify(
      d.program.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: p.eventDate,
        startTime: item.time,
        endTime: "",
        isAllDay: !item.time,
      })),
    );
    section(
      "rundown",
      d.program.some((item) => item.title),
    );
    section("rsvp", !!d.rsvp.enabled);
    section("ucapan", !!d.wishesEnabled);
    put(
      "vn-deadline",
      d.rsvp.deadline ? `${t.deadline}: ${d.rsvp.deadline}` : "",
    );
    $("rsvp-name").value = p.guestName || "";
    $("wish-name").value = p.guestName || "";
    renderWishes(p.preview ? d.wishes : []);
    const music = safeUrl(d.music.url);
    if (d.music.enabled && music && !p.silentPlayback) $("bgm").src = music;
    else $("bgm").removeAttribute("src");
    window.AnginPlatform = {
      copy: t,
      guestName: p.guestName || "",
      timezoneLabel: d.timezone,
      eventDescription: d.message,
      silentPlayback: !!p.silentPlayback,
      preserveMusicPause: !!p.restoreOpen && !p.musicWasPlaying,
      mapUrl: map,
      galleryItems: gallery,
      formatDate: () => d.date.long,
      seasons: {
        "uz-Latn": {
          semi: "Bahor",
          panas: "Yoz",
          gugur: "Kuz",
          dingin: "Qish",
        },
        "uz-Cyrl": { semi: "Баҳор", panas: "Ёз", gugur: "Куз", dingin: "Қиш" },
        en: {
          semi: "Spring",
          panas: "Summer",
          gugur: "Autumn",
          dingin: "Winter",
        },
        ru: { semi: "Весна", panas: "Лето", gugur: "Осень", dingin: "Зима" },
      }[p.locale],
      gallery: gallery.map((item) => safeUrl(item.src)),
      storySlots: slots,
      reducedMotion: reduce,
      intlLocale:
        {
          "uz-Latn": "uz-UZ",
          "uz-Cyrl": "uz-Cyrl-UZ",
          en: "en-GB",
          ru: "ru-RU",
        }[p.locale] || "uz-UZ",
      timezoneOffset: p.timezoneOffset,
      eventTimestamp: p.eventTimestamp,
      afterSource,
    };
    document.documentElement.setAttribute("data-platform-ready", "");
    const localeMenu = document.createElement("div");
    localeMenu.className = "platform-language";
    localeMenu.setAttribute("role", "group");
    localeMenu.setAttribute("aria-label", t.menu);
    (p.enabledLocales || [p.locale]).forEach((locale) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = {
        "uz-Latn": "Uz",
        "uz-Cyrl": "Уз",
        en: "En",
        ru: "Ru",
      }[locale];
      button.setAttribute("aria-pressed", String(locale === p.locale));
      button.onclick = () => {
        if (locale !== p.locale)
          parent.postMessage({ type: `${ID}:locale`, locale }, location.origin);
      };
      localeMenu.append(button);
    });
    show("svg-sprite", true);
    if (p.enabledLocales?.length > 1) document.body.append(localeMenu);
  }
  function afterSource() {
    // Source-created content gets localized after its own initialization.
    localize();
    const d = active.data;
    d.gallery.forEach((item, index) => {
      const image = $(`gl-cel-${index + 1}-img`);
      if (image)
        image.alt = item.alt || item.caption || `${t.photo} ${index + 1}`;
      const cell = $(`gl-cel-${index + 1}`);
      if (cell) cell.dataset.contractId = item.id;
    });
    ["hero-kana-b", "hn-bride-kana", "chr-kana-b"].forEach((id) =>
      put(id, d.bride),
    );
    ["hero-kana-g", "hn-groom-kana", "chr-kana-g"].forEach((id) =>
      put(id, d.groom),
    );
    put("st-1-kana", d.eventType);
    put("hud-title", t.welcome);
    put("hud-scene", "00");
    put("hud-season", window.AnginPlatform.seasons.semi);
    ["cover-sfx", "chr-sfx-b", "chr-sfx-g", "cd-sfx", "bs-sfx"].forEach((id) =>
      put(id, "♡"),
    );
    put("lc-stamp-tp", [d.venue.name, t.final].filter(Boolean).join(" ✿ "));
    ["hero-date-t", "cd-when-d", "st-1-date-t"].forEach((id) =>
      put(id, d.date.long),
    );
    document
      .querySelectorAll(".sb-day > span:last-child")
      .forEach((node) => (node.textContent = d.date.long));
    put(
      "cd-mon",
      d.date.month ? `${d.date.month.toLocaleUpperCase()} ${d.date.year}` : "",
    );
    put("cd-wd", d.date.weekday);
    put("st-1-ticket-b", active.guestName || t.guest);
    put("st-1-prev-t", t.yesterday);
    put("st-1-next-t", t.forever);
    put(
      "ac-led-t",
      [d.eventType, d.date.long, d.date.time].filter(Boolean).join(" · "),
    );
    document
      .querySelectorAll(".sb-day-k")
      .forEach((node) => (node.textContent = t.occasion));
    document
      .querySelectorAll(".sb-row")
      .forEach((node, i) => (node.dataset.contractId = d.program[i]?.id || ""));
    ["lc-go", "st-1-map"].forEach((id) => {
      if (window.AnginPlatform.mapUrl) $(id).href = window.AnginPlatform.mapUrl;
      show(id, !!window.AnginPlatform.mapUrl);
    });
    ["hero-guest", "vn-guest-hi"].forEach((id) => put(id, d.greeting));
    const metaLabels = {
      "bs-top-a": t.dress,
      "sb-foot": t.program,
      "cr-end-b": t.final,
    };
    Object.entries(metaLabels).forEach(([id, label]) => put(id, label));
    $("sec-mempelai")
      .querySelectorAll(".chr-tapline")
      .forEach((node) => (node.hidden = true));
    $("ep-start-s").textContent = `${d.story.length} ${t.episode}`;
    document
      .querySelectorAll("details summary")
      .forEach((node) => (node.textContent = t.transcript));
    document.querySelectorAll(".scn[data-title]").forEach((node) => {
      const h = node.querySelector(".ep-title");
      if (h) node.dataset.title = h.textContent;
    });
    if (active.restoreOpen) {
      $("sec-cover").style.display = "none";
      document.body.classList.remove("is-locked");
      document.body.classList.add("is-open");
      document
        .querySelectorAll("#sec-hero .rv")
        .forEach((node) => node.classList.add("is-in", "is-shown"));
      $("sec-hero").classList.add("is-op-done");
      window.scrollTo(0, active.restoreScroll || 0);
      if (active.musicWasPlaying && !active.silentPlayback)
        $("bgm")
          .play()
          .catch(() => {});
    }
    if (!active.preview && d.wishesEnabled) loadWishes();
    document.documentElement.setAttribute("data-source-ready", "");
    fitNames();
  }
  function fitNames() {
    const fit = () =>
      [
        "hn-bride-name",
        "hn-groom-name",
        "lk-4-plate",
        "lk-6-plate",
        "chr-name-b",
        "chr-name-g",
        "cover-logo-main",
        "hero-logo-main",
      ].forEach((id) => {
        const node = $(id);
        if (!node) return;
        let size = parseFloat(getComputedStyle(node).fontSize);
        let tries = 0;
        while (
          node.scrollWidth > node.clientWidth + 1 &&
          size > 14 &&
          tries++ < 30
        ) {
          size -= 1;
          node.style.fontSize = `${size}px`;
        }
      });
    fit();
    document.fonts?.ready.then(fit);
  }
  async function loadWishes() {
    try {
      const response = await fetch(
        `/api/public/invitations/${encodeURIComponent(active.invitationId)}/wishes`,
        { credentials: "same-origin", cache: "no-store" },
      );
      if (!response.ok) return;
      const body = await response.json();
      renderWishes(Array.isArray(body.wishes) ? body.wishes : []);
    } catch {
      /* Keep the form usable; never synthesize published wishes. */
    }
  }
  function feedback(form, text) {
    let node = form.querySelector(".platform-status");
    if (!node) {
      node = document.createElement("p");
      node.className = "platform-status";
      node.setAttribute("role", "status");
      form.append(node);
    }
    node.textContent = text;
  }
  function wireServices() {
    document.querySelectorAll("[data-wedivo-status]").forEach((button) =>
      button.addEventListener("click", () => {
        status = button.dataset.wedivoStatus;
        document.querySelectorAll("[data-wedivo-status]").forEach((node) => {
          node.classList.toggle("is-selected", node === button);
          node.setAttribute("aria-pressed", String(node === button));
        });
      }),
    );
    $("rsvp-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (active.preview) {
        feedback(form, t.preview);
        return;
      }
      if (!status) {
        feedback(form, t.choose);
        return;
      }
      const input = {
        name: $("rsvp-name").value.trim(),
        status: { attending: "yes", not_attending: "no", maybe: "maybe" }[
          status
        ],
        partySize: status === "attending" ? 1 : 0,
        note: $("rsvp-msg").value.trim(),
        guestToken: active.guestToken || undefined,
      };
      await submit(form, "rsvp", input, t.sent);
    });
    $("wish-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (active.preview) {
        feedback(form, t.preview);
        return;
      }
      const ok = await submit(
        form,
        "wishes",
        {
          name: $("wish-name").value.trim(),
          message: $("wish-msg").value.trim(),
          guestToken: active.guestToken || undefined,
        },
        t.pending,
      );
      if (ok) $("wish-msg").value = "";
    });
    $("gift-form").addEventListener("submit", (event) =>
      event.preventDefault(),
    );
  }
  async function submit(form, endpoint, input, success) {
    const button = form.querySelector('[type="submit"]');
    if (button.disabled) return false;
    button.disabled = true;
    try {
      const response = await fetch(
        `/api/public/invitations/${encodeURIComponent(active.invitationId)}/${endpoint}`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
      );
      if (!response.ok) throw new Error("submit");
      // Do not use the source shim's unverified success states or expose pending wishes.
      feedback(form, success);
      return true;
    } catch {
      feedback(form, t.fail);
      return false;
    } finally {
      button.disabled = false;
    }
  }
  function reload(p) {
    window.name = JSON.stringify({
      type: `${ID}:update`,
      payload: {
        ...p,
        restoreOpen: document.body.classList.contains("is-open"),
        restoreScroll: window.scrollY,
        musicWasPlaying: !$("bgm").paused,
      },
    });
    location.reload();
  }
  function receive(message) {
    if (message?.type !== `${ID}:update` || !message.payload?.data) return;
    const { restoreOpen, restoreScroll, musicWasPlaying, ...raw } =
      message.payload;
    const next = JSON.stringify(raw);
    if (next === signature) return;
    if (initialized) {
      reload(message.payload);
      return;
    }
    signature = next;
    initialized = true;
    bind(message.payload);
    wireServices();
    const script = document.createElement("script");
    script.src = "source/template.js";
    document.body.append(script);
  }
  window.addEventListener("message", (event) => {
    if (event.origin === location.origin && event.source === parent)
      receive(event.data);
  });
  // window.name is used only for an in-frame locale/content refresh, then erased.
  try {
    const cached = JSON.parse(window.name || "null");
    window.name = "";
    receive(cached);
  } catch {}
  if (!initialized)
    parent.postMessage({ type: `${ID}:ready` }, location.origin);
})();
