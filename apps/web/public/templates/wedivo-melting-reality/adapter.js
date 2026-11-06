/* Shared-contract bridge. The template's DOM, artwork, shaders and interaction engine are isolated. */
(() => {
  "use strict";
  const ID = "wedivo-melting-reality", ROOT = `/templates/${ID}/`;
  const $ = (id) => document.getElementById(id);
  const put = (id, value) => { const e = $(id); if (e) e.textContent = value ?? ""; };
  const visible = (id, yes) => { const e = $(id); if (e) e.hidden = !yes; };
  // Columns: Uzbek Latin, Uzbek Cyrillic, English, Russian. Creator prose is never translated here.
  const rows = {
    open: ["Tushga kirish", "Тушга кириш", "Enter the dream", "Войти в сон"],
    hint: ["Bosing va tush boshlansin", "Босинг ва туш бошлансин", "Tap and let the dream unfold", "Нажмите, и сон начнётся"],
    invitation: ["Taklifnoma", "Таклифнома", "Invitation", "Приглашение"],
    dream: ["Tush", "Туш", "Dream", "Сон"], real: ["Haqiqat", "Ҳақиқат", "Reality", "Явь"],
    welcome: ["Xush kelibsiz", "Хуш келибсиз", "Welcome", "Добро пожаловать"],
    couple: ["Biz", "Биз", "The couple", "Мы"], story: ["Hikoyamiz", "Ҳикоямиз", "Our story", "Наша история"],
    program: ["Dastur", "Дастур", "Programme", "Программа"], venue: ["Manzil", "Манзил", "Venue", "Место"],
    dress: ["Kiyim uslubi", "Кийим услуби", "Dress code", "Дресс-код"], gallery: ["Lahzalar", "Лаҳзалар", "Memories", "Мгновения"],
    rsvp: ["Kelasizmi?", "Келасизми?", "Will you join us?", "Вы придёте?"], wishes: ["Tilaklar", "Тилаклар", "Wishes", "Пожелания"],
    thanks: ["Rahmat", "Раҳмат", "Thank you", "Спасибо"],
    interpretation: ["Tush ta’biri", "Туш таъбири", "Dream interpretations", "Толкование снов"],
    tests: ["Haqiqat sinovi", "Ҳақиқат синови", "Reality checks", "Проверка реальности"],
    countdown: ["Uchrashuvgacha", "Учрашувгача", "Counting down", "До встречи"],
    layer: ["Qatlam", "Қатлам", "Layer", "Слой"],
    groom: ["Kuyov", "Куёв", "Groom", "Жених"], bride: ["Kelin", "Келин", "Bride", "Невеста"],
    hosts: ["Hurmat bilan", "Ҳурмат билан", "With love from", "С уважением"],
    pinch: ["Chimchilash", "Чимчилаш", "Pinch", "Ущипнуть"],
    pinchHint: ["Suratni uyg‘otish uchun bosing", "Суратни уйғотиш учун босинг", "Pinch each portrait to wake it", "Разбудите каждый портрет касанием"],
    days: ["Kun", "Кун", "Days", "Дней"], hours: ["Soat", "Соат", "Hours", "Часов"], minutes: ["Daqiqa", "Дақиқа", "Minutes", "Минут"], seconds: ["Soniya", "Сония", "Seconds", "Секунд"],
    calendar: ["Google taqvimga saqlash", "Google тақвимга сақлаш", "Save to Google Calendar", "В Google Календарь"],
    ics: ["Taqvimni yuklash (.ics)", "Тақвимни юклаш (.ics)", "Download calendar (.ics)", "Скачать календарь (.ics)"],
    directions: ["Yo‘l ko‘rsatish", "Йўл кўрсатиш", "Directions", "Маршрут"],
    copyAddress: ["Manzilni nusxalash", "Манзилни нусхалаш", "Copy address", "Скопировать адрес"],
    door: ["Eshikni oching", "Эшикни очинг", "Knock and open the door", "Постучите и откройте дверь"],
    close: ["Yopish", "Ёпиш", "Close", "Закрыть"],
    select: ["Rangni tanlang", "Рангни танланг", "Choose a paint colour", "Выберите цвет краски"],
    name: ["Ismingiz", "Исмингиз", "Your name", "Ваше имя"], message: ["Xabar", "Хабар", "Message", "Сообщение"],
    yes: ["Kelaman", "Келаман", "I will attend", "Приду"], no: ["Kela olmayman", "Кела олмайман", "I cannot attend", "Не смогу прийти"], maybe: ["Hali aniq emas", "Ҳали аниқ эмас", "Not sure yet", "Пока не знаю"],
    send: ["Yuborish", "Юбориш", "Send", "Отправить"],
    sent: ["Javobingiz saqlandi. Rahmat!", "Жавобингиз сақланди. Раҳмат!", "Your response was saved. Thank you!", "Ваш ответ сохранён. Спасибо!"],
    moderated: ["Tilagingiz tekshirish uchun yuborildi.", "Тилагингиз текшириш учун юборилди.", "Your wish was sent for moderation.", "Пожелание отправлено на модерацию."],
    fail: ["Yuborilmadi. Qayta urinib ko‘ring.", "Юборилмади. Қайта уриниб кўринг.", "Could not send. Please try again.", "Не удалось отправить. Попробуйте ещё раз."],
    preview: ["Ko‘rish rejimida yuborib bo‘lmaydi.", "Кўриш режимида юбориб бўлмайди.", "Sending is disabled in preview.", "Отправка в режиме просмотра отключена."],
    chooseStatus: ["Kelishingizni belgilang.", "Келишингизни белгиланг.", "Choose your attendance.", "Укажите, сможете ли вы прийти."],
    more: ["Yana tilaklar", "Яна тилаклар", "More wishes", "Ещё пожелания"],
    previous: ["Oldingi", "Олдинги", "Previous", "Назад"], next: ["Keyingi", "Кейинги", "Next", "Далее"],
    again: ["Tushni qayta boshlash", "Тушни қайта бошлаш", "Dream again from the start", "Начать сон сначала"],
    music: ["Musiqani yoqish / o‘chirish", "Мусиқани ёқиш / ўчириш", "Play / pause music", "Включить / выключить музыку"],
    map: ["Tush qatlamlari xaritasi", "Туш қатламлари харитаси", "Map of the dream", "Карта сна"],
    scroll: ["Asta pastga tushing: tush haqiqatga aylanadi", "Аста пастга тушинг: туш ҳақиқатга айланади", "Scroll slowly: the dream becomes reality", "Листайте медленно: сон становится явью"],
    coverNote: ["Soatga qarang. Atrof eriy boshlasa, tushga kirgan bo‘lasiz.", "Соатга қаранг. Атроф эрий бошласа, тушга кирган бўласиз.", "Watch the clock. When the world begins to melt, your dream has opened.", "Смотрите на часы. Когда мир начнёт таять, ваш сон откроется."],
    signature: ["Dunyo erisin, biz esa haqiqatmiz", "Дунё эрисин, биз эса ҳақиқатмиз", "The world may melt; we remain real", "Пусть мир тает — мы остаёмся настоящими"],
    interpret: ["Ta’birlash", "Таъбирлаш", "Interpret", "Растолковать"], melt: ["Yana eritish", "Яна эритиш", "Melt again", "Растопить снова"],
    clockDream: ["Daraxtda eriyotgan soat", "Дарахтда эриётган соат", "A clock melting on a branch", "Часы тают на ветке"],
    clockMeaning: ["Yaqin inson bilan vaqt tez o‘tadi. Bir umrga davom etsin.", "Яқин инсон билан вақт тез ўтади. Бир умрга давом этсин.", "Time with the right person always feels too short. Let it last a lifetime.", "С близким человеком времени всегда мало. Пусть это длится всю жизнь."],
    stairsDream: ["Osmonda suzayotgan zinapoya", "Осмонда сузаётган зинапоя", "A staircase floating in the sky", "Лестница парит в небе"],
    stairsMeaning: ["Uzoq yo‘l oxirida birgalikdagi hayot boshlanadi.", "Узоқ йўл охирида биргаликдаги ҳаёт бошланади.", "At the end of a long winding path, a life together begins.", "В конце долгого пути начинается совместная жизнь."],
    doorDream: ["Cho‘ldagi yolg‘iz eshik", "Чўлдаги ёлғиз эшик", "A lone door in the desert", "Одинокая дверь в пустыне"],
    doorMeaning: ["Uy har doim bino emas, ba’zan u yaqin inson.", "Уй ҳар доим бино эмас, баъзан у яқин инсон.", "Home is sometimes a person, rather than a place.", "Иногда дом — это близкий человек."],
    fishDream: ["Osmonda suzayotgan baliq", "Осмонда сузаётган балиқ", "A fish swimming through the sky", "Рыба плывёт по небу"],
    fishMeaning: ["Imkonsiz tuyulgan orzu ham amalga oshadi.", "Имконсиз туюлган орзу ҳам амалга ошади.", "Even a dream that seems impossible can become real.", "Даже невозможная мечта может стать реальностью."],
    checkClock: ["Soatga ikki marta qarang", "Соатга икки марта қаранг", "Look at the clock twice", "Посмотрите на часы дважды"],
    checkRead: ["Matnni ikki marta o‘qing", "Матнни икки марта ўқинг", "Read the words twice", "Прочитайте текст дважды"],
    checkPinch: ["Qo‘lingizni chimchilang", "Қўлингизни чимчиланг", "Pinch your hand", "Ущипните себя за руку"],
    checkJump: ["Bir marta sakrang", "Бир марта сакранг", "Try a little jump", "Попробуйте подпрыгнуть"],
    jump: ["Sakrash", "Сакраш", "Jump", "Прыгнуть"],
    checkHint: ["Bu tushmi yoki haqiqat? To‘rtta sinovni bajaring.", "Бу тушми ёки ҳақиқат? Тўртта синовни бажаринг.", "Is it a dream or reality? Try each of the four checks.", "Сон или явь? Пройдите четыре проверки."],
    same: ["O‘zgarmadi — demak, haqiqat!", "Ўзгармади — демак, ҳақиқат!", "Still the same — it must be real!", "Не изменилось — значит, это явь!"],
    floating: ["Hali havodasiz. Yana urinib ko‘ring.", "Ҳали ҳаводасиз. Яна уриниб кўринг.", "Still floating. Try once more.", "Вы ещё парите. Попробуйте снова."],
    wait: ["Javobingizni kutamiz", "Жавобингизни кутамиз", "We look forward to your reply", "Ждём вашего ответа"],
    today: ["Kutilgan kun keldi!", "Кутилган кун келди!", "The day has arrived!", "Этот день настал!"],
    copied: ["Nusxalandi", "Нусхаланди", "Copied", "Скопировано"],
    photo: ["Surat", "Сурат", "Photo", "Фото"],
  };
  let state, dictionary, initialized = false, lastPayload = "", status = "", allWishes=[],wishLimit=10;
  const t = (key) => dictionary[key] || "";
  const safeUrl = (value) => typeof value === "string" && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) ? value : "";
  function heading(id, value) {
    const e = $(id); if (!e) return;
    const child = e.querySelector("em");
    // Preserve source heading spans and selectors while localizing their text.
    [...e.childNodes].filter((n) => n.nodeType === 3).forEach((n) => n.remove());
    if (child) child.textContent = value; else e.textContent = value;
  }
  function cloneStory(source,index) {
    const clone=source.cloneNode(true), renamed=new Map();
    [clone,...clone.querySelectorAll("[id]")].forEach((e)=>{const id=e.id;if(!id)return;const replacement=id.startsWith("story-1")?id.replace(/^story-1/,`story-${index}`):`${id}-chapter-${index}`;renamed.set(id,replacement);e.id=replacement;});
    [clone,...clone.querySelectorAll("*")].forEach((e)=>{for(const attr of [...e.attributes]){let value=attr.value;for(const [oldId,newId] of renamed){value=value.replaceAll(`url(#${oldId})`,`url(#${newId})`);if(value===`#${oldId}`)value=`#${newId}`;}if(value!==attr.value)e.setAttribute(attr.name,value);}});
    return clone;
  }
  function renderWishes(wishes,limit=10) {
    allWishes=wishes;wishLimit=limit;
    const list = $("wish-list"); list.replaceChildren();
    for (const wish of wishes.slice(0,limit)) {
      const card = $("wish-template").content.firstElementChild.cloneNode(true);
      card.querySelector('[data-field="name"]').textContent = wish.name || "";
      card.querySelector('[data-field="message"]').textContent = wish.message || wish.text || "";
      const submitted=wish.submittedAt?new Date(wish.submittedAt):null;
      card.querySelector('[data-field="date"]').textContent = submitted&&Number.isFinite(submitted.getTime())?submitted.toLocaleDateString(({"uz-Latn":"uz-UZ","uz-Cyrl":"uz-Cyrl-UZ",en:"en-GB",ru:"ru-RU"})[state.locale]):"";
      if(wish.id)card.dataset.wishId=wish.id;
      list.append(card);
    }
    visible("wish-more",wishes.length>limit);
    $("wish-more").onclick=()=>renderWishes(allWishes,wishLimit+10);
  }
  function apply(payload) {
    state = payload;
    const d = payload.data, locale = payload.locale || "uz-Latn";
    const col = ["uz-Latn", "uz-Cyrl", "en", "ru"].indexOf(locale);
    dictionary = Object.fromEntries(Object.entries(rows).map(([key, values]) => [key, values[Math.max(0, col)]]));
    document.documentElement.lang = locale;
    document.title = [d.groom, d.bride].filter(Boolean).join(" & ") || "Tush va haqiqat";
    const bindings = {
      "cover-open":"open", "cover-hint":"hint", "cover-kicker":"invitation", "cover-note":"coverNote",
      "hero-window-cap":"signature", "hero-kicker":"invitation", "hero-cue-text":"scroll", "salam-kname":"welcome", "salam-sign-lbl":"hosts",
      "couple-kname":"couple", "couple-sub":"pinchHint", "couple-both":"real",
      "story-kname":"story", "tafsir-kname":"interpretation", "tafsir-title":"interpretation", "tafsir-intro":"hint",
      "cd-kname":"countdown", "cd-l-d":"days", "cd-l-h":"hours", "cd-l-m":"minutes", "cd-l-s":"seconds", "cd-done":"today", "cd-note":"signature", "cd-gcal":"calendar", "cd-ics":"ics",
      "ev-kname":"program", "ev-1-label":"invitation", "rd-kname":"program", "rc-kname":"tests", "rc-sub":"checkHint", "rc-meter-lbl":"tests", "rc-stamp":"real",
      "rc-clock-q":"checkClock", "rc-clock-btn":"checkClock", "rc-clock-r2":"same", "rc-read-q":"checkRead", "rc-read-btn":"checkRead", "rc-read-r2":"same",
      "rc-pinch-q":"checkPinch", "rc-pinch-btn":"pinch", "rc-pinch-r2":"real", "rc-jump-q":"checkJump", "rc-jump-btn":"jump", "rc-jump-note":"floating", "rc-jump-r2":"real",
      "venue-kname":"venue", "door-plate":"door", "door-close":"close", "venue-label":"venue", "venue-dir":"directions", "ev-1-map":"directions", "venue-copy":"copyAddress",
      "dc-kname":"dress", "dc-picked":"select", "gal-kname":"gallery", "gal-note":"signature",
      "rsvp-kname":"rsvp", "rsvp-intro":"wait", "gasing-caption":"wait", "rsvp-name-lbl":"name", "rsvp-status-lbl":"rsvp", "rsvp-yes":"yes", "rsvp-no":"no", "rsvp-maybe":"maybe", "rsvp-msg-lbl":"message", "rsvp-submit":"send", "rsvp-thanks":"sent", "rsvp-error":"chooseStatus",
      "wish-kname":"wishes", "wish-intro":"wait", "wish-name-lbl":"name", "wish-msg-lbl":"wishes", "wish-submit":"send", "wish-more":"more", "wish-count-t":"wishes",
      "closing-kicker":"thanks", "closing-lead":"signature", "closing-ring-cap":"signature", "closing-guest-generic":"thanks", "closing-again":"again", "closing-sig":"signature",
      "nav-sheet-kicker":"scroll", "nav-sheet-title":"map", "nav-meter-l":"dream", "nav-meter-r":"real", "viewer-prev-t":"previous", "viewer-next-t":"next",
    };
    for (const [id,key] of Object.entries(bindings)) put(id,t(key));
    const heads = { "salam-title":"welcome", "couple-title":"couple", "story-title":"story", "tafsir-title-h":"interpretation", "cd-title":"countdown", "ev-title":"program", "rd-title":"program", "rc-title":"tests", "venue-title":"venue", "dc-title":"dress", "gal-title":"gallery", "rsvp-title":"rsvp", "wish-title":"wishes", "closing-title":"welcome" };
    Object.entries(heads).forEach(([id,key]) => heading(id,t(key)));
    const titleParts={
      "salam-title":[["Chuqurroq kirishdan ","oldin"],["Чуқурроқ киришдан ","олдин"],["Before you go ","deeper"],["Прежде чем войти ","глубже"]],
      "couple-title":[["Chimchilang, ","bu tushmi?"],["Чимчиланг, ","бу тушми?"],["Pinch me, ","is this a dream?"],["Ущипни меня, ","это сон?"]],
      "story-title":[["Bizning ","tush daftarimiz"],["Бизнинг ","туш дафтаримиз"],["Our ","dream journal"],["Наш ","дневник снов"]],
      "tafsir-title-h":[["Bu tush ","nimani anglatadi?"],["Бу туш ","нимани англатади?"],["What does ","this dream mean?"],["Что означает ","этот сон?"]],
      "cd-title":[["Erimasligi kerak bo‘lgan ","yagona soat"],["Эримаслиги керак бўлган ","ягона соат"],["The one clock ","that must not melt"],["Единственные часы, ","которые не должны растаять"]],
      "ev-title":[["Aniq belgilangan ","vaqt va joy"],["Аниқ белгиланган ","вақт ва жой"],["A time and place ","that are certain"],["Время и место, ","которые уже точны"]],
      "rd-title":[["Lahzalar ","zinapoyasi"],["Лаҳзалар ","зинапояси"],["The staircase ","of events"],["Лестница ","событий"]],
      "rc-title":[["Bu tush emasligiga ","ishonch hosil qiling"],["Бу туш эмаслигига ","ишонч ҳосил қилинг"],["Make sure ","this is no dream"],["Убедитесь, что ","это не сон"]],
      "venue-title":[["Tushdan chiqish ","eshigi"],["Тушдан чиқиш ","эшиги"],["The door ","out of the dream"],["Дверь ","из сна"]],
      "dc-title":[["Haqiqiy hayotga ","liboslar"],["Ҳақиқий ҳаётга ","либослар"],["Dressed for ","the real world"],["Наряд ","для реального мира"]],
      "gal-title":[["Osib qo‘yilgan ","xotiralarimiz"],["Осиб қўйилган ","хотираларимиз"],["Memories ","we have hung up"],["Воспоминания, ","которые мы развесили"]],
      "rsvp-title":[["Rostdan ham ","kelasizmi?"],["Ростдан ҳам ","келасизми?"],["You are coming ","for real, right?"],["Вы правда ","придёте?"]],
      "wish-title":[["Ezgu ","orzu qoldiring"],["Эзгу ","орзу қолдиринг"],["Leave us ","a good dream"],["Оставьте нам ","добрый сон"]],
      "closing-title":[["Xush kelibsiz ","haqiqiy hayotga"],["Хуш келибсиз ","ҳақиқий ҳаётга"],["Welcome to ","the real world"],["Добро пожаловать ","в реальный мир"]],
    };
    Object.entries(titleParts).forEach(([id,variants])=>{const e=$(id),em=e?.querySelector("em");if(!em)return;const parts=variants[Math.max(0,col)];[...e.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());e.prepend(document.createTextNode(parts[0]));em.textContent=parts[1];});
    document.querySelectorAll(".layer").forEach((e) => { e.textContent=t("layer"); });
    for (const [section,key] of Object.entries({hero:"invitation",salam:"welcome",couple:"couple",story:"story",tafsir:"interpretation",countdown:"countdown",events:"program",rundown:"program",realitas:"tests",venue:"venue",dresscode:"dress",gallery:"gallery",rsvp:"rsvp",wishes:"wishes",closing:"thanks"})) {
      put(`nav-i-${section}-l`,t(key)); put(`nav-i-${section}-f`,t(key));
    }
    for (const who of ["groom","bride"]) {
      put(`pc-${who}-role`,t(who)); put(`pc-${who}-pinch-idle`,t("pinch")); put(`pc-${who}-pinch-done`,t("real")); put(`pc-${who}-stamp`,t("real"));
      put(`pc-${who}-name`,d[who]); put(`pc-${who}-parents-lbl`,t("hosts")); put(`pc-${who}-parents-v`,d.hosts);
      visible(`pc-${who}-parents`,Boolean(d.hosts));
      // Individual biography, social account and childhood dream fields are absent from the shared contract.
      visible(`pc-${who}-dream-wrap`,false); visible(`pc-${who}-ig`,false);
    }
    ["cover-groom","hero-name-groom","closing-n-g"].forEach((id)=>put(id,d.groom));
    ["cover-bride","hero-name-bride","closing-n-b"].forEach((id)=>put(id,d.bride));
    put("hero-kicker",d.eventType); put("hero-line",d.message); put("salam-opening",d.greeting); put("salam-text",d.message);
    put("salam-sign-names",[d.groom,d.bride].filter(Boolean).join(" & "));
    put("guest-greeting-name",payload.guestName ? d.greeting : "");
    const guestGreeting=$("guest-greeting");[...guestGreeting.childNodes].filter((n)=>n.nodeType===3).forEach((n)=>n.remove());
    put("guest-greeting-generic",d.greeting); put("closing-guest-name",payload.guestName || "");
    const closingGuest=$("closing-guest");[...closingGuest.childNodes].filter((n)=>n.nodeType===3).forEach((n)=>n.remove());closingGuest.prepend(document.createTextNode(t("thanks")+", "));
    put("closing-text",d.message); put("closing-family",d.hosts); visible("closing-family",Boolean(d.hosts));
    visible("salam-quote",false); visible("closing-hashtag",false); visible("closing-salam",false);
    put("cover-date",d.date.long); put("hero-day",d.date.weekday); put("hero-date",d.date.short); put("hero-time-v",d.date.time);
    ["hero-tz","ev-1-tz"].forEach((id)=>put(id,d.timezone));
    ["venue-name","ev-1-venue"].forEach((id)=>put(id,d.venue.name));
    ["venue-addr","ev-1-addr"].forEach((id)=>put(id,d.venue.address)); put("ev-1-name",d.eventType);
    visible("ev-2",false); visible("ev-live",false); visible("ev-1-note",false); visible("venue-note",Boolean(d.venue.note));put("venue-note",d.venue.note);
    visible("sec-venue",Boolean(d.venue.name || d.venue.address || d.venue.mapUrl));
    visible("sec-countdown",Boolean(d.dateTime));
    // This source has an amount confirmation + postal gift form, but no card field or receipt service UI.
    // Preserve source nodes for fidelity review, suppress unsupported actions and do not invent bank-card UI.
    visible("sec-gifts",false); visible("rsvp-checkin",false); visible("rsvp-deadline",false);
    $("gift-form").addEventListener("submit",(event)=>event.preventDefault());$("gift-form").querySelectorAll("input,textarea,button").forEach((e)=>{e.disabled=true;});
    if(d.rsvp.deadline){put("rsvp-deadline",d.rsvp.deadline);visible("rsvp-deadline",true);}
    visible("sec-rsvp",Boolean(d.rsvp.enabled)); visible("sec-wishes",Boolean(d.wishesEnabled)); visible("wish-more",false);
    const storyTemplate=$("story-1").cloneNode(true), storyList=$("story-list");
    for (let i=1;i<=Math.max(4,d.story.length);i++) {
      let node=$("story-"+i);
      if (!node && i>4) {
        node=cloneStory(storyTemplate,i);
        storyList.append(node);
      }
      if (!node) continue;
      const chapter=d.story[i-1]; node.hidden=!chapter;
      put(`story-${i}-title`,chapter?.title || ""); put(`story-${i}-text`,chapter?.text || "");
      put(`story-${i}-date`,""); put(`story-${i}-sign`,"");
      if (chapter) node.dataset.chapterId=chapter.id;
    }
    visible("sec-story",d.story.length>0);
    if(d.programHeading) heading("rd-title",d.programHeading);
    const dreams=["clock","stairs","door","fish"];
    dreams.forEach((key,index)=>{const i=index+1;put(`tafsir-${i}-dream`,t(key+"Dream"));put(`tafsir-${i}-meaning`,t(key+"Meaning"));put(`tf-${i}-bi`,t("interpret"));put(`tf-${i}-br`,t("melt"));put(`tf-${i}-no`,String(i).padStart(2,"0"));put(`tf-${i}-teaser`,t("hint"));});
    visible("sec-dresscode",Boolean(d.dressCode.enabled)); put("dc-text",[d.dressCode.style,d.dressCode.text,d.dressCode.note].filter(Boolean).join("\n"));
    for (let i=1;i<=Math.max(4,d.dressCode.colors.length);i++) {
      if(i>4){
        const swatch=$("dc-sw-1").cloneNode(true);swatch.id="dc-sw-"+i;swatch.querySelectorAll("[id]").forEach((e)=>e.removeAttribute("id"));
        swatch.style.setProperty("--x",`${20+((i-5)%4)*19}%`);swatch.style.setProperty("--y",`${74-Math.floor((i-5)/4)*22}%`);$("dc-palette").append(swatch);
        const chip=$("dc-chip-1").cloneNode(true);chip.id="dc-chip-"+i;chip.querySelectorAll("[id]").forEach((e)=>{e.id=e.id.replace("dc-chip-1",`dc-chip-${i}`);});$("dc-legend").append(chip);
      }
      const color=d.dressCode.colors[i-1], sw=$("dc-sw-"+i);
      sw.style.setProperty("--c",color?.hex || "transparent"); sw.dataset.name=color?.name || "";
      sw.setAttribute("aria-label",color?.name || t("select")); visible("dc-sw-"+i,Boolean(color)); visible("dc-chip-"+i,Boolean(color));
      put(`dc-chip-${i}-n`,color?.name || "");
      $("dc-chip-"+i)?.style.setProperty("--c",color?.hex || "transparent");
    }
    const gallery=d.gallery.filter((item)=>safeUrl(item.src));
    visible("sec-gallery",gallery.length>0);
    const photos=[["pc-groom-img",gallery[0]],["pc-bride-img",gallery[1]],["closing-ring-img",gallery[0]]];
    photos.forEach(([id,item])=>{const e=$(id);if(!e)return; const attr=e.tagName.toLowerCase()==="image"?"href":"src"; if(item){e.setAttribute(attr,item.src);e.setAttribute("alt",item.alt||"");}else{e.removeAttribute(attr);}});
    renderWishes(payload.preview ? d.wishes : []);
    $("rsvp-name").value=payload.guestName || ""; $("wish-name").value=payload.guestName || "";
    document.querySelectorAll("input,textarea").forEach((e)=>{e.placeholder=e.name==="name"?t("name"):t("message");});
    $("music-btn").setAttribute("aria-label",t("music")); $("viewer-close").setAttribute("aria-label",t("close")); $("dream-nav").setAttribute("aria-label",t("map"));
    $("nav-toggle").setAttribute("aria-label",t("map"));put("rc-pinch-aw",locale==="uz-Latn"?"Voy!":locale==="uz-Cyrl"?"Вой!":locale==="ru"?"Ой!":"Ouch!");
    const reducedMotion=Boolean(payload.preview && payload.qaReducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.toggle("platform-reduced",reducedMotion);
    const audio=$("bgm"); const musicEnabled=d.music.enabled && Boolean(safeUrl(d.music.url));
    if (musicEnabled) audio.src=d.music.url; else audio.removeAttribute("src");
    audio.muted=Boolean(payload.silentPlayback);
    visible("music-btn",musicEnabled);
    window.MELTING={locale:({"uz-Latn":"uz-UZ","uz-Cyrl":"uz-Cyrl-UZ",en:"en-GB",ru:"ru-RU"})[locale],timezone:d.timezone,dateTime:d.dateTime,day:d.date.day,month:d.date.monthNumber,year:d.date.year,hours:Number(d.date.time.split(":")[0]),minutes:Number(d.date.time.split(":")[1]),eventLabel:d.eventType,reducedMotion,gallery,storyCount:Math.max(4,d.story.length),colorCount:Math.max(4,d.dressCode.colors.length),musicEnabled,silentPlayback:Boolean(payload.silentPlayback),t,afterInit};
    const rundown=document.createElement("script"); rundown.type="application/json"; rundown.id="wedivo-rundown-data";
    rundown.textContent=JSON.stringify(d.program.map((item)=>({id:item.id,title:item.title,description:item.description,startTime:item.time,date:d.dateTime.slice(0,10),icon:"clock"}))); document.body.append(rundown);
    const engine=document.createElement("script");engine.src=ROOT+"source/template.js";document.body.append(engine);
    document.documentElement.classList.add("platform-ready");
  }
  function afterInit() {
    const d=state.data;
    document.querySelectorAll("[data-nav-target]").forEach((button)=>{const section=$("sec-"+button.dataset.navTarget);button.hidden=Boolean(section?.hidden);});
    document.querySelectorAll(".g-cell").forEach((button,index)=>{const item=window.MELTING.gallery[index];button.dataset.photoId=item.id;button.setAttribute("aria-label",item.alt||item.caption||`${t("photo")} ${index+1}`);});
    const map=safeUrl(d.venue.mapUrl) || (d.venue.lat!==null && d.venue.lng!==null ? `https://www.google.com/maps/search/?api=1&query=${d.venue.lat},${d.venue.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([d.venue.name,d.venue.address].filter(Boolean).join(", "))}`);
    ["venue-dir","ev-1-map"].forEach((id)=>{$(id).href=map;});
    // Source map reveal uses a normal map URL instead of a provider credential or third-party embed.
    const mapFrame=$("venue-map"); if(mapFrame) mapFrame.removeAttribute("src");
    const language=document.createElement("div");language.className="platform-languages";
    for(const locale of state.enabledLocales || [state.locale]) {
      const button=document.createElement("button");button.type="button";button.textContent=({"uz-Latn":"Uz","uz-Cyrl":"Уз",en:"En",ru:"Ru"})[locale];button.setAttribute("aria-pressed",String(locale===state.locale));
      button.onclick=()=>{if(locale===state.locale)return; parent.postMessage({type:ID+":locale",locale},location.origin);};language.append(button);
    }
    if(language.children.length>1) document.body.append(language);
    // Keep API-disabled preview explicit; never display a successful submission locally.
    for(const formId of ["rsvp-form","wish-form"]){const note=document.createElement("p");note.className="platform-feedback";note.role="status";note.id=formId+"-feedback";$(formId).append(note);}
    if(state.preview){document.querySelectorAll('#rsvp-form [type="submit"],#wish-form [type="submit"]').forEach((e)=>{e.disabled=true;}); put("rsvp-form-feedback",t("preview"));put("wish-form-feedback",t("preview"));}
    document.querySelectorAll("[data-wedivo-status]").forEach((button)=>button.addEventListener("click",()=>{status=button.dataset.wedivoStatus;document.querySelectorAll("[data-wedivo-status]").forEach((e)=>e.setAttribute("aria-pressed",String(e===button)));put("gasing-caption",t(status==="attending"?"yes":status==="not_attending"?"no":"maybe"));}));
    $("rsvp-form").addEventListener("submit",(event)=>submit(event,"rsvp"));$("wish-form").addEventListener("submit",(event)=>submit(event,"wishes"));
    // Exact creator-localized date strings also handle Uzbek Cyrillic where native Intl lacks it.
    put("cover-date",d.date.long);put("hero-day",d.date.weekday);put("hero-date",d.date.short);put("hero-time-v",d.date.time);
    put("ev-1-day",d.date.weekday);put("ev-1-date",d.date.short);put("ev-1-time-v",d.date.time);
    if(!state.preview && d.wishesEnabled) void loadWishes();
    // Source's opening gesture starts configured music; public autoplay is attempted once as well.
    const audio=$("bgm");let played=false,pausedByGuest=false;
    audio.addEventListener("playing",()=>{played=true;});
    $("music-btn").addEventListener("click",()=>{if(played)pausedByGuest=audio.paused;window.MELTING.userPaused=pausedByGuest;});
    audio.addEventListener("playing",()=>{$("music-btn").classList.add("is-playing");$("music-btn").setAttribute("aria-pressed","true");});
    audio.addEventListener("pause",()=>{$("music-btn").classList.remove("is-playing");$("music-btn").setAttribute("aria-pressed","false");});
    const attempt=()=>{if(window.MELTING.musicEnabled&&!window.MELTING.silentPlayback&&!pausedByGuest&&!played) void audio.play().catch(()=>{});};
    if(!state.preview || state.catalogMusic) attempt();
    document.addEventListener("pointerdown",attempt,{passive:true});
    document.fonts.ready.then(fitNames);
    addEventListener("resize",fitNames,{passive:true});
  }
  function fitNames(){
    for(const id of ["cover-names","hero-names","closing-names"]){const e=$(id);if(!e)continue;e.style.fontSize="";let size=parseFloat(getComputedStyle(e).fontSize);let count=0;while(e.scrollWidth>e.clientWidth+1&&size>18&&count++<30){size*=.94;e.style.fontSize=size+"px";}}
  }
  async function submit(event,kind){
    event.preventDefault();const form=event.currentTarget,feedback=form.id+"-feedback";
    if(!state||state.preview){put(feedback,t("preview"));return;}
    if(kind==="rsvp"&&!status){put(feedback,t("chooseStatus"));return;}
    const data=new FormData(form),button=form.querySelector('[type="submit"]');button.disabled=true;
    const shared={name:String(data.get("name")||""),locale:state.locale,...(state.guestToken?{guestToken:state.guestToken}:{})};
    const body=kind==="rsvp"?{...shared,status:({attending:"yes",not_attending:"no",maybe:"maybe"})[status],partySize:status==="attending"?1:0,note:String(data.get("message")||"")}: {...shared,message:String(data.get("message")||"")};
    try{
      const response=await fetch(`/api/public/invitations/${encodeURIComponent(state.invitationId)}/${kind}`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(body)});
      if(!response.ok)throw new Error("Request failed");
      if(kind==="rsvp"){form.classList.add("is-submitted");put("rsvp-thanks",t("sent"));}else{form.reset();put(feedback,t("moderated"));}
    }catch{put(feedback,t("fail"));}finally{button.disabled=false;}
  }
  async function loadWishes(){
    try{const response=await fetch(`/api/public/invitations/${encodeURIComponent(state.invitationId)}/wishes`,{credentials:"same-origin"});if(response.ok){const result=await response.json();renderWishes(result.wishes||[]);}}catch{/* Empty until the real public service responds. */}
  }
  addEventListener("message",(event)=>{
    if(event.source!==parent||event.origin!==location.origin||event.data?.type!==ID+":update")return;
    const serialized=JSON.stringify(event.data.payload);if(serialized===lastPayload)return;
    lastPayload=serialized;
    if(initialized){window.name=JSON.stringify(event.data);location.reload();return;}
    initialized=true;apply(event.data.payload);
  });
  try{const initial=JSON.parse(window.name||"{}");if(initial.type===ID+":update"){window.name="";lastPayload=JSON.stringify(initial.payload);initialized=true;apply(initial.payload);}}catch{/* Host sends authenticated/public presentation data after load. */}
})();
