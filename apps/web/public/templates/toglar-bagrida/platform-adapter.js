/* Platform data/services. No provider runtime, query values, fixtures or storage. */
(function () {
  'use strict';
  var state = null, locale = 'uz-Latn', wishContext = '', loadVersion = 0;
  var pausedByGuest = false, audioKey = '', pendingAutoplay = false, sendPending = false;
  var $ = function (s) { return document.querySelector(s); };
  var all = function (s) { return Array.from(document.querySelectorAll(s)); };
  var UI = {
    'uz-Latn': {
      kicker: 'Biz turmush quramiz', scroll: 'Pastga', invitation: 'Taklifnoma', wedding: 'Nikoh to‘yi', and: 'va',
      lead: 'Ikki yurak bir bo‘lgan kun — sizni shu quvonchni biz bilan baham ko‘rishga chorlaymiz.',
      vow: 'oilamizning eng go‘zal kunida aziz mehmonimiz bo‘ling.',
      ceremony: 'Marosim', ceremonyTitle: 'Nikoh qasamyodi', ceremonyText: 'Tog‘lar bag‘rida, eng yaqinlarimiz davrasida bir-birimizga bir umrlik so‘z beramiz.',
      celebration: 'Ziyofat', celebrationTitle: 'Kechki bazm', celebrationText: 'Chiroqlar yog‘dusida, kuy va kulgi bilan — birga raqsga tushamiz.',
      time: 'Soat', venue: 'Joy', address: 'Manzil', program: 'Kun tartibi', date: 'Sanasi', units: ['kun', 'soat', 'daqiqa'],
      actionNote: 'Manzilni ko‘ring yoki bizga tilak qoldiring.', map: 'Manzilni ko‘rish', leaveWish: 'Tilak qoldirish',
      wishes: 'Mehmonlar tilaklari', wishNote: 'Bizga eng yaxshi tilaklaringizni qoldiring — tasdiqlangach shu sahifada ko‘rinadi.',
      name: 'Ismingiz', message: 'Tilakingizni yozing...', send: 'Tilakni yuborish',
      received: 'Rahmat — tilagingiz yuborildi. Egasi tasdiqlagach ko‘rinadi.',
      failure: 'Tilakni yuborib bo‘lmadi. Qayta urinib ko‘ring.', loadFailure: 'Tilaklarni yuklab bo‘lmadi. Sahifani yangilab qayta urinib ko‘ring.',
      invalid: 'Ismingiz va tilagingizni kiriting.', preview: 'Ko‘rib chiqish rejimida tilak yuborilmaydi.',
      footer: 'Sizni kutib qolamiz — bu kun bizning xotiramizda siz bilan yorqin bo‘ladi.', music: 'Musiqa', pause: 'Pauza', language: 'Til',
    },
    'uz-Cyrl': {
      kicker: 'Биз турмуш қурамиз', scroll: 'Пастга', invitation: 'Таклифнома', wedding: 'Никоҳ тўйи', and: 'ва',
      lead: 'Икки юрак бир бўлган кун — сизни шу қувончни биз билан баҳам кўришга чорлаймиз.',
      vow: 'оиламизнинг энг гўзал кунида азиз меҳмонимиз бўлинг.',
      ceremony: 'Маросим', ceremonyTitle: 'Никоҳ қасамёди', ceremonyText: 'Тоғлар бағрида, энг яқинларимиз даврасида бир-биримизга бир умрлик сўз берамиз.',
      celebration: 'Зиёфат', celebrationTitle: 'Кечки базм', celebrationText: 'Чироқлар ёғдусида, куй ва кулги билан — бирга рақсга тушамиз.',
      time: 'Соат', venue: 'Жой', address: 'Манзил', program: 'Кун тартиби', date: 'Санаси', units: ['кун', 'соат', 'дақиқа'],
      actionNote: 'Манзилни кўринг ёки бизга тилак қолдиринг.', map: 'Манзилни кўриш', leaveWish: 'Тилак қолдириш',
      wishes: 'Меҳмонлар тилаклари', wishNote: 'Бизга энг яхши тилакларингизни қолдиринг — тасдиқлангач шу саҳифада кўринади.',
      name: 'Исмингиз', message: 'Тилагингизни ёзинг...', send: 'Тилакни юбориш',
      received: 'Раҳмат — тилагингиз юборилди. Эгаси тасдиқлагач кўринади.',
      failure: 'Тилакни юбориб бўлмади. Қайта уриниб кўринг.', loadFailure: 'Тилакларни юклаб бўлмади. Саҳифани янгилаб қайта уриниб кўринг.',
      invalid: 'Исмингиз ва тилагингизни киритинг.', preview: 'Кўриб чиқиш режимида тилак юборилмайди.',
      footer: 'Сизни кутиб қоламиз — бу кун бизнинг хотирамизда сиз билан ёрқин бўлади.', music: 'Мусиқа', pause: 'Пауза', language: 'Тил',
    },
    en: {
      kicker: 'We are getting married', scroll: 'Scroll', invitation: 'Invitation', wedding: 'Wedding', and: '&',
      lead: 'Two hearts become one — we warmly invite you to share this joy with us.', vow: 'be our dear guests on the most beautiful day of our family.',
      ceremony: 'Ceremony', ceremonyTitle: 'Marriage Vows', ceremonyText: 'In the embrace of the mountains, surrounded by our closest ones, we give each other a lifelong vow.',
      celebration: 'Reception', celebrationTitle: 'Evening Celebration', celebrationText: 'In the glow of the lights, with music and laughter — we will dance together.',
      time: 'Time', venue: 'Venue', address: 'Address', program: 'Schedule of the Day', date: 'Date', units: ['days', 'hours', 'min'],
      actionNote: 'View the location or leave us a wish.', map: 'View location', leaveWish: 'Leave a wish',
      wishes: 'Guest Wishes', wishNote: 'Leave us your warmest wishes — they will appear here after approval.', name: 'Your name', message: 'Write your wish…', send: 'Send Wish',
      received: 'Thank you — your wish was sent and will appear after approval.', failure: 'Could not send your wish. Please try again.', loadFailure: 'Could not load wishes. Refresh the page to try again.',
      invalid: 'Enter your name and wish.', preview: 'Wishes are not sent in preview mode.',
      footer: 'We will be waiting for you — this day will shine brightly in our memory with you.', music: 'Music', pause: 'Pause', language: 'Language',
    },
    ru: {
      kicker: 'Мы женимся', scroll: 'Вниз', invitation: 'Приглашение', wedding: 'Свадьба', and: 'и',
      lead: 'Два сердца становятся одним — сердечно приглашаем вас разделить эту радость с нами.', vow: 'будьте нашими дорогими гостями в самый прекрасный день нашей семьи.',
      ceremony: 'Церемония', ceremonyTitle: 'Брачная клятва', ceremonyText: 'В объятиях гор, в кругу самых близких, мы даём друг другу клятву на всю жизнь.',
      celebration: 'Банкет', celebrationTitle: 'Вечерний банкет', celebrationText: 'В сиянии огней, с музыкой и смехом — мы будем танцевать вместе.',
      time: 'Время', venue: 'Место', address: 'Адрес', program: 'Программа дня', date: 'Дата', units: ['дн', 'час', 'мин'],
      actionNote: 'Посмотрите адрес или оставьте нам пожелание.', map: 'Посмотреть адрес', leaveWish: 'Оставить пожелание',
      wishes: 'Пожелания гостей', wishNote: 'Оставьте нам тёплые пожелания — они появятся здесь после одобрения.', name: 'Ваше имя', message: 'Напишите пожелание…', send: 'Отправить пожелание',
      received: 'Спасибо — пожелание отправлено и появится после одобрения.', failure: 'Не удалось отправить пожелание. Попробуйте ещё раз.', loadFailure: 'Не удалось загрузить пожелания. Обновите страницу и попробуйте ещё раз.',
      invalid: 'Введите имя и пожелание.', preview: 'В режиме просмотра пожелания не отправляются.',
      footer: 'Мы будем ждать вас — этот день будет ярко сиять в нашей памяти вместе с вами.', music: 'Музыка', pause: 'Пауза', language: 'Язык',
    },
  };
  function text(selector, value) { all(selector).forEach(function (el) { el.textContent = value || ''; }); }
  function visible(selector, show) { all(selector).forEach(function (el) { el.hidden = !show; }); }
  function bind(key, value) { text('[data-bind="' + key + '"]', value); }
  function safeUrl(value) { return typeof value === 'string' && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) ? value : ''; }
  function feedback(key) { var el = $('#wishThanks'); el.dataset.key = key; el.textContent = UI[locale][key]; el.hidden = false; }
  function fitNames() {
    all('.hero__names [data-bind], .frame__inner .who [data-bind], .footer__sign').forEach(function (el) {
      el.style.fontSize = '';
      var size = parseFloat(getComputedStyle(el).fontSize), min = el.closest('.frame') ? 17 : 24;
      while (el.scrollWidth > el.clientWidth + 1 && size > min) { size -= 1; el.style.fontSize = size + 'px'; }
    });
    var frame = $('.frame__inner'), who = $('.frame__inner .who');
    who.style.fontSize = '';
    var size = parseFloat(getComputedStyle(who).fontSize);
    while (frame.scrollHeight > frame.clientHeight + 1 && size > 17) { size -= 1; who.style.fontSize = size + 'px'; }
  }
  function tick() {
    var instant = state && Date.parse(state.instant);
    visible('#countdown', Number.isFinite(instant));
    if (!Number.isFinite(instant)) return;
    var mins = Math.max(0, Math.floor((instant - Date.now()) / 60000));
    text('[data-cd="d"]', String(Math.floor(mins / 1440)));
    text('[data-cd="h"]', String(Math.floor((mins % 1440) / 60)));
    text('[data-cd="m"]', String(mins % 60));
  }
  function render() {
    if (!state) return;
    var c = state.localized[locale], u = UI[locale];
    if (!c || !u) return;
    document.documentElement.lang = locale;
    document.documentElement.toggleAttribute('data-reduced-motion', Boolean(state.reducedMotion));
    document.title = c.title || u.invitation;
    bind('name1', c.people[0]); bind('name2', c.people[1]);
    bind('monogram', c.people.filter(Boolean).map(function (n) { return Array.from(n.trim())[0] || ''; }).join(' ').toLocaleUpperCase());
    visible('.hero__amp, .frame__inner .who small', Boolean(c.people[0] && c.people[1]));
    text('.hero__amp, .frame__inner .who small', u.and);
    text('.hero__kicker', u.kicker); text('.hero__scroll span', u.scroll);
    bind('hero-date', c.heroDate); bind('mandala-date', c.mandalaDate);
    visible('.hero__date, .mandala-date', Boolean(c.heroDate));
    text('.opening .eyebrow', c.greeting || u.invitation);
    text('.opening .lead', c.message || u.lead);
    text('.frame__inner .eyebrow', c.eventLabel || u.wedding);
    text('.vow', u.vow);
    ['.scene:not(.alt)', '.scene.alt'].forEach(function (sel, i) {
      var scene = c.scenes[i], key = i ? 'celebration' : 'ceremony';
      visible(sel, !scene || Boolean(scene.title.trim()));
      if (scene) $(sel).dataset.itemId = scene.id; else delete $(sel).dataset.itemId;
      text(sel + ' .eyebrow', u[key]);
      text(sel + ' .scene__title', scene ? scene.title : u[key + 'Title']);
      text(sel + ' .body', scene ? scene.text : u[key + 'Text']);
      text(sel + ' .meta b', u.time);
      var sceneTime=c.sceneTimes[i] || c.time; text(sel + ' .meta span', sceneTime); visible(sel + ' .meta', Boolean(sceneTime));
    });
    bind('venue-main', c.venueName); bind('card-address', c.address);
    var metas = all('.venue-block .meta');
    metas[0].hidden = !c.venueName; metas[1].hidden = !c.address;
    metas[0].querySelector('b').textContent = u.venue; metas[1].querySelector('b').textContent = u.address;
    visible('.venue-block', Boolean(c.venueName || c.address));
    text('.programme .eyebrow', c.programHeading || u.program);
    var timeline = $('.timeline'); timeline.replaceChildren();
    c.program.forEach(function (item) {
      var row = document.createElement('div'), time = document.createElement('time'), title = document.createElement('div');
      row.className = 'tl-row'; row.dataset.itemId = item.id;
      time.textContent = item.time; title.className = 'ev'; title.textContent = item.title;
      if (item.description) { var small = document.createElement('small'); small.textContent = item.description; title.append(small); }
      row.append(time, title); timeline.append(row);
    });
    visible('.programme', c.program.length > 0);
    text('.mandala-date .eyebrow', u.date);
    all('.cd-cell span').forEach(function (el, i) { el.textContent = u.units[i]; });
    text('.mandala-sec .body', u.actionNote);
    var map = safeUrl(c.mapUrl), action = $('.rsvp-btn');
    action.href = map || '#wishes'; action.textContent = map ? u.map : u.leaveWish;
    if (map) { action.target = '_blank'; action.rel = 'noopener noreferrer'; }
    else { action.removeAttribute('target'); action.removeAttribute('rel'); }
    visible('.rsvp-btn, .mandala-sec .body', Boolean(map || state.wishesEnabled));
    visible('.wishes-sec', state.wishesEnabled);
    text('.wishes-sec .eyebrow', u.wishes); text('.wishes-sec .body', u.wishNote);
    $('#wishName').placeholder = u.name; $('#wishName').setAttribute('aria-label', u.name);
    $('#wishMsg').placeholder = u.message; $('#wishMsg').setAttribute('aria-label', u.message);
    text('.wish-btn', u.send);
    if ($('#wishThanks').dataset.key) feedback($('#wishThanks').dataset.key);
    text('.footer__note', c.hosts || u.footer);
    $('.taklifla-lang-switch').setAttribute('aria-label', u.language);
    $('.taklifla-lang-current').textContent = { 'uz-Latn': 'UZ', 'uz-Cyrl': 'ЎЗ', en: 'EN', ru: 'RU' }[locale];
    all('[data-lang]').forEach(function (btn) {
      btn.hidden = state.enabledLocales.indexOf(btn.dataset.lang) < 0;
      btn.classList.toggle('active', btn.dataset.lang === locale);
      btn.setAttribute('aria-checked', String(btn.dataset.lang === locale));
    });
    all('.taklifla-lang-menu hr').forEach(function (hr) { hr.hidden = true; });
    visible('.taklifla-lang-switch', state.enabledLocales.length > 1);
    if(state.preview)renderWishes(c.previewWishes || []);
    updateMusic(); tick();
    document.documentElement.setAttribute('data-ready', '');
    document.fonts.ready.then(fitNames);
  }
  var audio = $('#bgMusic'), musicButton = $('#taklifla-music-btn');
  function musicLabel() {
    var playing = !audio.paused && !audio.ended;
    musicButton.classList.toggle('playing', playing);
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.setAttribute('aria-label', UI[locale][playing ? 'pause' : 'music']);
    text('.taklifla-music-label', UI[locale][playing ? 'pause' : 'music']);
  }
  function play() { if (audioKey && !pausedByGuest) audio.play().then(function () { pendingAutoplay = false; }).catch(function () { pendingAutoplay = true; musicLabel(); }); }
  function updateMusic() {
    var url = state.music.enabled && !state.silentPlayback ? safeUrl(state.music.url) : '';
    if (url !== audioKey) {
      audio.pause(); audio.removeAttribute('src'); audioKey = url; pausedByGuest = false; pendingAutoplay = false;
      if (url) { audio.src = url; if (!state.preview) play(); }
    }
    musicButton.hidden = !url;
    musicLabel();
  }
  audio.addEventListener('play', musicLabel); audio.addEventListener('pause', musicLabel); audio.addEventListener('error', musicLabel);
  musicButton.addEventListener('click', function () {
    if (!audio.paused) { pausedByGuest = true; pendingAutoplay = false; audio.pause(); }
    else { pausedByGuest = false; play(); }
  });
  document.addEventListener('pointerdown', function (event) {
    if (state && !state.preview && pendingAutoplay && !pausedByGuest && !event.target.closest('#taklifla-music-btn')) play();
  }, { passive: true });
  var switcher = $('.taklifla-lang-switch'), toggle = $('.taklifla-lang-toggle');
  function menu(open) { switcher.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); }
  toggle.addEventListener('click', function () { menu(!switcher.classList.contains('open')); });
  all('[data-lang]').forEach(function (btn) { btn.addEventListener('click', function () {
    if (!state || state.enabledLocales.indexOf(btn.dataset.lang) < 0) return;
    locale = btn.dataset.lang; render(); menu(false); toggle.focus();
    parent.postMessage({ type: 'taklifla-mountain:language', locale: locale }, location.origin);
  }); });
  document.addEventListener('click', function (event) { if (!switcher.contains(event.target)) menu(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && switcher.classList.contains('open')) { menu(false); toggle.focus(); }
    if (switcher.contains(event.target) && /^(ArrowDown|ArrowUp|Home|End)$/.test(event.key)) {
      event.preventDefault(); menu(true);
      var buttons = all('[data-lang]').filter(function (btn) { return !btn.hidden; });
      var i = buttons.indexOf(document.activeElement);
      buttons[event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (i + (event.key === 'ArrowUp' ? -1 : 1) + buttons.length) % buttons.length].focus();
    }
  });
  function endpoint() { return '/api/public/invitations/' + encodeURIComponent(state.invitationId) + '/wishes'; }
  function renderWishes(items) {
      var list = $('#wishList'); list.replaceChildren();
      items.forEach(function (wish) {
        var card = document.createElement('div'), name = document.createElement('div'), msg = document.createElement('div');
        card.className = 'wish-card'; card.dataset.itemId = wish.id;
        name.className = 'who'; name.textContent = wish.name;
        msg.className = 'msg'; msg.textContent = wish.message || wish.text; msg.style.whiteSpace = 'pre-wrap';
        card.append(name, msg); list.append(card);
      });
  }
  function loadWishes() {
    if (!state || state.preview || !state.invitationId || !state.wishesEnabled) return;
    var version = ++loadVersion;
    fetch(endpoint(), { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('http'); return r.json();
    }).then(function (data) {
      if (version !== loadVersion) return;
      if (!Array.isArray(data.wishes)) throw new Error('shape');
      renderWishes(data.wishes);
    }).catch(function () { if (version === loadVersion && !sendPending) feedback('loadFailure'); });
  }
  $('#wishForm').addEventListener('submit', function (event) {
    event.preventDefault();
    if (!state || sendPending || !state.wishesEnabled) return;
    var name = $('#wishName').value.trim(), message = $('#wishMsg').value.trim();
    if (!name || !message) { feedback('invalid'); return; }
    if (state.preview) { feedback('preview'); return; }
    if (!state.invitationId) { feedback('failure'); return; }
    var context = wishContext;
    sendPending = true; $('.wish-btn').disabled = true; $('#wishThanks').hidden = true;
    fetch(endpoint(), { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, message: message, guestToken: state.guestToken || undefined }) })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (data) {
        if (context !== wishContext) return;
        if (data.ok !== true) throw new Error('shape');
        $('#wishMsg').value = ''; feedback('received');
        // Pending submissions stay off the approved wall.
      }).catch(function () { if (context === wishContext) feedback('failure'); })
      .finally(function () { if (context === wishContext) { sendPending = false; $('.wish-btn').disabled = false; } });
  });
  window.addEventListener('message', function (event) {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'taklifla-mountain:update') return;
    var next = event.data.payload;
    if (!next || !UI[next.locale] || !next.localized?.[next.locale] || !Array.isArray(next.enabledLocales)) return;
    state = next; locale = next.locale;
    var context = [state.invitationId, state.preview, state.wishesEnabled, state.guestToken].join(':');
    var changed = context !== wishContext;
    if (changed) {
      wishContext = context; ++loadVersion; sendPending = false; $('.wish-btn').disabled = false;
      $('#wishList').replaceChildren(); $('#wishThanks').hidden = true; delete $('#wishThanks').dataset.key;
      $('#wishName').value = state.guestName || ''; $('#wishMsg').value = '';
    }
    render(); if (changed) loadWishes();
  });
  window.addEventListener('resize', fitNames);
  setInterval(function () { if (!document.hidden) tick(); }, 30000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
  parent.postMessage({ type: 'taklifla-mountain:ready' }, location.origin);
})();
