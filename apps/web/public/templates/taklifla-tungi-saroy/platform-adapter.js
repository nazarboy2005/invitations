/* Platform data/services only. Source layout, keyframes and procedural motion stay isolated. */
(function () {
  "use strict";
  var TYPE = "taklifla-tungi-saroy:update";
  var data,
    locale,
    opened = false,
    initialized = false,
    pending = false;
  var wishes = [],
    loadedId = "",
    loadGeneration = 0;
  var musicUrl = "",
    musicPlayed = false,
    guestPaused = false;
  var $ = function (selector) {
    return document.querySelector(selector);
  };
  var $$ = function (selector) {
    return Array.from(document.querySelectorAll(selector));
  };
  var audio = $("#mp-audio"),
    musicButton = $("#mp-music");
  var form = $("#mp-wish-form"),
    status = $("#mp-wish-confirm");
  var closedPanel = window.TungiSaroySource.buildClosedPanel("#d8b65c");
  form.after(closedPanel);
  closedPanel.hidden = true;
  var ui = window.TungiSaroyUI;

  function text(selector, value, hideEmpty) {
    var element = $(selector);
    element.textContent = value || "";
    if (hideEmpty) element.hidden = !value;
  }
  function show(selector, visible) {
    $(selector).hidden = !visible;
  }
  function t(key) {
    return (ui[key] && (ui[key][locale] || ui[key]["uz-Latn"])) || "";
  }
  function safeUrl(value) {
    return /^(https?:\/\/|\/(?!\/))/i.test(value || "") ? value : "";
  }
  function reduced() {
    return (
      Boolean(data && data.reducedMotion) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }
  function wishStatus(key) {
    status.textContent = t(key);
    status.style.display = "block";
  }
  function closed() {
    var instant = Date.parse(data.instant);
    return Number.isFinite(instant) && Date.now() >= instant + 86400000;
  }
  function renderWishes() {
    var list = $("#mp-wish-list");
    list.replaceChildren();
    show("#mp-wish-empty", !wishes.length);
    wishes.forEach(function (wish) {
      var card = document.createElement("div");
      card.style.cssText =
        "background:rgba(18,26,62,.55);border:1px solid rgba(216,182,92,.2);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:4px;";
      var name = document.createElement("div"),
        message = document.createElement("p");
      name.style.cssText =
        "font-family:'Marcellus',serif;color:#e9d9a6;font-size:15px;overflow-wrap:anywhere;";
      message.style.cssText =
        "margin:0;color:#c6cde8;font-size:15px;white-space:pre-wrap;overflow-wrap:anywhere;";
      name.textContent = wish.name || "";
      message.textContent = wish.message || "";
      card.append(name, message);
      list.append(card);
    });
  }
  async function loadWishes() {
    if (!data || data.preview || !data.wishesEnabled || !data.invitationId)
      return;
    var generation = ++loadGeneration;
    var id = data.invitationId;
    try {
      var response = await fetch(
        "/api/public/invitations/" + encodeURIComponent(id) + "/wishes",
        { cache: "no-store", credentials: "same-origin" },
      );
      if (!response.ok) throw new Error("load");
      var result = await response.json();
      if (generation !== loadGeneration || id !== data.invitationId) return;
      if (!Array.isArray(result.wishes)) throw new Error("shape");
      wishes = result.wishes;
      renderWishes();
    } catch (_) {
      if (generation === loadGeneration) wishStatus("wish_load_error");
    }
  }
  function musicAppearance() {
    var playing = !audio.paused;
    musicButton.style.opacity = playing ? "1" : ".55";
    musicButton.style.animation =
      playing && !reduced() ? "mpPulse 2.4s ease-in-out infinite" : "none";
    musicButton.setAttribute(
      "aria-label",
      t(playing ? "music_pause" : "music_play"),
    );
    musicButton.title = t(playing ? "music_pause" : "music_play");
    musicButton.setAttribute("aria-pressed", String(playing));
  }
  function playMusic() {
    if (!musicUrl || guestPaused || !data.music.enabled || data.silentPlayback)
      return;
    audio
      .play()
      .then(function () {
        musicPlayed = true;
        musicAppearance();
      })
      .catch(musicAppearance);
  }
  function updateMusic() {
    var next = data.music.enabled ? safeUrl(data.music.url) : "";
    if (next !== musicUrl) {
      audio.pause();
      musicUrl = next;
      musicPlayed = false;
      if (next) audio.src = next;
      else audio.removeAttribute("src");
    }
    show("#mp-music", Boolean(next));
    musicButton.style.display = next ? "flex" : "none";
    audio.muted = Boolean(data.silentPlayback);
    if (!next || data.silentPlayback) audio.pause();
    // Public invitations and explicit full-preview music request autoplay. Cards stay silent.
    else if ((!data.preview || opened) && !musicPlayed && !guestPaused)
      playMusic();
    musicAppearance();
  }
  musicButton.addEventListener("click", function () {
    if (!data || !musicUrl || data.silentPlayback) return;
    if (!audio.paused) {
      guestPaused = true;
      audio.pause();
    } else {
      guestPaused = false;
      playMusic();
    }
    musicAppearance();
  });
  audio.addEventListener("play", musicAppearance);
  audio.addEventListener("pause", musicAppearance);
  audio.addEventListener("error", function () {
    musicButton.setAttribute("aria-label", t("music_error"));
    musicButton.title = t("music_error");
  });
  ["pointerdown", "keydown"].forEach(function (eventName) {
    document.addEventListener(
      eventName,
      function (event) {
        if (!data || event.target.closest("#mp-music")) return;
        if ((!data.preview || opened) && !musicPlayed && !guestPaused)
          playMusic();
      },
      { passive: true },
    );
  });
  $("#mp-open").addEventListener("click", function () {
    if (opened || !data) return;
    opened = true;
    var splash = $("#mp-splash");
    splash.style.opacity = "0";
    splash.style.pointerEvents = "none";
    splash.setAttribute("aria-hidden", "true");
    splash.inert = true;
    setTimeout(
      function () {
        splash.style.display = "none";
      },
      reduced() ? 0 : 950,
    );
    document.body.style.overflow = "";
    $("main").inert = false;
    $("main").focus({ preventScroll: true });
    playMusic();
  });

  // Keep original source sizes for normal names; fit long authored names into their scene.
  function fitNames() {
    const fields = {
      "hero-a": [46, 18, 2],
      "hero-b": [46, 18, 2],
      "splash-names": [42, 18, 3],
      "foot-names": [44, 18, 3],
      "inv-groom": [30, 14, 2],
      "inv-bride": [30, 14, 2],
    };
    for (const [slot, [base, min, lines]] of Object.entries(fields)) {
      const el = document.getElementById("mp-" + slot);
      if (!el || !el.textContent || el.hidden) continue;
      el.style.fontSize = base + "px";
      for (let size = base; size > min; size--) {
        const css = getComputedStyle(el);
        const padding =
          parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);
        const line = parseFloat(css.lineHeight) || size * 1.2;
        if (
          el.scrollHeight <= line * lines + padding + 2 &&
          el.scrollWidth <= el.clientWidth + 1
        )
          break;
        el.style.fontSize = size - 1 + "px";
      }
    }
  }
  addEventListener("resize", fitNames);
  document.fonts.ready.then(fitNames);
  function render() {
    var content = data.variants[locale];
    if (!content) return;
    document.documentElement.lang = locale;
    document.documentElement.classList.toggle(
      "reduced-motion",
      Boolean(data.reducedMotion),
    );
    $$("[data-i18n]").forEach(function (element) {
      element.textContent = t(element.dataset.i18n);
    });
    form.setAttribute("aria-label", t("wish_title"));
    form.elements.wname.placeholder = t("wish_name_ph");
    form.elements.wmsg.placeholder = t("wish_msg_ph");
    form.elements.wname.setAttribute("aria-label", t("wish_name_ph"));
    form.elements.wmsg.setAttribute("aria-label", t("wish_msg_ph"));
    form.elements.wname.maxLength = 100;
    form.elements.wmsg.maxLength = 2000;
    $$(".mp-lang button").forEach(function (button) {
      button.hidden = !data.enabledLocales.includes(button.dataset.lang);
      button.classList.toggle("on", button.dataset.lang === locale);
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.lang === locale),
      );
    });
    show(".mp-lang", data.enabledLocales.length > 1);
    $(".mp-lang").setAttribute("aria-label", t("language"));
    var first = content.people[0] || "",
      second = content.people[1] || "";
    var names = [first, second].filter(Boolean).join(" & ");
    ["#mp-splash-names", "#mp-foot-names"].forEach(function (selector) {
      text(selector, names, true);
    });
    ["#mp-hero-a", "#mp-inv-groom"].forEach(function (selector) {
      text(selector, first, true);
    });
    ["#mp-hero-b", "#mp-inv-bride"].forEach(function (selector) {
      text(selector, second, true);
    });
    text("#mp-mono-a", Array.from(first)[0] || "");
    text("#mp-mono-b", Array.from(second)[0] || "");
    [
      "#mp-hero-amp",
      "#mp-inv-with",
      "#mp-mono-amp",
      "#mp-mono-b",
      "#mp-inv-bride-block",
    ].forEach(function (selector) {
      show(selector, Boolean(second));
    });
    text("#mp-inv-groom-parents", content.hosts);
    show("#mp-inv-groom-parents-wrap", Boolean(content.hosts));
    show("#mp-inv-bride-parents-wrap", false);
    text("#mp-greeting", content.greeting, true);
    text("#mp-message", content.message, true);
    if (content.eventLabel)
      text('[data-i18n="splash_kicker"]', content.eventLabel);
    ["#mp-splash-date", "#mp-hero-date", "#mp-foot-date"].forEach(
      function (selector) {
        text(selector, content.numericDate, true);
      },
    );
    text(
      "#mp-inv-date",
      [content.dateLabel, content.timeLabel].filter(Boolean).join("\n"),
      true,
    );
    $("#mp-inv-date").style.whiteSpace = "pre-line";
    ["#mp-hero-venue", "#mp-inv-venue", "#mp-venue-name"].forEach(
      function (selector) {
        text(selector, content.venueName, true);
      },
    );
    text("#mp-venue-addr", content.address, true);
    text("#mp-venue-note", content.landmark);
    show("#mp-venue-note-wrap", Boolean(content.landmark));
    // Retain the source's city inference only for explicit leading city markers.
    var cityMatch = content.address
      .split(",")[0]
      .trim()
      .match(/^(.+?)\s+(?:sh\.?|shahri|шаҳри|ш\.)$|^(?:г|g)\.\s*(.+)$/i);
    var city = cityMatch
      ? (cityMatch[1] || cityMatch[2]).toLocaleUpperCase()
      : "";
    ["hero", "splash", "foot", "inv-venue", "events-note"].forEach(
      function (part) {
        text("#mp-" + part + "-city", city);
        show("#mp-" + part + "-city-wrap", Boolean(city));
      },
    );
    var map =
      safeUrl(data.mapUrl) ||
      (content.address || content.venueName
        ? "https://yandex.uz/maps/?text=" +
          encodeURIComponent(content.address || content.venueName)
        : "");
    $("#mp-map").href = map || "#";
    show("#mp-map", Boolean(map));
    $("#mp-venue-name").closest("section").hidden = !(
      content.venueName ||
      content.address ||
      content.landmark ||
      map
    );
    text("#mp-program-heading", content.programHeading || t("events_title"));
    show("#mp-events-note", false);
    var host = $("#mp-events");
    host.querySelectorAll(".mp-ev-row").forEach(function (row) {
      row.remove();
    });
    var items = content.program.filter(function (item) {
      return item.time || item.title || item.description;
    });
    items.forEach(function (item) {
      var row =
        $("#mp-event-template").content.firstElementChild.cloneNode(true);
      row.dataset.programId = item.id;
      var lines = row.querySelectorAll("p");
      [item.time, item.title, item.description].forEach(
        function (value, index) {
          lines[index].textContent = value || "";
          lines[index].hidden = !value;
        },
      );
      host.append(row);
    });
    [
      "#mp-events-section",
      "#mp-events-divider-top",
      "#mp-events-divider-bottom",
    ].forEach(function (selector) {
      show(selector, items.length > 0);
    });
    text("#mp-info-dress-text", content.dressText);
    show("#mp-info-dress", Boolean(content.dressText));
    show("#mp-info-weather", false);
    show("#mp-info-stay", false);
    show("#mp-hashtag", false);
    var contact =
      data.rsvpEnabled && data.phone
        ? [content.deadlineLabel, data.phone].filter(Boolean).join(" · ")
        : "";
    text("#mp-info-rsvp-text", contact);
    show("#mp-info-rsvp", Boolean(contact));
    show("#mp-info-section", Boolean(content.dressText || contact));
    var visibleInfo = $$("#mp-info-section [id^='mp-info-']").filter(
      function (element) {
        return (
          element.parentElement === $("#mp-info-dress").parentElement &&
          !element.hidden
        );
      },
    );
    visibleInfo.forEach(function (element, index) {
      element.style.borderBottom =
        index === visibleInfo.length - 1
          ? "none"
          : "1px solid rgba(216,182,92,.16)";
    });
    form.closest("section").hidden = !data.wishesEnabled;
    form.hidden = closed();
    closedPanel.hidden = !closed();
    var panelChildren = closedPanel.children;
    panelChildren[1].textContent = t("closed_title");
    panelChildren[2].textContent = t("closed_subtitle");
    panelChildren[3].textContent = t("closed_body");
    $("#mp-cd-grid").closest("section").hidden = !data.instant;
    tick();
    if (data.preview) wishes = content.wishes || [];
    renderWishes();
    updateMusic();
    window.TungiSaroySource.reveal();
    fitNames();
    document.documentElement.classList.remove("awaiting-data");
  }
  function tick() {
    if (!data) return;
    var diff = Date.parse(data.instant) - Date.now();
    var arrived = Number.isFinite(diff) && diff <= 0;
    $("#mp-cd-grid").style.display = arrived ? "none" : "flex";
    $("#mp-cd-arrived").style.display = arrived ? "block" : "none";
    diff = Number.isFinite(diff) ? Math.max(0, diff) : 0;
    text("#mp-cd-d", String(Math.floor(diff / 86400000)));
    text(
      "#mp-cd-h",
      String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
    );
    text(
      "#mp-cd-m",
      String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
    );
    text(
      "#mp-cd-s",
      String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
    );
    form.hidden = closed();
    closedPanel.hidden = !closed();
  }
  setInterval(tick, 1000);
  $(".mp-lang").addEventListener("click", function (event) {
    var button = event.target.closest("button[data-lang]");
    if (!button || !data.enabledLocales.includes(button.dataset.lang)) return;
    locale = button.dataset.lang;
    render();
  });
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!data || pending || closed() || !form.reportValidity()) return;
    if (data.preview) {
      wishStatus("preview_only");
      return;
    }
    if (!data.wishesEnabled || !data.invitationId) {
      wishStatus("wish_error");
      return;
    }
    var name = form.elements.wname.value.trim(),
      message = form.elements.wmsg.value.trim();
    if (!name || !message) {
      wishStatus("wish_required");
      return;
    }
    pending = true;
    var button = form.querySelector('[type="submit"]');
    button.disabled = true;
    var id = data.invitationId;
    try {
      var response = await fetch(
        "/api/public/invitations/" + encodeURIComponent(id) + "/wishes",
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            message: message,
            guestToken: data.guestToken || undefined,
          }),
        },
      );
      var result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("wish");
      if (data.invitationId !== id) return;
      form.reset();
      wishStatus("wish_pending");
      // Pending wishes are never inserted into the public list. GET returns approved rows only.
      loadWishes();
    } catch (_) {
      if (data.invitationId === id) wishStatus("wish_error");
    } finally {
      pending = false;
      button.disabled = false;
    }
  });
  function receive(message) {
    if (
      !message ||
      message.type !== TYPE ||
      !message.payload ||
      !message.payload.variants
    )
      return;
    data = message.payload;
    locale = data.locale;
    if (!data.variants[locale]) return;
    if (!initialized) {
      initialized = true;
      document.body.style.overflow = "hidden";
      $("main").tabIndex = -1;
      $("main").inert = true;
      window.TungiSaroySource.fireflies();
    }
    if (
      loadedId !==
      data.invitationId + ":" + data.preview + ":" + data.wishesEnabled
    ) {
      loadedId =
        data.invitationId + ":" + data.preview + ":" + data.wishesEnabled;
      ++loadGeneration;
      wishes = [];
      status.style.display = "none";
      loadWishes();
    }
    render();
  }
  addEventListener("message", function (event) {
    if (event.origin !== location.origin || event.source !== parent) return;
    receive(event.data);
  });
  try {
    receive(JSON.parse(window.name || "null"));
  } catch (_) {
    /* Wait for typed parent payload. */
  }
})();
