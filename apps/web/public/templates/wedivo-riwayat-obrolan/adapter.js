/* Platform boundary. The source renderer starts only after a typed payload arrives. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const all = (s,r=document) => [...r.querySelectorAll(s)];
  const T = value => window.riwayatText(value);
  let envelope = '', current;
  const authored = (id,value) => {
    const node = $(id);
    if (!node) return;
    node.textContent = value || '';
    node.dataset.authored = '';
  };
  const show = (id,on) => { const n=$(id); if(n)n.hidden=!on; };
  const section = (key,on) => {
    show(`sec-${key}`,on);
    all(`[data-nav-target="${key}"],[data-go="${key}"]`).forEach(n=>{ n.hidden=!on; });
  };
  function localize(root=document.body) {
    if (!root || root.nodeType !== 1 || root.closest('[data-authored],template,script,style')) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) {
      const n=walker.currentNode;
      if(n.parentElement.closest('[data-authored],template,script,style'))continue;
      const v=T(n.nodeValue); if(v!==n.nodeValue)n.nodeValue=v;
    }
    [root,...all('[placeholder],[aria-label]',root)].forEach(n=>{
      for(const attr of ['placeholder','aria-label']) {
        const v=n.getAttribute(attr); if(v)n.setAttribute(attr,T(v));
      }
    });
  }
  function bind(p) {
    const d=p.data, people=[d.groom,d.bride].filter(Boolean), names=people.join(' & ');
    window.__RIWAYAT={...p,publicUrl:p.publicUrl || (window.parent===window ? location.href : document.referrer)};
    try {
      const key='riwayat-view:'+p.invitationId;
      const view=JSON.parse(sessionStorage.getItem(key) || 'null');sessionStorage.removeItem(key);
      if(view){window.__RIWAYAT.resumeOpen=!!view.open;window.__RIWAYAT.resumeScroll=Number(view.scroll)||0;}
    }catch{}
    document.documentElement.lang=p.locale;
    document.title=names;
    const reduced=p.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.toggle('reduced-motion',reduced);
    const nameIds={g:'hero-g cv-n1-g cv-n3-ttl hero-sys1-g ayat-head-g mp-g-name mp-g-nick-t bs-sys-b pn-g pn-typing-g call-n-g',b:'hero-b cv-n1-b cv-n2-ttl hero-sys2-b mp-b-name mp-b-nick-t pn-b pn-typing-b call-n-b'};
    for(const who of ['g','b'])for(const id of nameIds[who].split(' '))authored(id,who==='g'?d.groom:d.bride);
    for(const id of ['ab-title','hero-group-t','hero-sys1-n','nav-hero-t'])authored(id,d.title || names);
    authored('ab-sub-t',[...people,p.guestName || T('Anda')].join(', '));
    for(const id of ['cv-guest-name','hero-guest','rv-q-gn','nav-who-g'])authored(id,p.guestName);
    authored('hero-desc',d.greeting);
    authored('ayat-salam',d.greeting);
    authored('ayat-tr',d.message);
    authored('ac-m1-t',d.message);
    authored('pn-msg',d.message);
    authored('pn-auto-t',d.greeting);
    authored('tj-msg',d.eventType);
    authored('cv-n3-time',d.date.short);
    $('cv-n3-msg').textContent={'uz-Latn':'S','uz-Cyrl':'С',en:'P',ru:'П'}[p.locale];
    authored('hero-date-v',d.venue.name);
    authored('ev1-n',d.eventType);
    for(const id of ['ev1-vn','lk-vn'])authored(id,d.venue.name);
    for(const id of ['ev1-va','lk-va'])authored(id,d.venue.address);
    authored('lk-mark-t',p.landmark);
    for(const id of ['ev1-map','lk-dir'])$(id).href=d.venue.mapUrl || '#';
    // One shared event, no invented second ceremony.
    show('ev2-msg',false);
    section('acara',!!p.dateISO);
    section('terjadwal',!!p.dateISO);
    section('lokasi',!!(d.venue.name || d.venue.address || d.venue.mapUrl));
    show('lk-dir',!!d.venue.mapUrl);
    show('ev1-map',!!d.venue.mapUrl);
    show('ev1-r3',false);
    show('hero-date',!!p.dateISO);
    show('hero-unread',false);
    show('kisah-end',false);
    show('hero-sys2',!!p.guestName);
    show('cv-guest',!!p.guestName);
    show('rv-q-g',!!p.guestName);
    section('ayat',!!d.message);
    const gallery=d.gallery.filter(i=>i.src);
    const photos=p.preview && p.previewProfiles ? p.previewProfiles : {g:gallery[0]?.src,b:gallery[1]?.src,c:gallery[2]?.src || gallery[0]?.src};
    for(const [id,who] of Object.entries({'ab-av-img':'c','cv-wall-img':'c','cv-n1-av-img':'c','cv-n2-av-img':'b','cv-n3-av-img':'g','hero-av-img':'c','mp-g-img':'g','mp-b-img':'b','nav-hero-img':'c'})){
      if(photos[who]){ $(id).src=photos[who];$(id).alt=names; }
    }
    // Gallery photos are the only approved creator media field; no demo photos are loaded.
    const chapterBase=$('kisah-c1').cloneNode(true);
    for(let i=6;i<=d.story.length;i++){
      const ch=chapterBase.cloneNode(true);
      [ch,...all('[id]',ch)].forEach(n=>{if(n.id)n.id=n.id.replace('kisah-c1',`kisah-c${i}`);});
      $('kisah-c5').parentElement.insertBefore(ch,$('kisah-end'));
    }
    for(let i=1;i<=Math.max(5,d.story.length);i++){
      const item=d.story[i-1],ch=$(`kisah-c${i}`);if(!ch)continue;
      ch.hidden=!item;
      if(!item)continue;
      ch.dataset.itemId=item.id;
      authored(`kisah-c${i}-tt`,item.title);
      $(`kisah-c${i}-src`).content.textContent=item.text;
      show(`kisah-c${i}-dp`,false);
    }
    section('kisah',!!d.story.length);
    // These original source panels lack approved creator data/services. Kept in package,
    // inactive and listed in SOURCE_ADAPTATIONS.md; no source-demo anecdotes survive.
    for(const key of ['kamus','kontak','draf','video','hadiah'])section(key,false);
    section('keluarga',!!d.hosts);
    if(d.hosts){
      $('sec-keluarga').removeAttribute('data-contract-gap');
      for(const id of ['kel-m0','kel-msg','kel-fwd','kel-thread','kel-formal-g','kel-formal-b','kel-formal-amp','kel-turut','kel-pray','kel-amin'])show(id,false);
      authored('kel-formal-h',d.hosts);
      authored('keluarga-tp-t',d.hostsLabel);
    }
    for(const who of ['g','b']){
      show(`mp-${who}`,!!(who==='g'?d.groom:d.bride));
      // A shared Instagram contact cannot be represented as two individual accounts.
      show(`mp-${who}-ig`,false);
    }
    const phone=d.contacts.find(c=>c.type==='phone');
    show('ab-call',!!phone);
    p.phoneHref=phone?.href || '';
    window.__RIWAYAT.phoneHref=p.phoneHref;
    const contact=d.contacts.find(c=>c.type==='instagram');
    if(contact){authored('mp-g-ig-t',contact.label || contact.value);$('mp-g-ig').href=contact.href;show('mp-g-ig',true);}
    section('busana',d.dressCode.enabled);
    authored('bs-sys-n',d.dressCode.style);
    authored('bs-m0-t',[d.dressCode.text,d.dressCode.note].filter(Boolean).join('\n'));
    const swBase=$('bs-sw-1').cloneNode(true);$('bs-sw').replaceChildren();
    d.dressCode.colors.forEach((c,i)=>{
      const sw=swBase.cloneNode(true);sw.id=`bs-sw-${i+1}`;sw.dataset.itemId=c.id;sw.style.setProperty('--c',c.hex);
      all('[id]',sw).forEach(n=>{n.id=n.id.replace('bs-sw-1',sw.id);});
      sw.querySelector('.sw-n').textContent=c.name || c.hex;sw.querySelector('.sw-n').dataset.authored='';$('bs-sw').append(sw);
    });
    section('galeri',gallery.length>0 || p.preview);
    const rd=document.createElement('script');rd.type='application/json';rd.id='wedivo-rundown-data';
    rd.textContent=JSON.stringify(d.program.map(item=>({id:item.id,title:item.title,description:item.description || '',startTime:item.time,date:p.dateISO})));
    document.body.append(rd);
    authored('rundown-tp-t',d.programHeading);
    authored('rd-h-t',d.programHeading);
    section('rundown',d.program.length>0);
    section('rsvp',d.rsvp.enabled);
    section('ucapan',d.wishesEnabled);
    if(!d.wishesEnabled){show('cp',false);show('stv-reply',false);}
    $('rv-dead-t').dataset.date=d.rsvp.deadline;
    for(const id of ['rsvp-name','wish-name']){ $(id).value=p.guestName || '';$(id).maxLength=100; }
    $('rsvp-msg').maxLength=1000;$('wish-msg').maxLength=2000;
    $('rsvp-pax').disabled=true;
    show('rsvp-err',false);
    const bgm=$('bgm');bgm.removeAttribute('src');bgm.dataset.src=d.music.enabled && !p.silentPlayback ? d.music.url : '';
    localize();
    // Source aria labels contain Indonesian content and source names; derive them from
    // localized, bound labels instead of preserving invitation-specific descriptions.
    all('[aria-label]').forEach(n=>{
      const target=n.id && $(`${n.id}-t`);
      const original=n.getAttribute('aria-label');
      if(!original)n.setAttribute('aria-label',target?.textContent || n.textContent.trim().slice(0,120) || T('Acara'));
    });
    $('cv-n1').setAttribute('aria-label',`${T('Undangan Acara')} ${names}`);
    document.body.classList.remove('awaiting-data');
  }
  function feedback(form,message){
    let n=form.querySelector('.platform-feedback');
    if(!n){n=document.createElement('p');n.className='platform-feedback';n.setAttribute('role','status');n.setAttribute('aria-live','polite');form.append(n);}
    n.textContent=T(message);
  }
  async function request(kind,body){
    if(current.preview)throw new Error('Preview submissions are disabled.');
    const response=await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/${kind}`,{
      method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
      body:JSON.stringify({...body,...(current.guestToken?{guestToken:current.guestToken}:{})}),
    });
    const result=await response.json().catch(()=>({}));
    if(!response.ok || result.ok!==true)throw new Error('Could not send. Please try again.');
    return result;
  }
  function renderWishes(wishes){
    const list=$('wish-list');list.replaceChildren();
    for(const wish of wishes){
      const item=document.createElement('article');item.className='wm';item.dataset.authored='';
      const avatar=document.createElement('span');avatar.className='wm-av';avatar.textContent=wish.name.slice(0,1);
      const box=document.createElement('div');box.className='wm-body';
      const name=document.createElement('p');name.dataset.field='name';name.textContent=wish.name;
      const message=document.createElement('p');message.dataset.field='message';message.textContent=wish.message || wish.text;
      box.append(name,message);item.append(avatar,box);list.append(item);
    }
  }
  function connect(){
    for(const id of ['rsvp-name','wish-name','wish-msg']){
      const input=$(id);
      input.addEventListener('input',()=>input.setCustomValidity(''));
      input.addEventListener('invalid',()=>input.setCustomValidity(T(id==='wish-msg'?'Please write your wish.':'Please enter your name.')));
    }
    let status='';const form=$('rsvp-form');
    all('[data-wedivo-status]',form).forEach(button=>button.addEventListener('click',()=>{
      status=button.dataset.wedivoStatus;
      all('[data-wedivo-status]',form).forEach(n=>{const on=n===button;n.classList.toggle('is-selected',on);n.setAttribute('aria-pressed',String(on));});
    }));
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(!status){feedback(form,'Pilih salah satu jawaban dulu, ya 🙏');return;}
      if(!form.reportValidity())return;
      const button=$('rsvp-send');button.disabled=true;
      const map={attending:'yes',not_attending:'no',maybe:'maybe'};
      try{
        await request('rsvp',{name:$('rsvp-name').value.trim(),status:map[status],partySize:map[status]==='yes'?1:0,note:$('rsvp-msg').value.trim()});
        feedback(form,'Balasanmu sudah terkirim. Terima kasih!');
        window.riwayatRSVPSaved?.(T({attending:'Hadir',not_attending:'Berhalangan',maybe:'Masih ragu'}[status]));
      }catch(error){feedback(form,error.message);}finally{button.disabled=false;}
    });
    const wishes=$('wish-form');
    wishes.addEventListener('submit',async event=>{
      event.preventDefault();if(!wishes.reportValidity())return;
      $('wish-send').disabled=true;
      try{
        await request('wishes',{name:$('wish-name').value.trim(),message:$('wish-msg').value.trim()});
        feedback(wishes,'Your wish was sent for approval.');$('wish-msg').value='';
      }catch(error){feedback(wishes,error.message);}finally{$('wish-send').disabled=false;}
    });
    $('gift-form').addEventListener('submit',e=>{e.preventDefault();feedback(e.currentTarget,'Gift transfers are unavailable.');});
    if(current.preview)renderWishes(current.data.wishes || []);
    else if(current.data.wishesEnabled)fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/wishes`,{credentials:'same-origin',cache:'no-store'})
      .then(r=>{if(!r.ok)throw new Error();return r.json();})
      .then(result=>renderWishes(result.wishes || []))
      .catch(()=>feedback(wishes,'Could not send. Please try again.'));
    const observe=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='characterData')localize(record.target.parentElement);
        else for(const n of record.addedNodes)if(n.nodeType===1)localize(n);else if(n.parentElement)localize(n.parentElement);
      }
    });
    observe.observe(document.body,{childList:true,subtree:true,characterData:true});
    localize();
    // The source's data initialization may hide empty galleries; the canonical preview
    // keeps its source section with an empty album, without synthesizing photo content.
    if(current.preview && !current.data.gallery.some(i=>i.src)){
      $('sec-galeri').style.removeProperty('display');
      all('[data-nav-target="galeri"],[data-go="galeri"]').forEach(n=>n.style.removeProperty('display'));
    }
    window.__RIWAYAT_READY=true;
    if(window.__RIWAYAT.resumeOpen)requestAnimationFrame(()=>window.scrollTo(0,window.__RIWAYAT.resumeScroll || 0));
  }
  function receive(message){
    if(message?.type!=='wedivo-riwayat-obrolan:update' || !message.payload?.data)return;
    const serialized=JSON.stringify(message);
    if(serialized===envelope)return;
    if(envelope){
      if(message.payload.invitationId===current.invitationId)try{sessionStorage.setItem('riwayat-view:'+current.invitationId,JSON.stringify({open:document.body.classList.contains('is-open'),scroll:scrollY}));}catch{}
      window.name=serialized;location.reload();return;
    }
    envelope=serialized;current=message.payload;
    current.landmark=message.payload.landmark || '';
    bind(current);
    const script=document.createElement('script');script.src='source/template.js';
    script.onload=connect;script.onerror=()=>{document.body.textContent=T('Template could not load.');};document.body.append(script);
  }
  addEventListener('message',event=>{if(event.source===parent && event.origin===location.origin)receive(event.data);});
  try{receive(JSON.parse(window.name));}catch{}
})();
