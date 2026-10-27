"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { InvitationStepArtwork } from "./invitation-step-artwork";
import {
  invitationProcessProgress,
  invitationStepState,
} from "./invitation-process-motion";
import styles from "./invitation-steps.module.css";
import { createSoundProgress } from "./site-sound-progress";
import { playSiteSound } from "./site-sound";
import {
  stableProcessViewport,
  type ProcessViewport,
} from "./process-viewport";

const steps = [
  {
    title: "Ko‘nglingizga mosini tanlang",
    text: "Turli uslubdagi nafis dizaynlar. Katta kuningiz uchun eng mosini toping.",
    href: "/templates",
  },
  {
    title: "O‘z hikoyangizni qo‘shing",
    text: "Ismlar, sana, manzil va samimiy so‘zlaringiz. Har bir tafsilotda siz.",
    href: "/studio",
  },
  {
    title: "Yaqinlaringizni chorlang",
    text: "Tayyor taklifnomangiz havolasini ulashing. Quvonchli kunga birga hozirlik ko‘ring.",
    href: "/dashboard",
  },
];

/** A single, reversible scroll value drives the rail and all three illustrations. */
export function InvitationProcess() {
  const process = useRef<HTMLDivElement>(null);
  const viewportProbe = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = process.current;
    if (!root) return;
    const track = root.closest<HTMLElement>("[data-invitation-track]");
    const stage = root.closest<HTMLElement>("section");
    const pinnedStage = root.closest<HTMLElement>("[data-invitation-stage]");
    if (!track || !stage || !pinnedStage) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const phone = matchMedia("(max-width: 700px)");
    let frame = 0;
    let visible = false;
    let start = 0;
    let distance = 1;
    let pinned = false;
    let viewport: ProcessViewport | undefined;
    const soundProgress = createSoundProgress(
      [
        { at: 0.015, sound: "card" },
        { at: 0.5, sound: "card" },
        { at: 0.999, sound: "card" },
      ],
      0.15,
    );

    function draw() {
      frame = 0;
      if (!root || !visible || document.hidden || reduced.matches) return;
      const phase = (scrollY - start) / distance;
      // Brief holds at either end let the first and last unlocked steps settle.
      const progress = invitationProcessProgress(phase, pinned);
      playSiteSound(soundProgress(progress));
      root.style.setProperty("--progress", progress.toFixed(5));
      items.forEach((item, i) => {
        const { unlock, focus, active } = invitationStepState(
          progress,
          i,
          phase >= 0,
        );
        item.style.setProperty("--unlock", unlock.toFixed(4));
        item.style.setProperty("--focus", focus.toFixed(4));
        item.dataset.active = String(active);
      });
    }

    function schedule() {
      if (visible && !reduced.matches && !frame)
        frame = requestAnimationFrame(draw);
    }

    function measure() {
      if (!root || !track || !stage || !pinnedStage) return;
      const rect = root.getBoundingClientRect();
      const stageHeight = stage.offsetHeight;
      viewport = stableProcessViewport(
        viewport,
        {
          width: innerWidth,
          height: phone.matches
            ? Math.min(
                innerHeight,
                viewportProbe.current?.offsetHeight || innerHeight,
              )
            : innerHeight,
        },
        phone.matches,
      );
      const viewportHeight = viewport.height;
      // On phones, keep the heading in view too; short screens scroll normally.
      const requiredHeight = phone.matches
        ? (root.parentElement?.offsetHeight ?? stageHeight)
        : rect.height;
      pinned = !reduced.matches && requiredHeight + 32 <= viewportHeight;
      // Pin slightly earlier, using part of the bottom padding as breathing room.
      const stageTop = phone.matches
        ? 0
        : Math.min(0, viewportHeight - stageHeight + 32);
      distance = pinned
        ? viewportHeight * 1.45
        : rect.height + viewportHeight * 0.12;
      track.style.setProperty("--stage-top", `${stageTop}px`);
      // Both sections share the pin so the gallery stays attached throughout.
      track.style.setProperty(
        "--stage-height",
        `${pinnedStage.offsetHeight}px`,
      );
      track.style.setProperty("--scroll-distance", `${distance}px`);
      track.dataset.pinned = String(pinned);
      start = pinned
        ? track.getBoundingClientRect().top + scrollY - stageTop
        : rect.top + scrollY - viewportHeight * 0.78;
      // Mobile rail terminates exactly at the first/last illustration centres.
      const first = items[0];
      const last = items[items.length - 1];
      if (first && last) {
        root.style.setProperty(
          "--rail-top",
          `${first.offsetTop + first.offsetHeight / 2}px`,
        );
        root.style.setProperty(
          "--rail-height",
          `${last.offsetTop + last.offsetHeight / 2 - first.offsetTop - first.offsetHeight / 2}px`,
        );
      }
      draw();
    }

    function preference() {
      if (!root) return;
      root.dataset.motion = String(!reduced.matches);
      measure();
    }

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) measure();
      },
      { rootMargin: "100px 0px" },
    );
    const resize = new ResizeObserver(measure);
    intersection.observe(root);
    resize.observe(root);
    resize.observe(stage);
    resize.observe(pinnedStage);
    items.forEach((item) => resize.observe(item));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", preference);
    preference();

    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", preference);
      delete track.dataset.pinned;
    };
  }, []);

  return (
    <div ref={process} className={styles.process} data-invitation-process>
      <span
        ref={viewportProbe}
        className={styles.viewportProbe}
        aria-hidden="true"
      />
      <ol className={styles.steps}>
        {steps.map(({ title, text, href }, index) => (
          <li key={title} data-step>
            <Link href={href} className={styles.step}>
              <span className={styles.artwork} aria-hidden="true">
                <InvitationStepArtwork step={index} />
              </span>
              <div className={styles.stepCopy}>
                <span className={styles.number}>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
      <div className={styles.timeline} aria-hidden="true">
        <span className={styles.fill} />
        <i className={styles.marker} />
        <i className={styles.marker} />
        <i className={styles.marker} />
        <span className={styles.ball} />
      </div>
    </div>
  );
}
