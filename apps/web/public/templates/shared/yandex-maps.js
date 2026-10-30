/* Guests open the venue by tapping the map; templates have no map/taxi buttons. */
(() => {
  "use strict";
  const isMap = value => /^https:\/\/(?:www\.)?yandex\.(?:uz|ru|com)\/maps(?:\/|\?)/.test(value);
  const localMap = frame => new URL(frame.src, location.href).pathname === "/maps/venue";
  function point(url) {
    if (url.searchParams.has("latitude") && url.searchParams.has("longitude")) {
      const lat = Number(url.searchParams.get("latitude")), lng = Number(url.searchParams.get("longitude"));
      if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
    }
    if (url.searchParams.get("point")) {
      const [lat, lng] = url.searchParams.get("point").split(",").map(Number);
      if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
    }
    const value = url.searchParams.get("pt") || url.searchParams.get("whatshere[point]") || url.searchParams.get("ll");
    if (!value) return null;
    const [lng, lat] = value.split(",").map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
  }
  function set(el, name, value) { if (el.getAttribute(name) !== value) el.setAttribute(name, value); }
  const generated = new WeakMap();
  function update() {
    const links = Array.from(document.querySelectorAll("a[href]")).filter(a => isMap(a.href));
    const frames = Array.from(document.querySelectorAll("iframe[src]")).filter(frame => localMap(frame) || /https:\/\/yandex\.(?:uz|ru|com)\/map-widget\//.test(frame.src) || isMap(frame.src));
    const destinations = links.filter(a => point(new URL(a.href)) && !a.hidden);
    for (const link of links) {
      const url = new URL(link.href); url.hostname = "yandex.uz"; url.searchParams.set("lang", "uz_UZ");
      set(link, "href", url.href); set(link, "target", "_top"); set(link, "aria-label", "Joy xaritasi");
      if (link.classList.contains("venue-map-open") || link.querySelector("img,canvas,iframe")) {
        for (const chip of link.querySelectorAll(".venue-map-chip")) chip.remove();
        continue;
      }
      set(link, "data-invitation-map-action", "");
      const p = point(url);
      if (!p || link.hidden) { generated.get(link)?.remove(); continue; }
      let host = link.parentElement;
      for (let level = 0; host && level < 5 && !host.querySelector("iframe"); level++) host = host.parentElement;
      if (host?.querySelector("iframe")) continue;
      let frame = generated.get(link);
      if (!frame?.isConnected) {
        frame = document.createElement("iframe"); frame.title = "Joy xaritasi"; frame.loading = "lazy";
        frame.style.cssText = "display:block;width:100%;height:280px;border:0;border-radius:inherit;margin:12px 0";
        frame.dataset.invitationGeneratedMap = ""; link.before(frame); generated.set(link, frame);
      }
      set(frame, "src", `/maps/venue?latitude=${p.lat}&longitude=${p.lng}&destination=${encodeURIComponent(url.href)}`);
    }
    for (const frame of frames) {
      if (frame.hasAttribute("data-invitation-generated-map")) continue;
      let candidates = [], host = frame.parentElement;
      for (let level = 0; host && level < 6; level++, host = host.parentElement) {
        candidates = destinations.filter(a => host.contains(a));
        if (candidates.length) break;
      }
      if (!candidates.length && new Set(destinations.map(a => a.href)).size === 1) candidates = destinations;
      const destination = candidates[0];
      if (!destination && localMap(frame)) continue;
      const source = new URL(frame.src, location.href);
      const p = destination ? point(new URL(destination.href)) : point(source);
      if (!p) continue;
      const url = localMap(frame) ? source : new URL("/maps/venue", location.origin);
      url.searchParams.delete("point");
      url.searchParams.set("latitude", String(p.lat)); url.searchParams.set("longitude", String(p.lng));
      if (destination) url.searchParams.set("destination", destination.href);
      set(frame, "src", url.pathname + url.search);
    }
    for (const frame of document.querySelectorAll("iframe[data-invitation-generated-map]")) {
      if (!links.some(link => generated.get(link) === frame && !link.hidden)) frame.remove();
    }
  }
  let scheduled = false;
  function schedule() { if (!scheduled) { scheduled = true; queueMicrotask(() => { scheduled = false; update(); }); } }
  const start = () => {
    const style = document.createElement("style");
    style.textContent = "a[data-invitation-map-action],[data-map-toggle]{display:none!important}"; document.head.append(style);
    new MutationObserver(records => {
      if (records.some(r => r.type === "attributes" || [...r.addedNodes, ...r.removedNodes].some(n => n.nodeType === 1 && (n.matches("a,iframe") || n.querySelector("a,iframe"))))) schedule();
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "src", "hidden"] });
    update();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true }); else start();
  addEventListener("message", event => { if (event.origin === location.origin && event.source === parent) schedule(); });
})();
