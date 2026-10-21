// Qandil package additions for localized document metadata.
Object.assign((window.MARHAMAT_I18N = window.MARHAMAT_I18N || {}), {
  "Marxaba · Qandil": ["Marxaba · Кандиль", "Marxaba · Qandil"],
  "Qandil — Marxaba raqamli taklifnomasi": [
    "Кандиль — цифровое приглашение Marxaba",
    "Qandil — a digital invitation by Marxaba",
  ],
});

// The shared translator handles text and metadata attributes, but not document.title
// for Uzbek Cyrillic. Keep this source title localized without changing the source core.
if (new URLSearchParams(location.search).get("lang") === "uz-Cyrl") {
  document.title = "Мархаба · Қандил";
}
