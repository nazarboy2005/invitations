window.TERRACOTTA_COPY = {
  "uz-Latn": {
    open: "Taklifnomani ochish", scroll: "Pastga", events: "Tantanalar", program: "Tadbir dasturi", location: "Manzil", map: "Xaritani ochish",
    info: "Bilib qo‘ying", note: "Har bir mehmon biz uchun aziz — baxtli kunimizda sizni ko‘rishdan xursandmiz. Keling, quvonchimizni birga baham ko‘raylik va go‘zal xotiralar yarataylik.",
    wishes: "Iliq tilaklar", wishesTitle: "Tilaklaringizni qoldiring", send: "Tilakni yuborish", name: "Ismingiz", message: "Tilaklaringizni yozing…",
    counting: "Sanab turibmiz", until: "Bayramgacha", units: ["Kun", "Soat", "Daqiqa", "Soniya"], footer: "Siz bilan tantana qilishni intizorlik bilan kutamiz",
    musicOn: "Musiqani yoqish", musicOff: "Musiqani to‘xtatish", language: "Til", pending: "Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.", preview: "Bu namuna. Tilak yuborish uchun nashr qilingan taklifnomani oching.", failed: "Tilak yuborilmadi. Qayta urinib ko‘ring.", loadingFailed: "Tilaklarni yuklab bo‘lmadi. Qayta urinib ko‘ring.", sending: "Yuborilmoqda…", required: "Iltimos, bu maydonni to‘ldiring."
  },
  "uz-Cyrl": {
    open: "Таклифномани очиш", scroll: "Пастга", events: "Тантаналар", program: "Тадбир дастури", location: "Манзил", map: "Харитани очиш",
    info: "Билиб қўйинг", note: "Ҳар бир меҳмон биз учун азиз — бахтли кунимизда сизни кўришдан хурсандмиз. Келинг, қувончимизни бирга баҳам кўрайлик ва гўзал хотиралар яратайлик.",
    wishes: "Илиқ тилаклар", wishesTitle: "Тилакларингизни қолдиринг", send: "Тилакни юбориш", name: "Исмингиз", message: "Тилакларингизни ёзинг…",
    counting: "Санаб турибмиз", until: "Байрамгача", units: ["Кун", "Соат", "Дақиқа", "Сония"], footer: "Сиз билан тантана қилишни интизорлик билан кутамиз",
    musicOn: "Мусиқани ёқиш", musicOff: "Мусиқани тўхтатиш", language: "Тил", pending: "Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.", preview: "Бу намуна. Тилак юбориш учун нашр қилинган таклифномани очинг.", failed: "Тилак юборилмади. Қайта уриниб кўринг.", loadingFailed: "Тилакларни юклаб бўлмади. Қайта уриниб кўринг.", sending: "Юборилмоқда…", required: "Илтимос, бу майдонни тўлдиринг."
  },
  en: {
    open: "Open Invitation", scroll: "Scroll", events: "Celebrations", program: "Our Special Day", location: "Location", map: "Open Map",
    info: "Good to Know", note: "Everyone is welcome — we are happy to have you on our best day. Come as you are, celebrate with us, and make beautiful memories together.",
    wishes: "Warm Wishes", wishesTitle: "Leave Your Blessings", send: "Send Wishes", name: "Your name", message: "Write your wishes…",
    counting: "Counting Down", until: "Until We Say ‘I Do’", units: ["Days", "Hours", "Mins", "Secs"], footer: "We can’t wait to celebrate with you",
    musicOn: "Play music", musicOff: "Pause music", language: "Language", pending: "Your wish was sent. It will appear after the invitation owner approves it.", preview: "This is a preview. Open the published invitation to send wishes.", failed: "Could not send your wish. Please try again.", loadingFailed: "Could not load wishes. Please try again.", sending: "Sending…", required: "Please fill in this field."
  },
  ru: {
    open: "Открыть приглашение", scroll: "Вниз", events: "Торжества", program: "Наш особенный день", location: "Место проведения", map: "Открыть карту",
    info: "Полезно знать", note: "Каждый гость для нас дорог — мы счастливы видеть вас в наш лучший день. Приходите такими, какие вы есть, празднуйте с нами и создавайте вместе прекрасные воспоминания.",
    wishes: "Тёплые пожелания", wishesTitle: "Оставьте свои пожелания", send: "Отправить пожелание", name: "Ваше имя", message: "Напишите пожелания…",
    counting: "Обратный отсчёт", until: "До нашего торжества", units: ["Дни", "Часы", "Мин", "Сек"], footer: "Мы с нетерпением ждём встречи с вами",
    musicOn: "Включить музыку", musicOff: "Приостановить музыку", language: "Язык", pending: "Пожелание отправлено. Оно появится после одобрения владельцем приглашения.", preview: "Это образец. Откройте опубликованное приглашение, чтобы отправить пожелание.", failed: "Не удалось отправить пожелание. Попробуйте ещё раз.", loadingFailed: "Не удалось загрузить пожелания. Попробуйте ещё раз.", sending: "Отправка…", required: "Пожалуйста, заполните это поле."
  }
};

for(const [locale,message] of Object.entries({"uz-Latn":"Musiqani ijro etib bo‘lmadi.","uz-Cyrl":"Мусиқани ижро этиб бўлмади.",en:"Music could not be played.",ru:"Не удалось воспроизвести музыку."})) window.TERRACOTTA_COPY[locale].musicUnavailable=message;
