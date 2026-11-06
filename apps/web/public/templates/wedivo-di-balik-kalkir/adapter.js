/* Platform data bridge for the isolated Wedivo source document. */
(() => {
  "use strict";
  const ID = "wedivo-di-balik-kalkir";
  const $ = (selector) => document.querySelector(selector);
  const put = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value == null ? "" : String(value);
  };
  const show = (id, visible) => {
    const node = document.getElementById(id);
    if (node) {
      node.hidden = !visible;
      node.style.display = visible ? "" : "none";
    }
  };
  const safeUrl = (value) => {
    if (!value) return "";
    try {
      const url = new URL(value, location.origin);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };
  const localize = (locale, guest) => {
    const strings = {
      "uz-Latn": {
        couple: "Menyu",
        open: "Taklifnomani ochish",
        hint: "Muhrni bosib, taklifnomani oching",
        hello: "Assalomu alaykum",
        rsvp: "Ishtirokingiz",
        wishes: "Tilaklar",
        sent: "Javobingiz yuborildi. Rahmat!",
        fail: "Yuborilmadi. Qayta urinib ko‘ring.",
        preview: "Ko‘rish rejimida javob yuborib bo‘lmaydi.",
        name: "Ismingiz",
        attending: "Kelaman",
        decline: "Kela olmayman",
        send: "Yuborish",
        wishSent: "Tilagingiz yuborildi. Rahmat!",
      },
      "uz-Cyrl": {
        couple: "Меню",
        open: "Таклифномани очиш",
        hint: "Очилиши учун босинг",
        hello: "Ассалому алайкум",
        rsvp: "Келишингиз",
        wishes: "Тилаклар",
        sent: "Жавобингиз юборилди. Раҳмат!",
        fail: "Юборилмади. Қайта уриниб кўринг.",
        preview: "Кўриш режимида юбориб бўлмайди.",
        name: "Исмингиз",
        attending: "Келаман",
        decline: "Кела олмайман",
        send: "Юбориш",
        wishSent: "Тилагингиз юборилди. Раҳмат!",
      },
      en: {
        couple: "Menu",
        open: "Open invitation",
        hint: "Tap to open",
        hello: "Hello",
        rsvp: "Attendance",
        wishes: "Wishes",
        sent: "Your response was sent. Thank you!",
        fail: "Could not send. Please try again.",
        preview: "Sending is disabled in preview.",
        name: "Your name",
        attending: "I will attend",
        decline: "I cannot attend",
        send: "Send",
        wishSent: "Your wish was sent. Thank you!",
      },
      ru: {
        couple: "Меню",
        open: "Открыть приглашение",
        hint: "Нажмите, чтобы открыть",
        hello: "Здравствуйте",
        rsvp: "Присутствие",
        wishes: "Пожелания",
        sent: "Ответ отправлен. Спасибо!",
        fail: "Не удалось отправить. Попробуйте ещё раз.",
        preview: "Отправка в режиме просмотра отключена.",
        name: "Ваше имя",
        attending: "Приду",
        decline: "Не смогу прийти",
        send: "Отправить",
        wishSent: "Пожелание отправлено. Спасибо!",
      },
    };
    const t = strings[locale] || strings["uz-Latn"];
    if (locale === "uz-Latn") {
      const copy = {
        "cv-label": "Nikoh taklifnomasi", "cv-guest-k": "Hurmatli",
        "cv-guest-g": "Qadrli mehmonimizga", "hero-plate-t": "Bosh sahifa",
        "hero-kicker": "Shukronalik ila sizni nikoh to‘yimizga chorlaymiz",
        "hero-cue-t": "Sekin pastga suring", "cp-kicker": "Kelin-kuyov",
        "cp-role-b": "Kelin", "cp-role-g": "Kuyov",
        "cp-hint": "Ismni bosing yoki suratlarni suring", "st-kicker": "Hikoyamiz",
        "st-title": "Birga yozilgan hikoya", "st-intro": "Hayotimizning qadrli lahzalari.",
        "cd-kicker": "To‘y kunigacha",
        "cd-d-l": "Kun", "cd-h-l": "Soat", "cd-m-l": "Daqiqa", "cd-s-l": "Soniya",
        "cd-done": "Bugun nikoh to‘yimiz!", "cd-note": "Uzoq kutilgan quvonchli kunda uchrashguncha.",
        "cd-gcal-t": "Taqvimga saqlash", "cd-ics-t": ".ics faylini yuklab olish",
        "ev-kicker": "To‘y marosimi", "ev-1-name": "Nikoh marosimi", "ev-2-name": "To‘y bazmi",
        "ev-1-dir-t": "Yo‘nalishni ko‘rish", "ev-2-dir-t": "Yo‘nalishni ko‘rish",
        "rd-kicker": "Dastur",
        "vn-kicker": "Manzil",
        "vn-leaf-h": "Xaritani ochish uchun bosing", "vn-dir-t": "Xaritani ochish",
        "vn-copy-t": "Manzilni nusxalash", "dc-kicker": "Kiyim uslubi",
        "dc-pick": "Rangni tanlang va surat qanday o‘zgarishini ko‘ring.",
        "gl-kicker": "Galereya",
        "gl-cap": "Kalkan ortida asragan suratlarimiz.",
        "rs-kicker": "Ishtirokingiz",
        "rs-hello-g": "Assalomu alaykum.", "rs-intro": "Kelishingizni bildiring, siz uchun joy tayyorlab qo‘yamiz.",
        "rs-st-l": "Kela olasizmi?", "rs-st-maybe-t": "Hali aniq emas",
        "rs-msg-l": "Xabar", "rs-err": "Iltimos, kelishingiz yoki kelmasligingizni belgilang.",
        "rs-thanks-t": "Rahmat!", "rs-thanks-s": "Javobingizni oldik.",
        "rs-checkin-t": "Mehmonlar ro‘yxatidan o‘tish",
        "rs-checkin-note": "To‘y kuni mehmonlar stolidagi QR-kodni skanerlang.",
        "ws-kicker": "Tilak va duolar",
        "ws-intro": "Ezgu tilak va duolaringizni yozing. Barchasini mamnuniyat bilan o‘qiymiz.",
        "ws-msg-l": "Tilak", "ws-submit": "Tilakni yuborish", "ws-count": "Hozircha tilaklar yo‘q. Birinchi bo‘lib yozing.",
        "ws-more": "Yana tilaklarni ko‘rish", "cl-thanks-g": "Rahmat",
        "cl-family-k": "Ezgu tilab,", "cl-top-t": "Birinchi sahifaga qaytish",
        "cl-end": "Quvonchli kunimizda ko‘rishguncha"
      };
      Object.entries(copy).forEach(([id, value]) => put(id, value));
      const compose = (id, before, emphasis, after = "") => {
        const node = document.getElementById(id);
        if (!node) return;
        node.replaceChildren(document.createTextNode(before));
        const em = document.createElement("em");
        em.textContent = emphasis;
        node.append(em, document.createTextNode(after));
      };
      compose("cp-title", "Ikki ism, ", "bitta albom");
      compose("st-title", "Birga yozilgan ", "hikoya");
      compose("cd-title", "Yana ", "ozgina", " qoldi");
      compose("ev-title", "Biz kutgan ", "kun");
      compose("rd-title", "To‘y kuni ", "dasturi");
      compose("vn-title", "Shu yerda ", "ko‘rishguncha");
      compose("dc-title", "To‘y kunining ", "ranglari");
      compose("gl-title", "Albomimizni ", "varaqlang");
      compose("rs-title", "Kela ", "olasizmi?");
      compose("ws-title", "Tilaklaringizni ", "yozib qoldiring");
      document.querySelectorAll(".st-no").forEach((node) => {
        if (node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) node.firstChild.textContent = "Qism ";
      });
      document.querySelectorAll("[data-fill]").forEach((node) => {
        if (node.getAttribute("data-fill") === "date-long" && /Tanggal|Sana keyinroq/.test(node.textContent)) node.textContent = "Sana keyinroq ma’lum bo‘ladi";
      });
      ["cv-seal", "vn-leaf", "cl-tag", "nav", "gl-viewer", "gl-close", "gl-prev", "gl-next"].forEach((id) => {
        const node = document.getElementById(id);
        if (node) node.setAttribute("aria-label", ({"cv-seal":"Taklifnoma muhrini ochish", "vn-leaf":"Manzil xaritasini ochish", "cl-tag":"Heshtegni nusxalash", "nav":"Albom bo‘ylab navigatsiya", "gl-viewer":"Suratlar galereyasi", "gl-close":"Suratni yopish", "gl-prev":"Avvalgi surat", "gl-next":"Keyingi surat"})[id]);
      });
      const navTitles = ["Taklifnoma", "Salom va duo", "Kelin-kuyov", "Hikoyamiz", "Dastur", "Manzil", "Kiyim uslubi", "Galereya", "Ishtirokingiz", "Tilaklar", "Yakun"];
      ["nv-hero-lb", "nv-quote-lb", "nv-couple-lb", "nv-story-lb", "nv-rundown-lb", "nv-venue-lb", "nv-dresscode-lb", "nv-gallery-lb", "nv-rsvp-lb", "nv-wishes-lb", "nv-closing-lb"].forEach((id,i)=>put(id,navTitles[i]));
      const extraNav = {
        "nv-samar-lb": "Avval va hozir", "nv-countdown-lb": "To‘ygacha",
        "nv-events-lb": "Marosim", "nv-video-lb": "Video",
        "nv-gifts-lb": "Sovg‘a", "couple-plate-t": "Kelin-kuyov",
        "events-plate-t": "Marosim", "countdown-plate-t": "To‘ygacha qolgan vaqt",
        "rsvp-plate-t": "Ishtirokingiz", "wishes-plate-t": "Tilaklar",
        "closing-plate-t": "Yakun", "gallery-plate-t": "Galereya",
        "dresscode-plate-t": "Kiyim uslubi", "venue-plate-t": "Manzil",
        "rundown-plate-t": "Dastur", "story-plate-t": "Hikoyamiz",
        "nv-dresscode-lb": "Kiyim", "cv-note": "Ism va unvondagi xatolar uchun uzr so‘raymiz."
      };
      Object.entries(extraNav).forEach(([id, value]) => put(id, value));
      const sound = document.getElementById("nav-sound");
      if (sound) sound.setAttribute("aria-label", "Ovozni yoqish yoki o‘chirish");
      ["rs-name", "ws-name"].forEach((id)=>{const n=document.getElementById(id); if(n)n.placeholder="Ismingiz";});
      const rmsg=document.getElementById("rs-msg"); if(rmsg)rmsg.placeholder="Bizga xabar (ixtiyoriy)";
      const wmsg=document.getElementById("ws-msg"); if(wmsg)wmsg.placeholder="Ezgu tilak yoki duoyingizni yozing...";
    }
    document.documentElement.lang = locale;
    put("cv-open-t", t.open);
    put("cv-hint", t.hint);
    put("rs-st-yes-t", t.attending);
    put("rs-st-no-t", t.decline);
    put("rs-name-l", t.name);
    put("rs-submit", t.send);
    put("ws-name-l", t.name);
    put("ws-submit", t.send);
    put("rs-guest-v", guest || t.hello);
    const labels =
      {
        "uz-Latn": [
          "Taklifnoma",
          "Salom va duo",
          "Kelin-kuyov",
          "Hikoyamiz",
          "Dastur",
          "Manzil",
          "Kiyim",
          "Galereya",
          "Ishtirokingiz",
          "Tilaklar",
          "Yakun",
        ],
        "uz-Cyrl": [
          "Таклифнома",
          "Салом ва дуо",
          "Мақсад",
          "Ҳикоямиз",
          "Дастур",
          "Манзил",
          "Кийим",
          "Галерея",
          "Келишингиз",
          "Тилаклар",
          "Юқорига",
        ],
        en: [
          "Invitation",
          "Welcome",
          "Invitation",
          "Our story",
          "Schedule",
          "Venue",
          "Dress code",
          "Gallery",
          "RSVP",
          "Wishes",
          "Back to top",
        ],
        ru: [
          "Приглашение",
          "Приветствие",
          "Приглашение",
          "Наша история",
          "Программа",
          "Место",
          "Дресс-код",
          "Галерея",
          "Присутствие",
          "Пожелания",
          "Наверх",
        ],
      }[locale] || [];
    [
      "nv-hero-lb",
      "nv-quote-lb",
      "nv-couple-lb",
      "nv-story-lb",
      "nv-rundown-lb",
      "nv-venue-lb",
      "nv-dresscode-lb",
      "nv-gallery-lb",
      "nv-rsvp-lb",
      "nv-wishes-lb",
      "nv-closing-lb",
    ].forEach((id, index) => {
      if (labels[index]) put(id, labels[index]);
    });
    return t;
  };
  const render = (data, envelope) => {
    const locale = envelope.locale || "uz-Latn";
    const t = localize(locale, envelope.guestName);
    const [groom = "", bride = ""] = [data.groom, data.bride];
    const couple = [bride, groom].filter(Boolean).join(" & ");
    ["cv-bride", "hero-bride", "cl-bride", "cp-tab-bride"].forEach((id) =>
      put(id, bride),
    );
    ["cv-groom", "hero-groom", "cl-groom", "cp-tab-groom"].forEach((id) =>
      put(id, groom),
    );
    ["cp-name-b", "gf-addr-to"].forEach((id) => put(id, bride));
    put("cp-name-g", groom);
    const heroImage = document.getElementById("hero-img");
    if (heroImage) heroImage.alt = [bride, groom].filter(Boolean).join(" va ") + " surati";
    const brideImage = document.getElementById("cp-img-bride");
    if (brideImage) brideImage.alt = bride ? `${bride} — kelin surati` : "Kelin surati";
    const groomImage = document.getElementById("cp-img-groom");
    if (groomImage) groomImage.alt = groom ? `${groom} — kuyov surati` : "Kuyov surati";
    put("hero-date", data.date?.long);
    put("cv-date", data.date?.long);
    put("hero-time", data.date?.time);
    put("cd-when", data.date?.long);
    put("hero-tz", data.timezone);
    put("hero-venue", data.venue?.name);
    put("hero-line", data.message);
    put("qt-invite", data.message);
    put("qt-greet", data.greeting);
    put("hero-names", couple);
    put("cl-names", couple);
    put("cv-guest-v", envelope.guestName || t.hello);
    put("rs-guest", envelope.guestName || t.hello);
    put("cl-guest", envelope.guestName || t.hello);
    put("cp-parents-b", data.hosts);
    put("cp-parents-g", data.hosts);
    put("cp-bio-b", "");
    put("cp-bio-g", "");
    put("hero-venue", data.venue?.name);
    put("vn-name", data.venue?.name);
    put("vn-leaf-t", data.venue?.name);
    put("vn-addr", data.venue?.address);
    put("ev-1-venue", data.venue?.name);
    put("ev-1-addr", data.venue?.address);
    put("ev-1-date", data.date?.long);
    put("ev-1-time", data.date?.time);
    put("cl-text", data.message);
    put("cl-family", data.hosts);
    show("cl-family-k", Boolean(data.hosts));
    put("cl-salam", "");
    put("cv-b", bride.slice(0, 1));
    put("cv-g", groom.slice(0, 1));
    const stories = data.story || [];
    show("sec-story", stories.length > 0);
    for (let index = 0; index < 4; index++) {
      const story = stories[index];
      const n = index + 1;
      put(`st-title-${n}`, story?.title || "");
      put(`st-text-${n}`, story?.text || "");
      put(`st-date-${n}`, "");
      show(`st-ch-${n}`, Boolean(story?.title || story?.text));
    }
    put("st-count", `${Math.min(stories.length, 4)} / 4`);
    // The captured quote and before/after anecdote have no corresponding contract fields.
    // The before/after anecdote is distinct from the contract's repeatable story chapters.
    show("sec-quote", false);
    show("sec-samar", false);
    show("nv-quote", false);
    show("nv-samar", false);
    show("nv-story", stories.length > 0);
    show("nv-video", false);
    show("nv-gifts", false);
    put("cv-note", "");
    show("cv-note", false);
    put("hero-kicker", "");
    put("hero-line", data.message);
    put("hero-venue", data.venue?.name);
    put("ev-1-name", eventsTitle(data, 0));
    put("ev-1-date", data.date?.long);
    put("ev-1-time", data.date?.time);
    put("ev-1-venue", data.venue?.name);
    put("ev-1-addr", data.venue?.address);
    const secondEvent = data.program?.[1];
    put("ev-2-name", secondEvent?.title || "");
    put("ev-2-date", data.date?.long || "");
    put("ev-2-time", secondEvent?.time || "");
    put("ev-2-venue", data.venue?.name || "");
    put("ev-2-addr", data.venue?.address || "");
    put("ev-2-note", "");
    show("ev-2", Boolean(secondEvent));
    show("ev-live", false);
    show("sec-video", false);
    show("ws-sugg", false);
    put("vn-note", "");
    put("ev-1-note", "");
    put("rs-intro", "");
    put(
      "rs-deadline",
      data.rsvp?.deadline ? `RSVP · ${data.rsvp.deadline}` : "",
    );
    put("ws-intro", "");
    put("cd-note", "");
    put("cp-order-b", "");
    put("cp-order-g", "");
    const events = data.program || [];
    put("rd-list", "");
    const list = $("#rd-list");
    events.forEach((event) => {
      const row = document.createElement("div");
      row.className = "rd-item rv rv-l";
      const dot = document.createElement("span");
      dot.className = "rd-dot";
      const info = document.createElement("div");
      info.className = "rd-info";
      if (event.time) {
        const time = document.createElement("p");
        time.className = "rd-time";
        time.textContent = event.time;
        info.append(time);
      }
      const title = document.createElement("p");
      title.className = "rd-title";
      title.textContent = event.title || "";
      info.append(title);
      if (event.description) {
        const description = document.createElement("p");
        description.className = "rd-desc";
        description.textContent = event.description;
        info.append(description);
      }
      row.append(dot, info);
      list?.append(row);
    });
    show("sec-rundown", events.length > 0);
    if (data.dateTime) {
      document
        .querySelectorAll("[data-date]")
        .forEach((node) => node.setAttribute("data-date", data.dateTime));
    }
    window.dispatchEvent(
      new CustomEvent("wedivo:invitation-data", { detail: { data, locale } }),
    );
    renderCountdown(data.dateTime);
    if (data.dateTime) {
      const start = new Date(data.dateTime);
      if (Number.isFinite(start.getTime())) {
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        const stamp = (date) =>
          date
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d{3}/, "");
        const calendar = document.getElementById("cd-gcal");
        if (calendar) {
          const params = new URLSearchParams({
            action: "TEMPLATE",
            text: couple,
            dates: `${stamp(start)}/${stamp(end)}`,
            details: data.message || "",
            location: [data.venue?.name, data.venue?.address]
              .filter(Boolean)
              .join(", "),
          });
          calendar.href = `https://calendar.google.com/calendar/render?${params}`;
        }
      }
    }
    put("dc-text", data.dressCode?.text || "");
    show("sec-dresscode", Boolean(data.dressCode?.enabled));
    (data.dressCode?.colors || []).slice(0, 4).forEach((color, index) => {
      const chip = document.getElementById(`dc-chip-${index + 1}`);
      if (chip) chip.style.backgroundColor = color.hex;
      put(`dc-name-${index + 1}`, color.name);
      show(`dc-sw-${index + 1}`, Boolean(color.hex));
    });
    for (let index = (data.dressCode?.colors || []).length; index < 4; index++)
      show(`dc-sw-${index + 1}`, false);
    const gallery = data.gallery || [];
    const galleryImages = gallery.map((item) => item.src).filter(Boolean);
    window.dispatchEvent(
      new CustomEvent("wedivo:gallery", { detail: galleryImages }),
    );
    document.querySelectorAll(".ph-img[data-slot]").forEach((image, index) => {
      const url = galleryImages[index % Math.max(galleryImages.length, 1)];
      if (url) {
        image.src = url;
        image.classList.add("is-loaded");
      }
    });
    const map = data.venue?.mapUrl;
    ["vn-dir", "ev-1-dir"].forEach((id) => {
      const node = document.getElementById(id);
      if (node) {
        node.href =
          map ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([data.venue?.name, data.venue?.address].filter(Boolean).join(", "))}`;
      }
    });
    put("ws-title-em", t.wishes);
    show("sec-wishes", Boolean(data.wishesEnabled));
    show("sec-rsvp", Boolean(data.rsvp?.enabled));
    // Guest-count is deliberately omitted; the platform RSVP service receives one guest.
    show("rs-pax", false);
    const paxLabel = document.querySelector('label[for="rs-pax"]');
    if (paxLabel) paxLabel.hidden = true;
    const wishList = $("#ws-list");
    if (wishList) wishList.replaceChildren();
    const wishes = data.wishes || [];
    const template = $("template[data-wedivo=comment-template]");
    wishes.forEach((wish) => {
      const card = template?.content.firstElementChild?.cloneNode(true);
      if (!card) return;
      card.querySelector('[data-field="name"]').textContent = wish.name || "";
      card.querySelector('[data-field="message"]').textContent =
        wish.text || wish.message || "";
      wishList.append(card);
    });
    // The capture's amount transfer confirmation and physical mailing address have no matching
    // platform service/contract field. Do not show a form that could falsely claim a transfer.
    show("sec-gifts", false);
    const reduce =
      envelope.reducedMotion ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.toggle("wedivo-reduced-motion", reduce);
    const musicUrl = data.music?.enabled ? safeUrl(data.music.url) : "";
    window.dispatchEvent(
      new CustomEvent("wedivo:music", { detail: { url: musicUrl } }),
    );
    document.documentElement.classList.add("wedivo-data-ready");
    document
      .querySelectorAll(
        "#rs-form input, #rs-form textarea, #rs-form button, #ws-form input, #ws-form textarea, #ws-form button",
      )
      .forEach((node) => {
        node.disabled = Boolean(envelope.preview);
      });
    return t;
  };
  function eventsTitle(data, index) {
    return data.program?.[index]?.title || data.eventType || "";
  }
  let current;
  let countdownTimer;
  const renderCountdown = (dateTime) => {
    const start = new Date(dateTime || "");
    const valid = Number.isFinite(start.getTime());
    show("sec-countdown", valid);
    if (countdownTimer) clearInterval(countdownTimer);
    if (!valid) return;
    const tick = () => {
      const remaining = start.getTime() - Date.now();
      if (remaining <= 0) {
        ["cd-d", "cd-h", "cd-m", "cd-s"].forEach((id) => put(id, "00"));
        document.getElementById("sec-countdown")?.classList.add("is-done");
        put("cd-done", -remaining > 86400000
          ? "Quvonchimizga sherik bo‘lganingiz uchun rahmat."
          : "Bugun nikoh to‘yimiz!");
        return;
      }
      const seconds = Math.floor(remaining / 1000);
      put("cd-d", String(Math.floor(seconds / 86400)).padStart(2, "0"));
      put("cd-h", String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0"));
      put("cd-m", String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"));
      put("cd-s", String(seconds % 60).padStart(2, "0"));
    };
    document.getElementById("sec-countdown")?.classList.remove("is-done");
    tick();
    countdownTimer = setInterval(tick, 1000);
  };
  async function loadPublicWishes(payload) {
    if (!payload || payload.preview || !payload.invitationId) return;
    try {
      const response = await fetch(
        `/api/public/invitations/${encodeURIComponent(payload.invitationId)}/wishes`,
        { credentials: "same-origin" },
      );
      if (!response.ok) return;
      const result = await response.json();
      const list = $("#ws-list");
      const template = $("template[data-wedivo=comment-template]");
      if (!list || !template) return;
      list.replaceChildren();
      (result.wishes || []).forEach((wish) => {
        const card = template.content.firstElementChild.cloneNode(true);
        card.querySelector('[data-field="name"]').textContent = wish.name || "";
        card.querySelector('[data-field="message"]').textContent =
          wish.message || "";
        list.append(card);
      });
    } catch {
      /* Public wish listing remains empty when the service is unavailable. */
    }
  }
  const accept = (event) => {
    if (
      event.source !== parent ||
      event.origin !== location.origin ||
      event.data?.type !== `${ID}:update`
    )
      return;
    current = event.data.payload;
    render(current.data, current);
    void loadPublicWishes(current);
  };
  addEventListener("message", accept);
  try {
    const initial = JSON.parse(window.name);
    if (initial?.type === `${ID}:update`) {
      current = initial.payload;
      render(current.data, current);
      void loadPublicWishes(current);
    }
  } catch {
    /* Host sends the first update after load. */
  }
  const feedback = (node, message) => {
    const target =
      node.querySelector(".wf-err") || node.querySelector("[aria-live]");
    if (target) {
      target.hidden = false;
      target.textContent = message;
    } else alert(message);
  };
  $("#rs-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!current || current.preview) return;
    const status = form.querySelector("[data-wedivo-status].is-selected")
      ?.dataset.wedivoStatus;
    const map = { attending: "yes", not_attending: "no", maybe: "maybe" };
    if (!map[status]) return;
    const body = new FormData(form);
    try {
      const response = await fetch(
        `/api/public/invitations/${encodeURIComponent(current.invitationId)}/rsvp`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: body.get("name"),
            status: map[status],
            partySize: map[status] === "yes" ? 1 : 0,
            note: body.get("message") || "",
            ...(current.guestToken ? { guestToken: current.guestToken } : {}),
          }),
        },
      );
      if (!response.ok) throw new Error();
      form.classList.add("is-submitted");
      put("rs-thanks-t", t.sent);
    } catch {
      feedback(form, "Javob yuborilmadi. Qayta urinib ko‘ring.");
    }
  });
  $("#ws-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!current || current.preview) return;
    const body = new FormData(form);
    try {
      const response = await fetch(
        `/api/public/invitations/${encodeURIComponent(current.invitationId)}/wishes`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: body.get("name"),
            message: body.get("message"),
            ...(current.guestToken ? { guestToken: current.guestToken } : {}),
          }),
        },
      );
      if (!response.ok) throw new Error();
      form.reset();
      feedback(form, localize(current.locale || "uz-Latn", current.guestName).wishSent);
    } catch {
      feedback(form, "Tilak yuborilmadi. Qayta urinib ko‘ring.");
    }
  });
})();
