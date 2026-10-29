/* Platform contract and services only. Source CSS/motion stay separate. */
(() => {
  'use strict';
  const TYPE = 'taklifla-yulduzli-tun:update';
  let generation=0, context='',pending=false,wishItems=[];
  let payload, locale, initialized = false, readVersion = 0, submittedFor = '', explicitPause = false, musicUrl = '';
  const $ = selector => document.querySelector(selector);
  const text = (selector, value) => { const el = $(selector); if (el) el.textContent = value || ''; };
  const labels = {
    'uz-Latn': {
      splash_sub: 'Sizni taklif etamiz', open_btn: 'Taklifnomani ochish', hero_tag: 'Nikoh to‘yi', scroll: 'Pastga suring', invite_welcome: 'Eng go‘zal kunimizga xush kelibsiz', events_title: 'To‘y dasturi', venue_label: 'Manzil', map_btn: 'Xaritani ochish ✦', wishes_title: 'Tilak yuboring', ph_name: 'Ismingiz', ph_wish: 'Juftlikka tilaklaringizni yozing…', wish_btn: 'Tilak yuborish ✦', cd_title: 'Qolgan vaqt', days: 'Kun', hours: 'Soat', mins: 'Daq', secs: 'Son', footer_msg: 'Quvonchimizga sherik bo‘lganingiz uchun rahmat', play: 'Musiqani yoqish', pause: 'Musiqani to‘xtatish', language: 'Til', preview: 'Bu namuna. Tilak yuborilmadi.', pending: 'Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.', error: 'Tilakni yuborib bo‘lmadi. Qayta urinib ko‘ring.', loading: 'Yuborilmoqda…', loadError: 'Tilaklarni yuklab bo‘lmadi.'
    },
    'uz-Cyrl': {
      splash_sub: 'Сизни таклиф этамиз', open_btn: 'Таклифномани очиш', hero_tag: 'Никоҳ тўйи', scroll: 'Пастга суринг', invite_welcome: 'Энг гўзал кунимизга хуш келибсиз', events_title: 'Тўй дастури', venue_label: 'Манзил', map_btn: 'Харитани очиш ✦', wishes_title: 'Тилак юборинг', ph_name: 'Исмингиз', ph_wish: 'Жуфтликка тилакларингизни ёзинг…', wish_btn: 'Тилак юбориш ✦', cd_title: 'Қолган вақт', days: 'Кун', hours: 'Соат', mins: 'Дақ', secs: 'Сон', footer_msg: 'Қувончимизга шерик бўлганингиз учун раҳмат', play: 'Мусиқани ёқиш', pause: 'Мусиқани тўхтатиш', language: 'Тил', preview: 'Бу намуна. Тилак юборилмади.', pending: 'Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.', error: 'Тилакни юбориб бўлмади. Қайта уриниб кўринг.', loading: 'Юборилмоқда…', loadError: 'Тилакларни юклаб бўлмади.'
    },
    en: {
      splash_sub: 'You are invited', open_btn: 'Open invitation', hero_tag: 'Wedding celebration', scroll: 'Scroll', invite_welcome: 'Welcome to our best day', events_title: 'Wedding events', venue_label: 'Venue', map_btn: 'Open map ✦', wishes_title: 'Send your wishes', ph_name: 'Your name', ph_wish: 'Write your wishes to the couple…', wish_btn: 'Send wishes ✦', cd_title: 'Counting down', days: 'Days', hours: 'Hours', mins: 'Min', secs: 'Sec', footer_msg: 'Thank you for sharing our joy', play: 'Play music', pause: 'Pause music', language: 'Language', preview: 'This is a preview. Your wish was not sent.', pending: 'Your wish was sent. It will appear after approval.', error: 'Could not send your wish. Please try again.', loading: 'Sending…', loadError: 'Could not load wishes.'
    },
    ru: {
      splash_sub: 'Вы приглашены', open_btn: 'Открыть приглашение', hero_tag: 'Свадебное торжество', scroll: 'Прокрутите вниз', invite_welcome: 'Добро пожаловать в наш лучший день', events_title: 'Программа свадьбы', venue_label: 'Место проведения', map_btn: 'Открыть карту ✦', wishes_title: 'Отправьте пожелание', ph_name: 'Ваше имя', ph_wish: 'Напишите пожелания молодожёнам…', wish_btn: 'Отправить пожелание ✦', cd_title: 'До торжества', days: 'Дней', hours: 'Часов', mins: 'Мин', secs: 'Сек', footer_msg: 'Спасибо, что разделяете нашу радость', play: 'Включить музыку', pause: 'Приостановить музыку', language: 'Язык', preview: 'Это образец. Пожелание не отправлено.', pending: 'Пожелание отправлено и появится после одобрения.', error: 'Не удалось отправить пожелание. Попробуйте ещё раз.', loading: 'Отправка…', loadError: 'Не удалось загрузить пожелания.'
    }
  };
  const L = () => labels[locale] || labels['uz-Latn'];
  function status(key){$('#wishStatus').dataset.statusKey=key;text('#wishStatus',key?L()[key]:'');}
  function wishCards(){const list=$('#wishList');list.replaceChildren();for(const w of wishItems){const card=document.createElement('div');card.className='w-card';for(const [cls,value] of [['w-author',w.name],['w-msg',w.message||w.text]]){const el=document.createElement('p');el.className=cls;el.textContent=cls==='w-msg'?'"'+value+'"':value;card.append(el);}list.append(card);}}
  const safeUrl = value => typeof value === 'string' && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) ? value : '';
  const endpoint = () => '/api/public/invitations/' + encodeURIComponent(payload.invitationId) + '/wishes';
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  function motion() {
    window.starryReducedMotion = motionQuery.matches || payload.reducedMotion;
    document.documentElement.toggleAttribute('data-reduced-motion', window.starryReducedMotion);
    if (!window.starryReducedMotion && window.starryResumeParticles && !document.hidden) {
      const draw = window.starryResumeParticles; window.starryResumeParticles = null; draw();
    }
  }
  motionQuery.addEventListener('change', () => { if (payload) motion(); });
  function musicState() {
    const audio = $('#bgMusic'), button = $('#musicBtn');
    const playing = !audio.paused;
    button.classList.toggle('playing', playing);
    button.setAttribute('aria-pressed', String(playing));
    button.title = button.ariaLabel = playing ? L().pause : L().play;
  }
  window.starryTryMusic = () => {
    if (!payload || !payload.music.enabled || !musicUrl || explicitPause || payload.silentPlayback) return;
    $('#bgMusic').play().then(musicState).catch(musicState);
  };
  function renderMusic() {
    const audio = $('#bgMusic'), url = payload.music.enabled ? safeUrl(payload.music.url) : '';
    if (musicUrl !== url) {
      musicUrl = url; audio.pause();
      if (url) audio.src = url; else { audio.removeAttribute('src'); audio.load(); }
    }
    audio.muted = !!payload.silentPlayback;
    $('#musicBtn').hidden = !url || payload.silentPlayback;
    if (!url || payload.silentPlayback) audio.pause();
    musicState();

  }
  function render() {
    const data = payload.variants[locale], copy = L();
    document.documentElement.lang = locale;
    document.title = data.title || 'Yulduzli Tun';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = copy[el.dataset.i18n] || ''; });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = copy[el.dataset.i18nPh] || ''; el.ariaLabel = el.placeholder; });
    text('.splash-sub', data.greeting || copy.splash_sub);
    text('.hero-tag', data.eventLabel || copy.hero_tag);
    const pair = data.people.join(' & ');
    ['.splash-names', '.invite-names', '.footer-names'].forEach(selector => text(selector, pair));
    document.querySelectorAll('.mono-l').forEach((el, index) => { el.textContent = Array.from(data.people[index] || '')[0]?.toUpperCase() || ''; });
    $('.mono-a').hidden = data.people.length < 2;
    const hero = $('.hero-names'); hero.replaceChildren();
    data.people.forEach((name, index) => {
      if (index) { const amp = document.createElement('span'); amp.className = 'hero-amp'; amp.textContent = '&'; hero.append(amp); }
      hero.append(document.createTextNode(name));
    });
    text('.invite-fam', data.hosts); $('.invite-fam').hidden = !data.hosts;
    text('.invite-txt', data.message); $('.invite-txt').hidden = !data.message;
    text('.hero-date', data.dottedDate); text('.footer-date', data.dottedDate);
    text('.invite-day', data.weekday); text('.invite-dnum', data.day);
    $('.invite-my').replaceChildren(document.createTextNode(data.month), document.createElement('br'), document.createTextNode(data.year));
    text('.invite-venue', data.venueName); text('.venue-name', data.venueName);
    text('.venue-date', [data.longDate, data.time].filter(Boolean).join(' · '));
    text('.cd-date', data.shortDate);
    text('.info-card p',data.infoNote);$('.info').hidden=!data.infoNote;
    if(data.footerNote!==null)text('.footer-msg',data.footerNote);$('.footer-msg').hidden=data.footerNote==='';
    let address = $('.venue-address');
    if (!address) { address = document.createElement('p'); address.className = 'venue-address'; $('.venue-date').after(address); }
    address.textContent = data.address; address.hidden = !data.address;
    const map = safeUrl(data.mapUrl); $('.map-btn').hidden = !map; $('.map-btn').href = map;
    $('.venue').hidden = !(data.venueName || data.address || map);
    $('.invite-dateblock').hidden = !data.day;
    $('.countdown').hidden = !payload.instant;
    window.__WED_TS = Date.parse(payload.instant) || 0;
    text('.events .sec-title', data.programHeading || copy.events_title);
    const timeline = $('.timeline'); timeline.replaceChildren();
    for (const item of data.program) {
      const row = document.createElement('div'); row.className = 'tl-item rv'; row.dataset.programId = item.id;
      const dot = document.createElement('div'); dot.className = 'tl-dot';
      const card = document.createElement('div'); card.className = 'tl-card';
      for (const [tag, cls, value] of [['h3', '', item.title], ['p', 'tl-time', item.time], ['p', 'tl-desc', item.description]]) {
        if (!value) continue; const el = document.createElement(tag); el.className = cls; el.textContent = value; card.append(el);
      }
      row.append(dot, card); timeline.append(row);
    }
    $('.events').hidden = !data.program.length;
    $('.wishes').hidden = !payload.wishesEnabled;
    $('#wishName').maxLength = 100; $('#wishMsg').maxLength = 2000;
    if (!$('#wishName').value) $('#wishName').value = payload.guestName || '';
    const select = $('#localeSelect'); select.replaceChildren();
    const names = { 'uz-Latn': 'O‘zbekcha', 'uz-Cyrl': 'Ўзбекча', en: 'English', ru: 'Русский' };
    for (const language of payload.enabledLocales) { const option = document.createElement('option'); option.value = language; option.textContent = names[language]; select.append(option); }
    select.value = locale; select.ariaLabel = copy.language; $('.starry-language').hidden = payload.enabledLocales.length < 2;
    text('.taklifla-lang-current',{'uz-Latn':'UZ','uz-Cyrl':'ЎЗ',en:'EN',ru:'RU'}[locale]);document.querySelectorAll('[data-lang]').forEach(b=>{b.hidden=!payload.enabledLocales.includes(b.dataset.lang);b.classList.toggle('active',b.dataset.lang===locale);b.setAttribute('aria-checked',String(b.dataset.lang===locale));});$('.taklifla-lang-switch').hidden=payload.enabledLocales.length<2;$('.starry-language').hidden=true;
    if(payload.preview)wishItems=data.wishes||[];wishCards();const key=$('#wishStatus').dataset.statusKey;if(key)status(key);
    motion(); renderMusic();
    if (initialized) reveal();
  }
  function reveal() {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('shown'); observer.unobserve(entry.target); } }), { threshold: .15 });
    document.querySelectorAll('.rv:not(.shown)').forEach(el => observer.observe(el));
  }
  async function loadWishes(){const version=++readVersion;if(payload.preview){wishItems=payload.variants[locale].wishes||[];wishCards();return;}wishItems=[];wishCards();if(!payload.wishesEnabled)return;try{const r=await fetch(endpoint(),{credentials:'same-origin',cache:'no-store'});if(!r.ok)throw Error();const result=await r.json();if(version===readVersion){wishItems=Array.isArray(result.wishes)?result.wishes:[];wishCards();}}catch{if(version===readVersion)status('loadError');}}
  $('#wishForm').addEventListener('submit',async event=>{
    event.preventDefault();if(!payload||pending||!payload.wishesEnabled)return;if(payload.preview){status('preview');return;}if(!event.currentTarget.reportValidity())return;
    const name=$('#wishName').value.trim(),message=$('#wishMsg').value.trim();if(!name||!message||submittedFor===context)return;const version=generation,button=$('.wish-submit');pending=true;button.disabled=true;status('loading');
    try{const r=await fetch(endpoint(),{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,message,guestToken:payload.guestToken||undefined})});if(!r.ok)throw Error();const data=await r.json();if(data.ok!==true)throw Error();if(version===generation){submittedFor=context;status('pending');$('#wishMsg').value='';}}
    catch{if(version===generation)status('error');}finally{if(version===generation){pending=false;button.disabled=submittedFor===context;}}
  });
  $('#musicBtn').addEventListener('click', () => {
    const audio = $('#bgMusic');
    if (audio.paused) { explicitPause = false; window.starryTryMusic(); }
    else { explicitPause = true; audio.pause(); }
  });
  $('#bgMusic').addEventListener('play', musicState); $('#bgMusic').addEventListener('pause', musicState);
  $('#localeSelect').addEventListener('change', event => { locale = event.target.value; render(); });
  $('.taklifla-lang-toggle').addEventListener('click',()=>{const e=$('.taklifla-lang-switch');e.classList.toggle('open');$('.taklifla-lang-toggle').setAttribute('aria-expanded',String(e.classList.contains('open')));});
  $('.taklifla-lang-menu').addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(!b||!payload.enabledLocales.includes(b.dataset.lang))return;locale=b.dataset.lang;$('.taklifla-lang-switch').classList.remove('open');$('.taklifla-lang-toggle').setAttribute('aria-expanded','false');render();});
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== TYPE) return;
    const next = event.data.payload;
    if (!next?.variants || !next.enabledLocales?.includes(next.locale)) return;
    const nextContext=[next.invitationId,next.preview,next.wishesEnabled,next.guestToken].join(':');const changed=context!==nextContext;context=nextContext;
    payload = next; locale = next.locale;
    if (changed) { generation++;pending=false;submittedFor = ''; explicitPause = false; $('#wishForm').reset(); $('.wish-submit').disabled = false; status(''); }
    render();
    if (!initialized) {
      initialized = true;
      const script = document.createElement('script'); script.src = 'source/motion.js'; document.body.append(script);
      script.onload = () => { document.documentElement.removeAttribute('data-awaiting');document.documentElement.removeAttribute('data-awaiting-data');document.documentElement.dataset.ready='true'; };
    }
    if(changed)loadWishes();
  });
  fetch('source/labels.json').then(r=>r.json()).then(data=>{for(const [key,source]of Object.entries(data)){const target=key==='uz'?'uz-Latn':key;Object.assign(labels[target],Object.fromEntries(Object.entries(source).map(([k,v])=>[k,v.replaceAll('<br>','\n')])));}for(const key of Object.keys(data.uz))labels['uz-Cyrl'][key]=window.starryCyrl(data.uz[key].replaceAll('<br>','\n'));if(payload)render();});
  parent.postMessage({type:'starry:ready'},location.origin);
})();
