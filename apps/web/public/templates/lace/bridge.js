(() => {
  "use strict";
  const id = "lace";
  const root = document.querySelector('[data-chorlove-template="lace"]');
  if (!root) return;
  const sections = [...root.querySelectorAll("section")];
  const sourceProgramRows = [...(sections[4]?.querySelector(".space-y-10")?.children || [])].map((node) => node.cloneNode(true));
  const sourceGalleryCards = [...(sections[6]?.querySelectorAll(".grid > button") || [])].map((node) => node.cloneNode(true));
  const sourceWishRow = sections[7]?.querySelector("ul li")?.cloneNode(true);
  const text = {
    "uz-Latn": { invite:"Sizni hayotimizdagi eng baxtli kun — to'yimizga taklif qilamiz", withFamilies:"Oilalari hamrohligida", countdown:"Qolgan vaqt", days:"Kun", hours:"Soat", minutes:"Daqiqa", seconds:"Soniya", venue:"Manzil", map:"Xaritada ko'rish", calendar:"Kalendariga qo'shish", program:"To'y dasturi", schedule:"Ilk salomdan so'nggi raqsgacha — bayram kuni.", dress:"Dress-kod", gallery:"Galereya", wishes:"Tilaklar", wishHint:"To'y egalariga o'z ezgu tilaklaringizni qoldiring", guest:"Ismingiz", wish:"Kelin-kuyovga tilagingiz...", wishSend:"Tilak yuborish", rsvp:"Kelasizmi?", rsvpHint:"Iltimos, javobingizni bildiring.", yes:"Kelaman", no:"Kela olmayman", send:"Yuborish", party:"Mehmonlar soni", gift:"To'yona", giftHint:"Sovg'a o'rniga karta orqali tabriklashingiz mumkin", card:"Karta ma'lumotlari", cardHolder:"Karta egasi", copy:"Nusxa olish", copied:"Karta raqami nusxalandi.", copyError:"Nusxa olib bo'lmadi.", contacts:"Aloqa", phone:"Telefon", telegram:"Telegram", photo:"Surat", close:"Yopish", previous:"Oldingi", next:"Keyingi", guestRequired:"Ismingizni kiriting.", wishRequired:"Tilagingizni yozing.", choose:"Javobingizni tanlang.", saved:"Javobingiz saqlandi. Rahmat!", submitted:"Tilagingiz yuborildi.", error:"Yuborilmadi. Qayta urinib ko'ring.", preview:"Ko'rish rejimida yuborish o'chiq.", musicOn:"Musiqani yoqish", musicOff:"Musiqani to'xtatish", noDate:"To'y sanasi belgilanmagan.", message:"Sizning tashrifingiz biz uchun eng katta sovg'a." },
    "uz-Cyrl": { invite:"Сизни ҳаётимиздаги энг бахтли кун — тўйимизга таклиф қиламиз", withFamilies:"Оилалари ҳамроҳлигида", countdown:"Қолган вақт", days:"Кун", hours:"Соат", minutes:"Дақиқа", seconds:"Сония", venue:"Манзил", map:"Харитада кўриш", calendar:"Тақвимга қўшиш", program:"Тўй дастури", schedule:"Илк саломдан сўнгги рақсгача — байрам куни.", dress:"Кийиниш услуби", gallery:"Галерея", wishes:"Тилаклар", wishHint:"Тўй эгаларига эзгу тилакларингизни қолдиринг", guest:"Исмингиз", wish:"Келин-куёвга тилагингиз...", wishSend:"Тилак юбориш", rsvp:"Келасизми?", rsvpHint:"Илтимос, жавобингизни билдиринг.", yes:"Келаман", no:"Кела олмайман", send:"Юбориш", party:"Меҳмонлар сони", gift:"Тўёна", giftHint:"Совға ўрнига карта орқали табриклашингиз мумкин", card:"Карта маълумотлари", cardHolder:"Карта эгаси", copy:"Нусха олиш", copied:"Карта рақами нусхаланди.", copyError:"Карта рақамини нусхалаб бўлмади.", contacts:"Алоқа", phone:"Телефон", telegram:"Telegram", photo:"Сурат", close:"Ёпиш", previous:"Олдинги", next:"Кейинги", guestRequired:"Исмингизни киритинг.", wishRequired:"Тилагингизни ёзинг.", choose:"Жавобингизни танланг.", saved:"Жавобингиз сақланди. Раҳмат!", submitted:"Тилагингиз юборилди.", error:"Юборилмади. Қайта уриниб кўринг.", preview:"Кўриш режимида юбориш ўчиқ.", musicOn:"Мусиқани ёқиш", musicOff:"Мусиқани тўхтатиш", noDate:"Тўй санаси белгиланмаган.", message:"Ташрифингиз биз учун энг катта совға." },
    en: { invite:"We invite you to the happiest day of our lives", withFamilies:"Together with our families", countdown:"Time remaining", days:"Days", hours:"Hours", minutes:"Minutes", seconds:"Seconds", venue:"Venue", map:"View map", calendar:"Add to calendar", program:"Wedding program", schedule:"From the first greeting to the last dance — a day of celebration.", dress:"Dress code", gallery:"Gallery", wishes:"Wishes", wishHint:"Leave a kind wish for the couple", guest:"Your name", wish:"Your wish for the couple...", wishSend:"Send wish", rsvp:"Will you attend?", rsvpHint:"Please let us know your response.", yes:"I'll attend", no:"Can't attend", send:"Submit", party:"Number of guests", gift:"Gift", giftHint:"You can send a gift by card", card:"Card details", cardHolder:"Card holder", copy:"Copy number", copied:"Card number copied.", copyError:"Could not copy the card number.", contacts:"Contact", phone:"Phone", telegram:"Telegram", photo:"Photo", close:"Close", previous:"Previous", next:"Next", guestRequired:"Enter your name.", wishRequired:"Write your wish.", choose:"Choose your response.", saved:"Your response was saved. Thank you!", submitted:"Your wish was sent.", error:"Could not send. Please try again.", preview:"Submission is disabled in preview.", musicOn:"Play music", musicOff:"Pause music", noDate:"No event date has been set.", message:"Your presence is the greatest gift." },
    ru: { invite:"Приглашаем вас на самый счастливый день нашей жизни", withFamilies:"Вместе с нашими семьями", countdown:"До торжества осталось", days:"Дни", hours:"Часы", minutes:"Минуты", seconds:"Секунды", venue:"Место проведения", map:"Открыть карту", calendar:"Добавить в календарь", program:"Программа свадьбы", schedule:"От первой встречи до последнего танца — день праздника.", dress:"Дресс-код", gallery:"Галерея", wishes:"Пожелания", wishHint:"Оставьте доброе пожелание молодожёнам", guest:"Ваше имя", wish:"Ваше пожелание...", wishSend:"Отправить пожелание", rsvp:"Вы придёте?", rsvpHint:"Пожалуйста, сообщите, сможете ли вы прийти.", yes:"Приду", no:"Не смогу прийти", send:"Отправить", party:"Количество гостей", gift:"Подарок", giftHint:"Вы можете отправить подарок на карту", card:"Данные карты", cardHolder:"Владелец карты", copy:"Скопировать номер", copied:"Номер карты скопирован.", copyError:"Не удалось скопировать номер карты.", contacts:"Контакты", phone:"Телефон", telegram:"Telegram", photo:"Фото", close:"Закрыть", previous:"Назад", next:"Далее", guestRequired:"Введите ваше имя.", wishRequired:"Напишите пожелание.", choose:"Выберите ответ.", saved:"Ваш ответ сохранён. Спасибо!", submitted:"Ваше пожелание отправлено.", error:"Не удалось отправить. Попробуйте ещё раз.", preview:"Отправка в режиме просмотра отключена.", musicOn:"Включить музыку", musicOff:"Остановить музыку", noDate:"Дата торжества не указана.", message:"Ваше присутствие — лучший подарок." }
  };
  let payload = null, countdownTimer = 0;
  const query = (sel, base = root) => base.querySelector(sel);
  const all = (sel, base = root) => [...base.querySelectorAll(sel)];
  const put = (node, value) => { if (node) node.textContent = value == null ? "" : String(value); };
  const hide = (node, value = true) => { if (node) node.hidden = Boolean(value); };
  const c = () => text[payload?.locale] || text["uz-Latn"];
  const dateOk = (d) => Number.isFinite(Date.parse(d?.dateTime || ""));

  function revealContent(reduced) {
    const intro = query('.fixed.inset-0.z-50[role="button"]');
    const programRows = new Set(all(".space-y-10 > *", sections[4]));
    for (const [index, node] of [...programRows].entries()) {
      const styles = (node.getAttribute("style") || "").split(";").filter(Boolean);
      const keep = styles.filter((item) => !/^\s*opacity\s*:\s*0(?:\.0+)?\s*$/i.test(item) && !/^\s*transform\s*:\s*translateY\(\s*20px\s*\)\s*$/i.test(item));
      if (keep.length) node.setAttribute("style", keep.join(";")); else node.removeAttribute("style");
      node.dataset.laceProgramRow = "";
      node.style.setProperty("--lace-motion-delay", `${index * 0.05}s`);
    }
    for (const node of all('[style*="opacity:0"], [style*="opacity: 0"], [style*="translateY("]')) {
      if (intro?.contains(node) || node === sections[0]?.querySelector(".lace-hero-copy") || programRows.has(node)) continue;
      const styles = (node.getAttribute("style") || "").split(";").filter(Boolean);
      const keep = styles.filter((item) => !/^\s*opacity\s*:\s*0(?:\.0+)?\s*$/i.test(item) && !/^\s*transform\s*:\s*translateY\(\s*(?:20|40)px\s*\)\s*$/i.test(item));
      if (keep.length) node.setAttribute("style", keep.join(";")); else node.removeAttribute("style");
      node.dataset.laceReveal = "";
    }
    const reveal = (nodes) => {
      if (reduced || !("IntersectionObserver" in window)) { nodes.forEach((node) => node.classList.add("lace-revealed")); return; }
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("lace-revealed"); observer.unobserve(entry.target); }
      }), nodes[0]?.matches("[data-lace-program-row]") ? { threshold: 0.4 } : { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      nodes.forEach((node) => observer.observe(node));
    };
    reveal(all("[data-lace-reveal]"));
    reveal(all("[data-lace-program-row]"));
    if (reduced) {
      all("svg").forEach((svg) => { try { svg.setCurrentTime?.(0); svg.pauseAnimations?.(); } catch {} });
      all("video").forEach((video) => { video.pause(); try { video.currentTime = 0; } catch {} });
    }
  }

  function render(p) {
    payload = p;
    const d = p.data || {};
    document.documentElement.lang = p.locale === "uz-Latn" ? "uz" : p.locale || "uz";
    document.documentElement.dir = "ltr";
    root.classList.toggle("lace-reduced-motion", Boolean(p.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches);
    renderHero(d); renderCountdown(d); renderVenue(d); renderProgram(d); renderDressCode(d); renderGallery(d.gallery || [], p); void renderWishes(d.wishes || [], p); renderRsvp(d, p); renderGift(d.toyona || {}); renderContacts(d.contacts || []); renderCalendar(d); renderFooter(d);
    installMusic(d, p); installOpening(d, p); installLocales(p); revealContent(Boolean(p.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches);
    root.style.visibility = "visible";
    root.removeAttribute("aria-busy");
    root.removeAttribute("aria-hidden");
  }

  function renderHero(d) {
    const section = sections[0]; if (!section) return;
    const names = all("h1", section), date = section.querySelector("p.tracking-wide");
    put(names[0], d.groom || ""); put(names[1], d.bride || ""); put(date, d.date?.short || d.date?.long || "");
    const intro = sections[1]; if (intro) {
      const ps = all("p", intro); put(ps[0], c().withFamilies);
      put(ps[1], d.message || c().invite);
      let hosts = query("[data-lace-hosts]", intro);
      if (!hosts) { hosts = document.createElement("p"); hosts.dataset.laceHosts = ""; hosts.className = "lace-sans mt-5 text-sm text-lace-ink/70"; ps[1]?.after(hosts); }
      put(hosts, d.hosts || ""); hide(hosts, !d.hosts);
    }
    const message = sections[8]?.querySelector("p"); if (message) put(message, d.greeting || c().message);
  }

  function renderCountdown(d) {
    const section = sections[2]; if (!section) return;
    put(section.querySelector("h2"), c().countdown);
    const labels = all(".lace-body", section); [c().days,c().hours,c().minutes,c().seconds].forEach((v,i)=>put(labels[i],v));
    const values = all(".tabular-nums", section);
    if (countdownTimer) clearInterval(countdownTimer);
    const update=()=>{
      if (!dateOk(d)) { values.forEach((n)=>put(n,"—")); return; }
      let delta=Math.max(0,Date.parse(d.dateTime)-Date.now())/1000;
      const parts=[Math.floor(delta/86400),Math.floor(delta%86400/3600),Math.floor(delta%3600/60),Math.floor(delta%60)];
      parts.forEach((v,i)=>put(values[i],String(v).padStart(2,"0")));
    };
    update(); countdownTimer=setInterval(update,1000);
    let hint=section.querySelector("[data-lace-no-date]");
    if (!dateOk(d)) { if(!hint){hint=document.createElement("p");hint.dataset.laceNoDate="";hint.className="lace-body mt-3 text-xs text-lace-paper";section.querySelector(".grid")?.after(hint);}hint.textContent=c().noDate; }
    else hint?.remove();
  }

  function renderVenue(d) {
    const section=sections[3]; if(!section)return;
    const venue=d.venue||{}, ps=all("p",section), heading=section.querySelector("h2"), name=section.querySelector(".lace-doulaise");
    put(heading,c().venue); put(name,venue.name||""); put(ps[1],venue.address||""); put(ps[2],d.date?.long?`${d.date.long}${d.date.time?` · ${d.date.time}`:""}`:"");
    const link=section.querySelector("a"), queryText=[venue.name,venue.address].filter(Boolean).join(" ");
    const url=venue.mapUrl||((venue.lat!=null&&venue.lng!=null)?`https://maps.google.com/?q=${venue.lat},${venue.lng}`:queryText?`https://maps.google.com/?q=${encodeURIComponent(queryText)}`:"");
    if(link){link.href=url||"#";link.target="_blank";link.rel="noopener noreferrer";put(link.querySelector("span"),c().map);hide(link,!url);}
    hide(section,!venue.name&&!venue.address&&!url);
  }

  function renderProgram(d) {
    const section=sections[4], program=d.program||[]; if(!section)return;
    put(section.querySelector("h2"),c().program); put(section.querySelector("p"),c().schedule);
    const list=section.querySelector(".space-y-10"); if(!list)return;
    list.replaceChildren();
    for(const [index,item] of program.entries()){
      const row=sourceProgramRows[index%Math.max(1,sourceProgramRows.length)]?.cloneNode(true); if(!row)continue;
      const spans=all("span",row); const time=spans.find((n)=>n.classList.contains("lace-display")); const title=spans.find((n)=>n.classList.contains("lace-body"));
      put(time,item.time||""); put(title,item.title||""); row.dataset.laceProgram=""; list.append(row);
    }
    hide(section,program.length===0);
  }

  function renderDressCode(d) {
    const section=sections[5], dress=d.dressCode||{}; if(!section)return;
    const box=section.querySelector("div.absolute.inset-0");
    const ps=all("p",section); put(ps[0],dress.style||c().dress); put(ps[1],dress.text||dress.note||"");
    section.querySelector("[data-lace-colors]")?.remove();
    const colorBox=document.createElement("div"); colorBox.className="mt-3 flex flex-wrap justify-center gap-2"; colorBox.dataset.laceColors="";
    for(const color of dress.colors||[]){const swatch=document.createElement("span");swatch.className="h-5 w-5 rounded-full border border-lace-ink/30";swatch.style.backgroundColor=color.hex;swatch.title=color.name||"";swatch.setAttribute("aria-label",color.name||color.hex);colorBox.append(swatch);}
    if(dress.colors?.length) ps[1]?.after(colorBox);
    hide(section,!dress.enabled);
  }

  function renderGallery(gallery,p) {
    const section=sections[6], grid=section?.querySelector(".grid"); if(!grid)return;
    const entries=p.preview?gallery:gallery.filter((item)=>item.src);
    grid.replaceChildren();
    for(const [index,item] of entries.entries()){
      const card=sourceGalleryCards[index%Math.max(1,sourceGalleryCards.length)]?.cloneNode(true); if(!card)continue;
      const image=card.querySelector("img"); card.setAttribute("aria-label",item.alt||item.caption||`${c().photo} ${index+1}`); card.replaceChildren();
      if(item.src){const img=image||document.createElement("img");img.src=item.src;img.alt=item.alt||item.caption||`${c().photo} ${index+1}`;card.append(img);card.onclick=()=>openLightbox(entries.filter((x)=>x.src),entries.filter((x)=>x.src).indexOf(item));}
      else {card.classList.remove("cursor-zoom-in");card.classList.add("lace-empty-photo");card.setAttribute("aria-disabled","true");card.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg>';}
      grid.append(card);
    }
    put(section.querySelector("h2"),c().gallery); hide(section,!p.preview&&entries.length===0);
  }

  function openLightbox(items,start) {
    if(!items.length)return;
    const dialog=document.createElement("dialog");dialog.className="lace-lightbox";dialog.setAttribute("aria-label",c().gallery);
    const img=document.createElement("img"), controls=document.createElement("div");controls.className="lace-lightbox-controls";
    const prev=document.createElement("button"),close=document.createElement("button"),next=document.createElement("button");
    for(const b of [prev,close,next])b.type="button";prev.textContent=c().previous;close.textContent=c().close;next.textContent=c().next;
    let index=start;const show=()=>{img.src=items[index].src;img.alt=items[index].alt||items[index].caption||`${c().photo} ${index+1}`;};
    prev.onclick=()=>{index=(index-1+items.length)%items.length;show();};next.onclick=()=>{index=(index+1)%items.length;show();};close.onclick=()=>dialog.close();
    controls.append(prev,close,next);dialog.append(img,controls);root.append(dialog);show();dialog.showModal();dialog.addEventListener("close",()=>dialog.remove(),{once:true});
  }

  async function renderWishes(wishes,p) {
    const section=sections[7],form=section?.querySelector("form"),list=section?.querySelector("ul");if(!form||!list)return;
    put(section.querySelector("h2"),c().wishes);put(section.querySelector("h2")?.nextElementSibling,c().wishHint);
    const input=form.querySelector("input"),area=form.querySelector("textarea"),submit=form.querySelector('[type="submit"]');
    input.placeholder=c().guest;input.setAttribute("aria-label",c().guest);input.value=p.guestName||"";input.required=!p.preview;
    area.placeholder=c().wish;area.setAttribute("aria-label",c().wish);area.required=!p.preview;
    list.replaceChildren();
    let status=form.querySelector("[data-lace-status]");if(!status){status=document.createElement("p");status.dataset.laceStatus="";status.className="lace-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");form.append(status);}
    const values=p.preview?wishes:await fetch(`/api/public/invitations/${encodeURIComponent(p.invitationId||"")}/wishes`,{cache:"no-store"}).then(r=>r.ok?r.json():{wishes:[]}).then(r=>r.wishes||[]).catch(()=>[]);
    for(const wish of values){const item=sourceWishRow?.cloneNode(true)||document.createElement("li");const ps=all("p",item);put(ps[0],wish.name||"");put(ps[1],wish.message||wish.text||"");list.append(item);}
    hide(section,!p.preview&&!p.data?.wishesEnabled);
    form.onsubmit=async(e)=>{e.preventDefault();if(p.preview){put(status,c().preview);return;}const name=input.value.trim(),message=area.value.trim();if(!name){put(status,c().guestRequired);input.focus();return;}if(!message){put(status,c().wishRequired);area.focus();return;}submit.disabled=true;try{const response=await fetch(`/api/public/invitations/${encodeURIComponent(p.invitationId||"")}/wishes`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message,guestToken:p.guestToken||undefined})});if(!response.ok)throw Error();put(status,c().submitted);form.reset();}catch{put(status,c().error);}finally{submit.disabled=false;}};
  }

  function renderRsvp(d,p) {
    const section=sections[10],form=section?.querySelector("form");if(!form)return;
    put(section.querySelector("h2"),c().rsvp);put(section.querySelector("h2")?.nextElementSibling,c().rsvpHint);
    const input=form.querySelector("input"),submit=form.querySelector('[type="submit"]'),choices=all('[role="radio"]',form);
    input.placeholder=c().guest;input.value=p.guestName||"";input.required=!p.preview;input.setAttribute("aria-label",c().guest);
    choices.forEach((button,i)=>{button.setAttribute("aria-label",i?c().no:c().yes);put(button.querySelectorAll("span")[1],i?c().no:c().yes);button.type="button";button.setAttribute("aria-checked","false");button.onclick=()=>select(i);});
    const select=(i)=>choices.forEach((b,j)=>b.setAttribute("aria-checked",String(i===j)));
    let status=form.querySelector("[data-lace-status]");if(!status){status=document.createElement("p");status.dataset.laceStatus="";status.className="lace-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");form.append(status);}
    form.onsubmit=async(e)=>{e.preventDefault();if(p.preview){put(status,c().preview);return;}const name=input.value.trim(),answer=choices.findIndex(b=>b.getAttribute("aria-checked")==="true");if(!name){put(status,c().guestRequired);input.focus();return;}if(answer<0){put(status,c().choose);choices[0]?.focus();return;}submit.disabled=true;try{const response=await fetch(`/api/public/invitations/${encodeURIComponent(p.invitationId||"")}/rsvp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,status:answer?"no":"yes",partySize:answer?0:1,guestToken:p.guestToken||undefined})});if(!response.ok)throw Error();put(status,c().saved);form.reset();select(-1);}catch{put(status,c().error);}finally{submit.disabled=false;}};
  }

  function renderGift(gift) {
    const section=sections[9],button=section?.querySelector("button");if(!section||!button)return;
    put(section.querySelector("h2"),c().gift);put(section.querySelector("p"),gift.note||c().giftHint);button.textContent=c().card;
    let details=section.querySelector("[data-lace-gift]");if(!details){details=document.createElement("div");details.dataset.laceGift="";details.className="lace-gift-details";details.hidden=true;button.after(details);}
    details.replaceChildren();if(gift.cardNumber){const holder=document.createElement("p"),number=document.createElement("p"),copy=document.createElement("button"),status=document.createElement("p");holder.textContent=`${c().cardHolder}: ${gift.cardHolder||""}`;number.className="lace-card-number";number.textContent=gift.cardNumber;copy.type="button";copy.textContent=c().copy;status.className="lace-status";status.setAttribute("role","status");copy.onclick=async()=>{try{await navigator.clipboard.writeText(String(gift.cardNumber));put(status,c().copied);}catch{put(status,c().copyError);}};details.append(holder,number,copy,status);}
    button.setAttribute("aria-expanded","false");button.onclick=()=>{details.hidden=!details.hidden;button.setAttribute("aria-expanded",String(!details.hidden));};hide(section,!gift.enabled);
  }

  function renderContacts(contacts) {
    const section=sections[11],links=all("a",section);if(!section)return;put(section.querySelector("h3"),c().contacts);
    const values=[contacts.find(x=>x.type==="phone"),contacts.find(x=>x.type==="telegram")];
    links.forEach((link,index)=>{const item=values[index];hide(link,!item);if(!item)return;link.href=item.href||"#";const iconRow=link.querySelector(".inline-flex");if(iconRow){const icon=iconRow.querySelector("svg");iconRow.replaceChildren(...(icon?[icon]:[]),document.createTextNode(item.value||item.label||""));}link.setAttribute("aria-label",`${index?c().telegram:c().phone}: ${item.value||""}`);});
    links.slice(values.length).forEach(link=>hide(link,true));hide(section,!values.some(Boolean));
  }

  function renderCalendar(d) {
    const section=sections[3],venue=d.venue||{};if(!section)return;
    let link=section.querySelector("[data-lace-calendar]");if(!link){link=document.createElement("a");link.dataset.laceCalendar="";link.className="inline-block rounded-full border border-lace-ink/35 px-8 py-3 mt-4";section.querySelector("a")?.after(link);}
    if(!dateOk(d)){hide(link);return;}const start=new Date(d.dateTime),end=new Date(start.getTime()+2*60*60*1000),fmt=v=>v.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/, "Z");const location=[venue.name,venue.address].filter(Boolean).join(", ");
    link.href=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${d.groom||""} & ${d.bride||""} ${d.eventType||"Wedding"}`)}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(location)}`;link.target="_blank";link.rel="noopener noreferrer";link.classList.add("lace-body");put(link,c().calendar);hide(link,false);
  }

  function renderFooter(d) {
    const footer=query("footer");if(!footer)return;
    const paragraphs=all("p",footer);
    if(paragraphs[0])put(paragraphs[0],d.greeting||c().message);
    const hostLine=paragraphs[1];if(hostLine){const host=hostLine.querySelector("span");if(host)put(host,d.hosts||"");const direct=[...hostLine.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());if(direct)direct.textContent=`${c().withFamilies}\n`;hide(hostLine,!d.hosts);}
    const names=paragraphs.find(p=>p.classList.contains("text-3xl"));if(names){const direct=[...names.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());put(direct[0],d.groom||"");put(direct[1],d.bride||"");}
    const date=paragraphs.at(-1);if(date)put(date,d.date?.short||d.date?.long||"");
    const brand=footer.querySelector("a[href*='chorlove']");hide(brand,true);
  }

  function installMusic(d,p) {
    const audio=query("audio");if(!audio)return;audio.dataset.laceAudio="";audio.pause();if(d.music?.url)audio.src=d.music.url;else audio.removeAttribute("src");audio.loop=true;audio.preload="none";audio.muted=Boolean(p.preview&&p.silentPlayback);
    const button=query('[aria-label="Toggle music"]');if(!button)return;hide(button,!d.music?.url||Boolean(p.preview&&p.silentPlayback));button.setAttribute("aria-label",audio.paused?c().musicOn:c().musicOff);button.setAttribute("aria-pressed",String(!audio.paused));
    button.onclick=async()=>{if(audio.paused){try{await audio.play();button.setAttribute("aria-label",c().musicOff);button.setAttribute("aria-pressed","true");}catch{button.setAttribute("aria-label",c().musicOn);}}else{audio.pause();button.setAttribute("aria-label",c().musicOn);button.setAttribute("aria-pressed","false");}};
  }

  function installOpening(d,p) {
    const intro=query('.fixed.inset-0.z-50[role="button"]');if(!intro)return;
    const label=intro.querySelector("p"),video=intro.querySelector("video"),poster=intro.querySelector("img"),audio=query("audio");
    put(label,p.locale==="en"?"Tap to open":p.locale==="ru"?"Нажмите, чтобы открыть":p.locale==="uz-Cyrl"?"Очиш учун босинг":"Ochish uchun bosing");
    intro.dataset.laceOpening = "";
    const reduced = Boolean(p.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = sections[0];
    const heroVideo = hero?.querySelector("video");
    const heroCopy = hero?.querySelector("div.opacity-0");
    if (heroCopy) heroCopy.classList.add("lace-hero-copy");
    let opened=false, fading=false, heroStarted=false;
    const startHero=()=>{
      if(heroStarted)return;heroStarted=true;
      if(heroVideo){
        if(reduced){heroVideo.pause();try{heroVideo.currentTime=0;}catch{}}
        else heroVideo.play().catch(()=>{});
      }
      if(heroCopy){
        const show=()=>{heroCopy.classList.remove("opacity-0");heroCopy.classList.add("opacity-100");};
        if(reduced)show();else window.setTimeout(show,800);
      }
    };
    const fadeIntro=()=>{
      if(fading)return;fading=true;intro.style.pointerEvents="none";intro.style.opacity="0";
      if(reduced){intro.remove();return;}
      const remove=()=>intro.remove();
      intro.addEventListener("transitionend",(event)=>{if(event.target===intro&&event.propertyName==="opacity")remove();});
      window.setTimeout(remove,2100);
    };
    const onTimeUpdate=()=>{
      if(!video)return;
      if(video.currentTime>0.05&&poster)poster.style.opacity="0";
      if(!Number.isFinite(video.duration)||video.duration<=0)return;
      const remaining=video.duration-video.currentTime;
      if(remaining<1.8)startHero();
      if(remaining<1)fadeIntro();
    };
    const open=async()=>{
      if(opened)return;
      opened=true;if(label)label.hidden=true;
      if(!p.silentPlayback&&d.music?.url)audio?.play().catch(()=>{});
      if(reduced||!video){startHero();fadeIntro();return;}
      video.currentTime=0;video.style.opacity="1";if(poster)poster.style.opacity="1";
      video.addEventListener("timeupdate",onTimeUpdate);
      video.addEventListener("ended",()=>{startHero();fadeIntro();},{once:true});
      video.addEventListener("error",()=>{startHero();fadeIntro();},{once:true});
      try{await video.play();}catch{startHero();fadeIntro();}
    };
    intro.onclick=open;intro.onkeydown=(event)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();void open();}};
  }

  function installLocales(p) {
    let nav=query("[data-lace-languages]");if(!nav){nav=document.createElement("nav");nav.dataset.laceLanguages="";nav.className="lace-languages";nav.setAttribute("aria-label","Language");root.append(nav);}
    nav.setAttribute("aria-label",({"uz-Latn":"Til","uz-Cyrl":"Тил",en:"Language",ru:"Язык"})[p.locale]||"Language");
    nav.replaceChildren();for(const locale of p.enabledLocales||["uz-Latn","uz-Cyrl","en","ru"]){const button=document.createElement("button");button.type="button";button.textContent=({"uz-Latn":"Uz","uz-Cyrl":"Уз",en:"En",ru:"Ru"})[locale]||locale;button.setAttribute("aria-pressed",String(locale===p.locale));button.onclick=()=>parent.postMessage({type:`${id}:language`,locale},location.origin);nav.append(button);}
  }

  addEventListener("message",(event)=>{if(event.source===parent&&event.origin===location.origin&&event.data?.type===`${id}:update`)render(event.data.payload);});
  try{const initial=JSON.parse(window.name);if(initial?.type===`${id}:update`)render(initial.payload);}catch{}
})();
