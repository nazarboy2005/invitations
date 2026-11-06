/* Contract/API boundary for the captured Eternal Rose Garden DOM and motion. */
(() => {
  "use strict";
  const ID = "wedivo-eternal-rose-garden";
  const $ = (id) => document.getElementById(id);
  const put = (id, value) => {
    const node = $(id); if (!node) return;
    const text = String(value ?? ""); const emphasis = node.matches(".sec-title") ? node.querySelector("em") : null;
    if (emphasis) { const words = text.split(" "); const first = words.shift() || ""; node.replaceChildren(document.createTextNode(first + " "), emphasis); emphasis.textContent = words.join(" "); }
    else node.textContent = text;
  };
  const hide = (id, hidden = true) => { if ($(id)) $(id).hidden = hidden; };
  const safe = (url) => /^(https?:\/\/|\/(?!\/))/.test(url || "") ? url : "";
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  let envelope, signature, started = false;
  // Columns follow the platform's four supported locales. These are presentation labels.
  const copy = {
    open: ["Taklifnomani ochish", "Таклифномани очиш", "Bloom the invitation", "Раскрыть приглашение"],
    hint: ["Yoki atirgul kurtagiga teging", "Ёки атиргул куртагига тегинг", "Or tap the rosebud", "Или коснитесь бутона"],
    welcome: ["Sizni kutamiz", "Сизни кутамиз", "You are invited", "Ждём вас"],
    coverNote: ["Siz uchun bitta kurtakni asradik. Uni ochish uchun sekin teging.", "Сиз учун битта куртакни асрадик. Уни очиш учун секин тегинг.", "We saved a rosebud for you. Tap gently to let it bloom.", "Мы сохранили для вас бутон. Коснитесь его, чтобы он расцвёл."],
    garden: ["Bog‘ga kirish", "Боғга кириш", "Enter the garden", "Войти в сад"],
    dew: ["Ilk shabnam", "Илк шабнам", "First dew", "Первая роса"],
    dewHint: ["Shabnam tomchilariga teging yoki biroz kuting.", "Шабнам томчиларига тегинг ёки бироз кутинг.", "Tap the dewdrops, or wait for them to fall.", "Коснитесь капель росы или подождите."],
    show: ["Barchasini ochish", "Барчасини очиш", "Reveal all", "Раскрыть всё"],
    couple: ["Ikki novda", "Икки новда", "Two stems", "Два стебля"],
    bride: ["Kelin", "Келин", "The bride", "Невеста"],
    groom: ["Kuyov", "Куёв", "The groom", "Жених"],
    story: ["Hikoyamiz", "Ҳикоямиз", "Our growing story", "Наша история"],
    storyLead: ["Har bir xotira yangi bir gul. Bog‘ bo‘ylab sekin sayr qiling.", "Ҳар бир хотира янги бир гул. Боғ бўйлаб секин сайр қилинг.", "Every memory is a new bloom. Wander slowly along our garden path.", "Каждое воспоминание — новый цветок. Пройдите по тропинке нашей истории."],
    graft: ["Ikki novda, bir ildiz", "Икки новда, бир илдиз", "Two stems, one root", "Два стебля, один корень"],
    graftLead: ["Ikki alohida novda birlashib, bir ildizdan o‘sadi. Atirgulimizni birga oching.", "Икки алоҳида новда бирлашиб, бир илдиздан ўсади. Атиргулимизни бирга очинг.", "Two separate stems join and grow from the same root. Let our rose bloom.", "Два стебля соединяются и растут из одного корня. Помогите нашей розе расцвести."],
    join: ["Birlashtirish", "Бирлаштириш", "Join the stems", "Соединить стебли"],
    reset: ["Yana ochish", "Яна очиш", "Bloom again", "Повторить"],
    joining: ["Novdalar birlashmoqda…", "Новдалар бирлашмоқда…", "Joining the stems…", "Соединяем стебли…"],
    approaching: ["Ikki novda yaqinlashmoqda…", "Икки новда яқинлашмоқда…", "The two stems draw closer…", "Два стебля сближаются…"],
    tied: ["Novdalar lenta bilan bog‘landi…", "Новдалар лента билан боғланди…", "The stems are tied together…", "Стебли связаны лентой…"],
    growing: ["Bir ildizdan o‘smoqda…", "Бир илдиздан ўсмоқда…", "Growing from one root…", "Растём из одного корня…"],
    blooming: ["Atirgul ochildi!", "Атиргул очилди!", "Our rose has bloomed!", "Наша роза расцвела!"],
    joined: ["Birlashdi ✓", "Бирлашди ✓", "Joined together ✓", "Соединены ✓"],
    certificate: ["Yangi atirgul", "Янги атиргул", "A new rose variety", "Новый сорт розы"],
    parents: ["Oilalar", "Оилалар", "Families", "Семьи"],
    registered: ["Sana", "Сана", "Registered", "Дата"],
    venue: ["Manzil", "Манзил", "Venue", "Место"],
    traits: ["Mehr bilan o‘stirilgan", "Меҳр билан ўстирилган", "Grown with love", "Выращено с любовью"],
    countdown: ["Quyosh soati", "Қуёш соати", "The sundial", "Солнечные часы"],
    remaining: ["Baxtli kunimizgacha", "Бахтли кунимизгача", "Until our celebration", "До нашего праздника"],
    now: ["Quyosh soati hozirgi vaqtni ko‘rsatadi", "Қуёш соати ҳозирги вақтни кўрсатади", "The shadow follows the time now", "Тень показывает текущее время"],
    days: ["Kun", "Кун", "Days", "Дней"], hours: ["Soat", "Соат", "Hours", "Часов"], mins: ["Daqiqa", "Дақиқа", "Minutes", "Минут"], secs: ["Soniya", "Сония", "Seconds", "Секунд"],
    date: ["Tadbir kuni", "Тадбир куни", "The day", "День праздника"],
    google: ["Google taqvimga saqlash", "Google тақвимга сақлаш", "Save to Google Calendar", "Добавить в Google Календарь"],
    ics: ["Taqvimga yuklash (.ics)", "Тақвимга юклаш (.ics)", "Download reminder (.ics)", "Скачать напоминание (.ics)"],
    events: ["Vaqt va joy", "Вақт ва жой", "Time and place", "Время и место"],
    eventLead: ["Gul barglari ochilganda tadbir tafsilotlarini ko‘rasiz.", "Гул барглари очилганда тадбир тафсилотларини кўрасиз.", "The petals open to reveal the details of our celebration.", "Лепестки раскроются и покажут подробности праздника."],
    directions: ["Yo‘l ko‘rsatish", "Йўл кўрсатиш", "Get directions", "Проложить маршрут"],
    program: ["Gullar soati", "Гуллар соати", "The flower clock", "Цветочные часы"],
    programLead: ["Har bir kurtak tadbirning yangi lahzasida ochiladi.", "Ҳар бир куртак тадбирнинг янги лаҳзасида очилади.", "Each bud blooms for a new moment of the celebration.", "Каждый бутон раскрывается для нового момента праздника."],
    scroll: ["Gullar soatini ko‘rish uchun pastga yuring", "Гуллар соатини кўриш учун пастга юринг", "Scroll to follow the flower clock", "Листайте, следуя за цветочными часами"],
    path: ["Bog‘ yo‘lagi", "Боғ йўлаги", "The garden path", "Садовая тропинка"],
    map: ["Bog‘ xaritasi", "Боғ харитаси", "Garden map", "Карта сада"], realMap: ["Xarita", "Харита", "Map", "Карта"],
    you: ["Siz shu yerdasiz", "Сиз шу ердасиз", "You are here", "Вы здесь"], fountain: ["Favvora", "Фаввора", "Fountain", "Фонтан"],
    copyAddress: ["Manzilni nusxalash", "Манзилни нусхалаш", "Copy address", "Скопировать адрес"],
    dress: ["Bog‘ ranglari", "Боғ ранглари", "The garden palette", "Палитра сада"],
    pick: ["Rang tanlash uchun atirgulga teging", "Ранг танлаш учун атиргулга тегинг", "Tap a rose to try its color", "Коснитесь розы, чтобы выбрать цвет"],
    roselang: ["Atirgullar tili", "Атиргуллар тили", "The language of roses", "Язык роз"],
    roseLead: ["Har bir rangning o‘z ma’nosi bor. Kurtaklarni birma-bir oching.", "Ҳар бир рангнинг ўз маъноси бор. Куртакларни бирма-бир очинг.", "Every color carries a meaning. Open each rosebud to discover it.", "У каждого цвета своё значение. Раскройте бутоны по очереди."],
    roseEmpty: ["Ma’nosini ko‘rish uchun atirgulni tanlang", "Маъносини кўриш учун атиргулни танланг", "Choose a rose to discover its meaning", "Выберите розу, чтобы узнать её значение"],
    roseDone: ["Turli ranglar, yagona guldasta", "Турли ранглар, ягона гулдаста", "Different colors, one bouquet", "Разные цвета, один букет"],
    roseNames: [["Qizil baxmal", "Қизил бахмал", "Velvet red", "Бархатный красный"], ["Pushti", "Пушти", "Blush", "Нежно-розовый"], ["Fil suyagi", "Фил суяги", "Ivory", "Слоновая кость"], ["Shaftoli", "Шафтоли", "Peach", "Персиковый"]],
    roseMeanings: [["Jasur muhabbat", "Жасур муҳаббат", "Courageous love", "Смелая любовь"], ["Minnatdorlik va mehr", "Миннатдорлик ва меҳр", "Gratitude and tenderness", "Благодарность и нежность"], ["Samimiy va’da", "Самимий ваъда", "A sincere promise", "Искреннее обещание"], ["Do‘stlik va iliqlik", "Дўстлик ва илиқлик", "Friendship and warmth", "Дружба и тепло"]],
    gallery: ["Xotira yaproqlari", "Хотира япроқлари", "Petals of memory", "Лепестки воспоминаний"],
    galleryLead: ["Yaqinroq ko‘rish uchun suratga teging", "Яқинроқ кўриш учун суратга тегинг", "Tap a photograph to look closer", "Коснитесь фотографии, чтобы рассмотреть её"],
    rsvp: ["Ishtirokingiz shamchasi", "Иштирокингиз шамчаси", "A candle for your presence", "Свеча вашего присутствия"],
    rsvpLead: ["Javobingizni bildiring, siz uchun bog‘da bir sham yoqamiz.", "Жавобингизни билдиринг, сиз учун боғда бир шам ёқамиз.", "Let us know if you can join us. We will light a candle for you.", "Сообщите, сможете ли вы прийти. Мы зажжём для вас свечу."],
    deadline: ["Javob berish muddati", "Жавоб бериш муддати", "Please reply by", "Ответьте до"],
    question: ["Tadbirga kelasizmi?", "Тадбирга келасизми?", "Will you join us?", "Вы придёте?"],
    name: ["Ismingiz", "Исмингиз", "Your name", "Ваше имя"], status: ["Javobingiz", "Жавобингиз", "Your answer", "Ваш ответ"],
    yes: ["Kelaman", "Келаман", "I will attend", "Приду"], maybe: ["Hali bilmayman", "Ҳали билмайман", "Maybe", "Пока не знаю"], no: ["Kela olmayman", "Кела олмайман", "I cannot attend", "Не смогу прийти"],
    message: ["Xabar (ixtiyoriy)", "Хабар (ихтиёрий)", "Message (optional)", "Сообщение (необязательно)"],
    send: ["Javobni yuborish", "Жавобни юбориш", "Send response", "Отправить ответ"],
    wishes: ["Tilaklar devori", "Тилаклар девори", "The wall of wishes", "Стена пожеланий"],
    wishesLead: ["Ezgu tilagingizni qoldiring. Har bir so‘zingiz biz uchun qadrli.", "Эзгу тилагингизни қолдиринг. Ҳар бир сўзингиз биз учун қадрли.", "Leave a wish on our rose wall. Every word means so much to us.", "Оставьте пожелание на нашей стене роз. Нам дорого каждое слово."],
    wishSend: ["Tilakni yuborish", "Тилакни юбориш", "Send your wish", "Отправить пожелание"],
    thanks: ["Katta rahmat", "Катта раҳмат", "Thank you", "Спасибо"],
    top: ["Tongga qaytish", "Тонгга қайтиш", "Back to dawn", "Вернуться к рассвету"],
    signature: ["— Atirgullar so‘lmaydigan bog‘dan —", "— Атиргуллар сўлмайдиган боғдан —", "— From the garden where roses never fade —", "— Из сада, где розы никогда не вянут —"],
    fail: ["Yuborilmadi. Qayta urinib ko‘ring.", "Юборилмади. Қайта уриниб кўринг.", "Could not send. Please try again.", "Не удалось отправить. Попробуйте ещё раз."],
    sent: ["Javobingiz saqlandi. Rahmat!", "Жавобингиз сақланди. Раҳмат!", "Your response was saved. Thank you!", "Ваш ответ сохранён. Спасибо!"],
    moderation: ["Tilagingiz yuborildi va tasdiqlangandan keyin ko‘rinadi.", "Тилагингиз юборилди ва тасдиқлангандан кейин кўринади.", "Your wish was sent and will appear after approval.", "Пожелание отправлено и появится после одобрения."],
    preview: ["Ko‘rish rejimida yuborish o‘chirilgan", "Кўриш режимида юбориш ўчирилган", "Sending is disabled in preview", "Отправка в режиме просмотра отключена"],
    close: ["Yopish", "Ёпиш", "Close", "Закрыть"], previous: ["Oldingi surat", "Олдинги сурат", "Previous photo", "Предыдущее фото"], next: ["Keyingi surat", "Кейинги сурат", "Next photo", "Следующее фото"],
    language: ["Taklifnoma tili", "Таклифнома тили", "Invitation language", "Язык приглашения"],
    music: ["Musiqani ijro etish yoki to‘xtatish", "Мусиқани ижро этиш ёки тўхтатиш", "Play or pause music", "Включить или выключить музыку"],
    copied: ["Nusxalandi", "Нусхаланди", "Copied", "Скопировано"],
    copyError: ["Nusxalab bo‘lmadi. Qo‘lda nusxalang.", "Нусхалаб бўлмади. Қўлда нусхаланг.", "Could not copy. Please copy manually.", "Не удалось скопировать. Скопируйте вручную."],
    downloading: ["Taqvim eslatmasi yuklanmoqda", "Тақвим эслатмаси юкланмоқда", "Downloading calendar reminder", "Напоминание скачивается"],
    required: ["Majburiy maydonlarni to‘ldiring", "Мажбурий майдонларни тўлдиринг", "Please complete the required fields", "Заполните обязательные поля"],
  };
  function t(key) { return copy[key]?.[Math.max(0, locales.indexOf(envelope.locale))] ?? key; }
  function translate(raw) {
    if (["Udah disalin!", "Alamatnya udah disalin ✿", "Alamat kirim kado udah disalin ✿"].includes(raw)) return t("copied");
    if (raw === "Gagal nyalin, salin manual ya.") return t("copyError");
    if (raw === "Pengingatnya lagi diunduh ✿") return t("downloading");
    const state = { "Lagi diokulasi…":"joining", "Dua tangkai didekatkan pelan-pelan…":"approaching", "Diikat pakai pita okulasi…":"tied", "Tumbuh dari satu akar…":"growing", "Mekar! Varietas baru lahir hari ini.":"blooming", "Udah jadi satu ✓":"joined" };
    if (state[raw]) return t(state[raw]);
    if (raw === "Besok: ") return ["Ertaga: ", "Эртага: ", "Tomorrow: ", "Завтра: "][Math.max(0,locales.indexOf(envelope.locale))];
    if (["Subuh", "Menjelang Siang", "Jam Emas", "Lilin Pertama"].includes(raw)) return translate({Subuh:"Fajar", "Menjelang Siang":"Siang", "Jam Emas":"Sore", "Lilin Pertama":"Malam"}[raw]);
    if (raw.startsWith("Hari ini tamannya mekar!") || raw.startsWith("Makasih udah ikut merayakan")) return t("thanks");
    const keys = { "Fajar": "dew", "Udah disalin!": "copyAddress", "Gagal nyalin, salin manual ya.": "fail", "Pilihanmu:": "pick", "Pilih jawabanmu — nanti lilinnya ikut ngerespons.": "question", "Tutup": "close", "Peta": "map", "Pengingatnya lagi diunduh ✿": "ics", "Alamatnya udah disalin ✿": "copyAddress", "Ikat Jadi Satu": "join", "Dua tangkai, masih sendiri-sendiri.": "graft", "Buka foto ": "gallery", "Kenalan lebih dekat": "couple", "Tutup lagi": "close", "Mekar! Varietas baru lahir hari ini.": "graft", "Udah jadi satu ✓": "graft", "Lagi diokulasi…": "graft", "Dua tangkai didekatkan pelan-pelan…": "graft", "Diikat pakai pita okulasi…": "graft", "Tumbuh dari satu akar…": "graft" };
    if (keys[raw]) return t(keys[raw]);
    const index = Math.max(0, locales.indexOf(envelope.locale));
    const phrases = {
      "Pagi": ["Ertalab", "Эрталаб", "Morning", "Утро"], "Siang": ["Kunduz", "Кундуз", "Day", "День"], "Sore": ["Kechga yaqin", "Кечга яқин", "Afternoon", "После полудня"], "Senja": ["Shom", "Шом", "Dusk", "Сумерки"], "Malam": ["Tun", "Тун", "Night", "Ночь"],
      "Mawar ": ["Atirgul ", "Атиргул ", "Rose ", "Роза "], "Kelopak ": ["Surat ", "Сурат ", "Photo ", "Фото "], " dari ": [" / ", " / ", " / ", " / "],
      "Satu lilin": ["Bir sham", "Бир шам", "One candle", "Одна свеча"], " kami nyalakan buat kamu": [" siz uchun yonadi", " сиз учун ёнади", " is lit for you", " горит для вас"],
      "Lilinnya kami nyalakan kecil dulu, ya — sambil nunggu kabar baik dari kamu.": ["Javobingizni kutamiz", "Жавобингизни кутамиз", "We look forward to your answer", "Будем ждать вашего ответа"],
      "Nggak apa-apa banget. Asapnya kami titipin doa, semoga kita ketemu di lain waktu.": ["Yana uchrashguncha", "Яна учрашгунча", "We hope to see you another time", "Надеемся встретиться в другой раз"],
      " doa udah tumbuh di dinding ini": [" ta tilak", " та тилак", " wishes on the wall", " пожеланий на стене"], " doa — jadi yang pertama gantung doa di sini, yuk": [" ta tilak", " та тилак", " wishes — leave the first one", " пожеланий — оставьте первое"],
    };
    return phrases[raw]?.[index] ?? "";
  }
  function applyData() {
    const d = envelope.data;
    window.roseData = d;
    window.roseLocale = envelope.locale === "uz-Cyrl" ? "uz-Cyrl-UZ" : envelope.locale === "uz-Latn" ? "uz-Latn-UZ" : envelope.locale;
    window.rosePreview = envelope.preview;
    window.roseReducedMotion = envelope.reducedMotion;
    window.roseTranslate = translate;
    window.roseSectionNames = Object.fromEntries(Object.entries({ hero:"dew", greeting:"welcome", couple:"couple", story:"story", graft:"graft", countdown:"countdown", events:"events", rundown:"program", location:"venue", dresscode:"dress", "rose-language":"roselang", gallery:"gallery", rsvp:"rsvp", wishes:"wishes", closing:"thanks" }).map(([key,value]) => [key,t(value)]));
    const musicKey = `${ID}:music:${envelope.invitationId}:${envelope.preview}`;
    try { window.roseMusicWanted = sessionStorage.getItem(musicKey) !== "paused"; } catch { window.roseMusicWanted = true; }
    window.roseSetMusicWanted = (wanted) => { try { sessionStorage.setItem(musicKey, wanted ? "playing" : "paused"); } catch { /* Storage is optional. */ } };
    document.documentElement.lang = envelope.locale;
    document.documentElement.classList.toggle("rose-reduced-motion", envelope.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches);
    document.documentElement.classList.toggle("rose-no-date", !d.dateTime);
    document.title = d.title || [d.bride, d.groom].filter(Boolean).join(" & ");
    const labels = {
      "cover-open-text": "open", "cover-hint": "hint", "cover-note": "coverNote", "guest-greeting-label": "welcome", "guest-generic-label": "welcome", "guest-generic-name": "welcome", "hero-kicker": "welcome", "hero-mono-sub": "graft", "hero-bloom-hint": "hint", "hero-time-lbl": "date", "hero-cta-text": "garden",
      "greeting-kicker": "welcome", "greeting-title": "dew", "greeting-lead": "dewHint", "dew-hint": "dewHint", "dew-skip": "show", "couple-kicker": "couple", "couple-title": "couple", "pc-role-b": "bride", "pc-role-g": "groom", "story-kicker": "story", "story-title": "story", "story-lead": "storyLead",
      "graft-kicker": "graft", "graft-title": "graft", "graft-lead": "graftLead", "graft-btn-text": "join", "graft-reset": "reset", "graft-status": "graft", "cert-kicker": "certificate", "cert-dt-1": "parents", "cert-dt-2": "registered", "cert-dt-3": "venue", "cert-traits-lbl": "traits", "cert-seal-text": "registered",
      "countdown-kicker": "countdown", "countdown-title": "countdown", "countdown-lead": "remaining", "sundial-cap": "now", "cd-l-days": "days", "cd-l-hours": "hours", "cd-l-mins": "mins", "cd-l-secs": "secs", "cd-date-lbl": "date", "cal-google-text": "google", "cal-ics-text": "ics",
      "events-kicker": "events", "events-title": "events", "events-lead": "eventLead", "ev-1-kicker": "date", "ev-1-lbl": "date", "ev-1-map": "directions", "rundown-kicker": "program", "rundown-lead": "programLead", "rd-clock-title": "scroll", "location-kicker": "venue", "location-title": "path", "location-lead": "directions", "loc-tab-art": "map", "loc-tab-real": "realMap", "gm-l-you": "you", "gm-l-venue": "venue", "gm-l-fountain": "fountain", "loc-kicker": "venue", "loc-dir": "directions", "loc-copy": "copyAddress",
      "dresscode-kicker": "dress", "dresscode-title": "dress", "dc-picked-lbl": "pick", "roselang-kicker": "roselang", "roselang-title": "roselang", "roselang-lead": "roseLead", "rl-tap-hint": "roseLead", "rl-dict-kicker": "roselang", "rl-empty": "roseEmpty", "rl-done": "roseDone", "gallery-kicker": "gallery", "gallery-title": "gallery", "gallery-lead": "galleryLead",
      "rsvp-kicker": "rsvp", "rsvp-title": "rsvp", "rsvp-lead": "rsvpLead", "rsvp-dl-lbl": "deadline", "candle-caption": "question", "rsvp-form-kicker": "question", "rsvp-lbl-name": "name", "rsvp-lbl-status": "status", "rsvp-yes-t": "yes", "rsvp-maybe-t": "maybe", "rsvp-no-t": "no", "rsvp-lbl-msg": "message", "rsvp-submit": "send", "wishes-kicker": "wishes", "wishes-title": "wishes", "wishes-lead": "wishesLead", "wish-form-kicker": "wishes", "wish-lbl-name": "name", "wish-lbl-msg": "wishes", "wish-submit": "wishSend",
      "close-thanks-lbl": "thanks", "close-thanks-generic": "thanks", "close-fam-lbl": "parents", "close-top-t": "top", "close-sign": "signature", "nav-sheet-title": "map", "nav-sheet-sub": "garden", "nav-expand-t": "map",
    };
    Object.entries(labels).forEach(([id, key]) => put(id, t(key)));
    ["hero", "greeting", "couple", "story", "graft", "countdown", "events", "rundown", "location", "dresscode", "rose-language", "gallery", "rsvp", "wishes", "closing"].forEach((name, i) => put(`nl-${name}`, t(["dew", "welcome", "couple", "story", "graft", "countdown", "events", "program", "venue", "dress", "roselang", "gallery", "rsvp", "wishes", "thanks"][i])));
    ["cover", "hero", "close"].forEach((prefix) => { put(`${prefix}-name-b`, d.bride); put(`${prefix}-name-g`, d.groom); });
    ["pc-name-b", "scion-b-name", "cert-par-b"].forEach((id) => put(id, d.bride));
    ["pc-name-g", "scion-g-name", "cert-par-g"].forEach((id) => put(id, d.groom));
    put("cover-kicker-text", d.eventType); put("hero-tagline", d.message);
    put("guest-greeting-name", envelope.guestName); put("guest-generic-name", d.greeting || t("welcome")); put("close-guest", envelope.guestName);
    put("dew-greet", d.greeting); put("dew-text", d.message); put("dew-quote", d.hosts); put("dew-cite", t("parents")); hide("dew-line-3", !d.hosts); hide("dew-3", !d.hosts);
    put("close-msg", d.message); put("close-fam", d.hosts); put("pc-par-b", d.hosts); hide("pc-parents-g");
    put("cert-name", [d.bride, d.groom].filter(Boolean).join(" & ")); put("cert-dd-3", d.venue.name);
    put("cert-traits-src", t("traits")); put("hero-time-tz", d.timezone);
    put("hero-time-venue", d.venue.name); put("ev-1-name", d.eventType); put("ev-1-venue", d.venue.name); put("ev-1-addr", d.venue.address); put("ev-1-tz", d.timezone);
    put("loc-name", d.venue.name); put("loc-addr", d.venue.address); hide("loc-note");
    ["pc-order-b", "pc-order-g", "pc-trait-b", "pc-trait-g", "pc-bio-b", "pc-bio-g", "pc-ig-b", "pc-ig-g", "close-hashtag", "sec-video", "ev-live", "ev-2", "ev-1-note", "sec-gift", "nav-gift", "nav-video", "rsvp-checkin", "wish-chips", "wish-more"].forEach((id) => hide(id));
    // No photo from the provider's example invitation becomes a design fallback.
    const photos = d.gallery.filter((photo) => safe(photo.src));
    window.roseData = { ...d, gallery: photos };
    function photo(id, index) { const node = $(id); if (node && photos[index]) { node.src = safe(photos[index].src); node.alt = photos[index].alt || ""; } }
    photo("hero-photo", 0); photo("pc-photo-b", 0); photo("pc-photo-g", 1);
    // Preserve every authored chapter and its stable ID; clone only the source's own markup.
    const storyTemplate = $("ch-1").cloneNode(true);
    for (let i = 4; i < d.story.length; i++) {
      const clone = storyTemplate.cloneNode(true);
      [clone, ...clone.querySelectorAll("[id]")].forEach((node) => { node.id = node.id.replace("ch-1", `ch-${i + 1}`); });
      $("ch-4").parentNode.append(clone);
    }
    for (let i = 0; i < Math.max(4, d.story.length); i++) {
      const chapter = d.story[i]; const n = i + 1;
      $("ch-" + n).dataset.itemId = chapter?.id || "";
      put(`ch-${n}-title`, chapter?.title); put(`ch-${n}-text`, chapter?.text); put(`ch-${n}-date`, "");
      photo(`ch-${n}-img`, i); hide(`ch-${n}`, !chapter);
    }
    hide("sec-story", !d.story.length); hide("nav-story", !d.story.length);
    const palette = d.dressCode?.enabled ? d.dressCode.colors : [];
    const swatchTemplate = $("dc-sw-1").cloneNode(true);
    $("dc-swatches").replaceChildren();
    palette.forEach((color, i) => {
      const swatch = swatchTemplate.cloneNode(true);
      swatch.id = `dc-sw-${i + 1}`; swatch.dataset.color = color.hex; swatch.dataset.itemId = color.id;
      swatch.querySelectorAll("[id]").forEach((node) => { node.id = node.id.replace("dc-sw-1", `dc-sw-${i + 1}`); });
      swatch.querySelector(".dc-sw-name").textContent = color.name;
      $("dc-swatches").append(swatch);
    });
    put("dresscode-lead", [d.dressCode?.style, d.dressCode?.text, d.dressCode?.note].filter(Boolean).join("\n"));
    hide("sec-dresscode", !d.dressCode?.enabled); hide("nav-dresscode", !d.dressCode?.enabled);
    for (let i = 1; i <= 4; i++) { put(`rl-name-${i}-t`, copy.roseNames[i - 1][locales.indexOf(envelope.locale)]); put(`rl-meaning-${i}`, copy.roseMeanings[i - 1][locales.indexOf(envelope.locale)]); put(`rl-story-${i}`, ""); }
    // The source count contains surrounding text nodes; replace only its presentation text.
    [...$("rl-count").childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => { node.textContent = " / "; });
    hide("sec-gallery", !photos.length); hide("nav-gallery", !photos.length);
    hide("sec-location", !(d.venue.name || d.venue.address || d.mapQuery)); hide("nav-location", $("sec-location").hidden);
    hide("sec-countdown", !d.dateTime); hide("nav-countdown", !d.dateTime); hide("sec-events", !d.dateTime); hide("nav-events", !d.dateTime);
    put("rundown-title", d.programHeading); hide("sec-rundown", !d.program.length); hide("nav-rundown", !d.program.length);
    const rundown = document.createElement("script"); rundown.type = "application/json"; rundown.id = "wedivo-rundown-data";
    rundown.textContent = JSON.stringify(d.program.map((entry) => ({ id: entry.id, title: entry.title, description: entry.description, date: "", startTime: entry.time, icon: "flower2" })));
    document.body.append(rundown);
    $("rsvp-pax").closest(".field")?.remove();
    // Some source revisions use a different field wrapper. Remove the label and input too.
    $("rsvp-pax")?.remove(); $("rsvp-lbl-pax")?.remove();
    hide("sec-rsvp", !envelope.rsvpEnabled); hide("nav-rsvp", !envelope.rsvpEnabled);
    hide("sec-wishes", !envelope.wishesEnabled); hide("nav-wishes", !envelope.wishesEnabled);
    $("rsvp-name").value = envelope.guestName; $("wish-name").value = envelope.guestName;
    $("rsvp-dl-val").dataset.date = envelope.rsvpDeadline || "";
    $("bg-music").removeAttribute("src");
    if (d.music?.enabled && safe(d.music.url)) $("bg-music").src = safe(d.music.url);
    ["rsvp-name", "wish-name"].forEach((id) => { $(id).placeholder = t("name"); });
    $("rsvp-msg").placeholder = t("message"); $("wish-msg").placeholder = t("wishesLead");
    ["rsvp-err", "wish-err", "rsvp-ok", "wish-ok"].forEach((id) => { put(id, ""); $(id).setAttribute("role", "status"); });
    ["rsvp-form", "wish-form"].forEach((id) => { $(id).noValidate = true; if (envelope.preview) $(id).title = t("preview"); });
    $("loc-iframe").title = t("realMap");
    [["lb-close", "close"], ["lb-prev", "previous"], ["lb-next", "next"], ["music-toggle", "music"], ["garden-nav", "map"], ["sec-cover", "open"], ["dew-1", "show"], ["dew-2", "show"], ["dew-3", "show"], ["pc-portrait-b", "bride"], ["pc-portrait-g", "groom"], ["hero-bloom-wrap", "garden"], ["cover-bloom-wrap", "open"], ["graft-stage", "graft"], ["nav-expand", "map"]].forEach(([id, label]) => $(id)?.setAttribute("aria-label", t(label)));
    // Optional contacts reuse the source's existing person contact links.
    d.contacts?.slice(0, 2).forEach((contact, i) => { const id = i ? "pc-ig-g" : "pc-ig-b"; const link = $(id); link.hidden = false; link.href = safe(contact.href) || (/^tel:/.test(contact.href) ? contact.href : ""); put(`${id}-handle`, contact.value); [...link.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => { node.textContent = ""; }); });
  }
  function feedback(form, message, ok) {
    const id = form.id === "rsvp-form" ? "rsvp" : "wish";
    put(`${id}-err`, ok ? "" : message); put(`${id}-ok`, ok ? message : "");
    $(`${id}-err`).style.display = ok ? "none" : "block";
    $(`${id}-ok`).style.display = ok ? "block" : "none";
  }
  function renderWishes(wishes) {
    const list = $("wish-list"); list.replaceChildren();
    wishes.forEach((wish) => {
      const card = $("wish-template").content.firstElementChild.cloneNode(true);
      card.querySelector('[data-field="name"]').textContent = wish.name;
      card.querySelector('[data-field="message"]').textContent = wish.message ?? wish.text ?? "";
      card.querySelector('[data-field="date"]').textContent = wish.submittedAt ? new Date(wish.submittedAt).toLocaleDateString(window.roseLocale) : "";
      list.append(card);
    });
  }
  async function loadWishes() {
    if (!envelope.wishesEnabled) return;
    if (envelope.preview) { renderWishes(envelope.data.wishes || []); return; }
    try { const response = await fetch(`/api/public/invitations/${encodeURIComponent(envelope.invitationId)}/wishes`, { credentials: "same-origin" }); if (response.ok) renderWishes((await response.json()).wishes || []); }
    catch { /* Keep an empty list when the real service cannot be reached. */ }
  }
  function bindServices() {
    document.querySelectorAll("#rsvp-status [data-wedivo-status]").forEach((button) => button.addEventListener("click", () => {
      document.querySelectorAll("#rsvp-status [data-wedivo-status]").forEach((node) => { const selected = node === button; node.classList.toggle("is-selected", selected); node.setAttribute("aria-pressed", String(selected)); });
    }));
    for (const id of ["rsvp-form", "wish-form"]) $(id).addEventListener("submit", async (event) => {
      event.preventDefault(); const form = event.currentTarget;
      if (envelope.preview) { feedback(form, t("preview"), false); return; }
      const isRsvp = id === "rsvp-form";
      const name = $(isRsvp ? "rsvp-name" : "wish-name").value.trim();
      const statuses = { attending: "yes", not_attending: "no", maybe: "maybe" };
      const status = statuses[document.querySelector("#rsvp-status .is-selected")?.dataset.wedivoStatus];
      const message = $(isRsvp ? "rsvp-msg" : "wish-msg").value.trim();
      if (!name || (isRsvp ? !status : !message)) { feedback(form, t("required"), false); return; }
      const button = form.querySelector('[type="submit"]'); button.disabled = true;
      try {
        const response = await fetch(`/api/public/invitations/${encodeURIComponent(envelope.invitationId)}/${isRsvp ? "rsvp" : "wishes"}`, {
          method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, ...(isRsvp ? { status, partySize: status === "yes" ? 1 : 0, note: message } : { message }), ...(envelope.guestToken ? { guestToken: envelope.guestToken } : {}) }),
        });
        if (!response.ok) throw new Error("service");
        feedback(form, t(isRsvp ? "sent" : "moderation"), true);
        if (!isRsvp) $("wish-msg").value = "";
      } catch { feedback(form, t("fail"), false); }
      finally { button.disabled = false; }
    });
  }
  function accept(payload) {
    const next = JSON.stringify(payload);
    if (started) {
      if (next !== signature) { window.name = JSON.stringify({ type: `${ID}:update`, payload }); location.reload(); }
      return;
    }
    started = true; signature = next; envelope = payload;
    applyData(); bindServices();
    const script = document.createElement("script"); script.src = "source/template.js";
    script.onload = () => { document.documentElement.classList.add("rose-ready"); void loadWishes(); };
    document.body.append(script);
    // Locale comes from existing platform/route controls; the captured design has
    // no language switcher, so no source-absent control is injected into it.
  }
  addEventListener("message", (event) => { if (event.source === parent && event.origin === location.origin && event.data?.type === `${ID}:update` && event.data.payload) accept(event.data.payload); });
  try { const stored = JSON.parse(window.name); if (stored.type === `${ID}:update`) accept(stored.payload); } catch { /* The host sends the authenticated contract after iframe load. */ }
})();
