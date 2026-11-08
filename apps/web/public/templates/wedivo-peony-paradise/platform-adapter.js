/* Platform data/services are separate from the captured design and motion engine. */
(() => {
  "use strict";
  let started = false;
  const $ = (id) => document.getElementById(id);
  const text = (id, value) => {
    if ($(id)) $(id).textContent = value || "";
  };
  const visible = (id, on) => {
    if ($(id)) $(id).hidden = !on;
  };
  const make = (tag, value, className) => {
    const el = document.createElement(tag);
    if (value) el.textContent = value;
    if (className) el.className = className;
    return el;
  };
  function section(name, on) {
    visible("sec-" + name, on);
    const nav = document.querySelector(`[data-nav-target="${name}"]`);
    if (nav) nav.hidden = !on;
  }
  function status(message) {
    let el = $("platform-status");
    if (!el) {
      el = make("p");
      el.id = "platform-status";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.append(el);
    }
    el.hidden = false;
    el.textContent = message;
    clearTimeout(status.timer);
    status.timer = setTimeout(() => {
      el.hidden = true;
    }, 6000);
  }
  function photo(id, item) {
    const el = $(id);
    if (item?.src) {
      el.src = item.src;
      el.alt = item.alt;
    } else el.removeAttribute("src");
  }
  function labels(ui, data) {
    const bindings = {
      "cv-open-t": "open",
      "cv-hint": "tap",
      "cv-note": "coverNote",
      "cv-guest-label": "guest",
      "cv-guest-generic": "guest",
      "hr-cta-t": "first",
      "hr-scroll-t": "slow",
      "gr-kicker-t": "greeting",
      "gr-title": "first",
      "gr-script": "before",
      "gr-bloom-hint": "gullar-bayrami",
      "cp-kicker-t": "couple",
      "cp-title": "couple",
      "cp-script": "coupleSub",
      "cp-hint": "coupleHint",
      "st-kicker-t": "story",
      "st-title": "story",
      "st-script": "storySub",
      "st-lead": "storyLead",
      "cd-kicker-t": "countdown",
      "cd-title": "countdown",
      "cd-script": "countdownSub",
      "cd-done": "today",
      "cd-gcal-t": "calendar",
      "cd-ics-t": "download",
      "ev-kicker-t": "events",
      "ev-title": "events",
      "ev-script": "eventSub",
      "ev-map-1-t": "map",
      "ev-map-2-t": "map",
      "rd-kicker-t": "program",
      "rd-title": "program",
      "rd-script": "programSub",
      "vn-kicker-t": "venue",
      "vn-title": "venue",
      "vn-script": "venueSub",
      "vn-label": "venue",
      "vn-go-t": "map",
      "vn-copy-t": "copy",
      "dc-kicker-t": "dress",
      "dc-title": "dress",
      "dc-script": "dressSub",
      "dc-pick": "dye",
      "gl-kicker-t": "gallery",
      "gl-title": "gallery",
      "gl-script": "gallerySub",
      "gl-note": "galleryNote",
      "gf-kicker-t": "gift",
      "gf-title": "gift",
      "gf-script": "giftSub",
      "gf-intro": "giftIntro",
      "gf-hint": "giftHint",
      "gf-form-title": "gift",
      "rs-kicker-t": "rsvp",
      "rs-title": "rsvp",
      "rs-script": "rsvpSub",
      "rs-intro": "rsvpIntro",
      "rs-caption": "emptyVase",
      "rs-form-title": "rsvp",
      "rs-name-l": "name",
      "rs-status-l": "attending",
      "rs-msg-l": "note",
      "rs-submit-t": "send",
      "rs-ok": "saved",
      "rs-err": "validation",
      "ws-kicker-t": "wishes",
      "ws-title": "wishes",
      "ws-script": "wishSub",
      "ws-intro": "wishIntro",
      "ws-form-title": "wish",
      "ws-name-l": "name",
      "ws-msg-l": "wish",
      "ws-submit-t": "send",
      "ws-more": "more",
      "ws-count-empty": "emptyWishes",
      "cl-kicker": "petals",
      "cl-thanks-generic": "thanks",
      "cl-replay-t": "replay",
      "nv-slowmo-t": "slow",
    };
    for (const [id, key] of Object.entries(bindings)) text(id, ui[key]);
    [
      "greeting",
      "couple",
      "story",
      "countdown",
      "events",
      "rundown",
      "venue",
      "dresscode",
      "gallery",
      "gift",
      "rsvp",
      "wishes",
      "closing",
      "hero",
    ].forEach((id) => {
      const key =
        {
          rundown: "program",
          dresscode: "dress",
          closing: "thanks",
          hero: "first",
        }[id] || id;
      text(`nv-${id}-span1`, ui[key]);
      const el = $("nv-" + id);
      if (el) el.setAttribute("aria-label", ui[key]);
    });
    ["d", "h", "m", "s"].forEach((id, i) =>
      text("cd-l-" + id, ui[["days", "hours", "minutes", "seconds"][i]]),
    );
    text("cd-center-l", ui.days);
    text("vn-map-veil-t", ui.map);
    for (const [id, key] of Object.entries({
      "cv-bloom": "open",
      "gr-bloom": "gullar-bayrami",
      "nv-music": "music",
      "nv-meter": "first",
      "lb-close": "close",
      "lb-prev": "previous",
      "lb-next": "next",
      "nv-slowmo": "slow",
      "sec-cover": "templateName",
      "sec-hero": "first",
      "cp-switch": "choosePerson",
      "gf-wrapbtn": "giftSub",
      "vd-play": "videoPlay",
      lb: "gallery",
    }))
      $(id)?.setAttribute("aria-label", ui[key]);
    for (let i = 1; i <= 4; i++)
      $("an-ant-" + i)?.setAttribute("aria-label", ui.meet + " " + i);
    text("rs-st-yes", ui.yes);
    text("rs-st-maybe", ui.maybe);
    text("rs-st-no", ui.no);
    ["rs-name", "ws-name"].forEach((id) => ($(id).placeholder = ui.name));
    $("rs-msg").placeholder = ui.note;
    $("ws-msg").placeholder = ui.wish;
    // Source suggestion chips remain useful but contain only localized generic wishes.
    [ui.thanks, ui.yesVase, ui.wishIntro].forEach((wish, i) => {
      text("ws-chip-" + (i + 1), wish);
      $("ws-chip-" + (i + 1)).dataset.text = wish;
    });
    text("cv-kicker", data.eventType);
    text("hr-kicker", data.eventType);
    text("hr-slowmo-t", ui.slow);
    text("nv-head-title", ui.petals.trim());
    text("nv-head-sub", ui.galleryNote);
    $("pp-nav").setAttribute("aria-label", ui.petals.trim());
  }
  function stories(data, ui) {
    const prototype = $("st-item-1").cloneNode(true);
    $("st-list").replaceChildren();
    data.story.forEach((chapter, index) => {
      const n = index + 1,
        item = prototype.cloneNode(true);
      [item, ...item.querySelectorAll("[id]")].forEach((el) => {
        el.id = el.id.replace(/-1(?=$|-)/, "-" + n);
      });
      item.dataset.itemId = chapter.id;
      $("st-list").append(item);
      text("st-title-" + n, chapter.title);
      text("st-text-" + n, chapter.text);
      text("st-stage-" + n, ui.phase + String(n).padStart(2, "0"));
      text("st-date-" + n, "");
      photo("st-img-" + n, data.gallery[index]);
    });
    section("story", data.story.length > 0);
  }
  function dress(data) {
    const template = $("dc-sw-1").cloneNode(true);
    $("dc-swatches").replaceChildren();
    data.dressCode.colors.forEach((color, i) => {
      const button = template.cloneNode(true);
      [button, ...button.querySelectorAll("[id]")].forEach((el) => {
        el.id = el.id.replace(/-1(?=$|-)/, "-" + (i + 1));
      });
      button.dataset.color = color.hex;
      button.dataset.itemId = color.id;
      button.querySelector(".dc-sw-name").textContent = color.name;
      $("dc-swatches").append(button);
    });
    text(
      "dc-text",
      [data.dressCode.style, data.dressCode.text, data.dressCode.note]
        .filter(Boolean)
        .join("\n"),
    );
    section("dresscode", data.dressCode.enabled);
  }
  function prepare(payload) {
    const d = payload.data,
      ui = window.peonyCopy(payload.locale);
    payload.ui = ui;
    document.documentElement.lang = payload.locale;
    document.documentElement.classList.toggle(
      "platform-reduced",
      payload.reducedMotion,
    );
    document.title = d.title || ui.templateName;
    labels(ui, d);
    ["cv", "hr", "cl"].forEach((prefix) => {
      text(prefix + "-name-1", d.bride);
      text(prefix + "-name-2", d.groom);
      text(prefix + "-amp", "&");
      visible(prefix + "-amp", Boolean(d.bride && d.groom));
    });
    text("cp-tab-b-t", d.bride);
    text("cp-tab-g-t", d.groom);
    text("cp-full-b", d.bride);
    text("cp-full-g", d.groom);
    text("cp-cap-b", d.bride);
    text("cp-cap-g", d.groom);
    section("couple", Boolean(d.bride || d.groom));
    text("hr-tagline", d.message);
    text("gr-salam", d.greeting);
    text("gr-text", d.message);
    text("gr-quote-text", ui.quote);
    text("gr-quote-src", ui.quoteSource);
    text("cl-msg", d.message);
    text("cl-fam", d.hosts);
    text("cv-guest-name", payload.guestName);
    text("cl-guest", payload.guestName);
    text(
      "cl-thanks-named",
      [ui.thanks, payload.guestName].filter(Boolean).join(", "),
    );
    // No shared fields for personal biographies or per-person parents.
    [
      "cp-order-b",
      "cp-order-g",
      "cp-parents-b",
      "cp-parents-g",
      "cp-variety-b",
      "cp-variety-g",
      "vn-note",
    ].forEach((id) => visible(id, false));
    const instagram = d.contacts.find((c) => c.type === "instagram");
    if (instagram) {
      $("cp-ig-b").href = instagram.href;
      text("cp-ig-b-t", instagram.value);
    }
    visible("cp-ig-b", Boolean(instagram));
    visible("cp-ig-g", false);
    photo("hr-photo", d.gallery[0]);
    photo("cp-img-b", d.gallery[1]);
    photo("cp-img-g", d.gallery[2]);
    stories(d, ui);
    dress(d);
    ["ants", "springs", "video"].forEach((name) => section(name, false));
    section("gallery", d.gallery.length > 0);
    section("rundown", d.program.length > 0);
    text("rd-title", d.programHeading || ui.program);
    const rd = make("script");
    rd.type = "application/json";
    rd.id = "wedivo-rundown-data";
    rd.textContent = JSON.stringify(
      d.program.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: payload.wallDate,
        startTime: item.time,
        endTime: "",
        isAllDay: false,
        location: d.venue.name,
        icon: "flower2",
      })),
    );
    document.body.append(rd);
    const dataset = $("pp-data").dataset;
    Object.assign(dataset, {
      date: payload.wallDate || "",
      time: d.date.time,
      tz: d.timezone,
      bride: d.bride,
      groom: d.groom,
      venue: d.venue.name,
      address: d.venue.address,
      place: "",
      mapkey: "",
      e1end: "",
      e2date: "",
      e2time: "",
      e2end: "",
      deadline: d.rsvp.deadline,
      live: "",
    });
    [1, 2].forEach((i) => {
      text("ev-name-" + i, i === 1 ? d.eventType : "");
      text("ev-venue-" + i, d.venue.name);
      text("ev-addr-" + i, d.venue.address);
      text("ev-note-" + i, "");
    });
    text("vn-name", d.venue.name);
    text("vn-addr", d.venue.address);
    section(
      "venue",
      Boolean(d.venue.name || d.venue.address || d.venue.mapUrl),
    );
    section("events", Boolean(d.dateTime));
    section("countdown", Boolean(d.dateTime));
    section("rsvp", d.rsvp.enabled);
    section("wishes", d.wishesEnabled);
    $("rs-name").value = payload.guestName;
    $("ws-name").value = payload.guestName;
    const audio = $("pp-audio");
    if (d.music.enabled && d.music.url) audio.src = d.music.url;
    else audio.removeAttribute("src");
    visible("nv-music", Boolean(d.music.enabled && d.music.url));
    $("ws-list").replaceChildren();
    $("ws-more").hidden = true;
    section("gift", d.toyona.enabled && Boolean(d.toyona.cardNumber));
    // Keep the source silk card and knot interaction. No simulated transfer form.
    const old = $("gf-form"),
      gift = make("div", null, old.className);
    gift.id = "gf-form";
    const h = make("p", ui.gift, "form-title"),
      details = make("div");
    details.id = "gift-card-details";
    const number = make("p", d.toyona.cardNumber);
    number.id = "gift-card-number";
    const holder = make("p", d.toyona.cardHolder),
      copy = make("button", ui.copy, "btn btn-ghost");
    copy.type = "button";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(d.toyona.cardNumber);
        status(ui.copied);
      } catch {
        status(ui.error);
      }
    });
    details.append(number, holder, copy);
    gift.append(h, details);
    old.replaceWith(gift);
    return ui;
  }
  function dateAndMaps(p, ui) {
    const d = p.data;
    text("cv-date", d.date.long);
    text("hr-day", String(d.date.day));
    text("hr-date-long", d.date.long);
    text(
      "hr-date-meta",
      [d.date.time, d.timezone, d.venue.name].filter(Boolean).join(" · "),
    );
    text("ev-date-1", d.date.long);
    text("ev-time-1", [d.date.time, d.timezone].join(" "));
    const map =
      d.venue.mapUrl ||
      (d.venue.name || d.venue.address
        ? "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(
            [d.venue.name, d.venue.address].filter(Boolean).join(", "),
          )
        : "");
    ["ev-map-1", "ev-map-2", "vn-go"].forEach((id) => {
      if (map) $(id).href = map;
      visible(id, Boolean(map));
    });
    visible(
      "vn-mapframe",
      Boolean(d.venue.lat !== null && d.venue.lng !== null),
    );
    if (d.venue.lat !== null && d.venue.lng !== null) {
      const frame = $("vn-map");
      frame.title = ui.map;
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer";
      frame.src =
        "https://maps.google.com/maps?q=" +
        encodeURIComponent(d.venue.lat + "," + d.venue.lng) +
        "&z=15&output=embed&hl=" +
        (p.locale.startsWith("uz") ? "uz" : p.locale);
      $("vn-map-veil").addEventListener("click", () =>
        $("vn-mapframe").classList.add("is-live"),
      );
    }
    $("vn-copy").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          [d.venue.name, d.venue.address].filter(Boolean).join(", "),
        );
        status(ui.copied);
      } catch {
        status(ui.error);
      }
    });
    visible("rs-deadline", Boolean(d.rsvp.deadline));
    if (d.rsvp.deadline)
      text(
        "rs-deadline",
        ui.deadline +
          new Intl.DateTimeFormat(
            p.locale === "uz-Cyrl" ? "uz-Cyrl-UZ" : p.locale,
            { dateStyle: "long", timeZone: "UTC" },
          ).format(new Date(d.rsvp.deadline + "T00:00:00Z")),
      );
    if (!d.dateTime) return;
    const start = new Date(d.dateTime),
      end = new Date(start.getTime() + 2 * 3600000);
    const stamp = (date) =>
      date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");
    const title = d.title || [d.bride, d.groom].filter(Boolean).join(" & "),
      location = [d.venue.name, d.venue.address].filter(Boolean).join(", ");
    $("cd-gcal").href =
      "https://calendar.google.com/calendar/render?" +
      new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        dates: stamp(start) + "/" + stamp(end),
        ctz: d.timezone,
        hl: p.locale.startsWith("uz") ? "uz" : p.locale,
        location,
        details: d.message,
      });
    const escape = (value) =>
      String(value)
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\r/g, "");
    $("cd-ics").addEventListener("click", () => {
      const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Taklifnoma//Invitation//EN",
        "BEGIN:VEVENT",
        "UID:" + escape(p.invitationId) + "@taklifnoma",
        "DTSTAMP:" + stamp(new Date()),
        "DTSTART:" + stamp(start),
        "DTEND:" + stamp(end),
        "SUMMARY:" + escape(title),
        "LOCATION:" + escape(location),
        "DESCRIPTION:" + escape(d.message),
        "END:VEVENT",
        "END:VCALENDAR",
      ];
      const url = URL.createObjectURL(
        new Blob([lines.join("\r\n") + "\r\n"], {
          type: "text/calendar;charset=utf-8",
        }),
      );
      const link = make("a");
      link.href = url;
      link.download = ui.calendarFilename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  async function send(p, path, body) {
    const response = await fetch(
      `/api/public/invitations/${encodeURIComponent(p.invitationId)}/${path}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          ...(p.guestToken ? { guestToken: p.guestToken } : {}),
        }),
      },
    );
    if (!response.ok) throw new Error("Submission failed");
    return response.json();
  }
  function services(p, ui) {
    let selected = "";
    document.querySelectorAll("[data-wedivo-status]").forEach((button) =>
      button.addEventListener("click", () => {
        selected = button.dataset.wedivoStatus;
        document.querySelectorAll("[data-wedivo-status]").forEach((el) => {
          el.classList.toggle("is-selected", el === button);
          el.setAttribute("aria-pressed", String(el === button));
        });
      }),
    );
    $("rs-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (p.preview) {
        status(ui.preview);
        return;
      }
      if (!p.data.rsvp.enabled) return;
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: p.data.timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      if (p.data.rsvp.deadline && p.data.rsvp.deadline < today) {
        status(ui.closed);
        return;
      }
      const name = $("rs-name").value.trim();
      if (!name || !selected) {
        status(ui.validation);
        return;
      }
      const button = $("rs-submit");
      if (button.disabled) return;
      button.disabled = true;
      $("rs-form").classList.remove("is-submitted");
      $("rs-form").removeAttribute("data-celebrated");
      try {
        const answer = {
          attending: "yes",
          not_attending: "no",
          maybe: "maybe",
        }[selected];
        await send(p, "rsvp", {
          name,
          status: answer,
          partySize: answer === "yes" ? 1 : 0,
          note: $("rs-msg").value.trim(),
        });
        $("rs-form").classList.add("is-submitted");
        status(ui.saved);
      } catch {
        status(ui.error);
      } finally {
        button.disabled = false;
      }
    });
    function wishes(items) {
      const cards = items.map((item) => {
        const card = make("article", null, "ws-card"),
          petal = make("span", null, "ws-petal");
        const message = make("p", item.message ?? item.text, "ws-msg"),
          name = make("p", item.name, "ws-name"),
          date = make("p", null, "ws-date");
        card.dataset.itemId = item.id || "";
        if (item.submittedAt)
          date.textContent = new Intl.DateTimeFormat(
            p.locale === "uz-Cyrl" ? "uz-Cyrl-UZ" : p.locale,
            { dateStyle: "medium", timeZone: p.data.timezone },
          ).format(new Date(item.submittedAt));
        card.append(petal, message, name, date);
        return card;
      });
      $("ws-list").replaceChildren(...cards);
      text("ws-count-n", String(cards.length));
    }
    if (p.preview) wishes(p.data.wishes || []);
    else if (p.data.wishesEnabled)
      fetch(
        `/api/public/invitations/${encodeURIComponent(p.invitationId)}/wishes`,
        { cache: "no-store" },
      )
        .then((response) => {
          if (!response.ok) throw new Error();
          return response.json();
        })
        .then((result) => wishes(result.wishes || []))
        .catch(() => status(ui.error));
    $("ws-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (p.preview) {
        status(ui.preview);
        return;
      }
      if (!p.data.wishesEnabled) return;
      const name = $("ws-name").value.trim(),
        message = $("ws-msg").value.trim();
      if (!name || !message) {
        status(ui.validation);
        return;
      }
      const button = $("ws-submit");
      if (button.disabled) return;
      button.disabled = true;
      try {
        await send(p, "wishes", { name, message });
        $("ws-msg").value = "";
        status(ui.pending);
      } catch {
        status(ui.error);
      } finally {
        button.disabled = false;
      }
    });
    if (
      p.receiptUploadEnabled &&
      p.data.toyona.enabled &&
      p.data.toyona.cardNumber
    ) {
      const form = make("form"),
        title = make("p", ui.receipt, "form-title"),
        names = make("input"),
        file = make("input"),
        button = make("button", ui.send, "btn"),
        output = make("p");
      const namesLabel = make("label", ui.receiptNames, "f-label"),
        fileLabel = make(
          "label",
          ui.receiptFile,
          "f-label platform-file-field",
        );
      names.className = "f-input";
      names.name = "giverNames";
      names.required = true;
      names.maxLength = 300;
      names.autocomplete = "name";
      file.className = "platform-file-input";
      file.name = "file";
      file.type = "file";
      file.accept = "image/jpeg,image/png,image/webp,application/pdf";
      file.required = true;
      file.title = ui.chooseReceipt;
      const fileCaption = make("span", ui.chooseReceipt, "f-input");
      file.addEventListener("change", () => {
        fileCaption.textContent = file.files?.[0]?.name || ui.chooseReceipt;
      });
      namesLabel.append(names);
      fileLabel.append(file, fileCaption);
      button.type = "submit";
      output.setAttribute("role", "status");
      output.setAttribute("aria-live", "polite");
      form.append(
        title,
        namesLabel,
        fileLabel,
        make("p", ui.receiptNote, "form-sub"),
        button,
        output,
      );
      $("gf-form").append(form);
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (p.preview) {
          output.textContent = ui.preview;
          return;
        }
        if (button.disabled) return;
        if (!file.files?.[0] || file.files[0].size > 5 * 1024 * 1024) {
          output.textContent = ui.receiptFile;
          return;
        }
        const body = new FormData(form);
        if (p.guestToken) body.set("guestToken", p.guestToken);
        button.disabled = true;
        output.textContent = "";
        try {
          const response = await fetch(
            `/api/public/invitations/${encodeURIComponent(p.invitationId)}/receipts`,
            { method: "POST", body },
          );
          if (!response.ok) throw new Error("Receipt failed");
          output.textContent = ui.receiptDone;
          form.reset();
          fileCaption.textContent = ui.chooseReceipt;
          $("gf-form").classList.add("is-submitted");
        } catch {
          output.textContent = ui.error;
        } finally {
          button.disabled = false;
        }
      });
    }
  }
  function languages(p) {
    if (p.enabledLocales.length < 2) return;
    const host = make("div");
    host.id = "platform-languages";
    const names = { "uz-Latn": "O‘z", "uz-Cyrl": "Ўз", en: "En", ru: "Ру" };
    p.enabledLocales.forEach((locale) => {
      const b = make("button", names[locale]);
      b.type = "button";
      b.setAttribute("aria-pressed", String(locale === p.locale));
      b.addEventListener("click", () =>
        parent.postMessage(
          { type: "wedivo-peony-paradise:locale", locale },
          location.origin,
        ),
      );
      host.append(b);
    });
    document.body.append(host);
  }
  function localizeValidation(ui) {
    document.addEventListener(
      "invalid",
      (event) => {
        if (typeof event.target.setCustomValidity === "function") {
          event.target.setCustomValidity(
            event.target.type === "file" ? ui.receiptFile : ui.requiredField,
          );
        }
      },
      true,
    );
    document.addEventListener("input", (event) => {
      if (typeof event.target.setCustomValidity === "function")
        event.target.setCustomValidity("");
    });
    document.addEventListener("change", (event) => {
      if (typeof event.target.setCustomValidity === "function")
        event.target.setCustomValidity("");
    });
  }
  window.addEventListener("message", (event) => {
    if (
      event.origin !== location.origin ||
      event.source !== parent ||
      event.data?.type !== "wedivo-peony-paradise:update" ||
      started
    )
      return;
    const p = event.data.payload;
    if (
      !p?.data ||
      !Array.isArray(p.enabledLocales) ||
      !p.enabledLocales.includes(p.locale)
    )
      return;
    started = true;
    const ui = prepare(p);
    window.startPeonySource(p);
    dateAndMaps(p, ui);
    services(p, ui);
    localizeValidation(ui);
    languages(p);
    document.body.dataset.platformReady = "true";
  });
})();
