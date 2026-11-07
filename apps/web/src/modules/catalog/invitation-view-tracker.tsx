"use client";

import { useEffect, useRef } from "react";
import { CLASSICAL_MUSIC } from "@/modules/studio/classical-music";

type PlaybackState = {
  source: string;
  started: boolean;
  blocked: boolean;
};

function absoluteUrl(value: string | null | undefined, base: string) {
  if (!value) return "";
  try {
    return new URL(value, base).href;
  } catch {
    return "";
  }
}

function audioUsesSource(audio: HTMLAudioElement, expectedSource: string) {
  const doc = audio.ownerDocument;
  const candidates = [
    audio.getAttribute("src"),
    ...Array.from(audio.querySelectorAll("source[src]"), (source) =>
      source.getAttribute("src"),
    ),
  ];
  return candidates.some(
    (candidate) => absoluteUrl(candidate, doc.baseURI) === expectedSource,
  );
}

function manageInvitationAudio(doc: Document, expectedSource: string) {
  const states = new WeakMap<HTMLAudioElement, PlaybackState>();
  const AudioElement = doc.defaultView?.HTMLAudioElement;
  const SourceElement = doc.defaultView?.HTMLSourceElement;
  const Element = doc.defaultView?.Element;
  const tryPlay = (audio: HTMLAudioElement, fromGesture = false) => {
    if (!audioUsesSource(audio, expectedSource)) return;
    audio.loop = true;
    const source = expectedSource;
    let state = states.get(audio);
    if (!state || state.source !== source) {
      state = { source, started: !audio.paused, blocked: false };
      states.set(audio, state);
    }
    if (state.started || (!fromGesture && state.blocked)) return;
    if (!audio.paused) {
      state.started = true;
      return;
    }
    try {
      const result = audio.play();
      state.blocked = false;
      void result.then(
        () => {
          state!.started = true;
          state!.blocked = false;
        },
        () => {
          state!.blocked = true;
        },
      );
    } catch {
      state.blocked = true;
    }
  };

  const scan = () => {
    for (const audio of doc.querySelectorAll("audio")) tryPlay(audio);
  };

  scan();
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        const target = mutation.target;
        const audio =
          AudioElement && target instanceof AudioElement
            ? target
            : SourceElement && target instanceof SourceElement
              ? target.closest("audio")
              : null;
        if (audio) tryPlay(audio);
      }
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (!Element || !(node instanceof Element)) continue;
          if (AudioElement && node instanceof AudioElement) tryPlay(node);
          for (const audio of node.querySelectorAll("audio")) tryPlay(audio);
          const parentAudio = node.closest("audio");
          if (parentAudio) tryPlay(parentAudio);
        }
      }
    }
  });
  observer.observe(doc.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["src"],
  });

  const retryBlocked = () => {
    for (const audio of doc.querySelectorAll("audio")) {
      if (states.get(audio)?.blocked) tryPlay(audio, true);
    }
  };
  // When a browser blocks audible autoplay, retry on the guest's first normal
  // interaction. Once playback succeeds, this path never restarts a paused track.
  doc.addEventListener("click", retryBlocked);

  const playing = (event: Event) => {
    const audio = event.target;
    if (
      !AudioElement ||
      !(audio instanceof AudioElement) ||
      !audioUsesSource(audio, expectedSource)
    )
      return;
    const state = states.get(audio);
    if (state) {
      state.started = true;
      state.blocked = false;
    }
  };
  doc.addEventListener("playing", playing, true);

  return () => {
    observer.disconnect();
    doc.removeEventListener("click", retryBlocked);
    doc.removeEventListener("playing", playing, true);
  };
}

function manageInvitationFrames(expectedSource: string) {
  const cleanups = new Map<HTMLIFrameElement, () => void>();
  const scan = () => {
    for (const frame of document.querySelectorAll("iframe")) {
      if (cleanups.has(frame)) continue;
      try {
        const doc = frame.contentDocument;
        if (doc?.documentElement) {
          cleanups.set(frame, manageInvitationAudio(doc, expectedSource));
        }
      } catch {
        // Invitation template frames are same-origin; ignore any unrelated frame.
      }
    }
  };
  scan();
  const observer = new MutationObserver(scan);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
  });
  const onLoad = (event: Event) => {
    const frame = event.target;
    if (frame instanceof HTMLIFrameElement) {
      cleanups.get(frame)?.();
      cleanups.delete(frame);
      scan();
    }
  };
  document.addEventListener("load", onLoad, true);
  return () => {
    observer.disconnect();
    document.removeEventListener("load", onLoad, true);
    for (const cleanup of cleanups.values()) cleanup();
    cleanups.clear();
  };
}

export function InvitationMusicAutoplay({ musicUrl }: { musicUrl?: string }) {
  useEffect(() => {
    if (!musicUrl) return;
    const source = absoluteUrl(musicUrl, window.location.href);
    const cleanupPage = manageInvitationAudio(document, source);
    const cleanupFrames = manageInvitationFrames(source);
    return () => {
      cleanupPage();
      cleanupFrames();
    };
  }, [musicUrl]);

  return null;
}

export function InvitationViewTracker({
  invitationId,
  musicUrl,
}: {
  invitationId: string;
  musicUrl?: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void fetch(
      `/api/public/invitations/${encodeURIComponent(invitationId)}/view`,
      {
        method: "POST",
        cache: "no-store",
        keepalive: true,
      },
    ).catch(() => {
      // A view metric must never interfere with opening the invitation.
    });
  }, [invitationId]);

  return (
    <>
      <InvitationMusicAutoplay musicUrl={musicUrl} />
      <InvitationMusicCredits musicUrl={musicUrl} />
    </>
  );
}

export function InvitationMusicCredits({ musicUrl }: { musicUrl?: string }) {
  const credit = CLASSICAL_MUSIC.find(
    (track) => musicUrl === track.url || !!musicUrl?.includes(track.url),
  );
  return (
    <>
      {" "}
      {credit && (
        <details
          style={{
            position: "fixed",
            zIndex: 20,
            left: "max(10px, env(safe-area-inset-left))",
            bottom: "max(10px, env(safe-area-inset-bottom))",
            maxWidth: "min(360px, calc(100vw - 20px))",
            color: "#292526",
            background: "rgba(255,255,255,.92)",
            border: "1px solid rgba(80,60,60,.18)",
            borderRadius: 9,
            boxShadow: "0 4px 18px rgba(35,20,20,.12)",
            font: "12px/1.5 system-ui,sans-serif",
            backdropFilter: "blur(12px)",
          }}
        >
          <summary style={{ cursor: "pointer", padding: "7px 10px" }}>
            Audio credits
          </summary>
          <div style={{ display: "grid", gap: 4, padding: "0 10px 9px" }}>
            <strong>{credit.attribution}</strong>
            <span>
              {credit.license} ·{" "}
              <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
                license
              </a>
            </span>
            <a href={credit.sourceUrl} target="_blank" rel="noreferrer">
              Recording source
            </a>
            {credit.license.includes("BY-SA") && (
              <span>
                Adaptations of this recording must use the same or a compatible
                license.
              </span>
            )}
          </div>
        </details>
      )}{" "}
    </>
  );
}
