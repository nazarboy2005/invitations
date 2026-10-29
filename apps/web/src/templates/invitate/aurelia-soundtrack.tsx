"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Pause } from "lucide-react";
import type { Locale } from "@taklifnoma/contracts";
import { InvitationMusicAutoplay } from "@/modules/catalog/invitation-view-tracker";

/** Aurelia's source has no audio binding. Supply one selected, looping player. */
export function AureliaSoundtrack({ url, locale }: { url: string; locale: Locale }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const player = audio.current;
    if (player && player.getAttribute("src") !== url) { player.src = url; player.load(); }
    return () => { player?.pause(); player?.removeAttribute("src"); player?.load(); };
  }, [url]);
  const labels = {
    "uz-Latn": ["Musiqani yoqish", "Musiqani to‘xtatish"],
    "uz-Cyrl": ["Мусиқани ёқиш", "Мусиқани тўхтатиш"],
    en: ["Play music", "Pause music"], ru: ["Включить музыку", "Приостановить музыку"],
  }[locale];
  return <>
    <audio ref={audio} src={url} loop autoPlay preload="none" hidden
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <InvitationMusicAutoplay musicUrl={url} />
    <button type="button" aria-label={labels[playing ? 1 : 0]} aria-pressed={playing}
      style={{ position: "fixed", right: 18, bottom: 18, zIndex: 40, width: 44, height: 44, display: "grid", placeItems: "center", border: "1px solid #c8b69d", borderRadius: "50%", background: "#fffaf0e6", color: "#6b5132", backdropFilter: "blur(10px)", cursor: "pointer" }}
      onClick={() => {
        if (!audio.current) return;
        if (audio.current.paused) void audio.current.play().catch(() => setPlaying(false));
        else audio.current.pause();
      }}>
      {playing ? <Pause size={18} /> : <Music2 size={18} />}
    </button>
  </>;
}
