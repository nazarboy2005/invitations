(function () {
  "use strict";
  // Source labels, completed for all four approved locales. Authored fields bypass this table.
  window.XonadonCopy = {
    "uz-Latn": {
      event: "Yangi uy bayrami", occasion: "oilaviy kechki ziyofat", scroll: "Pastga torting", welcome: "Xush kelibsiz",
      plan: "Reja", house: "Uy chizmasi", planSub: "Mehmonxonadan boshlanadi, oshxonada davom etadi",
      rooms: ["Mehmonxona", "Oshxona", "Pazandalik", "Ayvon"], entry: "kirish", legend: ["Xona", "Eshik"],
      address: "Manzil", home: "Bizning yangi uyimiz", map: "Xaritada ochish", dress: "Kiyim qoidasi",
      confirmation: "Tasdiqlash", rsvp: "Qatnashish", invite: "Iltimos, qatnashishingizni tasdiqlang.",
      deadline: "Iltimos, {date}gacha qatnashishingizni tasdiqlang.", name: "Ism familiya", attend: "Qatnashasizmi",
      choices: ["Ha, albatta", "Afsus, kela olmayman"], send: "Yuborish", sending: "Yuborilmoqda…",
      thanks: "Javobingiz saqlandi. Rahmat!", failed: "Javob yuborilmadi. Qayta urinib ko‘ring.", preview: "Bu ko‘rib chiqish rejimi. Javob yuborilmaydi.", closed: "Javob yuborish muddati tugagan.", required: "Ism familiyangizni kiriting.",
      closing: "Eshigimiz ochiq, dasturxonimiz tayyor — kelganingizdan xursand bo‘lamiz.", date: "Sana", time: "Vaqt", music: "Musiqa", pause: "Pauza", blocked: "Musiqani boshlash uchun yana bosing", language: "Til",
    },
    "uz-Cyrl": {
      event: "Янги уй байрами", occasion: "оилавий кечки зиёфат", scroll: "Пастга тортинг", welcome: "Хуш келибсиз",
      plan: "Режа", house: "Уй чизмаси", planSub: "Меҳмонхонадан бошланади, ошхонада давом этади",
      rooms: ["Меҳмонхона", "Ошхона", "Пазандалик", "Айвон"], entry: "кириш", legend: ["Хона", "Эшик"],
      address: "Манзил", home: "Бизнинг янги уйимиз", map: "Харитада очиш", dress: "Кийим қоидаси",
      confirmation: "Тасдиқлаш", rsvp: "Қатнашиш", invite: "Илтимос, қатнашишингизни тасдиқланг.",
      deadline: "Илтимос, {date}гача қатнашишингизни тасдиқланг.", name: "Исм фамилия", attend: "Қатнашасизми",
      choices: ["Ҳа, албатта", "Афсус, кела олмайман"], send: "Юбориш", sending: "Юборилмоқда…",
      thanks: "Жавобингиз сақланди. Раҳмат!", failed: "Жавоб юборилмади. Қайта уриниб кўринг.", preview: "Бу кўриб чиқиш режими. Жавоб юборилмайди.", closed: "Жавоб юбориш муддати тугаган.", required: "Исм фамилиянгизни киритинг.",
      closing: "Эшигимиз очиқ, дастурхонимиз тайёр — келганингиздан хурсанд бўламиз.", date: "Сана", time: "Вақт", music: "Мусиқа", pause: "Пауза", blocked: "Мусиқани бошлаш учун яна босинг", language: "Тил",
    },
    en: {
      event: "Housewarming", occasion: "a family dinner", scroll: "Scroll down", welcome: "Welcome",
      plan: "Plan", house: "House plan", planSub: "Begins in the living room, continues in the kitchen",
      rooms: ["Living room", "Dining", "Cooking", "Terrace"], entry: "entry", legend: ["Room", "Door"],
      address: "Address", home: "Our new home", map: "Open in maps", dress: "Dress code",
      confirmation: "Confirmation", rsvp: "RSVP", invite: "Please confirm your attendance.",
      deadline: "Please confirm your attendance by {date}.", name: "Full name", attend: "Attending?",
      choices: ["Yes, of course", "Sorry, I cannot come"], send: "Send", sending: "Sending…",
      thanks: "Your response was saved. Thank you!", failed: "Your response could not be sent. Please try again.", preview: "This is a preview. Responses are not sent.", closed: "The response deadline has passed.", required: "Please enter your full name.",
      closing: "Our door is open, our table is set — we will be glad you came.", date: "Date", time: "Time", music: "Music", pause: "Pause", blocked: "Press again to start music", language: "Language",
    },
    ru: {
      event: "Новоселье", occasion: "семейный ужин", scroll: "Листайте вниз", welcome: "Добро пожаловать",
      plan: "План", house: "План дома", planSub: "Начинается в гостиной, продолжается на кухне",
      rooms: ["Гостиная", "Столовая", "Кухня", "Терраса"], entry: "вход", legend: ["Комната", "Дверь"],
      address: "Адрес", home: "Наш новый дом", map: "Открыть на карте", dress: "Дресс-код",
      confirmation: "Подтверждение", rsvp: "Участие", invite: "Пожалуйста, подтвердите участие.",
      deadline: "Пожалуйста, подтвердите участие до {date}.", name: "Имя и фамилия", attend: "Придёте?",
      choices: ["Да, конечно", "К сожалению, не смогу"], send: "Отправить", sending: "Отправляется…",
      thanks: "Ваш ответ сохранён. Спасибо!", failed: "Не удалось отправить ответ. Попробуйте ещё раз.", preview: "Это предварительный просмотр. Ответы не отправляются.", closed: "Срок подтверждения участия истёк.", required: "Введите имя и фамилию.",
      closing: "Наша дверь открыта, наш стол накрыт — мы будем рады вашему приходу.", date: "Дата", time: "Время", music: "Музыка", pause: "Пауза", blocked: "Нажмите ещё раз, чтобы включить музыку", language: "Язык",
    },
  };
})();

Object.assign(window.XonadonCopy["uz-Latn"],{menuEye:"Dasturxon",menuTitle:"Bayram taomlari",menuSub:"Bir dasturxon atrofida"});
Object.assign(window.XonadonCopy["uz-Cyrl"],{menuEye:"Дастурхон",menuTitle:"Байрам таомлари",menuSub:"Бир дастурхон атрофида"});
Object.assign(window.XonadonCopy.en,{menuEye:"At the table",menuTitle:"Celebration menu",menuSub:"Gather around our table"});
Object.assign(window.XonadonCopy.ru,{menuEye:"За столом",menuTitle:"Праздничное меню",menuSub:"За одним столом"});
