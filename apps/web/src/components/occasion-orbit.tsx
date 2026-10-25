"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { clamp, ease, waterFrame } from "./occasion-water-motion";
import { occasionCaption, occasionLayout } from "./occasion-orbit-layout";
import type { WaterRenderer } from "./occasion-water";
import styles from "./occasion-orbit.module.css";

const occasions = [
  { first: "Nikoh", second: "to‘yi", image: "wedding", side: "left" },
  { first: "Tug‘ilgan", second: "kun", image: "birthday", side: "right" },
  { first: "Oilaviy", second: "tantana", image: "family", side: "left" },
  { first: "Unutilmas", second: "lahzalar", image: "memories", side: "right" },
];

/** Native-scroll water impact/rebound, followed by the four-occasion orbit. */
export function OccasionOrbit() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const root = section.current;
    const viewport = stage.current;
    if (!root || !viewport) return;
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-occasion]"),
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const short = window.matchMedia("(max-height: 520px)");
    let enabled = false;
    let visible = false;
    let disposed = false;
    let frame = 0;
    let height = 1;
    let distance = 1;
    let radiusX = 1;
    let radiusY = 1;
    let layout = occasionLayout(1366, 768);
    let captionHeights: number[] = [];
    let width = 1;
    let lastProgress = -1;
    let near = false;
    let renderer: WaterRenderer | null = null;
    let rendererAbort: AbortController | null = null;
    let loading = false;
    let waterFailed = false;
    let idle: number | undefined;
    let delayed: number | undefined;

    function draw() {
      frame = 0;
      if (!root || !enabled || !visible || document.hidden) return;
      // Read the live section position so font/layout changes above cannot desync it.
      const progress = clamp(-root.getBoundingClientRect().top / distance);
      if (progress === lastProgress) return;
      lastProgress = progress;
      const state = waterFrame(progress, height, width <= 700);
      const { release, orbit } = state;
      const scene = ease((release - 0.05) / 0.75);
      root.style.setProperty("--scene-opacity", String(scene));
      root.style.setProperty(
        "--orbit-shift",
        `${layout.shift * ease(release)}px`,
      );
      root.style.setProperty("--art-scale", String(0.65 + release * 0.35));
      root.style.setProperty("--drop-y", `${state.dropY.toFixed(2)}px`);
      root.style.setProperty("--drop-stretch", String(state.stretch));
      root.style.setProperty(
        "--drop-scale",
        String(state.radius / state.restingRadius),
      );
      root.style.setProperty("--orb-opacity", String(state.handoff));
      root.style.setProperty(
        "--canvas-opacity",
        state.handoff === 1 ? "0" : "1",
      );
      root.style.setProperty("--surface-y", `${state.surfaceY}px`);
      root.style.setProperty("--water-opacity", String(state.waterOpacity));
      root.style.setProperty("--stem-top", `${state.stemTop}px`);
      root.style.setProperty(
        "--stem-height",
        `${Math.max(0, state.surfaceY - state.stemTop)}px`,
      );
      root.style.setProperty("--stem-width", `${state.stemWidth * 2}px`);
      root.style.setProperty(
        "--ripple-scale",
        String(0.15 + state.rippleAge * 0.45),
      );
      root.style.setProperty(
        "--ripple-opacity",
        String(state.rippleAge > 0 ? 0.5 * (1 - state.rippleAge / 4) : 0),
      );
      root.style.setProperty("--release", String(release));
      root.style.setProperty(
        "--label-opacity",
        String(ease(clamp((release - 0.38) / 0.45))),
      );
      nodes.forEach((node, index) => {
        const angle = layout.angles[index] + orbit * layout.rotation;
        if (width > 700) {
          const caption = occasionCaption(
            angle,
            layout.artwork,
            captionHeights[index] ?? 30,
            radiusY,
          );
          node.style.setProperty("--caption-side", String(caption.side));
          node.style.setProperty("--caption-y", `${caption.y.toFixed(2)}px`);
          node.style.setProperty("--node-scale", String(caption.scale));
          node.style.setProperty(
            "--caption-flourish",
            String(caption.flourish),
          );
        }
        node.style.setProperty(
          "--x",
          `${(Math.cos(angle) * radiusX * release).toFixed(2)}px`,
        );
        node.style.setProperty(
          "--y",
          `${(Math.sin(angle) * radiusY * release).toFixed(2)}px`,
        );
      });
      // Once HTML takes over the orb, the water GPU does no more rendering.
      if (renderer && state.handoff < 1) renderer.draw(state, width, height);
    }

    function measure() {
      if (!root || !viewport || disposed) return;
      width = viewport.clientWidth;
      height = viewport.offsetHeight;
      distance = Math.max(1, root.offsetHeight - height);
      layout = occasionLayout(width, height);
      radiusX = layout.radiusX;
      radiusY = layout.radiusY;
      root.style.setProperty("--radius-x", `${radiusX}px`);
      root.style.setProperty("--radius-y", `${radiusY}px`);
      root.style.setProperty("--art-width", `${layout.artwork}px`);
      root.style.setProperty("--caption-width", `${layout.caption}px`);
      if (width <= 700)
        nodes.forEach((node) => {
          [
            "--caption-side",
            "--caption-y",
            "--node-scale",
            "--caption-flourish",
          ].forEach((name) => node.style.removeProperty(name));
        });
      captionHeights = nodes.map(
        (node) =>
          node.querySelector<HTMLElement>(`.${styles.label}`)?.offsetHeight ??
          30,
      );
      lastProgress = -1;
      draw();
    }

    function schedule() {
      if (enabled && visible && !document.hidden && !frame)
        frame = requestAnimationFrame(draw);
    }

    function stopWater() {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (delayed !== undefined) window.clearTimeout(delayed);
      idle = delayed = undefined;
      rendererAbort?.abort();
      rendererAbort = null;
      renderer?.dispose();
      renderer = null;
      loading = false;
      if (canvas.current) {
        canvas.current.width = 1;
        canvas.current.height = 1;
      }
      root?.removeAttribute("data-water-ready");
    }

    function warmWater() {
      if (
        !enabled ||
        !near ||
        disposed ||
        loading ||
        renderer ||
        waterFailed ||
        document.hidden ||
        !canvas.current
      )
        return;
      loading = true;
      const controller = new AbortController();
      rendererAbort = controller;
      const load = async () => {
        idle = delayed = undefined;
        try {
          const { createWaterRenderer } = await import("./occasion-water");
          if (controller.signal.aborted || disposed || !canvas.current) return;
          const result = await createWaterRenderer(
            canvas.current,
            controller.signal,
          );
          if (controller.signal.aborted || disposed || !enabled) {
            result?.dispose();
            return;
          }
          if (!result) {
            waterFailed = true;
            return;
          }
          renderer = result;
          root!.dataset.waterReady = "true";
          lastProgress = -1;
          schedule();
        } catch {
          waterFailed = true; // The CSS water and the complete timeline remain usable.
        } finally {
          if (rendererAbort === controller) loading = false;
        }
      };
      if (typeof window.requestIdleCallback === "function")
        idle = window.requestIdleCallback(() => void load(), { timeout: 600 });
      else delayed = window.setTimeout(() => void load(), 80);
    }

    function waterLost() {
      waterFailed = true;
      stopWater();
      lastProgress = -1;
      schedule();
    }

    function visibilityChanged() {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        lastProgress = -1;
        warmWater();
        schedule();
      }
    }

    function resetMotion() {
      if (!root) return;
      [
        "--drop-y",
        "--drop-stretch",
        "--drop-scale",
        "--orb-opacity",
        "--canvas-opacity",
        "--surface-y",
        "--water-opacity",
        "--stem-top",
        "--stem-height",
        "--stem-width",
        "--ripple-scale",
        "--ripple-opacity",
        "--release",
        "--label-opacity",
        "--scene-opacity",
        "--orbit-shift",
        "--art-scale",
      ].forEach((name) => root.style.removeProperty(name));
      nodes.forEach((node) => {
        node.style.removeProperty("--x");
        node.style.removeProperty("--y");
        [
          "--caption-side",
          "--caption-y",
          "--node-scale",
          "--caption-flourish",
        ].forEach((name) => node.style.removeProperty(name));
      });
    }

    function syncPreference() {
      if (!root) return;
      enabled = !reduced.matches && !short.matches;
      if (enabled) root.dataset.orbitReady = "true";
      else {
        root.removeAttribute("data-orbit-ready");
        stopWater();
        resetMotion();
      }
      measure();
      warmWater();
    }

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) measure();
      },
      { rootMargin: "0px" },
    );
    const preload = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) warmWater();
      },
      { rootMargin: "200px 0px" },
    );
    const resize = new ResizeObserver(measure);
    intersection.observe(root);
    preload.observe(root);
    resize.observe(viewport);
    window.addEventListener("scroll", schedule, { passive: true });
    reduced.addEventListener("change", syncPreference);
    short.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", visibilityChanged);
    const waterCanvas = canvas.current;
    waterCanvas?.addEventListener("webglcontextlost", waterLost);
    syncPreference();
    void document.fonts.ready.then(measure);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      intersection.disconnect();
      preload.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      reduced.removeEventListener("change", syncPreference);
      short.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", visibilityChanged);
      waterCanvas?.removeEventListener("webglcontextlost", waterLost);
      stopWater();
      root.removeAttribute("data-orbit-ready");
      resetMotion();
    };
  }, []);

  return (
    <section
      ref={section}
      id="occasions"
      className={styles.section}
      aria-labelledby="occasions-title"
    >
      <div ref={stage} className={styles.stage}>
        <div className={styles.atmosphere} aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <canvas
          ref={canvas}
          className={styles.waterCanvas}
          aria-hidden="true"
        />
        <div className={styles.waterFallback} aria-hidden="true">
          <div className={styles.pool} />
          <span className={styles.ripple} />
          <span className={styles.ripple} />
          <span className={styles.ripple} />
          <span className={styles.stem} />
        </div>
        <div className={styles.sceneHeading}>
          <p className={styles.eyebrow}>Tadbirlar</p>
          <h2 id="occasions-title">Unutilmas lahzalar</h2>
          <p className={styles.introduction}>
            Har bir tadbir — o‘ziga xos hikoya.
            <br />
            Biz uni go‘zal taklifnomalar bilan boshlaymiz.
          </p>
        </div>
        <div className={styles.path} aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className={styles.centre}>
          <span className={styles.coreRipples} aria-hidden="true" />
          <span className={styles.drop} aria-hidden="true">
            <span className={styles.jewel} />
          </span>
        </div>
        <ul
          className={styles.occasions}
          aria-label="Quvonchli kunlaringiz uchun"
        >
          {occasions.map(({ first, second, image, side }, index) => (
            <li key={first} data-occasion data-side={side}>
              <div className={styles.artwork}>
                <Image
                  src={`/images/home/occasions/${image}-silk.webp`}
                  width={600}
                  height={450}
                  alt=""
                  unoptimized
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
              <div className={styles.caption}>
                <span className={styles.number} aria-hidden="true">
                  0{index + 1}
                  <i />
                  <b>✦</b>
                </span>
                <h3 className={styles.label}>
                  {first}
                  <span className={styles.wordBreak}> </span>
                  {second}
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
