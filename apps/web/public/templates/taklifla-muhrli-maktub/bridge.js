/* Narrow platform adapter. Source animation/card/panel code remains in source/. */
(function () {
  'use strict';
  var $ = s => document.querySelector(s), state, language, started = false, epoch = 0;
  var wishes = [], musicUrl = '', pausedByGuest = false, playing = false;
  var audio = $('#env-audio'), music = $('#env-music'), form = $('#env-wish-form');
  var status = document.createElement('div');
  status.id = 'env-wish-status';
  status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  status.style.cssText='text-align:center;font-size:14px;color:#8a5a3b;margin-top:14px;';
  form.after(status);
  var closed = window.buildEnvelopeClosedPanel('#b78d4e');
  closed.hidden = true; form.after(closed);
  var originalPanel = Array.from(closed.children);
  var fields = [form.elements.wname,form.elements.wmsg];
  fields[0].required = fields[1].required = true;
  fields[0].maxLength = 100; fields[1].maxLength = 2000;
  function text(selector, value) {
    var el = $(selector); if(el) {el.textContent = value || '';el.hidden = !value;}
  }
  function copy() {return window.ENVELOPE_COPY[language] || window.ENVELOPE_COPY['uz-Latn'];}
  function localize() {
    var words=copy();
    document.documentElement.lang=language;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      var value=words[el.dataset.i18n];if(value !== undefined) el.textContent=value;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
      var value=words[el.dataset.i18nPh];if(value){el.placeholder=value;el.setAttribute('aria-label',value);}
    });
    $('#env-stage').setAttribute('aria-label',words.stage_open);
    $('#env-seal').setAttribute('aria-label',words.stage_open);
    music.setAttribute('aria-label',words.music);
    $('.env-lang').setAttribute('aria-label',words.language);
    originalPanel[1].textContent=words.closed_title;
    originalPanel[2].textContent=words.closed_heading;
    originalPanel[3].textContent=words.closed_body;
  }
  function link(selector,url) {
    var el=$(selector);el.hidden=!url;
    el.href=url || '#'; if(url && selector==='#env-map-t')el.style.display='flex';
  }
  function fitLetter() {
    var body=$('#env-inv-body'),card=body.parentElement;
    card.style.aspectRatio='4 / 5';card.style.minHeight='';
    // Normal source copy keeps its geometry; unusually long content expands safely.
    if(card.scrollHeight>card.clientHeight+1){card.style.aspectRatio='auto';card.style.minHeight='440px';}
  }
  function apply() {
    if(!state)return;
    localize();
    var data=state.variants[language];
    document.title=data.title || 'Muhrli Maktub — Taklifnoma';
    text('#env-monogram',data.monogram);
    text('#env-name1',data.people[0]);text('#env-name2',data.people.slice(1).join(' & '));
    text('#env-foot-n1',data.people[0]);text('#env-foot-n2',data.people.slice(1).join(' & '));
    $('#env-amp').hidden=$('#env-foot-joiner').hidden=data.people.length<2;
    text('#env-hero-date',data.date);text('#env-hero-venueshort',data.venueName);
    document.querySelectorAll('.env-datetime').forEach(el=>{el.textContent=data.dateTime;el.hidden=!data.dateTime;});
    text('#env-foot-year',data.footerDate);
    text('[data-i18n=hero_kicker]',data.eventLabel);
    text('[data-i18n=inv_title]',data.greeting);
    text('#env-inv-body',data.message);
    text('#env-venue-name',data.venueName);text('#env-venue-addr',data.address);
    $('#env-venue-name').closest('section').hidden=!(data.venueName||data.address||data.mapGoogle);
    // Source sample venue photo lacks a creator venue-photo field; preview only.
    $('#env-venue-photo').hidden=!state.preview;
    link('#env-map-g',data.mapGoogle);link('#env-map-y',data.mapYandex);text('#env-map-y','Google Maps');link('#env-map-t',data.telegram);
    var host=$('#env-prog'); host.replaceChildren();
    data.program.forEach(item=>{
      var row=document.createElement('div');row.style.position='relative';row.dataset.itemId=item.id;
      var seal=document.createElement('img');seal.src='envelope-img/07-wax-seal.webp';seal.alt='';
      seal.style.cssText='position:absolute;left:-46px;top:0;width:34px;filter:drop-shadow(0 3px 5px rgba(43,20,12,.4));';
      var time=document.createElement('div');time.style.cssText="font-family:'Prata',serif;font-size:15px;letter-spacing:.08em;color:#8a5a3b;";time.textContent=item.time;
      var title=document.createElement('div');title.style.cssText='font-size:16.5px;color:#4a2340;margin-top:3px;white-space:pre-line;overflow-wrap:anywhere;';
      title.textContent=[item.title,item.description].filter(Boolean).join('\n');
      row.append(seal,time,title);host.append(row);
    });
    $('#env-prog-section').hidden=!data.program.length;
    if(data.programHeading)text('[data-i18n=prog_title]',data.programHeading);
    $('#env-dress-block').hidden=!data.dress.enabled;
    text('#env-dress-text',data.dress.text);
    var colors=$('#env-dress-colors'); colors.replaceChildren();
    data.dress.colors.forEach(color=>{
      var dot=document.createElement('div');dot.dataset.itemId=color.id;
      dot.style.cssText='width:22px;height:22px;border-radius:50%;border:2px solid rgba(255,255,255,.7);box-shadow:0 0 0 1px rgba(90,55,25,.3);';
      dot.style.background=color.hex;dot.title=color.name;dot.setAttribute('role','img');dot.setAttribute('aria-label',color.name||color.hex);colors.append(dot);
    });
    $('#env-rsvp-block').hidden=!state.phone;
    text('#env-phone',state.phone);link('#env-phone',state.phone?'tel:'+state.phone.replace(/[^+\d]/g,''):'');
    var flowersNote=data.flowersNote===null?window.ENVELOPE_COPY[language].flowers_note_default:data.flowersNote;
    text('#env-flowers',flowersNote);$('#env-div2').hidden=!flowersNote;
    $('#env-div1').hidden=!(data.dress.enabled&&state.phone);
    $('#env-details-section').hidden=!(data.dress.enabled||state.phone||flowersNote);
    var wishSection=form.closest('section');wishSection.hidden=!state.wishesEnabled;
    var expired=state.target!==null&&Date.now()>=state.target+86400000;
    closed.hidden=!expired;form.hidden=expired;
    if(state.preview) wishes=data.sampleWishes || [];
    window.renderEnvelopeWishes(wishes,language);
    document.querySelectorAll('.env-lang button').forEach(b=>{
      b.hidden=!state.enabledLocales.includes(b.dataset.lang);
      b.classList.toggle('on',b.dataset.lang===language);
      b.setAttribute('aria-pressed',String(b.dataset.lang===language));
    });
    music.hidden=!state.music.enabled||!state.music.url||state.silentPlayback;
    music.style.display=music.hidden?'none':'flex';
    var nextUrl=state.music.enabled&&!state.silentPlayback?state.music.url:'';
    if(nextUrl!==musicUrl){audio.pause();playing=false;musicUrl=nextUrl;if(nextUrl)audio.src=nextUrl;else audio.removeAttribute('src');pausedByGuest=false;icon();}
    if(!state.preview && $('#env-stage').style.display === 'none')tryMusic();
    document.documentElement.dataset.bound='true';
    fitLetter();
    document.dispatchEvent(new CustomEvent('taklifla:langchange'));
    tick();
  }
  function tick() {
    if(!state)return;
    var target=state.target,diff=target===null?null:target-Date.now();
    $('#env-cd-grid').closest('section').hidden=target===null;
    $('#env-cd-grid').style.display=diff>0?'grid':'none';
    $('#env-cd-arrived').style.display=diff!==null&&diff<=0?'block':'none';
    if(diff>0){
      $('#env-cd-d').textContent=Math.floor(diff/86400000);
      $('#env-cd-h').textContent=String(Math.floor(diff%86400000/3600000)).padStart(2,'0');
      $('#env-cd-m').textContent=String(Math.floor(diff%3600000/60000)).padStart(2,'0');
      $('#env-cd-s').textContent=String(Math.floor(diff%60000/1000)).padStart(2,'0');
    }
    if(target!==null&&Date.now()>=target+86400000){form.hidden=true;closed.hidden=false;}
  }
  function icon(){ $('#env-music-icon').style.opacity=playing?'1':'.45';music.setAttribute('aria-pressed',String(playing)); }
  function tryMusic() {
    if(!state||!musicUrl||pausedByGuest||playing||state.silentPlayback)return;
    audio.play().then(()=>{playing=true;icon();}).catch(()=>{playing=false;icon();});
  }
  audio.addEventListener('play',()=>{playing=true;icon();});
  audio.addEventListener('pause',()=>{playing=false;icon();});
  audio.addEventListener('error',()=>{playing=false;icon();});
  music.addEventListener('click',()=>{if(playing){pausedByGuest=true;audio.pause();playing=false;icon();}else{pausedByGuest=false;tryMusic();}});
  document.addEventListener('pointerdown',e=>{if(e.target.closest('#env-music'))return;if(state&&!state.preview)tryMusic();});
  document.addEventListener('keydown',e=>{if(state&&!state.preview)tryMusic();if(e.target===$('#env-stage')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();$('#env-stage').click();}});
  $('.env-lang').addEventListener('click',event=>{
    var button=event.target.closest('[data-lang]');if(!button||!state.enabledLocales.includes(button.dataset.lang))return;
    language=button.dataset.lang;status.textContent='';apply();
  });
  async function loadWishes() {
    if(!state||state.preview||!state.wishesEnabled)return;
    var version=epoch,url='/api/public/invitations/'+encodeURIComponent(state.invitationId)+'/wishes';
    try {
      var response=await fetch(url,{credentials:'same-origin'});
      if(!response.ok)throw Error('http_'+response.status);
      var body=await response.json();if(version!==epoch)return;
      wishes=body.wishes||[];window.renderEnvelopeWishes(wishes,language);
    }catch(e){if(version===epoch)status.textContent=copy().load_error;}
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!state||!state.wishesEnabled)return;
    if(state.preview){status.textContent=copy().preview;return;}
    if(state.target!==null&&Date.now()>=state.target+86400000){tick();return;}
    var name=fields[0].value.trim(),message=fields[1].value.trim();if(!name||!message){form.reportValidity();return;}
    var version=epoch,button=form.querySelector('button[type=submit]');button.disabled=true;status.textContent=copy().sending;
    try {
      var response=await fetch('/api/public/invitations/'+encodeURIComponent(state.invitationId)+'/wishes',{
        method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,message,...(state.guestToken?{guestToken:state.guestToken}:{})}),
      });
      if(!response.ok)throw Error('http_'+response.status);
      var result=await response.json();if(!result.ok)throw Error('invalid_ack');
      if(version!==epoch)return;
      status.textContent=copy().wish_thanks;form.reset();fields[0].value=state.guestName;
      // Pending wishes deliberately do not enter the approved public list.
    }catch(e){if(version===epoch)status.textContent=copy().error;}
    finally{button.disabled=false;}
  });
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='taklifla-envelope:update')return;
    var next=event.data.payload;if(!next?.variants||!next.enabledLocales?.includes(next.locale)||!next.variants[next.locale])return;
    var changed=!state||state.invitationId!==next.invitationId||state.preview!==next.preview;
    if(changed){epoch++;wishes=[];status.textContent='';form.reset();fields[0].value=next.guestName;}
    state=next;language=next.locale;apply();
    if(!started){started=true;window.startEnvelopeMotion(tryMusic);document.fonts.ready.then(fitLetter);}
    if(changed)loadWishes();
  });
  setInterval(tick,1000);
})();
