/* Shared-contract/service adapter. Source layout and motion live in source/. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const words = {
    'uz-Latn': {
      open:'Taklifnomani ochish', pre:'Oilalarining duo va roziligi bilan', tag:'turmush quramiz', scroll:'Pastga torting',
      bless:'Oilamizning quvonchli kuni', invite:'Taklif', on:'Quyidagi tantanaga', events:'Marosim jadvali', program:'Marosim dasturi',
      venue:'Manzil', waiting:'Sizni kutib qolamiz', map:'Xaritani ochish', wishes:'Tilaklaringiz', wishesSub:'Tilaklaringiz biz uchun muhim',
      name:'Ismingiz', wish:'Iliq tilaklaringizni yozing…', send:'Yuborish', pending:'Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.',
      preview:'Bu namuna. Tilak yuborilmadi.', error:'Tilakni yuborib bo‘lmadi. Qayta urinib ko‘ring.', invalid:'Ismingiz va tilagingizni kiriting.',
      countdown:'Bayramgacha qoldi', units:['Kun','Soat','Daqiqa','Soniya'], closing:'Sizni to‘yimizda ko‘rishdan baxtiyormiz', thanks:'Sevgi va minnatdorchilik bilan',
      music:'Musiqani ijro etish', pause:'Musiqani to‘xtatish', dismiss:'Musiqani yashirish', language:'Tilni tanlash', title:'Taklifnoma',
    },
    'uz-Cyrl': {
      open:'Таклифномани очиш', pre:'Оилаларининг дуо ва розилиги билан', tag:'турмуш қурамиз', scroll:'Пастга тортинг',
      bless:'Оиламизнинг қувончли куни', invite:'Таклиф', on:'Қуйидаги тантанага', events:'Маросим жадвали', program:'Маросим дастури',
      venue:'Манзил', waiting:'Сизни кутиб қоламиз', map:'Харитани очиш', wishes:'Тилакларингиз', wishesSub:'Тилакларингиз биз учун муҳим',
      name:'Исмингиз', wish:'Илиқ тилакларингизни ёзинг…', send:'Юбориш', pending:'Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.',
      preview:'Бу намуна. Тилак юборилмади.', error:'Тилакни юбориб бўлмади. Қайта уриниб кўринг.', invalid:'Исмингиз ва тилагингизни киритинг.',
      countdown:'Байрамгача қолди', units:['Кун','Соат','Дақиқа','Сония'], closing:'Сизни тўйимизда кўришдан бахтиёрмиз', thanks:'Севги ва миннатдорчилик билан',
      music:'Мусиқани ижро этиш', pause:'Мусиқани тўхтатиш', dismiss:'Мусиқани яшириш', language:'Тилни танлаш', title:'Таклифнома',
    },
    en: {
      open:'Open invitation', pre:'Together with their families', tag:'are getting married', scroll:'Scroll down',
      bless:'With our warmest blessings', invite:'Invite', on:'On the following celebration', events:'Celebration timeline', program:'Join us through the evening',
      venue:'Find your way', waiting:'We can’t wait to see you there', map:'Open map', wishes:'Send your wishes', wishesSub:'We’d love to hear from you',
      name:'Your name', wish:'Write your warm wishes here…', send:'Send wishes', pending:'Your wish was sent. It will appear after the invitation owner approves it.',
      preview:'This is a preview. Your wish was not sent.', error:'Your wish could not be sent. Please try again.', invalid:'Enter your name and wish.',
      countdown:'The countdown begins', units:['Days','Hours','Minutes','Seconds'], closing:'We can’t wait to celebrate with you', thanks:'With love and gratitude',
      music:'Play music', pause:'Pause music', dismiss:'Hide music', language:'Choose language', title:'Invitation',
    },
    ru: {
      open:'Открыть приглашение', pre:'С благословения наших семей', tag:'вступают в брак', scroll:'Прокрутите вниз',
      bless:'С нашими тёплыми пожеланиями', invite:'Приглашение', on:'На торжество', events:'Программа праздника', program:'Программа торжества',
      venue:'Как добраться', waiting:'Ждём вас с нетерпением', map:'Открыть карту', wishes:'Пожелания', wishesSub:'Ваши пожелания важны для нас',
      name:'Ваше имя', wish:'Напишите ваши тёплые пожелания…', send:'Отправить', pending:'Пожелание отправлено. Оно появится после одобрения владельцем приглашения.',
      preview:'Это образец. Пожелание не отправлено.', error:'Не удалось отправить пожелание. Попробуйте ещё раз.', invalid:'Введите имя и пожелание.',
      countdown:'До торжества', units:['Дни','Часы','Минуты','Секунды'], closing:'Будем рады видеть вас на нашей свадьбе', thanks:'С любовью и благодарностью',
      music:'Включить музыку', pause:'Остановить музыку', dismiss:'Скрыть музыку', language:'Выбрать язык', title:'Приглашение',
    },
  };
  const rowTemplate = $('.timeline-item').cloneNode(true);
  const form = $('.wishes-form');
  form.noValidate = true;
  const status = document.createElement('p');
  status.className = 'garden-status'; status.setAttribute('role', 'status'); status.setAttribute('aria-live','polite');
  form.after(status);
  const list = document.createElement('div'); list.className = 'garden-wishes-list'; status.after(list);
  const audio = $('#bgMusic');
  let current, data, locale, started = false, revision = 0, controller;
  let musicChoice = false, musicPlayed = false, dismissed = false, submitting = false;
  const nativeMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function text(selector, value) { all(selector).forEach(el => { el.textContent = value || ''; }); }
  function hide(selector, value) { all(selector).forEach(el => { el.hidden = Boolean(value); }); }
  function safeUrl(value) {
    if (typeof value !== 'string') return '';
    return /^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value) ? value : '';
  }
  function reducedMotion() {
    window.__gardenReducedMotion = nativeMotion.matches || Boolean(current?.reducedMotion);
    document.documentElement.toggleAttribute('data-reduced-motion', window.__gardenReducedMotion);
    if (window.__gardenReducedMotion) { $('#petals').replaceChildren(); all('.reveal').forEach(el => el.classList.add('visible')); }
  }
  nativeMotion.addEventListener('change', reducedMotion);
  function musicState() {
    const playing = !audio.paused && Boolean(audio.getAttribute('src'));
    $('#musicBtn').classList.toggle('playing', playing);
    $('#musicBtn').setAttribute('aria-label', words[locale]?.[playing ? 'pause' : 'music'] || 'Musiqa');
    $('#musicBtn').setAttribute('aria-pressed', String(playing));
  }
  async function playMusic() {
    if (!data?.music.enabled || !audio.getAttribute('src') || current.silentPlayback || dismissed) return;
    try { await audio.play(); musicPlayed = true; } catch { /* Source play control remains available. */ }
    musicState();
  }
  function musicOpen() { if (!musicChoice && !musicPlayed) void playMusic(); }
  ['play','pause','ended','error'].forEach(event => audio.addEventListener(event, musicState));
  function installMusicControls() {
    window.gardenMusicOpen = musicOpen;
    window.toggleMusic = () => {
      if (audio.paused) { musicChoice = false; void playMusic(); }
      else { musicChoice = true; audio.pause(); }
    };
    window.dismissMusic = event => { event?.stopPropagation(); dismissed = true; musicChoice = true; audio.pause(); $('#musicCluster').classList.add('dismissed'); };
  }
  function setMusic() {
    const src = data.music.enabled && !current.silentPlayback ? safeUrl(data.music.url) : '';
    if (src !== (audio.getAttribute('src') || '')) {
      audio.pause(); audio.removeAttribute('src');
      if (src) audio.src = src;
      audio.load(); musicPlayed = false;
    }
    $('#musicCluster').hidden = !src || dismissed;
    audio.muted = Boolean(current.silentPlayback);
    if (!current.preview && !musicChoice && !musicPlayed) void playMusic();
    musicState();
  }
  document.addEventListener('pointerdown', () => { if (!current?.preview && !musicChoice && !musicPlayed) void playMusic(); }, { passive:true });
  function renderWishes(items) {
    list.replaceChildren();
    for (const item of items) {
      const card = document.createElement('div'); card.className = 'garden-wish';
      const name = document.createElement('strong'), message = document.createElement('p');
      name.textContent = item.name || ''; message.textContent = item.message || '';
      card.append(name, message); list.append(card);
    }
  }
  async function loadWishes() {
    if (!current || current.preview || !data.wishesEnabled || !current.invitationId) return;
    const version = revision;
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/wishes`, { credentials:'same-origin', signal:controller.signal });
      if (!response.ok) return;
      const body = await response.json();
      if (version === revision && Array.isArray(body.wishes)) renderWishes(body.wishes);
    } catch { /* Read failure never creates wishes or a submission acknowledgment. */ }
  }
  function fitNames(){all('.hero-name,.inv-groom,.inv-bride').forEach(el=>{el.style.fontSize='';let size=parseFloat(getComputedStyle(el).fontSize);while(size>18 && (el.scrollWidth>el.clientWidth+1 || el.clientHeight>(parseFloat(getComputedStyle(el).lineHeight)||size)*2+2))el.style.fontSize=(--size)+'px';});}
  window.addEventListener('resize',fitNames);
  function apply() {
    const t = words[locale]; data = current.variants[locale];
    document.documentElement.lang = locale;
    document.title = data.title || data.people.join(' & ') || t.title;
    const bindings = {
      '.splash-btn span':t.open, '.hero-pre':t.pre, '.hero-date-label':data.eventLabel || t.tag,
      '.hero-scroll-hint span':t.scroll, '.inv-bless':data.greeting || t.bless, '.inv-family':data.hosts,
      '.inv-invite-word':t.invite, '.inv-invite-text':data.message, '.inv-on':t.on,
      '.events .section-title':data.programHeading || t.events, '.events .section-subtitle':t.program,
      '.venue .section-title':t.venue, '.venue-text':t.waiting, '.map-btn span':t.map,
      '.venue-place':data.venue.name, '.venue-address':[data.venue.address,data.venue.landmark].filter(Boolean).join('\n'),
      '.wishes .section-title':t.wishes, '.wishes-subtitle':t.wishesSub, '.wish-btn span':t.send,
      '.countdown-label':t.countdown, '.countdown-msg':t.closing, '.footer-thanks':t.thanks,
      '.inv-groom':data.people[0], '.inv-bride':data.people[1], '.footer-names':data.people.join(' & '),
      '.splash-initial-1':Array.from(data.people[0] || '')[0]?.toLocaleUpperCase(),
      '.splash-initial-2':Array.from(data.people[1] || '')[0]?.toLocaleUpperCase(),
    };
    Object.entries(bindings).forEach(([selector,value]) => text(selector,value));
    all('.hero-name').forEach((el,i) => { el.textContent = data.people[i] || ''; el.hidden = !data.people[i]; });
    hide('.hero-and,.inv-amp,.splash-amp', data.people.length < 2);
    hide('.inv-family', !data.hosts); hide('.inv-invite-text', !data.message);
    text('.hero-day', data.date?.day); text('.hero-year', data.date?.year); text('.hero-month', data.date?.month);
    text('.splash-date,.inv-date-big', data.date?.full);
    text('.footer-date', data.date ? `${data.date.day} · ${data.date.month} · ${data.date.year}` : '');
    hide('.hero-date-box,.inv-on,.inv-date-big,.countdown', !data.date);
    window.__gardenEventDate = data.date ? new Date(data.date.instant) : new Date(NaN);
    all('.cd-label').forEach((el,i) => { el.textContent = t.units[i]; });
    const timeline = $('.timeline'); timeline.querySelectorAll('.timeline-item').forEach(el => el.remove());
    data.program.forEach(row => {
      const el = rowTemplate.cloneNode(true); el.dataset.programId = row.id;
      el.querySelector('.tc-time').textContent = row.time;
      el.querySelector('.tc-title').textContent = row.title;
      el.querySelector('.tc-desc').textContent = row.description;
      el.querySelector('.tc-desc').hidden = !row.description;
      el.querySelector('.tc-icon')?.remove(); // Source's owner-authored rows omit demo icons.
      timeline.append(el);
    });
    hide('.events,.st-3', !data.program.length);
    const mapUrl = safeUrl(data.venue.mapUrl);
    $('.map-btn').href = mapUrl || '#'; hide('.map-btn', !mapUrl);
    hide('.venue', !data.venue.name && !data.venue.address && !mapUrl);
    hide('.wishes', !data.wishesEnabled);
    for (const [selector,label] of [['.wish-input',t.name],['.wish-textarea',t.wish]]) {
      $(selector).placeholder = label; $(selector).setAttribute('aria-label', label);
    }
    if (current.guestName && !$('.wish-input').value) $('.wish-input').value = current.guestName;
    $('#musicClose').setAttribute('aria-label',t.dismiss); $('#musicClose').title = t.dismiss;
    $('#splash').setAttribute('aria-label',t.open);
    text('.inv-daughter',data.brideFamily);hide('.inv-daughter',!data.brideFamily);
    text('.info-title',data.reminderTitle);text('.info-text',data.reminderText);hide('.info',!data.reminderTitle && !data.reminderText);
    if(data.footerNote!==null)text('.footer-thanks',data.footerNote);
    if(current.preview)renderWishes(data.sampleWishes || []);
    renderLanguages(t);
    reducedMotion(); setMusic();
    window.gardenReveal?.();fitNames();document.fonts.ready.then(fitNames);
    document.documentElement.removeAttribute('data-awaiting-data');
  }
  function renderLanguages(t) {
    const sw = $('.taklifla-lang-switch'), menu = $('.taklifla-lang-menu');
    const toggle = $('.taklifla-lang-toggle'); sw.setAttribute('aria-label',t.language);
    toggle.setAttribute('aria-label',t.language); text('.taklifla-lang-current',({'uz-Latn':'UZ','uz-Cyrl':'ЎЗ',en:'EN',ru:'RU'})[locale]);
    menu.replaceChildren();
    current.enabledLocales.forEach(language => {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.lang = language;
      button.setAttribute('role','menuitemradio'); button.setAttribute('aria-checked',String(language === locale));
      button.textContent = ({'uz-Latn':'O‘zbekcha','uz-Cyrl':'Ўзбекча',en:'English',ru:'Русский'})[language];
      button.classList.toggle('active',language === locale);
      button.addEventListener('click', () => { locale = language; status.textContent = ''; apply(); closeLanguage(); toggle.focus(); });
      menu.append(button);
    });
    sw.hidden = current.enabledLocales.length < 2;
  }
  function closeLanguage() { $('.taklifla-lang-switch').classList.remove('open'); $('.taklifla-lang-toggle').setAttribute('aria-expanded','false'); }
  $('.taklifla-lang-toggle').addEventListener('click', event => {
    event.stopPropagation(); const open = $('.taklifla-lang-switch').classList.toggle('open');
    event.currentTarget.setAttribute('aria-expanded',String(open));
    if (open) $('.taklifla-lang-menu button')?.focus();
  });
  document.addEventListener('click', event => { if (!$('.taklifla-lang-switch').contains(event.target)) closeLanguage(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeLanguage(); $('.taklifla-lang-toggle').focus(); } });
  $('#splash').addEventListener('click', () => { $('#mainContent').inert = false; $('.hero-scroll-hint').setAttribute('tabindex','-1'); $('.hero-scroll-hint').focus({preventScroll:true}); }, true);
  $('#splash').addEventListener('keydown', event => { if (event.target === $('#splash') && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); $('#splash').click(); } });
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (!current || submitting) return;
    const t = words[locale], name = $('.wish-input').value.trim(), message = $('.wish-textarea').value.trim();
    status.dataset.error = 'false';
    if (!name || !message) { status.textContent = t.invalid; status.dataset.error = 'true'; return; }
    if (current.preview) { status.textContent = t.preview; return; }
    if (!data.wishesEnabled || !current.invitationId) return;
    const version = revision, button = $('.wish-btn'), envelope = current;
    submitting = true; button.disabled = true; status.textContent = '';
    try {
      const body = {name,message}; if (envelope.guestToken) body.guestToken = envelope.guestToken;
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(envelope.invitationId)}/wishes`, {
        method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body), signal:controller.signal,
      });
      if (!response.ok || (await response.json()).ok !== true) throw new Error('Wish not acknowledged');
      if (version !== revision) return;
      form.hidden = true; status.textContent = words[locale].pending;
      // A pending submission is never appended to the approved public list.
      void loadWishes();
    } catch {
      if (version === revision) { status.textContent = words[locale].error; status.dataset.error = 'true'; }
    } finally { if (version === revision) { submitting = false; button.disabled = false; } }
  });
  function receive(message) {
    const p = message?.payload;
    if (message?.type !== 'taklifla-gulbog:update' || !p || !Array.isArray(p.enabledLocales) || !p.enabledLocales.length || !p.variants) return;
    if (!p.enabledLocales.every(l => words[l] && p.variants[l])) return;
    const identityChanged = current && current.invitationId !== p.invitationId;
    revision++; controller?.abort(); controller = new AbortController();
    if (identityChanged) { audio.pause(); musicChoice = false; musicPlayed = false; dismissed = false; $('#musicCluster').classList.remove('dismissed'); form.reset(); }
    current = p; locale = p.enabledLocales.includes(p.locale) ? p.locale : p.enabledLocales[0];
    status.textContent = ''; form.hidden = false; submitting = false; $('.wish-btn').disabled = false; list.replaceChildren();
    reducedMotion(); apply();
    if (!started) { started = true; window.startGardenSource(); installMusicControls(); window.gardenReveal(); }
    setMusic(); void loadWishes();
  }
  window.addEventListener('message', event => { if (event.origin === location.origin && event.source === parent) receive(event.data); });
  window.addEventListener('pagehide', () => { controller?.abort(); audio.pause(); clearInterval(window.__gardenCountdown); });
})();
