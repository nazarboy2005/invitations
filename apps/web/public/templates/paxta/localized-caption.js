(() => {
  "use strict";

  // Platform-only localization adapter: the captured English caption is
  // transliterated poorly by the shared Uzbek Cyrillic fallback. The spaced
  // signature letters also need to be joined to form the Uzbek word Paxta.
  // Keep the captured template untouched and adapt only these short labels.
  const captions = {
    "uz-Latn": "COTTON / 01",
    "uz-Cyrl": "ПАХТА / 01",
    en: "COTTON / 01",
    ru: "ХЛОПОК / 01",
  };
  const signatures = {
    "uz-Latn": "PA X TA · 01",
    "uz-Cyrl": "ПАХТА · 01",
    en: "COTTON · 01",
    ru: "ХЛОПОК · 01",
  };
  const applyCaption = () => {
    const caption = document.querySelector(".hero__caption");
    const signature = document.querySelector(".intro__signature");
    const localized = captions[document.documentElement.dataset.lang];
    const localizedSignature = signatures[document.documentElement.dataset.lang];
    if (caption && localized) caption.textContent = localized;
    if (signature && localizedSignature) signature.textContent = localizedSignature;
  };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", applyCaption, { once: true });
  else applyCaption();
})();
