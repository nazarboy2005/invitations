/* Shared invitation boundary. Native artwork, CSS and motion remain isolated. */
(() => {
  'use strict';
  const $=s=>document.querySelector(s), audio=$('#bgm');
  let p, labels, opened=false, paused=false, context='',generation=0,requestId=0,pending=false,sent=false,wishes=[];
  const text=(s,v)=>{const e=$(s);if(e)e.textContent=v??'';};
  const show=(s,v)=>{const e=$(s);if(e)e.hidden=!v;};
  const safe=v=>typeof v==='string'&&/^(https?:\/\/|\/(?!\/))/i.test(v)?v:'';
  const ui=()=>window.SHARLAR_LABELS[p?.locale]||window.SHARLAR_LABELS['uz-Latn'];
  const nativeLang=()=>p.locale==='en'?'en':p.locale==='ru'?'ru':'uz';
  const fixed=v=>p.locale==='uz-Cyrl'?window.sharlarCyrl(v):v;
  window.sharlarReduced=()=>!!p?.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  function status(key){$('#wishStatus').dataset.statusKey=key;text('#wishStatus',key?ui()[key]:'');}
  function musicState(){const playing=!audio.paused;$('#musicBtn').classList.toggle('playing',playing);$('#musicBtn').setAttribute('aria-pressed',String(playing));$('#musicBtn').setAttribute('aria-label',playing?ui().pause:ui().play);}
  function play(){if(!paused&&!p?.silentPlayback&&audio.getAttribute('src'))audio.play().catch(()=>{musicState();$('#musicBtn').title=ui().musicError;});}
  $('#musicBtn').addEventListener('click',()=>{if(audio.paused){paused=false;play();}else{paused=true;audio.pause();}});
  ['play','pause','error','ended'].forEach(e=>audio.addEventListener(e,musicState));
  $('#openInvite').addEventListener('click',()=>{if(!p||opened)return;opened=true;$('#splash').classList.add('gone');$('#splash').inert=true;document.documentElement.style.scrollBehavior=window.sharlarReduced()?'auto':'smooth';play();const h=$('.hero-name');h.tabIndex=-1;h.focus({preventScroll:true});});
  $('.taklifla-lang-toggle').addEventListener('click',()=>{const e=$('.taklifla-lang-switch');e.classList.toggle('open');$('.taklifla-lang-toggle').setAttribute('aria-expanded',String(e.classList.contains('open')));});
  $('.taklifla-lang-menu').addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(!b||!p.enabledLocales.includes(b.dataset.lang))return;p={...p,locale:b.dataset.lang};$('.taklifla-lang-switch').classList.remove('open');$('.taklifla-lang-toggle').setAttribute('aria-expanded','false');bind();});
  function renderWishes(){
    const list=$('#wishList');list.replaceChildren();
    if(!wishes.length){const e=document.createElement('div');e.className='wish-empty';e.textContent=ui().empty;list.append(e);}
    for(const item of wishes){const e=document.createElement('div'),name=document.createElement('div'),msg=document.createElement('div');e.className='wish';name.className='who';msg.className='msg';name.textContent=item.name;msg.textContent=item.message||item.text;e.append(name,msg);list.append(e);}
  }
  async function loadWishes(){const seq=++requestId;if(p.preview){wishes=p.views[p.locale].previewWishes||[];renderWishes();return;}wishes=[];renderWishes();if(!p.wishesEnabled)return;try{const r=await fetch(p.apiBase+'/wishes',{credentials:'same-origin',cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();if(seq===requestId){wishes=Array.isArray(data.wishes)?data.wishes:[];renderWishes();}}catch{if(seq===requestId)status('loadError');}}
  $('#wishForm').addEventListener('submit',async e=>{
    e.preventDefault();if(!p||pending||!p.wishesEnabled)return;if(p.preview){status('preview');return;}
    const form=e.currentTarget;if(!form.reportValidity())return;const name=form.elements.wname.value.trim(),message=form.elements.wmsg.value.trim();if(!name||!message)return;
    const version=generation,button=form.querySelector('button');pending=true;button.disabled=true;
    try{const r=await fetch(p.apiBase+'/wishes',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,message,guestToken:p.guestToken||undefined})});if(!r.ok)throw Error();const data=await r.json();if(data.ok!==true)throw Error();if(version===generation){sent=true;form.reset();form.hidden=true;text('#wishConfirm',ui().pending);show('#wishConfirm',true);status('');}}
    catch{if(version===generation)status('error');}finally{if(version===generation){pending=false;button.disabled=false;}}
  });
  function countdown(){if(!p)return;const target=Date.parse(p.instant),d=Number.isFinite(target)?Math.max(0,target-Date.now()):0;[Math.floor(d/86400000),Math.floor(d%86400000/3600000),Math.floor(d%3600000/60000),Math.floor(d%60000/1000)].forEach((v,i)=>text('#cd'+['D','H','M','S'][i],i?String(v).padStart(2,'0'):String(v)));}
  function fit(){const name=$('.hero-name');name.style.fontSize='';let size=parseFloat(getComputedStyle(name).fontSize);while(name.scrollWidth>name.clientWidth+1&&size>28){size--;name.style.fontSize=size+'px';}name.style.overflowWrap='anywhere';}
  function bind(){
    if(!p||!labels)return;
    const v=p.views[p.locale],c=v.content,l=ui(),n=c.people.filter(Boolean).join(' · '),lang=nativeLang();
    document.documentElement.lang=p.locale;
    labels.forEach(([selector,uz,en,ru])=>{if(selector==='.map-btn')return;text(selector,fixed(lang==='en'?en:lang==='ru'?ru:uz));});
    text('.hero-name',n);text('#splash .mono',n);text('#foot .mono-sm',n);
    const date=$('.hero-date');date.replaceChildren();const year=v.wallDate.slice(0,4),parts=v.date.split(year);date.append(document.createTextNode(parts[0]||''));if(year){const b=document.createElement('b');b.textContent=year;date.append(b,document.createTextNode(parts.slice(1).join(year)));}text('.hero-age-num',p.celebrantAge);text('.hero-age-lbl',p.celebrantAge?fixed(window.sharlarAgeLabel(lang,p.celebrantAge)):'');show('.hero-age-num',p.celebrantAge!==null);show('.hero-age-lbl',p.celebrantAge!==null);
    const hint=$('#splash .hint');hint.replaceChildren();for(const value of [v.date,c.venueName]){if(!value)continue;const e=document.createElement('i');e.textContent=value;hint.append(e);}
    text('#invite .kicker',c.greeting||c.eventLabel);text('#invite .invite-text',[c.message,c.hosts].filter(Boolean).join('\n\n'));
    const meta=$('#invite .invite-meta');meta.replaceChildren();for(const value of [v.date,v.time,c.venueName]){if(!value)continue;const e=document.createElement('span');e.textContent=value;meta.append(e);}
    if(c.programHeading)text('#timeline .head .h2',c.programHeading);
    const timeline=$('.tl');timeline.replaceChildren();v.program.filter(e=>e.time||e.title||e.description).forEach((item,i)=>{const row=document.createElement('div');row.className='ev reveal d'+(i%3+1);row.dataset.itemId=item.id;row.innerHTML='<div class="dot"><b></b></div><div class="body"><div class="time"></div><div class="what"></div><div class="sub"></div></div>';row.querySelector('b').textContent=String(i+1).padStart(2,'0');for(const [selector,value]of [['.time',item.time],['.what',item.title],['.sub',item.description]])row.querySelector(selector).textContent=value;timeline.append(row);});show('#timeline',timeline.children.length>0);
    text('#venue .h2',c.venueName);text('.venue-name',c.address);text('.venue-city',c.landmark);show('#venue',!!(c.venueName||c.address||v.mapUrl));
    const map=$('.map-btn');map.querySelector('span')?.remove();const mapLabel=document.createElement('span');mapLabel.textContent=l.map;map.append(mapLabel);map.href=safe(v.mapUrl)||'#';show('.map-btn',!!safe(v.mapUrl));
    text('#info .d1 .val',p.doorsAt?({uz:'Soat {time} dan keyin istalgan vaqtda keling.',en:'Arrive any time after {time}.',ru:'Приходите в любое время после {time}.'}[lang]).replace('{time}',p.doorsAt):'');if(p.locale==='uz-Cyrl')text('#info .d1 .val',fixed($('#info .d1 .val').textContent));show('#info .d1',!!p.doorsAt);
    const contact=$('#info .d2 .val');if(p.phone){const a=document.createElement('a');a.textContent=p.phone;a.href='tel:'+p.phone.replace(/[^\d+]/g,'');contact.append(document.createElement('br'),a);}show('#info .d2',!!p.phone);
    text('#info .d3 .lbl',l.dress);text('#info .d3 .val',v.dressCode);show('#info .d3',!!v.dressCode);show('#info',!!(p.doorsAt||p.phone||v.dressCode));
    ['★','♥','◇'].forEach((s,i)=>text('#info .d'+(i+1)+' .ico',s));
    document.querySelectorAll('.ornament .label').forEach((e,i)=>e.textContent=l.dividers[i]);document.querySelectorAll('.cd-lbl').forEach((e,i)=>e.textContent=l.units[i]);
    text('.cd-when',[v.date,v.time].filter(Boolean).join(' · '));text('#foot .when',v.date);text('#foot .closing',p.locale==='uz-Cyrl'?n+' ва оиласидан меҳр ва байроқчалар билан. Чироқлар остида кўришгунча.':window.sharlarClosing(lang,n));
    for(const [id,label]of [['#wishName',l.name],['#wishMsg',l.message]]){$(id).placeholder=label;$(id).setAttribute('aria-label',label);}
    show('#wishes',p.wishesEnabled);$('#wishForm').hidden=sent;show('#wishConfirm',sent);if(sent)text('#wishConfirm',l.pending);if(!$('#wishName').value)$('#wishName').value=p.guestName||'';
    if(p.preview)wishes=v.previewWishes||[];renderWishes();const key=$('#wishStatus').dataset.statusKey;if(key)status(key);
    document.querySelectorAll('[data-lang]').forEach(b=>{b.hidden=!p.enabledLocales.includes(b.dataset.lang);b.classList.toggle('active',b.dataset.lang===p.locale);b.setAttribute('aria-checked',String(b.dataset.lang===p.locale));});text('.taklifla-lang-current',{'uz-Latn':'UZ','uz-Cyrl':'ЎЗ',en:'EN',ru:'RU'}[p.locale]);show('.taklifla-lang-switch',p.enabledLocales.length>1);
    const music=p.music.enabled?safe(p.music.url):'';show('#musicBtn',!!music&&!p.silentPlayback);if((audio.getAttribute('src')||'')!==music){audio.pause();paused=false;if(music)audio.src=music;else audio.removeAttribute('src');}audio.muted=!!p.silentPlayback;musicState();
    document.documentElement.toggleAttribute('data-reduced',window.sharlarReduced());if(window.sharlarReduced()){document.querySelectorAll('[data-speed]').forEach(e=>e.style.setProperty('--paraY','0px'));$('.arches').style.setProperty('--mx','0px');$('.arches').style.setProperty('--my','0px');}
    window.sharlarObserve();document.body.removeAttribute('data-awaiting-content');document.documentElement.removeAttribute('data-awaiting-data');document.documentElement.dataset.ready='true';document.fonts.ready.then(fit);countdown();
  }
  setInterval(countdown,1000);addEventListener('resize',fit);matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',bind);
  addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='taklifla-sharlar:update')return;const next=e.data.payload;if(!next?.enabledLocales?.includes(next.locale)||!next.views?.[next.locale])return;const key=[next.apiBase,next.preview,next.wishesEnabled,next.guestToken].join(':');const changed=key!==context;if(changed){context=key;generation++;sent=false;pending=false;$('#wishForm').reset();$('#wishForm button').disabled=false;status('');}p=next;bind();if(changed)loadWishes();});
  fetch('source/labels.json').then(r=>r.json()).then(data=>{labels=data;bind();});
  parent.postMessage({type:'sharlar:ready'},location.origin);
})();
