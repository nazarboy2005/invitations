(() => {
  "use strict";
  const id = "invitate-nahorgi-osh";
  const localeNames = {
    "uz-Latn": { invitation:"Taklifnoma", hosts:"Mezbonlar", greeting:"Aziz mehmon!", respect:"Hurmat bilan,", scroll:"Pastga suring", time:"Vaqt", address:"Manzil", map:"Xaritada ko‘rish", caption:"Dasturxonimiz sizni kutmoqda", rsvp:"Tasdiqlash", coming:"Kelasizmi?", intro:"Iltimos, javobingizni bildiring.", name:"Ismingiz", answer:"Javobingiz", yes:"Kelaman", no:"Kela olmayman", send:"Yuborish", again:"Javobni o‘zgartirish", thanks:"Rahmat", welcome:"Sizni intizorlik bilan kutamiz.", declined:"Javobingiz uchun rahmat.", error:"Javob yuborilmadi. Qayta urinib ko‘ring.", invalid:"Ismingizni yozing va javobni tanlang.", hero:["Nahorgi","oshga taklif","etamiz"] },
    "uz-Cyrl": { invitation:"Таклифнома", hosts:"Мезбонлар", greeting:"Азиз меҳмон!", respect:"Ҳурмат билан,", scroll:"Пастга суринг", time:"Вақт", address:"Манзил", map:"Харитада кўриш", caption:"Дастурхонимиз сизни кутмоқда", rsvp:"Тасдиқлаш", coming:"Келасизми?", intro:"Илтимос, жавобингизни билдиринг.", name:"Исмингиз", answer:"Жавобингиз", yes:"Келаман", no:"Кела олмайман", send:"Юбориш", again:"Жавобни ўзгартириш", thanks:"Раҳмат", welcome:"Сизни интизорлик билан кутамиз.", declined:"Жавобингиз учун раҳмат.", error:"Жавоб юборилмади. Қайта уриниб кўринг.", invalid:"Исмингизни ёзинг ва жавобни танланг.", hero:["Наҳорги","ошга таклиф","этамиз"] },
    en: { invitation:"Invitation", hosts:"Hosts", greeting:"Dear guest!", respect:"With respect,", scroll:"Scroll down", time:"Time", address:"Address", map:"View map", caption:"Our table is waiting for you", rsvp:"RSVP", coming:"Will you join us?", intro:"Please let us know your response.", name:"Your name", answer:"Your response", yes:"I will attend", no:"I cannot attend", send:"Send", again:"Change response", thanks:"Thank you", welcome:"We look forward to seeing you.", declined:"Thank you for your response.", error:"Could not send your response. Please try again.", invalid:"Enter your name and choose a response.", hero:["Morning","osh invitation","you are invited"] },
    ru: { invitation:"Приглашение", hosts:"Хозяева", greeting:"Дорогой гость!", respect:"С уважением,", scroll:"Прокрутите вниз", time:"Время", address:"Адрес", map:"Открыть карту", caption:"Наш дастархан ждёт вас", rsvp:"Подтверждение", coming:"Вы придёте?", intro:"Пожалуйста, сообщите ваш ответ.", name:"Ваше имя", answer:"Ваш ответ", yes:"Приду", no:"Не смогу прийти", send:"Отправить", again:"Изменить ответ", thanks:"Спасибо", welcome:"Будем рады вас видеть.", declined:"Спасибо за ваш ответ.", error:"Не удалось отправить ответ. Попробуйте ещё раз.", invalid:"Укажите имя и выберите ответ.", hero:["Утренний","приглашаем на ош","будем рады вас видеть"] }
  };
  let data = null, locale = "uz-Latn";
  const q = (s, root=document) => root.querySelector(s);
  const put = (node, value) => { if (node) node.textContent = value || ""; };
  const fill = (payload) => {
    if (!payload) return;
    data = payload; locale = payload.locale || "uz-Latn";
    const l = localeNames[locale] || localeNames["uz-Latn"], date = payload.date || {};
    document.documentElement.lang = locale === "uz-Latn" ? "uz" : locale;
    const hero = q('header .hero-in[style*="1.5s"]');
    const heroNodes = hero ? hero.children : [];
    put(q('header .hero-in[style*=".9s"]'), l.invitation);
    const heading = q("header h1");
    heading?.querySelectorAll("span").forEach((span, index) => put(span, l.hero[index]));
    put(heroNodes[0], l.hosts);
    put(heroNodes[1], (payload.people || []).filter(Boolean).join(" & ") || payload.hosts);
    put(heroNodes[3], date.short || date.long);
    put(heroNodes[4], [date.time, date.time ? (locale === "en" ? "" : "") : ""].filter(Boolean).join(" "));
    const scroll = q('header .hero-in[style*="1.9s"] span'); put(scroll, l.scroll);
    const firstSection = document.querySelectorAll(".device > section")[0];
    const introHeading = q("h2", firstSection); put(introHeading, payload.greeting || l.greeting);
    const copy = q("p", firstSection); put(copy, payload.message);
    const introParas = firstSection?.querySelectorAll("p") || [];
    if (introParas[0]) introParas[0].hidden = !payload.message;
    if (introParas[1]) put(introParas[1], l.respect);
    if (introParas[2]) put(introParas[2], payload.hosts);
    if (introParas[1]) introParas[1].hidden = !payload.hosts;
    if (introParas[2]) introParas[2].hidden = !payload.hosts;
    const schedule = document.querySelectorAll(".device > section")[1];
    const scheduleCards = schedule?.querySelectorAll(".rv") || [];
    const timeCard = scheduleCards[0], venueCard = scheduleCards[1];
    if (timeCard) {
      const divs = timeCard.querySelectorAll("div");
      put(divs[0], l.time); put(divs[1], date.time); put(divs[2], date.long || date.short);
    }
    if (venueCard) {
      const divs = venueCard.querySelectorAll("div");
      put(divs[0], l.address); put(divs[1], payload.venue?.name);
      put(q("p", venueCard), [payload.venue?.address, payload.venue?.landmark].filter(Boolean).join(" · "));
      const map = q(".map-btn", venueCard);
      const href = payload.venue?.mapUrl || (payload.venue?.lat != null ? `https://yandex.uz/maps/?text=${payload.venue.lat},${payload.venue.lng}` : "");
      if (map) { map.href = href || "#"; map.hidden = !href; put(q("span", map), l.map); }
      venueCard.hidden = !(payload.venue?.name || payload.venue?.address || href);
    }
    const caption = document.querySelectorAll(".device > section")[2]?.querySelector("p.rv"); put(caption, l.caption);
    const rsvp = q("#rsvpForm")?.closest("section");
    if (rsvp) {
      rsvp.hidden = !payload.rsvp?.enabled;
      const rsvpTitle = q("h2", rsvp);
      put(rsvpTitle?.previousElementSibling, l.rsvp);
      put(q("h2", rsvp), l.coming); put(q("#rsvpError", rsvp), l.invalid);
      put(q("label[for='ism']", rsvp), l.name); put(q("legend", rsvp), l.answer);
      put(q(".opt.yes", rsvp), l.yes); put(q(".opt.no", rsvp), l.no);
      put(q("#rsvpSubmit", rsvp), l.send); put(q("#rsvpReset", rsvp), l.again);
      const intro = [...rsvp.querySelectorAll("p")].find((node) => node.id !== "rsvpError"); put(intro, l.intro);
      const guestInput = q("#ism", rsvp); if (guestInput) { guestInput.value = payload.guestName || ""; guestInput.placeholder = l.name; guestInput.readOnly = !!payload.guestName; }
      put(q("#msgYes", rsvp), l.welcome); put(q("#msgNo", rsvp), l.declined);
      const thank = q("#rsvpSent h3", rsvp); if (thank?.firstChild) thank.firstChild.textContent = `${l.thanks}, `;
    }
    const foot = q("footer .rv");
    if (foot) {
      const divs = foot.querySelectorAll(":scope > div");
      if (divs[0]) put(divs[0], l.respect);
      if (divs[1]) put(divs[1], payload.hosts);
      if (divs[2]) put(divs[2], date.short || date.long);
      const links = foot.querySelectorAll("a.soc"), contacts = payload.contacts || [];
      links.forEach((link) => {
        const original = link.getAttribute("aria-label") || "";
        const kind = original.toLowerCase().includes("telegram") ? "telegram" : original.toLowerCase().includes("instagram") ? "instagram" : "phone";
        const c = contacts.find((item) => item.type === kind);
        link.hidden = !c;
        if (c) { link.href = c.href; link.setAttribute("aria-label", c.label); }
      });
    }
  };
  const start = () => { try { if (window.name) fill(JSON.parse(window.name)); } catch {} };
  window.addEventListener("message", (event) => { if (event.origin === location.origin && event.data?.type === `${id}:update`) fill(event.data.payload); });
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("button"); if (!button) return;
    const t = localeNames[locale] || localeNames["uz-Latn"];
    if (button.id === "rsvpSubmit") {
      const name = q("#ism")?.value.trim(), answer = q("input[name='javob']:checked")?.value, error = q("#rsvpError");
      if (!name || !answer) { if (error) { error.textContent = t.invalid; error.style.display = "block"; } return; }
      if (data?.preview || !data?.apiBase) { if (error) { error.textContent = t.error; error.style.display = "block"; } return; }
      button.disabled = true;
      try {
        const response = await fetch(`${data.apiBase}/rsvp`, { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({ name, status:answer, partySize:answer === "yes" ? 1 : 0, guestToken:data.guestToken || undefined }) });
        if (!response.ok) throw new Error("RSVP failed");
        q("#guestName").textContent = name; q("#msgYes").hidden = answer !== "yes"; q("#msgNo").hidden = answer !== "no";
        q("#rsvpError").style.display = "none";
        q("#rsvpForm").hidden = true; q("#rsvpSent").style.display = "block";
      } catch { if (error) { error.textContent = t.error; error.style.display = "block"; } }
      finally { button.disabled = false; }
    }
    if (button.id === "rsvpReset") { q("#ism").value = ""; document.querySelectorAll("input[name='javob']").forEach((input) => { input.checked = false; }); q("#rsvpError").style.display = "none"; q("#rsvpForm").hidden = false; q("#rsvpSent").style.display = "none"; }
  });
  const rsvpInput = q("#ism"), rsvpError = q("#rsvpError");
  const clearRsvpError = () => { if (rsvpError) rsvpError.style.display = "none"; };
  rsvpInput?.addEventListener("input", clearRsvpError);
  document.querySelectorAll("input[name='javob']").forEach((input) => input.addEventListener("change", clearRsvpError));
  const reveal = document.querySelectorAll(".rv");
  const updateReveal = () => reveal.forEach((node) => {
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) node.classList.add("is-visible");
  });
  window.addEventListener("scroll", updateReveal, { passive: true });
  window.addEventListener("resize", updateReveal);
  updateReveal();
  start();
})();
