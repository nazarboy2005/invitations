/* Typed data/API bridge. The source engine owns opening, reveal and petals. */
(function(){
  "use strict";
  var state=null,locale="uz-Latn",wishes=[],request=0,generation=0,pending=false,sent=false,opened=false,musicChoice=null;
  var $=function(s){return document.querySelector(s)}, all=function(s){return Array.from(document.querySelectorAll(s))};
  var text=function(s,v){var el=$(s);if(el)el.textContent=v||"";};
  var show=function(s,on){var el=$(s);if(el)el.hidden=!on;};
  var safe=function(url){return typeof url==="string" && (/^https?:\/\//i.test(url)||/^\/(?!\/)/.test(url))?url:"";};
  var extra={"uz-Latn": {"wish_thanks": "Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.", "preview": "Ko‘rib chiqishda tilak yuborilmaydi.", "failure": "Yuborib bo‘lmadi. Qayta urinib ko‘ring.", "load_failure": "Yuborib bo‘lmadi. Qayta urinib ko‘ring.", "music_play": "Musiqa", "music_pause": "Musiqa", "wish_name_ph": "Ismingiz", "wish_msg_ph": "Tilak, she’r yoki xotira yozing…", "languages": "Til"}, "en": {"wish_thanks": "Your wish was submitted. It will appear after approval.", "preview": "Wishes are not sent in preview.", "failure": "Unable to send. Please try again.", "load_failure": "Unable to send. Please try again.", "music_play": "Music", "music_pause": "Music", "wish_name_ph": "Your name", "wish_msg_ph": "Write your blessing, a verse, a memory…", "languages": "Language"}, "ru": {"wish_thanks": "Пожелание отправлено. Оно появится после одобрения.", "preview": "В предпросмотре пожелания не отправляются.", "failure": "Не удалось отправить. Попробуйте ещё раз.", "load_failure": "Не удалось отправить. Попробуйте ещё раз.", "music_play": "Музыка", "music_pause": "Музыка", "wish_name_ph": "Ваше имя", "wish_msg_ph": "Напишите пожелание, стих или воспоминание…", "languages": "Язык"}, "uz-Cyrl": {"wish_thanks": "Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.", "preview": "Кўриб чиқишда тилак юборилмайди.", "failure": "Юбориб бўлмади. Қайта уриниб кўринг.", "load_failure": "Юбориб бўлмади. Қайта уриниб кўринг.", "music_play": "Мусиқа", "music_pause": "Мусиқа", "wish_name_ph": "Исмингиз", "wish_msg_ph": "Тилак, ше’р ёки хотира ёзинг…", "languages": "Тил"}};
  Object.entries({"uz-Latn":["Tilaklarni yuklab bo‘lmadi.","Musiqani yoqish","Musiqani to‘xtatish"],"uz-Cyrl":["Тилакларни юклаб бўлмади.","Мусиқани ёқиш","Мусиқани тўхтатиш"],en:["Wishes could not be loaded.","Play music","Pause music"],ru:["Не удалось загрузить пожелания.","Включить музыку","Приостановить музыку"]}).forEach(function(pair){extra[pair[0]].load_failure=pair[1][0];extra[pair[0]].music_play=pair[1][1];extra[pair[0]].music_pause=pair[1][2];});
  window.qogozLabels["uz-Cyrl"]=Object.fromEntries(Object.entries(window.qogozLabels["uz-Latn"]).map(function(pair){return [pair[0],window.qogozCyrl(pair[1])]}));
  function copy(){return Object.assign({},window.qogozLabels[locale],extra[locale]);}
  function status(key){var el=$("#qg-wish-confirm");el.dataset.statusKey=key;el.style.display="block";el.textContent=copy()[key];}
  function closed(){return !!state.instant && Date.now()>=Date.parse(state.instant)+86400000;}
  function closePanel(){
    var panel=$(".wish-closed");
    if(!panel){panel=window.qogozClosePanel("#c9a24b");$("#qg-wish-form").after(panel);}
    panel.hidden=!closed();panel.setAttribute("role","status");
    var lines={"uz-Latn":["Daftar yopildi","Bayram o‘tdi — rahmat","Yangi tilaklarni qabul qilish to‘xtatildi. Mehmonlar qoldirgan so‘zlar bayram esdaligi sifatida saqlanadi."],"uz-Cyrl":["Дафтар ёпилди","Байрам ўтди — раҳмат","Янги тилакларни қабул қилиш тўхтатилди. Меҳмонлар қолдирган сўзлар байрам эсдалиги сифатида сақланади."],en:["Book closed","Thank you for celebrating","New wishes are no longer accepted. Your kind words remain as memories of the celebration."],ru:["Книга закрыта","Спасибо за праздник","Новые пожелания больше не принимаются. Слова гостей остаются на память о празднике."]}[locale];
    panel.children[1].textContent=lines[0];panel.children[2].textContent=lines[1];panel.children[3].textContent=lines[2];
  }
  function renderWishes(){window.renderQogozWishes(wishes);}
  function musicIcon(){var a=$("#qg-audio"),playing=!a.paused;$("#qg-music-off").style.display=playing?"none":"block";$("#qg-music").setAttribute("aria-pressed",String(playing));$("#qg-music").setAttribute("aria-label",copy()[playing?"music_pause":"music_play"]);}
  function play(){var a=$("#qg-audio");if(state&&safe(state.music.enabled?state.music.url:"")&&!state.silentPlayback&&musicChoice!==false)a.play().then(musicIcon).catch(musicIcon);}
  function render(){
    var d=state.variants[locale],c=d.content,u=copy();if(!d)return;document.documentElement.lang=locale;document.documentElement.classList.toggle("qg-reduced",state.reducedMotion);
    all("[data-i18n]").forEach(function(n){var v=u[n.dataset.statusKey||n.dataset.i18n];if(v!==undefined)n.textContent=v;});all("[data-i18n-ph]").forEach(function(n){n.placeholder=u[n.dataset.i18nPh]||"";n.setAttribute("aria-label",n.placeholder);});
    var names=c.people.filter(function(n){return n.trim()}).slice(0,2).join(" & ");["cover","hero","foot"].forEach(function(k){text("#qg-"+k+"-names",names);});var dots=d.wallDate?d.wallDate.split("-").reverse().join(" · "):"";text("#qg-cover-dots",dots);text("#qg-foot-dots",dots);text("#qg-hero-dateline",[d.dateLabel,d.timeLabel].filter(Boolean).join(" · "));text("#qg-frame-invdate",[d.dateLabel,d.timeLabel].filter(Boolean).join(" · "));text("#qg-cd-invdate",[d.dateLabel,d.timeLabel].filter(Boolean).join(" · "));text("#qg-frame-venuecity",c.venueName);
    if(c.eventLabel)text('[data-i18n="cover_kicker"]',c.eventLabel);if(c.greeting)text('[data-i18n="inv_header"]',c.greeting);if(c.hosts)text('[data-i18n="frame_cursive"]',c.hosts);text('[data-i18n="frame_sentence"]',c.message);
    window.renderQogozProgram(d.program);if(c.programHeading)text('[data-i18n="events_header"]',c.programHeading);
    text("#qg-venue-name",c.venueName);text("#qg-venue-addr",c.address);text("#qg-venue-note",c.landmark);show("#qg-venue-note-wrap",!!c.landmark);show("#qg-venue-section",!!(c.venueName||c.address));var map=safe(d.mapUrl);$("#qg-map").href=map||"#";show("#qg-map",!!map);
    text("#qg-info-dress-text",d.dressText);show("#qg-info-dress",!!d.dressText);var contact=[d.contactNote||c.hosts,state.contacts.phoneNumber,state.contacts.telegramUsername?"@"+state.contacts.telegramUsername.replace(/^@/,""):""].filter(Boolean).join("\n");text("#qg-info-contact-text",contact);show("#qg-info-contact",!!contact);show("#qg-info-divider",!!(contact&&d.dressText));show("#qg-info-section",!!(contact||d.dressText));
    if(state.contacts.phoneNumber){var target=$("#qg-info-contact-text"),phone=state.contacts.phoneNumber,content=target.textContent,i=content.indexOf(phone),a=document.createElement("a");a.href="tel:"+phone.replace(/[^+\d]/g,"");a.textContent=phone;target.replaceChildren(document.createTextNode(content.slice(0,i)),a,document.createTextNode(content.slice(i+phone.length)));}
    if(d.footerNote!==null)text("#qg-foot-note",d.footerNote);show("#qg-foot-note",d.footerNote!=="");show("#qg-countdown-section",!!state.instant);show("#qg-wishes-section",state.wishesEnabled);show("#qg-wish-form",!sent&&!closed());closePanel();
    all(".qg-lang button").forEach(function(n){n.hidden=!state.enabledLocales.includes(n.dataset.lang);n.classList.toggle("on",n.dataset.lang===locale);n.setAttribute("aria-pressed",String(n.dataset.lang===locale));});show(".qg-lang",state.enabledLocales.length>1);
    if(state.preview)wishes=d.wishes||[];renderWishes();fitNames();tick();musicIcon();$(".qg-lang").setAttribute("aria-label",u.languages);document.title=c.title||"Qog‘oz ertagi";document.documentElement.setAttribute("data-ready","");document.documentElement.removeAttribute("data-awaiting-data");
  }
  function fitNames(){all(".qg-long-name").forEach(function(n){n.classList.remove("qg-long-name")});window.qogozFit();all("#qg-cover-names,#qg-hero-names,#qg-foot-names").forEach(function(n){if(n.scrollWidth>n.clientWidth+1)n.classList.add("qg-long-name")});}
  function tick(){if(!state)return;var delta=!state.instant?null:Math.max(0,Date.parse(state.instant)-Date.now());[["d",86400000,null],["h",3600000,24],["m",60000,60],["s",1000,60]].forEach(function(p){var n=delta===null?null:Math.floor(delta/p[1]);if(p[2])n=n%p[2];text("#qg-cd-"+p[0],n===null?"–":p[0]==="d"?String(n):String(n).padStart(2,"0"));});if(closed()&&!$("#qg-wish-form").hidden){show("#qg-wish-form",false);closePanel();}}
  function endpoint(){return "/api/public/invitations/"+encodeURIComponent(state.invitationId)+"/wishes";}
  async function loadWishes(){
    var seq=++request;if(state.preview){wishes=state.variants[locale].wishes||[];renderWishes();return;}wishes=[];renderWishes();if(!state.wishesEnabled||!state.invitationId)return;
    try{var response=await fetch(endpoint(),{credentials:"same-origin",cache:"no-store"});if(!response.ok)throw Error("load");var data=await response.json();if(seq===request){wishes=Array.isArray(data.wishes)?data.wishes:[];renderWishes();}}catch(_){if(seq===request)status("load_failure");}
  }
  window.addEventListener("message",function(e){
    if(e.source!==window.parent||e.origin!==location.origin||e.data?.type!=="taklifla-qogoz-ertagi:update")return;
    var next=e.data.payload;if(!next||!next.variants||!next.enabledLocales?.includes(next.locale)||!next.variants[next.locale])return;
    var changed=!state||state.invitationId!==next.invitationId||state.preview!==next.preview||state.wishesEnabled!==next.wishesEnabled||state.guestToken!==next.guestToken;
    if(changed){generation++;sent=false;pending=false;var confirm=$("#qg-wish-confirm");delete confirm.dataset.statusKey;confirm.style.display="none";$("#qg-wish-form").reset();}
    state=next;locale=next.locale;render();if(changed||state.preview)loadWishes();
    var audio=$("#qg-audio"),url=safe(state.music.enabled?state.music.url:"");show("#qg-music",!!url&&!state.silentPlayback);$("#qg-music").style.display=url&&!state.silentPlayback?"flex":"none";
    if(audio.getAttribute("src")!==url){audio.pause();if(url)audio.src=url;else audio.removeAttribute("src");musicChoice=null;}
    if(state.silentPlayback)audio.pause();else if(!state.preview||opened)play();musicIcon();
  });
  $(".qg-lang").addEventListener("click",function(e){var b=e.target.closest("button[data-lang]");if(!b||!state?.enabledLocales.includes(b.dataset.lang))return;locale=b.dataset.lang;render();});
  window.qogozReduced=function(){return !!state?.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches};
  window.qogozPlay=function(){opened=true;play();setTimeout(function(){$("#qg-hero-names").setAttribute("tabindex","-1");$("#qg-hero-names").focus({preventScroll:true});},window.qogozReduced()?0:1300)};
  $("#qg-music").addEventListener("click",function(){var audio=$("#qg-audio");musicChoice=audio.paused;if(musicChoice)play();else audio.pause();musicIcon();});
  $("#qg-audio").addEventListener("play",musicIcon);$("#qg-audio").addEventListener("pause",musicIcon);
  $("#qg-wish-form").addEventListener("submit",async function(e){
    e.preventDefault();if(!state||pending||closed())return;if(state.preview){status("preview");return;}
    var form=e.currentTarget;if(!form.reportValidity())return;var name=form.elements.wname.value.trim(),message=form.elements.wmsg.value.trim();if(!name||!message)return;
    pending=true;form.querySelector("button").disabled=true;var identity=generation;
    try{var response=await fetch(endpoint(),{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message,guestToken:state.guestToken||undefined})});if(!response.ok)throw Error("submit");var data=await response.json();if(data.ok!==true)throw Error("submit");if(generation!==identity)return;sent=true;form.reset();show("#qg-wish-form",false);status("wish_thanks");}
    catch(_){if(generation===identity)status("failure");}finally{if(generation===identity){pending=false;form.querySelector("button").disabled=false;}}
  });
  window.addEventListener("resize",fitNames);document.fonts.ready.then(fitNames);setInterval(tick,1000);
  window.parent.postMessage({type:"taklifla-qogoz-ertagi:ready"},location.origin);
})();
