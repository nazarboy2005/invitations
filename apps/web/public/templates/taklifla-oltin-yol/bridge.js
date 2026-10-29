/* Typed data/API bridge. The source engine owns opening, reveal and petals. */
(function(){
  "use strict";
  var state=null,locale="uz-Latn",wishes=[],request=0,generation=0,pending=false,sent=false,opened=false,musicChoice=null;
  var $=function(s){return document.querySelector(s)}, all=function(s){return Array.from(document.querySelectorAll(s))};
  var text=function(s,v){var el=$(s);if(el)el.textContent=v||"";};
  var show=function(s,on){var el=$(s);if(el)el.hidden=!on;};
  var safe=function(url){return typeof url==="string" && (/^https?:\/\//i.test(url)||/^\/(?!\/)/.test(url))?url:"";};
  function copy(){var c=window.OltinYolLabels[locale]||window.OltinYolLabels["uz-Latn"];return Object.assign({},c,{preview:c.preview_notice,failure:c.wish_error,load_failure:c.wish_load_error});}
  function status(key){var el=$("#oy-wish-confirm");el.dataset.statusKey=key;el.style.display="block";el.textContent=copy()[key];}
  function closed(){return state.epoch!==null && Date.now()>=state.epoch+86400000;}
  function closePanel(){
    var panel=$(".wish-closed");
    if(!panel){panel=window.oltinClosePanel("#b3552f");$("#oy-wish-form").after(panel);}
    panel.hidden=!closed();panel.setAttribute("role","status");
    var lines={"uz-Latn":["Daftar yopildi","Bayram o‘tdi — rahmat","Yangi tilaklarni qabul qilish to‘xtatildi. Mehmonlar qoldirgan so‘zlar bayram esdaligi sifatida saqlanadi."],"uz-Cyrl":["Дафтар ёпилди","Байрам ўтди — раҳмат","Янги тилакларни қабул қилиш тўхтатилди. Меҳмонлар қолдирган сўзлар байрам эсдалиги сифатида сақланади."],en:["Book closed","Thank you for celebrating","New wishes are no longer accepted. Your kind words remain as memories of the celebration."],ru:["Книга закрыта","Спасибо за праздник","Новые пожелания больше не принимаются. Слова гостей остаются на память о празднике."]}[locale];
    panel.children[1].textContent=lines[0];panel.children[2].textContent=lines[1];panel.children[3].textContent=lines[2];
  }
  function renderWishes(){window.renderOltinWishes(wishes);}
  function musicIcon(){var a=$("#oy-audio"),playing=!a.paused;$("#oy-music-off").style.display=playing?"none":"block";$("#oy-music").setAttribute("aria-pressed",String(playing));$("#oy-music").setAttribute("aria-label",copy()[playing?"music_pause":"music_play"]);}
  function play(){var a=$("#oy-audio");if(state&&safe(state.music)&&!state.silentPlayback&&musicChoice!==false)a.play().then(musicIcon).catch(musicIcon);}
  var started=false;
  function render(){
    var d=state.variants[locale],c=copy();if(!d)return;
    if(state.preview)wishes=d.previewWishes||[];
    document.documentElement.lang=locale;document.documentElement.classList.toggle("reduced",state.reducedMotion);
    all("[data-i18n]").forEach(function(el){var v=c[el.dataset.statusKey||el.dataset.i18n];if(v!==undefined)el.textContent=v;});
    all("[data-i18n-ph]").forEach(function(el){el.placeholder=c[el.dataset.i18nPh]||"";el.setAttribute("aria-label",el.placeholder);});
    all(".oy-lang button").forEach(function(b){b.hidden=!state.enabledLocales.includes(b.dataset.lang);b.classList.toggle("on",b.dataset.lang===locale);b.setAttribute("aria-pressed",String(b.dataset.lang===locale));});show(".oy-lang",state.enabledLocales.length>1);
    var pair=d.people.filter(Boolean).join(" & ");["splash","hero","ticket","foot"].forEach(function(k){text("#oy-"+k+"-names",pair);});text("#oy-splash-monogram",d.people.map(function(n){return Array.from(n.trim())[0]||""}).join(" · "));
    ["hero","foot"].forEach(function(k){text("#oy-"+k+"-date",d.date.numeric);show("#oy-"+k+"-date",!!d.date.numeric);});text("#oy-ticket-date",d.date.long);text("#oy-ticket-time",d.date.time);text("#oy-cd-foot-date",[d.date.long,d.date.time].filter(Boolean).join(" · "));text("#oy-ticket-venue",d.venue.name);
    if(d.greeting)text('[data-i18n="ticket_greeting"]',d.greeting);if(d.message)text('[data-i18n="ticket_lead"]',d.message);if(d.eventLabel)text('[data-i18n="hero_sub"]',d.eventLabel);
    text("#oy-venue-name",d.venue.name);text("#oy-venue-addr",d.venue.address);text("#oy-venue-note",d.venue.landmark);show("#oy-venue-note-wrap",!!d.venue.landmark);show("#oy-venue-section",!!(d.venue.name||d.venue.address));var map=safe(d.venue.mapUrl);$("#oy-map").href=map||"#";show("#oy-map",!!map);
    window.renderOltinTimetable(d.program);if(d.programHeading)text('[data-i18n="stop2_title"]',d.programHeading);
    var rows=[["dress",d.dress,"#oy-info-dress"],["arrival",d.arrivalNote,"#oy-div-arrival"],["gifts",d.giftNote,"#oy-div-gifts"],["contact",[d.contactNote||d.hosts,d.phone,d.telegram?"@"+d.telegram.replace(/^@/,""):""].filter(Boolean).join("\n"),"#oy-div-contact"]],visible=0;
    rows.forEach(function(row){var wrap=$(row[2]);wrap.hidden=!row[1];wrap.style.borderTop=visible?"":"none";if(row[1])visible++;text("#oy-info-"+row[0]+"-text",row[1]);});show("#oy-info-section",visible>0);
    if(d.phone){var target=$("#oy-info-contact-text"),a=document.createElement("a");a.href="tel:"+d.phone.replace(/[^+\d]/g,"");a.textContent=d.phone;var content=target.textContent,index=content.indexOf(d.phone);target.replaceChildren(document.createTextNode(content.slice(0,index)),a,document.createTextNode(content.slice(index+d.phone.length)));}
    if(d.footerNote!==null)text("#oy-foot-note",d.footerNote);show("#oy-foot-note-wrap",d.footerNote!=="");
    show("#oy-wishes-section",state.wishesEnabled);show("#oy-wish-form",!sent&&!closed());closePanel();show("#oy-countdown-section",state.epoch!==null);renderWishes();tick();
    if(!started){started=true;window.OltinYolMotion({reduced:function(){return state.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches},onOpen:function(){opened=true;$("#oy-splash").inert=true;play();},onOpened:function(){$("#oy-hero-names").focus({preventScroll:true});}});}
    document.documentElement.classList.remove("awaiting-data");document.documentElement.removeAttribute("data-awaiting-data");document.documentElement.setAttribute("data-ready","");all(".oy-long-name").forEach(function(n){n.classList.remove("oy-long-name")});window.dispatchEvent(new Event("oltin-yol:layout"));all("#oy-hero-names,#oy-ticket-names,#oy-splash-names,#oy-foot-names").forEach(function(n){if(n.scrollWidth>n.clientWidth+1)n.classList.add("oy-long-name")});
  }
  function tick(){if(!state)return;var delta=state.epoch===null?null:Math.max(0,state.epoch-Date.now());[["d",86400000,null],["h",3600000,24],["m",60000,60],["s",1000,60]].forEach(function(p){var n=delta===null?null:Math.floor(delta/p[1]);if(p[2])n=n%p[2];text("#oy-cd-"+p[0],n===null?"–":p[0]==="d"?String(n):String(n).padStart(2,"0"));});if(closed()&&!$("#oy-wish-form").hidden){show("#oy-wish-form",false);closePanel();}}
  function endpoint(){return "/api/public/invitations/"+encodeURIComponent(state.invitationId)+"/wishes";}
  async function loadWishes(){
    var seq=++request;if(state.preview){wishes=state.variants[locale].previewWishes||[];renderWishes();return;}wishes=[];renderWishes();if(!state.wishesEnabled||!state.invitationId)return;
    try{var response=await fetch(endpoint(),{credentials:"same-origin",cache:"no-store"});if(!response.ok)throw Error("load");var data=await response.json();if(seq===request){wishes=Array.isArray(data.wishes)?data.wishes:[];renderWishes();}}catch(_){if(seq===request)status("load_failure");}
  }
  window.addEventListener("message",function(e){
    if(e.source!==window.parent||e.origin!==location.origin||e.data?.type!=="taklifla-oltin-yol:update")return;
    var next=e.data.payload;if(!next||!next.variants||!next.enabledLocales?.includes(next.locale)||!next.variants[next.locale])return;
    var changed=!state||state.invitationId!==next.invitationId||state.preview!==next.preview||state.wishesEnabled!==next.wishesEnabled||state.guestToken!==next.guestToken;
    if(changed){generation++;sent=false;pending=false;var confirm=$("#oy-wish-confirm");delete confirm.dataset.statusKey;confirm.style.display="none";$("#oy-wish-form").reset();}
    state=next;locale=next.locale;render();if(changed||state.preview)loadWishes();
    var audio=$("#oy-audio"),url=safe(state.music);show("#oy-music",!!url&&!state.silentPlayback);$("#oy-music").style.display=url&&!state.silentPlayback?"flex":"none";
    if(audio.getAttribute("src")!==url){audio.pause();if(url)audio.src=url;else audio.removeAttribute("src");musicChoice=null;}
    if(state.silentPlayback)audio.pause();else if(!state.preview||opened)play();musicIcon();
  });
  $(".oy-lang").addEventListener("click",function(e){var b=e.target.closest("button[data-lang]");if(!b||!state?.enabledLocales.includes(b.dataset.lang))return;locale=b.dataset.lang;render();});
  $("#oy-music").addEventListener("click",function(){var audio=$("#oy-audio");musicChoice=audio.paused;if(musicChoice)play();else audio.pause();musicIcon();});
  $("#oy-audio").addEventListener("play",musicIcon);$("#oy-audio").addEventListener("pause",musicIcon);
  $("#oy-wish-form").addEventListener("submit",async function(e){
    e.preventDefault();if(!state||pending||closed())return;if(state.preview){status("preview");return;}
    var form=e.currentTarget;if(!form.reportValidity())return;var name=form.elements.wname.value.trim(),message=form.elements.wmsg.value.trim();if(!name||!message)return;
    pending=true;form.querySelector("button").disabled=true;var identity=generation;
    try{var response=await fetch(endpoint(),{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message,guestToken:state.guestToken||undefined})});if(!response.ok)throw Error("submit");var data=await response.json();if(data.ok!==true)throw Error("submit");if(generation!==identity)return;sent=true;form.reset();show("#oy-wish-form",false);status("wish_thanks");}
    catch(_){if(generation===identity)status("failure");}finally{if(generation===identity){pending=false;form.querySelector("button").disabled=false;}}
  });
  setInterval(tick,1000);
  window.parent.postMessage({type:"taklifla-oltin-yol:ready"},location.origin);
})();
