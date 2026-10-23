(() => {
  "use strict";

  const app = window.Marhamat;
  if (!app) return;

  const metadata = {
    uz: { title: "Atlas taklifnomasi", description: "Zamonaviy atlas va adras ranglaridagi nikoh taklifnomasi." },
    "uz-Cyrl": { title: "Атлас таклифномаси", description: "Замонавий атлас ва адрас рангларидаги никоҳ таклифномаси." },
    ru: { title: "Приглашение Atlas", description: "Свадебное приглашение в ярких цветах узбекского атласа и адраса." },
    en: { title: "Atlas invitation", description: "A wedding invitation inspired by the vivid colours of Uzbek atlas and adras silk." },
  };

  const text = (value) => value == null ? "" : String(value);
  const apply = (data = app.data || {}) => {
    const lang = app.lang || document.documentElement.lang || "uz";
    const copy = metadata[lang] || metadata.uz;
    const names = [data.groom, data.bride].map(text).filter(Boolean);
    const couple = names.length ? `${names.join(" & ")} — ` : "";
    document.title = `${couple}${copy.title}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${couple}${copy.title}`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", copy.description);

    const venue = text(data.venue?.name) || text(data.venue?.address);
    const event = text(data.eventType);
    const date = text(document.querySelector(".intro__date")?.textContent) || text(data.date?.long);
    const year = text(data.date?.year) || text(data.dateTime).match(/^\d{4}/)?.[0] || date.match(/\b20\d{2}\b/)?.[0] || "";
    const track = (name) => [name, "✳", date, "✳", venue, "✳"].filter(Boolean).join(" ");
    const note = document.querySelector(".intro__side-note");
    if (note) note.textContent = ["ATLAS", venue, year].filter(Boolean).join(" · ");
    const side = document.querySelector(".hero__side");
    if (side) side.textContent = text(data.venue?.address) || venue;
    const dateLocation = document.querySelector(".date-poster__time");
    if (dateLocation) {
      Array.from(dateLocation.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .forEach((node) => node.remove());
      if (venue) dateLocation.append(document.createTextNode(` · ${venue}`));
    }
    const marquee = document.querySelectorAll(".marquee__track > span");
    marquee.forEach((item) => { item.textContent = track(event); });
    const stamp = document.querySelector(".venue__stamp");
    if (stamp) {
      stamp.replaceChildren(
        document.createTextNode(text(data.venue?.name) || venue),
        document.createElement("br"),
        document.createTextNode("✳"),
        document.createElement("br"),
        document.createTextNode(year),
      );
    }
  };

  app.on?.("ready", () => apply());
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== "marxaba:update") return;
    queueMicrotask(() => apply(app.data));
  });
  if (app.ready) queueMicrotask(() => apply());
})();
