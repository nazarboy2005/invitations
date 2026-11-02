"use client";

import { useEffect } from "react";
import { publicAsset } from "../lib/public-asset";

type Task = { element: Element; run: () => Promise<unknown> };

/** Download in page order without starting offscreen renderers or audio playback. */
export function LandingAssetLoader() {
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const controller = new AbortController();
    const { signal } = controller;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let idle: number | undefined;
    let timer: number | undefined;

    async function download(path: string) {
      const response = await fetch(publicAsset(path), {
        signal: AbortSignal.any([signal, AbortSignal.timeout(30_000)]),
      });
      if (!response.ok) throw new Error("Landing asset unavailable");
      await response.arrayBuffer();
    }

    function loadImage(image: HTMLImageElement) {
      return new Promise<void>((resolve) => {
        if (signal.aborted || (image.complete && image.currentSrc)) {
          resolve();
          return;
        }
        const finish = () => {
          image.removeEventListener("load", finish);
          image.removeEventListener("error", finish);
          signal.removeEventListener("abort", finish);
          window.clearTimeout(timeout);
          resolve();
        };
        const timeout = window.setTimeout(finish, 15_000);
        image.addEventListener("load", finish, { once: true });
        image.addEventListener("error", finish, { once: true });
        signal.addEventListener("abort", finish, { once: true });
        // Use the real <picture>/srcset/sizes selection, including Next images.
        image.fetchPriority = "low";
        image.loading = "eager";
      });
    }

    function start() {
      if (signal.aborted) return;
      const tasks: Task[] = [];
      const add = (element: Element, run: Task["run"]) =>
        tasks.push({ element, run });
      const sound = (element: Element, file: string) =>
        add(element, () => download(`/audio/site/${file}.mp3`));

      // DOM order is the source of truth for artwork, including dynamic catalog covers.
      for (const element of main!.querySelectorAll("section, img")) {
        if (element instanceof HTMLImageElement) {
          add(element, () => loadImage(element));
          continue;
        }
        switch (element.id) {
          case "occasions":
            add(element, async () => {
              if (!reduced.matches) await import("./occasion-water");
            });
            sound(element, "water-drop");
            sound(element, "fabric-reveal");
            break;
          case "celebration-story":
            sound(element, "air-pass");
            break;
          case "how-it-works":
            sound(element, "card-place");
            break;
          case "paper-showcase":
            add(element, async () => {
              if (!reduced.matches) await import("./paper-reveal-engine");
            });
            add(element, async () => {
              if (!reduced.matches) {
                await download(
                  `/images/home/paper/${typeof DecompressionStream === "undefined" ? "crumple.raw.bin" : "crumple.bin"}`,
                );
              }
            });
            add(element, () => download("/images/home/paper/creases.jpg"));
            sound(element, "paper-slide");
            break;
        }
      }

      function visible(task: Task) {
        const bounds = task.element.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight;
      }

      async function worker() {
        while (!signal.aborted && tasks.length) {
          // A visitor who jumps ahead gets that artwork before the queue resumes.
          const visibleIndex = tasks.findIndex(visible);
          const [task] = tasks.splice(visibleIndex < 0 ? 0 : visibleIndex, 1);
          try {
            await task.run();
          } catch {
            // Optional warming must never block remaining assets or normal rendering.
          }
        }
      }

      // Keep progressing without scrolling, including on slower/data-saving connections.
      // One download there avoids contention; two elsewhere keep the queue moving.
      const connection = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      const concurrency =
        connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")
          ? 1
          : 2;
      void Promise.all(Array.from({ length: concurrency }, worker));
    }

    function schedule() {
      // Let initial rendering/hero requests finish before background warming.
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(start, { timeout: 1_500 });
      } else {
        timer = window.setTimeout(start, 0);
      }
    }
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      controller.abort();
      window.removeEventListener("load", schedule);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
