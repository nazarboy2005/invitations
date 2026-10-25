"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye, X } from "lucide-react";
import { formatPrice, type TemplateDefinition } from "@taklifnoma/contracts";
import { TemplateCardPreview } from "./template-card-preview";
import { templatePoster } from "./template-poster";
import styles from "./template-detail-dialog.module.css";

export function TemplateDetailDialog({
  template,
  returnFocus,
  onClose,
}: {
  template: TemplateDefinition;
  returnFocus: HTMLButtonElement | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const [opening, setOpening] = useState(true);
  const closeRequested = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  function requestClose() {
    if (closeRequested.current) return;
    closeRequested.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) onClose();
    else setClosing(true);
  }

  // Keep the dialog, focus trap, and scroll lock until its exit finishes.
  useEffect(() => {
    if (!closing) return;
    const panel = dialog.current?.querySelector<HTMLElement>("section");
    const exit = panel?.getAnimations()[0];
    let active = true;
    const finish = () => {
      if (active) onClose();
    };
    if (exit) void exit.finished.then(finish, finish);
    else finish();
    return () => {
      active = false;
    };
  }, [closing, onClose]);
  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    const paddingRight = root.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    if (scrollbarWidth > 0)
      root.style.paddingRight = `${parseFloat(getComputedStyle(root).paddingRight) + scrollbarWidth}px`;
    root.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("catalog-dialog", { detail: true }));
    // React's autoFocus prop calls focus during mount; the native dialog
    // algorithm also needs the attribute before showModal selects a target.
    element.setAttribute("autofocus", "");
    element.showModal();
    // Focus the stationary dialog first: focusing an offscreen, moving button
    // makes the browser scroll the entrance animation into view.
    element.focus({ preventScroll: true });
    element.scrollTop = 0;
    let active = true;
    const entered = () => {
      if (!active || closeRequested.current) return;
      setOpening(false);
      element
        .querySelector<HTMLButtonElement>("button")
        ?.focus({ preventScroll: true });
    };
    const entrance = element.querySelector("section")?.getAnimations()[0];
    if (entrance) void entrance.finished.then(entered, entered);
    else entered();
    return () => {
      active = false;
      element.close();
      root.style.overflow = overflow;
      root.style.paddingRight = paddingRight;
      window.dispatchEvent(
        new CustomEvent("catalog-dialog", { detail: false }),
      );
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [returnFocus]);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      tabIndex={-1}
      autoFocus
      data-opening={opening || undefined}
      data-closing={closing || undefined}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section className={styles.panel}>
        <span className={styles.handle} aria-hidden="true" />
        <button
          type="button"
          className={styles.close}
          aria-label="Yopish"
          onClick={requestClose}
        >
          <X size={20} />
        </button>
        <div className={styles.deviceArea}>
          <div
            className={styles.phone}
            aria-label={`${template.name}: telefon ko‘rinishi`}
          >
            <div className={styles.screen}>
              {/* The poster remains visible while the one real renderer loads. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={templatePoster(template)}
                alt=""
                className={styles.poster}
              />
              {!opening && <TemplateCardPreview templateId={template.id} />}
            </div>
            <span className={styles.notch} aria-hidden="true" />
          </div>
        </div>
        <div className={styles.details}>
          <p className={styles.eyebrow}>Sizning taklifnomangiz</p>
          <h2 id={titleId}>{template.name}</h2>
          <p id={descriptionId} className={styles.description}>
            {template.description}
          </p>
          <p className={styles.price}>{formatPrice(template.priceMinor)}</p>
          {!template.published && <p>Faqat ko‘rib chiqish uchun</p>}
          <div className={styles.actions}>
            <Link
              prefetch={false}
              className={styles.view}
              href={`/preview?template=${encodeURIComponent(template.id)}`}
            >
              <Eye size={17} /> To‘liq ko‘rish
            </Link>
            {template.published && (
              <Link
                prefetch={false}
                className={styles.create}
                href={`/studio?new=1&template=${encodeURIComponent(template.id)}`}
              >
                Yaratish <ArrowUpRight size={17} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </dialog>
  );
}
