"use client";

import { forwardRef, useCallback, useEffect, useRef, type ComponentProps } from "react";
import { isTemplateDocument } from "../lib/public-asset";
import { TEMPLATE_READY_EVENT } from "./observe-template-documents";
import { pauseOffscreenEffects } from "./pause-offscreen-effects";

type Props = Omit<ComponentProps<"iframe">, "onLoad" | "ref"> & {
  onReady: (frame: HTMLIFrameElement) => void;
};

/** Initialize the real renderer after its scripts, without waiting for distant media. */
export const TemplateFrame = forwardRef<HTMLIFrameElement, Props>(function TemplateFrame(
  { onReady, ...props }, forwardedRef,
) {
  const element = useRef<HTMLIFrameElement | null>(null);
  const latest = useRef(onReady);
  latest.current = onReady;
  const setRef = useCallback((frame: HTMLIFrameElement | null) => {
    element.current = frame;
    if (typeof forwardedRef === "function") forwardedRef(frame);
    else if (forwardedRef) forwardedRef.current = frame;
  }, [forwardedRef]);

  useEffect(() => {
    const frame = element.current;
    if (!frame) return;
    let active = true;
    const initialized = new WeakSet<Document>();
    const subscribed = new WeakSet<Document>();
    const cleanups: Array<() => void> = [];
    const initialize = (doc: Document) => {
      if (!active || frame.contentDocument !== doc || initialized.has(doc)) return;
      initialized.add(doc);
      cleanups.push(pauseOffscreenEffects(doc));
      latest.current(frame);
      // postMessage adapters and source layout effects must run before measuring.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!active || frame.contentDocument !== doc) return;
        const publish = () => {
          if (!active || frame.contentDocument !== doc || !doc.body) return false;
          // Some bridges load their motion script after receiving invitation data.
          // They keep the body hidden until that script has initialized.
          const style = doc.defaultView?.getComputedStyle(doc.body);
          if (style?.visibility === "hidden" || style?.display === "none") return false;
          doc.documentElement.dataset.fotihaInitialized = "true";
          frame.dispatchEvent(new Event(TEMPLATE_READY_EVENT));
          return true;
        };
        if (publish()) return;
        const observer = new MutationObserver(() => { if (publish()) observer.disconnect(); });
        observer.observe(doc.documentElement, { attributes: true, childList: true, subtree: true });
        cleanups.push(() => observer.disconnect());
      }));
    };
    const scan = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc || !isTemplateDocument(doc.URL, location.origin)) return;
        const navigation = frame.contentWindow?.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        if (doc.readyState === "complete" || navigation?.domContentLoadedEventEnd) {
          initialize(doc);
        } else if (!subscribed.has(doc)) {
          subscribed.add(doc);
          const ready = () => initialize(doc);
          doc.addEventListener("DOMContentLoaded", ready, { once: true });
          cleanups.push(() => doc.removeEventListener("DOMContentLoaded", ready));
        }
      } catch { /* A frame being replaced does not have an accessible document yet. */ }
    };
    // Navigating an iframe replaces its Document without mutating the parent DOM.
    // Poll only during navigation; stop once its normal load event has arrived.
    const timer = setInterval(scan, 50);
    const loaded = () => {
      const doc = frame.contentDocument;
      // Some preserved source runtimes install their listeners on window.load.
      if (doc && initialized.has(doc)) latest.current(frame);
      else scan();
      clearInterval(timer);
    };
    frame.addEventListener("load", loaded);
    scan();
    if (frame.contentDocument?.readyState === "complete" && initialized.has(frame.contentDocument)) clearInterval(timer);
    return () => {
      active = false;
      clearInterval(timer);
      frame.removeEventListener("load", loaded);
      cleanups.forEach(cleanup => cleanup());
    };
  }, [props.src]);

  return <iframe {...props} ref={setRef} />;
});
