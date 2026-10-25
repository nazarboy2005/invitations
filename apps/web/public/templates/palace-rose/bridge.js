(() => {
  "use strict";
  const id = "palace-rose";
  const root = document.querySelector('[data-chorlove-template="palace-rose"]');
  if (!root) return;
  const giftReceiptHost = document.createElement("div");
  giftReceiptHost.className = "pr-gift-receipt-host w-full";
  giftReceiptHost.dataset.prGiftReceiptHost = "";
  giftReceiptHost.hidden = true;
  document.body.append(giftReceiptHost);
  const sections = [...root.querySelectorAll("section")];
  const q = (selector, parent = root) => parent.querySelector(selector);
  const all = (selector, parent = root) => [...parent.querySelectorAll(selector)];
  const set = (node, value) => { if (node) node.textContent = value == null ? "" : String(value); };
  const hide = (node, value = true) => { if (node) node.hidden = Boolean(value); };
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  const labels = {
    "uz-Latn": { event:"NIKOH TO‘YI", couple:"Kuyov & Kelin", time:"Vaqt", open:"Taklifnomani ochish", greeting:"Assalomu alaykum, aziz mehmon", calendar:"Kalendariga qo‘shish", gallery:"Foto galereya", venue:"To‘y manzili", map:"Xaritada ko‘rish", program:"To‘y dasturi", wishes:"Tilaklar", wishHint:"Ezgu tilaklaringizni qoldiring", attendance:"Kelasizmi?", attend:"Kelaman", decline:"Kela olmayman", send:"Yuborish", gift:"To‘yona", openGift:"Ochish uchun bosing", contacts:"Bog‘lanish uchun", phone:"Telefon raqam", telegram:"Telegram", music:"Musiqa", rsvpHint:"Iltimos, javobingizni bildiring.", guest:"Ismingiz", wishText:"Tilagingiz", preview:"Ko‘rish rejimida yuborib bo‘lmaydi.", error:"Yuborilmadi. Qayta urinib ko‘ring.", sent:"Javobingiz saqlandi.", copied:"Nusxa olindi", days:"Kun", hours:"Soat", minutes:"Daqiqa", seconds:"Soniya" },
    "uz-Cyrl": { event:"НИКОҲ ТЎЙИ", couple:"Куёв & Келин", time:"Вақт", open:"Таклифномани очиш", greeting:"Ассалому алайкум, азиз меҳмон", calendar:"Тақвимга қўшиш", gallery:"Фото галерея", venue:"Тўй манзили", map:"Харитада кўриш", program:"Тўй дастури", wishes:"Тилаклар", wishHint:"Эзгу тилакларингизни қолдиринг", attendance:"Келасизми?", attend:"Келаман", decline:"Кела олмайман", send:"Юбориш", gift:"Тўёна", openGift:"Очиш учун босинг", contacts:"Боғланиш учун", phone:"Телефон рақам", telegram:"Telegram", music:"Мусиқа", rsvpHint:"Илтимос, жавобингизни билдиринг.", guest:"Исмингиз", wishText:"Тилагингиз", preview:"Кўриш режимида юбориб бўлмайди.", error:"Юборилмади. Қайта уриниб кўринг.", sent:"Жавобингиз сақланди.", copied:"Нусха олинди", days:"Кун", hours:"Соат", minutes:"Дақиқа", seconds:"Сония" },
    en: { event:"WEDDING", couple:"Bride & Groom", time:"Time", open:"Open invitation", greeting:"Hello, dear guest", calendar:"Add to calendar", gallery:"Photo gallery", venue:"Wedding venue", map:"View map", program:"Wedding program", wishes:"Guest wishes", wishHint:"Leave your good wishes", attendance:"Will you attend?", attend:"I’ll attend", decline:"Can’t attend", send:"Submit", gift:"To‘yona", openGift:"Open gift details", contacts:"Contact", phone:"Phone", telegram:"Telegram", music:"Music", rsvpHint:"Please let us know if you can attend.", guest:"Your name", wishText:"Your wish", preview:"Submissions are disabled in preview.", error:"Could not submit. Please try again.", sent:"Your response was saved.", copied:"Copied", days:"Days", hours:"Hours", minutes:"Minutes", seconds:"Seconds" },
    ru: { event:"СВАДЬБА", couple:"Жених & Невеста", time:"Время", open:"Открыть приглашение", greeting:"Здравствуйте, дорогой гость", calendar:"Добавить в календарь", gallery:"Фотогалерея", venue:"Место свадьбы", map:"Открыть карту", program:"Программа свадьбы", wishes:"Пожелания гостей", wishHint:"Оставьте добрые пожелания", attendance:"Вы придёте?", attend:"Буду", decline:"Не смогу", send:"Отправить", gift:"Тўёна", openGift:"Показать реквизиты", contacts:"Контакты", phone:"Телефон", telegram:"Telegram", music:"Музыка", rsvpHint:"Пожалуйста, сообщите, сможете ли вы прийти.", guest:"Ваше имя", wishText:"Ваше пожелание", preview:"Отправка в режиме просмотра отключена.", error:"Не удалось отправить. Повторите попытку.", sent:"Ваш ответ сохранён.", copied:"Скопировано", days:"Дней", hours:"Часов", minutes:"Минут", seconds:"Секунд" },
  };
  let payload = null;
  let countdownTimer = 0;
  let galleryPosition = 0;
  let petalsStarted = false;
  let activeMusicUrl = null;
  let revealObserver = null;
  let petalsMounted = false;
  let motionFrame = 0;
  let openingBodyOverflow = "";
  let openingBodyScrollLocked = false;
  const petals = [
    ["78.20%", "#f7e3cd", "11.55px", 21.2, 0.8], ["51.15%", "#ab7a45", "11.04px", 22.5, 1.6],
    ["22.93%", "#d8407a", "11.17px", 19.7, 0.4], ["76.57%", "#d8407a", "23.75px", 23, 2.1],
    ["65.43%", "#e0698f", "23.49px", 23.4, 1.2], ["75.45%", "#ab7a45", "17.54px", 20.8, 2.8],
    ["77.47%", "#e0698f", "17.38px", 20.5, 0.1], ["9.69%", "#ab7a45", "21.35px", 24.6, 1.9],
    ["52.04%", "#ab7a45", "16.96px", 21.1, 0.6], ["47.53%", "#d8407a", "10.50px", 23.8, 2.4],
    ["5.20%", "#d8407a", "13.82px", 26, 1.5], ["86.98%", "#e0698f", "21.55px", 22, 0.3],
  ];
  const data = () => payload?.data || {};
  const text = () => labels[payload?.locale] || labels["uz-Latn"];
  const dateFormatterLocale = () => ({"uz-Latn":"uz-Latn-UZ","uz-Cyrl":"uz-Cyrl-UZ",en:"en-US",ru:"ru-RU"})[payload?.locale] || "uz-UZ";
  const formatDate = (iso, opts) => { if (!iso) return ""; try { return new Intl.DateTimeFormat(dateFormatterLocale(), { timeZone:data().timezone || "Asia/Tashkent", ...opts }).format(new Date(iso)); } catch { return ""; } };

  function bindOpening() {
    const overlay = q('[data-landing-screenshot-id="invite-envelope"]');
    if (!overlay) return;
    if (!petalsStarted && !overlay.hidden && !openingBodyScrollLocked) {
      openingBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      openingBodyScrollLocked = true;
    }
    overlay.classList.add("pr-envelope");
    const greet = q("p", overlay); set(greet, data().greeting || text().greeting);
    const title=all("h1",overlay).find((node)=>node.className.includes("uppercase"));
    if(title){const spans=all(":scope > span",title);const values=[data().groom,"&",data().bride];spans.forEach((node,index)=>set(node,values[index]||""));}
    const dateNode=all("div",overlay).find((node)=>node.className.includes("text-[13px]")&&node.className.includes("italic"));
    if(dateNode)set(dateNode,[data().date?.long,data().date?.time].filter(Boolean).join(" · "));
    const button = q("button:not([aria-label])", overlay);
    if (button) { set(q("span", button) || button, text().open); button.onclick = () => openInvitation(overlay); const sheen=q("div",button);if(sheen)sheen.classList.add("pr-motion-shine"); }
    const openSeal = all("div", overlay).find((node) => node.className.includes("rounded-full") && node.className.includes("cursor-pointer"));
    if (openSeal) { openSeal.onclick = () => openInvitation(overlay); const pulse=q("div",openSeal);if(pulse)pulse.classList.add("pr-motion-seal"); }
    const card=all("div",overlay).find((node)=>node.className.includes("relative")&&node.className.includes("z-10"));
    if(card)card.classList.add("pr-envelope-card");
    installOpeningPetals(overlay);
  }
  function installOpeningPetals(overlay){
    if(petalsMounted)return;
    petalsMounted=true;
    const reduce=Boolean(payload?.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches);
    if(reduce)return;
    const layer=all(":scope > div",overlay).find((node)=>node.className.includes("pointer-events-none")&&node.className.includes("overflow-hidden"));
    if(!layer)return;
    petals.forEach(([left,color,size,duration,delay])=>{
      const petal=document.createElement("span");petal.className="pr-petal";petal.setAttribute("aria-hidden","true");
      petal.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><g><ellipse cx="12" cy="5" rx="2.2" ry="4.5"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(120 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(180 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(240 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(300 12 12)"/></g><circle cx="12" cy="12" r="1.8" fill-opacity=".45"/></svg>';
      Object.assign(petal.style,{left,color,fontSize:size});
      petal.style.setProperty("--pr-petal-duration",`${duration}s`);petal.style.setProperty("--pr-petal-spin-duration",`${1.2*duration}s`);petal.style.setProperty("--pr-petal-delay",`${delay}s`);layer.append(petal);
    });
  }
  function openInvitation(overlay){
    if(petalsStarted)return;petalsStarted=true;
    const reduce=Boolean(payload?.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches);
    const layer=all(":scope > div",overlay).find((node)=>node.className.includes("pointer-events-none")&&node.className.includes("overflow-hidden"));
    if(!reduce&&layer)all(".pr-petal",layer).forEach((petal)=>petal.classList.add("pr-petal-exit"));
    const card=q(".pr-envelope-card",overlay);if(card&&!reduce)card.classList.add("pr-envelope-exit");
    const main=sections[0]?.parentElement; if(main)main.classList.add("pr-opened");
    if(!reduce)overlay.classList.add("pr-envelope-exit");
    setTimeout(()=>{hide(overlay);if(openingBodyScrollLocked){document.body.style.overflow=openingBodyOverflow;openingBodyScrollLocked=false;}if(main)main.scrollIntoView({behavior:reduce?"instant":"smooth",block:"start"});},reduce?0:1050);
  }

  function bindHeroAndDetails() {
    const hero = sections[0], details = sections[1];
    if (hero) {
      const nameSpans = all("span", hero).filter((node) => (node.getAttribute("style") || "").includes("The Nautigal"));
      if (nameSpans.length >= 2) { set(nameSpans[0], data().groom); set(nameSpans.at(-1), data().bride); }
    }
    if (details) {
      const p = all("p", details), h = all("h2", details);
      set(p[0], (data().eventType || text().event).toLocaleUpperCase(dateFormatterLocale())); set(p[1], text().couple);
      set(h[0], data().groom); set(h[1], data().bride);
      const hostLabel=({"uz-Latn":"Hurmat bilan:","uz-Cyrl":"Ҳурмат билан:",en:"With respect:",ru:"С уважением:"})[payload?.locale]||"";
      const eventDate=[data().date?.weekday?.toLocaleUpperCase(dateFormatterLocale()),[data().date?.day,data().date?.month,data().date?.year].filter(Boolean).join(" "),data().date?.time].filter(Boolean).join(" • ");
      set(p[3], data().dateTime ? text().time.toLocaleUpperCase(dateFormatterLocale()) : "");
      set(p[4], data().dateTime ? eventDate : "");
      set(p[5], data().message);
      set(p[6], data().hosts ? hostLabel : ""); set(p[7], data().hosts);
      hide(p[6], !data().hosts); hide(p[7], !data().hosts);
      hide(details, ![data().groom, data().bride, data().message, data().hosts].some(Boolean));
    }
    const footer = q("footer", root);
    if (footer) {
      const footerLead=all("p",footer)[0];set(footerLead,({"uz-Latn":"Abadiy baxtli hayot boshlanishi","uz-Cyrl":"Абадий бахтли ҳаёт бошланиши",en:"The beginning of a happy life together",ru:"Начало счастливой жизни вместе"})[payload?.locale]||"");
      const h = q("h2", footer); if (h) { const names = all("span", h); if (names.length > 0) set(names[0], data().groom); if (names.length > 2) set(names.at(-1), data().bride); }
      const ps = all("p", footer); if (ps.length > 1) set(ps[1], data().date?.long || ""); if (ps.length > 2) set(ps[2], data().hosts);
    }
  }

  function bindCalendar() {
    const section = sections[3]; if (!section) return;
    const p = all("p", section), target = data().dateTime;
    set(q("h2", section), text().calendar); set(p[0], "");
    set(p[1], data().date?.weekday || ""); set(p[2], data().date?.day || "");
    set(p[3], `${data().date?.month || ""} ${data().date?.year || ""}`.trim());
    const clock=all("span",section).find((node)=>node.className.includes("text-[16px]"));if(clock)set(clock,data().date?.time||"");
    const monthHeading=all("div",section).find((node)=>node.className.includes("border-b")&&node.className.includes("text-center")&&node.className.includes("py-1.5"));if(monthHeading)set(monthHeading,`${data().date?.month||""} ${data().date?.year||""}`.trim());
    const weekdayRow=all("div.grid-cols-7",section)[0],dayGrid=all("div.grid-cols-7",section)[1];
    if(weekdayRow){const days=payload?.locale==="en"?["Mo","Tu","We","Th","Fr","Sa","Su"]:payload?.locale==="ru"?["Пн","Вт","Ср","Чт","Пт","Сб","Вс"]:payload?.locale==="uz-Cyrl"?["Ду","Се","Чо","Па","Жу","Ша","Як"]:["Du","Se","Ch","Pa","Ju","Sh","Ya"];all(":scope > div",weekdayRow).forEach((node,i)=>set(node,days[i]||""));}
    if(dayGrid&&data().date?.year&&data().date?.monthNumber){const y=Number(data().date.year),m=Number(data().date.monthNumber),selected=Number(data().date.day),first=(new Date(Date.UTC(y,m-1,1)).getUTCDay()+6)%7,count=new Date(Date.UTC(y,m,0)).getUTCDate(),sample=dayGrid.children[1]||dayGrid.firstElementChild,sampleSpan=sample&&q("span",sample),cells=[];if(sample&&sampleSpan){for(let i=0;i<first;i++)cells.push(sample.cloneNode(false));for(let day=1;day<=count;day++){const cell=sample.cloneNode(false),span=sampleSpan.cloneNode(false);set(span,day);cell.append(span);if(day===selected){span.className="text-white text-sm font-bold";span.style.cssText="background:#640e1b;border-radius:999px;min-width:26px;min-height:26px;display:grid;place-items:center";span.setAttribute("aria-current","date");}cells.push(cell);}while(cells.length<42)cells.push(sample.cloneNode(false));dayGrid.replaceChildren(...cells);}}
    const calendar = q("a", section); if (calendar) { set(calendar, text().calendar); calendar.href = calendarUrl(); calendar.target = "_blank"; calendar.rel = "noopener noreferrer"; hide(calendar, !target); }
    const countdownTitle=p[4];if(countdownTitle)set(countdownTitle,payload?.locale==="en"?"Until the celebration":payload?.locale==="ru"?"До торжества":payload?.locale==="uz-Cyrl"?"Бахтли кунгача":"Baxtli kungacha");
    const countdownBox=countdownTitle?.parentElement;
    const tick = () => {
      if (!target) { hide(section); return; }
      hide(section, false);
      const remain = Math.max(0, Date.parse(target) - Date.now());
      const values = [Math.floor(remain / 864e5), Math.floor(remain / 36e5) % 24, Math.floor(remain / 6e4) % 60, Math.floor(remain / 1e3) % 60];
      const words = [text().days,text().hours,text().minutes,text().seconds];
      const box=countdownBox||section,digits=all("span.tabular-nums",box);digits.slice(0,4).forEach((node,i)=>set(node,String(values[i]).padStart(2,"0")));
      const labels=all("span,p",box).filter((node)=>["Kun","Дней","Days","Hours","Minutes","Seconds","Кун","Соат","Дақиқа","Сония"].includes(node.textContent.trim()));labels.slice(-4).forEach((node,i)=>set(node,words[i]));
    };
    clearInterval(countdownTimer); tick(); countdownTimer = setInterval(tick, 1000);
  }
  function calendarUrl() {
    const date = new Date(data().dateTime); if (!Number.isFinite(date.getTime())) return "#";
    const end = new Date(date.getTime() + 7200000), iso = (value) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent([data().groom,data().bride].filter(Boolean).join(" & "))}&dates=${iso(date)}/${iso(end)}&location=${encodeURIComponent([data().venue?.name,data().venue?.address].filter(Boolean).join(", "))}`;
  }
  function mapEmbedUrl(url){
    if(!url)return "";
    if(url.includes("map-widget"))return url;
    if(url.includes("yandex")&&url.includes("/maps"))return url.replace("/maps","/map-widget/v1");
    return url;
  }

  function bindVenue() {
    const section = sections[4]; if (!section) return;
    const name = data().venue?.name || "", address = data().venue?.address || "";
    const photoFrame = all("div",section).find((node) =>
      node.classList.contains("overflow-hidden") &&
      node.classList.contains("rounded-[15px]") &&
      [...node.classList].some((name) => name.startsWith("max-h-[")),
    );
    if (photoFrame) {
      const photoUrl = typeof data().venueImage === "string" ? data().venueImage.trim() : "";
      if (photoUrl) {
        let photo = q("img",photoFrame);
        if (!photo) { photo=document.createElement("img");photo.className="h-full w-full object-cover transition-transform duration-700 hover:scale-105";photo.loading="lazy";photo.decoding="async";photoFrame.replaceChildren(photo); }
        if (photo.src !== photoUrl) photo.src=photoUrl;
        photo.alt=`${name} — wedding venue`;
        hide(photoFrame,false);
      } else {
        photoFrame.replaceChildren();
        hide(photoFrame,true);
      }
    }
    const heading = q("h3", section); set(heading, name);
    set(all("p",section)[0],text().venue);
    const localeVenue=payload?.locale==="en"?"Venue":payload?.locale==="ru"?"Место свадьбы":payload?.locale==="uz-Cyrl"?"Тўйхона":"To‘yxona";
    const label=q("h2",section);if(label)set(label,localeVenue);
    set(q(".whitespace-pre-line span",section),address);
    const ps = all("p", section); ps.forEach((node) => { if (/Navro|Chirchiq|Toshkent/i.test(node.textContent)) set(node, ""); });
    const anchors = all("a", section), map = anchors.find((a) => a.getAttribute("href")?.includes("maps") || a.querySelector("svg.lucide-navigation"));
    const loc = [data().venue?.lat,data().venue?.lng].every((n) => n != null) ? `${data().venue.lat},${data().venue.lng}` : address;
    if (map) { set(q("span",map)||map, text().map); map.href = data().venue?.mapUrl || (loc ? `https://maps.google.com/?q=${encodeURIComponent(loc)}` : "#"); map.target="_blank"; map.rel="noopener noreferrer"; hide(map, !loc && !data().venue?.mapUrl); }
    const mapFrame=q("iframe",section);if(mapFrame){const embed=mapEmbedUrl(data().venue?.mapUrl)||(loc?`https://maps.google.com/maps?q=${encodeURIComponent(loc)}&output=embed`:"");if(embed)mapFrame.src=embed;else mapFrame.removeAttribute("src");hide(mapFrame.parentElement,!embed);}
    hide(section, !name && !address);
  }

  function bindProgram() {
    const section = sections[5]; if (!section) return;
    set(q("h2", section), data().programHeading || text().program);
    const list=q("ol",section), items = data().program || [];
    if(!list)return;
    const originalRows=all(":scope > li",list), template=originalRows[0];
    if(items.length&&template){
      const rows=Array.from({length:items.length},(_,i)=>originalRows[i]||template.cloneNode(true));
      list.replaceChildren(...rows);
      rows.forEach((row,i)=>{const item=items[i],cells=all(":scope > span",row),time=cells[0],title=cells[2];set(q(".relative.inline-block",time)||time,item?.time||"");set(q("span[dir=auto]",title)||title,item?.title||"");});
    }else list.replaceChildren();
    hide(section, !items.length);
  }

  function bindGallery() {
    const section = sections[2]; if (!section) return;
    set(q("h2", section), text().gallery);
    const grid = q(".flex.touch-pan-y", section) || q(".grid", section) || section;
    const images = all("img", grid), source = (data().gallery || []).filter((item) => item.src || item.url);
    const items = source;
    const cards = images.map((img) => img.closest(".embla__slide__card")?.parentElement || img.parentElement);
    const next = all("button", section).find((b) => /next/i.test(b.getAttribute("aria-label") || ""));
    const prev = all("button", section).find((b) => /previous/i.test(b.getAttribute("aria-label") || ""));
    const paint = () => {
      cards.forEach((card, i) => {
        const item = items.length && i < Math.min(items.length,6) ? items[(galleryPosition + i) % items.length] : null;
        if (!card) return;
        hide(card, !item); const img = q("img", card); if (!img) return;
        if (item?.src || item?.url) { img.src = item.src || item.url; img.alt = item.alt || item.caption || `${text().gallery} ${i+1}`; card.onclick = () => showImage(items, (galleryPosition+i)%items.length); }
        else { img.removeAttribute("src"); img.alt = ""; const slide=q(".embla__slide__card",card);if(slide){let empty=q(".pr-empty",slide);if(!empty){empty=document.createElement("div");empty.className="pr-empty absolute inset-0";set(empty,text().gallery);slide.append(empty);}hide(empty,false);}card.onclick = null; }
      });
      const counter = all("div", section).find((n) => /^\d+\s*\/\s*\d+$/.test(n.textContent.trim()) && !n.querySelector("div"));
      if (counter) set(counter, `${items.length ? galleryPosition+1 : 0} / ${items.length}`);
    };
    if (next) { next.disabled = false; next.onclick = () => { if(items.length){galleryPosition=(galleryPosition+1)%items.length;paint();} }; }
    if (prev) { prev.disabled = false; prev.onclick = () => { if(items.length){galleryPosition=(galleryPosition+items.length-1)%items.length;paint();} }; }
    paint(); hide(section, !items.length);
  }
  function showImage(items,index) {
    const dialog=document.createElement("div"); dialog.className="pr-lightbox"; dialog.setAttribute("role","dialog"); dialog.setAttribute("aria-modal","true"); dialog.setAttribute("aria-label",text().gallery);
    const close=document.createElement("button"),prev=document.createElement("button"),img=document.createElement("img"),next=document.createElement("button");
    close.textContent="×";close.setAttribute("aria-label",({"uz-Latn":"Yopish","uz-Cyrl":"Ёпиш",en:"Close",ru:"Закрыть"})[payload?.locale]||"Close");prev.textContent="‹";prev.setAttribute("aria-label",({"uz-Latn":"Oldingi rasm","uz-Cyrl":"Олдинги расм",en:"Previous image",ru:"Предыдущее фото"})[payload?.locale]||"Previous image");next.textContent="›";next.setAttribute("aria-label",({"uz-Latn":"Keyingi rasm","uz-Cyrl":"Кейинги расм",en:"Next image",ru:"Следующее фото"})[payload?.locale]||"Next image");
    let pos=index;const paint=()=>{const item=items[pos];img.src=item.src||item.url;img.alt=item.alt||item.caption||text().gallery;};
    const done=()=>dialog.remove();prev.onclick=()=>{pos=(pos+items.length-1)%items.length;paint();};next.onclick=()=>{pos=(pos+1)%items.length;paint();};close.onclick=done;dialog.onclick=(e)=>{if(e.target===dialog)done();};dialog.onkeydown=(e)=>{if(e.key==="Escape")done();if(e.key==="ArrowLeft")prev.click();if(e.key==="ArrowRight")next.click();};dialog.append(close,prev,img,next);root.append(dialog);paint();close.focus();
  }

  async function bindWishes() {
    const section=sections[6]; if(!section)return; set(q("h2",section),text().wishes); const ps=all("p",section); if(ps[0])set(ps[0],text().wishHint);
    const form=q("form",section); if(!form)return; const input=q("input",form),area=q("textarea",form),button=q("button[type=submit]",form);
    if(input)input.placeholder=text().guest;if(area)area.placeholder=text().wishText; if(button)set(button,text().send);
    let status=q(".pr-status",form);if(!status){status=document.createElement("p");status.className="pr-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");form.append(status);}
    const cards=all("p.leading-relaxed",section).map((node)=>node.parentElement);
    let wishes=[];
    if(payload?.preview) wishes=data().wishes||[];
    else if(data().wishesEnabled) wishes=await fetch(`/api/public/invitations/${encodeURIComponent(payload.invitationId||"")}/wishes`,{cache:"no-store"}).then((response)=>response.ok?response.json():{}).then((result)=>result.wishes||[]).catch(()=>[]);
    cards.forEach((card,i)=>{const w=wishes[i],ps=all("p",card),spans=all("span",card);set(ps.at(-1),w?.text||"");set(spans[0],w?.name||"");hide(spans[1]);hide(card,!w);});
    hide(section,!payload?.preview&&!data().wishesEnabled);
    form.onsubmit=async(e)=>{e.preventDefault();status.textContent="";if(payload?.preview){set(status,text().preview);return;}const name=input?.value.trim(),message=area?.value.trim();if(!name||!message){set(status,!name?text().guest:text().wishText);return;}button.disabled=true;try{const res=await fetch(`/api/public/invitations/${encodeURIComponent(payload.invitationId||"")}/wishes`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message,guestToken:payload.guestToken||undefined})});if(!res.ok)throw Error();set(status,text().sent);form.reset();}catch{set(status,text().error);}finally{button.disabled=false;}};
  }

  function bindRsvp() {
    const section=sections[7];if(!section)return;set(q("h2",section),text().attendance);const ps=all("p",section);if(ps[0])set(ps[0],text().rsvpHint);
    const form=q("form",section);if(!form)return;const input=q("input",form),buttons=all("button",form),submit=buttons.at(-1);let answer="";
    if(input){input.placeholder=text().guest;input.value=payload?.guestName||"";}
    const choices=buttons.slice(0,2);choices.forEach((button,i)=>{set(button,i?text().decline:text().attend);button.type="button";button.onclick=()=>{answer=i?"no":"yes";choices.forEach((b,j)=>b.setAttribute("aria-pressed",String((j===1)===(answer==="no"))));};});if(submit)set(submit,text().send);
    let status=q(".pr-status",form);if(!status){status=document.createElement("p");status.className="pr-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");form.append(status);}
    hide(section,!data().rsvp?.enabled&&!payload?.preview);
    form.onsubmit=async(e)=>{e.preventDefault();if(payload?.preview){set(status,text().preview);return;}if(!input?.value.trim()||!answer){set(status,!input?.value.trim()?text().guest:text().rsvpHint);return;}submit.disabled=true;try{const yes=answer==="yes",res=await fetch(`/api/public/invitations/${encodeURIComponent(payload.invitationId||"")}/rsvp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:input.value.trim(),status:yes?"yes":"no",partySize:yes?1:0,guestToken:payload.guestToken||undefined})});if(!res.ok)throw Error();set(status,text().sent);}catch{set(status,text().error);}finally{submit.disabled=false;}};
  }

  function bindGiftAndContacts() {
    const gift=sections[8];
    if(gift){
      set(q("h2",gift),text().gift);
      const button=q("button",gift);
      if(button){
        set(q("p",button)||button,text().openGift);
        const giftArt=["hoa_kho_orange.webp","royal_red.webp","dragon_phoenix.webp","dragon_phoenix_v2.webp","mahal_gold.webp","glass_garden_pink.webp","chateau_green.webp","double_dragon_green.webp"];
        all("img",button).forEach((img,index)=>{
          const filename=giftArt[index];
          if(filename){img.src=`/templates/${id}/assets/${filename}`;img.loading="lazy";img.decoding="async";}
        });
        button.onclick=()=>{
          if(q("[data-pr-gift-dialog]"))return;
          const language=payload?.locale||"uz-Latn";
          const words={
            "uz-Latn":{title:"To‘yona",bank:"Bank kartasi",copy:"Karta raqamini nusxalash",fallback:"Tashrifingiz biz uchun eng katta sovg‘a."},
            "uz-Cyrl":{title:"Тўёна",bank:"Банк картаси",copy:"Карта рақамини нусхалаш",fallback:"Ташрифингиз биз учун энг катта совға."},
            en:{title:"Gift Box",bank:"Bank Card",copy:"Copy Card Number",fallback:"Your presence is the greatest gift for us."},
            ru:{title:"Подарок",bank:"Банковская карта",copy:"Скопировать номер карты",fallback:"Ваше присутствие — самый ценный подарок для нас."},
          }[language]||{title:"Gift Box",bank:"Bank Card",copy:"Copy Card Number",fallback:"Your presence is the greatest gift for us."};
          const toyona=data().toyona||{};
          const overlay=document.createElement("div");
          overlay.dataset.prGiftDialog="";
          overlay.className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none";
          overlay.setAttribute("role","presentation");
          overlay.style.opacity="0";
          const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          const duration=reduceMotion?0:250;
          overlay.style.transition=`opacity ${duration}ms ease`;
          const panel=document.createElement("div");
          panel.dataset.prGiftDialogPanel="";
          panel.className="relative w-full max-w-md rounded-2xl p-0 shadow-2xl overflow-hidden text-[#640e1b] border border-[#ab7a45]/40";
          panel.style.backgroundColor="rgb(247, 227, 205)";
          panel.style.opacity="0";
          panel.style.transform="translateY(20px) scale(.92)";
          panel.style.transition=`opacity ${duration}ms ease, transform ${duration}ms ease`;
          panel.setAttribute("role","dialog");
          panel.setAttribute("aria-modal","true");
          panel.setAttribute("aria-labelledby","pr-gift-dialog-title");
          const header=document.createElement("div");
          header.className="relative px-6 pt-6 pb-4 text-center";
          header.style.backgroundColor="rgb(100, 14, 27)";
          const close=document.createElement("button");
          close.type="button";
          close.className="absolute right-3 top-3 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors z-10";
          close.setAttribute("aria-label",language==="ru"?"Закрыть":language==="en"?"Close":language==="uz-Cyrl"?"Ёпиш":"Yopish");
          close.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"></path></svg>';
          const title=document.createElement("h2");
          title.id="pr-gift-dialog-title";
          title.className="uppercase text-[20px] md:text-[24px] font-bold tracking-[0.04em] text-white";
          title.style.fontFamily='"Times New Roman", Times, "Baskerville", serif';
          title.style.textShadow="rgba(0, 0, 0, 0.2) 1px 1px 2px";
          title.textContent=words.title;
          header.append(close,title);
          const content=document.createElement("div");
          content.className="p-6 flex flex-col items-center gap-4 text-center";
          if(toyona.cardNumber?.trim()){
            const card=document.createElement("div");
            card.className="w-full rounded-xl bg-white/80 p-5 shadow-sm flex flex-col items-center gap-2";
            card.style.border="1.5px solid rgba(100, 14, 27, 0.15)";
            const cardLabel=document.createElement("div");
            cardLabel.className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[rgb(100,14,27)]";
            cardLabel.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path></svg>';
            const bankLabel=document.createElement("span");bankLabel.textContent=words.bank;cardLabel.append(bankLabel);
            const number=document.createElement("div");
            number.className="font-mono text-lg md:text-xl font-bold tracking-widest text-[rgb(100,14,27)] my-1";
            number.textContent=toyona.cardNumber;
            card.append(cardLabel,number);
            if(toyona.cardHolder){const holder=document.createElement("div");holder.className="text-xs font-medium opacity-80 text-[rgb(100,14,27)] uppercase tracking-wide";holder.style.fontFamily='Baskerville, "Libre Baskerville", "Times New Roman", serif';holder.textContent=toyona.cardHolder;card.append(holder);}
            const copy=document.createElement("button");
            copy.type="button";
            copy.className="mt-3 inline-flex items-center gap-2 rounded-full px-6 py-2 text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-sm";
            copy.style.backgroundColor="rgb(100, 14, 27)";
            copy.style.fontFamily='"Times New Roman", Times, "Baskerville", serif';
            copy.textContent=words.copy;
            copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(toyona.cardNumber);copy.textContent=text().copied;}catch{copy.focus();}});
            card.append(copy);
            content.append(card);
          }else{
            const note=document.createElement("div");
            note.className="w-full rounded-xl bg-white/80 p-5 shadow-sm text-sm leading-relaxed text-[rgb(100,14,27)]";
            note.style.border="1.5px solid rgba(100, 14, 27, 0.15)";
            note.style.fontFamily='Baskerville, "Libre Baskerville", "Times New Roman", serif';
            note.textContent=toyona.note?.trim()||words.fallback;
            content.append(note);
          }
          giftReceiptHost.hidden=false;
          content.append(giftReceiptHost);
          panel.append(header,content);
          overlay.append(panel);
          const closeDialog=()=>{
            if(!overlay.isConnected)return;
            giftReceiptHost.hidden=true;
            document.body.append(giftReceiptHost);
            document.removeEventListener("keydown",onKeyDown);
            overlay.style.opacity="0";panel.style.opacity="0";panel.style.transform="translateY(20px) scale(.92)";
            window.setTimeout(()=>{overlay.remove();button.focus();},duration);
          };
          const onKeyDown=(event)=>{if(event.key==="Escape")closeDialog();};
          close.addEventListener("click",closeDialog);
          overlay.addEventListener("click",(event)=>{if(event.target===overlay)closeDialog();});
          panel.addEventListener("click",(event)=>event.stopPropagation());
          document.addEventListener("keydown",onKeyDown);
          document.body.append(overlay);
          close.focus();
          requestAnimationFrame(()=>{overlay.style.opacity="1";panel.style.opacity="1";panel.style.transform="translateY(0) scale(1)";});
        };
      }
      hide(gift,!data().toyona?.enabled);
    }
    const contact=sections[9];if(!contact)return;set(q("h2",contact),text().contacts);const intro=all("p",contact)[0];if(intro)set(intro,({"uz-Latn":"Savol yoki tabrik bo‘lsa, biz bilan bog‘laning.","uz-Cyrl":"Савол ёки табрик бўлса, биз билан боғланинг.",en:"Contact us with any questions or warm wishes.",ru:"Свяжитесь с нами по любым вопросам или с добрыми пожеланиями."})[payload?.locale]||"");const anchors=all("a",contact),values=data().contacts||[];
    anchors.forEach((anchor,i)=>{const entry=values[i];if(!entry){hide(anchor);return;}hide(anchor,false);anchor.href=entry.href||"#";anchor.target="_blank";anchor.rel="noopener noreferrer";const ps=all("p",anchor);if(ps[0])set(ps[0],entry.label|| (entry.type==="phone"?text().phone:text().telegram));if(ps[1])set(ps[1],entry.value);if(ps[2])set(ps[2],"");});hide(contact,!values.length);
  }

  function installControls() {
    let nav=q(".pr-languages");if(!nav){nav=document.createElement("nav");nav.className="pr-languages";nav.setAttribute("aria-label","Language");root.append(nav);}
    nav.replaceChildren(...(payload.enabledLocales||locales).map((locale)=>{const button=document.createElement("button");button.type="button";button.textContent=({"uz-Latn":"Uz","uz-Cyrl":"Уз",en:"En",ru:"Ru"})[locale];button.setAttribute("aria-current",String(locale===payload.locale));button.onclick=()=>parent.postMessage({type:`${id}:language`,locale},location.origin);return button;}));
    let audio=q("audio");if(!audio){audio=document.createElement("audio");root.append(audio);}audio.preload="none";const url=payload.data?.music?.url||"";if(url!==activeMusicUrl){audio.pause();audio.removeAttribute("src");activeMusicUrl=url;if(url)audio.src=url;audio.muted=Boolean(payload.preview&&payload.silentPlayback);}
    let music=q('button[aria-label="Toggle music"]')||q(".pr-music");if(!music){music=document.createElement("button");music.className="pr-music";music.type="button";music.textContent="♫";root.append(music);}music.classList.add("pr-music");music.setAttribute("aria-label",text().music);hide(music,!url||Boolean(payload.preview&&payload.silentPlayback));music.onclick=()=>{if(audio.paused)audio.play().then(()=>set(music,"♫")).catch(()=>{});else{audio.pause();set(music,"×");}};
  }

  function render(next) {
    payload=next;root.hidden=false;root.lang=({"uz-Latn":"uz","uz-Cyrl":"uz",en:"en",ru:"ru"})[payload.locale]||"uz";
    if(payload.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches)root.classList.add("pr-reduced");else root.classList.remove("pr-reduced");
    bindOpening();bindHeroAndDetails();bindCalendar();bindVenue();bindProgram();bindGallery();bindWishes();bindRsvp();bindGiftAndContacts();installControls();installSourceMotion();installRevealMotion();
  }
  function installSourceMotion(){
    const hero=sections[0],details=sections[1],countdown=sections[3],program=sections[5],footerCastle=all('img[src$="castle.webp"]').at(-1),footerMotionWrap=footerCastle?.parentElement;
    const scrollHost=root.scrollHeight>root.clientHeight+1?root:null;
    const viewportHeight=()=>scrollHost?.clientHeight||window.innerHeight;
    const byAsset=(section,file)=>section?all(`[style*="${file}"]`,section):[];
    const bells=byAsset(hero,"bells.webp")[0],heroFlower=byAsset(hero,"flower1.webp")[0],arch=byAsset(hero,"arch-frame.webp")[0],heroSandstone=byAsset(hero,"sandstone.webp")[0],heroCastle=byAsset(hero,"castle.webp")[0],heroFence=byAsset(hero,"fence.webp")[0],heroFlowers=byAsset(hero,"flower2.webp");
    bells?.classList.add("pr-motion-bells");heroFlower?.classList.add("pr-motion-hero-flower");
    const title=hero?.querySelector('[class*="top-[43.9%]"]');title?.classList.add("pr-motion-hero-title");
    heroFlowers[0]?.classList.add("pr-motion-hero-flower-left");heroFlowers[1]?.classList.add("pr-motion-hero-flower-right");
    const envelope= q('[data-landing-screenshot-id="invite-envelope"]');
    const envelopeFlowers=all('img[src$="flower1.webp"]',envelope).map((img)=>img.parentElement);
    envelopeFlowers[0]?.classList.add("pr-motion-envelope-flower-a");envelopeFlowers[1]?.classList.add("pr-motion-envelope-flower-b");
    const detailFlower=byAsset(details,"flower3-decoration.webp")[0];detailFlower?.classList.add("pr-motion-details-flower");
    const countdownFlower=byAsset(countdown,"flower3-decoration.webp")[0];countdownFlower?.classList.add("pr-motion-countdown-flower");
    const programFlower=byAsset(program,"flower3-decoration.webp")[0];programFlower?.classList.add("pr-motion-program-flower");
    if(!root.dataset.prScrollMotion){
      root.dataset.prScrollMotion="installed";
      const clamp=(value)=>Math.min(1,Math.max(0,value));
      const lerp=(a,b,t)=>a+(b-a)*t;
      const progress=(section)=>{if(!section)return 0;const rect=section.getBoundingClientRect(),height=viewportHeight();return clamp((height-rect.top)/(height+rect.height));};
      const setY=(node,value)=>{if(node)node.style.transform=`translateY(${value}px)`;};
      const update=()=>{
        if(motionFrame)return;
        motionFrame=requestAnimationFrame(()=>{
          motionFrame=0;if(root.classList.contains("pr-reduced"))return;
          const heroRect=hero?.getBoundingClientRect(),heroProgress=heroRect?clamp(-heroRect.top/Math.max(.9*heroRect.height,1)):0;
          if(arch)arch.style.scale=String(lerp(1,.76,heroProgress));
          if(heroSandstone)heroSandstone.style.scale=String(lerp(1,1.38,heroProgress));
          if(heroCastle)heroCastle.style.scale=String(lerp(1,1.28,heroProgress));
          if(heroFence)heroFence.style.scale=String(lerp(1,1.38,heroProgress));
          const detailProgress=progress(details),detailY=lerp(-85,105,detailProgress);
          setY(byAsset(details,"sandstone-flower.webp")[0],detailY);
          const detailFlowerWrap=byAsset(details,"flower3-decoration.webp")[0]?.parentElement;setY(detailFlowerWrap,lerp(105,-85,detailProgress));
          const countdownProgress=progress(countdown);
          setY(byAsset(countdown,"sandstone-flower.webp")[0],lerp(-85,105,countdownProgress));
          setY(byAsset(countdown,"flower3-decoration.webp")[0]?.parentElement,lerp(105,-85,countdownProgress));
          const programProgress=progress(program);
          setY(byAsset(program,"castle2.webp")[0],lerp(-20,40,programProgress));
          setY(byAsset(program,"flower3-decoration.webp")[0],lerp(-40,50,programProgress));
          if(footerCastle&&footerMotionWrap){const rect=footerMotionWrap.getBoundingClientRect(),den=Math.max(1,Math.min(.5*rect.height,300)),atBottom=scrollHost?scrollHost.scrollTop+scrollHost.clientHeight>=scrollHost.scrollHeight-30:window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-30,p=atBottom?1:clamp((viewportHeight()-rect.top)/den),scale=p<.7?lerp(1.5,1,p/.7):1,y=p<.7?lerp(45,0,p/.7):0;footerCastle.style.transform=`translateY(${y}px) scale(${scale})`;}
        });
      };
      (scrollHost||window).addEventListener("scroll",update,{passive:true});addEventListener("resize",update,{passive:true});update();
    }
  }
  function installRevealMotion(){
    revealObserver?.disconnect();
    const revealSelector='[style*="opacity: 0;"], [style*="opacity:0;"], [style$="opacity: 0"], [style$="opacity:0"], [style*="scale(0);"], [style$="scale(0)"]';
    const nodes=all(revealSelector);
    const reduce=Boolean(payload?.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches);
    if(reduce){nodes.forEach((node)=>{node.classList.add("pr-visible");node.style.opacity="1";node.style.transform="none";});return;}
    const thresholds=[.2,.25,.3,.5];
    const scrollHost=root.scrollHeight>root.clientHeight+1?root:null;
    revealObserver=new IntersectionObserver((entries)=>entries.forEach((entry)=>{
      const node=entry.target,min=Number(node.dataset.prRevealThreshold||.25),once=node.dataset.prRevealOnce==="true";
      if(entry.isIntersecting&&entry.intersectionRatio>=min){node.classList.add("pr-visible");if(once)revealObserver?.unobserve(node);}
      else if(!once)node.classList.remove("pr-visible");
    }),{root:scrollHost,threshold:thresholds});
    nodes.forEach((node)=>{
      node.classList.add("pr-reveal");
      const inlineStyle=node.getAttribute("style")||"",scaleOnly=/scale\(0\)/.test(inlineStyle)&&!/opacity:\s*0/.test(inlineStyle);
      if(scaleOnly)node.classList.add("pr-scale-reveal");
      const sectionIndex=sections.indexOf(node.closest("section"));
      const sectionNodes=sectionIndex>=0?all(revealSelector,sections[sectionIndex]):[];
      const nodeIndex=sectionNodes.indexOf(node);
      let threshold=.25,duration=.6,delay=0;
      if(sectionIndex===2){threshold=.2;duration=.5;}
      if(sectionIndex===1){
        const revealTiming=[[.6,0],[.6,.1],[.7,.18],[.5,.26],[.7,.32],[.6,.42],[.5,.5],[.7,.58],[.5,.66],[.6,.74]][nodeIndex];
        if(revealTiming)[duration,delay]=revealTiming;
      }
      if(sectionIndex===3){
        const timings=[[.6,0],[.6,.1],[.7,.18],[.7,.28],[.6,.36],[.7,.44]];
        if(nodeIndex<timings.length)[duration,delay]=timings[nodeIndex];
        else{threshold=.3;duration=.5;delay=.1*(nodeIndex-timings.length);}
      }
      if(sectionIndex===4){
        threshold=.2;
        const timings=[[.6,0],[.6,.08],[.6,.14],[.7,.2],[.7,.26],[.6,.32]];
        if(timings[nodeIndex])[duration,delay]=timings[nodeIndex];
      }
      if(sectionIndex===5){
        const row=node.closest("li.contents"),rowIndex=row?all(":scope > li",sections[5].querySelector("ol")).indexOf(row):-1;
        if(rowIndex>=0){threshold=.5;duration=scaleOnly?.4:.5;delay=.07*rowIndex;}
      }
      if(sectionIndex===6||sectionIndex===7){threshold=.2;duration=.6;}
      if(sectionIndex===6&&node.classList.contains("rounded-md")){
        const cards=all(".rounded-md",sections[6]);duration=.4;delay=.04*Math.max(0,cards.indexOf(node));
      }
      if(sectionIndex===8){duration=node.matches("h2")?.6:.7;delay=node.matches("h2")?0:.12;}
      if(sectionIndex===9){
        const contactCard=node.matches("section > div");
        threshold=contactCard ? .5 : .2;duration=contactCard ? .8 : .6;
        if(contactCard)node.dataset.prRevealOnce="true";
        if(node.matches("h2"))delay=0;else if(node.matches("p"))delay=.1;
        if(node.closest("a")){duration=.4;delay=.08*all("a",sections[9]).indexOf(node.closest("a"));}
      }
      const footer=node.closest("footer");
      if(footer){
        threshold=.2;
        if(node.matches("footer > h2")){duration=.7;delay=.1;}
        else if(node.matches("footer > p")){
          duration=.6;
          const paragraphIndex=all(":scope > p",footer).indexOf(node);
          delay=paragraphIndex===0 ? 0 : paragraphIndex===1 ? .25 : .3;
        }else if(node.matches("footer > div")){
          const separator=node.querySelector('[style*="scaleX(0)"]');
          duration=separator ? .8 : .6;delay=separator ? .2 : .35;
        }
      }
      node.style.setProperty("--pr-reveal-duration",`${duration}s`);node.style.setProperty("--pr-reveal-delay",`${delay}s`);
      node.dataset.prRevealThreshold=String(threshold);
      if(!node.classList.contains("pr-visible"))revealObserver?.observe(node);
    });
  }
  addEventListener("message",(event)=>{if(event.source===parent&&event.origin===location.origin&&event.data?.type===`${id}:update`)render(event.data.payload);});
  try{const initial=JSON.parse(window.name);if(initial?.type===`${id}:update`)render(initial.payload);}catch{}
})();
