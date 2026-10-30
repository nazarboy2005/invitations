// Qandil package additions for localized document metadata.
Object.assign((window.MARHAMAT_I18N = window.MARHAMAT_I18N || {}), {
  "Qandil": ["Кандиль", "Qandil"],
  "Qandil raqamli taklifnomasi": [
    "Кандиль — цифровое приглашение ",
    "Qandil — a digital invitation by ",
  ],
});

// The shared translator handles text and metadata attributes, but not document.title
// for Uzbek Cyrillic. Keep this source title localized without changing the source core.
if (new URLSearchParams(location.search).get("lang") === "uz-Cyrl") {
  document.title = "Мархаба · Қандил";
}
