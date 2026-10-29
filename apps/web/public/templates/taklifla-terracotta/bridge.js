/* Shared invitation boundary. Native artwork, CSS and motion remain isolated. */
(() => {
  'use strict';
  const $=s=>document.querySelector(s), audio=$('#bgMusic');
  let p, labels, opened=false, paused=false, context='',generation=0,requestId=0,pending=false,sent=false,wishes=[];
  const text=(s,v)=>{const e=$(s);if(e)e.textContent=v??'';};
  const show=(s,v)=>{const e=$(s);if(e)e.hidden=!v;};
  const safe=v=>typeof v==='string'&&/^(https?:\/\/|\/(?!\/))/i.test(v)?v:'';
  const ui=()=>window.TERRACOTTA_COPY[p?.locale]||window.TERRACOTTA_COPY['uz-Latn'];
  const nativeLang=()=>p.locale==='en'?'en':p.locale==='ru'?'ru':'uz';
  const fixed=v=>p.locale==='uz-Cyrl'?window.terracottaCyrl(v):v;
  window.terracottaReduced=()=>!!p?.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  function status(key){$('#wishStatus').dataset.statusKey=key;text('#wishStatus',key?ui()[key]:'');}
  function musicState(){const playing=!audio.paused;$('#musicBtn').classList.toggle('playing',playing);$('#musicBtn').setAttribute('aria-pressed',String(playing));$('#musicBtn').setAttribute('aria-label',playing?ui().musicOff:ui().musicOn);}
  function play(){if(!paused&&!p?.silentPlayback&&audio.getAttribute('src'))audio.play().catch(()=>{musicState();$('#musicBtn').title=ui().musicUnavailable;});}
  $('#musicBtn').addEventListener('click',()=>{if(audio.paused){paused=false;play();}else{paused=true;audio.pause();}});
  ['play','pause','error','ended'].forEach(e=>audio.addEventListener(e,musicState));
  $('#openBtn').addEventListener('click',()=>{if(!p||opened)return;opened=true;$('#splash').inert=true;play();const h=$('.hero-names');h.tabIndex=-1;requestAnimationFrame(()=>h.focus({preventScroll:true}));});
  $('.taklifla-lang-toggle').addEventListener('click',()=>{const e=$('.taklifla-lang-switch');e.classList.toggle('open');$('.taklifla-lang-toggle').setAttribute('aria-expanded',String(e.classList.contains('open')));});
  $('.taklifla-lang-menu').addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(!b||!p.enabledLocales.includes(b.dataset.lang))return;$('.taklifla-lang-switch').classList.remove('open');$('.taklifla-lang-toggle').setAttribute('aria-expanded','false');parent.postMessage({type:'taklifla-terracotta:locale',locale:b.dataset.lang},location.origin);});
  function renderWishes(){
    const list=$('#wishesList');list.replaceChildren();
    if(!wishes.length){const e=document.createElement('div');e.className='wish-empty';e.textContent='';list.append(e);}
    for(const item of wishes){const e=document.createElement('div'),name=document.createElement('div'),msg=document.createElement('div');e.className='wish-card';name.className='wish-author';msg.className='wish-text';name.textContent=item.name;msg.textContent=item.message||item.text;e.append(name,msg);list.append(e);}
  }
  async function loadWishes(){const seq=++requestId;if(p.preview){wishes=p.sampleWishes||[];renderWishes();return;}wishes=[];renderWishes();if(!p.wishesEnabled)return;try{const r=await fetch(p.apiBase+'/wishes',{credentials:'same-origin',cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();if(seq===requestId){wishes=Array.isArray(data.wishes)?data.wishes:[];renderWishes();}}catch{if(seq===requestId)status('loadingFailed');}}
  $('#wishForm').addEventListener('submit',async e=>{
    e.preventDefault();if(!p||pending||!p.wishesEnabled)return;if(p.preview){status('preview');return;}
    const form=e.currentTarget;if(!form.reportValidity())return;const name=form.elements.wname.value.trim(),message=form.elements.wmsg.value.trim();if(!name||!message)return;
    const version=generation,button=form.querySelector('button');pending=true;button.disabled=true;
    try{const r=await fetch(p.apiBase+'/wishes',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,message,guestToken:p.guestToken||undefined})});if(!r.ok)throw Error();const data=await r.json();if(data.ok!==true)throw Error();if(version===generation){sent=true;form.reset();form.hidden=true;text('#wishConfirm',ui().pending);show('#wishConfirm',true);status('');}}
    catch{if(version===generation)status('failed');}finally{if(version===generation){pending=false;button.disabled=false;}}
  });
  function countdown(){if(!p)return;const target=Date.parse(p.instant),d=Number.isFinite(target)?Math.max(0,target-Date.now()):0;[Math.floor(d/86400000),Math.floor(d%86400000/3600000),Math.floor(d%3600000/60000),Math.floor(d%60000/1000)].forEach((v,i)=>text('#cd'+['Days','Hours','Mins','Secs'][i],i?String(v).padStart(2,'0'):String(v)));}
  function fit(){const names=$('.hero-names');names.classList.remove('long-names');if(names.scrollWidth>names.clientWidth+1)names.classList.add('long-names');}
  let started=false;
  function bind(){
    if(!p||!labels)return;
    const c=p.content,l=ui(),lang=nativeLang(),pair=c.people.filter(Boolean).join(' & ');
    document.documentElement.lang=p.locale;document.title=c.title||'Terracotta';
    labels.forEach(([selector,uz,en,ru])=>{if(selector==='.map-btn')return;text(selector,fixed(lang==='en'?en:lang==='ru'?ru:uz));});
    text('#openBtn',l.open);text('.scroll-hint span',l.scroll);text('.hero-subtitle',c.eventLabel);
    const mono=$('.monogram');mono.replaceChildren();c.people.filter(Boolean).forEach((n,i)=>{if(i){const amp=document.createElement('span');amp.className='monogram-and';amp.textContent='&';mono.append(amp);}mono.append(document.createTextNode(Array.from(n.trim())[0]||''));});
    $('.hero-names').querySelectorAll('.shimmer-text').forEach((el,i)=>el.textContent=c.people[i]||'');show('.hero-amp',!!c.people[1]);
    text('.splash-date',p.date);text('.hero-date',p.date);text('.footer-date',p.date);text('.invitation-couple',pair);text('.footer-names',pair);
    text('.invitation-message',[c.greeting,c.message,c.hosts].filter(Boolean).join('\n\n'));text('.invitation-date-formal',p.formalDate);text('.invitation-venue',c.venueName);
    if(c.programHeading)text('.events .section-title',c.programHeading);
    const timeline=$('[data-program]');timeline.replaceChildren();p.program.filter(e=>e.time||e.title||e.description).forEach(item=>{const row=document.createElement('div');row.className='timeline-item reveal';row.dataset.itemId=item.id;row.innerHTML='<div class="timeline-dot"></div><div class="timeline-time"></div><div class="timeline-event"></div><div class="timeline-desc"></div>';for(const [selector,value]of [['.timeline-time',item.time],['.timeline-event',item.title],['.timeline-desc',item.description]])row.querySelector(selector).textContent=value;timeline.append(row);});show('.events',timeline.children.length>0);
    text('.venue-name',c.venueName);text('.venue-address',[c.address,c.landmark].filter(Boolean).join(' · '));show('.venue',!!(c.venueName||c.address||p.mapUrl));
    const map=$('.map-btn');map.querySelector('span')?.remove();const label=document.createElement('span');label.textContent=l.map;map.append(label);map.href=safe(p.mapUrl)||'#';show('.map-btn',!!safe(p.mapUrl));
    text('.info-card p:not(.section-script)',p.infoNote);show('.info-section',!!p.infoNote);if(p.footerNote!==null)text('.footer-msg',p.footerNote);show('.footer-msg',p.footerNote!=='');
    document.querySelectorAll('.countdown-label').forEach((e,i)=>e.textContent=l.units[i]);show('.countdown-section',!!p.instant);countdown();
    for(const [id,label]of [['#wishName',l.name],['#wishMsg',l.message]]){$(id).placeholder=label;$(id).setAttribute('aria-label',label);}
    show('.wishes',p.wishesEnabled);$('#wishForm').hidden=sent;show('#wishConfirm',sent);if(sent)text('#wishConfirm',l.pending);if(!$('#wishName').value)$('#wishName').value=p.guestName||'';
    if(p.preview)wishes=p.sampleWishes||[];renderWishes();const key=$('#wishStatus').dataset.statusKey;if(key)status(key);
    document.querySelectorAll('[data-lang]').forEach(b=>{b.hidden=!p.enabledLocales.includes(b.dataset.lang);b.classList.toggle('active',b.dataset.lang===p.locale);b.setAttribute('aria-checked',String(b.dataset.lang===p.locale));});text('.taklifla-lang-current',{'uz-Latn':'UZ','uz-Cyrl':'ЎЗ',en:'EN',ru:'RU'}[p.locale]);show('.taklifla-lang-switch',p.enabledLocales.length>1);
    const music=p.music.enabled?safe(p.music.url):'';show('#musicBtn',!!music&&!p.silentPlayback);if((audio.getAttribute('src')||'')!==music){audio.pause();paused=false;if(music)audio.src=music;else audio.removeAttribute('src');}audio.muted=!!p.silentPlayback;musicState();
    window.terracottaReducedMotion=window.terracottaReduced();document.documentElement.toggleAttribute('data-reduced-motion',window.terracottaReducedMotion);if(window.terracottaReducedMotion)document.querySelectorAll('.float-botanical').forEach(e=>e.style.transform='');
    if(!started){started=true;window.startTerracottaMotion();}else if(opened)window.terracottaObserve();
    document.body.removeAttribute('data-pending');document.documentElement.removeAttribute('data-awaiting-data');document.documentElement.dataset.ready='true';document.fonts.ready.then(fit);
  }
  setInterval(countdown,1000);addEventListener('resize',fit);matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',bind);
  addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='taklifla-terracotta:update')return;const next=e.data.payload;if(!next?.enabledLocales?.includes(next.locale)||!next.content)return;const key=[next.apiBase,next.preview,next.wishesEnabled,next.guestToken].join(':');const changed=key!==context;if(changed){context=key;generation++;sent=false;pending=false;$('#wishForm').reset();$('#wishForm button').disabled=false;status('');}p=next;bind();if(changed)loadWishes();});
  fetch('source/labels.json').then(r=>r.json()).then(data=>{labels=data;bind();});
  parent.postMessage({type:'taklifla-terracotta:ready'},location.origin);
})();
