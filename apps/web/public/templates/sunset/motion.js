/* Standalone bindings for the captured Sunset / Swan Garden source motion.
 * Opening 5.2s threshold, 6.5s fallback, .9s exit; source hero/reveal timings.
 */
(() => {
  let installed = false,
    opened = false,
    revealed = false,
    fallback = 0,
    reduced = false;
  let root, opening, video, scroll, onOpen;
  const all = (s, b = root) => [...b.querySelectorAll(s)];
  function animate(node, delay = 0, duration = 900) {
    if (!node) return;
    const initial =
      node.dataset.initial ||
      "opacity:0;transform:translateY(28px);filter:blur(6px)";
    const transform = initial.match(/transform:([^;]+)/)?.[1] || "none";
    const filter = initial.match(/filter:([^;]+)/)?.[1] || "none";
    node.style.opacity = "1";
    if (reduced) return;
    node.animate(
      [
        { opacity: 0, transform, filter },
        { opacity: 1, transform: "none", filter: "blur(0px)" },
      ],
      { duration, delay, easing: "cubic-bezier(0,0,.58,1)", fill: "backwards" },
    );
  }
  function finish() {
    if (revealed) return;
    revealed = true;
    clearTimeout(fallback);
    root.dataset.opened = "true";
    scroll.classList.remove("overflow-y-hidden");
    scroll.classList.add("overflow-y-auto");
    const nodes = all("[data-hero-reveal]");
    const delays =
      root.dataset.chorloveTemplate === "swan-garden"
        ? [200, 450, 700, 1000, 1250, 1450, 2200]
        : [200, 600, 900, 1150, 2200];
    nodes.forEach((node, index) =>
      animate(
        node,
        delays[index] ?? 2200,
        index === nodes.length - 1 ? 800 : 1100,
      ),
    );
    opening?.classList.add("opening-done");
    if (opening) {
      if (reduced) opening.hidden = true;
      else
        setTimeout(() => {
          opening.hidden = true;
          video?.pause();
        }, 950);
    }
  }
  function open() {
    if (opened) return;
    opened = true;
    onOpen?.();
    const label = opening?.querySelector("video")?.nextElementSibling;
    if (label) {
      if (reduced) label.hidden = true;
      else {
        label.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 500,
          fill: "forwards",
        });
        label.style.pointerEvents = "none";
      }
    }
    if (reduced || !video) {
      finish();
      return;
    }
    fallback = setTimeout(finish, 6500);
    video.play().catch(finish);
  }
  window.ChorloveMotion = {
    reveal: (node) => {
      if (node.dataset.revealed) return;
      node.dataset.revealed = "true";
      const program = node.matches("[data-program-row]");
      animate(
        node,
        program ? 50 * [...node.parentElement.children].indexOf(node) : 0,
        program ? 700 : 900,
      );
    },
    update: (options) => {
      root = options.root;
      onOpen = options.onOpen;
      reduced = root.classList.contains("three-reduced-motion");
      all("video").forEach((v) => {
        v.muted = true;
        if (reduced) v.pause();
        else if (v.hasAttribute("autoplay")) v.play().catch(() => {});
      });
      if (installed) {
        if (reduced && opened) finish();
        return;
      }
      installed = true;
      scroll = root.querySelector("[data-scroll]");
      opening = root.querySelector("[role=button]");
      video = opening?.querySelector("video");
      if (!opening) {
        finish();
        return;
      }
      opening.dataset.opening = "";
      opening.onclick = open;
      opening.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      };
      video?.addEventListener("timeupdate", () => {
        if (video.currentTime >= 5.2) finish();
      });
      video?.addEventListener("ended", finish);
      video?.addEventListener("error", () => {
        if (opened) finish();
      });
      // Original source scroll cue: a 1.6s repeated 0→8→0 movement.
      const cue = root.querySelector("[data-section=hero] .h-2.w-1");
      if (cue && !reduced)
        cue.animate(
          [
            { transform: "translateY(0)", opacity: 1 },
            { transform: "translateY(8px)", opacity: 0.3 },
            { transform: "translateY(0)", opacity: 1 },
          ],
          { duration: 1600, iterations: Infinity, easing: "ease-in-out" },
        );
      const label = opening.querySelector("p:last-child");
      if (label && !reduced)
        label.animate([{ opacity: 0.45 }, { opacity: 1 }, { opacity: 0.45 }], {
          duration: 2400,
          iterations: Infinity,
          easing: "ease-in-out",
        });
    },
  };
})();
