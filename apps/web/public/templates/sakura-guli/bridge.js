/* Platform boundary: no provider runtime, demo persistence, or fixture generation. */
(() => {
  "use strict";
  let p, labels, started = false, opened = false, mutedByGuest = false, wishGeneration = 0,context="",generation=0,pending=false,sent=false,wishItems=[];
  const $ = s => document.querySelector(s), audio = $("#sk-audio");
  const cy = {
    splash_kicker:"Тўй таклифномаси",splash_open:"Таклифномани очиш",hero_kicker:"никоҳ тўйи",scroll_hint:"пастга",country_word:"ЎЗБЕКИСТОН",
    inv_kicker:"қувончга тўла қалб билан",inv_h2:"Таклифнома",events_kicker:"тантана",events_h2:"Тўй куни",venue_kicker:"қаерда йиғиламиз",venue_h2:"Манзил",btn_map:"Харитани очиш",
    info_dress_label:"Кийиниш услуби",info_contact_label:"Боғланиш",info_note_label:"Билиб қўйинг",wish_kicker:"бизга хат қолдиринг",wish_h2:"Тилаклар",btn_send:"Тилак йўллаш",wish_thanks:"Раҳмат — тилагингиз юборилди ♡",wish_empty:"Биринчи бўлиб тилак қолдиринг.",cd_kicker:"ҳар лаҳзани санаяпмиз",cd_h2:"Базмимизгача",cd_days:"Кун",cd_hours:"Соат",cd_mins:"Дақиқа",cd_secs:"Сония",footer_note_default:"Гуллар остида кўришгунча",footer_signoff:"Сакура Гули · меҳр билан"
  };
  const messages = {
    "uz-Latn":{name:"Ismingiz",wish:"Kelin-kuyov uchun iliq so‘zlar…",preview:"Bu ko‘rib chiqish namunasi — tilak yuborilmaydi.",sent:"Tilagingiz yuborildi. Egasi tasdiqlagach ko‘rinadi.",error:"Yuborib bo‘lmadi. Qayta urinib ko‘ring.",load:"Tilaklarni yuklab bo‘lmadi.",music:"Musiqa"},
    "uz-Cyrl":{name:"Исмингиз",wish:"Келин-куёв учун илиқ сўзлар…",preview:"Бу кўриб чиқиш намунаси — тилак юборилмайди.",sent:"Тилагингиз юборилди. Эгаси тасдиқлагач кўринади.",error:"Юбориб бўлмади. Қайта уриниб кўринг.",load:"Тилакларни юклаб бўлмади.",music:"Мусиқа"},
    en:{name:"Your name",wish:"Warm words for the couple…",preview:"Preview only — wishes are not sent.",sent:"Your wish was submitted and will appear after approval.",error:"Unable to send. Please try again.",load:"Unable to load wishes.",music:"Music"},
    ru:{name:"Ваше имя",wish:"Тёплые слова для молодожёнов…",preview:"Предпросмотр — пожелания не отправляются.",sent:"Пожелание отправлено и появится после одобрения.",error:"Не удалось отправить. Попробуйте ещё раз.",load:"Не удалось загрузить пожелания.",music:"Музыка"}
  };
  const text = (sel, value) => { const el=$(sel); if(el) el.textContent=value ?? ""; };
  const show = (sel, yes) => { const el=$(sel); if(el) el.hidden=!yes; };
  const safe = url => typeof url === "string" && /^(https?:\/\/|\/(?!\/))/i.test(url) ? url : "";
  const l = () => messages[p?.locale] || messages["uz-Latn"];
  function localize() {
    const locale=p.locale;
    document.documentElement.lang=locale;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key=el.dataset.i18n, pair=labels.pairs[key];
      el.innerHTML=locale==="uz-Cyrl" ? cy[key] || labels.uz[key] || "" : locale==="en" ? pair?.[0] || labels.uz[key] || "" : locale==="ru" ? pair?.[1] || labels.uz[key] || "" : labels.uz[key] || "";
    });
    document.querySelectorAll(".sk-lang button").forEach(b=>{ b.hidden=!p.enabledLocales.includes(b.dataset.lang);b.classList.toggle("on",b.dataset.lang===locale);b.setAttribute("aria-pressed",String(b.dataset.lang===locale)); });
    show(".sk-lang",p.enabledLocales.length>1);
    const form=$("#sk-wish-form");
    form.elements.wname.placeholder=l().name;form.elements.wname.setAttribute("aria-label",l().name);
    form.elements.wmsg.placeholder=l().wish;form.elements.wmsg.setAttribute("aria-label",l().wish);
    $("#sk-music").setAttribute("aria-label",l().music);
  }
  function musicIcon(){
    const playing=!audio.paused;
    $("#sk-music-note").style.animation=playing?"pulseSoft 1.3s ease-in-out infinite":"none";
    $("#sk-music-slash").style.opacity=playing?"0":".85";
    $("#sk-music").setAttribute("aria-pressed",String(playing));
  }
  function tryMusic(){ if(!mutedByGuest && !p.silentPlayback && audio.getAttribute("src")) audio.play().catch(musicIcon); }
  $("#sk-music").addEventListener("click",()=>{if(audio.paused){mutedByGuest=false;tryMusic();}else{mutedByGuest=true;audio.pause();}});
  ["play","pause","ended","error"].forEach(e=>audio.addEventListener(e,musicIcon));
  $("#sk-open").addEventListener("click",()=>{
    if(opened || !p)return;opened=true;
    const splash=$("#sk-splash");splash.style.opacity="0";splash.style.visibility="hidden";splash.style.pointerEvents="none";
    document.body.style.overflow="";splash.inert=true;tryMusic();
    const heading=$("#sk-hero-n1").parentElement;heading.tabIndex=-1;heading.focus({preventScroll:true});
  });
  $(".sk-lang").addEventListener("click",e=>{ const b=e.target.closest("[data-lang]"); if(b && p.enabledLocales.includes(b.dataset.lang)) parent.postMessage({type:"sakura:locale",locale:b.dataset.lang},location.origin); });
  function renderWishes(items){
    const list=$("#sk-wish-list");list.replaceChildren();
    for(const w of items){
      const card=document.createElement("div"),name=document.createElement("div"),body=document.createElement("div");
      card.style.cssText="background:rgba(255,255,255,.86);border-radius:16px;padding:14px 16px;box-shadow:0 8px 20px rgba(90,140,150,.12);";
      name.style.cssText="font-family:'Shippori Mincho',serif;font-size:14.5px;color:#c2637f;";
      body.style.cssText="font-size:13.5px;color:#4c3a45;margin-top:6px;line-height:1.6;overflow-wrap:anywhere;white-space:pre-wrap;";
      name.textContent=w.name;body.textContent=w.message||w.text;card.append(name,body);list.append(card);
    }
    show("#sk-wish-empty",items.length===0);
  }
  function setStatus(key){$("#sk-wish-status").dataset.statusKey=key;text("#sk-wish-status",key?l()[key]:"");}
  function closed(){return p?.target!==null&&!!p&&Date.now()>=p.target+86400000;}
  function closePanel(){let panel=$(".wish-closed");if(!panel){panel=window.sakuraClosePanel("#c2637f");$("#sk-wish-form").after(panel);}panel.hidden=!closed();const lines={"uz-Latn":["Daftar yopildi","Bayram o‘tdi — rahmat","Yangi tilaklarni qabul qilish to‘xtatildi."],"uz-Cyrl":["Дафтар ёпилди","Байрам ўтди — раҳмат","Янги тилакларни қабул қилиш тўхтатилди."],en:["Book closed","Thank you for celebrating","New wishes are no longer accepted."],ru:["Книга закрыта","Спасибо за праздник","Новые пожелания больше не принимаются."]}[p.locale];panel.children[1].textContent=lines[0];panel.children[2].textContent=lines[1];panel.children[3].textContent=lines[2];}
  async function loadWishes(){const seq=++wishGeneration;if(p.preview){wishItems=p.previewWishes||[];renderWishes(wishItems);return;}wishItems=[];renderWishes([]);if(!p.wishesEnabled)return;try{const r=await fetch(`${p.apiBase}/wishes`,{credentials:"same-origin",cache:"no-store"});if(!r.ok)throw Error();const data=await r.json();if(seq===wishGeneration){wishItems=Array.isArray(data.wishes)?data.wishes:[];renderWishes(wishItems);}}catch{if(seq===wishGeneration)setStatus("load");}}
  $("#sk-wish-form").addEventListener("submit",async e=>{e.preventDefault();if(!p||pending||!p.wishesEnabled||closed())return;if(p.preview){setStatus("preview");return;}const form=e.currentTarget;if(!form.reportValidity())return;const name=form.elements.wname.value.trim(),message=form.elements.wmsg.value.trim();if(!name||!message)return;const version=generation,button=form.querySelector('[type="submit"]');pending=true;button.disabled=true;try{const r=await fetch(`${p.apiBase}/wishes`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message,guestToken:p.guestToken||undefined})});if(!r.ok)throw Error();const data=await r.json();if(data.ok!==true)throw Error();if(version===generation){sent=true;form.hidden=true;form.reset();text("#sk-wish-confirm",l().sent);show("#sk-wish-confirm",true);$("#sk-wish-confirm").style.display="block";setStatus("");}}catch{if(version===generation)setStatus("error");}finally{if(version===generation){pending=false;button.disabled=false;}}});
  function countdown(){
    if(p?.target===null||!p)return;
    const diff=Math.max(0,p.target-Date.now());
    [Math.floor(diff/86400000),Math.floor(diff%86400000/3600000),Math.floor(diff%3600000/60000),Math.floor(diff%60000/1000)].forEach((v,i)=>text("#sk-cd-"+["d","h","m","s"][i],i?String(v).padStart(2,"0"):String(v)));
    if(closed()){$("#sk-wish-form").hidden=true;closePanel();}
  }
  setInterval(countdown,1000);matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",()=>bind());
  function bind(){
    if(!p || !labels)return;
    localize();
    const n1=p.names[0] || "",n2=p.names[1] || "",pair=[n1,n2].filter(Boolean).join(" & "),mono=[n1,n2].filter(Boolean).map(n=>Array.from(n)[0]).join(" & ").toUpperCase();
    for(const id of ["splash","foot"]){text(`#sk-${id}-names`,pair);text(`#sk-${id}-mono`,mono);text(`#sk-${id}-date`,p.dateShort);}
    for(const id of ["hero","frame"]){text(`#sk-${id}-n1`,n1);text(`#sk-${id}-n2`,n2);show(`#sk-${id}-amp`,!!n2);text(`#sk-${id}-date`,p.dateLong);}
    text('[data-i18n="hero_kicker"]',p.eventLabel);text('[data-i18n="splash_kicker"]',p.eventLabel);
    text('[data-i18n="inv_kicker"]',p.greeting);show('[data-i18n="inv_kicker"]',!!p.greeting);
    text("#sk-frame_kicker",p.hosts);show("#sk-frame_kicker",!!p.hosts);text("#sk-frame_request",p.message);
    text("#sk-frame-timevenue",[p.time,[p.venueName,p.city].filter(Boolean).join(", ")].filter(Boolean).join(" · "));text("#sk-hero-city",p.city);show("#sk-hero-loc-wrap",!!p.city);
    text("#sk-venue-name",p.venueName);text("#sk-venue-addr",p.address);text("#sk-venue-note",p.landmark);show("#sk-venue-note-wrap",!!p.landmark);
    show("#sk-venue-section",!!(p.venueName || p.address || safe(p.mapUrl)));
    const map=$("#sk-map"),url=safe(p.mapUrl);map.href=url || "#";map.rel="noopener noreferrer";show("#sk-map",!!url);
    window.sakuraTimeline(p.program);show("#sk-events-section",p.program.some(e=>e.time || e.title || e.description));
    if(p.programHeading)text('[data-i18n="events_h2"]',p.programHeading);
    $("#sk-events").querySelectorAll(".sk-ev-row").forEach((row,i)=>row.dataset.itemId=p.program.filter(e=>e.time || e.title || e.description)[i]?.id || "");
    text("#sk-info-dress-text",p.dressText);show("#sk-info-dress",!!p.dressText);
    const contact=$("#sk-info-contact-text");contact.replaceChildren();
    if(p.contactNote)contact.append(document.createTextNode(p.contactNote),document.createElement("br"));
    const phone=p.contacts.phone,telegram=p.contacts.telegram.replace(/^@/,""),instagram=safe(p.contacts.instagram);
    for(const [value,href] of [[phone,`tel:${phone.replace(/[^\d+]/g,"")}`],[telegram,`https://t.me/${encodeURIComponent(telegram)}`],[instagram,instagram]]){if(!value)continue;const a=document.createElement("a");a.textContent=value;a.href=href;a.rel="noopener noreferrer";contact.append(a,document.createElement("br"));}
    show("#sk-info-contact",!!(p.contactNote||phone || telegram || instagram));text("#sk-info-note-text",p.infoNote);show("#sk-info-note",!!p.infoNote);show("#sk-info-section",!!(p.dressText || p.contactNote||p.infoNote||phone || telegram || instagram));
    if(p.footerNote!==null)text("#sk-foot-note",p.footerNote);show("#sk-foot-note",p.footerNote!=="");
    const rows=[...$("#sk-info-section").querySelectorAll('[id^="sk-info-"]')].filter(n=>['sk-info-dress','sk-info-contact','sk-info-note'].includes(n.id)&&!n.hidden);rows.forEach((n,i)=>n.style.borderBottom=i===rows.length-1?"none":"1px solid rgba(160,185,190,.35)");
    show("#sk-wishes-section",p.wishesEnabled);$("#sk-wish-form").hidden=sent||closed();closePanel();if(sent){text("#sk-wish-confirm",l().sent);show("#sk-wish-confirm",true);$("#sk-wish-confirm").style.display="block";}if(!$("#sk-wish-form").elements.wname.value)$("#sk-wish-form").elements.wname.value=p.guestName;
    text("#sk-cd-foot",p.dateLong);show("#sk-countdown-section",!!p.target);countdown();
    const music=safe(p.musicUrl);$("#sk-music").style.display=music&&!p.silentPlayback?"flex":"none";if((audio.getAttribute("src")||"")!==music){audio.pause();mutedByGuest=false;if(music)audio.src=music;else audio.removeAttribute("src");}
    audio.muted=!!p.silentPlayback;
    const reduced=p.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;document.documentElement.toggleAttribute("data-reduced",reduced);
    document.documentElement.dataset.bound="true";document.documentElement.removeAttribute("data-awaiting-data");
    if(!started){started=true;document.body.style.overflow="hidden";window.sakuraFitNames();window.sakuraStartMotion(reduced);}
    dispatchEvent(new Event("resize"));musicIcon();if(p.preview)wishItems=p.previewWishes||[];renderWishes(wishItems);const statusKey=$("#sk-wish-status").dataset.statusKey;if(statusKey)setStatus(statusKey);
    // Keep authored long wording readable inside the source floral frame.
    const frame=$("#sk-frame_request").parentElement,card=frame.parentElement;
    frame.style.position="absolute";card.style.aspectRatio="2 / 3";card.style.minHeight="";
    requestAnimationFrame(()=>{if(frame.scrollHeight>frame.clientHeight+1){frame.style.position="relative";card.style.minHeight="";card.style.aspectRatio="auto";}});
  }
  addEventListener("message",e=>{if(e.origin!==location.origin || e.source!==parent || e.data?.type!=="sakura:update")return;const next=e.data.payload;if(!next?.enabledLocales?.includes(next.locale))return;const key=[next.apiBase,next.preview,next.wishesEnabled,next.guestToken].join(":");const changed=key!==context;if(changed){context=key;generation++;sent=false;pending=false;$("#sk-wish-form").reset();$("#sk-wish-form").querySelector("button").disabled=false;show("#sk-wish-confirm",false);setStatus("");}p=next;bind();if(changed)loadWishes();});
  fetch("source/labels.json").then(r=>r.json()).then(data=>{labels=data;bind();});
  parent.postMessage({type:"sakura:ready"},location.origin);
})();
