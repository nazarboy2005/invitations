import { isTemplateDocument } from "../lib/public-asset";

export const TEMPLATE_READY_EVENT = "fotiha:template-ready";

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
          doc.documentElement.dataset.fotihaInitialized !== "true" ||
          documents.has(doc)
        )
          return;
        documents.add(doc);
        const cleanup = visit(doc);
        if (cleanup) cleanups.push(cleanup);
        watch(doc.body);
      };
      frame.addEventListener("load", loaded);
      frame.addEventListener(TEMPLATE_READY_EVENT, loaded);
      cleanups.push(() => {
        frame.removeEventListener("load", loaded);
        frame.removeEventListener(TEMPLATE_READY_EVENT, loaded);
      });
      loaded();
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
