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
      // Template previews run outside the public invitation route. Keep a
      // frame-level safety net so a template form cannot post visitor data if
      // its own preview handler is missing or regresses.
      if (!/^\/i\/[^/]+\/?$/.test(window.location.pathname)) {
        const frameWindow = doc.defaultView;
        if (frameWindow) {
          const previewPayloads: Array<Record<string, unknown>> = [];
          const findPreviewPayloads = (value: unknown, depth = 0) => {
            if (depth > 5 || value == null) return;
            if (typeof value === "string") {
              try { findPreviewPayloads(JSON.parse(value), depth + 1); } catch { /* Ignore non-JSON message strings. */ }
              return;
            }
            if (typeof value !== "object") return;
            if (Array.isArray(value)) {
              value.forEach((entry) => findPreviewPayloads(entry, depth + 1));
              return;
            }
            const record = value as Record<string, unknown>;
            if (record.preview === true) previewPayloads.push(record);
            for (const key of ["payload", "data", "invitation", "message", "options", "config"]) {
              findPreviewPayloads(record[key], depth + 1);
            }
          };
          const rememberPreviewPayload = (event: MessageEvent) => findPreviewPayloads(event.data);
          frameWindow.addEventListener("message", rememberPreviewPayload, true);
          cleanups.push(() => frameWindow.removeEventListener("message", rememberPreviewPayload, true));

          let previewRestoreTimer = 0;
          const allowLocalPreviewSubmission = () => {
            if (!previewPayloads.length) return;
            previewPayloads.forEach((payload) => {
              try { payload.preview = false; } catch { /* Some integrations may freeze their message payload. */ }
            });
            frameWindow.clearTimeout(previewRestoreTimer);
            // Preview handlers commonly await the mocked request before showing
            // their normal success state. Restore preview-only rendering after
            // that local success flow has completed.
            previewRestoreTimer = frameWindow.setTimeout(() => {
              previewPayloads.forEach((payload) => {
                try { payload.preview = true; } catch { /* Keep preview sandboxing best-effort per payload. */ }
              });
            }, 2000);
          };
          const previewSubmit = (event: Event) => {
            const target = event.target;
            if (target instanceof frameWindow.HTMLFormElement) allowLocalPreviewSubmission();
          };
          const previewSubmitClick = (event: MouseEvent) => {
            const target = event.target;
            if (!(target instanceof frameWindow.Element)) return;
            if (target.closest("button[type='submit'],input[type='submit'],[data-rsvp-submit],[data-wish-submit],[data-wishes-submit]")) {
              allowLocalPreviewSubmission();
            }
          };
          doc.addEventListener("submit", previewSubmit, true);
          doc.addEventListener("click", previewSubmitClick, true);
          cleanups.push(() => {
            doc.removeEventListener("submit", previewSubmit, true);
            doc.removeEventListener("click", previewSubmitClick, true);
            frameWindow.clearTimeout(previewRestoreTimer);
          });

          const nativeFetch = frameWindow.fetch.bind(frameWindow);
          frameWindow.fetch = (input, init) => {
            const requestUrl = input instanceof frameWindow.Request ? input.url : String(input);
            const method = (init?.method || (input instanceof frameWindow.Request ? input.method : "GET")).toUpperCase();
            let path = requestUrl;
            try { path = new URL(requestUrl, doc.baseURI).pathname; } catch { /* Keep the original value for matching. */ }
            const visitorSubmission = /\/api\/(?:public\/invitations\/[^/]+|i\/[^/]+)\/(?:rsvp|wishes)(?:\/|$)/i.test(path)
              || /\/api\/(?:rsvp|wishes)$/i.test(path);
            if (method === "POST" && visitorSubmission) {
              const kind = /\/wishes(?:\/|$)/i.test(path) ? "wish" : "rsvp";
              return Promise.resolve(new frameWindow.Response(
                JSON.stringify({
                  ok: true,
                  preview: true,
                  message: kind === "wish" ? "Tilagingiz yuborildi." : "Javobingiz saqlandi. Rahmat!",
                  ...(kind === "wish" ? { wishCount: 1 } : {}),
                }),
                { status: 201, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } },
              ));
            }
            return nativeFetch(input, init);
          };
        }
      }
      latest.current(frame);
      const injectVisitorControls = () => {
        if (!active || frame.contentDocument !== doc || !doc.body) return true;
        const visitor = (window as Window & {
          __fotihaVisitorState?: { invitationId: string; guestToken: string; state?: unknown };
        }).__fotihaVisitorState;
        if (!visitor?.state) return false;
        const existing = doc.querySelector<HTMLScriptElement>("script[data-fotiha-visitor-controls]");
        if (existing) return true;
        const script = doc.createElement("script");
        script.dataset.fotihaVisitorControls = "";
        script.src = "/templates/shared/visitor-controls.js";
        script.dataset.invitationId = visitor.invitationId;
        script.dataset.guestToken = visitor.guestToken;
        script.dataset.visitorState = JSON.stringify(visitor.state);
        doc.body.append(script);
        return true;
      };
      if (!injectVisitorControls()) {
        const visitorTimer = window.setInterval(() => {
          if (injectVisitorControls()) window.clearInterval(visitorTimer);
        }, 100);
        const visitorTimeout = window.setTimeout(() => window.clearInterval(visitorTimer), 15_000);
        cleanups.push(() => {
          window.clearInterval(visitorTimer);
          window.clearTimeout(visitorTimeout);
        });
      }
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
