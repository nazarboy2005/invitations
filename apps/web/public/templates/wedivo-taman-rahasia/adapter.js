/* Contract/API bridge. All garden artwork and interaction code is in source/. */
(() => {
  "use strict";
  const ID = "wedivo-taman-rahasia";
  const $ = (id) => document.getElementById(id);
  const put = (id, value) => { if ($(id)) $(id).textContent = value ?? ""; };
  const show = (id, visible) => { if ($(id)) $(id).hidden = !visible; };
  const safeUrl = (value) => {
    if (!value) return "";
    try { const url = new URL(value, location.origin); return /^https?:$/.test(url.protocol) ? url.href : ""; } catch { return ""; }
  };
  const dictionaries = {
    "uz-Latn": {
      open: "Bog‘ darvozasini ochish", hint: "Kirish uchun kalitni bosing", welcome: "Bog‘imizga xush kelibsiz", prologue: "Muqaddima", chapter: "Bob", epilogue: "Xotima",
      opening: "Darvoza ostonasida", couple: "Ikki nihol", story: "Hikoyamiz fasllari", events: "Gulzor soyasida", rundown: "Gullar soati", venue: "Bog‘ sari yo‘l", dress: "Bog‘ ranglari", gallery: "Xotiralar issiqxonasi", secret: "Moxli tosh ostida", rsvp: "Mehmonlar lavhasi", wishes: "Tilaklar daraxti", closing: "Bog‘dagi oqshom",
      count: "Gullash fasligacha", countDone: "Bayram kuni yetib keldi", days: "Kun", hours: "Soat", minutes: "Daqiqa", seconds: "Soniya", explore: "Bog‘ yo‘lidan yuramiz",
      coupleLead: "Har bir bog‘ niholdan boshlanadi. Urug‘ qopchalarini bosib, ularning orqa tomonini ko‘ring.", storyLead: "Urug‘, nihol, g‘uncha va gul — har faslning o‘z hikoyasi bor.", eventsLead: "Gullar soyasida baxtli kunimizni birga nishonlaymiz.", rundownLead: "Gullar soati kunimiz dasturini ko‘rsatadi. Vaqtni tanlang.", venueLead: "Manzilimizni topish uchun xaritadagi yo‘ldan boring.", galleryLead: "Xotiralarimiz shisha ortida. Yaqinlashganda shudring tarqaladi — suratni ochish uchun bosing.", secretLead: "Har bir sirli bog‘da nimadir yashiringan. Moxli toshni ko‘tarib ko‘ring.", wishesLead: "Daraxtimizga ezgu niyat va tilaklaringizni qoldiring.",
      seed: "Urug‘", sprout: "Nihol", bud: "G‘uncha", bloom: "Gul", bride: "Kelin", groom: "Kuyov", variety: "Noyob nav", turn: "Qopchani aylantirish", turnBack: "Orqaga aylantirish", care: "Parvarish yo‘riqnomasi", plant: "Eking", tend: "Asrang", light: "Yorug‘lik", full: "Quyoshli", water: "Sug‘orish", daily: "Har kuni", forever: "Abadiy", warm: "Iliq", laughter: "Kulgi bilan",
      event: "Tadbir", calendar: "Taqvimga saqlash", directions: "Yo‘lni ko‘rsatish", photo: "Surat", prev: "Oldingi surat", next: "Keyingi surat", close: "Yopish", lift: "Ko‘taring", liftHint: "Toshni bosing yoki yuqoriga suring.", letterTo: "Bu maktubni topgan aziz mehmonimizga,", secretFound: "Tosh ostidagi maktubni topdingiz!", allFound: "Barcha boblarni topdingiz. Bog‘imizga tashrifingiz uchun rahmat!", allDay: "Kun davomida", now: "Hozir",
      name: "Ismingiz", attendance: "Kelishingiz", yes: "Kelaman", no: "Kela olmayman", maybe: "Hali bilmayman", message: "Xabaringiz", send: "Yuborish", edit: "Javobni o‘zgartirish", reply: "Bayramimizda biz bilan bo‘lasizmi?", sent: "Javobingiz saqlandi. Rahmat!", pending: "Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.", fail: "Yuborilmadi. Qayta urinib ko‘ring.", preview: "Ko‘rish rejimida yuborish o‘chirilgan.", invalid: "Ismingizni kiriting va javobni tanlang.", wishInvalid: "Ismingiz va tilagingizni kiriting.", deadline: "Javob berish muddati", withLove: "Hurmat bilan", bye: "Bog‘imizda ko‘rishguncha.", top: "Darvozaga qaytish", play: "Musiqani yoqish", pause: "Musiqani to‘xtatish",
    },
    "uz-Cyrl": {
      open: "Боғ дарвозасини очиш", hint: "Кириш учун калитни босинг", welcome: "Боғимизга хуш келибсиз", prologue: "Муқаддима", chapter: "Боб", epilogue: "Хотима",
      opening: "Дарвоза остонасида", couple: "Икки ниҳол", story: "Ҳикоямиз фасллари", events: "Гулзор соясида", rundown: "Гуллар соати", venue: "Боғ сари йўл", dress: "Боғ ранглари", gallery: "Хотиралар иссиқхонаси", secret: "Мохли тош остида", rsvp: "Меҳмонлар лавҳаси", wishes: "Тилаклар дарахти", closing: "Боғдаги оқшом",
      count: "Гуллаш фаслигача", countDone: "Байрам куни етиб келди", days: "Кун", hours: "Соат", minutes: "Дақиқа", seconds: "Сония", explore: "Боғ йўлидан юрамиз",
      coupleLead: "Ҳар бир боғ ниҳолдан бошланади. Уруғ қопчаларини босиб, уларнинг орқа томонини кўринг.", storyLead: "Уруғ, ниҳол, ғунча ва гул — ҳар фаслнинг ўз ҳикояси бор.", eventsLead: "Гуллар соясида бахтли кунимизни бирга нишонлаймиз.", rundownLead: "Гуллар соати кунимиз дастурини кўрсатади. Вақтни танланг.", venueLead: "Манзилимизни топиш учун харитадаги йўлдан боринг.", galleryLead: "Хотираларимиз шиша ортида. Яқинлашганда шудринг тарқалади — суратни очиш учун босинг.", secretLead: "Ҳар бир сирли боғда нимадир яширинган. Мохли тошни кўтариб кўринг.", wishesLead: "Дарахтимизга эзгу ният ва тилакларингизни қолдиринг.",
      seed: "Уруғ", sprout: "Ниҳол", bud: "Ғунча", bloom: "Гул", bride: "Келин", groom: "Куёв", variety: "Ноёб нав", turn: "Қопчани айлантириш", turnBack: "Орқага айлантириш", care: "Парвариш йўриқномаси", plant: "Экинг", tend: "Асранг", light: "Ёруғлик", full: "Қуёшли", water: "Суғориш", daily: "Ҳар куни", forever: "Абадий", warm: "Илиқ", laughter: "Кулги билан",
      event: "Тадбир", calendar: "Тақвимга сақлаш", directions: "Йўлни кўрсатиш", photo: "Сурат", prev: "Олдинги сурат", next: "Кейинги сурат", close: "Ёпиш", lift: "Кўтаринг", liftHint: "Тошни босинг ёки юқорига суринг.", letterTo: "Бу мактубни топган азиз меҳмонимизга,", secretFound: "Тош остидаги мактубни топдингиз!", allFound: "Барча бобларни топдингиз. Боғимизга ташрифингиз учун раҳмат!", allDay: "Кун давомида", now: "Ҳозир",
      name: "Исмингиз", attendance: "Келишингиз", yes: "Келаман", no: "Кела олмайман", maybe: "Ҳали билмайман", message: "Хабарингиз", send: "Юбориш", edit: "Жавобни ўзгартириш", reply: "Байрамимизда биз билан бўласизми?", sent: "Жавобингиз сақланди. Раҳмат!", pending: "Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.", fail: "Юборилмади. Қайта уриниб кўринг.", preview: "Кўриш режимида юбориш ўчирилган.", invalid: "Исмингизни киритинг ва жавобни танланг.", wishInvalid: "Исмингиз ва тилагингизни киритинг.", deadline: "Жавоб бериш муддати", withLove: "Ҳурмат билан", bye: "Боғимизда кўришгунча.", top: "Дарвозага қайтиш", play: "Мусиқани ёқиш", pause: "Мусиқани тўхтатиш",
    },
    en: {
      open: "Open the garden gate", hint: "Tap the key to enter", welcome: "Welcome to our garden", prologue: "Prologue", chapter: "Chapter", epilogue: "Epilogue",
      opening: "A word at the threshold", couple: "Two seeds", story: "Our seasons", events: "Under the pergola", rundown: "The flower clock", venue: "The path to the garden", dress: "The garden palette", gallery: "The glasshouse of memories", secret: "Beneath the mossy stone", rsvp: "The guest board", wishes: "The wishing tree", closing: "Dusk in the garden",
      count: "Until our season blooms", countDone: "Our celebration has arrived", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds", explore: "Follow the garden path",
      coupleLead: "Every garden begins with a seed. Tap the seed packets to turn them over.", storyLead: "From seed to sprout, bud to bloom — each season leaves its trace. Follow the vine.", eventsLead: "Beneath the flower-covered pergola, we celebrate our happy day together.", rundownLead: "The flower clock follows the rhythm of our day. Choose a time to explore.", venueLead: "Follow the path on the map to find our garden.", galleryLead: "Seasons we have kept behind glass. The dew clears as you approach — tap to look closer.", secretLead: "Every secret garden has something hidden. Try lifting this mossy stone.", wishesLead: "Leave your hopes and wishes on the branches of our tree.",
      seed: "Seed", sprout: "Sprout", bud: "Bud", bloom: "Gullar bayrami", bride: "Bride", groom: "Groom", variety: "Rare variety", turn: "Turn the packet", turnBack: "Turn back", care: "Care instructions", plant: "Plant", tend: "Tend", light: "Light", full: "Full sun", water: "Water", daily: "Daily", forever: "Always", warm: "Warm", laughter: "With laughter",
      event: "Celebration", calendar: "Save the date", directions: "Directions", photo: "Photo", prev: "Previous photo", next: "Next photo", close: "Close", lift: "Lift", liftHint: "Tap the stone, or slide it upward.", letterTo: "To our guest who found this letter,", secretFound: "You found the letter beneath the stone!", allFound: "You found every chapter. Thank you for exploring our garden!", allDay: "All day", now: "Now",
      name: "Your name", attendance: "Attendance", yes: "I will attend", no: "I cannot attend", maybe: "Not sure yet", message: "Your message", send: "Send", edit: "Edit response", reply: "Will you join us in our garden?", sent: "Your response was saved. Thank you!", pending: "Your wish was sent. It will appear after the invitation owner approves it.", fail: "Could not send. Please try again.", preview: "Sending is disabled in preview.", invalid: "Enter your name and choose your attendance.", wishInvalid: "Enter your name and wish.", deadline: "Please reply by", withLove: "With love", bye: "See you in our garden.", top: "Back to the gate", play: "Play music", pause: "Pause music",
    },
    ru: {
      open: "Открыть садовые ворота", hint: "Нажмите на ключ, чтобы войти", welcome: "Добро пожаловать в наш сад", prologue: "Пролог", chapter: "Глава", epilogue: "Эпилог",
      opening: "Несколько слов на пороге", couple: "Два семечка", story: "Времена нашей истории", events: "Под перголой", rundown: "Цветочные часы", venue: "Дорога в сад", dress: "Палитра сада", gallery: "Оранжерея воспоминаний", secret: "Под мшистым камнем", rsvp: "Доска гостей", wishes: "Дерево пожеланий", closing: "Сумерки в саду",
      count: "До поры цветения", countDone: "День нашего праздника настал", days: "Дней", hours: "Часов", minutes: "Минут", seconds: "Секунд", explore: "Пройти по садовой дорожке",
      coupleLead: "Каждый сад начинается с семечка. Нажмите на пакетики, чтобы перевернуть их.", storyLead: "От семечка к ростку, от бутона к цветку — каждый сезон оставляет след. Следуйте за лозой.", eventsLead: "Под цветущей перголой мы вместе отметим наш счастливый день.", rundownLead: "Цветочные часы показывают программу дня. Выберите время.", venueLead: "Следуйте по маршруту на карте, чтобы найти наш сад.", galleryLead: "Наши воспоминания за стеклом. Роса исчезнет, когда вы приблизитесь — нажмите, чтобы рассмотреть фото.", secretLead: "В каждом тайном саду что-то спрятано. Попробуйте поднять мшистый камень.", wishesLead: "Оставьте добрые слова и пожелания на ветвях нашего дерева.",
      seed: "Семечко", sprout: "Росток", bud: "Бутон", bloom: "Цветок", bride: "Невеста", groom: "Жених", variety: "Редкий сорт", turn: "Перевернуть пакетик", turnBack: "Перевернуть обратно", care: "Советы по уходу", plant: "Посадить", tend: "Заботиться", light: "Свет", full: "Солнце", water: "Полив", daily: "Ежедневно", forever: "Всегда", warm: "Тёплый", laughter: "Со смехом",
      event: "Праздник", calendar: "Сохранить дату", directions: "Маршрут", photo: "Фото", prev: "Предыдущее фото", next: "Следующее фото", close: "Закрыть", lift: "Поднять", liftHint: "Нажмите на камень или потяните вверх.", letterTo: "Нашему гостю, нашедшему это письмо,", secretFound: "Вы нашли письмо под камнем!", allFound: "Вы нашли все главы. Спасибо за прогулку по нашему саду!", allDay: "Весь день", now: "Сейчас",
      name: "Ваше имя", attendance: "Присутствие", yes: "Приду", no: "Не смогу прийти", maybe: "Пока не знаю", message: "Ваше сообщение", send: "Отправить", edit: "Изменить ответ", reply: "Вы присоединитесь к нам в саду?", sent: "Ответ сохранён. Спасибо!", pending: "Пожелание отправлено и появится после одобрения владельцем приглашения.", fail: "Не удалось отправить. Попробуйте ещё раз.", preview: "Отправка в режиме просмотра отключена.", invalid: "Введите имя и выберите ответ.", wishInvalid: "Введите имя и пожелание.", deadline: "Просим ответить до", withLove: "С любовью", bye: "До встречи в нашем саду.", top: "Вернуться к воротам", play: "Включить музыку", pause: "Приостановить музыку",
    },
  };
  let current, fingerprint, initialized = false, words;
  const feedback = (form, text) => {
    let node = form.querySelector(".taman-feedback") || form.querySelector('[id$="-err"]');
    if (!node) { node = document.createElement("p"); node.className = "taman-feedback"; node.setAttribute("role", "status"); form.append(node); }
    node.classList.add('taman-feedback'); node.setAttribute('role','status'); node.style.display = 'block';
    node.textContent = text;
  };
  const section = (name, visible) => { show(`sec-${name}`, visible); show(`stone-${name}`, visible); };
  function translate(t, data) {
    const copy = {
      "cover-eyebrow": data.eventType, "cover-to": data.greeting, "cover-guest-name": current.guestName || data.greeting,
      "cover-hint-text": t.hint, "key-tag-text": {'uz-Latn':'Oching','uz-Cyrl':'Очинг',en:'Open',ru:'Открыть'}[current.locale] || 'Oching', "hero-welcome": t.welcome, "hero-plaque-k": t.prologue,
      "hero-count-label": t.count, "hero-count-done": t.countDone, "cd-days-l": t.days, "cd-hours-l": t.hours, "cd-mins-l": t.minutes, "cd-secs-l": t.seconds, "hero-cue-text": t.explore,
      "quote-title": t.opening, "couple-title": t.couple, "story-title": t.story, "events-title": t.events, "rundown-title": data.programHeading || t.rundown,
      "venue-title": t.venue, "dress-title": data.dressCode?.style || t.dress, "gallery-title": t.gallery, "secret-title": t.secret, "rsvp-title": t.rsvp, "wishes-title": t.wishes, "closing-title": t.closing,
      "couple-lead": t.coupleLead, "story-lead": t.storyLead, "events-lead": t.eventsLead, "rundown-lead": t.rundownLead, "venue-lead": t.venueLead, "gallery-lead": t.galleryLead, "secret-lead": t.secretLead, "wishes-lead": t.wishesLead,
      "secret-letter-to": t.letterTo, "secret-letter-sign": [t.withLove, data.groom, data.bride].filter(Boolean).join(" · "), "secret-stone-hint": t.lift, "secret-hint": t.liftHint,
      "rsvp-name-label": t.name, "rsvp-status-label": t.attendance, "rsvp-yes-t": t.yes, "rsvp-no-t": t.no, "rsvp-maybe-t": t.maybe, "rsvp-message-label": t.message, "rsvp-submit": t.send, "rsvp-edit": t.edit, "rsvp-ok-t": t.sent, "rsvp-err": t.invalid, "rsvp-greet-generic": t.reply,
      "wish-name-label": t.name, "wish-message-label": t.message, "wish-submit": t.send, "wish-ok": t.pending, "wish-err": t.wishInvalid, "closing-sign": data.hosts || t.withLove, "closing-bye": t.bye, "closing-plaque-k": t.epilogue,
    };
    Object.entries(copy).forEach(([id, text]) => put(id, text));
    const sections = { hero: t.prologue, quote: t.opening, couple: t.couple, story: t.story, events: t.events, rundown: t.rundown, venue: t.venue, dresscode: t.dress, gallery: t.gallery, secret: t.secret, rsvp: t.rsvp, wishes: t.wishes, closing: t.epilogue };
    Object.entries(sections).forEach(([id, text]) => put(`stone-${id}-label`, text));
    document.querySelectorAll(".plaque-k").forEach((node) => { if (!['hero-plaque-k','closing-plaque-k'].includes(node.id)) node.textContent = t.chapter; });
    document.querySelectorAll('input[name=name]').forEach((node) => { node.placeholder = t.name; node.maxLength = 100; });
    document.querySelectorAll('textarea[name=message]').forEach((node) => { node.placeholder = t.message; node.maxLength = 1000; });
    for (const role of ["bride", "groom"]) {
      put(`packet-${role}-no`, `${t.seed} ${role === "bride" ? '01' : '02'}`);
      put(`packet-${role}-kind`, t.variety); put(`packet-${role}-role`, t[role]);
      put(`packet-${role}-hint`, t.turn); put(`packet-${role}-hint-back`, t.turnBack);
      put(`packet-${role}-back-title`, t.care); put(`packet-${role}-back-sub`, data[role]);
      for (let i = 1; i <= 3; i++) put(`pd-${role}-${i}-t`, [t.plant,t.tend,t.bloom][i-1]);
      const prefix = role === "bride" ? 'pbm' : 'pgm';
      for (let i = 1; i <= 3; i++) { put(`${prefix}-${i}-k`, [t.light,t.water,t.bloom][i-1]); put(`${prefix}-${i}-v`, [t.full,t.daily,t.forever][i-1]); }
      $(`packet-${role}`).setAttribute("aria-label", `${t.turn}: ${data[role]}`);
    }
    for (const [id, label] of Object.entries({ 'gate-open':t.open, 'viewer-prev':t.prev, 'viewer-next':t.next, 'viewer-close':t.close, viewer:t.gallery, 'secret-stone':t.lift, 'garden-path':t.explore, 'sec-cover':t.open })) $(id)?.setAttribute('aria-label', label);
    const foundSuffix = {'uz-Latn':' bob topildi', 'uz-Cyrl':' боб топилди', en:' chapters discovered', ru:' глав найдено'};
    $('path-count').lastChild.textContent = foundSuffix[current.locale] || foundSuffix['uz-Latn'];
    $('closing-top').lastChild.textContent = t.top;
    show('cover-guest-generic', false); show('cover-to', Boolean(current.guestName)); show('rsvp-greet', false);
    put('rsvp-guest-name', current.guestName); put('rsvp-note', current.deadline ? `${t.deadline}: ${new Date(current.deadline + 'T12:00:00').toLocaleDateString(current.locale)}` : '');
    show('rsvp-note', Boolean(current.deadline));
  }
  function bind(data) {
    document.documentElement.lang = current.locale;
    document.title = data.title || [data.groom,data.bride].filter(Boolean).join(' & ');
    document.documentElement.classList.toggle('taman-reduced', Boolean(current.reducedMotion));
    translate(words, data);
    for (const role of ["bride", "groom"]) {
      ['cover','hero','closing'].forEach((id) => put(`${id}-${role}`, data[role]));
      put(`packet-${role}-name`, data[role]); put(`packet-${role}-parents-names`, data.hosts);
      put(`packet-${role}-back-name`, data[role]);
      show(`packet-${role}-parents`, Boolean(data.hosts));
      show(`${role}-care-list`, false); show(`${role}-care-src`, false);
    }
    put('quote-opening', data.message); section('quote', Boolean(data.message)); show('quote-tablet', false);
    put('secret-letter-text', data.message); section('secret', Boolean(data.message)); show('secret-polaroid', false);
    put('closing-msg', ''); show('closing-msg', false); show('closing-hashtag', false);
    // This source has an amount-based gift form, stream URL, care anecdotes and
    // personal flower meanings. The shared contract has no matching fields.
    section('gifts', false); section('live', false); section('flowers', false);
    const stories = data.story || [];
    const template = $('story-1').cloneNode(true);
    document.querySelectorAll('.story-card').forEach((node) => node.remove());
    stories.forEach((story, index) => {
      const card = template.cloneNode(true), n = index + 1;
      [card, ...card.querySelectorAll('[id]')].forEach((node) => { node.id = node.id.replace('story-1', `story-${n}`); });
      card.dataset.itemId = story.id;
      card.querySelector('.story-title').textContent = story.title;
      card.querySelector('.story-text').textContent = story.text;
      card.querySelector('.story-date').textContent = '';
      card.querySelector('.story-figure').hidden = true;
      $('story-track').append(card);
    });
    section('story', Boolean(stories.length));
    const day = data.date?.year ? `${data.date.year}-${String(data.date.monthNumber).padStart(2,'0')}-${String(data.date.day).padStart(2,'0')}` : '';
    const attrs = { date:day, time:data.date?.time || '', end:'', e2date:'', e2time:'', e2end:'', tz:data.timezone || '', place:'' };
    Object.entries(attrs).forEach(([key,value]) => $('data-src').setAttribute(`data-${key}`, value));
    put('event-1-name', data.eventType); put('event-2-name', '');
    put('event-1-kicker', words.event); put('event-1-venue', data.venue?.name); put('event-1-address', data.venue?.address);
    put('map-venue', data.venue?.name); put('map-address', data.venue?.address);
    const rundown = document.createElement('script'); rundown.type = 'application/json'; rundown.id = 'wedivo-rundown-data';
    rundown.textContent = JSON.stringify((data.program || []).map((item) => ({ id:item.id, title:item.title, description:item.description, startTime:item.time, date:day })));
    document.body.append(rundown);
    section('venue', Boolean(data.venue?.name || data.venue?.address));
    const dc = data.dressCode || {};
    put('dress-text', [dc.text,dc.note].filter(Boolean).join('\n'));
    section('dresscode', Boolean(dc.enabled));
    for (let i = 1; i <= 5; i++) { const color = dc.colors?.[i-1]; const node = $(`swatch-${i}`); if (node) { node.hidden = !color; node.dataset.color = color?.hex || ''; node.setAttribute('aria-label', color?.name || color?.hex || ''); } }
    section('rsvp', Boolean(data.rsvp?.enabled)); section('wishes', Boolean(data.wishesEnabled));
    ['rsvp-name','wish-name'].forEach((id) => { $(id).value = current.guestName || ''; });
    renderWishes(current.preview ? data.wishes || [] : []);
  }
  function renderWishes(items) {
    $('wish-list').replaceChildren();
    const template = document.querySelector('template[data-wedivo=comment-template]');
    for (const item of items) {
      const card = template.content.firstElementChild.cloneNode(true);
      card.querySelector('[data-field=name]').textContent = item.name || '';
      card.querySelector('[data-field=message]').textContent = item.message || item.text || '';
      $('wish-list').append(card);
    }
  }
  function setupMusic() {
    const audio = $('bg-music'), button = $('music-btn');
    let userPaused = Boolean(current.view?.userPaused), played = false;
    const url = !current.silentPlayback && current.data.music?.enabled ? safeUrl(current.data.music.url) : '';
    if (url) audio.src = url;
    show('music-btn', Boolean(url));
    const update = () => { button.classList.toggle('is-playing', !audio.paused); button.setAttribute('aria-pressed', String(!audio.paused)); button.setAttribute('aria-label', audio.paused ? words.play : words.pause); };
    const play = () => { if (!url || userPaused) return; void audio.play().then(() => { played = true; update(); }).catch(update); };
    button.addEventListener('click', () => {
      if (audio.paused) { userPaused = false; play(); } else { userPaused = true; audio.pause(); }
      update();
    });
    audio.addEventListener('play', update); audio.addEventListener('pause', update);
    document.addEventListener('pointerdown', (event) => { if (!played && !userPaused && !button.contains(event.target)) play(); }, {capture:true});
    window.TAMAN.playMusic = play;
    window.TAMAN.musicPaused = () => userPaused;
    update(); if (!current.preview) play();
  }
  async function loadWishes() {
    if (current.preview || !current.data.wishesEnabled || !current.invitationId) return;
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/wishes`, {credentials:'same-origin'});
      if (!response.ok) throw new Error();
      renderWishes((await response.json()).wishes || []);
    } catch { feedback($('wish-form'), words.fail); }
  }
  function afterEngine() {
    const compass = {'uz-Latn':['Sh','J','Shq','G‘'], 'uz-Cyrl':['Ш','Ж','Шқ','Ғ'], en:['N','S','E','W'], ru:['С','Ю','В','З']};
    document.querySelectorAll('.compass-l').forEach((node,index) => { node.textContent = (compass[current.locale] || compass['uz-Latn'])[index]; });
    put('hero-date-text', current.data.date?.long); put('event-1-date', current.data.date?.long); put('event-1-time', current.data.date?.time);
    const venue = current.data.venue || {};
    const destination = venue.lat != null && venue.lng != null ? `${venue.lat},${venue.lng}` : [venue.name,venue.address].filter(Boolean).join(', ');
    const map = safeUrl(venue.mapUrl) || (destination ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}` : '');
    ['event-1-map','map-btn'].forEach((id) => { put(id, words.directions); show(id, Boolean(map)); if (map) $(id).href = map; });
    const embed = $('map-embed');
    if (destination) { embed.src = `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`; embed.title = venue.name || words.venue; $('map-frame').classList.remove('no-embed'); }
    const start = new Date(current.data.dateTime);
    const stamp = (date) => date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    put('event-1-cal', words.calendar);
    if (!isNaN(start.getTime())) {
      const params = new URLSearchParams({action:'TEMPLATE',text:document.title,dates:`${stamp(start)}/${stamp(new Date(+start+7200000))}`,ctz:current.data.timezone,location:[venue.name,venue.address].filter(Boolean).join(', ')});
      $('event-1-cal').href = `https://calendar.google.com/calendar/render?${params}`;
    } else show('event-1-cal', false);
    document.querySelectorAll('.rd-item').forEach((node,index) => { node.dataset.itemId = current.data.program[index]?.id || ''; });
    document.querySelectorAll('.pane').forEach((node,index) => { node.dataset.itemId = current.data.gallery[index]?.id || ''; });
    $('viewer').addEventListener('keydown', (event) => {
      if (event.key !== 'Tab' || !$('viewer').classList.contains('is-open')) return;
      const controls = [$('viewer-prev'),$('viewer-next'),$('viewer-close')];
      const first = controls[0], last = controls[controls.length-1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    // Localized labels replace source-generated Indonesian labels.
    document.querySelectorAll('.swatch').forEach((node,index) => { if (current.data.dressCode?.colors[index]) node.setAttribute('aria-label', current.data.dressCode.colors[index].name || current.data.dressCode.colors[index].hex); });
    document.documentElement.classList.add('data-ready');
    if (current.view?.open) { $('gate-open').click(); setTimeout(() => scrollTo(0,current.view.scroll || 0), current.reducedMotion ? 50 : 2800); }
    document.querySelectorAll('#rsvp-form button, #rsvp-form input, #rsvp-form textarea, #wish-form button, #wish-form input, #wish-form textarea').forEach((node) => { node.disabled = Boolean(current.preview); });
    if (current.preview) { feedback($('rsvp-form'), words.preview); feedback($('wish-form'), words.preview); }
    void loadWishes();
    window.dispatchEvent(new Event('resize'));
  }
  const saveEnvelope = (envelope) => {
    const view = { open:document.body.classList.contains('is-open'), scroll:scrollY, userPaused:window.TAMAN?.musicPaused?.() || false };
    window.name = JSON.stringify({ type:`${ID}:update`, payload:{...envelope,view} });
    location.reload();
  };
  function accept(message) {
    if (message?.type !== `${ID}:update` || !message.payload?.data) return;
    const serialized = JSON.stringify({...message.payload,view:undefined});
    if (serialized === fingerprint) return;
    if (initialized) { saveEnvelope(message.payload); return; }
    initialized = true; fingerprint = serialized; current = message.payload;
    current.reducedMotion = Boolean(current.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches);
    current.data.gallery = (current.data.gallery || []).filter((item) => safeUrl(item.src)).map((item) => ({...item,src:safeUrl(item.src)}));
    words = dictionaries[current.locale] || dictionaries['uz-Latn'];
    window.TAMAN = {...current,words};
    bind(current.data); setupMusic();
    const nav = document.createElement('nav'); nav.id = 'taman-languages'; nav.setAttribute('aria-label', {'uz-Latn':'Til', 'uz-Cyrl':'Тил', en:'Language',ru:'Язык'}[current.locale] || 'Til');
    const labels = {'uz-Latn':'Uz','uz-Cyrl':'Уз',en:'En',ru:'Ru'};
    (current.enabledLocales || [current.locale]).forEach((locale) => {
      if (!current.variants?.[locale]) return;
      const button = document.createElement('button'); button.type = 'button'; button.textContent = labels[locale]; button.lang = locale; button.setAttribute('aria-pressed', String(locale === current.locale));
      button.addEventListener('click', () => { if (locale !== current.locale) saveEnvelope({...current,locale,data:current.variants[locale]}); }); nav.append(button);
    });
    if (nav.children.length > 1) document.body.append(nav);
    const script = document.createElement('script'); script.src = 'source/template.js'; script.onload = afterEngine; document.body.append(script);
  }
  addEventListener('message', (event) => { if (event.source === parent && event.origin === location.origin) accept(event.data); });
  try { accept(JSON.parse(window.name)); } catch { /* Host posts the typed envelope after load. */ }
  document.querySelectorAll('[data-wedivo-status]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-wedivo-status]').forEach((node) => { const selected = node === button; node.classList.toggle('is-selected', selected); node.setAttribute('aria-pressed', String(selected)); });
  }));
  async function submit(form, kind) {
    if (!current || current.preview) { feedback(form, words?.preview || 'Preview'); return; }
    const values = new FormData(form);
    const name = String(values.get('name') || '').trim(), message = String(values.get('message') || '').trim();
    const statusMap = {attending:'yes',not_attending:'no',maybe:'maybe'};
    const status = statusMap[form.querySelector('[data-wedivo-status].is-selected')?.dataset.wedivoStatus];
    if (!name || (kind === 'rsvp' ? !status : !message)) { feedback(form, kind === 'rsvp' ? words.invalid : words.wishInvalid); return; }
    const priorFeedback = form.querySelector('.taman-feedback');
    if (priorFeedback) { priorFeedback.textContent = ''; priorFeedback.style.display = 'none'; }
    const button = form.querySelector('[type=submit]'); button.disabled = true; form.setAttribute('aria-busy','true');
    try {
      const body = kind === 'rsvp' ? {name,status,partySize:status === 'yes' ? 1 : 0,note:message} : {name,message};
      if (current.guestToken) body.guestToken = current.guestToken;
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/${kind}`, {method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      if (!response.ok) throw new Error();
      if (kind === 'rsvp') { form.classList.add('is-submitted'); put('rsvp-ok-t', words.sent); }
      else { $('wish-message').value = ''; put('wish-ok', words.pending); form.classList.add('is-submitted'); }
    } catch { feedback(form, words.fail); }
    finally { button.disabled = false; form.removeAttribute('aria-busy'); }
  }
  $('rsvp-form').addEventListener('submit', (event) => { event.preventDefault(); void submit(event.currentTarget,'rsvp'); });
  $('wish-form').addEventListener('submit', (event) => { event.preventDefault(); void submit(event.currentTarget,'wishes'); });
  $('gift-form').addEventListener('submit', (event) => event.preventDefault());
})();
