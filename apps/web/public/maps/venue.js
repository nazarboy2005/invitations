/* Yandex JavaScript API owns rendering and attribution inside this isolated map. */
(() => {
  "use strict";
  const params = new URLSearchParams(location.search);
  const picking = params.get("mode") === "pick";
  const locale = params.get("lang") || "uz-Latn";
  const ru = locale === "ru" || locale === "uz-Cyrl";
  // JS API 2.1 has no Uzbek locale. Respect the viewer's browser preferences;
  // Uzbek and an Uzbekistan timezone use Russian, without requesting GPS.
  const supportedLanguages = { ru: "ru_RU", en: "en_RU", tr: "tr_TR", uk: "uk_UA", uz: "ru_RU" };
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language || ""];
  let zone = "";
  try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { /* Browser may not expose a timezone. */ }
  let apiLocale = /^Asia\/(?:Tashkent|Samarkand)$/.test(zone) ? "ru_RU"
    : browserLanguages.map(language => supportedLanguages[language.toLowerCase().split(/[-_]/)[0]]).find(Boolean);
  if (!apiLocale) {
    apiLocale = zone === "Europe/Moscow" ? "ru_RU"
      : zone === "Europe/Istanbul" ? "tr_TR" : /^Europe\/(?:Kiev|Kyiv)$/.test(zone) ? "uk_UA" : "en_RU";
  }
  document.documentElement.lang = ru ? "ru" : locale === "en" ? "en" : "uz";
  const status = document.getElementById("status");
  const key = document.body.dataset.yandexKey;
  let lat = params.get("latitude"), lng = params.get("longitude");
  if ((lat === null || lng === null) && params.get("point")) [lat, lng] = params.get("point").split(",");
  const valid = lat !== null && lng !== null && lat !== "" && lng !== "" && Number.isFinite(+lat) && Number.isFinite(+lng) && Math.abs(+lat) <= 90 && Math.abs(+lng) <= 180;
  const mapLink = new URL("https://yandex.uz/maps/");
  mapLink.searchParams.set("lang", "uz_UZ");
  if (valid) { mapLink.searchParams.set("ll", `${lng},${lat}`); mapLink.searchParams.set("pt", `${lng},${lat},pm2rdm`); mapLink.searchParams.set("z", "16"); }
  else if (params.get("text") || params.get("point")) mapLink.searchParams.set("text", params.get("text") || params.get("point"));
  const supplied = params.get("destination");
  if (supplied) {
    try {
      const url = new URL(supplied);
      if (url.protocol === "https:" && /^(?:www\.)?yandex\.(?:uz|ru|com)$/.test(url.hostname) && url.pathname.startsWith("/maps")) {
        mapLink.pathname = url.pathname;
        for (const name of ["oid", "ol", "uri"]) if (url.searchParams.has(name)) mapLink.searchParams.set(name, url.searchParams.get(name));
      }
    } catch { /* The saved coordinate pair remains the destination. */ }
  }
  document.getElementById("destination").href = mapLink.href;
  if (picking) document.getElementById("destination").remove();
  const failure = () => { status.hidden = false; status.textContent = "Xarita yuklanmadi."; };
  if (!valid || !key) { failure(); return; }
  status.textContent = ru ? "Загрузка карты…" : locale === "en" ? "Loading map…" : "Xarita yuklanmoqda…";
  const timeout = setTimeout(failure, 15000);
  const script = document.createElement("script");
  script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(key)}&lang=${apiLocale}`;
  script.onerror = () => { clearTimeout(timeout); failure(); };
  script.onload = () => window.ymaps.ready(() => {
    try {
      const center = [+lat, +lng];
      const map = new window.ymaps.Map("map", { center, zoom: picking ? 14 : 16, controls: picking ? ["zoomControl"] : [] }, { suppressMapOpenBlock: true, yandexMapDisablePoiInteractivity: picking });
      const pin = new window.ymaps.Placemark(center, {}, { preset: "islands#redDotIcon", draggable: picking });
      map.geoObjects.add(pin);
      if (picking) {
        const choose = coordinates => {
          pin.geometry.setCoordinates(coordinates);
          parent.postMessage({ type: "venue-map-picked", latitude: coordinates[0], longitude: coordinates[1] }, location.origin);
        };
        map.events.add("click", event => choose(event.get("coords")));
        pin.events.add("dragend", () => choose(pin.geometry.getCoordinates()));
      }
      if (picking) map.behaviors.enable(["drag", "scrollZoom", "dblClickZoom", "multiTouch"]);
      else map.behaviors.disable("scrollZoom");
      status.hidden = true; clearTimeout(timeout);
      window.addEventListener("pagehide", () => map.destroy(), { once: true });
    } catch { clearTimeout(timeout); failure(); }
  });
  document.head.append(script);
})();
