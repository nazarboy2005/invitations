"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageIcon, X } from "lucide-react";
import { useRef, useState } from "react";
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
  const dialog = useRef<HTMLDialogElement>(null);
  const image = images[active];
  const move = (direction: number) =>
    setActive((index) => (index + direction + images.length) % images.length);
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
    <section className={styles.gallery} aria-label={`${name} rasmlari`}>
      <div className={styles.galleryMain}>
        <button
          type="button"
          className={styles.openImage}
          aria-label="Rasmni kattalashtirish"
          onClick={() => dialog.current?.showModal()}
        >
          <Image
            src={publicAsset(image.src)}
            alt={image.alt || name}
            fill
            sizes="(max-width: 900px) 92vw, 60vw"
            loading="eager"
          />
          <span className={styles.expandIcon}>
            <Expand size={18} />
          </span>
        </button>
        {images.length > 1 && controls}
        <span
          className={styles.galleryCount}
          aria-live="polite"
          aria-atomic="true"
        >
          {active + 1} / {images.length}
        </span>
      </div>
      {images.length > 1 && (
        <div className={styles.thumbnails} aria-label="Rasm tanlash">
          {images.map((thumbnail, index) => (
            <button
              type="button"
              key={`${thumbnail.src}-${index}`}
              aria-label={`${index + 1}-rasm`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <Image
                src={publicAsset(thumbnail.src)}
                alt=""
                fill
                sizes="80px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label={`${name}: kattalashtirilgan rasm`}
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
            alt={image.alt || name}
            fill
            sizes="95vw"
          />
        </div>
        {images.length > 1 && controls}
        <span className={styles.galleryCount}>
          {active + 1} / {images.length}
        </span>
      </dialog>
    </section>
  );
}
