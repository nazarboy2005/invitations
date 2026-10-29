import { useEffect, type RefObject } from "react";

export type PreviewTarget =
  "names" | "location" | "gallery" | "music" | "rsvp" | "gift" | "contacts";
const targets: Record<PreviewTarget, string> = {
  names: "#fs-hero-n1, #env-name1, #mp-hero-a, #tv-hero-a, #hero, #home, #invitation, .hero, [data-cloud-castle-hero]",
  location:
    '#fs-venue-name, #env-venue-name, #mp-venue-name, #tv-venue-name, #location, #venue, #map, #address, #event, .location-section, .venue-section, [data-landing-screenshot-id="invite-map"]',
  gallery:
    "#gallery, #photos, #memories, .gallery-section, [data-chorlove-story]",
  music: "#music, #gallery, #hero",
  rsvp: "#env-rsvp-block, #mp-info-rsvp, #tv-info-rsvp, #rsvp, #attendance, #confirmation, .rsvp-section",
  gift: "#gift, #gifts, #wedding-gift, .gift-section, [data-chorlove-gift]",
  contacts: "#contact, #contacts, footer, [data-chorlove-contacts]",
};
const openerSelector =
  "#splash-open, #os-open, #oy-open, #mw-open, #splash.splash[onclick], #fs-open, #env-stage, #mp-open, #tv-open, #open-invitation, #open-prompt, #open-btn, #openBtn, #openEnvelope, #si-opener, [data-gg-source-opening], [data-landing-screenshot-id='invite-envelope']";

/** Operates only on our same-origin preview; never touches the public renderer. */
export function useStudioPreview(
  host: RefObject<HTMLDivElement | null>,
  templateId: string | undefined,
  target: PreviewTarget,
) {
  useEffect(() => {
    const root = host.current;
    if (!root || !templateId) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cleanups: Array<() => void> = [];
    const subscribed = new WeakSet<HTMLIFrameElement>();
    function prepare(doc: Document) {
      if (doc.documentElement.hasAttribute("data-awaiting-data")) return;
      if (doc.documentElement.dataset.studioOpened !== "true") {
        const opener = doc.querySelector<HTMLElement>(openerSelector);
        if (opener) {
          doc.documentElement.dataset.studioOpened = "true";
          opener.click();
          if (templateId === "doira") {
            timers.push(
              setTimeout(() => opener.click(), 450),
              setTimeout(() => opener.click(), 900),
            );
          }
        }
      }
      const scene = doc.querySelector<HTMLElement>(targets[target]);
      if (scene && doc !== document) {
        // scrollIntoView can also move the outer editor page across iframe boundaries.
        // Move only the invitation's own scrolling surface.
        let container = scene.parentElement;
        while (container && container !== doc.documentElement) {
          const overflow =
            doc.defaultView?.getComputedStyle(container).overflowY;
          if (
            (overflow === "auto" || overflow === "scroll") &&
            container.scrollHeight > container.clientHeight
          )
            break;
          container = container.parentElement;
        }
        if (container && container !== doc.documentElement) {
          container.scrollTo({
            top:
              container.scrollTop +
              scene.getBoundingClientRect().top -
              container.getBoundingClientRect().top,
            behavior: "instant",
          });
        } else
          doc.defaultView?.scrollTo({
            top:
              (doc.defaultView?.scrollY ?? 0) +
              scene.getBoundingClientRect().top,
            behavior: "instant",
          });
      } else if (scene && root?.contains(scene))
        root.scrollTop = Math.max(0, scene.offsetTop - root.offsetTop);
    }
    function attach() {
      root?.querySelectorAll<HTMLIFrameElement>("iframe").forEach((frame) => {
        if (subscribed.has(frame)) return;
        subscribed.add(frame);
        const update = () => {
          timers.push(
            setTimeout(() => {
              try {
                const doc = frame.contentDocument;
                if (
                  !doc ||
                  doc.readyState !== "complete" ||
                  !(
                    doc.URL.startsWith(`${location.origin}/templates/`) ||
                    frame.hasAttribute("srcdoc")
                  )
                )
                  return;
                prepare(doc);
                timers.push(setTimeout(() => prepare(doc), 1400));
              } catch {
                /* Unsupported preview frames remain fully interactive. */
              }
            }, 350),
          );
        };
        frame.addEventListener("load", update);
        update();
        cleanups.push(() => frame.removeEventListener("load", update));
      });
    }
    attach();
    // Native renderers use the same explicit invitation-opening controls.
    const nativeOpener = root.querySelector<HTMLElement>(openerSelector);
    if (nativeOpener && !root.querySelector("iframe")) nativeOpener.click();
    const observer = new MutationObserver(attach);
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [host, templateId, target]);
}
