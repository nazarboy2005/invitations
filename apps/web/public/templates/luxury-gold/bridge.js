(() => {
  "use strict";
  const id = "luxury-gold",
    root = document.querySelector('[data-chorlove-template="luxury-gold"]');
  if (!root) return;
  const sections = [...root.querySelectorAll("section")];
  let payload = null,
    timer = 0,
    motionStarted = false,
    motionObserver = null,
    galleryObserver = null,
    scrollRoot = null,
    reducedMotion = false;
  const q = (s, b = root) => b.querySelector(s),
    all = (s, b = root) => [...b.querySelectorAll(s)],
    put = (n, v) => {
      if (n) n.textContent = v == null ? "" : String(v);
    },
    hide = (n, v = true) => {
      if (n) n.hidden = !!v;
    },
    d = () => payload?.data || {};
  const text = {
    "uz-Latn": {
      names: "Kelin & Kuyov",
      invite: "Sizni to'yimizga taklif qilamiz",
      venue: "Manzil",
      map: "Xaritada ochish",
      calendar: "Kalendar",
      gift: "To'yona",
      gallery: "Galereya",
      dress: "Kiyim uslubi",
      wishes: "Tilaklar",
      guest: "Ismingiz",
      wish: "Ezgu tilagingiz",
      send: "Yuborish",
      rsvp: "Kelasizmi?",
      yes: "Kelaman",
      no: "Kela olmayman",
      phone: "Telefon",
      telegram: "Telegram",
      copied: "Nusxalandi",
      error: "Yuborilmadi. Qayta urinib ko'ring.",
      submitted: "Tilagingiz yuborildi.",
      saved: "Javobingiz saqlandi.",
      preview: "Ko'rish rejimida yuborish o'chiq.",
      nameRequired: "Ismingizni kiriting.",
      wishRequired: "Tilagingizni yozing.",
      days: "Kun",
      hours: "Soat",
      minutes: "Daqiqa",
      seconds: "Soniya",
    },
    "uz-Cyrl": {
      names: "Келин & Куёв",
      invite: "Сизни тўйимизга таклиф қиламиз",
      venue: "Манзил",
      map: "Харитада очиш",
      calendar: "Тақвим",
      gift: "Тўёна",
      gallery: "Галерея",
      dress: "Кийиниш услуби",
      wishes: "Тилаклар",
      guest: "Исмингиз",
      wish: "Эзгу тилагингиз",
      send: "Юбориш",
      rsvp: "Келасизми?",
      yes: "Келаман",
      no: "Кела олмайман",
      phone: "Телефон",
      telegram: "Telegram",
      copied: "Нусхаланди",
      error: "Юборилмади. Қайта уриниб кўринг.",
      submitted: "Тилагингиз юборилди.",
      saved: "Жавобингиз сақланди.",
      preview: "Кўриш режимида юбориш ўчиқ.",
      nameRequired: "Исмингизни киритинг.",
      wishRequired: "Тилагингизни ёзинг.",
      days: "Кун",
      hours: "Соат",
      minutes: "Дақиқа",
      seconds: "Сония",
    },
    en: {
      names: "The couple",
      invite: "We invite you to celebrate our wedding",
      venue: "Venue",
      map: "View map",
      calendar: "Add to calendar",
      gift: "Wedding gift",
      gallery: "Gallery",
      dress: "Dress code",
      wishes: "Wishes",
      guest: "Your name",
      wish: "Your kind wish",
      send: "Send",
      rsvp: "Will you attend?",
      yes: "I'll attend",
      no: "Can't attend",
      phone: "Phone",
      telegram: "Telegram",
      copied: "Copied",
      error: "Could not submit. Please try again.",
      submitted: "Your wish was sent.",
      saved: "Your response was saved.",
      preview: "Submission is disabled in preview.",
      nameRequired: "Enter your name.",
      wishRequired: "Write your wish.",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
    ru: {
      names: "Молодожёны",
      invite: "Приглашаем вас на нашу свадьбу",
      venue: "Место проведения",
      map: "Открыть карту",
      calendar: "Добавить в календарь",
      gift: "Подарок",
      gallery: "Галерея",
      dress: "Дресс-код",
      wishes: "Пожелания",
      guest: "Ваше имя",
      wish: "Ваше пожелание",
      send: "Отправить",
      rsvp: "Вы придёте?",
      yes: "Буду",
      no: "Не смогу",
      phone: "Телефон",
      telegram: "Telegram",
      copied: "Скопировано",
      error: "Не удалось отправить. Попробуйте ещё раз.",
      submitted: "Пожелание отправлено.",
      saved: "Ответ сохранён.",
      preview: "Отправка в режиме просмотра отключена.",
      nameRequired: "Введите имя.",
      wishRequired: "Напишите пожелание.",
      days: "Дней",
      hours: "Часов",
      minutes: "Минут",
      seconds: "Секунд",
    },
  };
  const c = () => text[payload?.locale] || text["uz-Latn"],
    dateFormat = (v, long = false) => {
      if (!v) return "";
      try {
        return new Intl.DateTimeFormat(
          { "uz-Latn": "uz-UZ", "uz-Cyrl": "uz-UZ", en: "en-US", ru: "ru-RU" }[
            payload.locale
          ],
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            ...(long ? { hour: "2-digit", minute: "2-digit" } : {}),
          },
        ).format(new Date(v));
      } catch {
        return "";
      }
    };
  function render(p) {
    payload = p;
    root.hidden = false;
    root.lang =
      { "uz-Latn": "uz", "uz-Cyrl": "uz", en: "en", ru: "ru" }[p.locale] ||
      "uz";
    const x = d(),
      sections = [...root.querySelectorAll("section")],
      groom = x.groom || "",
      bride = x.bride || "",
      when = x.dateTime || x.date?.dateTime || "",
      venue = x.venue || {};
    const a = sections[1];
    put(q("p", a), c().names);
    const hs = all("h1", a);
    put(hs[0], groom);
    put(hs[1], bride);
    const openingNames = q('[class*="z-50"] h2');
    const ampersand = openingNames?.querySelector("span");
    if (openingNames && ampersand) {
      openingNames.replaceChildren(
        document.createTextNode(groom),
        document.createTextNode(" "),
        ampersand,
        document.createTextNode(" "),
        document.createTextNode(bride),
      );
    }
    put(q("p", sections[2]), x.message || x.greeting || c().invite);
    put(q("h2", sections[4]), dateFormat(when));
    const countdown = sections[5],
      timeNode = q("p", countdown);
    const update = () => {
      if (!when) {
        hide(countdown, true);
        return;
      }
      const left = Math.max(0, Date.parse(when) - Date.now());
      put(
        timeNode,
        `${Math.floor(left / 86400000)} ${c().days} · ${Math.floor(left / 3600000) % 24} ${c().hours} · ${Math.floor(left / 60000) % 60} ${c().minutes}`,
      );
      hide(countdown, false);
    };
    clearInterval(timer);
    update();
    timer = setInterval(update, 60000);
    const v = sections[6];
    put(q("h2", v), venue.name || c().venue);
    const vp = all("p", v);
    if (vp[0]) put(vp[0], venue.address || "");
    const map = q("a", v);
    const mapUrl =
      venue.mapUrl ||
      (venue.latitude && venue.longitude
        ? `https://maps.google.com/?q=${venue.latitude},${venue.longitude}`
        : "");
    if (map) {
      map.href = mapUrl || "#";
      map.target = "_blank";
      put(map, c().map);
      hide(map, !mapUrl);
    }
    const gift = x.toyona || {},
      gs = sections[7];
    put(q("h2", gs), c().gift);
    const gps = all("p", gs);
    put(gps[0], gift.note || c().gift);
    put(gps[2], gift.cardNumber || "");
    put(gps[4], gift.cardHolder || "");
    hide(gs, !gift.enabled);
    const copy = q("button", gs);
    if (copy) {
      copy.onclick = async () => {
        try {
          await navigator.clipboard.writeText(gift.cardNumber || "");
          put(copy, c().copied);
        } catch {}
      };
    }
    renderGallery(sections[8], x.gallery || []);
    const dc = x.dressCode || {},
      ds = sections[9];
    put(q("h2", ds), c().dress);
    put(q("p", ds), dc.note || dc.description || "");
    const swatches = all("[style*='background']", ds);
    swatches.forEach((s, i) => {
      const color = dc.colors?.[i];
      if (color) s.style.backgroundColor = color;
      else hide(s);
    });
    renderWishes(sections[10], p);
    renderRsvp(sections[11], p);
    renderContacts(sections[12], x.contacts || []);
    renderFooter(sections[13], x);
    renderLocales(p);
    renderMusic(p);
    reducedMotion =
      !!p.reducedMotion ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion)
      root.classList.add("lg-reduced");
    else root.classList.remove("lg-reduced");
    if (!motionStarted) startSourceMotion();
    else revealVisibleUpdates();
  }
  function renderGallery(s, items) {
    put(q("h2", s), c().gallery);
    let grid = q(".grid", s);
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "grid grid-cols-2 gap-4";
      s.append(grid);
    }
    grid.replaceChildren();
    for (const [index, item] of items.entries()) {
      if (!item.src) continue;
      const card = document.createElement("button");
      card.type = "button";
      card.className = `group block cursor-zoom-in border border-[#C9A646]/35 p-1 ${index % 3 === 0 ? "col-span-2" : ""}`;
      card.dataset.lgGalleryIndex = String(index);
      card.setAttribute("aria-label", `${c().gallery} ${index + 1}`);
      card.style.cssText = "opacity:0;filter:blur(6px);transform:translateY(30px)";
      const frame = document.createElement("span");
      frame.className = "block overflow-hidden";
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || item.caption || c().gallery;
      img.loading = "lazy";
      img.className = `w-full object-cover grayscale-[35%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0 ${index % 3 === 0 ? "aspect-[16/10]" : "aspect-[3/4]"}`;
      frame.append(img);
      card.append(frame);
      card.addEventListener("click", () => openGallery(items, index));
      grid.append(card);
    }
    hide(s, !items.some((i) => i.src));
  }
  async function renderWishes(s, p) {
    const form = q("form", s);
    if (!form) return;
    const input = q("input", form),
      area = q("textarea", form),
      button = q("button[type=submit]", form);
    if (input) input.placeholder = c().guest;
    if (area) area.placeholder = c().wish;
    put(q("h2", s), c().wishes);
    const list = q("ul", s);
    if (list) {
      list.replaceChildren();
      const values = p.preview
        ? d().wishes || []
        : await fetch(
            `/api/public/invitations/${encodeURIComponent(p.invitationId || "")}/wishes`,
            { cache: "no-store" },
          )
            .then((r) => (r.ok ? r.json() : {}))
            .then((r) => r.wishes || [])
            .catch(() => []);
      for (const w of values) {
        const li = document.createElement("li"),
          n = document.createElement("p"),
          m = document.createElement("p");
        li.className = "border-l-2 border-[#C9A646]/60 bg-white/[0.03] px-4 py-3 text-left";
        li.style.cssText = "opacity:0;transform:translateY(16px)";
        put(n, w.name);
        put(m, w.message || w.text);
        li.append(n, m);
        list.append(li);
      }
      if (motionStarted && s.dataset.lgMotionSeen === "true") {
        revealSection(s, sections.indexOf(s), 0);
      }
    }
    let status = q("[data-lg-status]", form);
    if (!status) {
      status = document.createElement("p");
      status.dataset.lgStatus = "";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      form.append(status);
    }
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (p.preview) {
        put(status, c().preview);
        return;
      }
      const name = input?.value.trim(),
        message = area?.value.trim();
      if (!name) {
        put(status, c().nameRequired);
        input?.focus();
        return;
      }
      if (!message) {
        put(status, c().wishRequired);
        area?.focus();
        return;
      }
      if (button) button.disabled = true;
      try {
        const r = await fetch(
          `/api/public/invitations/${encodeURIComponent(p.invitationId || "")}/wishes`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              message,
              guestToken: p.guestToken || undefined,
            }),
          },
        );
        if (!r.ok) throw Error();
        put(status, c().submitted);
        form.reset();
      } catch {
        put(status, c().error);
      } finally {
        if (button) button.disabled = false;
      }
    };
  }
  function renderRsvp(s, p) {
    const form = q("form", s);
    if (!form) return;
    put(q("h2", s), c().rsvp);
    const input = q("input", form),
      choices = all('[role="radio"]', form),
      submit = q("button[type=submit]", form);
    if (input) {
      input.value = p.guestName || "";
      input.placeholder = c().guest;
    }
    let answer = -1;
    choices.forEach((b, i) => {
      put(b.querySelector("span:last-child") || b, i ? c().no : c().yes);
      b.setAttribute("aria-checked", "false");
      b.onclick = () => {
        answer = i;
        choices.forEach((x, j) =>
          x.setAttribute("aria-checked", String(j === i)),
        );
      };
    });
    let status = q("[data-lg-status]", form);
    if (!status) {
      status = document.createElement("p");
      status.dataset.lgStatus = "";
      status.setAttribute("role", "status");
      form.append(status);
    }
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (p.preview) {
        put(status, c().preview);
        return;
      }
      if (!input?.value.trim()) {
        put(status, c().nameRequired);
        input?.focus();
        return;
      }
      if (answer < 0) {
        put(status, c().rsvp);
        return;
      }
      if (submit) submit.disabled = true;
      try {
        const r = await fetch(
          `/api/public/invitations/${encodeURIComponent(p.invitationId || "")}/rsvp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: input.value.trim(),
              status: answer === 0 ? "yes" : "no",
              partySize: answer === 0 ? 1 : 0,
              guestToken: p.guestToken || undefined,
            }),
          },
        );
        if (!r.ok) throw Error();
        put(status, c().saved);
      } catch {
        put(status, c().error);
      } finally {
        if (submit) submit.disabled = false;
      }
    };
  }
  function renderContacts(s, values) {
    put(q("h2", s), c().names);
    const supported = values.filter((v) => ["phone", "telegram", "instagram"].includes(v.type));
    const list = q("ul", s);
    if (!list) return;
    const sourceRows = all("li", list);
    const rowFor = (type, used) => sourceRows.find((li) => !used.has(li) && li.textContent.toLowerCase().includes(type === "phone" ? "telefon" : type));
    const rowForItem = (item, index, used) => rowFor(item.type, used) || sourceRows.find((li) => !used.has(li)) || sourceRows[0]?.cloneNode(true);
    const used = new Set();
    for (const [index, item] of supported.entries()) {
      const row = rowForItem(item, index, used);
      if (!row) continue;
      if (!row.isConnected) list.append(row);
      used.add(row);
      const link = q("a", row);
      if (!link) continue;
      const kind = item.type === "phone" ? c().phone : item.type === "instagram" ? "Instagram" : c().telegram;
      link.href = item.href || (item.type === "phone" ? `tel:${item.value || ""}` : "#");
      link.target = item.type === "phone" ? "_self" : "_blank";
      link.rel = item.type === "phone" ? "" : "noopener noreferrer";
      const labels = all("span", link);
      put(labels[0], kind);
      put(labels[1], item.value || item.label || "");
      hide(row, false);
      row.style.opacity = "0";
      row.style.transform = "translateY(24px)";
    }
    sourceRows.forEach((row) => { if (!used.has(row)) hide(row, true); });
    hide(s, supported.length === 0);
  }
  function renderFooter(s, x) {
    const ps = all("p", s);
    put(ps[0], x.greeting || "");
    put(ps[1], [x.groom, x.bride].filter(Boolean).join(" & "));
    put(ps[2], x.date?.short || dateFormat(x.dateTime));
    put(ps[4], x.hosts || "");
    const brand = q("a[href*='chorlove']", s);
    hide(brand, true);
  }
  function renderLocales(p) {
    let nav = q("[data-lg-languages]");
    if (!nav) {
      nav = document.createElement("nav");
      nav.dataset.lgLanguages = "";
      nav.className = "lg-languages";
      root.prepend(nav);
    }
    nav.style.display=(p.enabledLocales||[]).length>1?"":"none";nav.replaceChildren(
      ...(p.enabledLocales || ["uz-Latn", "uz-Cyrl", "en", "ru"]).map(
        (locale) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = {
            "uz-Latn": "Uz",
            "uz-Cyrl": "Уз",
            en: "En",
            ru: "Ru",
          }[locale];
          b.setAttribute("aria-pressed", String(locale === p.locale));
          b.onclick = () =>
            parent.postMessage(
              { type: `${id}:language`, locale },
              location.origin,
            );
          return b;
        },
      ),
    );
  }
  function renderMusic(p) {
    let a = q("audio");
    if (!a) {
      a = document.createElement("audio");
      root.append(a);
    }
    a.pause();
    a.loop = true;
    a.preload = "none";
    const url = p.data?.music?.enabled ? p.data.music.url : "";
    if (url) a.src = url;
    else a.removeAttribute("src");
    a.muted = !!(p.preview && p.silentPlayback);
    let b = q('[aria-label="Toggle music"]');
    if (!b) {
      b = document.createElement("button");
      b.type = "button";
      b.className = "fixed bottom-8 right-8 z-[110] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center bg-white/90 border border-[#E5E0D8] text-[#A69689] backdrop-blur-md";
      root.append(b);
    }
    b.dataset.lgMusic = "";
    const syncMusicButton = () => {
      const playing = !a.paused;
      b.innerHTML = playing
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 18V5l11-2v13"/><circle cx="7" cy="18" r="3"/><circle cx="19" cy="16" r="3"/><path d="m3 3 18 18"/></svg>';
      b.setAttribute("aria-pressed", String(playing));
      b.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    };
    ["play", "pause", "ended", "error"].forEach(event => a.addEventListener(event, syncMusicButton));
    hide(b, !url || !!(p.preview && p.silentPlayback));
    syncMusicButton();
    b.onclick = () => (a.paused ? a.play().catch(() => {}) : a.pause());
    b.onpointerenter = () => applyPressScale(b, 1.1);
    b.onpointerleave = () => applyPressScale(b, 1);
    b.onpointerdown = () => applyPressScale(b, 0.9);
    b.onpointerup = () => applyPressScale(b, 1.1);
  }
  function applyPressScale(node, scale) {
    if (!node || reducedMotion) return;
    node._lgPressAnimation?.cancel();
    node._lgPressAnimation = node.animate(
      [{ transform: `scale(${scale})` }],
      { duration: 120, fill: "both", easing: "ease-out" },
    );
  }
  function startSourceMotion() {
    motionStarted = true;
    scrollRoot = all("div").find(
      (node) =>
        typeof node.className === "string" &&
        node.className.includes("snap-y") &&
        node.className.includes("overflow-y-auto"),
    );
    const opening = q('[class*="z-50"]');
    if (reducedMotion) {
      if (opening) opening.hidden = true;
      sections.forEach((section, index) => revealSection(section, index, 0));
      paintSparkleCanvas(true);
      return;
    }
    playOpening(opening);
    revealSection(sections[0], 0, 3250);
    sections.slice(1).forEach((section) => {
      const image = all('[style*="scale(1.16)"]', section)[0];
      if (image) section.dataset.lgHeroZoom = "pending";
    });
    if ("IntersectionObserver" in window) {
      motionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
              const index = sections.indexOf(entry.target);
              if (index >= 0) revealSection(entry.target, index, 0);
            }
          }
        },
        { root: scrollRoot || null, threshold: [0.35] },
      );
      sections.slice(1).forEach((section) => motionObserver.observe(section));
      galleryObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
              const index = Number(entry.target.dataset.lgGalleryIndex);
              revealElement(entry.target, {
                duration: 800,
                delay: (index % 3) * 100,
                easing: "ease-out",
              });
              galleryObserver.unobserve(entry.target);
            }
          }
        },
        { root: scrollRoot || null, threshold: [0.35] },
      );
      all("button.cursor-zoom-in").forEach((card) => galleryObserver.observe(card));
    } else {
      sections.slice(1).forEach((section, index) => revealSection(section, index + 1, 0));
    }
    startSourceLoops();
    paintSparkleCanvas(false);
  }
  function playOpening(opening) {
    if (!opening) return;
    const [left, right, title] = opening.children;
    animateNode(opening, [{ opacity: 1 }, { opacity: 0 }], {
      duration: 750,
      delay: 2450,
      easing: "ease-in-out",
    });
    animateNode(left, [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], {
      duration: 1050,
      delay: 1550,
      easing: "cubic-bezier(.83,0,.17,1)",
    });
    animateNode(right, [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], {
      duration: 1050,
      delay: 1700,
      easing: "cubic-bezier(.83,0,.17,1)",
    });
    animateNode(
      title,
      [
        { opacity: 0, transform: "translateY(24px) scale(.82)" },
        { opacity: 1, transform: "translateY(0) scale(1)", offset: 0.34 },
        { opacity: 1, transform: "translateY(0) scale(1)", offset: 0.67 },
        { opacity: 0, transform: "translateY(-20px) scale(1.08)" },
      ],
      { duration: 2250, easing: "ease-out" },
    );
    window.setTimeout(() => {
      if (opening.isConnected) opening.hidden = true;
    }, 3200);
  }
  function animateNode(node, keyframes, options) {
    if (!node || reducedMotion || typeof node.animate !== "function") return null;
    return node.animate(keyframes, { fill: "both", ...options });
  }
  function sourceSpringScaleFrames(from, to, stiffness, damping, steps = 24) {
    const mass = 1;
    const omega0 = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const alpha = zeta / Math.sqrt(1 - zeta * zeta);
    return Array.from({ length: steps + 1 }, (_, index) => {
      const offset = index / steps;
      const time = offset * 0.4;
      const decay = Math.exp(-zeta * omega0 * time);
      const response = 1 - decay * (Math.cos(omegaD * time) + alpha * Math.sin(omegaD * time));
      const scale = index === steps ? to : from + (to - from) * response;
      return { transform: `scale(${scale})`, offset };
    });
  }
  function revealSection(section, sectionIndex, initialDelay = 0) {
    if (!section || section.hidden) return;
    section.dataset.lgMotionSeen = "true";
    const corners = all("[style*='opacity:0']", section).filter((node) =>
      typeof node.className === "string" &&
      node.className.includes("w-24") &&
      node.className.includes("pointer-events-none"),
    );
    corners.forEach((corner) =>
      revealElement(corner, { duration: 800, opacity: 0.85, easing: "ease-out" }),
    );

    const candidates = all("[style*='opacity']", section).filter(
      (node) =>
        !corners.includes(node) &&
        !(sectionIndex === 8 && node.matches("button.cursor-zoom-in") && !reducedMotion && "IntersectionObserver" in window) &&
        getComputedStyle(node).opacity === "0" &&
        !node.className?.toString().includes("bottom-10") &&
        !node.closest("[hidden]") &&
        !node.dataset.lgMotionReady,
    );
    for (const [index, node] of candidates.entries()) {
      const inline = node.getAttribute("style") || "";
      const isGalleryItem = node.matches("button.cursor-zoom-in");
      const isWish = node.tagName === "LI" && sectionIndex === 10;
      const isContact = node.tagName === "LI" && sectionIndex === 12;
      const isPalette = node.tagName === "SPAN" && sectionIndex === 9;
      const galleryIndex = Number(node.dataset.lgGalleryIndex);
      const isGiftCard = inline.includes("rotateX(18deg)");
      const isScaleVariant = inline.includes("scale(0.92)");
      let duration = isScaleVariant ? 1000 : 900;
      let delay = initialDelay ? initialDelay + index * 130 : 120 + index * 130;
      let easing = "ease-out";
      if (sectionIndex === 8 && isGalleryItem) {
        duration = 800;
        delay = (galleryIndex % 3) * 100;
      } else if (isWish) {
        duration = 600;
        delay = 0;
      } else if (isContact) {
        duration = 700;
        delay = index * 120;
      } else if (isPalette) {
        duration = 550;
        delay = index * 90;
      } else if (isGiftCard) {
        duration = 1000;
        delay = 0;
        easing = "cubic-bezier(.22,1,.36,1)";
      }
      revealElement(node, { duration, delay, easing });
    }

    if (sectionIndex === 3) {
      const image = all('[style*="scale(1.16)"]', section)[0];
      if (image && !image.dataset.lgMotionReady) {
        image.dataset.lgMotionReady = "true";
        animateNode(image, [{ transform: "scale(1.16)" }, { transform: "scale(1)" }], {
          duration: 10000,
          easing: "ease-out",
        });
      }
    }
    if (sectionIndex === 4) {
      const selectedDay = all('[style*="scale(0)"]', section).find(
        (node) => !node.matches("[style*='opacity:0']"),
      );
      if (selectedDay && !selectedDay.dataset.lgMotionReady) {
        selectedDay.dataset.lgMotionReady = "true";
        animateNode(selectedDay, sourceSpringScaleFrames(0, 1, 220, 15), {
          duration: 400,
          easing: "linear",
        });
      }
    }
    if (sectionIndex === 0) {
      const scrollHint = all("[class*='bottom-10']", section).find((node) =>
        node.getAttribute("style")?.includes("opacity:0"),
      );
      if (scrollHint && !scrollHint.dataset.lgMotionReady) {
        scrollHint.dataset.lgMotionReady = "true";
        animateNode(scrollHint, [{ opacity: 0 }, { opacity: 1 }], {
          duration: 300,
          delay: 3450,
          easing: "ease-out",
        });
        animateNode(
          scrollHint,
          [
            { transform: "translateY(0px)" },
            { transform: "translateY(8px)" },
            { transform: "translateY(0px)" },
          ],
          { duration: 1800, iterations: Infinity, easing: "ease-in-out" },
        );
      }
    }
  }
  function revealElement(node, { duration, delay = 0, opacity = 1, easing = "ease-out" }) {
    if (!node || node.dataset.lgMotionReady) return;
    node.dataset.lgMotionReady = "true";
    const style = node.style;
    const originalTransform = style.transform || getComputedStyle(node).transform;
    const originalFilter = style.filter || getComputedStyle(node).filter;
    const finalTransform = (style.transform || "")
      .replace(/translateY\([^)]*\)/g, "translateY(0px)")
      .replace(/scale\((?:0|0\.6|0\.7|0\.92)\)/g, "scale(1)")
      .replace(/rotateX\([^)]*\)/g, "rotateX(0deg)");
    if (reducedMotion || typeof node.animate !== "function") {
      style.opacity = String(opacity);
      if (style.transform) style.transform = finalTransform;
      if (style.filter) style.filter = "blur(0px)";
      return;
    }
    const frames = [
      {
        opacity: style.opacity || getComputedStyle(node).opacity,
        transform: originalTransform === "none" ? "none" : originalTransform,
        filter: originalFilter === "none" ? "blur(0px)" : originalFilter,
      },
      {
        opacity,
        transform: finalTransform || "none",
        filter: style.filter ? "blur(0px)" : originalFilter,
      },
    ];
    const animation = animateNode(node, frames, { duration, delay, easing });
    if (animation) {
      animation.onfinish = () => {
        if (!node.isConnected) return;
        node.style.opacity = String(opacity);
        if (style.transform) node.style.transform = finalTransform;
        if (style.filter) node.style.filter = "blur(0px)";
        animation.cancel();
      };
    }
  }
  function revealVisibleUpdates() {
    sections.forEach((section, index) => {
      if (section.dataset.lgMotionSeen === "true") revealSection(section, index, 0);
    });
  }
  function startSourceLoops() {
    if (reducedMotion) return;
    const dividerSheens = all("div").filter(
      (node) =>
        typeof node.className === "string" &&
        node.className.includes("via-[#FDE08B]") &&
        !node.className.includes("/15") &&
        !node.className.includes("-skew-x-12"),
    );
    dividerSheens.forEach((node, index) => {
      const delay = sections[0]?.contains(node) ? (index === 0 ? 200 : 600) : 0;
      animateNode(node, [{ transform: "translateX(-110%)" }, { transform: "translateX(110%)" }], {
        duration: 2800,
        delay,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      });
    });
    const cardSheen = all("div").find(
      (node) => typeof node.className === "string" && node.className.includes("-skew-x-12"),
    );
    animateNode(cardSheen, [
      { translate: "-120% 0", offset: 0, easing: "ease-in-out" },
      { translate: "220% 0", offset: 0.6 },
      { translate: "220% 0", offset: 1 },
    ], {
      duration: 6000,
      iterations: Infinity,
      delay: 0,
      easing: "linear",
    });
    const introStar = all("span").find(
      (node) => node.textContent.trim() === "✦" && node.className.includes("mt-5"),
    );
    animateNode(introStar, [{ rotate: "0deg" }, { rotate: "360deg" }], {
      duration: 8000,
      iterations: Infinity,
      easing: "linear",
    });
    const introOrnament = all("div").find(
      (node) => node.textContent.trim() === "❧" && node.className.includes("text-3xl"),
    );
    if (introOrnament) {
      animateNode(
        introOrnament,
        [
          { scale: 1, opacity: 0.7 },
          { scale: 1.08, opacity: 1 },
          { scale: 1, opacity: 0.7 },
        ],
        { duration: 3500, iterations: Infinity, easing: "ease-in-out" },
      );
    }
    const heart = all("div").find(
      (node) => node.textContent.trim() === "❤" && node.className.includes("text-3xl"),
    );
    if (heart) {
      animateNode(
        heart,
        [
          { scale: 1, opacity: 0.35 },
          { scale: 1.2, opacity: 0.72 },
          { scale: 1, opacity: 0.35 },
        ],
        { duration: 4000, iterations: Infinity, easing: "ease-in-out" },
      );
    }
    const copyButton = sections[7]?.querySelector("button");
    if (copyButton) {
      copyButton.onpointerdown = () => applyPressScale(copyButton, 0.95);
      copyButton.onpointerup = () => applyPressScale(copyButton, 1);
    }
    const mapLink = sections[6]?.querySelector("a");
    if (mapLink) {
      mapLink.onpointerenter = () => applyPressScale(mapLink, 1.02);
      mapLink.onpointerleave = () => applyPressScale(mapLink, 1);
      mapLink.onpointerdown = () => applyPressScale(mapLink, 0.98);
      mapLink.onpointerup = () => applyPressScale(mapLink, 1.02);
    }
  }
  function paintSparkleCanvas(staticOnly) {
    const canvas = q("canvas");
    const container = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !container || !context) return;
    let particles = [];
    let frame = 0;
    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      const count = Math.max(80, Math.floor((canvas.width * canvas.height) / 2600));
      particles = Array.from({ length: count }, (_, index) => makeSparkle(canvas.width || 800, canvas.height || 600, index, true));
    };
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, index) => {
        particle.y += particle.speedY;
        particle.x += particle.speedX;
        particle.pulse += particle.pulseSpeed;
        if (particle.y < -20) Object.assign(particle, makeSparkle(canvas.width || 800, canvas.height || 600, index));
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        const alpha = particle.opacity * (0.5 + 0.35 * Math.sin(particle.pulse));
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(212, 175, 55, ${alpha})`;
        context.fill();
      });
      if (!staticOnly) frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    if (!staticOnly && "ResizeObserver" in window) {
      const observer = new ResizeObserver(() => { resize(); });
      observer.observe(container);
      window.addEventListener("pagehide", () => { observer.disconnect(); cancelAnimationFrame(frame); }, { once: true });
    } else if (!staticOnly) {
      const onResize = () => resize();
      window.addEventListener("resize", onResize);
      window.addEventListener("pagehide", () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(frame); }, { once: true });
    }
  }
  function makeSparkle(width, height, index, initial = false) {
    const r = ((37 * index) % 100) / 100;
    const i = ((61 * index) % 100) / 100;
    const n = ((19 * index) % 100) / 100;
    return {
      x: r * width,
      y: initial ? i * height : height + 18,
      size: 1 + 2.4 * n,
      speedY: -(0.12 + 0.48 * i),
      speedX: 0.42 * n - 0.21,
      opacity: 0.24 + 0.46 * r,
      pulse: i * Math.PI,
      pulseSpeed: 0.012 + 0.025 * n,
    };
  }
  function openGallery(items, initialIndex) {
    let index = initialIndex;
    let zoom = 1;
    let slideshow = 0;
    let pointerStart = null;
    const overlay = document.createElement("div");
    overlay.className = "lg-gallery-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", c().gallery);
    const image = document.createElement("img");
    const counter = document.createElement("div");
    counter.className = "lg-gallery-counter";
    const toolbar = document.createElement("div");
    toolbar.className = "lg-gallery-toolbar";
    const makeButton = (label, glyph, className = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.textContent = glyph;
      button.setAttribute("aria-label", label);
      button.title = label;
      return button;
    };
    const setIcon = (button, paths) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.setAttribute("fill", "currentColor");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      for (const d of paths) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        svg.append(path);
      }
      button.replaceChildren(svg);
    };
    const close = makeButton("Close", "×", "lg-gallery-close");
    const play = makeButton("Play", "▶");
    const zoomIn = makeButton("Zoom in", "⌕+");
    const zoomOut = makeButton("Zoom out", "⌕−");
    const previous = makeButton("Previous", "‹", "lg-gallery-previous");
    const next = makeButton("Next", "›", "lg-gallery-next");
    setIcon(close, ["M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"]);
    setIcon(play, ["M8 5v14l11-7z"]);
    setIcon(zoomIn, ["M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z", "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"]);
    setIcon(zoomOut, ["M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"]);
    setIcon(previous, ["M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"]);
    setIcon(next, ["M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"]);
    const thumbnails = document.createElement("div");
    thumbnails.className = "lg-gallery-thumbnails";
    const thumbnailButtons = items.map((item, itemIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `${itemIndex + 1} of ${items.length}`);
      button.title = `${itemIndex + 1} of ${items.length}`;
      const thumbnail = document.createElement("img");
      thumbnail.src = item.src;
      thumbnail.alt = "";
      button.append(thumbnail);
      button.onclick = () => { index = itemIndex; zoom = 1; show(); };
      thumbnails.append(button);
      return button;
    });
    const stopSlideshow = () => {
      window.clearInterval(slideshow);
      slideshow = 0;
      play.textContent = "▶";
      setIcon(play, ["M8 5v14l11-7z"]);
      play.setAttribute("aria-label", "Play");
      play.title = "Play";
    };
    const show = (direction = 0) => {
      const item = items[index];
      image.src = item.src;
      image.alt = item.alt || item.caption || c().gallery;
      image.style.transform = `scale(${zoom})`;
      counter.textContent = `${index + 1} / ${items.length}`;
      thumbnailButtons.forEach((button, itemIndex) => {
        button.setAttribute("aria-current", String(itemIndex === index));
      });
      thumbnailButtons[index]?.scrollIntoView({ block: "nearest", inline: "center" });
      zoomOut.disabled = zoom <= 1;
      zoomIn.disabled = zoom >= 4;
      if (direction) {
        const startX = direction > 0 ? 18 : -18;
        animateNode(image, [
          { opacity: 0.72, transform: `translateX(${startX}px) scale(${zoom})` },
          { opacity: 1, transform: `translateX(0) scale(${zoom})` },
        ], { duration: 250, easing: "ease-out" });
      }
    };
    const dismiss = () => {
      stopSlideshow();
      overlay.remove();
      document.removeEventListener("keydown", onKey);
    };
    const step = (offset) => {
      index = (index + offset + items.length) % items.length;
      zoom = 1;
      show(offset);
    };
    const onKey = (event) => {
      if (event.key === "Escape") dismiss();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    previous.onclick = () => step(-1);
    next.onclick = () => step(1);
    close.onclick = dismiss;
    play.onclick = () => {
      if (slideshow) {
        stopSlideshow();
      } else {
        play.textContent = "Ⅱ";
        setIcon(play, ["M6 5h4v14H6z", "M14 5h4v14h-4z"]);
        play.setAttribute("aria-label", "Pause");
        play.title = "Pause";
        slideshow = window.setInterval(() => step(1), 1500);
      }
    };
    zoomIn.onclick = () => { zoom = Math.min(4, zoom + 0.5); show(); };
    zoomOut.onclick = () => { zoom = Math.max(1, zoom - 0.5); show(); };
    image.addEventListener("pointerdown", (event) => { pointerStart = event.clientX; });
    image.addEventListener("pointerup", (event) => {
      if (pointerStart == null) return;
      const delta = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(delta) > 45) step(delta < 0 ? 1 : -1);
    });
    overlay.addEventListener("click", (event) => { if (event.target === overlay) dismiss(); });
    toolbar.append(play, zoomIn, zoomOut, close);
    overlay.append(counter, previous, image, next, thumbnails, toolbar);
    root.append(overlay);
    show();
    document.addEventListener("keydown", onKey);
    close.focus();
    animateNode(overlay, [{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
  }
  window.addEventListener("pagehide", () => {
    motionObserver?.disconnect();
    galleryObserver?.disconnect();
  }, { once: true });
  addEventListener("message", (e) => {
    if (
      e.source === parent &&
      e.origin === location.origin &&
      e.data?.type === `${id}:update`
    )
      render(e.data.payload);
  });
  try {
    const initial = JSON.parse(window.name);
    if (initial?.type === `${id}:update`) render(initial.payload);
  } catch {}
})();
