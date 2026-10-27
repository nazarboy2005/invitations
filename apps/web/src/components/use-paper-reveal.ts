"use client";

import { useEffect, useRef } from "react";
import type { PaperRenderer } from "./paper-reveal-engine";
import { paperEase, paperHash } from "./paper-reveal-motion";
import { printPaperCaption } from "./paper-print";
import { paperExpansion, paperOpenLayout } from "./paper-layout";

/** One shared, demand-driven WebGL engine; each paper keeps only a 2D presentation canvas. */
export function usePaperReveal(
  image: string,
  shape: number,
  open: boolean,
  name: string,
  description: string,
) {
  const root = useRef<HTMLAnchorElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const setTarget = useRef<(open: boolean) => void>(() => {});

  useEffect(() => setTarget.current(open), [open]);

  useEffect(() => {
    const el = root.current;
    const surface = canvas.current;
    if (!el || !surface) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let visible = false;
    let near = false;
    let frame = 0;
    let renderer: PaperRenderer | null = null;
    let release: ((r: PaperRenderer) => void) | undefined;
    let loading = false;
    let failed = false;
    let loaded = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let progress = 1;
    let from = 1;
    let target = 1;
    let started = 0;
    let last = 0;
    let rake = 0.27;
    let rakeAngle = 0.85;
    let lift = 0;
    let lightX = 0;
    let lightY = 0;
    let pointerNear = false;
    let openScale = 1;
    let openShiftX = 0;
    let openShiftY = 0;
    const key = `visol-paper-${shape}`;
    const seed = shape - 1;
    const hash = (salt: number) => paperHash(seed, salt);

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    function fallback() {
      failed = true;
      stop();
      delete el!.dataset.rendered;
    }
    function options() {
      return {
        width,
        height,
        margin: Math.round(Math.max(width, height) * 0.35),
        dpr,
        creases: 0.6,
        creaseAngle: 48,
        lift: 0.004,
        ballSize: 1.4,
        paper: "#F4F0E7",
        gloss: 0.35,
        grain: 1,
        rakeElev: 0.32,
        inset: [0, 0, 0, 0],
        radii: [0, 0, 0, 0],
        shadow: "rgba(72, 51, 26, 0.26)",
        shadowAmt: 1.15,
        ao: 1,
        show: 0.5,
        // Upper-right sunlight projects the actual mesh shadow to lower-left.
        keyDir: [0.48, 0.53, 0.7],
        fillDir: [-0.5, -0.3, 0.81],
        seed: 7,
      };
    }
    function draw(now: number) {
      frame = 0;
      if (
        disposed ||
        !visible ||
        document.hidden ||
        reduced.matches ||
        failed ||
        !renderer ||
        !loaded ||
        !width
      )
        return;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const elapsed = Math.min(1, Math.max(0, (now - started) / 1200));
      progress = from + (target - from) * paperEase(elapsed);
      const expansion = paperExpansion(progress);
      el!.style.setProperty(
        "--paper-scale",
        String(1 + (openScale - 1) * expansion),
      );
      el!.style.setProperty("--paper-shift-x", `${openShiftX * expansion}px`);
      el!.style.setProperty("--paper-shift-y", `${openShiftY * expansion}px`);
      const desiredAngle = pointerNear
        ? Math.atan2(-(lightY - height / 2), lightX - width / 2)
        : 0.85;
      const delta = Math.atan2(
        Math.sin(desiredAngle - rakeAngle),
        Math.cos(desiredAngle - rakeAngle),
      );
      const desiredRake = pointerNear
        ? 0.6 *
          (0.45 +
            0.55 *
              Math.max(
                0,
                1 -
                  Math.hypot(lightX - width / 2, lightY - height / 2) /
                    Math.hypot(width, height),
              ))
        : 0.27;
      rakeAngle += delta * (1 - Math.exp(-dt * 7));
      rake += (desiredRake - rake) * (1 - Math.exp(-dt * 7));
      const desiredLift = target === 0 ? 1 : 0;
      lift += (desiredLift - lift) * (1 - Math.exp(-dt * 6));
      try {
        if (!renderer.scene.creaseReady(width, height, dpr, 7)) {
          // Preserve the source's crease builder, with a smaller per-frame work budget.
          renderer.scene.pumpCrease(3, now);
          kick();
          return;
        }
        const { pw, ph } = renderer.scene.render(options(), [
          {
            key,
            x: 0,
            y: 0,
            w: width,
            h: height,
            progress,
            tiltAxis: hash(1) * Math.PI * 2,
            tilt: (0.3 + 0.55 * hash(2)) * (hash(3) < 0.5 ? -1 : 1),
            spin: hash(4) * Math.PI * 2,
            flatRot: (hash(5) - 0.5) * 0.03,
            offX: (hash(6) - 0.5) * 0.08,
            offY: (hash(7) - 0.5) * 0.06,
            curl: [8, 9, 10, 11].map((s) => Math.pow(hash(s), 2)),
            rake,
            rakeAngle,
            focus: [0.5, 0.5],
            flip: [hash(12) < 0.5 ? 0 : 1, hash(13) < 0.5 ? 0 : 1],
            hoverLift: lift,
            fold: 2,
            foldJitter: [14, 15, 16].map((s) => hash(s) * 2 - 1),
          },
        ]);
        if (surface!.width !== pw || surface!.height !== ph) {
          surface!.width = pw;
          surface!.height = ph;
        }
        const ctx = surface!.getContext("2d");
        if (!ctx) return fallback();
        ctx.clearRect(0, 0, pw, ph);
        ctx.drawImage(
          renderer.canvas,
          0,
          renderer.canvas.height - ph,
          pw,
          ph,
          0,
          0,
          pw,
          ph,
        );
        el!.dataset.rendered = "true";
        if (
          (elapsed < 1 && progress !== target) ||
          Math.abs(delta) > 0.002 ||
          Math.abs(desiredRake - rake) > 0.002 ||
          Math.abs(desiredLift - lift) > 0.002 ||
          renderer.scene.fading(key)
        )
          kick();
      } catch {
        fallback();
      }
    }
    function kick() {
      if (
        !frame &&
        visible &&
        !document.hidden &&
        !reduced.matches &&
        !failed &&
        !disposed
      )
        frame = requestAnimationFrame(draw);
    }
    function measure() {
      width = el!.clientWidth;
      height = el!.clientHeight;
      const slot = el!.closest<HTMLElement>("[data-paper-slot]");
      const grid = el!.closest<HTMLElement>("[data-paper-grid]");
      const bounds = el!.closest<HTMLElement>("[data-paper-bounds]");
      if (slot && grid && bounds) {
        // Read stable slots, not the animated anchor's transformed bounds.
        const box = (item: Element) => {
          const rect = item.getBoundingClientRect();
          const sheet = item.querySelector("a")!;
          return {
            left: rect.left + (rect.width - sheet.clientWidth) / 2,
            top: rect.top + (rect.height - sheet.clientHeight) / 2,
            width: sheet.clientWidth,
            height: sheet.clientHeight,
          };
        };
        const section = bounds.getBoundingClientRect();
        const heading = bounds
          .querySelector("[data-paper-heading]")!
          .getBoundingClientRect();
        const top = heading.bottom + 12;
        const layout = paperOpenLayout(
          box(slot),
          {
            left: section.left,
            top,
            width: section.width,
            height: section.bottom - 12 - top,
          },
          section,
          [...grid.querySelectorAll("[data-paper-slot]")]
            .filter((item) => item !== slot)
            .map(box),
        );
        openScale = layout.scale;
        openShiftX = layout.shiftX;
        openShiftY = layout.shiftY;
      }
      dpr = Math.min(
        matchMedia("(max-width: 700px)").matches ? 1.25 : 1.5,
        devicePixelRatio || 1,
      );
      const margin = Math.round(Math.max(width, height) * 0.35);
      Object.assign(surface!.style, {
        left: `${-margin}px`,
        top: `${-margin}px`,
        width: `${width + margin * 2}px`,
        height: `${height + margin * 2}px`,
      });
      kick();
    }
    async function load() {
      if (loading || renderer || failed || !near || reduced.matches || disposed)
        return;
      loading = true;
      try {
        const module = await import("./paper-reveal-engine");
        if (disposed || reduced.matches) return;
        const instance = await module.acquireRenderer();
        if (disposed || reduced.matches) {
          module.releaseRenderer(instance);
          return;
        }
        renderer = instance;
        release = module.releaseRenderer;
        renderer.listeners.add(fallback);
        const print = new Image();
        print.decoding = "async";
        print.src = image;
        await print.decode();
        if (disposed || reduced.matches || !renderer) return;
        // Upload only the resolution the paper can actually display.
        const texture = document.createElement("canvas");
        const scale = Math.min(
          1,
          1024 / Math.max(print.naturalWidth, print.naturalHeight),
        );
        texture.width = Math.max(1, Math.round(print.naturalWidth * scale));
        texture.height = Math.max(1, Math.round(print.naturalHeight * scale));
        const ctx = texture.getContext("2d");
        if (!ctx) throw new Error("Paper image unavailable");
        const titleFamily = getComputedStyle(
          el!.querySelector("[data-paper-name]")!,
        ).fontFamily;
        const bodyFamily = getComputedStyle(
          el!.querySelector("[data-paper-description]")!,
        ).fontFamily;
        await Promise.all([
          document.fonts.load(`500 32px ${titleFamily}`, name),
          document.fonts.load(`400 16px ${bodyFamily}`, description),
        ]);
        if (disposed || reduced.matches || !renderer) return;
        ctx.drawImage(print, 0, 0, texture.width, texture.height);
        printPaperCaption(
          ctx,
          texture.width,
          texture.height,
          name,
          description,
          titleFamily,
          bodyFamily,
        );
        renderer.scene.setImage(key, texture, false);
        loaded = true;
        last = performance.now();
        kick();
      } catch {
        if (!disposed) fallback();
      } finally {
        loading = false;
      }
    }
    setTarget.current = (isOpen) => {
      const next = isOpen ? 0 : 1;
      if (next === target) return;
      from = progress;
      target = next;
      started = performance.now();
      last = started;
      kick();
    };
    function pointer(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const rect = el!.getBoundingClientRect();
      lightX = ((event.clientX - rect.left) / rect.width) * width;
      lightY = ((event.clientY - rect.top) / rect.height) * height;
      pointerNear = true;
      kick();
    }
    function leave() {
      pointerNear = false;
      kick();
    }
    function visibility() {
      if (document.hidden) stop();
      else {
        last = performance.now();
        kick();
      }
    }
    function motion() {
      if (reduced.matches) {
        stop();
        delete el!.dataset.rendered;
      } else {
        void load();
        kick();
      }
    }
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    if (el.parentElement) resize.observe(el.parentElement);
    const gallery = el.closest("[data-paper-bounds]");
    if (gallery) resize.observe(gallery);
    const observe = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        last = performance.now();
        kick();
      } else stop();
    });
    const preload = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) void load();
      },
      { rootMargin: "450px" },
    );
    observe.observe(el);
    preload.observe(el);
    el.addEventListener("pointermove", pointer);
    el.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", motion);
    return () => {
      disposed = true;
      stop();
      setTarget.current = () => {};
      observe.disconnect();
      preload.disconnect();
      resize.disconnect();
      el.removeEventListener("pointermove", pointer);
      el.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", motion);
      if (renderer) {
        renderer.listeners.delete(fallback);
        if (!renderer.lost) renderer.scene.removeItem(key);
        release?.(renderer);
      }
    };
  }, [image, shape, name, description]);

  return { root, canvas };
}
