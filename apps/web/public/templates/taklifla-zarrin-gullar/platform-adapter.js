/* Typed data/API bridge. The source engine owns opening, reveal and petals. */
(function(){
  "use strict";
  var state=null,locale="uz-Latn",wishes=[],request=0,generation=0,pending=false,sent=false,opened=false,musicChoice=null;
  var $=function(s){return document.querySelector(s)}, all=function(s){return Array.from(document.querySelectorAll(s))};
  var text=function(s,v){var el=$(s);if(el)el.textContent=v||"";};
  var show=function(s,on){var el=$(s);if(el)el.hidden=!on;};
  var safe=function(url){return typeof url==="string" && (/^https?:\/\//i.test(url)||/^\/(?!\/)/.test(url))?url:"";};
  function copy(){return window.ZARRIN_COPY[locale]||window.ZARRIN_COPY["uz-Latn"];}
  function status(key){var el=$("#mw-wish-confirm");el.dataset.statusKey=key;el.style.display="block";el.textContent=copy()[key];}
  function closed(){return state.epoch!==null && Date.now()>=state.epoch+86400000;}
  function closePanel(){
    var panel=$(".wish-closed");
    if(!panel){panel=window.marigoldClosePanel("#c67139");$("#mw-wish-form").after(panel);}
    panel.hidden=!closed();panel.setAttribute("role","status");
    var lines={"uz-Latn":["Daftar yopildi","Bayram o‘tdi — rahmat","Yangi tilaklarni qabul qilish to‘xtatildi. Mehmonlar qoldirgan so‘zlar bayram esdaligi sifatida saqlanadi."],"uz-Cyrl":["Дафтар ёпилди","Байрам ўтди — раҳмат","Янги тилакларни қабул қилиш тўхтатилди. Меҳмонлар қолдирган сўзлар байрам эсдалиги сифатида сақланади."],en:["Book closed","Thank you for celebrating","New wishes are no longer accepted. Your kind words remain as memories of the celebration."],ru:["Книга закрыта","Спасибо за праздник","Новые пожелания больше не принимаются. Слова гостей остаются на память о празднике."]}[locale];
    panel.children[1].textContent=lines[0];panel.children[2].textContent=lines[1];panel.children[3].textContent=lines[2];
  }
  function renderWishes(){
    var host=$("#mw-wish-list");host.replaceChildren();show("#mw-wish-empty",!wishes.length);
    wishes.forEach(function(w){
      var card=document.createElement("div");card.style.cssText="background:#fdf6ea;box-shadow:var(--shadow-sm);padding:14px 18px;border-radius:22px;display:flex;flex-direction:column;gap:3px;";
      var name=document.createElement("div");name.style.cssText="font-family:var(--font-heading);font-size:15px;color:var(--color-accent-700);";name.textContent=w.name;
      var message=document.createElement("div");message.style.cssText="font-size:13.5px;line-height:1.55;color:var(--color-neutral-700);white-space:pre-wrap;";message.textContent=w.message||w.text;
      card.append(name,message);host.append(card);
    });
  }
  function musicIcon(){var a=$("#mw-audio"),playing=!a.paused;$("#mw-music-on").style.display=playing?"block":"none";$("#mw-music-off").style.display=playing?"none":"block";$("#mw-music").setAttribute("aria-pressed",String(playing));}
  function play(){var a=$("#mw-audio");if(state&&safe(state.music)&&!state.silentPlayback&&musicChoice!==false)a.play().then(musicIcon).catch(musicIcon);}
  function render(){
    var d=state.variants[locale],c=copy();if(!d)return;
    if(state.preview)wishes=d.previewWishes||[];
    document.documentElement.lang=locale;
    document.documentElement.classList.toggle("reduced",state.reducedMotion);
    all("[data-i18n]").forEach(function(el){var v=c[el.dataset.statusKey||el.dataset.i18n];if(v!==undefined)el.innerHTML=v;});
    all("[data-i18n-ph]").forEach(function(el){el.placeholder=c[el.dataset.i18nPh]||"";});
    $(".mw-lang").setAttribute("aria-label",c.languages);$("#mw-music").setAttribute("aria-label",c.music);
    all(".mw-lang button").forEach(function(b){b.hidden=!state.enabledLocales.includes(b.dataset.lang);b.classList.toggle("on",b.dataset.lang===locale);b.setAttribute("aria-pressed",String(b.dataset.lang===locale));});
    show(".mw-lang",state.enabledLocales.length>1);
    var a=d.people[0]||"",b=d.people[1]||"",pair=[a,b].filter(Boolean).join(" & ");
    text("#mw-splash-names",pair);text("#mw-foot-names",pair);text("#mw-hero-a",a);text("#mw-hero-b",b);show("#mw-hero-b",!!b);
    text("#mw-mono-a",Array.from(a)[0]);text("#mw-mono-b",Array.from(b)[0]);
    $("#mw-mono-a").nextElementSibling.hidden=!b;$("#mw-hero-a").nextElementSibling.hidden=!b;
    text("#mw-inv-bride",b||a);text("#mw-inv-groom",b?a:"");show("#mw-inv-groom",!!b);show("#mw-inv-amp",!!b);
    show("#mw-inv-bride-wrap",!!(d.brideFamily||d.hosts));show("#mw-inv-groom-wrap",!!d.groomFamily);text("#mw-bride-parents",d.brideFamily||d.hosts);text("#mw-groom-parents",d.groomFamily);if(!d.brideFamily)text('[data-i18n="inv_bride_side"]',c.hosts);
    if(d.greeting)text('[data-i18n="inv_blessing"]',d.greeting);
    if(d.message)text('[data-i18n="inv_request"]',d.message);
    if(d.eventLabel)text('[data-i18n="kicker_weddingof"]',d.eventLabel);
    if(d.programHeading)text('[data-i18n="ev_title"]',d.programHeading);
    if(d.footerNote!==null)text("#mw-foot-note",d.footerNote);show("#mw-foot-note",d.footerNote!=="");
    var city=d.venue.city||"";
    text("#mw-splash-meta",[d.date.long,city].filter(Boolean).join(" · "));text("#mw-hero-date",d.date.numeric);text("#mw-hero-dow",d.date.weekday);text("#mw-inv-date",[d.date.long,d.date.time].filter(Boolean).join(" · "));text("#mw-foot-meta",[d.date.numeric,city.toLocaleUpperCase()].filter(Boolean).join(" · "));text("#mw-cd-foot",[d.date.numeric,city.toLocaleUpperCase()].filter(Boolean).join(" — "));
    text("#mw-hero-city",city.toLocaleUpperCase());show("#mw-hero-city",!!city);show("#mw-hero-dot2",!!city);
    text("#mw-venue-name",d.venue.name);text("#mw-venue-addr",d.venue.address);text("#mw-venue-note",d.venue.landmark);show("#mw-venue-note",!!d.venue.landmark);text("#mw-inv-venue",d.venue.name);
    $("#mw-cd-circles").closest("section").hidden=state.epoch===null;
    $("#mw-venue-name").closest("section").hidden=!(d.venue.name||d.venue.address||d.venue.mapUrl);
    show("#mw-hero-dot1",state.epoch!==null);show("#mw-hero-dot2",!!city&&state.epoch!==null);
    var map=safe(d.venue.mapUrl);show("#mw-map",!!map);if(map)$("#mw-map").href=map;
    show("#mw-info-dress",!!d.dress);text("#mw-info-dress-text",d.dress);show("#mw-info-stay",!!d.stayText);text("#mw-info-stay-text",d.stayText);show("#mw-hashtag",!!d.hashtag);text("#mw-hashtag",d.hashtag);
    show("#mw-info-rsvp",!!(d.deadline||d.phone));text("#mw-info-rsvp-text",[c.confirm,d.deadline?(locale.startsWith("uz")?d.deadline+c.until:c.until+" "+d.deadline):"",d.phone].filter(Boolean).join(" — "));
    var host=$("#mw-events"),spine=host.firstElementChild;host.replaceChildren();if(spine)host.append(spine);
    d.program.forEach(function(r,i){
      var row=document.createElement("div");row.dataset.itemId=r.id;row.className="mw-ev-row mw-in";row.setAttribute("data-reveal","");
      var dot=document.createElement("div");dot.className="mw-ev-dot";dot.style.cssText=i%2?"background:var(--color-accent);box-shadow:0 0 0 4px var(--color-accent-100)":"background:var(--color-accent-2-500);box-shadow:0 0 0 4px var(--color-accent-2-100)";
      var card=document.createElement("div");card.className="mw-ev-card";if(i%2)card.style.cssText="box-shadow:var(--shadow-md);border:1px solid var(--color-accent-300)";
      [["h3",r.title,"margin:0;font-size:22px;font-weight:400;color:var(--color-accent-800)"],["div",r.time,"font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-accent-700)"],["p",r.description,"margin:0;font-size:13.5px;line-height:1.6;color:var(--color-neutral-700)"]].forEach(function(spec){if(spec[1]){var e=document.createElement(spec[0]);e.textContent=spec[1];e.style.cssText=spec[2];card.append(e);}});
      row.append(dot,card);host.append(row);
    });show("#mw-events-section",!!d.program.length);
    var form=$("#mw-wish-form");show("#mw-wishes-section",state.wishesEnabled);show("#mw-wish-form",!sent&&!closed());
    closePanel();if(sent&&!closed())status("wish_thanks");else $("#mw-wish-confirm").style.display="none";
    form.querySelector("button").disabled=pending;
    if(state.preview)wishes=d.previewWishes||[];renderWishes();tick();document.body.removeAttribute("data-waiting");
    fitNames();
  }
  function fitNames(){all("#mw-splash-names,#mw-hero-a,#mw-hero-b,#mw-inv-bride,#mw-inv-groom,#mw-foot-names").forEach(function(el){el.style.removeProperty("font-size");var size=parseFloat(getComputedStyle(el).fontSize);while(el.scrollWidth>el.clientWidth+1&&size>22){size--;el.style.fontSize=size+"px";}});}
  function tick(){if(!state)return;var delta=state.epoch===null?null:Math.max(0,state.epoch-Date.now());[["d",86400000,null],["h",3600000,24],["m",60000,60],["s",1000,60]].forEach(function(p){var n=delta===null?null:Math.floor(delta/p[1]);if(p[2])n=n%p[2];text("#cd-"+p[0],n===null?"–":p[0]==="d"?String(n):String(n).padStart(2,"0"));});if(closed()&&!$("#mw-wish-form").hidden){show("#mw-wish-form",false);closePanel();}}
  function endpoint(){return "/api/public/invitations/"+encodeURIComponent(state.invitationId)+"/wishes";}
  async function loadWishes(){
    var seq=++request;if(state.preview){wishes=state.variants[locale].previewWishes||[];renderWishes();return;}wishes=[];renderWishes();if(!state.wishesEnabled||!state.invitationId)return;
    try{var response=await fetch(endpoint(),{credentials:"same-origin",cache:"no-store"});if(!response.ok)throw Error("load");var data=await response.json();if(seq===request){wishes=Array.isArray(data.wishes)?data.wishes:[];renderWishes();}}catch(_){if(seq===request)status("load_failure");}
  }
  window.addEventListener("message",function(e){
    if(e.source!==window.parent||e.origin!==location.origin||e.data?.type!=="taklifla-zarrin-gullar:update")return;
    var next=e.data.payload;if(!next||!next.variants||!next.enabledLocales?.includes(next.locale)||!next.variants[next.locale])return;
    var changed=!state||state.invitationId!==next.invitationId||state.preview!==next.preview||state.wishesEnabled!==next.wishesEnabled||state.guestToken!==next.guestToken;
    if(changed){generation++;sent=false;pending=false;var confirm=$("#mw-wish-confirm");delete confirm.dataset.statusKey;confirm.style.display="none";$("#mw-wish-form").reset();}
    state=next;locale=next.locale;render();if(changed||state.preview)loadWishes();
    var audio=$("#mw-audio"),url=safe(state.music);show("#mw-music",!!url&&!state.silentPlayback);
    if(audio.getAttribute("src")!==url){audio.pause();if(url)audio.src=url;else audio.removeAttribute("src");musicChoice=null;}
    if(state.silentPlayback)audio.pause();else if(!state.preview||opened)play();musicIcon();
  });
  $(".mw-lang").addEventListener("click",function(e){var b=e.target.closest("button[data-lang]");if(!b||!state?.enabledLocales.includes(b.dataset.lang))return;locale=b.dataset.lang;render();});
  $("#mw-open").addEventListener("click",function(){opened=true;$("#mw-splash").setAttribute("aria-hidden","true");$("#mw-splash").inert=true;$("#mw-hero-a").setAttribute("tabindex","-1");$("#mw-hero-a").focus({preventScroll:true});if(state?.reducedMotion)$("#mw-splash").style.display="none";play();});
  $("#mw-music").addEventListener("click",function(){var audio=$("#mw-audio");musicChoice=audio.paused;if(musicChoice)play();else audio.pause();musicIcon();});
  $("#mw-audio").addEventListener("play",musicIcon);$("#mw-audio").addEventListener("pause",musicIcon);
  $("#mw-wish-form").addEventListener("submit",async function(e){
    e.preventDefault();if(!state||pending||closed())return;if(state.preview){status("preview");return;}
    var form=e.currentTarget;if(!form.reportValidity())return;var name=form.elements.wname.value.trim(),message=form.elements.wmsg.value.trim();if(!name||!message)return;
    pending=true;form.querySelector("button").disabled=true;var identity=generation;
    try{var response=await fetch(endpoint(),{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message,guestToken:state.guestToken||undefined})});if(!response.ok)throw Error("submit");var data=await response.json();if(data.ok!==true)throw Error("submit");if(generation!==identity)return;sent=true;form.reset();show("#mw-wish-form",false);status("wish_thanks");}
    catch(_){if(generation===identity)status("failure");}finally{if(generation===identity){pending=false;form.querySelector("button").disabled=false;}}
  });
  window.addEventListener("resize",fitNames);document.fonts.ready.then(fitNames);setInterval(tick,1000);
  window.parent.postMessage({type:"taklifla-zarrin-gullar:ready"},location.origin);
})();
