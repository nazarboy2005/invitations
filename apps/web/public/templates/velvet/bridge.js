(() => {
  const copy = {
    "uz-Latn": {
      unlock: "Taklifnomani ochish uchun suring",
      addressIntro: "Sizni ushbu manzilda kutamiz:",
      program: "To‘y dasturi",
      location: "Manzil",
      dress: "Kiyim uslubi",
      details: "Tafsilotlar",
      photos: "Suratlar",
      rsvp: "Javobingiz",
      countdown: "To‘yimizga qoldi",
      name: "Ism-familiyangiz",
      attendance: "Kela olasizmi?",
      yes: "Ha, mamnuniyat bilan kelaman",
      no: "Afsuski, kela olmayman",
      maybe: "Keyinroq xabar beraman",
      song: "Sevimli qo‘shig‘ingiz",
      send: "Javob yuborish",
      days: "kun",
      hours: "soat",
      minutes: "daqiqa",
      seconds: "soniya",
      success: "Javobingiz yuborildi.",
      error: "Javob yuborilmadi. Qayta urinib ko‘ring.",
      preview: "Ko‘rish rejimida javob yuborib bo‘lmaydi.",
      calendarPrompt: "Yurakcha qo‘yiladigan oyning kunini kiriting:",
    },
    "uz-Cyrl": {
      unlock: "Откройте приглашение",
      addressIntro: "Будем ждать вас по адресу:",
      program: "Тўй дастури",
      location: "Манзил",
      dress: "Кийиниш услуби",
      details: "Тафсилотлар",
      photos: "Суратлар",
      rsvp: "Жавобингиз",
      countdown: "Тўйимизга қолди",
      name: "Исм-фамилиянгиз",
      attendance: "Кела оласизми?",
      yes: "Ҳа, мамнуният билан келаман",
      no: "Афсуски, кела олмайман",
      maybe: "Кейинроқ хабар бераман",
      song: "Севимли қўшиғингиз",
      send: "Жавоб юбориш",
      days: "кун",
      hours: "соат",
      minutes: "дақиқа",
      seconds: "сония",
      success: "Жавобингиз юборилди.",
      error: "Жавоб юборилмади. Қайта уриниб кўринг.",
      preview: "Кўриш режимида жавоб юбориб бўлмайди.",
      calendarPrompt: "Юракча қўйиладиган ой кунини киритинг:",
    },
    en: {
      unlock: "Slide to open your invitation",
      addressIntro: "We look forward to welcoming you at:",
      program: "The day’s program",
      location: "Location",
      dress: "Dress code",
      details: "Details",
      photos: "Photos",
      rsvp: "Your response",
      countdown: "Until our celebration",
      name: "Your full name",
      attendance: "Will you attend?",
      yes: "Yes, with pleasure",
      no: "Sorry, I cannot attend",
      maybe: "I will let you know",
      song: "Song request",
      send: "Send response",
      days: "days",
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds",
      success: "Your response was sent.",
      error: "Could not send your response. Try again.",
      preview: "Responses are disabled in preview.",
      calendarPrompt: "Choose a day of the month for the heart:",
    },
    ru: {
      unlock: "Проведите, чтобы открыть приглашение",
      addressIntro: "Будем ждать вас по адресу:",
      program: "Программа дня",
      location: "Место проведения",
      dress: "Дресс-код",
      details: "Подробности",
      photos: "Фотографии",
      rsvp: "Ваш ответ",
      countdown: "До нашей свадьбы",
      name: "Ваше имя и фамилия",
      attendance: "Сможете прийти?",
      yes: "Да, с удовольствием",
      no: "К сожалению, не смогу",
      maybe: "Сообщу позднее",
      song: "Любимая песня",
      send: "Отправить ответ",
      days: "дней",
      hours: "часов",
      minutes: "минут",
      seconds: "секунд",
      success: "Ваш ответ отправлен.",
      error: "Не удалось отправить ответ. Попробуйте ещё раз.",
      preview: "Отправка ответов недоступна в режиме просмотра.",
      calendarPrompt: "Выберите число месяца для сердечка:",
    },
  };
  let data = null;
  const $ = (k) => document.querySelector(`[data-velvet="${k}"]`);
  const set = (k, v) => {
    const n = $(k);
    if (n) n.textContent = v || "";
  };
  function countdown(iso) {
    const then = iso ? Date.parse(iso) : NaN,
      left = Math.max(0, then - Date.now());
    [
      Math.floor(left / 86400000),
      Math.floor(left / 3600000) % 24,
      Math.floor(left / 60000) % 60,
      Math.floor(left / 1000) % 60,
    ].forEach((v, i) => {
      const n = document.querySelectorAll(".countdown-value")[i];
      if (n) n.textContent = String(v).padStart(2, "0");
    });
  }
  function apply(d) {
    data = d;
    window.velvetLocale = d.locale;
    window.velvetReducedMotion = !!d.qaReducedMotion;
    document.documentElement.classList.toggle(
      "velvet-reduced-motion",
      window.velvetReducedMotion,
    );
    document.dispatchEvent(new Event("velvet:motion"));
    const t = copy[d.locale] || copy.ru,
      p = d.people || [];
    window.velvetUi = t;
    set("unlock", t.unlock);
    set("address-intro", t.addressIntro);
    set("person-0", p[0]);
    set("person-1", p[1]);
    set("and", d.ui?.and || "&");
    set("initial-0", p[0]?.trim().charAt(0));
    set("initial-1", p[1]?.trim().charAt(0));
    set("greeting", d.greeting);
    set("message", d.message);
    set("calendar-title", d.dateLabel);
    window.velvetDate = {
      day: d.eventDay,
      month: d.eventMonth,
      year: d.eventYear,
    };
    document.dispatchEvent(new CustomEvent("velvet:date"));
    set("program-heading", d.programHeading || t.program);
    set("venue-name", d.venueName);
    set("venue-address", d.venueAddress);
    const location = document.querySelector(".location-section");
    if (location)
      location.hidden = !(d.venueName || d.venueAddress || d.mapUrl);
    set("location-heading", t.location);
    set("dress-heading", t.dress);
    set("dress-code", d.dressCode);
    const dress = document.querySelector(".dresscode-section");
    if (dress) dress.hidden = !d.dressCode;
    set("details-heading", t.details);
    set("gift-note", d.giftNote);
    set("photos-heading", t.photos);
    const photo = document.querySelector(".photos-section");
    if (photo) {
      const link = photo.querySelector("a");
      if (link) {
        link.href = d.photoLink || "#";
        link.textContent = t.photos;
        link.hidden = !d.photoLink;
      }
      const gallery = (d.gallery || []).filter((x) => x.src);
      let grid = photo.querySelector(".velvet-gallery");
      if (!grid) {
        grid = document.createElement("div");
        grid.className = "velvet-gallery";
        photo.append(grid);
      }
      grid.replaceChildren(
        ...gallery.map((item) => {
          const image = document.createElement("img");
          image.src = item.src;
          image.alt = item.alt || item.caption || "";
          image.loading = "lazy";
          return image;
        }),
      );
      photo.hidden = !gallery.length && !d.photoLink;
    }
    set("rsvp-heading", t.rsvp);
    set("rsvp-intro", d.message);
    const rsvpSection = document.querySelector(".form-section");
    if (rsvpSection) rsvpSection.hidden = !d.rsvpEnabled;
    set("name-label", t.name);
    set("attendance-label", t.attendance);
    set("attendance-yes", t.yes);
    set("attendance-no", t.no);
    set("attendance-maybe", t.maybe);
    set("song-label", t.song);
    set("submit", t.send);
    set("countdown-heading", t.countdown);
    const countdownSection = document.querySelector(".countdown-section");
    if (countdownSection) countdownSection.hidden = !d.startsAt;
    document
      .querySelectorAll(".countdown-label")
      .forEach(
        (n, i) =>
          (n.textContent = [t.days, t.hours, t.minutes, t.seconds][i] || ""),
      );
    document.querySelectorAll(".calendar-day").forEach((n, i) => {
      const dt = new Date(Date.UTC(2024, 0, 1 + i));
      n.textContent = new Intl.DateTimeFormat(d.locale, {
        weekday: "short",
        timeZone: "UTC",
      }).format(dt);
    });
    const programSection = document.querySelector(".program-section");
    if (programSection) {
      programSection.hidden = !(d.program || []).some(
        (item) => item.time || item.title,
      );
      programSection
        .querySelectorAll(".program-item")
        .forEach((n) => n.remove());
      (d.program || []).forEach((item) => {
        const row = document.createElement("div");
        row.className = "program-item";
        const time = document.createElement("h3");
        time.className = "subtitle";
        time.textContent = item.time;
        const title = document.createElement("p");
        title.textContent = item.title;
        row.append(time, title);
        programSection.append(row);
      });
    }
    const form = document.querySelector("#rsvp-form");
    if (form) form.hidden = !d.rsvpEnabled;
    const name = document.querySelector("#fio");
    if (name) name.value = d.guestName || "";
    const dressImage = document.querySelector(".dresscode-section img");
    if (dressImage) dressImage.hidden = !d.dressCode;
    const details = document.querySelector(".details-section");
    if (details) details.hidden = !d.giftNote;
    const map = document.querySelector("#venue-map");
    if (map) {
      map.href = d.mapUrl || "#";
      map.textContent = d.ui?.map || t.map || "";
      map.hidden = !d.mapUrl;
    }
    const audio = document.querySelector("#background-music");
    if (audio) {
      if (d.music) audio.src = d.music;
      else audio.removeAttribute("src");
      audio.muted = !!d.silentPlayback;
    }
    countdown(d.startsAt);
  }
  window.addEventListener("message", (e) => {
    if (e.origin === location.origin && e.data?.type === "velvet:update")
      apply(e.data.payload);
  });
  try {
    if (window.name) apply(JSON.parse(window.name));
  } catch {}
  document.addEventListener("submit", async (e) => {
    if (e.target?.id !== "rsvp-form") return;
    e.preventDefault();
    const t = copy[data?.locale] || copy.ru,
      status = document.querySelector(
        'input[name="attendance"]:checked',
      )?.value,
      name = document.querySelector("#fio")?.value.trim();
    if (data?.preview) {
      e.target.insertAdjacentText("beforeend", t.preview);
      return;
    }
    if (!name || !status || !data?.apiBase) return;
    const button = e.target.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const response = await fetch(`${data.apiBase}/rsvp`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          status,
          partySize: status === "yes" ? 1 : 0,
          note: document.querySelector("#track")?.value.trim() || "",
          guestToken: data.guestToken || undefined,
        }),
      });
      if (!response.ok) throw Error();
      const n = document.createElement("p");
      n.setAttribute("role", "status");
      n.textContent = t.success;
      e.target.replaceWith(n);
    } catch {
      const n = document.createElement("p");
      n.setAttribute("role", "alert");
      n.textContent = t.error;
      e.target.append(n);
    } finally {
      button.disabled = false;
    }
  });
  document.addEventListener("velvet:date", () => {
    const d = window.velvetDate;
    if (d && window.renderVelvetCalendar)
      window.renderVelvetCalendar(d.month, d.year, d.day);
  });
  document.addEventListener("DOMContentLoaded", () => {
    const locales = data?.enabledLocales || [];
    if (locales.length < 2) return;
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Language");
    select.style.cssText =
      "position:fixed;right:14px;top:14px;z-index:10001;padding:8px;border-radius:6px;background:#fff;border:1px solid #aaa";
    locales.forEach((locale) => {
      const option = document.createElement("option");
      option.value = locale;
      option.textContent =
        { "uz-Latn": "Uz", "uz-Cyrl": "Уз", en: "En", ru: "Ru" }[locale] ||
        locale;
      option.selected = locale === data.locale;
      select.append(option);
    });
    select.addEventListener("change", () =>
      parent.postMessage(
        { type: "velvet:language", locale: select.value },
        location.origin,
      ),
    );
    document.body.append(select);
  });
  setInterval(() => countdown(data?.startsAt), 1000);
})();
