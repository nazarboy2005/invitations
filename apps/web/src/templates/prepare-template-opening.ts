/** Reveal a complete opening while later sections keep downloading. */
export function prepareTemplateOpening(doc: Document, reveal: () => void) {
  const view = doc.defaultView;
  if (!view) return () => {};
  let active = true;
  const assets: Promise<unknown>[] = [];
  const fonts = new Map<string, string>();
  const backgrounds = new Set<string>();
  const mediaCleanups: Array<() => void> = [];
  const height = view.innerHeight;
  const width = view.innerWidth;

  for (const element of doc.body.querySelectorAll<HTMLElement>("*")) {
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0 || rect.top >= height || rect.bottom <= 0 || rect.left >= width || rect.right <= 0) continue;
    const style = view.getComputedStyle(element);
    if (style.visibility === "hidden") continue;
    if (element instanceof view.HTMLImageElement && (element.currentSrc || element.getAttribute("src"))) {
      element.fetchPriority = "high";
      element.loading = "eager";
      assets.push(element.decode());
    }
    if (element instanceof view.HTMLVideoElement) {
      if (element.poster) backgrounds.add(element.poster);
      else if (element.readyState < 2 && (element.autoplay || element.preload === "auto")) {
        assets.push(new Promise<void>(resolve => {
          const ready = () => { cleanup(); resolve(); };
          const cleanup = () => {
            element.removeEventListener("loadeddata", ready);
            element.removeEventListener("error", ready);
          };
          element.addEventListener("loadeddata", ready, { once: true });
          element.addEventListener("error", ready, { once: true });
          mediaCleanups.push(cleanup);
        }));
      }
    }
    const text = element.textContent?.trim();
    if (text) {
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      fonts.set(font, (fonts.get(font) || "") + text.slice(0, 64));
    }
    for (const paint of [style, view.getComputedStyle(element, "::before"), view.getComputedStyle(element, "::after")]) {
      for (const match of paint.backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)) backgrounds.add(match[1]);
    }
  }
  for (const [font, text] of fonts) assets.push(doc.fonts.load(font, text));
  for (const url of backgrounds) {
    const image = new view.Image();
    image.fetchPriority = "high";
    image.src = url;
    assets.push(image.decode());
  }

  // Lazy images start downloading roughly two screens before they are reached.
  // Do this after the opening has priority, including dynamically inserted photos.
  let stopLoadingAhead = () => {};
  const finish = () => {
    if (!active || !doc.defaultView || doc.defaultView.document !== doc) return;
    clearTimeout(timeout);
    mediaCleanups.forEach(cleanup => cleanup());
    reveal();
    const observer = new view.IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLImageElement).loading = "eager";
        observer.unobserve(entry.target);
      }
    }, { root: doc, rootMargin: `${height * 2}px 0px` });
    const observed = new WeakSet<HTMLImageElement>();
    const scan = () => doc.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(image => {
      if (observed.has(image)) return;
      observed.add(image);
      observer.observe(image);
    });
    const mutations = new view.MutationObserver(scan);
    mutations.observe(doc.body, { childList: true, subtree: true });
    scan();
    stopLoadingAhead = () => { observer.disconnect(); mutations.disconnect(); };
  };
  let finished = false;
  const finishOnce = () => {
    if (finished) return;
    finished = true;
    view.requestAnimationFrame(() => view.requestAnimationFrame(finish));
  };
  // A failed or stalled critical asset must not leave an indefinite spinner.
  const timeout = setTimeout(finishOnce, 4000);
  void Promise.allSettled(assets).then(finishOnce);
  return () => {
    active = false;
    clearTimeout(timeout);
    mediaCleanups.forEach(cleanup => cleanup());
    stopLoadingAhead();
  };
}
