/* Platform data and services only. The game remains in source/template.js. */
(function () {
  "use strict";
  var active = null, started = false;
  var $ = function (id) { return document.getElementById(id); };
  var ui = {
    en: {
      close: "Close", next: "Next quest", back: "Continue exploring", name: "Your name", message: "Message (optional)", send: "Confirm", yes: "Accept quest", no: "Decline", maybe: "Maybe later",
      preview: "This is a preview. Open the published invitation to send a response.", saved: "Your response has been saved. Thank you!", pending: "Your wish was sent. It will appear after the invitation owner approves it.", failed: "Could not send. Please try again.", choose: "Choose an answer first.", sending: "Sending…", giftGap: "Gift transfers and amount confirmations are unavailable in this invitation. This form does not send money or confirm a transfer.", wishes: "Blessings", wishSend: "Cast blessing", wishMessage: "Your blessing", empty: "No approved wishes yet.", rsvpNote: "Let us know whether you can join us.", deadline: "Reply by", date: "The Final Boss appears", open: "Roll for initiative", days: "days", hours: "hours", minutes: "minutes", seconds: "seconds", sound: "Sound", mode: "Switch mode", map: "Map", memory: "Memory", calendar: "Save the date", directions: "Set waypoint (directions)", copy: "Copy address", prologue: "Prologue", party: "The Party", inventory: "Inventory", story: "Quest Log", gallery: "Memories", dress: "Recommended Gear", venue: "Waypoint Set", rsvp: "Attend the Wedding", events: "Final Boss", program: "Turn Order", closing: "To Be Continued", player: "Player 3", guest: "A new party member approaches", legend: "The Legend of", intro: "A wedding invitation ·", rpg: "A two-hero RPG", tagline: "Two heroes. One quest. The final boss is our wedding day.", married: "are getting married", start: "Begin the adventure", classic: "Classic invitation", play: "Play", soundOn: "Sound on for the full experience", greeting: "Dear guest", hosts: "With the blessing of", cast: "Starring", special: "Special guest", dateUnknown: "Date to be confirmed", style: "Dress code", note: "Message for the couple", wishName: "Caster’s name", noCount: "Accept the quest and confirm your attendance.", end: "The adventure is only beginning.", controls: "WASD / arrows to move · tap the ground to walk · E to interact · M for the map", countdown: "Time until the encounter", quests: "Quests", character: "Adventurer", victory: "The Wedding Day has arrived!", soundOff: "Sound off", address: "Real-world destination"
    },
    "uz-Latn": {
      close: "Yopish", next: "Keyingi vazifa", back: "Davom etish", name: "Ismingiz", message: "Xabar (ixtiyoriy)", send: "Tasdiqlash", yes: "Qatnashaman", no: "Qatnasha olmayman", maybe: "Hozircha noma’lum", preview: "Bu namuna. Javob yuborish uchun nashr qilingan taklifnomani oching.", saved: "Javobingiz saqlandi. Rahmat!", pending: "Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.", failed: "Yuborilmadi. Qayta urinib ko‘ring.", choose: "Avval javobni tanlang.", sending: "Yuborilmoqda…", giftGap: "Bu taklifnomada pul o‘tkazish va summani tasdiqlash xizmati mavjud emas. Ushbu shakl pul yubormaydi va o‘tkazmani tasdiqlamaydi.", wishes: "Tilaklar", wishSend: "Tilak yuborish", wishMessage: "Tilagingiz", empty: "Hozircha tasdiqlangan tilaklar yo‘q.", rsvpNote: "Tadbirga kela olishingizni bizga bildiring.", deadline: "Javob muddati", date: "Yakuniy jang kuni", open: "Sarguzashtni boshlash", days: "kun", hours: "soat", minutes: "daqiqa", seconds: "soniya", sound: "Ovoz", mode: "Ko‘rinishni almashtirish", map: "Xarita", memory: "Xotira", calendar: "Sanani saqlash", directions: "Manzilga borish", copy: "Manzilni nusxalash", prologue: "Muqaddima", party: "Qahramonlar", inventory: "Jihozlar", story: "Hikoyamiz", gallery: "Xotiralar", dress: "Tavsiya etilgan libos", venue: "Manzil", rsvp: "Ishtirokni tasdiqlash", events: "Yakuniy jang", program: "Tadbir dasturi", closing: "Davomi bor", player: "3-o‘yinchi", guest: "Jamoaga yangi qahramon qo‘shilmoqda", legend: "Afsona:", intro: "To‘y taklifnomasi ·", rpg: "Ikki qahramonli sarguzasht", tagline: "Ikki qahramon. Bir maqsad. Yakuniy jang — to‘yimiz kuni.", married: "turmush qurmoqda", start: "Sarguzashtni boshlash", classic: "Oddiy taklifnoma", play: "O‘ynash", soundOn: "Ovoz bilan tomosha qiling", greeting: "Aziz mehmon", hosts: "Ezgu niyatlar bilan", cast: "Bosh rollarda", special: "Aziz mehmon", dateUnknown: "Sana kiritilmagan", style: "Libos uslubi", note: "Juftlikka xabar", wishName: "Ismingiz", noCount: "Ishtirokingizni tasdiqlang.", end: "Sarguzasht endi boshlanmoqda.", controls: "WASD / yo‘nalish tugmalari · yurish uchun yerga bosing · E — muloqot · M — xarita", countdown: "Tadbir boshlanishiga", quests: "Vazifalar", character: "Qahramon", victory: "To‘y kuni keldi!", soundOff: "Ovozni o‘chirish", address: "Tadbir manzili"
    },
    "uz-Cyrl": {
      close: "Ёпиш", next: "Кейинги вазифа", back: "Давом этиш", name: "Исмингиз", message: "Хабар (ихтиёрий)", send: "Тасдиқлаш", yes: "Қатнашаман", no: "Қатнаша олмайман", maybe: "Ҳозирча номаълум", preview: "Бу намуна. Жавоб юбориш учун нашр қилинган таклифномани очинг.", saved: "Жавобингиз сақланди. Раҳмат!", pending: "Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.", failed: "Юборилмади. Қайта уриниб кўринг.", choose: "Аввал жавобни танланг.", sending: "Юборилмоқда…", giftGap: "Бу таклифномада пул ўтказиш ва суммани тасдиқлаш хизмати мавжуд эмас. Ушбу шакл пул юбормайди ва ўтказмани тасдиқламайди.", wishes: "Тилаклар", wishSend: "Тилак юбориш", wishMessage: "Тилагингиз", empty: "Ҳозирча тасдиқланган тилаклар йўқ.", rsvpNote: "Тадбирга кела олишингизни бизга билдиринг.", deadline: "Жавоб муддати", date: "Якуний жанг куни", open: "Саргузаштни бошлаш", days: "кун", hours: "соат", minutes: "дақиқа", seconds: "сония", sound: "Овоз", mode: "Кўринишни алмаштириш", map: "Харита", memory: "Хотира", calendar: "Санани сақлаш", directions: "Манзилга бориш", copy: "Манзилни нусхалаш", prologue: "Муқаддима", party: "Қаҳрамонлар", inventory: "Жиҳозлар", story: "Ҳикоямиз", gallery: "Хотиралар", dress: "Тавсия этилган либос", venue: "Манзил", rsvp: "Иштирокни тасдиқлаш", events: "Якуний жанг", program: "Тадбир дастури", closing: "Давоми бор", player: "3-ўйинчи", guest: "Жамоага янги қаҳрамон қўшилмоқда", legend: "Афсона:", intro: "Тўй таклифномаси ·", rpg: "Икки қаҳрамонли саргузашт", tagline: "Икки қаҳрамон. Бир мақсад. Якуний жанг — тўйимиз куни.", married: "турмуш қурмоқда", start: "Саргузаштни бошлаш", classic: "Оддий таклифнома", play: "Ўйнаш", soundOn: "Овоз билан томоша қилинг", greeting: "Азиз меҳмон", hosts: "Эзгу ниятлар билан", cast: "Бош ролларда", special: "Азиз меҳмон", dateUnknown: "Сана киритилмаган", style: "Либос услуби", note: "Жуфтликка хабар", wishName: "Исмингиз", noCount: "Иштирокингизни тасдиқланг.", end: "Саргузашт энди бошланмоқда.", controls: "WASD / йўналиш тугмалари · юриш учун ерга босинг · E — мулоқот · M — харита", countdown: "Тадбир бошланишига", quests: "Вазифалар", character: "Қаҳрамон", victory: "Тўй куни келди!", soundOff: "Овозни ўчириш", address: "Тадбир манзили"
    },
    ru: {
      close: "Закрыть", next: "Следующее задание", back: "Продолжить путь", name: "Ваше имя", message: "Сообщение (необязательно)", send: "Подтвердить", yes: "Буду", no: "Не смогу", maybe: "Пока не знаю", preview: "Это образец. Откройте опубликованное приглашение, чтобы отправить ответ.", saved: "Ваш ответ сохранён. Спасибо!", pending: "Пожелание отправлено. Оно появится после одобрения владельцем приглашения.", failed: "Не удалось отправить. Попробуйте ещё раз.", choose: "Сначала выберите ответ.", sending: "Отправка…", giftGap: "Переводы подарков и подтверждение суммы здесь недоступны. Эта форма не переводит деньги и не подтверждает перевод.", wishes: "Пожелания", wishSend: "Отправить пожелание", wishMessage: "Ваше пожелание", empty: "Одобренных пожеланий пока нет.", rsvpNote: "Сообщите, сможете ли вы присоединиться к нам.", deadline: "Ответьте до", date: "День финальной битвы", open: "Начать приключение", days: "дней", hours: "часов", minutes: "минут", seconds: "секунд", sound: "Звук", mode: "Сменить режим", map: "Карта", memory: "Воспоминание", calendar: "Сохранить дату", directions: "Проложить маршрут", copy: "Скопировать адрес", prologue: "Пролог", party: "Герои", inventory: "Инвентарь", story: "Наша история", gallery: "Воспоминания", dress: "Рекомендуемый наряд", venue: "Место встречи", rsvp: "Подтвердить участие", events: "Финальный босс", program: "Порядок ходов", closing: "Продолжение следует", player: "Игрок 3", guest: "К отряду присоединяется новый герой", legend: "Легенда героев", intro: "Приглашение на свадьбу ·", rpg: "Приключение двух героев", tagline: "Два героя. Одно задание. Финальный босс — день нашей свадьбы.", married: "женятся", start: "Начать приключение", classic: "Обычное приглашение", play: "Играть", soundOn: "Включите звук для полного погружения", greeting: "Дорогой гость", hosts: "С благословением", cast: "В главных ролях", special: "Особый гость", dateUnknown: "Дата ещё не указана", style: "Дресс-код", note: "Сообщение для пары", wishName: "Ваше имя", noCount: "Подтвердите своё участие.", end: "Приключение только начинается.", controls: "WASD / стрелки — движение · нажмите на землю · E — общение · M — карта", countdown: "До начала события", quests: "Задания", character: "Искатель приключений", victory: "День свадьбы настал!", soundOff: "Выключить звук", address: "Адрес события"
    }
  };
  function put(id, text) { if ($(id)) $(id).textContent = text || ""; }
  function hide(id, yes) { if ($(id)) $(id).hidden = !!yes; }
  function safeUrl(value) { return typeof value === "string" && /^(https?:\/\/|\/(?!\/))/.test(value) ? value : ""; }
  function sourceTranslator(p) {
    var dict = window.OathboundUzbek || {}, keys = Object.keys(dict).sort(function (a, b) { return b.length - a.length; });
    var enabled = p.locale === "uz-Latn" || p.locale === "uz-Cyrl";
    var authored = [p.guestName].concat(p.content.people, [p.content.hosts, p.content.venueName, p.content.address, p.content.landmark]).filter(Boolean);
    function cyrillic(text) {
      text = text.replace(/\bE/g, "Э").replace(/\be/g, "э");
      var pairs = { "O‘": "Ў", "o‘": "ў", "G‘": "Ғ", "g‘": "ғ", "Sh": "Ш", "sh": "ш", "Ch": "Ч", "ch": "ч", "Yo": "Ё", "yo": "ё", "Yu": "Ю", "yu": "ю", "Ya": "Я", "ya": "я", "Ts": "Ц", "ts": "ц", "Ye": "Е", "ye": "е", "’": "ъ", "‘": "ъ" };
      Object.keys(pairs).forEach(function (key) { text = text.split(key).join(pairs[key]); });
      var latin = "AaBbDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvXxYyZz", cyrl = "АаБбДдЕеФфГгҲҳИиЖжКкЛлМмНнОоПпҚқРрСсТтУуВвХхЙйЗз";
      return Array.from(text).map(function (c) { var i = latin.indexOf(c); return i < 0 ? c : cyrl[i]; }).join("");
    }
    function translate(value) {
      if (!enabled || !value) return value;
      var saved = [], text = String(value).replace(/\s+/g, " ");
      authored.forEach(function (entry) { if (text.includes(entry)) { var token = "\ue000" + saved.length + "\ue001"; saved.push(entry); text = text.split(entry).join(token); } });
      text = text.replace(/(\d+) active buffs? on the party/g, "$1 ta tasdiqlangan tilak");
      var exact = dict[text.trim()];
      if (exact) text = text.replace(text.trim(), exact);
      else keys.forEach(function (key) { if (text.includes(key)) text = text.split(key).join(dict[key]); });
      if (p.locale === "uz-Cyrl") text = cyrillic(text);
      return text.replace(/\ue000(\d+)\ue001/g, function (_, i) { return saved[+i]; });
    }
    var authoredIds = ["cv-sub-names", "cv-guest-name", "hud-couple-names", "hud-guest-name-v", "hero-mono", "hero-greet", "hero-g", "hero-b", "hero-intro", "hero-venue", "hero-class-name", "sg-name", "sb-name", "sg-init", "sb-init", "sg-ig", "ct-groom", "ct-bride", "venue-name", "venue-addr", "venue-note", "vm-name", "story-h", "story-p", "end-cast-g", "end-cast-b", "end-fam-v", "end-guest-name", "dress-text", "dress-req-v", "wish-list", "viewer-cap", "boss-title", "run-title"];
    authoredIds.forEach(function (id) { if ($(id)) $(id).dataset.oathAuthored = "true"; });
    function skip(element) {
      return !element || element.closest('[data-oath-authored], script, style, [data-item-id], .q-t, .turn-t, .turn-meta, .shard-cap, .sw-n') || /^ls-/.test(element.id);
    }
    function apply(root) {
      if (!enabled) return;
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), node;
      while ((node = walker.nextNode())) {
        if (skip(node.parentElement) || !/[A-Za-z]/.test(node.nodeValue)) continue;
        var next = translate(node.nodeValue); if (next !== node.nodeValue) node.nodeValue = next;
      }
      if (root.querySelectorAll) root.querySelectorAll('[aria-label], [placeholder], [title]').forEach(function (element) {
        if (skip(element)) return;
        ["aria-label", "placeholder", "title"].forEach(function (attr) { var value = element.getAttribute(attr); if (!value) return; var next = translate(value); if (next !== value) element.setAttribute(attr, next); });
      });
    }
    p.translate = translate;
    p.localizeSource = function () {
      if (!enabled) return;
      document.title = p.locale === "uz-Cyrl" ? "Аҳд йўли" : "Ahd yo‘li";
      apply(document.body);
      var css = { "--oath-new": "Yangi", "--oath-blessing": "Tilak egasi: ", "--oath-duration": " · Ezgu tilaklar abadiy", "--oath-empty": "Hozircha tasdiqlangan tilaklar yo‘q. Birinchi bo‘lib tilak yozing!", "--oath-current": "Ayni paytda" };
      Object.keys(css).forEach(function (key) { document.body.style.setProperty(key, JSON.stringify(p.locale === "uz-Cyrl" ? cyrillic(css[key]) : css[key])); });
      new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type === "characterData") { var node = mutation.target; if (!skip(node.parentElement)) { var next = translate(node.nodeValue); if (next !== node.nodeValue) node.nodeValue = next; } }
          else mutation.addedNodes.forEach(function (node) { if (node.nodeType === 1) apply(node); else if (node.nodeType === 3 && !skip(node.parentElement)) { var next = translate(node.nodeValue); if (next !== node.nodeValue) node.nodeValue = next; } });
        });
      }).observe(document.body, { subtree: true, childList: true, characterData: true });
    };
  }
  function label(id, text) {
    var node = $(id); if (!node) return;
    var texts = Array.from(node.childNodes).filter(function (n) { return n.nodeType === 3; });
    texts.forEach(function (n, i) { n.textContent = i === 0 ? text : ""; });
    if (!texts.length) node.appendChild(document.createTextNode(text));
  }
  function renderWishes(items, t) {
    var box = $("wish-list"); box.replaceChildren();
    items.forEach(function (wish) {
      var card = document.createElement("div"); card.className = "buff";
      [ ["span", "buff-ic", ""], ["p", "buff-name", wish.name], ["p", "buff-msg", wish.message] ].forEach(function (part) {
        var el = document.createElement(part[0]); el.className = part[1]; el.textContent = part[2]; card.appendChild(el);
      }); box.appendChild(card);
    });
    put("wish-count", items.length ? t.wishes + " · " + items.length : t.empty);
  }
  async function submit(path, body, p) {
    if (p.preview) throw new Error(ui[p.locale].preview);
    var response = await fetch("/api/public/invitations/" + encodeURIComponent(p.invitationId) + "/" + path, {
      method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    var result = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(ui[p.locale].failed);
    return result;
  }
  function wireForms(p, t) {
    var status = "";
    var requiredMessage = { "uz-Latn": "Iltimos, bu maydonni to‘ldiring.", "uz-Cyrl": "Илтимос, бу майдонни тўлдиринг.", en: "Please complete this field.", ru: "Пожалуйста, заполните это поле." }[p.locale];
    document.querySelectorAll("#rsvp-form [required], #wish-form [required]").forEach(function (input) {
      input.addEventListener("invalid", function () { input.setCustomValidity(requiredMessage); });
      input.addEventListener("input", function () { input.setCustomValidity(""); });
    });
    document.querySelectorAll("[data-wedivo-status]").forEach(function (button) {
      button.addEventListener("click", function () {
        status = { attending: "yes", not_attending: "no", maybe: "maybe" }[button.dataset.wedivoStatus];
        document.querySelectorAll("[data-wedivo-status]").forEach(function (b) { b.classList.toggle("is-on", b === button); b.setAttribute("aria-pressed", String(b === button)); });
      });
    });
    $("rsvp-form").addEventListener("submit", async function (event) {
      event.preventDefault(); var form = event.currentTarget;
      if (form.dataset.busy) return;
      form.classList.remove("is-submitted"); put("rsvp-ok", ""); put("rsvp-err", "");
      if (p.preview) { put("rsvp-err", t.preview); $("rsvp-err").style.display = "block"; return; }
      if (!status) { put("rsvp-err", t.choose); $("rsvp-err").style.display = "block"; return; }
      form.dataset.busy = "1"; $("rsvp-send").disabled = true;
      try {
        await submit("rsvp", { name: $("rsvp-name").value.trim(), status: status, partySize: status === "yes" ? 1 : 0, note: $("rsvp-msg").value.trim(), guestToken: p.guestToken }, p);
        put("rsvp-ok", t.saved); $("rsvp-ok").style.display = "block"; form.classList.add("is-submitted");
      } catch (error) { put("rsvp-err", error.message); $("rsvp-err").style.display = "block"; }
      finally { delete form.dataset.busy; $("rsvp-send").disabled = false; }
    });
    var result = document.createElement("p"); result.id = "platform-wish-result"; result.setAttribute("role", "status"); $("wish-form").appendChild(result);
    $("wish-form").addEventListener("submit", async function (event) {
      event.preventDefault(); var form = event.currentTarget;
      if (form.dataset.busy) return;
      if (p.preview) { result.textContent = t.preview; return; }
      form.dataset.busy = "1"; $("wish-send").disabled = true;
      try {
        await submit("wishes", { name: $("wish-name").value.trim(), message: $("wish-msg").value.trim(), guestToken: p.guestToken }, p);
        result.textContent = t.pending; $("wish-msg").value = ""; form.classList.add("is-submitted");
        // Pending wishes are never inserted into the public list.
      } catch (error) { result.textContent = error.message; }
      finally { delete form.dataset.busy; $("wish-send").disabled = false; }
    });
    $("gift-form").addEventListener("submit", function (event) { event.preventDefault(); });
  }
  function bindCalendar(p, t) {
    if (!p.instant) { hide("cmd-save", true); return; }
    var start = new Date(p.instant), end = new Date(start.getTime() + 2 * 3600000);
    var stamp = function (d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z"); };
    var title = p.content.people.filter(Boolean).join(" & ") + " — " + p.content.eventLabel;
    var where = [p.content.venueName, p.content.address].filter(Boolean).join(", ");
    $("cal-google").href = "https://calendar.google.com/calendar/render?" + new URLSearchParams({ action: "TEMPLATE", text: title, dates: stamp(start) + "/" + stamp(end), location: where, details: p.content.message }).toString();
    $("cal-ics").addEventListener("click", function () {
      function escape(s) { return String(s).replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;"); }
      var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Visol//Oathbound//EN", "BEGIN:VEVENT", "UID:" + p.invitationId + "@visol", "DTSTAMP:" + stamp(new Date()), "DTSTART:" + stamp(start), "DTEND:" + stamp(end), "SUMMARY:" + escape(title), "LOCATION:" + escape(where), "DESCRIPTION:" + escape(p.content.message), "END:VEVENT", "END:VCALENDAR"];
      lines = lines.map(function (line) {
        var parts = [], part = "", length = 0, encoder = new TextEncoder();
        Array.from(line).forEach(function (character) {
          var bytes = encoder.encode(character).length;
          if (length + bytes > 75) { parts.push(part); part = " "; length = 1; }
          part += character; length += bytes;
        }); parts.push(part); return parts.join("\r\n");
      });
      var link = document.createElement("a"), url = URL.createObjectURL(new Blob([lines.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" }));
      link.href = url; link.download = "taklifnoma.ics"; link.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }
  function bind(p) {
    var t = ui[p.locale] || ui.en, c = p.content, names = c.people.filter(Boolean), pair = names.slice(0, 2).join(" & ");
    document.documentElement.lang = { "uz-Latn": "uz", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" }[p.locale];
    p.reducedMotion = p.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    sourceTranslator(p);
    document.body.classList.toggle("platform-reduced", p.reducedMotion);
    ["cv-sub-names", "hud-couple-names", "hero-mono"].forEach(function (id) { put(id, pair); });
    ["cv-guest-name", "hud-guest-name-v", "hero-class-name", "end-guest-name"].forEach(function (id) { put(id, p.guestName); });
    put("hero-g", names[0]); put("hero-b", names[1]); put("hero-greet", c.greeting); put("hero-intro", c.message);
    put("hero-venue", c.venueName); put("end-fam-v", c.hosts); put("end-cast-g", names[0]); put("end-cast-b", names[1]);
    if (p.gallery[0] && safeUrl(p.gallery[0].url)) {
      $("hero-photo").src = p.gallery[0].url;
      $("hero-photo").alt = p.gallery[0].alt || p.gallery[0].caption || pair;
    }
    put("ct-groom", "P1 · " + (names[0] || "")); put("ct-bride", "P2 · " + (names[1] || ""));
    ["sg", "sb"].forEach(function (pre, index) {
      put(pre + "-name", names[index]); put(pre + "-init", names[index] ? Array.from(names[index])[0] : "");
      ["-lv", "-class", "-parents", "-stats", "-traits", "-ig"].forEach(function (suffix) { hide(pre + suffix, true); });
      for (var i = 1; i <= 3; i++) hide(pre + "-t" + i, true);
    });
    hide("ct-groom", !names[0]); hide("ct-bride", !names[1]);
    var instagram = p.instagramUrl.trim();
    if (instagram) {
      var url = /^https?:\/\//.test(instagram) ? instagram : "https://www.instagram.com/" + encodeURIComponent(instagram.replace(/^@/, ""));
      $("sg-ig").href = url; $("sg-ig").textContent = instagram;
      // The shared contact belongs to the invitation; do not invent separate profiles.
      $("sg-ig").hidden = false;
    }
    put("venue-name", c.venueName); put("venue-addr", c.address); put("vm-name", c.venueName); put("venue-note", c.landmark);
    put("dress-text", [p.dressCode.text, p.dressCode.note].filter(Boolean).join("\n")); put("dress-req-v", p.dressCode.style);
    var swatches = $("dress-swatches"), original = $("sw-1");
    swatches.replaceChildren();
    p.dressCode.colors.forEach(function (color, i) {
      var b = original.cloneNode(true); b.id = "sw-" + (i + 1); b.dataset.col = color.hex; b.style.setProperty("--c", color.hex);
      b.querySelectorAll("[id]").forEach(function (el) { el.id = el.id.replace("sw-1", b.id); });
      b.querySelector(".sw-n").textContent = color.name; swatches.appendChild(b);
    });
    // The native story UI is repeatable; dates/photos/rewards are absent from the contract.
    var storyData = $("ls-t-1").parentElement.parentElement; // keep source wrappers; append extra contract slots there
    p.story.forEach(function (chapter, i) {
      [ ["t", chapter.title], ["x", chapter.text], ["d", ""], ["p", ""], ["r", ""] ].forEach(function (part) {
        var id = "ls-" + part[0] + "-" + (i + 1), el = $(id);
        if (!el) { el = document.createElement("span"); el.id = id; el.hidden = true; storyData.appendChild(el); }
        el.textContent = part[1];
      });
    });
    var rundown = p.program.map(function (item, index) { return { id: item.id, date: p.wallDate, instant: item.instant, endInstant: p.program[index + 1]?.instant || "", startTime: item.time, endTime: "", title: item.title, description: item.description, location: c.venueName, icon: "heart", isAllDay: false }; });
    $("wedivo-rundown-data").textContent = JSON.stringify(rundown);
    var uiIds = { "cv-kicker-a": "intro", "cv-kicker-b": "rpg", "cv-roll-t": "open", "cv-tag": "tagline", "cv-guest-generic": "guest", "hud-guest-name-g": "player", "hero-class-generic": "character", "hero-are": "married", "hud-hint": "controls", "qn-toggle-t": "quests", "couple-title": "party", "inv-title": "inventory", "story-title": "story", "gal-title": "gallery", "dress-title": "dress", "venue-title": "venue", "rsvp-title": "rsvp", "wish-title": "wishes", "run-title": "program", "end-title": "closing", "venue-card-k": "address", "venue-copy": "copy", "venue-go": "directions", "rsvp-l-name": "name", "rsvp-l-msg": "note", "rsvp-yes": "yes", "rsvp-no": "no", "rsvp-maybe": "maybe", "rsvp-send": "send", "rsvp-note": "rsvpNote", "wish-l-name": "wishName", "wish-l-msg": "wishMessage", "wish-send": "wishSend", "boss-hp-k": "countdown", "end-cast-k": "cast", "end-fam-k": "hosts", "end-guest-k": "special", "play-btn-t": "play", "play-btn-x": "start", "cmd-save": "calendar", "cmd-attend": "yes", "cmd-bless": "wishes", "end-line": "end" };
    Object.keys(uiIds).forEach(function (id) { label(id, t[uiIds[id]]); });
    put("boss-title", c.eventLabel || t.events); put("run-title", c.programHeading || t.program);
    var navKeys = { hero: "prologue", couple: "party", inventory: "inventory", story: "story", gallery: "gallery", dresscode: "dress", venue: "venue", rsvp: "rsvp", wishes: "wishes", events: "events", rundown: "program", closing: "closing" };
    Object.keys(navKeys).forEach(function (key) { put("qn-" + key + "-t", t[navKeys[key]]); });
    document.querySelectorAll('[data-act="close"]').forEach(function (el) { label(el.id, t.back); });
    document.querySelectorAll('[data-act="next"]').forEach(function (el) { label(el.id, t.next); });
    document.querySelectorAll(".win-x").forEach(function (el) { el.setAttribute("aria-label", t.close); });
    $("rsvp-name").placeholder = t.name; $("wish-name").placeholder = t.name; $("rsvp-msg").placeholder = t.message; $("wish-msg").placeholder = t.wishMessage;
    $("rsvp-name").maxLength = 100; $("wish-name").maxLength = 100; $("rsvp-msg").maxLength = 1000; $("wish-msg").maxLength = 2000;
    $("rsvp-name").value = p.guestName; $("wish-name").value = p.guestName;
    hide("rsvp-obj", true); hide("end-tag", true); hide("end-sign", true); hide("end-co", true);
    hide("inv-4", !p.dressCode.enabled); hide("inv-5", !p.giftEnabled); hide("inv-6", !p.wishesEnabled);
    hide("inv-7", true); hide("item-n-7", true); // source parking promise has no authored field
    var notice = document.createElement("p"); notice.id = "platform-gift-notice"; notice.textContent = t.giftGap; $("gift-form").before(notice);
    var music = $("bgm"); if (p.music.enabled && safeUrl(p.music.url) && !p.silentPlayback) music.dataset.src = p.music.url;
    else { music.removeAttribute("src"); music.removeAttribute("data-src"); music.muted = true; }
    p.beforeBoot = function (hideSection) {
      ["patchnotes", "quote", "skilltree", "video"].forEach(hideSection);
      if (!p.story.length) hideSection("story");
      if (!p.gallery.length) hideSection("gallery");
      if (!p.dressCode.enabled) hideSection("dresscode");
      if (!p.rsvp.enabled) hideSection("rsvp");
      if (!p.wishesEnabled) hideSection("wishes");
      if (!p.giftEnabled) hideSection("gifts");
      if (!p.program.length) hideSection("rundown");
      if (!p.instant) hideSection("events");
    };
    p.bindPhases = function () {
      var box = $("boss-phases"), model = $("phase-1"); box.replaceChildren();
      (p.program.length ? p.program : [{ id: "event", title: c.eventLabel, time: p.wallTime }]).forEach(function (item, index) {
        var card = model.cloneNode(true); card.id = "phase-" + (index + 1); card.dataset.itemId = item.id;
        card.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
        card.querySelector(".phase-k").textContent = t.program + " " + (index + 1); card.querySelector(".phase-n").textContent = item.title;
        card.querySelector(".phase-when").textContent = [p.dateLabel, item.time, p.timezone].filter(Boolean).join(" · ");
        card.querySelector(".phase-where").textContent = [c.venueName, c.address, item.description].filter(Boolean).join(" · "); box.appendChild(card);
      });
    };
    p.bindCalendar = function () { bindCalendar(p, t); };
    p.updateViewer = function (index) {
      var photo = p.gallery[index];
      if (photo) { $("viewer-img").alt = photo.alt || photo.caption || ""; put("viewer-cap", photo.caption || t.memory + " " + (index + 1)); }
    };
    p.afterBoot = function () {
      put("hero-date-t", [p.dateLabel, p.wallTime].filter(Boolean).join(" · "));
      put("cv-date-t", p.dateLabel ? t.date + " · " + p.dateLabel : t.dateUnknown);
      put("cv-year", p.wallDate.slice(0, 4));
      // Replace cover mixed text without changing its source structure or placement.
      $("cv-sub").childNodes[0].textContent = t.legend + " ";
      $("cv-foot").replaceChildren(document.createTextNode(t.soundOn + " · " + pair));
      put("rsvp-dl", p.rsvp.deadline); hide("rsvp-dl", !p.rsvp.deadline);
      $("boss-hp-t").childNodes.forEach(function (node) {
        if (node.nodeType === 3 && /^d\s*$/.test(node.nodeValue)) node.nodeValue = " " + t.days + " ";
      });
      document.querySelectorAll(".turn").forEach(function (el, index) { el.dataset.itemId = p.program[index]?.id || ""; });
      p.gallery.forEach(function (photo, i) { var im = $("shard-img-" + i); if (im) im.alt = photo.alt || photo.caption || ""; put("shard-cap-" + i, photo.caption || t.memory + " " + (i + 1)); });
      wireForms(p, t); renderWishes([], t);
      hide("wish-more", true); // The public API returns the complete bounded list; no source pagination service exists.
      p.localizeSource();
      if (!p.preview && p.wishesEnabled) fetch("/api/public/invitations/" + encodeURIComponent(p.invitationId) + "/wishes", { cache: "no-store", credentials: "same-origin" }).then(function (r) { if (!r.ok) throw new Error(); return r.json(); }).then(function (body) { renderWishes(body.wishes || [], t); }).catch(function () { put("wish-count", t.failed); });
      document.body.classList.remove("awaiting-data");
    };
    window.OATHBOUND = p;
    var source = document.createElement("script"); source.src = "source/template.js"; document.body.appendChild(source);
  }
  function receive(message) {
    if (message?.type !== "wedivo-oathbound:update" || !message.payload?.content || !ui[message.payload.locale]) return;
    var serialized = JSON.stringify(message);
    if (active === serialized) return;
    window.name = serialized;
    if (started) { location.reload(); return; }
    started = true; active = serialized; bind(message.payload);
  }
  addEventListener("message", function (event) {
    if (event.origin !== location.origin || event.source !== parent) return;
    receive(event.data);
  });
  try { receive(JSON.parse(window.name || "null")); } catch (_) { /* Wait for the owning renderer. */ }
})();
