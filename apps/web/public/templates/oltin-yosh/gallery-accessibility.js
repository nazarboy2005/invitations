(() => {
  "use strict";

  const labels = {
    "uz-Latn": "Bayram surati",
    "uz-Cyrl": "Байрам сурати",
    en: "Celebration photo",
    ru: "Фото с праздника",
  };

  function label(locale, index) {
    return `${labels[locale] || labels["uz-Latn"]} ${index + 1}`;
  }

  function decorate(scope = document) {
    const locale = window.Marhamat?.lang || document.documentElement?.dataset.lang || "uz-Latn";
    scope.querySelectorAll?.(".gallery__item").forEach((item, index) => {
      const generated = item.getAttribute("data-oltin-yosh-a11y") === "fallback";
      if (generated || !item.getAttribute("aria-label")?.trim()) {
        item.setAttribute("aria-label", label(locale, index));
        item.setAttribute("data-oltin-yosh-a11y", "fallback");
      }
    });
  }

  window.OltinYoshGalleryAccessibility = { label, decorate };
  window.Marhamat?.on?.("ready", decorate);
  window.addEventListener("load", () => decorate(), { once: true });

  const gallery = document.querySelector("[data-gallery]");
  if (gallery && window.MutationObserver) {
    new window.MutationObserver(() => decorate(gallery)).observe(gallery, {
      childList: true,
      subtree: true,
    });
  }
})();
