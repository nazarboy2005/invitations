/** Suspend work only while its section is outside the frame/outer viewport.
 * Keep the original animation objects, current times, and video positions. */
export function pauseOffscreenEffects(doc: Document) {
  const view = doc.defaultView;
  if (!view || !view.IntersectionObserver) return () => {};
  type Tween = {
    targets(): unknown[];
    repeat(): number;
    paused(): boolean;
    paused(value: boolean): void;
  };
  type Group = {
    visible: boolean;
    animations: Set<Animation>;
    videos: Set<HTMLVideoElement>;
    tweens: Set<Tween>;
  };
  const source = view as typeof view & {
    gsap?: {
      globalTimeline: {
        getChildren(
          nested: boolean,
          tweens: boolean,
          timelines: boolean,
        ): Tween[];
      };
    };
  };
  const groups = new Map<Element, Group>();
  const animations = new Map<Animation, Element>();
  const paused = new Set<Animation>();
  const resumeVideos = new Set<HTMLVideoElement>();
  const tweens = new Map<Tween, Element>();
  const pausedTweens = new Set<Tween>();
  const videoCleanups = new Map<HTMLVideoElement, () => void>();
  let active = true;

  const sync = (group: Group) => {
    const visible = group.visible && !doc.hidden;
    for (const animation of group.animations) {
      if (!visible && animation.playState === "running") {
        paused.add(animation);
        animation.pause();
      } else if (visible && paused.delete(animation)) {
        // Never restart a completed/cancelled animation or a source-owned pause.
        if (animation.playState === "paused") animation.play();
      }
    }
    for (const video of group.videos) {
      if (!visible && !video.paused && !video.ended) {
        resumeVideos.add(video);
        video.pause();
      } else if (
        visible &&
        resumeVideos.delete(video) &&
        video.isConnected &&
        !video.ended
      ) {
        void video.play().catch(() => {});
      }
    }
    for (const tween of group.tweens) {
      if (!visible && !tween.paused()) {
        pausedTweens.add(tween);
        tween.paused(true);
      } else if (visible && pausedTweens.delete(tween)) tween.paused(false);
    }
  };
  const observer = new view.IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const group = groups.get(entry.target);
        if (group) {
          group.visible = entry.isIntersecting;
          sync(group);
        }
      }
    },
    { rootMargin: "100px 0px" },
  );
  const groupFor = (element: Element) => {
    let group = groups.get(element);
    if (!group) {
      // Let the observer account for clipping and the outer iframe's visibility.
      group = {
        visible: true,
        animations: new Set(),
        videos: new Set(),
        tweens: new Set(),
      };
      groups.set(element, group);
      observer.observe(element);
    }
    return group;
  };
  const scopeFor = (target: Element) => {
    // Observe stable section geometry, not a petal or entrance transform that
    // travels offscreen as part of its animation and could otherwise deadlock.
    if (view.getComputedStyle(target).position === "fixed") return target;
    return (
      target.closest("section, [data-section], header, footer") ||
      target.parentElement ||
      target
    );
  };
  const scan = () => {
    if (!active) return;
    const current = new Set(doc.getAnimations());
    for (const animation of current) {
      if (
        animations.has(animation) ||
        animation.playState === "finished" ||
        animation.playState === "idle"
      )
        continue;
      // Scroll-driven effects follow their source timeline, not wall-clock time.
      if (animation.timeline !== doc.timeline) continue;
      const effect = animation.effect as KeyframeEffect | null;
      const target = effect?.target;
      if (!(target instanceof view.Element)) continue;
      const scope = scopeFor(target);
      animations.set(animation, scope);
      const group = groupFor(scope);
      group.animations.add(animation);
      sync(group);
    }
    for (const [animation, scope] of animations) {
      if (
        current.has(animation) &&
        scope.isConnected &&
        animation.playState !== "finished" &&
        animation.playState !== "idle"
      )
        continue;
      paused.delete(animation);
      groups.get(scope)?.animations.delete(animation);
      animations.delete(animation);
    }
    const sourceTweens = new Set(
      source.gsap?.globalTimeline.getChildren(true, true, false) || [],
    );
    for (const tween of sourceTweens) {
      // Pause decorative loops only. Preserve the sequencing of finite opening
      // timelines, including their source callbacks and data-binding effects.
      if (tweens.has(tween) || tween.repeat() !== -1) continue;
      const targets = tween.targets();
      if (
        !targets.length ||
        !targets.every((target) => target instanceof view.Element)
      )
        continue;
      const scopes = new Set((targets as Element[]).map(scopeFor));
      if (scopes.size !== 1) continue;
      const scope = scopes.values().next().value!;
      tweens.set(tween, scope);
      const group = groupFor(scope);
      group.tweens.add(tween);
      sync(group);
    }
    for (const [tween, scope] of tweens) {
      if (sourceTweens.has(tween) && scope.isConnected) continue;
      pausedTweens.delete(tween);
      groups.get(scope)?.tweens.delete(tween);
      tweens.delete(tween);
    }
    for (const video of doc.querySelectorAll("video")) {
      if (videoCleanups.has(video)) continue;
      const group = groupFor(video);
      group.videos.add(video);
      const onPlay = () => sync(group);
      video.addEventListener("play", onPlay);
      videoCleanups.set(video, () => video.removeEventListener("play", onPlay));
      sync(group);
    }
    for (const [video, cleanup] of videoCleanups) {
      if (video.isConnected) continue;
      cleanup();
      videoCleanups.delete(video);
      resumeVideos.delete(video);
      groups.get(video)?.videos.delete(video);
    }
    for (const [element, group] of groups) {
      if (group.animations.size || group.videos.size || group.tweens.size)
        continue;
      observer.unobserve(element);
      groups.delete(element);
    }
  };
  const visibility = () => {
    if (!doc.hidden) scan();
    groups.forEach(sync);
  };
  let scheduled = 0;
  const scheduleScan = () => {
    if (scheduled || doc.hidden) return;
    scheduled = view.requestAnimationFrame(() => {
      scheduled = 0;
      scan();
    });
  };
  // CSS animation events catch new effects immediately. The low-frequency scan
  // also finds source-created Web Animations without wrapping browser APIs.
  doc.addEventListener("animationstart", scheduleScan, true);
  doc.addEventListener("transitionrun", scheduleScan, true);
  doc.addEventListener("visibilitychange", visibility);
  const mutations = new view.MutationObserver(scheduleScan);
  mutations.observe(doc.body, { childList: true, subtree: true });
  const timer = setInterval(() => {
    if (!doc.hidden) scan();
  }, 1000);
  scan();
  return () => {
    active = false;
    view.cancelAnimationFrame(scheduled);
    clearInterval(timer);
    observer.disconnect();
    mutations.disconnect();
    doc.removeEventListener("animationstart", scheduleScan, true);
    doc.removeEventListener("transitionrun", scheduleScan, true);
    doc.removeEventListener("visibilitychange", visibility);
    videoCleanups.forEach((cleanup) => cleanup());
    paused.forEach((animation) => {
      if (animation.playState === "paused") animation.play();
    });
    pausedTweens.forEach((tween) => tween.paused(false));
    resumeVideos.forEach((video) => {
      if (video.isConnected && !video.ended) void video.play().catch(() => {});
    });
  };
}
