import { isTemplateDocument } from "../lib/public-asset";

/** Watch lazy renderers and frame navigations, with one subscription per document. */
export function observeTemplateDocuments(
  root: HTMLElement,
  visit: (doc: Document) => void | (() => void),
) {
  const frames = new WeakSet<HTMLIFrameElement>();
  const documents = new WeakSet<Document>();
  const cleanups: Array<() => void> = [];
  function scan(host: HTMLElement) {
    for (const frame of host.querySelectorAll("iframe")) {
      if (frames.has(frame)) continue;
      frames.add(frame);
      const loaded = () => {
        const doc = frame.contentDocument;
        if (
          !doc?.body ||
          !isTemplateDocument(doc.URL, location.origin) ||
          documents.has(doc)
        )
          return;
        documents.add(doc);
        const cleanup = visit(doc);
        if (cleanup) cleanups.push(cleanup);
        watch(doc.body);
      };
      frame.addEventListener("load", loaded);
      cleanups.push(() => frame.removeEventListener("load", loaded));
      if (frame.contentDocument?.readyState === "complete") loaded();
    }
  }
  function watch(host: HTMLElement) {
    scan(host);
    const observer = new MutationObserver(() => scan(host));
    observer.observe(host, { childList: true, subtree: true });
    cleanups.push(() => observer.disconnect());
  }
  watch(root);
  return () => cleanups.forEach((cleanup) => cleanup());
}
