// _wish-close.js — shared across iframe-static designer templates.
//
// Every wedding HTML template under /templates/ that ships a guest book
// loads this script with `defer`, so it runs after the inline customizer
// at body-top has set window.__INV_TARGET__ (a Date.getTime() of the
// wedding moment). Once 24h have passed since that target, the .wish-form
// element is swapped for a calm "book closed" panel — the wishes list
// itself stays visible so the keepsake is intact.
//
// We do NOT touch the React-side GuestbookSection; that has its own
// equivalent close-state. Backend handlePublicGuestbook rejects matching
// POSTs with 410 guestbook_closed as defense in depth.
//
// Templates use slightly different IDs for the form element (some are
// <form id="wish-form">, some are <div class="wish-form">, quyoshli uses
// id="wishForm"). Selecting by class .wish-form covers them all.

(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function readTarget() {
    if (typeof window.__INV_TARGET__ === "number" && window.__INV_TARGET__ > 0) {
      return window.__INV_TARGET__;
    }
    // Customizer didn't set __INV_TARGET__ — fall back to URL params.
    try {
      var qs = new URLSearchParams(location.search);
      var date = qs.get("date");
      var time = qs.get("time");
      if (!date) return null;
      var dp = date.split(".");
      if (dp.length !== 3) return null;
      var dd = parseInt(dp[0], 10);
      var mm = parseInt(dp[1], 10);
      var yyyy = parseInt(dp[2], 10);
      if (!dd || !mm || !yyyy) return null;
      var hh = 17, mi = 0;
      if (time) {
        var tp = time.split(":");
        if (tp.length >= 2) {
          hh = parseInt(tp[0], 10) || 17;
          mi = parseInt(tp[1], 10) || 0;
        }
      }
      return new Date(yyyy, mm - 1, dd, hh, mi, 0).getTime();
    } catch (e) {
      return null;
    }
  }

  function buildPanel(accent) {
    var panel = document.createElement("div");
    panel.className = "wish-closed";
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    panel.style.cssText = [
      "max-width:540px",
      "margin:0 auto",
      "padding:36px 28px",
      "border:1px solid " + accent + "55",
      "background:linear-gradient(to bottom, transparent, " + accent + "0d)",
      "text-align:center",
      "color:inherit",
    ].join(";");

    panel.innerHTML =
      // Hairline rule with a centered diamond ornament — same motif as
      // the rest of the editorial system.
      '<div aria-hidden="true" style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:20px;color:' + accent + ';">' +
        '<span style="flex:0 0 56px;height:1px;background:linear-gradient(to right, transparent, ' + accent + ');"></span>' +
        '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
          '<path d="M8 1 L11 8 L8 15 L5 8 Z" stroke="' + accent + '" stroke-width="0.8"/>' +
          '<circle cx="8" cy="8" r="1.2" fill="' + accent + '"/>' +
        "</svg>" +
        '<span style="flex:0 0 56px;height:1px;background:linear-gradient(to left, transparent, ' + accent + ');"></span>' +
      "</div>" +
      '<div style="font-family:inherit;font-size:11px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:' + accent + ';margin-bottom:12px;">Daftar yopildi</div>' +
      "<div style=\"font-family:inherit;font-size:24px;font-style:italic;line-height:1.2;margin-bottom:12px;color:inherit;\">Bayram o’tdi — rahmat</div>" +
      "<p style=\"font-family:inherit;font-style:italic;font-size:15px;line-height:1.55;opacity:0.78;margin:0;color:inherit;\">Yangi tilaklarni qabul qilish to’xtatildi. Mehmonlar qoldirgan so’zlar bayram esi sifatida saqlanadi.</p>";

    return panel;
  }

  function readAccent() {
    var styles = getComputedStyle(document.documentElement);
    var v = styles.getPropertyValue("--accent");
    if (v && v.trim()) return v.trim();
    var ink = styles.getPropertyValue("--ink");
    if (ink && ink.trim()) return ink.trim();
    return "#1a1814";
  }

  ready(function () {
    var target = readTarget();
    if (!target) return;
    if (Date.now() < target + 24 * 60 * 60 * 1000) return;

    var form = document.querySelector(".wish-form");
    if (!form || !form.parentNode) return;

    var panel = buildPanel(readAccent());
    form.parentNode.replaceChild(panel, form);

    // Defense: some templates wire a separate submit button outside the
    // form (diyora-shahzod). Disable any leftover affordance.
    var leftover = document.getElementById("wish-submit");
    if (leftover) {
      leftover.disabled = true;
      leftover.style.pointerEvents = "none";
      leftover.style.opacity = "0.35";
    }
  });
})();
