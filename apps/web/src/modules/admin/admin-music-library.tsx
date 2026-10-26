"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import styles from "./admin.module.css";
import { useAdminDirty } from "./admin-navigation-guard";

type Track = {
  id: string;
  asset_id: string;
  title: string;
  active: boolean;
  position: number;
  original_filename: string;
  size_bytes: number;
};

const fieldStyle: CSSProperties = {
  padding: "11px 12px",
  border: "1px solid var(--line)",
  borderRadius: 7,
  background: "var(--surface)",
  color: "var(--ink)",
  width: "100%",
  minHeight: 44,
};

export function AdminMusicLibrary() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useAdminDirty(!!title.trim() || !!file);

  async function load() {
    const response = await fetch("/api/admin/music", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.error?.message ?? "Musiqa ro‘yxatini yuklab bo‘lmadi.",
      );
    setTracks(data.tracks ?? []);
  }

  useEffect(() => {
    let alive = true;
    void load()
      .catch((cause) => {
        if (alive)
          setError(
            cause instanceof Error ? cause.message : "Xatolik yuz berdi.",
          );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  async function updateTrack(track: Track, active: boolean) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/music/${track.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message ?? "Saqlab bo‘lmadi.");
      setTracks((current) =>
        current.map((item) =>
          item.id === track.id ? { ...item, active: data.track.active } : item,
        ),
      );
      setNotice("Musiqa kutubxonasi yangilandi.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Saqlab bo‘lmadi.");
    } finally {
      setBusy(false);
    }
  }

  async function addTrack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!file) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const contentType =
        file.type ||
        (
          { mp3: "audio/mpeg", wav: "audio/wav", m4a: "audio/mp4" } as Record<
            string,
            string
          >
        )[file.name.split(".").pop()?.toLowerCase() ?? ""];
      if (
        !contentType ||
        !["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"].includes(
          contentType,
        )
      )
        throw new Error("MP3, WAV yoki M4A audio fayl tanlang.");
      if (file.size < 16 || file.size > 15 * 1024 * 1024)
        throw new Error("Audio fayl 15 MB dan kichik bo‘lishi kerak.");

      const preparedResponse = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          contentType,
          kind: "audio",
          catalog: true,
        }),
      });
      const prepared = await preparedResponse.json();
      if (!preparedResponse.ok || !prepared.upload?.url)
        throw new Error(
          prepared.error?.message ?? "Audio yuklashni boshlash imkonsiz.",
        );
      const uploaded = await fetch(prepared.upload.url, {
        method: "PUT",
        headers: prepared.upload.headers,
        body: file,
      });
      if (!uploaded.ok) throw new Error("Audio faylni saqlab bo‘lmadi.");
      const completedResponse = await fetch(prepared.upload.completeUrl, {
        method: "POST",
      });
      const completed = await completedResponse.json();
      if (!completedResponse.ok || !completed.asset?.id)
        throw new Error(
          completed.error?.message ?? "Audio faylni tekshirib bo‘lmadi.",
        );
      const createdResponse = await fetch("/api/admin/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: completed.asset.id,
          title: title.trim(),
        }),
      });
      const created = await createdResponse.json();
      if (!createdResponse.ok)
        throw new Error(
          created.error?.message ?? "Musiqani katalogga qo‘shib bo‘lmadi.",
        );
      await load();
      setTitle("");
      setFile(null);
      form.reset();
      setNotice("Musiqa qo‘shildi va foydalanuvchilar tanlovi uchun yoqildi.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Musiqani qo‘shib bo‘lmadi.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="music-library-heading">
      <div>
        <h2
          id="music-library-heading"
          style={{
            margin: "0 0 8px",
            fontFamily: "var(--font-display)",
            fontWeight: 400,
          }}
        >
          Musiqa kutubxonasi
        </h2>
        <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
          Foydalanuvchilarga taklif qilinadigan umumiy fon musiqalarini yuklang
          va ro‘yxatdan yoqing yoki yashiring. Shaxsiy yuklangan treklar bu
          yerda ko‘rinmaydi.
        </p>
      </div>
      {error && (
        <p role="alert" className="inline-note">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="inline-note">
          {notice}
        </p>
      )}
      {!loading && !error && (
        <form onSubmit={addTrack} className={styles.musicForm}>
          <label style={{ display: "grid", gap: 8, fontSize: 13 }}>
            Kutubxonada ko‘rinadigan nom
            <input
              required
              name="title"
              autoComplete="off"
              maxLength={160}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={busy}
              style={fieldStyle}
              placeholder="Masalan, Sokin piano…"
            />
          </label>
          <label style={{ display: "grid", gap: 8, fontSize: 13 }}>
            Audio fayl
            <input
              required
              name="audio"
              type="file"
              accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,.mp3,.wav,.m4a"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              disabled={busy}
              style={{ ...fieldStyle, padding: 8 }}
            />
            <small className="muted">MP3, WAV yoki M4A · 15 MB gacha</small>
          </label>
          <button className="button" disabled={busy || !file || !title.trim()}>
            {busy ? "Yuklanmoqda…" : "Musiqa qo‘shish"}
          </button>
        </form>
      )}
      {error && (
        <button
          type="button"
          className="button secondary"
          disabled={busy}
          onClick={async () => {
            setLoading(true);
            setError("");
            try {
              await load();
            } catch (cause) {
              setError((cause as Error).message);
            } finally {
              setLoading(false);
            }
          }}
        >
          Qayta yuklash
        </button>
      )}
      {loading ? (
        <p role="status" className="muted">
          Musiqalar yuklanmoqda…
        </p>
      ) : !error && tracks.length ? (
        <div style={{ display: "grid", gap: 10 }}>
          {tracks.map((track) => (
            <div key={track.id} className={styles.musicTrack}>
              <div style={{ minWidth: 200, flex: "1 1 auto" }}>
                <strong>{track.title}</strong>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  {track.original_filename} ·{" "}
                  {Math.max(
                    1,
                    Math.round(Number(track.size_bytes) / 1024 / 1024),
                  )}{" "}
                  MB
                </div>
              </div>
              <audio
                controls
                aria-label={`${track.title} audiosi`}
                preload="none"
                src={`/api/media/${track.asset_id}`}
                style={{ width: "min(100%,300px)" }}
              />
              <button
                className="button secondary"
                type="button"
                disabled={busy}
                onClick={() => void updateTrack(track, !track.active)}
              >
                {track.active
                  ? "Tanlovdan yashirish"
                  : "Foydalanuvchilarga ko‘rsatish"}
              </button>
              <span className="tag">
                {track.active ? "Tanlash mumkin" : "Yashirilgan"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <p className={styles.empty}>
            Umumiy kutubxona hozircha bo‘sh. Birinchi musiqani yuqoridagi forma
            orqali qo‘shing.
          </p>
        )
      )}
    </section>
  );
}
