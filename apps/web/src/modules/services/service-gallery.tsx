"use client";

import Image from "next/image";
import {
  ChevronLeft, ChevronRight, Expand, ImageIcon, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { publicAsset } from "@/lib/public-asset";
import type { ServiceImage } from "./services-data";
import styles from "./services.module.css";

export function ServiceGallery({
  images,
  name,
}: {
  images: ServiceImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [interaction, setInteraction] = useState(0);
  const gallery = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    updateMotion();
    motion.addEventListener("change", updateMotion);
    let onScreen = false;
    const updateVisibility = () => setVisible(onScreen && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        updateVisibility();
      },
      { threshold: 0.5 },
    );
    if (gallery.current) observer.observe(gallery.current);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);
  useEffect(() => {
    if (images.length < 2 || interacting || expanded || !visible || reducedMotion)
      return;
    const timer = window.setTimeout(() => {
      setAnimate(true);
      setActive((index) => index + 1);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [active, images.length, interacting, expanded, visible, reducedMotion, interaction]);
  const activeIndex = images.length ? (active + images.length) % images.length : 0;
  const image = images[activeIndex];
  const move = (direction: number) => {
    setAnimate(true);
    setInteraction((value) => value + 1);
    setActive((index) =>
      reducedMotion
        ? (index + direction + images.length) % images.length
        : Math.max(-1, Math.min(images.length, index + direction)),
    );
  };
  if (!image)
    return (
      <div className={styles.galleryEmpty}>
        <ImageIcon size={40} strokeWidth={1} />
        <p>Rasm kiritilmagan</p>
      </div>
    );
  const controls = (
    <>
      <button
        type="button"
        className={styles.galleryPrevious}
        aria-label="Oldingi rasm"
        onClick={() => move(-1)}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        className={styles.galleryNext}
        aria-label="Keyingi rasm"
        onClick={() => move(1)}
      >
        <ChevronRight size={22} />
      </button>
    </>
  );
  return (
    <section
      ref={gallery}
      className={styles.gallery}
      aria-label={`${name} rasmlari`}
      onPointerDown={() => setInteracting(true)}
      onPointerUp={() => {
        setInteracting(false);
        setInteraction((value) => value + 1);
      }}
      onPointerCancel={() => setInteracting(false)}
      onPointerLeave={() => setInteracting(false)}
    >
      <div className={styles.galleryMain}>
        <button
          type="button"
          className={styles.openImage}
          aria-label="Rasmni kattalashtirish"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            dragStart.current = { x: event.clientX, y: event.clientY };
            swiped.current = false;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!dragStart.current || images.length < 2) return;
            const distance = event.clientX - dragStart.current.x;
            const vertical = event.clientY - dragStart.current.y;
            if (Math.abs(distance) > Math.abs(vertical)) {
              setDragOffset(distance);
            }
          }}
          onPointerUp={(event) => {
            if (dragStart.current !== null) {
              const distance = event.clientX - dragStart.current.x;
              const vertical = event.clientY - dragStart.current.y;
              if (Math.abs(distance) > 40 && Math.abs(distance) > Math.abs(vertical) && images.length > 1) {
                swiped.current = true;
                move(distance < 0 ? 1 : -1);
              }
            }
            dragStart.current = null;
            setDragOffset(0);
            setInteracting(false);
          }}
          onPointerCancel={() => {
            dragStart.current = null;
            setDragOffset(0);
            setInteracting(false);
          }}
          onDragStart={(event) => event.preventDefault()}
          onClick={() => {
            if (swiped.current) {
              swiped.current = false;
              return;
            }
            dialog.current?.showModal();
            setExpanded(true);
          }}
        >
          <span
            className={styles.galleryTrack}
            onTransitionEnd={(event) => {
              // Reset the cloned edge slide without animating to keep looping seamless.
              if (event.propertyName === "transform" && active !== activeIndex) {
                setAnimate(false);
                setActive(activeIndex);
              }
            }}
          >
            {(images.length > 1 ? [images[images.length - 1], ...images, images[0]] : images).map((item, slideIndex) => {
              const index = slideIndex - (images.length > 1 ? 1 : 0);
              return (
                <span
                  key={`${item.src}-${index}`}
                  className={styles.gallerySlide}
                  style={{
                    transform: `translateX(calc(${(index - active) * 100}% + ${dragOffset}px))`,
                    transition: dragOffset || !animate ? "none" : undefined,
                  }}
                  aria-hidden={index !== active}
                >
                  <Image
                    src={publicAsset(item.src)}
                    unoptimized={item.src.startsWith("/api/")}
                    alt={item.alt || name}
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    sizes="(max-width: 900px) 92vw, 60vw"
                    loading="eager"
                    draggable={false}
                  />
                </span>
              );
            })}
          </span>
          <span className={styles.expandIcon}>
            <Expand size={18} />
          </span>
        </button>
        {images.length > 1 && controls}
        <span
          className={styles.galleryCount}
          aria-live={reducedMotion ? "polite" : "off"}
          aria-atomic="true"
        >
          {activeIndex + 1} / {images.length}
        </span>
        {images.length > 1 && (
          <div className={styles.galleryDots} aria-label="Rasm tanlash">
            {images.map((item, index) => (
              <button
                type="button"
                key={`${item.src}-${index}`}
                aria-label={`${index + 1}-rasm`}
                aria-pressed={index === activeIndex}
                onClick={() => { setAnimate(true); setActive(index); setInteraction((value) => value + 1); }}
              />
            ))}
          </div>
        )}
      </div>
      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label={`${name}: kattalashtirilgan rasm`}
        onClose={() => { setExpanded(false); setInteracting(false); }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (images.length < 2) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        <button
          type="button"
          className={styles.lightboxClose}
          aria-label="Rasmni yopish"
          onClick={() => dialog.current?.close()}
        >
          <X size={24} />
        </button>
        <div className={styles.lightboxImage}>
          <Image
            src={publicAsset(image.src)}
            unoptimized={image.src.startsWith("/api/")}
            alt={image.alt || name}
            fill
            sizes="95vw"
          />
        </div>
        {images.length > 1 && controls}
        <span className={styles.galleryCount}>
          {activeIndex + 1} / {images.length}
        </span>
      </dialog>
    </section>
  );
}
