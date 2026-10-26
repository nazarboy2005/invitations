/* Typed platform adapter. The source renderer has no database or provider-runtime dependency. */
(() => {
  'use strict';
  const ID = 'wedivo-pulau-sehati';
  const $ = id => document.getElementById(id);
  let current, fingerprint='', started=false;
  const safeUrl = value => {try { const url=new URL(value,location.origin);return value && ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}};
  const text = (id,value) => {const n=$(id);if(n){n.textContent=value??'';n.dataset.authored='true';}};
  const show = (id,on) => {if($(id))$(id).hidden=!on;};
  const section = (id,on) => {show('sec-'+id,on);show('nav-'+id,on);};
  const image = (id,item) => {const n=$(id);if(n){n.removeAttribute('src');n.setAttribute('data-src',safeUrl(item?.src));n.alt=item?.alt || item?.caption || '';}};
  const feedbackCopy = {
    'uz-Latn': ['Ko‘rish rejimida yuborib bo‘lmaydi.','Yuborilmadi. Qayta urinib ko‘ring.','Javobingiz saqlandi. Rahmat!','Tilagingiz yuborildi. Egasi tasdiqlagach ko‘rinadi.','Ismingiz','Tilagingiz','Tilaklar'],
    'uz-Cyrl': ['Кўриш режимида юбориб бўлмайди.','Юборилмади. Қайта уриниб кўринг.','Жавобингиз сақланди. Раҳмат!','Тилагингиз юборилди. Эгаси тасдиқлагач кўринади.','Исмингиз','Тилагингиз','Тилаклар'],
    en: ['Sending is disabled in preview.','Could not send. Please try again.','Your reply was saved. Thank you!','Your wish was sent. It will appear after host approval.','Your name','Your wish','Wishes'],
    ru: ['Отправка в режиме просмотра отключена.','Не удалось отправить. Попробуйте ещё раз.','Ваш ответ сохранён. Спасибо!','Пожелание отправлено. Оно появится после одобрения хозяином.','Ваше имя','Ваше пожелание','Пожелания'],
  };
  const ui = index => feedbackCopy[current?.locale || 'uz-Latn'][index];
  function translateTree(root) {
    if (!root || root.nodeType===1 && root.closest('[data-authored],script,style,template'))return;
    const apply = node => {
      if (!node.parentElement || node.parentElement.closest('[data-authored],script,style,template'))return;
      const value=node.textContent.trim().replace(/\s+/g,' ');
      let next=window.PulauCopy.translate(value,current.locale);
      if (/^(Lokasi|Joy) \d+$/.test(value))next=({en:'Location',ru:'Место','uz-Latn':'Joy','uz-Cyrl':'Жой'}[current.locale])+' '+value.match(/\d+$/)[0];
      if (next!==value)node.textContent=node.textContent.replace(node.textContent.trim(),next);
    };
    if(root.nodeType===3)apply(root);
    else {
      const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      let node;while(node=walk.nextNode())apply(node);
      for(const n of root.querySelectorAll('[aria-label]')) {const next=window.PulauCopy.translate(n.getAttribute('aria-label'),current.locale);n.setAttribute('aria-label',next);}
    }
  }
  function bind(p) {
    current=p;const d=p.data;const t=value=>window.PulauCopy.translate(value,p.locale);
    window.PULAU={...p,compass:({'uz-Latn':['Sh','Shq','J','G‘'],'uz-Cyrl':['Ш','Шқ','Ж','Ғ'],en:['N','E','S','W'],ru:['С','В','Ю','З']}[p.locale]),gallery:d.gallery.filter(item=>safeUrl(item.src)),deadline:d.rsvp.deadline || '',timeLabel:d.date.time,secondaryEvent:{...d.pulau?.secondaryEvent,timeLabel:d.pulau?.secondaryEvent?.time || ''},translate:t,storyIds:d.story.map((_,i)=>i+1)};
    document.documentElement.lang=p.locale;if(p.reducedMotion)document.documentElement.dataset.reducedMotion='true';
    const couple=[d.groom,d.bride].filter(Boolean).join(' & ');
    if(Math.max(d.groom.length,d.bride.length)>22){$('hero-title').style.fontSize='clamp(26px,9.4vw,44px)';for(const who of ['groom','bride'])$('cs-'+who+'-name').style.fontSize='clamp(24px,8vw,36px)';$('cover-names').style.fontSize='clamp(18px,5.8vw,28px)';}
    document.title=[couple,'Ko‘ngillar oroli'].filter(Boolean).join(' · ');
    for(const who of ['groom','bride']) {
      for(const id of ['cover-'+who,'hero-'+who,'cs-'+who+'-name','cs-'+who+'-full','cs-tab-'+who+'-n','cr-cast-'+who,'lg-'+who])text(id,d[who]);
      text('cs-'+who+'-parents',d.hosts);text('cs-'+who+'-initial',d[who]?.slice(0,1));
      image('cs-'+who+'-photo',window.PULAU.gallery[who==='groom'?0:1]);
    }
    for(const id of ['guest-greeting-name','hero-guest-name','hud-pname-guest','cr-guest-name','dc-mirror-guest'])text(id,p.guestName);
    for(const id of ['hero-greeting'])text(id,d.greeting);
    for(const id of ['hero-sub','hero-intro','cr-message'])text(id,d.message);
    text('guide-line-src',t('Selamat datang di')+' Ko‘ngillar oroli');text('couple-line-src',d.message);
    text('hero-initials',d.monogram);text('cover-kicker-text',d.eventType);text('cover-foot',couple+' · ');const year=document.createElement('span');year.id='cover-year';year.textContent=d.date.year;$('cover-foot').append(year);
    text('hero-venue-name',d.venue.name);text('ev-1-name',d.eventType);text('ev-1-venue-name',d.venue.name);text('ev-1-addr',d.venue.address);
    text('vn-name',d.venue.name);text('vn-addr-text',d.venue.address);text('vn-note-text',p.landmark);
    text('cr-family',d.hosts);text('tz-src',d.timezone);
    text('cr-fam-role',d.hostsLabel);image('hero-photo',window.PULAU.gallery[0]);
    for(const who of ['groom','bride']) {
      for(const id of ['class','origin','skill-row','item-row','ig'])show('cs-'+who+'-'+id,false);
    }
    const extra=d.pulau || {};
    text('quote-arabic',extra.inscription?.arabic);text('quote-text',extra.inscription?.text);text('quote-source',extra.inscription?.attribution);
    for(const [index,who] of ['groom','bride'].entries()) {const profile=extra.profiles?.[index] || {};text('cs-'+who+'-parents',profile.bio || d.hosts);text('cs-'+who+'-class-text',profile.characterClass);text('cs-'+who+'-origin-text',profile.origin);text('cs-'+who+'-skill',profile.skill);text('cs-'+who+'-item',profile.item);text('cs-'+who+'-stats-src',profile.stats);show('cs-'+who+'-class',!!profile.characterClass);show('cs-'+who+'-origin',!!profile.origin);show('cs-'+who+'-skill-row',!!profile.skill);show('cs-'+who+'-item-row',!!profile.item);}
    section('prasasti',!!(extra.inscription?.arabic || extra.inscription?.text));
    for(const [index,hotel] of (extra.hotels || []).entries()) {const n=index+1;text(`inn-${n}-name`,hotel.name);text(`inn-${n}-addr-text`,hotel.address);text(`inn-${n}-dist-text`,hotel.distance);text(`inn-${n}-price-text`,hotel.price);text(`inn-${n}-note`,hotel.note);if(safeUrl(hotel.bookingUrl))$(`inn-${n}-link`).href=safeUrl(hotel.bookingUrl);else $(`inn-${n}-link`).hidden=true;}
    section('hotel',(extra.hotels || []).some(h=>h.name));
    text('cr-coinviters',extra.coInviters);show('cr-co',!!extra.coInviters);
    text('vid-intro',extra.media?.intro);$('vid-el').setAttribute('data-src',safeUrl(extra.media?.videoUrl));if(safeUrl(extra.media?.liveUrl))$('vid-live-link').href=safeUrl(extra.media.liveUrl);section('video',!!(extra.media?.videoUrl || extra.media?.liveUrl));
    for(let n=1;n<=5;n++){const item=extra.missions?.[n-1];text(`mq-${n}-title`,item?.title);text(`mq-${n}-desc`,item?.description);text(`mq-${n}-reward`,item?.reward);}
    section('misi',(extra.missions || []).some(m=>m.title || m.description));
    for(let n=1;n<=6;n++){const item=extra.keepsakes?.[n-1];text(`hj-${n}-name`,item?.name);text(`hj-${n}-story`,item?.anecdote);text(`hj-${n}-icon`,item?.icon);}
    section('harta',(extra.keepsakes || []).some(k=>k.name));text('cr-hashtag-t',extra.hashtag);show('cr-hashtag-row',!!extra.hashtag);
    section('gifts',!!extra.giftWell?.enabled);
    text('gift-amount-lbl',extra.giftWell?.currencyLabel || 'UZS');
    const giftNotice={"uz-Latn":"Bu sovg‘a niyati egasiga yuboriladi; pul o‘tkazilmaydi.","uz-Cyrl":"Бу совға нияти эгасига юборилади; пул ўтказилмайди.",en:"This records a gift intention for the hosts; no money is transferred.",ru:"Это только намерение подарка для хозяев; деньги не переводятся."}[p.locale];
    text('gifts-intro',giftNotice);text('gift-ok-title',({"uz-Latn":"Niyatingiz yuborildi","uz-Cyrl":"Ниятингиз юборилди",en:"Intention sent",ru:"Намерение отправлено"})[p.locale]);text('gift-ok-text',giftNotice);
    section('kisah',d.story.length>0);
    const prototype=$('ach-4');
    for(let n=5;n<=d.story.length;n++) {
      const row=prototype.cloneNode(true);
      for(const el of [row,...row.querySelectorAll('[id]')])el.id=el.id.replace('ach-4','ach-'+n);
      for(const el of row.querySelectorAll('[aria-controls]'))el.setAttribute('aria-controls',el.getAttribute('aria-controls').replace('ach-4','ach-'+n));
      $('ach-list').insertBefore(row,$('ach-next'));
    }
    for(let n=1;n<=Math.max(4,d.story.length);n++) {
      const story=d.story[n-1];show('ach-'+n,!!story);
      if(story) { $('ach-'+n).dataset.itemId=story.id;text('ach-'+n+'-title',story.title);text('ach-'+n+'-text',story.text);text('ach-'+n+'-date',d.pulau?.storyDates?.[story.id] || ''); }
    }
    text('wedivo-rundown-data',JSON.stringify(d.program.map(row=>({id:row.id,title:row.title,description:row.description,date:p.date,startTime:row.time,isAllDay:false}))));
    const second=extra.secondaryEvent || {};show('ev-2',!!second.enabled && !!second.label && !!second.date);text('ev-2-name',second.label);text('ev-2-venue-name',second.venueName);text('ev-2-addr',second.address);show('ev-note',false);show('ev-reward',false);
    section('rsvp',d.rsvp.enabled);section('wishes',d.wishesEnabled);
    show('rsvp-pax-fld',false);show('rsvp-pax-row',false);show('member-pax',false);show('rsvp-checkin',false);show('wish-more',false);
    $('rsvp-pax').value='1';$('rsvp-name').value=p.guestName || '';$('wish-name').value=p.guestName || '';
    $('rsvp-name').maxLength=120;$('wish-name').maxLength=120;$('rsvp-msg').maxLength=1000;$('wish-msg').maxLength=1000;
    $('rsvp-name').placeholder=ui(4);$('wish-name').placeholder=ui(4);$('wish-msg').placeholder=ui(5);
    section('dresscode',d.dressCode.enabled);text('dresscode-intro',d.dressCode.text);text('dc-note',d.dressCode.note);text('dresscode-kick-place',d.dressCode.style);
    const swatches=[...document.querySelectorAll('.swatch')];
    const swatchPrototype=swatches.at(-1);
    for(let n=swatches.length;n<d.dressCode.colors.length;n++) {const clone=swatchPrototype.cloneNode(true);for(const node of [clone,...clone.querySelectorAll('[id]')])node.id=node.id.replace(/dc-sw-\d+/,`dc-sw-${n+1}`);swatchPrototype.parentNode.append(clone);swatches.push(clone);}
    swatches.forEach((node,i)=>{const color=d.dressCode.colors[i];node.hidden=!color;if(color){node.dataset.color=color.hex;node.style.setProperty('--sw',color.hex);node.querySelector('.swatch-fab')?.style.setProperty('--sw',color.hex);node.style.setProperty('--c',color.hex);node.setAttribute('aria-label',color.name);text('dc-sw-'+(i+1)+'-name',color.name);}});
    $('bgm').setAttribute('data-src',d.music.enabled?safeUrl(d.music.url):'');
    show('btn-sound',d.music.enabled && !!safeUrl(d.music.url));
    section('gallery',window.PULAU.gallery.length>0 || p.preview);
    if(p.preview && !window.PULAU.gallery.length)for(let i=0;i<d.gallery.length;i++){const cell=document.createElement('div');cell.className='gal-cell';cell.setAttribute('aria-hidden','true');cell.style.background='var(--cream)';$('gal-grid').append(cell);}
    const picker=document.createElement('div');picker.className='platform-locales';picker.setAttribute('aria-label',({en:'Language',ru:'Язык','uz-Latn':'Til','uz-Cyrl':'Тил'}[p.locale]));
    const labels={'uz-Latn':'Uz','uz-Cyrl':'Уз',en:'En',ru:'Ru'};
    for(const locale of p.enabledLocales){const b=document.createElement('button');b.type='button';b.textContent=labels[locale];b.setAttribute('aria-pressed',String(locale===p.locale));b.addEventListener('click',()=>parent.postMessage({type:ID+':locale',locale},location.origin));picker.append(b);}
    document.body.append(picker);
    translateTree(document.body);
    new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')translateTree(record.target);else for(const node of record.addedNodes)translateTree(node);}}).observe(document.body,{subtree:true,childList:true,characterData:true});
    renderWishes(p.preview?d.wishes:[]);
    document.documentElement.dataset.bound='true';
    const script=document.createElement('script');script.src='source/template.js';
    script.onload=()=>{started=true;afterSource();};document.body.append(script);
  }
  function afterSource() {
    const d=current.data;
    for(const id of ['hero-day','ev-1-day'])text(id,d.date.long);
    text('hero-time',d.date.time);text('hero-cal-m',d.date.month);text('hero-cal-d',d.date.day);text('hero-cal-y',d.date.year);
    text('rsvp-deadline-date',current.deadlineLabel || '');
    for(const link of [$('vn-dir'),$('ev-1-map')]) {if(safeUrl(d.venue.mapUrl))link.href=safeUrl(d.venue.mapUrl);else if(!d.venue.address && !d.venue.name)link.hidden=true;}
    if(!current.preview && d.music.enabled && !current.silentPlayback && window.PULAU.soundAllowed){const audio=$('bgm');audio.src=safeUrl(d.music.url);audio.volume=.55;void audio.play().catch(()=>{});}
    if(!current.preview && d.wishesEnabled)void loadWishes();
  }
  function renderWishes(wishes) {
    $('wish-list').replaceChildren();
    for(const wish of wishes){const row=$('wish-tpl').content.firstElementChild.cloneNode(true);row.dataset.authored='true';row.querySelector('[data-field=name]').textContent=wish.name || '';row.querySelector('[data-field=message]').textContent=wish.message || wish.text || '';const date=row.querySelector('[data-field=date]');if(date)date.textContent=wish.submittedAt?new Date(wish.submittedAt).toLocaleDateString(current.intlLocale):'';$('wish-list').append(row);}
  }
  async function loadWishes() {try{const response=await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/wishes`,{credentials:'same-origin'});if(response.ok)renderWishes((await response.json()).wishes || []);}catch{/* Empty list is retained on service failure. */}}
  function feedback(form,message) {let node=form.querySelector('[data-platform-feedback]');if(!node){node=document.createElement('p');node.dataset.platformFeedback='';node.className='form-feedback';node.setAttribute('role','status');node.setAttribute('aria-live','polite');form.append(node);}node.textContent=message;}
  document.querySelectorAll('[data-wedivo-status]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-wedivo-status]').forEach(other=>{other.classList.toggle('is-selected',other===button);other.setAttribute('aria-pressed',String(other===button));});}));
  for(const [id,kind] of [['rsvp-form','rsvp'],['wish-form','wishes']])$(id).addEventListener('submit',async event=>{
    event.preventDefault();const form=event.currentTarget;
    if(!current || current.preview){feedback(form,ui(0));return;}
    if(form.dataset.sending)return;
    const input=new FormData(form);const status={attending:'yes',not_attending:'no',maybe:'maybe'}[form.querySelector('[data-wedivo-status].is-selected')?.dataset.wedivoStatus];
    if(kind==='rsvp' && !status){feedback(form,window.PULAU.translate('Pilih dulu apakah kamu ikut, ya — lalu kirim lagi.'));return;}
    const body=kind==='rsvp'?{name:input.get('name'),status,partySize:status==='yes'?1:0,note:input.get('message') || ''}:{name:input.get('name'),message:input.get('message')};
    if(current.guestToken)body.guestToken=current.guestToken;
    form.dataset.sending='true';form.querySelector('[type=submit]').disabled=true;
    try{const response=await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/${kind}`,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!response.ok)throw Error();if(kind==='rsvp'){form.classList.add('is-submitted');text('member-note',ui(2));}else{$('wish-msg').value='';}feedback(form,ui(kind==='rsvp'?2:3));}
    catch{feedback(form,ui(1));}
    finally{delete form.dataset.sending;form.querySelector('[type=submit]').disabled=false;}
  });
  $('gift-form').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget;if(!current || current.preview)return;if(form.dataset.sending)return;const input=new FormData(form);const body={name:input.get('senderName'),amount:Number(input.get('amount')),message:input.get('message')||''};if(current.guestToken)body.guestToken=current.guestToken;form.dataset.sending='true';form.querySelector('[type=submit]').disabled=true;try{const response=await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/gift-intentions`,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!response.ok)throw Error();form.classList.add('is-submitted');form.reset();let node=form.querySelector('[data-platform-feedback]');if(!node){node=document.createElement('p');node.dataset.platformFeedback='';node.className='form-feedback';node.setAttribute('role','status');form.append(node);}node.textContent=giftNotice;}catch{let node=form.querySelector('[data-platform-feedback]');if(!node){node=document.createElement('p');node.dataset.platformFeedback='';node.className='form-feedback';node.setAttribute('role','status');form.append(node);}node.textContent=ui(1);}finally{delete form.dataset.sending;form.querySelector('[type=submit]').disabled=false;}});
  const accept=p=>{const next=JSON.stringify(p);if(next===fingerprint)return;if(fingerprint){window.name=JSON.stringify({type:ID+':update',payload:p});location.reload();return;}fingerprint=next;bind(p);};
  addEventListener('message',event=>{if(event.source===parent && event.origin===location.origin && event.data?.type===ID+':update')accept(event.data.payload);});
  let initial;try{initial=JSON.parse(window.name);}catch{/* The host supplies the first payload after frame load. */}
  if(initial?.type===ID+':update')accept(initial.payload);
})();
