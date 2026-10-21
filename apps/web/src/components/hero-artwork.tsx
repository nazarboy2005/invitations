"use client";

import { useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import styles from "@/app/home.module.css";

export function HeroArtwork({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className={styles.heroArt} data-paused={paused}>
      {children}
      <button
        className={styles.motionToggle}
        type="button"
        aria-label={
          paused ? "Animatsiyani davom ettirish" : "Animatsiyani to‘xtatish"
        }
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play size={11} /> : <Pause size={11} />}
        {paused ? "Davom ettirish" : "Harakatni to‘xtatish"}
      </button>
    </div>
  );
}
