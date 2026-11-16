"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  History,
  MapPin,
  PencilLine,
} from "lucide-react";
import { ServiceImports } from "./service-imports";
import styles from "./admin-services.module.css";

type Mode = "choose" | "maps" | "history";

export function ServiceCreatePanel({
  initialMode,
  onManual,
  onOpenImported,
  onClose,
}: {
  initialMode: "choose" | "history";
  onManual: () => void;
  onOpenImported: (slug: string) => Promise<void>;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [mode]);

  return (
    <div className={styles.root}>
      <div className={styles.editorHeading}>
        <button type="button" className={styles.back} onClick={onClose}>
          <ArrowLeft size={17} aria-hidden="true" /> Servislarga qaytish
        </button>
        {mode !== "history" && (
          <button
            type="button"
            className={styles.historyLink}
            onClick={() => setMode("history")}
          >
            <History size={15} aria-hidden="true" /> Import tarixi
          </button>
        )}
      </div>
      <div className={styles.editorTitle}>
        <div>
          <h2 ref={heading} tabIndex={-1}>
            {mode === "history" ? "Import tarixi" : "Servis qo‘shish"}
          </h2>
          <p>
            {mode === "choose"
              ? "Ma’lumotlarni qo‘lda kiriting yoki Google va Yandex Maps’dan yig‘ing."
              : mode === "maps"
                ? "Maps’dan ma’lumotlarni yig‘ing, keyin qoralamani tekshirib to‘ldiring."
                : "Import jarayonini kuzating va tayyor qoralamalarni tahrirlash uchun oching."}
          </p>
        </div>
        {mode !== "choose" && (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => setMode("choose")}
          >
            <ArrowLeft size={15} aria-hidden="true" /> Qo‘shish usullari
          </button>
        )}
      </div>
      {mode === "choose" ? (
        <>
          <div className={styles.createMethods}>
            <button
              type="button"
              className={styles.createMethod}
              onClick={onManual}
            >
              <span className={styles.methodIcon}>
                <PencilLine size={24} aria-hidden="true" />
              </span>
              <strong>Qo‘lda qo‘shish</strong>
              <span>
                Nomi, kontaktlari, narxlari va rasmlarini o‘zingiz kiriting.
              </span>
              <span className={styles.methodAction}>
                Bo‘sh shaklni ochish <ArrowRight size={17} aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              className={styles.createMethod}
              onClick={() => setMode("maps")}
            >
              <span className={styles.methodIcon}>
                <MapPin size={24} aria-hidden="true" />
              </span>
              <strong>Maps’dan import</strong>
              <span>
                Biznes havolasi yoki nomi orqali mavjud ma’lumotlarni yig‘ing.
              </span>
              <span className={styles.methodAction}>
                Maps’dan boshlash <ArrowRight size={17} aria-hidden="true" />
              </span>
            </button>
          </div>
          <p className={styles.hint}>
            Har ikki usulda ham ma’lumotlarni nashrdan oldin tekshirib,
            tahrirlashingiz mumkin. Maps importi servisni avtomatik nashr
            qilmaydi.
          </p>
        </>
      ) : (
        <ServiceImports onOpen={onOpenImported} showForm={mode === "maps"} />
      )}
    </div>
  );
}
