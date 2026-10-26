/* Platform data/services only. Template layout, styles, music UI and reveals are source-owned. */
(() => {
  'use strict';
  const strings = {
    'uz-Latn': {
      save: 'Sanani eslab qoling', tagline: 'Nikoh to‘yimizga marhamat', date: 'Sana', time: 'Vaqt', scroll: 'Pastga suring', invitation: 'Taklifnoma', countdown: 'Bayramgacha qoldi', units: ['Kun','Soat','Daqiqa','Soniya'], details: 'Marosim tafsilotlari', dateTime: 'Sana va vaqt', venue: 'Joy', dress: 'Kiyim qoidasi', book: 'Tilaklar daftari', wishHeading: 'Tilak yozing', wishIntro: 'Ezgu tilaklaringizni qoldiring — ularni o‘qib, doimo eslab yuramiz.', name: 'Ismingiz', wish: 'Tilak yoki tabriklaringiz…', send: 'Yuborish', sending: 'Yuborilmoqda…', pending: 'Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.', failure: 'Tilak yuborilmadi. Qayta urinib ko‘ring.', loadFailure: 'Tilaklarni yuklab bo‘lmadi. Keyinroq qayta urinib ko‘ring.', empty: 'Hozircha tasdiqlangan tilaklar yo‘q.', preview: 'Bu namuna. Tilaklar yuborilmaydi.', required: 'Ismingiz va tilagingizni kiriting.', closing: 'Ko‘rishguncha', footer: 'Visol bilan yaratildi ✦', language: 'Til', musicPlay: 'Musiqani yoqish', musicPause: 'Musiqani to‘xtatish', photo: 'Tadbir surati', mapTitle: 'Bizni toping', address: 'Manzil',
    },
    'uz-Cyrl': {
      save: 'Санани эслаб қолинг', tagline: 'Никоҳ тўйимизга марҳамат', date: 'Сана', time: 'Вақт', scroll: 'Пастга суринг', invitation: 'Таклифнома', countdown: 'Байрамгача қолди', units: ['Кун','Соат','Дақиқа','Сония'], details: 'Маросим тафсилотлари', dateTime: 'Сана ва вақт', venue: 'Жой', dress: 'Кийим қоидаси', book: 'Тилаклар дафтари', wishHeading: 'Тилак ёзинг', wishIntro: 'Эзгу тилакларингизни қолдиринг — уларни ўқиб, доимо эслаб юрамиз.', name: 'Исмингиз', wish: 'Тилак ёки табрикларингиз…', send: 'Юбориш', sending: 'Юборилмоқда…', pending: 'Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.', failure: 'Тилак юборилмади. Қайта уриниб кўринг.', loadFailure: 'Тилакларни юклаб бўлмади. Кейинроқ қайта уриниб кўринг.', empty: 'Ҳозирча тасдиқланган тилаклар йўқ.', preview: 'Бу намуна. Тилаклар юборилмайди.', required: 'Исмингиз ва тилагингизни киритинг.', closing: 'Кўришгунча', footer: 'Visol билан яратилди ✦', language: 'Тил', musicPlay: 'Мусиқани ёқиш', musicPause: 'Мусиқани тўхтатиш', photo: 'Тадбир сурати', mapTitle: 'Бизни топинг', address: 'Манзил',
    },
    en: {
      save: 'Save the date', tagline: 'We are getting married', date: 'Date', time: 'Time', scroll: 'Scroll down', invitation: 'Invitation', countdown: 'Until the celebration', units: ['Days','Hours','Minutes','Seconds'], details: 'Celebration details', dateTime: 'Date & time', venue: 'Venue', dress: 'Dress code', book: 'Guest book', wishHeading: 'Leave a wish', wishIntro: 'Share your warm wishes — we will read and cherish them.', name: 'Your name', wish: 'Your wish or congratulations…', send: 'Send', sending: 'Sending…', pending: 'Your wish has been sent. It will appear after the host approves it.', failure: 'Your wish could not be sent. Please try again.', loadFailure: 'Wishes could not be loaded. Please try again later.', empty: 'No approved wishes yet.', preview: 'This is a preview. Wishes are not sent.', required: 'Enter your name and wish.', closing: 'See you soon', footer: 'Made with Visol ✦', language: 'Language', musicPlay: 'Play music', musicPause: 'Pause music', photo: 'Celebration photo', mapTitle: 'Find us', address: 'Address',
    },
    ru: {
      save: 'Сохраните дату', tagline: 'Приглашаем на нашу свадьбу', date: 'Дата', time: 'Время', scroll: 'Листайте вниз', invitation: 'Приглашение', countdown: 'До торжества осталось', units: ['Дней','Часов','Минут','Секунд'], details: 'Подробности торжества', dateTime: 'Дата и время', venue: 'Место', dress: 'Дресс-код', book: 'Книга пожеланий', wishHeading: 'Оставьте пожелание', wishIntro: 'Поделитесь добрыми пожеланиями — мы прочитаем и сохраним их в памяти.', name: 'Ваше имя', wish: 'Ваше пожелание или поздравление…', send: 'Отправить', sending: 'Отправка…', pending: 'Пожелание отправлено. Оно появится после одобрения организатора.', failure: 'Не удалось отправить пожелание. Попробуйте ещё раз.', loadFailure: 'Не удалось загрузить пожелания. Попробуйте позже.', empty: 'Одобренных пожеланий пока нет.', preview: 'Это образец. Пожелания не отправляются.', required: 'Введите имя и пожелание.', closing: 'До скорой встречи', footer: 'Создано с Visol ✦', language: 'Язык', musicPlay: 'Включить музыку', musicPause: 'Приостановить музыку', photo: 'Фотография торжества', mapTitle: 'Как нас найти', address: 'Адрес',
    },
  };
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const text = (s, value) => { const el = $(s); if (el) el.textContent = value || ''; };
  const safeURL = (value) => typeof value === 'string' && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) ? value : '';
  let state, currentLocale, labels = strings['uz-Latn'], wishes = [], music, musicKey = '', request = 0, busy = false;
  window.zarhalLabels = labels;
  window.zarhalTarget = null;
  const cards = $$('.detail-card');
  const sourcePhoto = $('.detail-photos .dp').cloneNode(true);
  const langMenu = $('.taklifla-lang-switch');
  const toggle = $('.taklifla-lang-toggle');
  const status = $('#wish-status');
  const submit = $('#wish-submit');
  const name = $('#wish-name');
  const wish = $('#wish-text');

  function monogram(names) {
    return names.map((n) => Array.from(n.trim())[0] || '').filter(Boolean);
  }
  function joinNames(el, names, ampClass) {
    el.replaceChildren();
    names.forEach((n, i) => {
      if (i) {
        const amp = document.createElement('span'); amp.className = ampClass || ''; amp.textContent = ' & ';
        if (!ampClass) amp.style.cssText = "font-family:'Pinyon Script',cursive;color:var(--gold-2);font-size:32px;vertical-align:-4px";
        el.append(amp);
      }
      el.append(document.createTextNode(n));
    });
  }
  function renderWishes() {
    const list = $('#wish-list'); list.replaceChildren();
    if (!wishes.length) {
      const empty = document.createElement('p'); empty.className = 'wishes-empty'; empty.textContent = labels.empty; list.append(empty); return;
    }
    wishes.forEach((item) => {
      const row = document.createElement('div'); row.className = 'wish';
      const meta = document.createElement('div'); meta.className = 'wish-meta';
      const author = document.createElement('div'); author.className = 'wish-name'; author.textContent = item.name;
      const stamp = document.createElement('div'); stamp.className = 'wish-time';
      const date = item.submittedAt ? new Date(item.submittedAt) : null;
      stamp.textContent = date && Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat(currentLocale === 'uz-Latn' ? 'uz' : currentLocale === 'uz-Cyrl' ? 'uz-Cyrl' : currentLocale, { day: 'numeric', month: 'short' }).format(date) : '';
      const body = document.createElement('div'); body.className = 'wish-text'; body.textContent = item.message || item.text;
      meta.append(author, stamp); row.append(meta, body); list.append(row);
    });
  }
  function render() {
    const d = state.variants[currentLocale]; if (!d) return;
    labels = strings[currentLocale] || strings['uz-Latn']; window.zarhalLabels = labels;
    document.documentElement.lang = currentLocale === 'uz-Latn' ? 'uz' : currentLocale;
    document.documentElement.toggleAttribute('data-reduced-motion', state.reducedMotion);
    document.title = d.title || labels.invitation;
    const names = d.names || [];
    const headings = $$('.hero-names');
    headings.forEach((el, i) => { el.textContent = i === 1 ? names.slice(1).join(' & ') : names[0] || ''; el.hidden = !el.textContent; });
    $('.hero-amp').hidden = names.length < 2;
    text('.hero-monogram', monogram(names).join(' · '));
    text('.hero-mid > .eyebrow', labels.save);
    text('.hero-tagline', d.eventLabel || labels.tagline);
    $$('.hero-meta-cell .label').forEach((el, i) => el.textContent = i ? labels.time : labels.date);
    $$('.hero-meta-val').forEach((el, i) => el.textContent = i ? d.time : d.date);
    $('.hero-meta').hidden = !d.date;
    text('.scroll-hint', labels.scroll);
    text('.invite-eyebrow', labels.invitation);
    text('.invite-quote', [d.greeting, d.message].filter(Boolean).join('\n\n'));
    $('.invite').hidden = !d.greeting && !d.message;
    joinNames($('.invite-names'), names);
    text('.countdown-eyebrow', labels.countdown);
    $$('.cd-label').forEach((el,i) => el.textContent = labels.units[i]);
    window.zarhalTarget = state.eventInstant;
    $('.countdown').hidden = state.eventInstant === null;
    if (window.zarhalTick) window.zarhalTick();
    text('.countdown-date', [d.dateLong, d.weekday].filter(Boolean).join(' · '));
    text('.details-eyebrow', labels.details);
    const cardText = [[labels.dateTime, d.dateLong, [d.weekday, d.time].filter(Boolean).join(' · ')], [labels.venue, d.venueName, d.address], [labels.dress, d.dressStyle, d.dressText]];
    cards.forEach((card,i) => {
      card.querySelector('.detail-label').textContent = cardText[i][0];
      card.querySelector('.detail-value').textContent = cardText[i][1];
      card.querySelector('.detail-sub').textContent = cardText[i][2];
      card.hidden = !cardText[i][1] && !cardText[i][2];
    });
    const photos = $('.detail-photos'); photos.replaceChildren();
    (state.gallery || []).forEach((photo, i) => {
      const url = safeURL(photo.url); if (!url) return;
      const cell = sourcePhoto.cloneNode(true); cell.className = i === 0 ? 'dp tall' : 'dp'; cell.dataset.id = photo.id;
      const img = cell.querySelector('img'); img.src = url; img.alt = photo.alt || photo.caption || `${labels.photo} ${i+1}`; img.loading = 'lazy';
      if (photo.caption) img.title = photo.caption;
      photos.append(cell);
    });
    photos.hidden = !photos.children.length;
    $('.details').hidden = !photos.children.length && cards.every((c) => c.hidden);
    // The source deliberately hides this legacy section. Bind without exposing it.
    text('.map-section > .eyebrow', labels.address); text('.map-section h2', labels.mapTitle);
    text('.map-section .body', [d.venueName, d.address].filter(Boolean).join(' · '));
    const coords = state.coordinates;
    const query = coords && coords.latitude !== null && coords.longitude !== null ? `${coords.latitude},${coords.longitude}` : [d.venueName, d.address].filter(Boolean).join(' ');
    const mapLinks = $$('.map-buttons a');
    mapLinks[0].href = safeURL(state.mapUrl) || `https://yandex.com/maps/?text=${encodeURIComponent(query)}`;
    mapLinks[1].href = safeURL(state.mapUrl) || `https://maps.google.com/?q=${encodeURIComponent(query)}`;
    $('#wishes-section').hidden = !state.wishesEnabled;
    text('.wishes-head .script', labels.book); text('.wishes-head h2', labels.wishHeading); text('.wishes-head p', labels.wishIntro);
    name.placeholder = labels.name; name.setAttribute('aria-label', labels.name);
    wish.placeholder = labels.wish; wish.setAttribute('aria-label', labels.wish);
    text('#wish-submit span', labels.send);
    if (!busy) status.textContent = state.preview ? labels.preview : '';
    if (state.preview) wishes = d.sampleWishes || [];
    renderWishes();
    joinNames($('.closing-mono'), monogram(names), 'closing-amp');
    text('.closing-script', labels.closing); text('.closing-meta', [d.date, d.time, d.venueName].filter(Boolean).join(' · '));
    text('.footer-text', labels.footer);
    langMenu.setAttribute('aria-label', labels.language); toggle.setAttribute('aria-label', labels.language);
    text('.taklifla-lang-current', { 'uz-Latn':'Uz','uz-Cyrl':'Уз',en:'En',ru:'Ru' }[currentLocale]);
    langMenu.hidden = state.enabledLocales.length < 2;
    $$('.taklifla-lang-menu button').forEach((el) => { el.hidden = !state.enabledLocales.includes(el.dataset.lang); el.classList.toggle('active', el.dataset.lang === currentLocale); el.setAttribute('aria-checked', String(el.dataset.lang === currentLocale)); });
    $$('.taklifla-lang-menu hr').forEach(el => el.hidden = true);
    const url = state.music.enabled ? safeURL(state.music.url) : '';
    const nextKey = `${url}|${state.preview}`;
    if (nextKey !== musicKey) {
      if (music) music.destroy();
      music = url ? window.createZarhalMusic(url, !state.preview || state.music.catalogAutoplay) : null;
      musicKey = nextKey;
    }
    if (music) music.paint();
    document.body.dataset.bound = 'true';
  }
  function menu(open) { langMenu.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); }
  toggle.addEventListener('click', () => menu(!langMenu.classList.contains('open')));
  $('.taklifla-lang-menu').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-lang]');
    if (!button || !state.enabledLocales.includes(button.dataset.lang)) return;
    currentLocale = button.dataset.lang; render(); menu(false); toggle.focus();
    parent.postMessage({ type: 'zarhal-sahifa:language', locale: currentLocale }, location.origin);
  });
  document.addEventListener('click', (event) => { if (!langMenu.contains(event.target)) menu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { menu(false); toggle.focus(); } });

  async function loadWishes() {
    const id = ++request;
    if (!state || state.preview || !state.wishesEnabled || !state.invitationId) return;
    const invitationId = state.invitationId;
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(invitationId)}/wishes`, { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Wish load failed');
      const result = await response.json();
      if (id !== request) return;
      wishes = Array.isArray(result.wishes) ? result.wishes : []; renderWishes();
    } catch (_) { if (id === request) status.textContent = labels.loadFailure; }
  }
  submit.addEventListener('click', async () => {
    if (busy || !state || !state.wishesEnabled) return;
    if (state.preview) { status.textContent = labels.preview; return; }
    if (!name.value.trim() || !wish.value.trim()) { status.textContent = labels.required; (!name.value.trim() ? name : wish).focus(); return; }
    busy = true; submit.disabled = true; text('#wish-submit span', labels.sending); status.textContent = '';
    const snapshot = state;
    try {
      if (!snapshot.invitationId) throw new Error('Missing invitation');
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(snapshot.invitationId)}/wishes`, {
        method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:name.value.trim(),message:wish.value.trim(),...(snapshot.guestToken ? {guestToken:snapshot.guestToken} : {})}),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('Wish submission failed');
      if (snapshot === state) { status.textContent = labels.pending; wish.value = ''; }
      // Pending submissions are never appended to the approved public list.
    } catch (_) { if (snapshot === state) status.textContent = labels.failure; }
    finally { busy = false; submit.disabled = false; text('#wish-submit span', labels.send); }
  });
  function receive(event) {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'zarhal-sahifa:update') return;
    const payload = event.data.payload;
    if (!payload || !Array.isArray(payload.enabledLocales) || !payload.variants || !strings[payload.locale]) return;
    const reload = !state || state.invitationId !== payload.invitationId || state.preview !== payload.preview || state.wishesEnabled !== payload.wishesEnabled;
    state = payload; currentLocale = payload.locale;
    if (reload) { wishes = []; request++; }
    if (!name.value && state.guestName) name.value = state.guestName;
    render(); if (reload) loadWishes();
  }
  window.addEventListener('message', receive);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loadWishes(); });
  window.addEventListener('pagehide', () => { if (music) music.destroy(); });
  parent.postMessage({ type:'zarhal-sahifa:ready' }, location.origin);
})();
