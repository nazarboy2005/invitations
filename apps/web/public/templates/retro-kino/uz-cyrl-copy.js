// The shared transliterator is intentionally general-purpose. Correct the
// two Retro Kino phrases whose Cyrillic forms need template-specific copy.
(() => {
  "use strict";

  if (document.documentElement.lang !== "uz-Cyrl") return;

  const corrections = [
    ["Премйера", "Премьера"],
    ["ПРЕМЙЕРА", "ПРЕМЬЕРА"],
    ["премйера", "премьера"],
    ["Марқуее чироқлари", "Кино чироқлари"],
    ["МАРҚУЕЕ ЧИРОҚЛАРИ", "КИНО ЧИРОҚЛАРИ"],
    ["марқуее чироқлари", "кино чироқлари"],
  ];

  const correct = (value) =>
    corrections.reduce((text, [from, to]) => text.replaceAll(from, to), value);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) walker.currentNode.nodeValue = correct(walker.currentNode.nodeValue);

  document.title = correct(document.title);
  document
    .querySelectorAll('[aria-label], [placeholder], [title], [alt], [data-print]')
    .forEach((element) => {
      for (const attribute of ["aria-label", "placeholder", "title", "alt", "data-print"]) {
        const value = element.getAttribute(attribute);
        if (value) element.setAttribute(attribute, correct(value));
      }
    });
  document
    .querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]')
    .forEach((element) => {
      element.content = correct(element.content || "");
    });
})();
