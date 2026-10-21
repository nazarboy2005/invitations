(() => {
  const locale = new URLSearchParams(location.search).get("lang") || "uz";
  const title = {
    uz: "Beshik · Taklifnoma",
    "uz-Cyrl": "Бешик · Таклифнома",
    en: "Beshik · Invitation",
    ru: "Бешик · Приглашение",
  };
  const description = {
    uz: "Beshik to‘yi uchun taklifnoma",
    "uz-Cyrl": "Бешик тўйи учун таклифнома",
    en: "An invitation for a Beshik celebration",
    ru: "Приглашение на праздник бешик-той",
  };
  document.title = title[locale] || title.uz;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", description[locale] || description.uz);
  document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute("content", title[locale] || title.uz);
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute("content", description[locale] || description.uz);
})();
