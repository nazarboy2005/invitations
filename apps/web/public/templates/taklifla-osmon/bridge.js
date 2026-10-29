/* Platform contract/services only. No source query customizer or provider APIs. */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  let state, locale, opened = false, musicPlayed = false, musicPaused = false, wishLoad = 0;
  let pending = false, sent=false, wishes=[];
  const audio = $("#os-audio");
  const form = $("#os-wish-form");
  const status = $("#os-wish-confirm");
  const initial = new Map();
  document.querySelectorAll("[data-i18n]").forEach(el => initial.set(el, el.innerHTML));
  const placeholders = new Map();
  document.querySelectorAll("[data-i18n-ph]").forEach(el => placeholders.set(el, el.placeholder));
  const ui = {
    "uz-Latn": {preview:"Bu ko‘rib chiqish oynasi. Tilak yuborilmadi.",pending:"Tilagingiz yuborildi. Tasdiqlangach ko‘rinadi.",error:"Tilak yuborilmadi. Qayta urinib ko‘ring.",loadError:"Tilaklarni yuklab bo‘lmadi. Qayta urinib ko‘ring.",sending:"Yuborilmoqda…",phone:"Kelishingizni tasdiqlash uchun",by:"Muddat:",play:"Musiqani yoqish",pause:"Musiqani to‘xtatish"},
    "uz-Cyrl": {preview:"Бу кўриб чиқиш ойнаси. Тилак юборилмади.",pending:"Тилагингиз юборилди. Тасдиқлангач кўринади.",error:"Тилак юборилмади. Қайта уриниб кўринг.",loadError:"Тилакларни юклаб бўлмади. Қайта уриниб кўринг.",sending:"Юборилмоқда…",phone:"Келишингизни тасдиқлаш учун",by:"Муддат:",play:"Мусиқани ёқиш",pause:"Мусиқани тўхтатиш"},
    en:{preview:"This is a preview. Your wish was not sent.",pending:"Your wish was sent and will appear after approval.",error:"Your wish was not sent. Please try again.",loadError:"Wishes could not be loaded. Please try again.",sending:"Sending…",phone:"To confirm your attendance",by:"Reply by:",play:"Play music",pause:"Pause music"},
    ru:{preview:"Это предпросмотр. Пожелание не отправлено.",pending:"Пожелание отправлено и появится после одобрения.",error:"Пожелание не отправлено. Попробуйте ещё раз.",loadError:"Не удалось загрузить пожелания. Попробуйте ещё раз.",sending:"Отправка…",phone:"Чтобы подтвердить присутствие",by:"Ответьте до:",play:"Включить музыку",pause:"Приостановить музыку"},
  };
  // Transliterates only source-owned built-in labels; never creator/guest text.
  function cyrl(value) {
    const map={a:"а",b:"б",v:"в",g:"г",d:"д",e:"е",z:"з",i:"и",j:"ж",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",r:"р",s:"с",t:"т",u:"у",f:"ф",x:"х",c:"ц",y:"й",h:"ҳ",q:"қ"};
    const pairs={"o'":"ў","g'":"ғ",sh:"ш",ch:"ч",ng:"нг",yo:"ё",yu:"ю",ya:"я",ye:"е"};
    const convert=text=>{text=text.replace(/[‘’ʻ]/g,"'");const pair=m=>{let v=pairs[m.toLowerCase()];return m===m.toUpperCase()?v.toUpperCase():m[0]===m[0].toUpperCase()?v[0].toUpperCase()+v.slice(1):v;};text=text.replace(/o'|g'/gi,pair).replace(/sh|ch|ng|yo|yu|ya|ye/gi,pair).replace(/\be/gi,m=>m==="E"?"Э":"э");return [...text].map(c=>c==="'"?"ъ":map[c.toLowerCase()]?(c===c.toUpperCase()?map[c.toLowerCase()].toUpperCase():map[c]):c).join("");};
    return value.split(/(<[^>]*>)/).map(t=>t.startsWith("<")?t:convert(t)).join("");
  }
  function labels() {
    const index=locale==="en"?0:1;
    initial.forEach((uz,el)=>{
      const pair=window.osmonLabels.DICT[el.dataset.i18n];
      el.innerHTML=locale==="uz-Latn"?uz:locale==="uz-Cyrl"?cyrl(uz):pair?pair[index]:uz;
    });
    placeholders.forEach((uz,el)=>{
      const pair=window.osmonLabels.PH[el.dataset.i18nPh];
      el.placeholder=locale==="uz-Latn"?uz:locale==="uz-Cyrl"?cyrl(uz):pair[index];
      el.setAttribute("aria-label",el.placeholder);
    });
  }
  function text(selector,value) { const el=$(selector); el.textContent=value ?? ""; }
  function visible(selector,on) { $(selector).hidden=!on; }
  function city(addr) {
    const parts=addr.split(",").map(s=>s.trim()).filter(Boolean);
    const lead=parts[0]?.match(/^(.+?)\s+(?:sh\.?|shahri|шаҳри|ш\.)$/i)||parts[0]?.match(/^(?:г|g)\.\s*(.+)$/i);
    if(lead)return lead[1];
    const tail=parts.at(-1)||"";
    return /(tuman|ko.?cha|kuchasi|mavze|mahalla|MFY|uy\b|ул\.|улиц|дом|туман|кўча|street|district|avenue)/i.test(tail)?"":tail;
  }
  function programme(rows) {
    const host=$("#os-events"); host.replaceChildren();
    rows.forEach((r,i)=>{
      const row=document.createElement("div");row.className="os-ev-row";row.dataset.itemId=r.id;
      row.style.cssText="display:flex;gap:16px";
      // Exact original timeline markup, with creator text set via textContent.
      row.innerHTML='<div style="display:flex;flex-direction:column;align-items:center"><div style="width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffe9b0,#f4b95f 60%,#e79a3c);box-shadow:0 0 10px rgba(244,185,95,.8);flex:none;margin-top:3px"></div>'+(i===rows.length-1?'':'<div style="width:2px;flex:1;background:linear-gradient(rgba(120,160,200,.55),rgba(120,160,200,.15));margin:4px 0"></div>')+'</div><div style="padding-bottom:22px"></div>';
      [[r.time,"font-weight:700;font-size:12.5px;letter-spacing:.14em;color:#3d6a99"],[r.title,"font-family:'Yeseva One',serif;font-size:19px;margin:3px 0"],[r.description,"font-size:13.5px;opacity:.8;line-height:1.5"]].forEach(([value,style])=>{if(value){const el=document.createElement("div");el.style.cssText=style;el.textContent=value;row.lastChild.append(el);}});
      host.append(row);
    });
    visible("#os-events-section",rows.length>0);
  }
  function fit() {
    document.querySelectorAll(".os-fitline").forEach(el=>{el.style.whiteSpace="nowrap";el.style.overflowWrap="";});
    window.osmonFit();
    document.querySelectorAll(".os-fitline").forEach(el=>{if(el.clientWidth && el.scrollWidth>el.clientWidth+1){el.style.whiteSpace="normal";el.style.overflowWrap="anywhere";}});
  }
  function render() {
    const data=state.variants[locale]; if(!data)return;
    labels();document.documentElement.lang=locale;
    const names=data.people.filter(Boolean).slice(0,2), [n1="",n2=""]=names;
    const mono=names.map(n=>Array.from(n)[0]?.toUpperCase()).join("&");
    text("#os-splash-mono",mono);text("#os-foot-mono",mono);text("#os-splash-names",names.join(" & "));
    text("#os-hero-line1",n1);text("#os-hero-line2",n2?"& "+n2:"");visible("#os-hero-line2",!!n2);
    text("#os-inv-n1",n1);text("#os-inv-n2",n2);visible("#os-inv-joiner",!!n2);
    if(data.eventLabel)text('[data-i18n="splash_kicker"]',data.eventLabel);
    if(data.greeting)text('[data-i18n="inv_kicker"]',data.greeting);
    text("#os-message",data.message);visible("#os-message",!!data.message);
    text("#os-parents",data.hosts);visible("#os-parents-wrap",!!data.hosts);
    text("#os-hero-date",data.heroDate);text("#os-inv-date",data.invitationDate);
    text("#os-foot-date",data.numericDate);text("#os-cd-foot",data.countdownDate);
    text("#os-venue-name",data.venueName);text("#os-venue-addr",data.address);
    $("#os-venue-name").closest("section").hidden=!(data.venueName||data.address);
    const map=state.mapUrl || ((data.cityAddress||data.venueName)?"https://maps.google.com/?q="+encodeURIComponent(data.cityAddress||data.venueName):"");
    $("#os-map").href=map||"#";visible("#os-map",!!map);
    text("#os-foot-city",city(data.cityAddress).toUpperCase());visible("#os-foot-city-wrap",!!city(data.cityAddress));
    programme(data.program);if(data.programHeading)text('[data-i18n="tadbirlar_title"]',data.programHeading);
    const phone=$("#os-info-rsvp-text");phone.replaceChildren();
    if(data.rsvpNote)phone.append(data.rsvpNote+" ");
    if(state.phone){if(data.rsvpNote===null)phone.append(ui[locale].phone+": ");const link=document.createElement("a");link.href="tel:"+state.phone.replace(/[^\d+]/g,"");link.textContent=state.phone;link.style.fontWeight="700";phone.append(link);if(data.deadline)phone.append(" · "+ui[locale].by+" "+data.deadline);}
    visible("#os-info-rsvp",!!(state.phone||data.rsvpNote));
    if(data.giftNote!==null)text("#os-info-gifts-text",data.giftNote);visible("#os-info-gifts",data.giftNote!=="");
    // Palette labels fit the original source prose row; no new palette UI.
    const dress=[data.dress,...data.dressColors.map(c=>c.name||c.hex)].filter(Boolean).join("\n");
    text("#os-info-dress-text",dress);visible("#os-info-dress",!!dress);
    $("#os-info-section").hidden=!(state.phone||data.rsvpNote||dress||data.giftNote!=="");
    $("#os-wish-form").closest("section").hidden=!state.wishes;
    form.hidden=sent||closed();closePanel();if(state.preview)wishes=data.previewWishes||[];renderWishes();
    $("#os-cd-d").closest("section").hidden=state.target===null;
    document.querySelectorAll(".os-lang button").forEach(btn=>{btn.hidden=!state.enabledLocales.includes(btn.dataset.lang);btn.classList.toggle("on",btn.dataset.lang===locale);btn.setAttribute("aria-pressed",String(btn.dataset.lang===locale));});
    $(".os-lang").hidden=state.enabledLocales.length<2;
    document.title=data.title||"Cheksiz Osmon — Taklifnoma";
    document.documentElement.classList.toggle("reduced-motion",state.reducedMotion);
    document.documentElement.classList.add("os-bound");
    fit();tick();musicIcon();
  }
  function closed(){return state?.target!==null && !!state && Date.now()>=state.target+86400000;}
  function closePanel(){let panel=$(".wish-closed");if(!panel){panel=window.osmonClosePanel("#3d6a99");form.after(panel);}panel.hidden=!closed();const lines={"uz-Latn":["Daftar yopildi","Bayram o‘tdi — rahmat","Yangi tilaklarni qabul qilish to‘xtatildi."],"uz-Cyrl":["Дафтар ёпилди","Байрам ўтди — раҳмат","Янги тилакларни қабул қилиш тўхтатилди."],en:["Book closed","Thank you for celebrating","New wishes are no longer accepted."],ru:["Книга закрыта","Спасибо за праздник","Новые пожелания больше не принимаются."]}[locale];panel.children[1].textContent=lines[0];panel.children[2].textContent=lines[1];panel.children[3].textContent=lines[2];}
  function tick() {
    if(!state)return;
    const diff=Math.max(0,(state.target||0)-Date.now());
    text("#os-cd-d",Math.floor(diff/86400000));
    text("#os-cd-h",String(Math.floor(diff%86400000/3600000)).padStart(2,"0"));
    text("#os-cd-m",String(Math.floor(diff%3600000/60000)).padStart(2,"0"));
    text("#os-cd-s",String(Math.floor(diff%60000/1000)).padStart(2,"0"));
    if(closed()){form.hidden=true;closePanel();}
  }
  function musicIcon(){if(!state)return;const playing=!audio.paused;$("#os-music-off").style.display=playing?"none":"block";$("#os-music").setAttribute("aria-label",playing?ui[locale].pause:ui[locale].play);$("#os-music").setAttribute("aria-pressed",String(playing));}
  async function play(){if(!state?.music.enabled||!state.music.url||state.silentPlayback||musicPaused)return;try{await audio.play();musicPlayed=true;}catch{}musicIcon();}
  function configureMusic(previous){
    const url=state.music.enabled&&/^(https?:\/\/|\/(?!\/))/.test(state.music.url)?state.music.url:"";
    $("#os-music").style.display=url?"flex":"none";
    if(url!==(audio.getAttribute("src")||"")){audio.pause();musicPlayed=false;musicPaused=false;if(url)audio.src=url;else audio.removeAttribute("src");}
    audio.muted=state.silentPlayback;
    if(!url||state.silentPlayback)audio.pause();
    else if(!state.preview||opened)play();
    musicIcon();
  }
  $("#os-music").addEventListener("click",()=>{if(audio.paused){musicPaused=false;play();}else{audio.pause();musicPaused=true;musicIcon();}});
  audio.addEventListener("play",musicIcon);audio.addEventListener("pause",musicIcon);
  document.addEventListener("osmon:opened",()=>{opened=true;play();});
  ["pointerdown","keydown"].forEach(event=>document.addEventListener(event,e=>{if(e.target.closest?.("#os-music"))return;if(!musicPlayed&&!musicPaused&&opened)play();},{passive:true}));
  document.addEventListener("visibilitychange",()=>document.body.classList.toggle("os-hidden",document.hidden));
  document.fonts.ready.then(fit);window.addEventListener("resize",fit);
  $(".os-lang").addEventListener("click",e=>{const btn=e.target.closest("button[data-lang]");if(btn&&state.enabledLocales.includes(btn.dataset.lang)){locale=btn.dataset.lang;render();status.hidden=true;}});
  function notice(value){status.textContent=value;status.style.display="block";status.hidden=false;}
  function endpoint(){return "/api/public/invitations/"+encodeURIComponent(state.invitationId)+"/wishes";}
  function renderWishes(){$("#os-wish-list").replaceChildren();$("#os-wish-empty").hidden=wishes.length>0;
      wishes.forEach(w=>{const card=document.createElement("div");card.style.cssText="background:rgba(255,255,255,.36);border:1px solid rgba(255,255,255,.65);border-radius:18px;padding:14px 18px;overflow-wrap:anywhere";const name=document.createElement("div"),msg=document.createElement("div");name.style.cssText="font-weight:700;font-size:14px;color:#2b4d74";msg.style.cssText="font-size:14px;line-height:1.55;margin-top:4px;white-space:pre-line";name.textContent=w.name;msg.textContent=w.message||w.text;card.append(name,msg);$("#os-wish-list").append(card);});
  }
  async function loadWishes(){
    const id=++wishLoad;if(state.preview){wishes=state.variants[locale].previewWishes||[];renderWishes();return;}wishes=[];renderWishes();
    if(!state.wishes||state.preview||!state.invitationId)return;
    try{const response=await fetch(endpoint(),{credentials:"same-origin",cache:"no-store"});if(!response.ok)throw Error();const result=await response.json();if(id!==wishLoad)return;
      wishes=Array.isArray(result.wishes)?result.wishes:[];renderWishes();
    }catch{if(id===wishLoad)notice(ui[locale].loadError);}
  }
  form.addEventListener("submit",async e=>{
    e.preventDefault();if(pending||!state||!state.wishes||closed()||!form.reportValidity())return;
    if(state.preview||!state.invitationId){notice(ui[locale].preview);return;}
    const name=form.elements.wname.value.trim(),message=form.elements.wmsg.value.trim();if(!name||!message)return;
    const context=state;pending=true;const button=form.querySelector('button[type="submit"]');button.disabled=true;notice(ui[locale].sending);
    try{const response=await fetch(endpoint(),{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message,guestToken:context.guestToken||undefined})});if(!response.ok)throw Error();const result=await response.json();if(result.ok!==true)throw Error();if(state===context){sent=true;form.reset();form.hidden=true;notice(ui[locale].pending);}}
    catch{if(state===context)notice(ui[locale].error);}
    finally{pending=false;button.disabled=false;}
  });
  function receive(message){if(message?.type!=="taklifla-osmon:update"||!message.payload?.variants)return;const previous=state;state=message.payload;locale=state.locale;render();configureMusic(previous);if(!previous||previous.invitationId!==state.invitationId||previous.preview!==state.preview||previous.wishes!==state.wishes){sent=false;form.hidden=closed();status.hidden=true;loadWishes();}}
  window.addEventListener("message",e=>{if(e.origin===location.origin&&e.source===parent)receive(e.data);});
  parent.postMessage({type:"taklifla-osmon:ready"},location.origin);
  setInterval(tick,1000);
})();
