(() => {
  "use strict";
  const id = "osh",
    root = document.querySelector(".osh-page"),
    q = (s, b = root) => b.querySelector(s),
    all = (s, b = root) => [...b.querySelectorAll(s)],
    put = (n, v) => {
      if (n) n.textContent = v == null ? "" : String(v);
    },
    hide = (n, v = true) => {
      if (n) n.hidden = !!v;
    };
  let p = null,
    timer = 0,
    revealObserver = null;
  const musicControl = q(".osh-music-control"),
    musicAudio = q(".osh-music-audio"),
    youtubeHost = q(".osh-youtube-host"),
    musicButton = q(".osh-music-button");
  let activeMusicUrl = "",
    activeYouTubeId = "",
    youtubePlayer = null,
    youtubeReady = false,
    musicOn = false,
    musicFadeTimer = 0;
  const getYouTubeId = (value) => {
    try {
      const url = new URL(value);
      if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] || "";
      if (!["youtube.com", "www.youtube.com"].includes(url.hostname)) return "";
      if (url.pathname === "/watch") return url.searchParams.get("v") || "";
      return url.pathname.match(/^\/embed\/([^/?]+)/)?.[1] || "";
    } catch {
      return "";
    }
  };
  const updateMusicIcon = () => {
    hide(q(".osh-volume-x"), musicOn);
    hide(q(".osh-volume-2"), !musicOn);
    musicButton?.setAttribute("aria-pressed", String(musicOn));
  };
  const stopMusic = () => {
    if (musicFadeTimer) clearInterval(musicFadeTimer);
    musicFadeTimer = 0;
    musicOn = false;
    musicAudio?.pause();
    if (musicAudio) {
      musicAudio.muted = true;
      musicAudio.volume = 0;
    }
    try {
      youtubePlayer?.pauseVideo();
      youtubePlayer?.setVolume(0);
    } catch {}
    updateMusicIcon();
  };
  const startMusicFade = () => {
    if (musicFadeTimer) clearInterval(musicFadeTimer);
    let volume = 0;
    musicFadeTimer = setInterval(() => {
      volume = Math.min(1, volume + 1 / 30);
      if (activeYouTubeId) {
        try {
          youtubePlayer?.setVolume(Math.round(volume * 100));
        } catch {}
      } else if (musicAudio) {
        musicAudio.volume = volume;
      }
      if (volume >= 1) {
        clearInterval(musicFadeTimer);
        musicFadeTimer = 0;
      }
    }, 50);
  };
  const failMusic = () => stopMusic();
  const startMusic = async () => {
    if (!activeMusicUrl) return;
    musicOn = true;
    updateMusicIcon();
    if (activeYouTubeId) {
      if (!youtubeReady || !youtubePlayer) return;
      try {
        youtubePlayer.setVolume(0);
        youtubePlayer.playVideo();
        startMusicFade();
      } catch {
        failMusic();
      }
      return;
    }
    if (!musicAudio) return failMusic();
    musicAudio.muted = false;
    musicAudio.volume = 0;
    try {
      await musicAudio.play();
      if (musicOn) startMusicFade();
    } catch {
      failMusic();
    }
  };
  const initializeYouTube = () => {
    if (youtubePlayer || !activeYouTubeId || !youtubeHost || !window.YT?.Player) return;
    youtubeHost.replaceChildren(document.createElement("div"));
    try {
      youtubePlayer = new window.YT.Player(youtubeHost.firstElementChild, {
        videoId: activeYouTubeId,
        playerVars: { playsinline: 1, controls: 0, autoplay: 0 },
        events: {
          onReady: () => {
            youtubeReady = true;
            if (musicOn) startMusic();
          },
          onError: failMusic,
        },
      });
    } catch {
      failMusic();
    }
  };
  const loadYouTubeApi = () => {
    if (window.YT?.Player) return initializeYouTube();
    if (window.__oshYouTubeReady) {
      window.__oshYouTubeReady.push(initializeYouTube);
      return;
    }
    window.__oshYouTubeReady = [initializeYouTube];
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      window.__oshYouTubeReady?.splice(0).forEach((callback) => callback());
    };
    if (!document.getElementById("yt-api-script")) {
      const script = document.createElement("script");
      script.id = "yt-api-script";
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = failMusic;
      document.head.append(script);
    }
  };
  const syncMusic = (music) => {
    const nextUrl = music?.enabled && typeof music.url === "string" ? music.url.trim() : "";
    if (nextUrl !== activeMusicUrl) {
      stopMusic();
      try {
        youtubePlayer?.destroy();
      } catch {}
      youtubePlayer = null;
      youtubeReady = false;
      if (musicAudio) {
        musicAudio.removeAttribute("src");
        musicAudio.load();
      }
      activeMusicUrl = nextUrl;
      activeYouTubeId = activeMusicUrl ? getYouTubeId(activeMusicUrl) : "";
      if (musicAudio && activeMusicUrl && !activeYouTubeId) musicAudio.src = activeMusicUrl;
      if (musicAudio) {
        musicAudio.volume = 0;
        musicAudio.muted = true;
      }
      if (activeYouTubeId) loadYouTubeApi();
    }
    hide(musicControl, !activeMusicUrl);
  };
  musicButton?.addEventListener("click", () => {
    if (!activeMusicUrl) return;
    if (musicOn) stopMusic();
    else void startMusic();
  });
  const dict = {
    "uz-Latn": {
      Invitation: "Taklifnoma",
      "we invite you": "marosimiga taklif etamiz",
      "Bride and groom": "Kelin-kuyov",
      "Scroll down": "Pastga suring",
      "Dear guest!": "Aziz mehmon!",
      "With respect,": "Hurmat bilan,",
      Time: "Vaqt",
      at: "soat",
      Days: "Kun",
      Hours: "Soat",
      Minutes: "Daqiqa",
      Seconds: "Soniya",
      "Our table awaits you": "Dasturxonimiz sizni kutmoqda",
      Address: "Manzil",
      "View on map": "Xaritada ko‘rish",
      Confirmation: "Tasdiqlash",
      "Will you come?": "Kelasizmi?",
      "Please let us know your answer.": "Iltimos, javobingizni bildiring.",
      "Your name": "Ismingiz",
      "Your full name": "Ism va familiyangiz",
      "Your answer": "Javobingiz",
      "I will come": "Kelaman",
      "I can't come": "Kela olmayman",
      "Preview only": "Faqat ko‘rib chiqish uchun",
      "Please enter your name and choose an answer.": "Ismingizni kiriting va javobni tanlang.",
      "Could not send. Please try again.": "Yuborilmadi. Qayta urinib ko‘ring.",
      Send: "Yuborish",
      "Sending...": "Yuborilmoqda...",
      "Thank you": "Rahmat",
      "We look forward to seeing you.": "Sizni kutib qolamiz.",
      "Thank you for your answer. Stay well.": "Javobingiz uchun rahmat.",
      "Change answer": "Javobni o‘zgartirish",
      "Created with love through": "Mehr bilan yaratildi",
      "Phone number": "Telefon raqam",
      "The event has started — we are waiting for you!":
        "Marosim boshlandi — sizni kutamiz.",
    },
    "uz-Cyrl": {
      Invitation: "Таклифнома",
      "we invite you": "маросимига таклиф этамиз",
      "Bride and groom": "Келин-куёв",
      "Scroll down": "Пастга суринг",
      "Dear guest!": "Азиз меҳмон!",
      "With respect,": "Ҳурмат билан,",
      Time: "Вақт",
      at: "соат",
      Days: "Кун",
      Hours: "Соат",
      Minutes: "Дақиқа",
      Seconds: "Сония",
      "Our table awaits you": "Дастурхонимиз сизни кутмоқда",
      Address: "Манзил",
      "View on map": "Харитада кўриш",
      Confirmation: "Тасдиқлаш",
      "Will you come?": "Келасизми?",
      "Please let us know your answer.": "Илтимос, жавобингизни билдиринг.",
      "Your name": "Исмингиз",
      "Your full name": "Исм ва фамилиянгиз",
      "Your answer": "Жавобингиз",
      "I will come": "Келаман",
      "I can't come": "Кела олмайман",
      "Preview only": "Фақат кўриб чиқиш учун",
      "Please enter your name and choose an answer.": "Исмингизни киритинг ва жавобни танланг.",
      "Could not send. Please try again.": "Юборилмади. Қайта уриниб кўринг.",
      Send: "Юбориш",
      "Sending...": "Юборилмоқда...",
      "Thank you": "Раҳмат",
      "We look forward to seeing you.": "Сизни кутиб қоламиз.",
      "Thank you for your answer. Stay well.": "Жавобингиз учун раҳмат.",
      "Change answer": "Жавобни ўзгартириш",
      "Created with love through": "Меҳр билан яратилди",
      "Phone number": "Телефон рақами",
      "The event has started — we are waiting for you!":
        "Маросим бошланди — сизни кутамиз.",
    },
    en: {},
    ru: {},
  };
  dict.en = {
    Invitation: "Invitation",
    "we invite you": "we invite you",
    "Bride and groom": "Bride and groom",
    "Scroll down": "Scroll down",
    "Dear guest!": "Dear guest!",
    "With respect,": "With respect,",
    Time: "Time",
    at: "at",
    Days: "Days",
    Hours: "Hours",
    Minutes: "Minutes",
    Seconds: "Seconds",
    "Our table awaits you": "Our table awaits you",
    Address: "Address",
    "View on map": "View on map",
    Confirmation: "Confirmation",
    "Will you come?": "Will you come?",
    "Please let us know your answer.": "Please let us know your answer.",
    "Your name": "Your name",
    "Your full name": "Your full name",
    "Your answer": "Your answer",
    "I will come": "I will come",
    "I can't come": "I can't come",
    "Preview only": "Preview only",
    "Please enter your name and choose an answer.": "Please enter your name and choose an answer.",
    "Could not send. Please try again.": "Could not send. Please try again.",
    Send: "Send",
    "Sending...": "Sending...",
    "Thank you": "Thank you",
    "We look forward to seeing you.": "We look forward to seeing you.",
    "Thank you for your answer. Stay well.":
      "Thank you for your answer. Stay well.",
    "Change answer": "Change answer",
    "Created with love through": "Created with love through",
    "Phone number": "Phone number",
    "The event has started — we are waiting for you!":
      "The event has started — we are waiting for you.",
  };
  dict.ru = {
    Invitation: "Приглашение",
    "we invite you": "приглашаем на торжество",
    "Bride and groom": "Жених и невеста",
    "Scroll down": "Прокрутите вниз",
    "Dear guest!": "Дорогой гость!",
    "With respect,": "С уважением,",
    Time: "Время",
    at: "в",
    Days: "Дней",
    Hours: "Часов",
    Minutes: "Минут",
    Seconds: "Секунд",
    "Our table awaits you": "Наш стол ждёт вас",
    Address: "Адрес",
    "View on map": "Посмотреть на карте",
    Confirmation: "Подтверждение",
    "Will you come?": "Вы придёте?",
    "Please let us know your answer.": "Пожалуйста, сообщите ваш ответ.",
    "Your name": "Ваше имя",
    "Your full name": "Имя и фамилия",
    "Your answer": "Ваш ответ",
    "I will come": "Приду",
    "I can't come": "Не смогу прийти",
    "Preview only": "Только предварительный просмотр",
    "Please enter your name and choose an answer.": "Введите имя и выберите ответ.",
    "Could not send. Please try again.": "Не удалось отправить. Попробуйте ещё раз.",
    Send: "Отправить",
    "Sending...": "Отправка...",
    "Thank you": "Спасибо",
    "We look forward to seeing you.": "Будем ждать вас.",
    "Thank you for your answer. Stay well.": "Спасибо за ответ.",
    "Change answer": "Изменить ответ",
    "Created with love through": "Создано с любовью",
    "Phone number": "Телефон",
    "The event has started — we are waiting for you!":
      "Мероприятие началось — мы вас ждём.",
  };
  const t = (k) => (dict[p?.locale] || dict["uz-Latn"])[k] || k;
  const render = (x) => {
    p = x;
    root.style.visibility = "visible";
    if (timer) clearInterval(timer);
    if (!revealObserver && "IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("osh-reveal");
              revealObserver.unobserve(entry.target);
            }
          }),
        { threshold: 0.2 },
      );
      all('[style*="opacity:0"][style*="translateY(28px)"]').forEach((node) => {
        node.style.opacity = "";
        node.style.transform = "";
        node.classList.add("osh-reveal-pending");
        revealObserver.observe(node);
      });
    }
    const d = x.data || {},
      content = d;
    syncMusic(d.music);
    const names =
      d.groom || d.bride
        ? `${d.groom || ""}${d.groom && d.bride ? " & " : ""}${d.bride || ""}`
        : "";
    put(q(".osh-kicker"), t("Invitation"));
    put(q(".osh-h1-big"), d.title || "Nahorgi osh");
    put(q(".osh-h1-sub"), t("we invite you"));
    put(q(".osh-couple-label"), t("Bride and groom"));
    put(q(".osh-couple-names"), names);
    hide(q(".osh-couple-label"), !names);
    hide(q(".osh-couple-names"), !names);
    const dt = d.date || {};
    put(q(".osh-hero-date span:first-child"), dt.short || dt.long || "");
    put(q(".osh-hero-date span:last-child"), dt.time || "");
    hide(q(".osh-hero-date"), !dt.short && !dt.long && !dt.time);
    put(q(".osh-scroll-hint span:first-child"), t("Scroll down"));
    put(q(".osh-intro-title"), t("Dear guest!"));
    put(q(".osh-intro-text"), d.message || "");
    hide(q(".osh-intro-text"), !d.message);
    put(q(".osh-intro-sign-pre"), t("With respect,"));
    put(q(".osh-intro-sign"), d.hosts || "");
    hide(q(".osh-intro-sign-pre"), !d.hosts);
    hide(q(".osh-intro-sign"), !d.hosts);
    const dateRow = q(".osh-date-row"),
      parts = dt.long?.split(" ") || [];
    put(q(".osh-date-side:first-child"), dt.weekday || "");
    put(q(".osh-date-day"), dt.day || "");
    put(q(".osh-date-month"), [dt.month, dt.year].filter(Boolean).join(" "));
    put(q(".osh-date-side:last-child"), `${t("at")} ${dt.time || ""}`);
    const when = q(".osh-when");
    hide(when, !dt.day);
    if (dt.day && d.dateTime) {
      const target = new Date(d.dateTime);
      const tick = () => {
        const ms = target.getTime() - Date.now();
        if (ms <= 0) {
          put(
            q(".osh-cd-done"),
            t("The event has started — we are waiting for you!"),
          );
          return;
        }
        const vals = [
          Math.floor(ms / 86400000),
          Math.floor(ms / 3600000) % 24,
          Math.floor(ms / 60000) % 60,
          Math.floor(ms / 1000) % 60,
        ];
        all(".osh-cd-num").forEach((n, i) =>
          put(n, String(vals[i]).padStart(2, "0")),
        );
      };
      tick();
      timer = setInterval(tick, 1000);
    }
    const caption = q(".osh-photo-caption");
    put(caption, t("Our table awaits you"));
    const photo = q(".osh-photo"),
      gallery = (d.gallery || []).filter((a) => a.src);
    const image = q(".osh-sun-img img");
    if (gallery.length) {
      image.src = gallery[0].src;
      image.alt = gallery[0].alt || gallery[0].caption || "";
      image.classList.remove("is-spinning");
    } else {
      image.src = "/templates/chorlove/osh/palov.png";
      image.alt = "";
      image.classList.add("is-spinning");
    }
    hide(photo, false);
    const venue = d.venue || {};
    put(q(".osh-venue-name"), venue.name || "");
    put(q(".osh-venue-addr"), venue.address || "");
    const map = q(".osh-map-btn");
    map.href = venue.mapUrl || "#";
    hide(q(".osh-venue-name"), !venue.name);
    hide(q(".osh-venue-addr"), !venue.address);
    hide(map, !venue.mapUrl);
    hide(q(".osh-venue"), !venue.name && !venue.address && !venue.mapUrl);
    put(q(".osh-label", q(".osh-venue")), t("Address"));
    put(q(".osh-map-btn span"), t("View on map"));
    hide(q(".osh-rsvp"), !d.rsvp?.enabled);
    put(q(".osh-rsvp .osh-label"), t("Confirmation"));
    put(q(".osh-rsvp-title"), t("Will you come?"));
    put(q(".osh-rsvp-lead"), t("Please let us know your answer."));
    put(q(".osh-footer-name"), d.hosts || "");
    hide(q(".osh-footer .osh-label"), !d.hosts);
    put(q(".osh-footer .osh-label"), t("With respect"));
    put(q(".osh-footer-date"), dt.short || dt.long || "");
    hide(q(".osh-footer-date"), !dt.short && !dt.long);
    const links = all(".osh-soc"),
      contacts = d.contacts || [],
      telegram = contacts.find((c) => c.type === "telegram"),
      instagram = contacts.find((c) => c.type === "instagram"),
      phone = contacts.find((c) => c.type === "phone");
    [
      [links[0], telegram],
      [links[1], instagram],
      [links[2], phone],
    ].forEach(([a, c]) => {
      if (!a) return;
      if (!c) {
        hide(a);
        return;
      }
      a.href = c.href;
      a.setAttribute("aria-label", c.label);
      hide(a, false);
    });
    hide(q(".osh-socials"), !telegram && !instagram && !phone);
    const watermark = q(".osh-watermark");
    if (watermark) watermark.remove();
    const form = q(".osh-form"),
      input = q("#osh-guest-name"),
      send = q(".osh-send-btn");
    if (input) {
      input.value = x.guestName || "";
      input.placeholder = t("Your full name");
      input.setAttribute("aria-label", t("Your name"));
      input.readOnly = !!x.guestName;
    }
    put(q(".osh-rsvp-title"), t("Will you come?"));
    hide(q(".osh-rsvp"), !d.rsvp?.enabled);
    put(q(".osh-rsvp .osh-label"), t("Confirmation"));
    put(q(".osh-form legend"), t("Your answer"));
    all(".osh-opt-b").forEach((n, i) =>
      put(n, t(i ? "I can't come" : "I will come")),
    );
    put(q(".osh-again"), t("Change answer"));
    put(send, t("Send"));
    if (x.reducedMotion)
      document.documentElement.classList.add("osh-reduced-motion");
  };
  const form = q(".osh-form"),
    input = q("#osh-guest-name"),
    send = q(".osh-send-btn"),
    thank = q(".osh-thanks"),
    status = document.createElement("p");
  status.className = "osh-form-error";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  form?.append(status);
  let answer = "";
  all(".osh-radio").forEach((r) =>
    r.addEventListener("change", () => {
      answer = r.value;
    }),
  );
  q(".osh-again")?.addEventListener("click", () => {
    answer = "";
    all(".osh-radio").forEach((radio) => (radio.checked = false));
    status.textContent = "";
    hide(thank);
    hide(form, false);
  });
  send?.addEventListener("click", async () => {
    status.textContent = "";
    if (p?.preview) {
      status.textContent = t("Preview only");
      return;
    }
    if (!input.value.trim() || !answer) {
      status.textContent = t("Please enter your name and choose an answer.");
      return;
    }
    send.disabled = true;
    put(send, t("Sending..."));
    try {
      const res = await fetch(
        `/api/public/invitations/${encodeURIComponent(p.invitationId || "")}/rsvp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: input.value.trim(),
            status: answer,
            partySize: answer === "yes" ? 1 : 0,
            guestToken: p.guestToken || undefined,
          }),
        },
      );
      if (!res.ok) throw Error();
      const name = input.value.trim();
      put(q("h3", thank), `${t("Thank you")}, ${name}!`);
      put(
        q("p", thank),
        t(
          answer === "yes"
            ? "We look forward to seeing you."
            : "Thank you for your answer. Stay well.",
        ),
      );
      hide(form);
      hide(thank, false);
    } catch {
      status.textContent = t("Could not send. Please try again.");
    } finally {
      send.disabled = false;
      put(send, t("Send"));
    }
  });
  addEventListener("message", (e) => {
    if (
      e.source === parent &&
      e.origin === location.origin &&
      e.data?.type === `${id}:update`
    )
      render(e.data.payload);
  });
  try {
    const v = JSON.parse(window.name);
    if (v?.type === `${id}:update`) render(v.payload);
  } catch {}
})();
