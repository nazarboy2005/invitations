(() => {
  "use strict";
  const id = "green-gold";
  const root = document.querySelector('[data-chorlove-template="green-gold"]');
  if (!root) return;
  const sections = [...root.querySelectorAll("section")];
  const copy = {
    "uz-Latn": { invite: "Sizni hayotimizdagi eng baxtli kunimizga taklif qilamiz", welcome: "Assalomu alaykum", title: "Taklifnoma", couple: "Kelin & Kuyov", date: "To'y sanasi", time: "Boshlanish vaqti", countdown: "Baxtli onlargacha...", venue: "To'y manzili", map: "Xaritada ko'rish", contacts: "Bog'lanish uchun", hosts: "Hurmat bilan", gallery: "Bizning lahzalarimiz", wishes: "Mehmonlar tilaklari", wish: "Tilagingizni qoldiring", rsvp: "Kelasizmi?", rsvpPrompt: "Iltimos, javobingizni bildiring.", yes: "Kelaman", no: "Kela olmayman", send: "Yuborish", guest: "Ismingiz", wishPlaceholder: "Tilagingiz", saved: "Javobingiz saqlandi. Rahmat!", submitted: "Tilagingiz yuborildi.", error: "Yuborilmadi. Qayta urinib ko'ring.", preview: "Ko'rish rejimida yuborish o'chiq.", days: "Kun", hours: "Soat", minutes: "Daq", seconds: "Son", guestRequired: "Ismingizni kiriting.", wishRequired: "Tilagingizni yozing.", chooseResponse: "Javobingizni tanlang.", responseLabel: "Javobingiz", photo: "Surat", close: "Yopish", gift: "Sovg'a / karta", giftHeading: "Sovg'a uchun", giftCta: "Sovg'a yuborish", partySize: "Mehmonlar soni", playMusic: "Musiqani yoqish", pauseMusic: "Musiqani to'xtatish", musicUnavailable: "Musiqa mavjud emas", language: "Til" },
    "uz-Cyrl": { invite: "Сизни ҳаётимиздаги энг бахтли кунимизга таклиф қиламиз", welcome: "Ассалому алайкум", title: "Таклифнома", couple: "Келин ва куёв", date: "Тўй санаси", time: "Бошланиш вақти", countdown: "Бахтли онларгача...", venue: "Тўй манзили", map: "Харитада кўриш", contacts: "Боғланиш учун", hosts: "Ҳурмат билан", gallery: "Бизнинг лаҳзаларимиз", wishes: "Меҳмонлар тилаклари", wish: "Тилагингизни қолдиринг", rsvp: "Келасизми?", rsvpPrompt: "Илтимос, жавобингизни билдиринг.", yes: "Келаман", no: "Кела олмайман", send: "Юбориш", guest: "Исмигиз", wishPlaceholder: "Тилагингиз", saved: "Жавобингиз сақланди. Раҳмат!", submitted: "Тилагингиз юборилди.", error: "Юборилмади. Қайта уриниб кўринг.", preview: "Кўриш режимида юбориш ўчиқ.", days: "Кун", hours: "Соат", minutes: "Дақ", seconds: "Сон", guestRequired: "\u0418\u0441\u043c\u0438\u043d\u0433\u0438\u0437\u043d\u0438 \u043a\u0438\u0440\u0438\u0442\u0438\u043d\u0433.", wishRequired: "\u0422\u0438\u043b\u0430\u0433\u0438\u043d\u0433\u0438\u0437\u043d\u0438 \u0451\u0437\u0438\u043d\u0433.", chooseResponse: "\u0416\u0430\u0432\u043e\u0431\u0438\u043d\u0433\u0438\u0437\u043d\u0438 \u0442\u0430\u043d\u043b\u0430\u043d\u0433.", responseLabel: "\u0416\u0430\u0432\u043e\u0431\u0438\u043d\u0433\u0438\u0437", photo: "\u0421\u0443\u0440\u0430\u0442", close: "\u0401\u043f\u0438\u0448", gift: "\u0421\u043e\u0432\u0493\u0430 / \u043a\u0430\u0440\u0442\u0430", giftHeading: "\u0421\u043e\u0432\u0493\u0430 \u0443\u0447\u0443\u043d", giftCta: "\u0421\u043e\u0432\u0493\u0430 \u044e\u0431\u043e\u0440\u0438\u0448", partySize: "\u041c\u0435\u04b3\u043c\u043e\u043d\u043b\u0430\u0440 \u0441\u043e\u043d\u0438", playMusic: "\u041c\u0443\u0441\u0438\u049b\u0430\u043d\u0438 \u0451\u049b\u0438\u0448", pauseMusic: "\u041c\u0443\u0441\u0438\u049b\u0430\u043d\u0438 \u0442\u045e\u0445\u0442\u0430\u0442\u0438\u0448", musicUnavailable: "\u041c\u0443\u0441\u0438\u049b\u0430 \u043c\u0430\u0432\u0436\u0443\u0434 \u044d\u043c\u0430\u0441", language: "\u0422\u0438\u043b" },
    en: { invite: "You are invited to the happiest day of our lives", welcome: "Welcome", title: "Invitation", couple: "The couple", date: "Wedding date", time: "Start time", countdown: "Until our happy day...", venue: "Venue", map: "Open map", contacts: "Contact us", hosts: "With love from", gallery: "Our moments", wishes: "Guest wishes", wish: "Leave a wish", rsvp: "Will you join us?", rsvpPrompt: "Please let us know if you can attend.", yes: "I'll attend", no: "I can't attend", send: "Submit", guest: "Your name", wishPlaceholder: "Your wish", saved: "Your response was saved. Thank you!", submitted: "Your wish was sent.", error: "Could not submit. Please try again.", preview: "Submissions are disabled in preview.", days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec", guestRequired: "Enter your name.", wishRequired: "Write a wish.", chooseResponse: "Choose your RSVP response.", responseLabel: "Your response", photo: "Photo", close: "Close", gift: "Gift / card", giftHeading: "For your gift", giftCta: "Send a gift", partySize: "Number of guests", playMusic: "Play music", pauseMusic: "Pause music", musicUnavailable: "Music unavailable", language: "Language" },
    ru: { invite: "Приглашаем вас на самый счастливый день нашей жизни", welcome: "Добро пожаловать", title: "Приглашение", couple: "Жених и невеста", date: "Дата свадьбы", time: "Время начала", countdown: "До нашего счастливого дня...", venue: "Место проведения", map: "Открыть карту", contacts: "Связаться с нами", hosts: "С уважением", gallery: "Наши моменты", wishes: "Пожелания гостей", wish: "Оставьте пожелание", rsvp: "Вы придёте?", rsvpPrompt: "Пожалуйста, сообщите, сможете ли вы прийти.", yes: "Приду", no: "Не смогу прийти", send: "Отправить", guest: "Ваше имя", wishPlaceholder: "Ваше пожелание", saved: "Ваш ответ сохранён. Спасибо!", submitted: "Ваше пожелание отправлено.", error: "Не удалось отправить. Попробуйте ещё раз.", preview: "Отправка в режиме просмотра отключена.", days: "Дней", hours: "Часов", minutes: "Мин", seconds: "Сек", guestRequired: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u0430\u0448\u0435 \u0438\u043c\u044f.", wishRequired: "\u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u0435.", chooseResponse: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0430\u0448 \u043e\u0442\u0432\u0435\u0442.", responseLabel: "\u0412\u0430\u0448 \u043e\u0442\u0432\u0435\u0442", photo: "\u0424\u043e\u0442\u043e", close: "\u0417\u0430\u043a\u0440\u044b\u0442\u044c", gift: "\u041f\u043e\u0434\u0430\u0440\u043e\u043a / \u043a\u0430\u0440\u0442\u0430", giftHeading: "\u0414\u043b\u044f \u043f\u043e\u0434\u0430\u0440\u043a\u0430", giftCta: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043f\u043e\u0434\u0430\u0440\u043e\u043a", partySize: "\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0433\u043e\u0441\u0442\u0435\u0439", playMusic: "\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043c\u0443\u0437\u044b\u043a\u0443", pauseMusic: "\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043c\u0443\u0437\u044b\u043a\u0443", musicUnavailable: "\u041c\u0443\u0437\u044b\u043a\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430", language: "\u042f\u0437\u044b\u043a" },
  };
  let payload;
  let timer;
  const $ = (selector, base = root) => base.querySelector(selector);
  const tx = (node, value) => { if (node) node.textContent = value == null ? "" : String(value); };
  const hide = (node, value) => { if (node) node.hidden = Boolean(value); };
  async function render(p) {
    payload = p;
    const d = p.data || {};
    const c = copy[p.locale] || copy["uz-Latn"];
    document.documentElement.lang = p.locale === "uz-Latn" ? "uz" : p.locale;
    tx(sections[0]?.querySelector("p"), d.greeting || c.welcome);
    tx(sections[0]?.querySelector("h1"), c.title);
    tx(sections[1]?.querySelector("h3"), c.couple);
    const people = sections[1]?.querySelectorAll("h2") || [];
    tx(people[0], d.groom); tx(people[1], d.bride);
    tx(sections[3]?.querySelector("p"), d.message || c.invite);
    const date = d.date || {};
    const dateSection = sections[4];
    const hasDate = Number.isFinite(Date.parse(d.dateTime || ""));
    hide(dateSection, !hasDate);
    tx(dateSection?.querySelector("h3"), c.date);
    tx(dateSection?.querySelector("span.text-2xl"), date.time);
    const timeCaption=dateSection?.querySelector("p.text-white\\/40");tx(timeCaption,c.time);
    const grids=[...(dateSection?.querySelectorAll("[class*=grid-cols-7]")||[])];
    if(grids[0]){const localeTag=p.locale==="uz-Latn"?"uz-Latn":p.locale;const weekdays=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(localeTag,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,1+i))));grids[0].replaceChildren(...weekdays.map(value=>{const cell=document.createElement("span");cell.textContent=value;return cell;}));}
    const monthYear = dateSection?.querySelector("span.text-gold");
    tx(monthYear, [date.month, date.year].filter(Boolean).join(" "));
    const dayGrid = grids[1];
    if (dayGrid && Number(date.monthNumber) >= 1 && Number(date.monthNumber) <= 12 && Number(date.year)) {
      const y = Number(date.year), m = Number(date.monthNumber) - 1, offset = (new Date(Date.UTC(y,m,1).getUTCDay()+6)) % 7, count = new Date(Date.UTC(y,m+1,0)).getUTCDate();
      dayGrid.replaceChildren(...Array.from({length: Math.ceil((offset+count)/7)*7}, (_,i) => {
        const cell = document.createElement("div"); cell.className = "relative flex justify-center items-center h-4 text-xs";
        const day = i-offset+1;
        if (day>0 && day<=count) {
          const label=document.createElement("div");label.textContent=String(day);
          if(day===Number(date.day)){label.className="w-7 h-7 bg-gold rounded-full flex items-center justify-center text-[#082418] shadow-[0_0_10px_rgba(212,175,55,0.4)] font-bold";cell.setAttribute("aria-current","date");}
          else label.className="text-white/60";
          cell.append(label);
        }
        return cell;
      }));
    }
    const countdown = sections[5];
    tx(countdown?.querySelector("h3"), c.countdown);
    clearInterval(timer);
    const target = Date.parse(d.dateTime || "");
    if (Number.isFinite(target)) {
      hide(countdown, false);
      const tick = () => {
        const left = Math.max(0, target - Date.now());
        const nums = [Math.floor(left/86400000),Math.floor(left%86400000/3600000),Math.floor(left%3600000/60000),Math.floor(left%60000/1000)];
        const nodes = countdown?.querySelectorAll(".grid > div > div:first-child") || [];
        nums.forEach((n,i) => { if(nodes[i]) nodes[i].textContent=String(n).padStart(2,"0"); });
        const labels = countdown?.querySelectorAll(".grid > div > div:nth-child(2)") || [];
        [c.days,c.hours,c.minutes,c.seconds].forEach((label,i)=>tx(labels[i],label));
      };
      tick();
      timer = setInterval(tick, 1000);
    } else {
      hide(countdown, true);
      timer = undefined;
    }
    const venue = d.venue || {};
    tx(sections[6]?.querySelector("h3"), venue.name);
    tx(sections[6]?.querySelector("p"), venue.address);
    const mapLink = sections[6]?.querySelector("a");
    const query = [venue.name,venue.address].filter(Boolean).join(" ");
    const mapUrl = venue.mapUrl || (venue.lat!=null&&venue.lng!=null ? `https://maps.google.com/?q=${venue.lat},${venue.lng}` : query ? `https://maps.google.com/?q=${encodeURIComponent(query)}` : "");
    if(mapLink){mapLink.href=mapUrl||"#";tx(mapLink,c.map);hide(mapLink,!mapUrl);}
    const mapFrame=sections[6]?.querySelector("iframe"); if(mapFrame){if(venue.lat!=null&&venue.lng!=null){mapFrame.src=`https://maps.google.com/maps?q=${venue.lat},${venue.lng}&z=15&output=embed`;hide(mapFrame,false);}else{mapFrame.removeAttribute("src");hide(mapFrame,true);}}
    hide(sections[6],!venue.name&&!venue.address&&!mapUrl);
    const contacts=d.contacts||[];const contactSection=sections[7];
    tx(contactSection?.querySelector("h3"),c.contacts);
    const contactLinks=[...(contactSection?.querySelectorAll("a")||[])];
    contactLinks.forEach((a,i)=>{const item=contacts[i];hide(a,!item);if(item){a.href=item.href||"#";tx(a.querySelector("span"),item.value);}});
    const hostLabel=contactSection?.querySelector("p.text-gold\\/50"); tx(hostLabel,c.hosts);
    const hostNodes=contactSection?.querySelectorAll("p.text-xl")||[]; tx(hostNodes[0],d.hosts);
    hide(contactSection,!contacts.length&&!d.hosts);
    const gift=sections[8];hide(gift,!d.toyona?.enabled);
    tx(gift?.querySelector("p"), c.gift);
    tx(gift?.querySelector("h2"), c.giftHeading);
    const giftButton=gift?.querySelector("button");if(giftButton){let details=$("[data-gg-card]",gift);if(!details){details=document.createElement("p");details.dataset.ggCard="";details.className="text-center text-white";details.hidden=true;giftButton.after(details);}tx(details,[d.toyona?.cardNumber,d.toyona?.cardHolder].filter(Boolean).join(" · "));giftButton.onclick=()=>hide(details,!details.hidden);}
    if(giftButton)tx(giftButton,c.giftCta);
    const footerLink=sections[12]?.querySelector("a");if(footerLink){footerLink.href="/";tx(footerLink,"Taklifnoma");}
    const footerCta=sections[12]?.querySelectorAll("a")[1];if(footerCta){footerCta.href="/";tx(footerCta,p.locale==="en"?"Create your invitation":p.locale==="ru"?"Создать приглашение":p.locale==="uz-Cyrl"?"Таклифнома яратинг":"O'z taklifnomangizni yarating");}
    renderGallery(sections[9],d.gallery||[],p.preview,c);
    await renderWishes(sections[10],d.wishes||[],p);
    tx(sections[10]?.querySelector("p"),c.wishes);
    tx(sections[9]?.querySelector("p"),c.gallery);
    tx(sections[11]?.querySelector("h2"),c.rsvp);
    tx(sections[11]?.querySelector("p"),c.rsvpPrompt);
    hide(sections[11],!d.rsvp?.enabled);
    wireForm(sections[10],"wishes");wireForm(sections[11],"rsvp");
    const footerPeople=sections[12]?.querySelector("p.text-white\\/40");tx(footerPeople,[d.groom,d.bride].filter(Boolean).join(" · "));
    installMusic(d,p);
    installLocales(p,c);
    root.classList.toggle("gg-reduced-motion",Boolean(p.reducedMotion)||matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function renderGallery(section, gallery, preview, c) {
    if (!section) return;
    const grids = [...section.querySelectorAll(".grid")];
    if (!grids.length) return;
    grids.forEach((grid) => {
      [...grid.querySelectorAll("button")].forEach((button, index) => {
        const item = gallery[index];
        button.replaceChildren();
        button.classList.remove("gg-gallery-empty");
        button.disabled = false;
        button.removeAttribute("aria-hidden");
        button.onclick = null;
        hide(button.closest("div.relative"), !item || (!preview && !item.src));
        if (item?.src) {
          const alt = item.alt || item.caption || `${c.photo} ${index + 1}`;
          const img = document.createElement("img");
          img.src = item.src;
          img.alt = alt;
          img.className = "h-full w-full object-cover";
          button.append(img);
          button.setAttribute("aria-label", alt);
          button.onclick = () => {
            const dialog = document.createElement("dialog");
            dialog.className = "gg-lightbox";
            dialog.setAttribute("aria-label", alt);
            dialog.innerHTML = '<button type="button" data-gg-close></button><img alt="">';
            const dialogImage = dialog.querySelector("img");
            dialogImage.src = item.src;
            dialogImage.alt = alt;
            const close = dialog.querySelector("[data-gg-close]");
            close.textContent = c.close;
            close.setAttribute("aria-label", c.close);
            close.onclick = () => dialog.close();
            dialog.addEventListener("click", (event) => {
              if (event.target === dialog) dialog.close();
            });
            document.body.append(dialog);
            dialog.showModal();
            dialog.addEventListener("close", () => dialog.remove(), { once: true });
          };
        } else if (item && preview) {
          button.textContent = "\u2022";
          button.classList.add("gg-gallery-empty");
          button.disabled = true;
          button.setAttribute("aria-label", `${c.photo} ${index + 1}`);
        }
      });
    });
    hide(section, !preview && !gallery.some((item) => item.src));
  }
  async function renderWishes(section,wishes,p){
    if(!section)return;const title=section.querySelector("h2");if(title)title.textContent=(copy[p.locale]||copy["uz-Latn"]).wish;
    const cards=section.querySelectorAll(".flex.items-start.gap-3");cards.forEach(n=>n.remove());
    const list=section.querySelector(".h-\\[42dvh\\]");if(!list)return;
    const values=p.preview?wishes:await fetch(`/api/public/invitations/${encodeURIComponent(p.invitationId||"")}/wishes`,{cache:"no-store"}).then(r=>r.ok?r.json():{wishes:[]}).then(r=>r.wishes||[]).catch(()=>[]);
    values.forEach(w=>{const card=document.createElement("div");card.className="flex items-start gap-3 text-slate-900";const initial=document.createElement("span"),text=document.createElement("div"),name=document.createElement("strong"),message=document.createElement("p");initial.className="rounded-full border p-2";initial.textContent=(w.name||" ").slice(0,1);name.textContent=w.name||"";message.textContent=w.text||w.message||"";text.append(name,message);card.append(initial,text);list.append(card);});
    hide(section,!p.preview&&!p.data?.wishesEnabled);
  }
  function installLocales(p,c){let nav=$("[data-gg-languages]");if(!nav){nav=document.createElement("nav");nav.dataset.ggLanguages="";nav.className="gg-language-picker";root.append(nav);}nav.setAttribute("aria-label",c.language);nav.replaceChildren();for(const locale of p.enabledLocales||["uz-Latn","uz-Cyrl","en","ru"]){const button=document.createElement("button");button.type="button";button.textContent=({"uz-Latn":"Uz","uz-Cyrl":"\u040e\u0437",en:"En",ru:"Ru"})[locale]||locale;button.setAttribute("aria-pressed",String(locale===p.locale));button.onclick=()=>parent.postMessage({type:`${id}:language`,locale},location.origin);nav.append(button);}}
  function wireForm(section, kind) {
    const form = section?.querySelector("form");
    if (!form) return;
    const c = copy[payload.locale] || copy["uz-Latn"];
    const input = form.querySelector("input");
    const area = form.querySelector("textarea");
    if (input) {
      input.disabled = false;
      input.required = !payload.preview;
      if (!input.dataset.ggGuestInitialized) {
        input.value = payload.guestName || "";
        input.dataset.ggGuestInitialized = "true";
      }
      input.placeholder = c.guest;
      input.setAttribute("aria-label", c.guest);
      input.setAttribute("aria-invalid", "false");
      input.oninput = () => input.setAttribute("aria-invalid", "false");
    }
    if (area) {
      area.disabled = false;
      area.required = !payload.preview;
      area.maxLength = 2000;
      area.placeholder = c.wishPlaceholder;
      area.setAttribute("aria-label", c.wishPlaceholder);
      area.setAttribute("aria-invalid", "false");
      area.oninput = () => area.setAttribute("aria-invalid", "false");
    }
    const radioGroup = form.querySelector('[role="radiogroup"]');
    if (radioGroup) radioGroup.setAttribute("aria-label", c.responseLabel);
    const buttons = [...form.querySelectorAll('[role="radio"]')];
    const selectedIndex = () => buttons.findIndex((button) => button.getAttribute("aria-checked") === "true");
    const selectChoice = (index, focus = false) => {
      buttons.forEach((button, buttonIndex) => {
        const checked = buttonIndex === index;
        button.setAttribute("aria-checked", String(checked));
        button.tabIndex = checked || (index < 0 && buttonIndex === 0) ? 0 : -1;
      });
      if (focus) buttons[index]?.focus();
    };
    buttons.forEach((button, index) => {
      button.type = "button";
      button.setAttribute("aria-label", index ? c.no : c.yes);
      const label = button.querySelector("span");
      if (label) label.textContent = index ? c.no : c.yes;
      button.onclick = () => selectChoice(index);
      button.onkeydown = (event) => {
        const current = selectedIndex() >= 0 ? selectedIndex() : index;
        let next = current;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % buttons.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + buttons.length) % buttons.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = buttons.length - 1;
        else return;
        event.preventDefault();
        selectChoice(next, true);
      };
      button.tabIndex = selectedIndex() === index || (selectedIndex() < 0 && index === 0) ? 0 : -1;
    });
    let party = form.querySelector('[name="partySize"]');
    if (kind === "rsvp" && !party) {
      party = document.createElement("select");
      party.name = "partySize";
      party.className = "mt-3 w-full rounded-lg border px-4 py-3 text-sm";
      const submitButton = form.querySelector('button[type="submit"]');
      form.insertBefore(party, submitButton?.parentElement || null);
    }
    if (party) {
      party.disabled = false;
      const maximum = Math.min(Number(payload.data.rsvp?.maxPartySize) || 1, 20);
      const selected = Math.max(1, Number(party.value) || 1);
      party.replaceChildren(...Array.from({ length: maximum }, (_, index) => {
        const option = document.createElement("option");
        option.value = String(index + 1);
        option.textContent = String(index + 1);
        return option;
      }));
      party.value = String(Math.min(selected, maximum));
      party.setAttribute("aria-label", c.partySize);
    }
    const submit = form.querySelector('button[type="submit"]');
    if (submit) {
      submit.disabled = false;
      submit.textContent = c.send;
    }
    let status = form.querySelector("[data-gg-status]");
    if (!status) {
      status = document.createElement("p");
      status.dataset.ggStatus = "";
      form.append(status);
    }
    status.id = status.id || `gg-${kind}-status`;
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    if (input) input.setAttribute("aria-describedby", status.id);
    if (area) area.setAttribute("aria-describedby", status.id);
    const announce = (message, alert = false) => {
      status.setAttribute("role", alert ? "alert" : "status");
      status.setAttribute("aria-live", alert ? "assertive" : "polite");
      tx(status, message);
    };
    form.onsubmit = async (event) => {
      event.preventDefault();
      if (payload.preview) {
        announce(c.preview);
        return;
      }
      const name = String(input?.value || payload.guestName || "").trim();
      if (!name) {
        if (input) input.setAttribute("aria-invalid", "true");
        announce(c.guestRequired, true);
        input?.focus();
        return;
      }
      let body;
      if (kind === "wishes") {
        const message = String(area?.value || "").trim();
        if (!message) {
          if (area) area.setAttribute("aria-invalid", "true");
          announce(c.wishRequired, true);
          area?.focus();
          return;
        }
        body = { name, message, guestToken: payload.guestToken || undefined };
      } else {
        const choice = buttons.find((button) => button.getAttribute("aria-checked") === "true");
        if (!choice) {
          announce(c.chooseResponse, true);
          buttons[0]?.focus();
          return;
        }
        body = {
          name,
          status: choice === buttons[1] ? "no" : "yes",
          partySize: choice === buttons[1] ? 0 : Number(party?.value || 1),
          guestToken: payload.guestToken || undefined,
        };
      }
      if (submit) submit.disabled = true;
      try {
        const response = await fetch(`/api/public/invitations/${encodeURIComponent(payload.invitationId || "")}/${kind}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw Error();
        announce(kind === "wishes" ? c.submitted : c.saved);
        form.reset();
        if (input) input.setAttribute("aria-invalid", "false");
        if (area) area.setAttribute("aria-invalid", "false");
        selectChoice(-1);
      } catch {
        announce(c.error, true);
      } finally {
        if (submit) submit.disabled = false;
      }
    };
  }
  function installMusic(d,p){let audio=$("[data-gg-audio]");if(!audio){audio=document.createElement("audio");audio.dataset.ggAudio="";audio.loop=true;audio.preload="none";root.append(audio);const button=document.createElement("button");button.type="button";button.className="gg-music-toggle";button.textContent="\u266b";root.append(button);}const c=copy[p.locale]||copy["uz-Latn"];const music=d.music?.url;audio.src=music||"";audio.muted=Boolean(p.preview&&p.silentPlayback);const button=$(".gg-music-toggle");hide(button,!music||Boolean(p.preview&&p.silentPlayback));if(!button)return;button.setAttribute("aria-label",audio.paused?c.playMusic:c.pauseMusic);button.onclick=async()=>{if(audio.paused){try{await audio.play();button.setAttribute("aria-label",c.pauseMusic);}catch{button.setAttribute("aria-label",c.musicUnavailable);}}else{audio.pause();button.setAttribute("aria-label",c.playMusic);}};}
  addEventListener("message",e=>{if(e.origin===location.origin&&e.data?.type===`${id}:update`)render(e.data.payload);});
  try{const initial=JSON.parse(window.name);if(initial?.type===`${id}:update`)render(initial.payload);}catch{}
})();
