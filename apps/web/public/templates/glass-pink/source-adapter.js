(() => {
  const root = document.querySelector('[data-chorlove-template="glass-pink"]');
  if (!root) return;
  const labels = {
    "uz-Latn": {openInvitation:"Taklifnomani ochish",languageLabel:"Tilni tanlang",musicToggleLabel:"Musiqani yoqish yoki o'chirish",coupleLabel:"Kuyov va kelin",hostsLabel:"Hurmat bilan:",calendarAction:"Kalendariga qo'shish",storyTitle:"Bizning hikoyamiz",countdownTitle:"Sanamizni eslab qoling",venueTitle:"To'yxona",programTitle:"To'y dasturi",wishesTitle:"Tilaklar",rsvpTitle:"Kelasizmi?",rsvpPrompt:"Iltimos, javobingizni bildiring.",giftTitle:"Sovg'a yuborish",contactsTitle:"Bog'lanish uchun",giftOpenHint:"Ochish uchun bosing",rsvpYes:"Kelaman",rsvpNo:"Kela olmayman",submit:"Yuborish",sendWish:"Tilak yuborish",name:"Ismingiz",wish:"Kelin-kuyovga tilagingiz",dateTimeLabel:"Vaqt",calendarPrompt:"Bu sanani kalendaringizga belgilang - sizni kutamiz.",venueSectionTitle:"To'y manzili",wishesPrompt:"To'y egalariga ezgu tilaklaringizni qoldiring.",map:"Xaritada ko'rish"},
    "uz-Cyrl": {openInvitation:"\u0422\u0430\u043a\u043b\u0438\u0444\u043d\u043e\u043c\u0430\u043d\u0438 \u043e\u0447\u0438\u0448",languageLabel:"\u0422\u0438\u043b\u043d\u0438 \u0442\u0430\u043d\u043b\u0430\u043d\u0433",musicToggleLabel:"\u041c\u0443\u0437\u0438\u043a\u0430\u043d\u0438 \u0431\u043e\u0448\u049b\u0430\u0440\u0438\u0448",coupleLabel:"\u041a\u0443\u0451\u0432 \u0432\u0430 \u043a\u0435\u043b\u0438\u043d",hostsLabel:"\u04b2\u0443\u0440\u043c\u0430\u0442 \u0431\u0438\u043b\u0430\u043d:",calendarAction:"\u0422\u0430\u049b\u0432\u0438\u043c\u0433\u0430 \u049b\u0443\u0448\u0438\u0448",storyTitle:"\u0411\u0438\u0437\u043d\u0438\u043d\u0433 \u04b3\u0438\u043a\u043e\u044f\u043c\u0438\u0437",countdownTitle:"\u0421\u0430\u043d\u0430\u043c\u0438\u0437\u043d\u0438 \u044d\u0441\u043b\u0430\u0431 \u049b\u043e\u043b\u0438\u043d\u0433",venueTitle:"\u0422\u0443\u0439\u0445\u043e\u043d\u0430",programTitle:"\u0422\u0443\u0439 \u0434\u0430\u0441\u0442\u0443\u0440\u0438",wishesTitle:"\u0422\u0438\u043b\u0430\u043a\u043b\u0430\u0440",rsvpTitle:"\u041a\u0435\u043b\u0430\u0441\u0438\u0437\u043c\u0438?",rsvpPrompt:"\u0418\u043b\u0442\u0438\u043c\u043e\u0441, \u0436\u0430\u0432\u043e\u0431\u0438\u043d\u0433\u0438\u0437\u043d\u0438 \u0431\u0438\u043b\u0434\u0438\u0440\u0438\u043d\u0433.",giftTitle:"\u0421\u043e\u0432\u0493\u0430 \u044e\u0431\u043e\u0440\u0438\u0448",contactsTitle:"\u0411\u043e\u0493\u043b\u0430\u043d\u0438\u0448 \u0443\u0447\u0443\u043d",giftOpenHint:"\u041e\u0447\u0438\u0448 \u0443\u0447\u0443\u043d \u0431\u043e\u0441\u0438\u043d\u0433",rsvpYes:"\u041a\u0435\u043b\u0430\u043c\u0430\u043d",rsvpNo:"\u041a\u0435\u043b\u0430 \u043e\u043b\u043c\u0430\u0439\u043c\u0430\u043d",submit:"\u042e\u0431\u043e\u0440\u0438\u0448",sendWish:"\u0422\u0438\u043b\u0430\u043a \u044e\u0431\u043e\u0440\u0438\u0448",name:"\u0418\u0441\u043c\u0438\u043d\u0433\u0438\u0437",wish:"\u041a\u0435\u043b\u0438\u043d-\u043a\u0443\u0451\u0432\u0433\u0430 \u0442\u0438\u043b\u0430\u0433\u0438\u043d\u0433\u0438\u0437",dateTimeLabel:"\u0412\u0430\u049b\u0442",calendarPrompt:"\u0423\u0448\u0431\u0443 \u0441\u0430\u043d\u0430\u043d\u0438 \u0442\u0430\u049b\u0432\u0438\u043c\u0433\u0430 \u0431\u0435\u043b\u0433\u0438\u043b\u0430\u043d\u0433 - \u0441\u0438\u0437\u043d\u0438 \u043a\u0443\u0442\u0430\u043c\u0438\u0437.",venueSectionTitle:"\u0422\u0443\u0439 \u043c\u0430\u043d\u0437\u0438\u043b\u0438",wishesPrompt:"\u0422\u0443\u0439 \u044d\u0433\u0430\u043b\u0430\u0440\u0438\u0433\u0430 \u044d\u0437\u0433\u0443 \u0442\u0438\u043b\u0430\u043a\u043b\u0430\u0440\u0438\u043d\u0433\u0438\u0437\u043d\u0438 \u049b\u043e\u043b\u0434\u0438\u0440\u0438\u043d\u0433.",map:"\u0425\u0430\u0440\u0438\u0442\u0430\u0434\u0430 \u043a\u0443\u0440\u0438\u0448"},
    en: {openInvitation:"Open invitation",languageLabel:"Choose language",musicToggleLabel:"Toggle music",coupleLabel:"The couple",hostsLabel:"With love from:",calendarAction:"Add to calendar",storyTitle:"Our story",countdownTitle:"Save the date",venueTitle:"Venue",programTitle:"Event schedule",wishesTitle:"Wishes",rsvpTitle:"Will you attend?",rsvpPrompt:"Please let us know if you can join us.",giftTitle:"Send a gift",contactsTitle:"Contact",giftOpenHint:"Tap to open",rsvpYes:"I will attend",rsvpNo:"I cannot attend",submit:"Send",sendWish:"Send a wish",name:"Your name",wish:"Your wishes for the couple",dateTimeLabel:"Time",calendarPrompt:"Save this date on your calendar - we look forward to seeing you.",venueSectionTitle:"Venue",wishesPrompt:"Leave your best wishes for the couple.",map:"View map"},
    ru: {openInvitation:"\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435",languageLabel:"\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u044f\u0437\u044b\u043a",musicToggleLabel:"\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0438\u043b\u0438 \u0432\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043c\u0443\u0437\u044b\u043a\u0443",coupleLabel:"\u0416\u0435\u043d\u0438\u0445 \u0438 \u043d\u0435\u0432\u0435\u0441\u0442\u0430",hostsLabel:"\u0421 \u0443\u0432\u0430\u0436\u0435\u043d\u0438\u0435\u043c:",calendarAction:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 \u043a\u0430\u043b\u0435\u043d\u0434\u0430\u0440\u044c",storyTitle:"\u041d\u0430\u0448\u0430 \u0438\u0441\u0442\u043e\u0440\u0438\u044f",countdownTitle:"\u0414\u043e \u043d\u0430\u0448\u0435\u0433\u043e \u0434\u043d\u044f",venueTitle:"\u041c\u0435\u0441\u0442\u043e \u0442\u043e\u0440\u0436\u0435\u0441\u0442\u0432\u0430",programTitle:"\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430",wishesTitle:"\u041f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u044f",rsvpTitle:"\u0412\u044b \u043f\u0440\u0438\u0434\u0451\u0442\u0435?",rsvpPrompt:"\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u0441\u043e\u043e\u0431\u0449\u0438\u0442\u0435, \u043f\u0440\u0438\u0434\u0451\u0442\u0435 \u043b\u0438 \u0432\u044b.",giftTitle:"\u041f\u043e\u0434\u0430\u0440\u043e\u043a",contactsTitle:"\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b",giftOpenHint:"\u041d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c",rsvpYes:"\u0411\u0443\u0434\u0443",rsvpNo:"\u041d\u0435 \u0441\u043c\u043e\u0433\u0443 \u043f\u0440\u0438\u0439\u0442\u0438",submit:"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c",sendWish:"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u0435",name:"\u0418\u043c\u044f",wish:"\u041f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u0435 \u043c\u043e\u043b\u043e\u0434\u043e\u0436\u0451\u043d\u0430\u043c",dateTimeLabel:"\u0412\u0440\u0435\u043c\u044f",calendarPrompt:"\u041e\u0442\u043c\u0435\u0442\u044c\u0442\u0435 \u044d\u0442\u0443 \u0434\u0430\u0442\u0443 \u0432 \u043a\u0430\u043b\u0435\u043d\u0434\u0430\u0440\u0435 - \u0431\u0443\u0434\u0435\u043c \u0436\u0434\u0430\u0442\u044c \u0432\u0430\u0441.",venueSectionTitle:"\u041c\u0435\u0441\u0442\u043e \u043f\u0440\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u044f",wishesPrompt:"\u041e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0434\u043e\u0431\u0440\u044b\u0435 \u043f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u044f \u043c\u043e\u043b\u043e\u0434\u043e\u0436\u0451\u043d\u0430\u043c.",map:"\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u043a\u0430\u0440\u0442\u0443"}
  };
  function localize(p) {
    const copy = labels[p.locale] || labels["uz-Latn"];
    root.querySelectorAll('[data-gp-i18n], [data-chorlove-i18n]').forEach(node => {
      const key = node.dataset.gpI18n || node.dataset.chorloveI18n;
      const value = copy[key];
      if (value) node.textContent = value;
    });
    root.querySelectorAll('[data-chorlove-open]').forEach(node => { node.textContent = copy.openInvitation; node.setAttribute('aria-label', copy.openInvitation); });
    root.querySelectorAll('[aria-label="Toggle music"], .cc-music-toggle').forEach(node => node.setAttribute('aria-label', copy.musicToggleLabel));
    const rsvp = root.querySelector('[data-chorlove-rsvp-section]');
    if (rsvp) {
      const buttons = rsvp.querySelectorAll('button[data-chorlove-rsvp]');
      if (buttons[0]) buttons[0].textContent = copy.rsvpYes;
      if (buttons[1]) buttons[1].textContent = copy.rsvpNo;
      const submit = rsvp.querySelector('[data-chorlove-submit-rsvp]'); if (submit) submit.textContent = copy.submit;
    }
    const wishes = root.querySelector('[data-chorlove-wishes]');
    if (wishes) {
      const submit = wishes.querySelector('button[type="submit"]'); if (submit) submit.textContent = copy.sendWish;
      const input = wishes.querySelector('input'); if (input) { input.placeholder = copy.name + '*'; input.setAttribute('aria-label', copy.name); }
      const textarea = wishes.querySelector('textarea'); if (textarea) textarea.placeholder = copy.wish + '*';
    }
    const picker = root.querySelector('.cc-language-picker'); if (picker) picker.setAttribute('aria-label', copy.languageLabel);
  }
  function apply(payload) {
    if (!payload?.data || payload.templateId !== "glass-pink") return;
    const data = payload.data;
    const date = data.date || {};
    root.querySelectorAll('[data-gp-date]').forEach(node => node.textContent = date.short || "");
    root.querySelectorAll('[data-gp-footer-date]').forEach(node => node.textContent = date.long || "");
    root.querySelectorAll('[data-gp-footer-hosts]').forEach(node => node.textContent = data.hosts || "");
    root.querySelectorAll('[data-gp-event-summary]').forEach(node => node.textContent = [date.weekday, date.long, date.time].filter(Boolean).join(" - "));
    root.querySelectorAll('[data-gp-venue]').forEach(node => node.textContent = data.venue?.name || "");
    root.querySelectorAll('[data-gp-address]').forEach(node => node.textContent = data.venue?.address || "");
    const rows = [...root.querySelectorAll('[data-glass-program-row]')];
    rows.forEach((row, index) => {
      const item = data.program?.[index];
      row.hidden = !item;
      if (item) {
        const time = row.querySelector('[data-glass-program-time]');
        const title = row.querySelector('[data-glass-program-title]');
        if (time) time.textContent = item.time || "";
        if (title) title.textContent = item.title || "";
      }
    });
    const calendar = root.querySelector('[data-chorlove-calendar]')?.closest('section');
    if (calendar) calendar.hidden = !date.day;
    const footer = root.querySelector('footer');
    if (footer) {
      const names = footer.querySelectorAll('h2 span');
      if (names[0]) names[0].textContent = data.groom || "";
      if (names[2]) names[2].textContent = data.bride || "";
    }
    localize(payload);
  }
  const initial = (() => { try { return JSON.parse(window.name); } catch { return null; } })();
  if (initial?.type === "glass-pink:update") apply(initial.payload);
  addEventListener('message', event => {
    if (event.origin === location.origin && event.data?.type === "glass-pink:update") apply(event.data.payload);
  });
})();
