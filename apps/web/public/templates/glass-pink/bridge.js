(() => {
  "use strict";

  const templateId = "glass-pink";
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
  const root = document.querySelector('[data-chorlove-template="glass-pink"]');
  if (!root) return;

  let state = null;
  let countdownTimer = 0;
  const text = (node, value) => { if (node) node.textContent = value == null ? "" : String(value); };
  const hide = (node, hidden) => { if (node) node.hidden = Boolean(hidden); };

  function restoreCapturedMotion() {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("qaReducedMotion") === "1";
    let sequence = 0;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        if (reduce) { element.style.opacity = ""; element.style.transform = ""; }
        else {
          element.style.setProperty("--cc-from-transform", element.style.transform || "translateY(10px)");
          element.style.opacity = "";
          element.style.transform = "";
          element.style.animationDelay = `${Math.min(sequence++ * 30, 360)}ms`;
          element.dataset.chorloveReveal = "";
        }
      }
    }, { threshold: 0.08 });
    root.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]').forEach((element) => { if (!element.closest("[data-gp-source-hero]")) observer.observe(element); });
  }

  let openingBound = false;
  let heroMotionStarted = false;
  let heroParallaxBound = false;
  const sourcePetals = [
    ["91.44%","#eab8c2","14.7px",8.2,.98],["39.10%","#eab8c2","15.1px",12.9,1.68],
    ["62.76%","#eab8c2","15.3px",11.4,1.18],["90.66%","#f5d6dc","22.4px",11.4,.42],
    ["75.20%","#eab8c2","21.5px",9.1,1.95],["89.88%","#ffffff","21.4px",9.8,2],
    ["15.71%","#eab8c2","17.8px",12.1,1.18],["80.13%","#ffffff","23px",9.2,2.28],
    ["29.75%","#eab8c2","15.2px",11.6,1.86],["65.05%","#f5d6dc","18.5px",10.1,.84],
    ["75.37%","#f5d6dc","21.5px",11.6,2],["25.90%","#f7e3e8","12.7px",10.4,2.33],
  ];
  function sourceOpening(payload) {
    const envelope = root.querySelector('[data-landing-screenshot-id="invite-envelope"]');
    if (!envelope) return;
    const card = envelope.querySelector('[style*="z-index:10"]');
    const content = card?.querySelector('.relative.rounded-lg .relative.z-10.text-center');
    const headings = content?.querySelectorAll("h1") || [];
    const greeting = content?.querySelector("p span[dir]");
    const nameNodes = headings[1]?.querySelectorAll("span") || [];
    const date = content?.querySelector(".flex.flex-col.items-center span[dir]");
    const button = envelope.querySelector("button");
    const heart = card?.querySelector('.rounded-full[style*="top:50px"]');
    if (payload?.data) {
      text(greeting, payload.data.greeting || localCopy().openingGreeting);
      text(headings[0], payload.data.title || localCopy().invitationTitle);
      text(nameNodes[0], payload.data.groom);
      text(nameNodes[2], payload.data.bride);
      const d = payload.data.date || {};
      text(date, d.long || [d.month,d.day,d.year].filter(Boolean).join(" "));
    }
    if (button) { text(button.querySelector("span"), localCopy().openInvitation); button.setAttribute("aria-label", localCopy().openInvitation); }
    if (!openingBound) {
      const reduced = Boolean(payload?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
      const petalLayer = envelope.children[1];
      for (const [left,color,size,duration,delay] of sourcePetals) {
        const petal = document.createElement("span"); petal.className = "cc-source-petal";
        petal.style.left=left; petal.style.color=color; petal.style.fontSize=size;
        petal.style.setProperty("--cc-petal-duration",`${duration}s`); petal.style.setProperty("--cc-petal-delay",`${delay}s`);
        petal.setAttribute("aria-hidden","true");
        petal.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><g><ellipse cx="12" cy="5" rx="2.2" ry="4.5"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(120 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(180 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(240 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(300 12 12)"/></g><circle cx="12" cy="12" r="1.8" fill-opacity=".45"/></svg>';
        if (!reduced) {
          petalLayer?.append(petal);
          petal.animate([{ translate: "0 -10vh" }, { translate: "0 110vh" }], { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: "linear" });
          petal.animate([{ opacity: 0 }, { opacity: .8, offset: .14, easing: "ease-in-out" }, { opacity: .8, offset: .78 }, { opacity: 0 }], { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: "ease-in-out" });
          petal.animate([{ rotate: "0deg" }, { rotate: "360deg" }], { duration: duration * 1200, delay: delay * 1000, iterations: Infinity, easing: "linear" });
        }
      }
      if (heart) { heart.setAttribute("role","button"); heart.tabIndex=0; heart.setAttribute("aria-label",localCopy().openInvitation); }
      const close = () => {
        if (envelope.classList.contains("cc-source-closing")) return;
        envelope.classList.add("cc-source-closing");
        envelope.querySelectorAll(".cc-source-petal").forEach(petal => {
          const opacity = getComputedStyle(petal).opacity;
          petal.getAnimations().forEach(animation => animation.cancel());
          petal.animate([
            { translate: "0 0px", scale: "1" },
            { translate: "0 150px", scale: "2" },
            { translate: "0 300px", scale: "0" },
          ], { duration: 850, easing: "ease-out", fill: "forwards" });
          petal.animate([{ opacity }, { opacity: 0 }], { duration: 850, easing: "ease-out", fill: "forwards" });
        });
        window.setTimeout(() => { envelope.hidden=true; }, 1100);
      };
      button?.addEventListener("click", close);
      heart?.addEventListener("click", close);
      heart?.addEventListener("keydown", event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();close();}});
      openingBound=true;
    }
  }
  function animateSourceHero(reduced) {
    if (heroMotionStarted) return;
    const hero = root.querySelector("section");
    if (!hero) return;
    hero.dataset.gpSourceHero="";
    heroMotionStarted=true;
    const leaves=hero.querySelectorAll('img[style*="opacity:0"]');
    const card=hero.querySelector('div[style*="opacity:0"]');
    const run=(node,frames,duration,delay,easing="easeOut")=>{
      if(!node)return;
      if(reduced){const last=frames.at(-1);node.style.opacity=String(last.opacity);node.style.transform=last.transform||`translateY(${last.y||0}px) scale(${last.scale||1})`;return;}
      node.animate(frames,{duration:duration*1000,delay:delay*1000,easing,fill:"both"});
    };
    run(leaves[0],[{opacity:0,transform:"scale(.8)"},{opacity:.9,transform:"scale(1)"}],1,.2);
    run(leaves[1],[{opacity:0,transform:"scale(.8)"},{opacity:.9,transform:"scale(1)"}],1,.35);
    run(card,[{opacity:0,transform:"translateY(30px) scale(.85)"},{opacity:1,transform:"translateY(0) scale(1)"}],.9,.25,"cubic-bezier(.22,1,.36,1)");
    const names=card?.children||[];
    run(names[0],[{opacity:0,transform:"translateY(15px)"},{opacity:1,transform:"translateY(0)"}],.7,.8);
    run(names[1],[{opacity:0,transform:"scale(.5)"},{opacity:.9,transform:"scale(1)"}],.7,.65);
    run(names[2],[{opacity:0,transform:"translateY(15px)"},{opacity:1,transform:"translateY(0)"}],.7,.5);
    run(leaves[2],[{opacity:0,transform:"scale(.7)"},{opacity:1,transform:"scale(1)"}],.9,.55);
    if(!reduced&&!heroParallaxBound&&leaves.length>=3){
      let scroller=window;for(let node=hero;node;node=node.parentElement){if(/(auto|scroll)/.test(getComputedStyle(node).overflowY)){scroller=node;break;}}
      const sync=()=>{const amount=Math.max(0,Math.min(1,(scroller===window?window.scrollY:scroller.scrollTop)/600));[-180,-140,-40].forEach((distance,i)=>{leaves[i].style.translate=`0 ${distance*amount}px`;});};
      if(scroller!==window)scroller.addEventListener("scroll",sync,{passive:true});window.addEventListener("scroll",sync,{passive:true});window.addEventListener("resize",sync);sync();heroParallaxBound=true;
    }
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
    if (openInvitation) { openInvitation.setAttribute("aria-label", localCopy().openInvitation); text(openInvitation, localCopy().openInvitation); }
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
    const glassRows = root.querySelectorAll("[data-glass-program-row]");
    if (glassRows.length) {
      glassRows.forEach((row, index) => {
        const item = (data.program || [])[index];
        hide(row, !item);
        if (item) { text(row.querySelector("[data-glass-program-time]"), item.time); text(row.querySelector("[data-glass-program-title]"), item.title); }
      });
      hide(glassRows[0].closest("section"), !(data.program || []).length);
      return;
    }
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
    const section = root.querySelector("[data-chorlove-rsvp-section]");
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
    for (const button of section.querySelectorAll("button[data-chorlove-rsvp]")) {
      text(button, button.dataset.chorloveRsvp === "yes" ? localCopy().rsvpYes : localCopy().rsvpNo);
      button.setAttribute("aria-pressed", button.dataset.selected === "true" ? "true" : "false");
      button.onclick = () => {
        section.querySelectorAll("button[data-chorlove-rsvp]").forEach((candidate) => {
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
    sourceOpening(payload);
    animateSourceHero(Boolean(payload.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches);
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

  root.querySelectorAll("[data-chorlove-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.closest(".fixed") || button.parentElement?.parentElement;
      if (panel) panel.hidden = true;
      window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      const audio = root.querySelector("audio[data-chorlove-audio]");
      if (audio && state?.data.music?.url && !state.silentPlayback) audio.play().catch(() => {});
    });
  });

  const initial = (() => { try { return JSON.parse(window.name); } catch { return null; } })();
  restoreCapturedMotion();
  if (initial?.type === `${templateId}:update`) render(initial.payload);
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.data?.type !== `${templateId}:update`) return;
    render(event.data.payload);
  });
})();
