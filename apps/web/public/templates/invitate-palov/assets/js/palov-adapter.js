(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const labels = {
    "uz-Latn": { greeting:"Aziz mehmon!", kicker:"Taklifnoma", title:"Nahorgi", rsvpIntro:"Iltimos, javobingizni bildiring.", answerLabel:"Javobingiz", hosts:"Mezbonlar", scroll:"Pastga", invite:"oshga taklif etamiz", countdown:"Tadbirgacha", days:"kun", hours:"soat", minutes:"daqiqa", seconds:"soniya", started:"Tadbir boshlandi — sizni kutamiz!", time:"Vaqt", starts:"boshlanadi", place:"Manzil", map:"Xaritada ko‘rish", caption:"Dasturxonimiz sizni kutmoqda", rsvp:"Tasdiqlash", coming:"Kelasizmi?", name:"Ismingiz", yes:"Kelaman", no:"Kela olmayman", submit:"Yuborish", error:"Iltimos, ismingizni yozing va javobni tanlang.", thanks:"Rahmat", welcome:"Sizni intizorlik bilan kutamiz.", noThanks:"Javobingiz uchun rahmat. Sog‘-salomat bo‘ling.", again:"Javobni o‘zgartirish", footer:"Hurmat bilan", musicOn:"Musiqani yoqish", musicOff:"Musiqani o‘chirish" },
    "uz-Cyrl": { greeting:"Азиз меҳмон!", kicker:"Таклифнома", title:"Наҳорги", rsvpIntro:"Илтимос, жавобингизни билдиринг.", answerLabel:"Жавобингиз", hosts:"Мезбонлар", scroll:"Пастга", invite:"ошга таклиф этамиз", countdown:"Тадбиргача", days:"кун", hours:"соат", minutes:"дақиқа", seconds:"сония", started:"Тадбир бошланди — сизни кутамиз!", time:"Вақт", starts:"бошланади", place:"Манзил", map:"Харитада кўриш", caption:"Дастурхонимиз сизни кутмоқда", rsvp:"Тасдиқлаш", coming:"Келасизми?", name:"Исмингиз", yes:"Келаман", no:"Кела олмайман", submit:"Юбориш", error:"Илтимос, исмингизни ёзинг ва жавобни танланг.", thanks:"Раҳмат", welcome:"Сизни интизорлик билан кутамиз.", noThanks:"Жавобингиз учун раҳмат. Соғ-саломат бўлинг.", again:"Жавобни ўзгартириш", footer:"Ҳурмат билан", musicOn:"Мусиқани ёқиш", musicOff:"Мусиқани ўчириш" },
    en: { greeting:"Dear guest!", kicker:"Invitation", title:"Morning osh", rsvpIntro:"Please let us know your response.", answerLabel:"Your response", hosts:"Hosts", scroll:"Scroll", invite:"invite you to osh", countdown:"Time until the event", days:"days", hours:"hours", minutes:"minutes", seconds:"seconds", started:"The gathering has begun — we are waiting for you!", time:"Time", starts:"starts", place:"Address", map:"View map", caption:"Our table is waiting for you", rsvp:"RSVP", coming:"Will you join us?", name:"Your name", yes:"I will attend", no:"I cannot attend", submit:"Send", error:"Please enter your name and choose an answer.", thanks:"Thank you", welcome:"We look forward to seeing you.", noThanks:"Thank you for letting us know.", again:"Change response", footer:"With respect", musicOn:"Turn music on", musicOff:"Turn music off" },
    ru: { greeting:"Дорогой гость!", kicker:"Приглашение", title:"Утренний ош", rsvpIntro:"Пожалуйста, сообщите ваш ответ.", answerLabel:"Ваш ответ", hosts:"Хозяева", scroll:"Вниз", invite:"приглашаем вас на ош", countdown:"До мероприятия", days:"дней", hours:"часов", minutes:"минут", seconds:"секунд", started:"Праздник уже начался — ждём вас!", time:"Время", starts:"начало", place:"Адрес", map:"Открыть карту", caption:"Наш дастархан ждёт вас", rsvp:"Подтверждение", coming:"Вы придёте?", name:"Ваше имя", yes:"Я приду", no:"Не смогу прийти", submit:"Отправить", error:"Укажите имя и выберите ответ.", thanks:"Спасибо", welcome:"Будем рады вас видеть.", noThanks:"Спасибо за ваш ответ.", again:"Изменить ответ", footer:"С уважением", musicOn:"Включить музыку", musicOff:"Выключить музыку" }
  };
  let data = null;
  let countdownTimer = 0;
  let currentLocale = "uz-Latn";
  let musicStarted = false;
  const localeTag = (locale) => ({"uz-Latn":"uz-Latn-UZ", "uz-Cyrl":"uz-Cyrl-UZ", en:"en-US", ru:"ru-RU"})[locale] || "uz-Latn-UZ";
  function set(el, value) { if (el) el.textContent = value || ""; }
  function updateCountdown() {
    if (!data?.dateTime) return;
    const diff = new Date(data.dateTime).getTime() - Date.now();
    const done = diff <= 0;
    const values = done ? [0,0,0,0] : [Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];
    ["days","hours","minutes","seconds"].forEach((key,i) => { const e = $(`[data-unit="${key}"]`); if(e)e.textContent=String(values[i]).padStart(2,"0"); });
    const finished = $("#cd-done"); if(finished){finished.hidden=!done;finished.textContent=labels[currentLocale].started;}
  }
  function fill(payload) {
    if (!payload) return;
    data = payload;
    currentLocale = payload.locale || "uz-Latn";
    document.documentElement.lang = currentLocale === "uz-Latn" ? "uz" : currentLocale;
    const l = labels[currentLocale] || labels["uz-Latn"];
    const date = payload.date || {};
    const dateText = date.day ? new Intl.DateTimeFormat(localeTag(currentLocale), {day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(date.year,date.monthNumber-1,date.day))) : "";
    set($(".arch-text .kicker"), l.kicker);
    set($(".h1-big"), l.title); set($(".h1-sub"), l.invite);
    set($(".hosts-label"), l.hosts); set($(".hosts-name"), payload.hosts);
    set($(".hero-date-day"), dateText); set($(".hero-date-time"), date.time ? `${l.time.toLocaleLowerCase()} ${date.time}` : "");
    set($(".scroll-hint span"), l.scroll);
    set($(".intro-title"), payload.greeting || l.greeting); set($(".intro-text"), payload.message);
    set($(".intro-sign-pre"), l.footer); set($(".intro-sign"), payload.hosts);
    set($(".label#cd-title"), l.countdown);
    document.querySelectorAll(".cd-cap").forEach((el,i)=>el.textContent=[l.days,l.hours,l.minutes,l.seconds][i]||"");
    set($(".ticket-time .label"), l.time); set($(".time-big"), date.time); set($(".time-cap"), l.starts); set($(".time-date"), dateText);
    set($(".ticket-place .label"), l.place); set($(".place-name"), payload.venue?.name);
    set($(".place-addr"), payload.venue?.address);
    const map = $(".map-btn"); if(map){map.href=payload.venue?.mapUrl || (payload.venue?.lat != null ? `https://maps.google.com/?q=${payload.venue.lat},${payload.venue.lng}` : "#"); map.textContent=l.map; map.hidden=!payload.venue?.mapUrl && payload.venue?.lat==null;}
    const photo = $(".frame-img img");
    const creatorPhoto = payload.gallery?.find((item)=>item.src)?.src;
    if(photo){if(creatorPhoto){const item=payload.gallery.find((entry)=>entry.src);photo.src=creatorPhoto;photo.alt=item.alt || item.caption || "";}else{photo.alt=currentLocale==="en"?"Palov served on a traditional Uzbek platter":currentLocale==="ru"?"Плов на традиционном узбекском блюде":currentLocale==="uz-Cyrl"?"Анъанавий ўзбек лаганидаги палов":"An’anaviy o‘zbek laganidagi palov";}}
    set($(".photo-caption"), l.caption);
    set($(".rsvp-head .kicker"), l.rsvp); set($(".rsvp-head h2"), l.coming);set($(".rsvp-head p"),l.rsvpIntro);const answerLabel=$("fieldset legend");if(answerLabel)answerLabel.textContent=l.answerLabel;
    const nameLabel=$("label[for='ism']"); if(nameLabel)nameLabel.textContent=l.name;
    const opts=document.querySelectorAll(".opt-b"); if(opts[0])opts[0].textContent=l.yes;if(opts[1])opts[1].textContent=l.no;
    set($("#send"),l.submit); const error=$(".form-error"); if(error)error.textContent=l.error;
    const yes=$("[data-if='yes'] p");const no=$("[data-if='no'] p");set(yes,l.welcome);set(no,l.noThanks);
    const again=$("#again");if(again)again.textContent=l.again;
    const thank=$(".thanks h3");if(thank){thank.firstChild.textContent=l.thanks+", ";}
    set($(".footer-label"),l.footer);set($(".footer-name"),payload.hosts);set($(".footer-date"),dateText);
    const socials=$(".socials");
    if(socials){const anchors=[...socials.querySelectorAll("a")];anchors.forEach((anchor)=>{const contact=(payload.contacts||[]).find((item)=>item.type==="phone"?anchor.getAttribute("aria-label")?.includes("Qo"):anchor.getAttribute("aria-label")==="Telegram");anchor.hidden=!contact;if(contact){anchor.href=contact.href;anchor.setAttribute("aria-label",contact.label);}});socials.hidden=!(payload.contacts||[]).length;}
    const rsvpSection=$(".rsvp");if(rsvpSection)rsvpSection.hidden=!payload.rsvp?.enabled;
    const notSent=$("[data-if='notSent']");if(notSent)notSent.hidden=!payload.rsvp?.enabled;
    const audio=$("#bgm");const music=$("#music");if(audio&&music){audio.src=typeof payload.music==="string"?payload.music:"";music.hidden=!audio.src;music.setAttribute("aria-label",musicStarted?l.musicOff:l.musicOn);}
    const input=$("#ism");if(input)input.placeholder=l.name;
    updateCountdown(); if(countdownTimer)clearInterval(countdownTimer);countdownTimer=setInterval(updateCountdown,1000);
  }
  function start() { try { if(window.name){fill(JSON.parse(window.name));} } catch {} }
  window.addEventListener("message",(event)=>{if(event.origin===location.origin&&event.data?.type==="invitate-palov:update")fill(event.data.payload);});
  document.addEventListener("click",async(event)=>{
    const button=event.target.closest("button");if(!button)return;
    if(button.id==="send"){
      const name=$("#ism").value.trim(),answer=$("input[name='javob']:checked")?.value;
      const error=$("[data-if='error']");if(!name||!answer){if(error)error.hidden=false;return;}
      if(data?.preview){if(error){error.hidden=false;error.textContent=currentLocale==="ru"?"В предварительном просмотре ответы не отправляются.":currentLocale==="en"?"Responses are disabled in preview.":currentLocale==="uz-Cyrl"?"Кўриб чиқишда жавоб юборилмайди.":"Ko‘rib chiqishda javob yuborilmaydi.";}return;}
      if(!data?.apiBase)return;
      button.disabled=true;
      try{const response=await fetch(`${data.apiBase}/rsvp`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name,status:answer,partySize:answer==="yes"?1:0,guestToken:data.guestToken||undefined})});if(!response.ok)throw new Error("RSVP request failed");
        const groups=document.querySelectorAll("[data-if]");groups.forEach((el)=>{const key=el.getAttribute("data-if");el.hidden=key==="sent"?false:key==="notSent"||key==="error"||key==="yes"||key==="no"?true:el.hidden;});const selected=$(`[data-if='${answer}']`);if(selected)selected.hidden=false;set($("#guest"),name);
      }catch{if(error){error.hidden=false;error.textContent=currentLocale==="ru"?"Не удалось отправить ответ. Попробуйте ещё раз.":currentLocale==="en"?"Could not send your response. Please try again.":currentLocale==="uz-Cyrl"?"Жавоб юборилмади. Қайта уриниб кўринг.":"Javob yuborilmadi. Qayta urinib ko‘ring.";}}
      finally{button.disabled=false;}
    }
    if(button.id==="again"){document.querySelectorAll("[data-if]").forEach(el=>el.hidden=el.getAttribute("data-if")!=="notSent");$("#ism").value="";document.querySelectorAll("input[name='javob']").forEach(el=>el.checked=false);}
    if(button.id==="music"){const audio=$("#bgm");if(!audio)return;if(audio.paused){audio.play().then(()=>{musicStarted=true;button.setAttribute("aria-pressed","true");button.setAttribute("aria-label",labels[currentLocale].musicOff);}).catch(()=>{});}else{audio.pause();musicStarted=false;button.setAttribute("aria-pressed","false");button.setAttribute("aria-label",labels[currentLocale].musicOn);}}
  });
  const reveal=document.querySelectorAll(".rv");
  if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.2});reveal.forEach(node=>observer.observe(node));}else reveal.forEach(node=>node.classList.add("is-visible"));
  start();
})();
