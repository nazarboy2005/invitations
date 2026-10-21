"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import styles from "@/app/home.module.css";

/** A visitor's personal design preference, never an invented customer rating. */
export function DesignRating() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <div className={styles.designRating}>
      <div
        className={styles.ratingStars}
        role="group"
        aria-label="Sahifa dizayniga shaxsiy bahoyingiz"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value} yulduz`}
            aria-pressed={rating === value}
            onMouseEnter={() => setHovered(value)}
            onFocus={() => setHovered(value)}
            onBlur={() => setHovered(0)}
            onClick={() => setRating(value)}
            data-filled={value <= (hovered || rating)}
          >
            <Star size={17} strokeWidth={1.5} />
          </button>
        ))}
      </div>
      <p aria-live="polite">
        {rating
          ? `Sizning bahoyingiz: ${rating}/5. Rahmat!`
          : "Bu kayfiyatga sizning bahoyingiz?"}
        <span>Shaxsiy tanlov · yuborilmaydi</span>
      </p>
    </div>
  );
}
