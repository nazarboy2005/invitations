"use client";

import { useMemo, useRef, useState } from "react";
import { usePaperReveal } from "./use-paper-reveal";
import { paperInteractions } from "./paper-interactions";
import styles from "./paper-showcase.module.css";

export type ShowcasePaper = {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
};

function Paper({
  paper,
  index,
  active,
  select,
}: {
  paper: ShowcasePaper;
  index: number;
  active: boolean;
  select: (id: string | null) => void;
}) {
  const { root, canvas } = usePaperReveal(
    paper.image,
    index + 1,
    active,
    paper.name,
    paper.description,
  );
  const activeRef = useRef(active);
  activeRef.current = active;
  const interaction = useMemo(
    () =>
      paperInteractions({
        id: paper.id,
        isActive: () => activeRef.current,
        select,
        keyboardPaperFocused: () =>
          !!document.activeElement?.matches("[data-paper-id]:focus-visible"),
      }),
    [paper.id, select],
  );
  return (
    <article className={styles.item} data-open={active}>
      <a
        ref={root}
        className={styles.paper}
        href={paper.href}
        aria-label={`${paper.name} — taklifnomani ko‘rish`}
        aria-describedby={`paper-description-${paper.id}`}
        data-paper-id={paper.id}
        {...interaction}
      >
        {/* Native cover/link remain available without WebGL, reduced motion or JavaScript. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.fallback}
          src={paper.image}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className={styles.creases} aria-hidden="true" />
        <span className={styles.printCaption}>
          <span className={styles.name} data-paper-name>
            {paper.name}
          </span>
          <span
            className={styles.description}
            data-paper-description
            id={`paper-description-${paper.id}`}
          >
            {paper.description}
          </span>
        </span>
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
      </a>
    </article>
  );
}

export function PaperShowcase({ papers }: { papers: ShowcasePaper[] }) {
  const [active, setActive] = useState<string | null>(null);
  if (!papers.length) return null;
  return (
    <section
      id="paper-showcase"
      className={styles.section}
      aria-labelledby="paper-title"
    >
      <picture className={styles.backdrop} aria-hidden="true">
        <source
          media="(max-width: 700px)"
          srcSet="/images/home/paper/gallery-mobile.webp"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home/paper/gallery-desktop.webp"
          alt=""
          width={1674}
          height={940}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className={`container ${styles.inner}`}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Taklifnomalar galereyasi</p>
          <h2 id="paper-title">
            Bir taklif.
            <br />
            <em>Bir go‘zal hikoya.</em>
          </h2>
        </div>
        <div className={styles.papers}>
          {papers.map((paper, index) => (
            <Paper
              key={paper.id}
              paper={paper}
              index={index}
              active={active === paper.id}
              select={setActive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
