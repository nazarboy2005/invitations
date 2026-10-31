"use client";
import { publicAsset } from "../lib/public-asset";


import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import {
  clampStory,
  smoothStory,
  STORY_TRAVEL,
  storyChapters,
  storyChapterState,
  storyLightRadius,
  storyPhotoFrame,
} from "./celebration-story-motion";
import styles from "./celebration-story.module.css";
import { createSoundProgress } from "./site-sound-progress";
import { playSiteSound } from "./site-sound";

/** An independent photographic interlude. The occasions/drop scene is untouched. */
export function CelebrationStory() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const viewport = stage.current;
    if (!root || !viewport) return;
    const chapters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-story-chapter]"),
    );
    const photos = chapters.map((chapter) =>
      Array.from(chapter.querySelectorAll<HTMLElement>("[data-story-photo]")),
    );
    let displayedPhotos = photos;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const short = matchMedia("(max-height: 520px)");
    let enabled = false;
    let visible = false;
    let frame = 0;
    let width = 1;
    let height = 1;
    let drift = 0;
    let previousTime = 0;
    let lastDraw = 0;
    let dirty = true;
    let active = -1;
    const soundProgress = createSoundProgress(
      [
        { at: 0.08, sound: "air" },
        { at: 1.48, sound: "air" },
        { at: 2.63, sound: "air" },
      ],
      0.28,
    );

    function draw(time: number) {
      frame = 0;
      if (!root || !enabled || !visible || document.hidden) return;
      const rect = root.getBoundingClientRect();
      const pinned = rect.top <= 1 && rect.bottom >= height - 1;
      // Gentle idle drift runs at 30fps; scroll updates run at display cadence.
      if (!dirty && time - lastDraw < 32) {
        if (pinned) frame = requestAnimationFrame(draw);
        return;
      }
      if (pinned && previousTime)
        drift += Math.min(0.06, (time - previousTime) / 1000) * 0.045;
      previousTime = pinned ? time : 0;
      lastDraw = time;
      dirty = false;
      const travel =
        clampStory(-rect.top / Math.max(1, rect.height - height)) *
        STORY_TRAVEL;
      root.dataset.storyProgress = travel.toFixed(4);
      playSiteSound(soundProgress(travel));
      root.style.setProperty(
        "--light-radius",
        `${storyLightRadius(travel, width, height).toFixed(2)}px`,
      );
      const current = travel < 1.38 ? 0 : travel < 2.53 ? 1 : 2;
      if (current !== active) {
        active = current;
        chapters.forEach((chapter, i) =>
          chapter.setAttribute("aria-hidden", String(i !== current)),
        );
      }
      chapters.forEach((chapter, chapterIndex) => {
        const { incoming, outgoing, opacity } = storyChapterState(
          travel,
          chapterIndex,
        );
        const finalChapter = chapterIndex === storyChapters.length - 1;
        const shown = opacity > 0.001 || (finalChapter && incoming > 0.01);
        chapter.style.visibility = shown ? "visible" : "hidden";
        if (!shown) return;
        chapter.style.setProperty(
          "--title-opacity",
          String(
            smoothStory((incoming - 0.16) / 0.72) *
              (finalChapter ? 1 : 1 - smoothStory(outgoing / 0.65)),
          ),
        );
        chapter.style.setProperty(
          "--title-y",
          `${((1 - incoming) * 25 - outgoing * 22).toFixed(2)}px`,
        );
        const displayed = displayedPhotos[chapterIndex];
        displayed.forEach((photo, photoIndex) => {
          const state = storyPhotoFrame({
            index: photoIndex,
            count: displayed.length,
            travel,
            chapter: chapterIndex,
            drift,
            width,
            height,
          });
          photo.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) translate(-50%, -50%) perspective(850px) rotateY(${state.tilt.toFixed(2)}deg) rotate(${state.rotation.toFixed(2)}deg) scale(${state.scale.toFixed(4)})`;
          photo.style.opacity = state.opacity.toFixed(4);
          photo.style.zIndex = String(Math.round(state.depth * 100));
        });
      });
      if (pinned && travel < STORY_TRAVEL) frame = requestAnimationFrame(draw);
    }

    function schedule() {
      dirty = true;
      if (enabled && visible && !document.hidden && !frame)
        frame = requestAnimationFrame(draw);
    }

    function measure() {
      width = viewport!.clientWidth;
      height = viewport!.offsetHeight;
      const bounds = root!.getBoundingClientRect();
      visible = bounds.top < innerHeight && bounds.bottom > 0;
      displayedPhotos = photos;
      schedule();
    }

    function preference() {
      enabled = !reduced.matches && !short.matches;
      root!.dataset.storyReady = String(enabled);
      if (!enabled) {
        cancelAnimationFrame(frame);
        frame = 0;
        chapters.forEach((chapter) => {
          chapter.removeAttribute("aria-hidden");
          chapter.removeAttribute("style");
        });
        photos.flat().forEach((photo) => {
          photo.style.removeProperty("transform");
          photo.style.removeProperty("opacity");
          photo.style.removeProperty("z-index");
        });
      }
      previousTime = 0;
      active = -1;
      measure();
    }

    function visibility() {
      previousTime = 0;
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      previousTime = 0;
      if (visible) measure();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const resize = new ResizeObserver(measure);
    intersection.observe(viewport);
    resize.observe(viewport);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preference);
    short.addEventListener("change", preference);
    preference();
    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
      short.removeEventListener("change", preference);
    };
  }, []);

  return (
    <section
      ref={section}
      className={styles.section}
      aria-labelledby="celebration-story-title"
      id="celebration-story"
    >
      <h2 id="celebration-story-title" className={styles.srOnly}>
        Har bir bayram — bir hikoya.
      </h2>
      <div ref={stage} className={styles.stage}>
        <div className={styles.botanical} aria-hidden="true">
          <Image
            src={publicAsset("/images/home/celebration/botanical.webp")}
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
            unoptimized
          />
        </div>
        <div className={styles.light} aria-hidden="true" />
        <p className={styles.eyebrow}>Hayotning go‘zal lahzalari</p>
        <div className={styles.scenes}>
          {storyChapters.map((chapter, chapterIndex) => (
            <article
              key={chapter.id}
              className={styles.chapter}
              data-story-chapter
              aria-labelledby={`story-${chapter.id}`}
            >
              <div className={styles.copy}>
                <h3 id={`story-${chapter.id}`}>
                  {chapter.first}
                  <br />
                  <em>{chapter.second}</em>
                </h3>
                <p>{chapter.text}</p>
              </div>
              <div className={styles.photographs} aria-hidden="true">
                {Array.from({ length: 12 }, (_, index) => (
                  <div
                    key={index}
                    className={styles.photo}
                    data-story-photo
                    style={
                      {
                        "--column": index < 9 ? index % 3 : index - 9,
                        "--row":
                          index < 9 ? Math.floor(index / 3) : chapterIndex,
                        "--ratio": [
                          1.2, 0.85, 1.15, 1.3, 0.92, 1.12, 0.88, 1.3, 1.05,
                          1.18, 0.9, 1.25,
                        ][index],
                      } as CSSProperties
                    }
                  >
                    <div className={styles.crop}>
                      <Image
                        src={publicAsset(`/images/home/celebration/${index < 9 ? chapter.image : "moments"}.webp`)}
                        alt=""
                        width={1254}
                        height={1254}
                        loading="lazy"
                        unoptimized
                        draggable={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
