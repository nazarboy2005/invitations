"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LoaderCircle, MapPin, X } from "lucide-react";
import type { Locale } from "@taklifnoma/contracts";
import type { VenueLocation } from "@taklifnoma/contracts/maps";
import { hasVenuePoint, yandexMapUrl } from "@taklifnoma/contracts/maps";
import type { SelectedPlace } from "./place-search";
import styles from "./venue-link.module.css";

function sameName(a: string, b: string) {
  const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase().replace(/[‘’ʻʼ`]/g, "'").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  return normalize(a) === normalize(b);
}

/** Link entry, map picking and name reconciliation share one resolution path. */
export function VenueLink({ venue, name, locale, onEdit, onResolve, onNameChange }: {
  venue: VenueLocation;
  name: string;
  locale: Locale;
  onEdit: () => void;
  onResolve: (place: SelectedPlace) => void;
  onNameChange: (name: string) => void;
}) {
  const id = useId();
  const [draft, setDraft] = useState(venue.mapUrl);
  const acknowledged = useRef(venue.mapUrl);
  const [resolved, setResolved] = useState<SelectedPlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [failed, setFailed] = useState(false);
  const [picking, setPicking] = useState(false);
  const [point, setPoint] = useState<{ latitude: number; longitude: number } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const callbacks = useRef({ onResolve });
  useEffect(() => { callbacks.current = { onResolve }; }, [onResolve]);

  useEffect(() => {
    if (venue.mapUrl !== acknowledged.current) {
      acknowledged.current = venue.mapUrl;
      setDraft(venue.mapUrl); setResolved(null); setStatus("");
    }
  }, [venue.mapUrl]);

  async function resolve(value: string) {
    const version = ++generation.current;
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setLoading(true); setFailed(false); setStatus("Joy ma’lumotlari olinmoqda…"); setResolved(null);
    try {
      const response = await fetch("/api/places/link", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value, locale }), signal: controller.signal });
      const data = await response.json();
      if (controller.signal.aborted || version !== generation.current) return;
      if (!response.ok) throw new Error(data.error?.message || "Havoladagi joy topilmadi.");
      const place = data as SelectedPlace;
      acknowledged.current = place.mapUrl; setDraft(place.mapUrl); setResolved(place);
      setStatus("Joy aniqlandi. Xarita shu manzilga bog‘landi.");
      callbacks.current.onResolve(place); setPicking(false);
    } catch (error) {
      if (!controller.signal.aborted && version === generation.current) { setFailed(true); setStatus(error instanceof Error ? error.message : "Joy topilmadi."); }
    } finally { if (version === generation.current) setLoading(false); }
  }

  useEffect(() => {
    if (!draft.trim() || draft === acknowledged.current) return;
    const timer = setTimeout(() => void resolve(draft.trim()), 600);
    return () => { clearTimeout(timer); generation.current++; request.current?.abort(); };
    // Only a changed URL or language should start another provider request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, locale]);
  useEffect(() => () => { generation.current++; request.current?.abort(); }, []);
  useEffect(() => {
    const element = dialog.current;
    if (picking) element?.showModal(); else element?.close();
  }, [picking]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "venue-map-picked") return;
      const { latitude, longitude } = event.data;
      if (hasVenuePoint({ latitude, longitude })) setPoint({ latitude, longitude });
    };
    addEventListener("message", receive);
    return () => removeEventListener("message", receive);
  }, []);

  function closePicker() {
    generation.current++; request.current?.abort(); setLoading(false); setPicking(false);
  }

  const mismatch = resolved?.name && name.trim() && !sameName(name, resolved.name);
  const start = hasVenuePoint(venue) ? venue : { latitude: 41.311151, longitude: 69.279737 };
  return <div className={styles.root}>
    <div className={styles.heading}><label htmlFor={`${id}-link`}>Yandex Maps havolasi</label>
      <button type="button" className={styles.pick} onClick={() => { setPoint(null); setStatus(""); setPicking(true); }}><MapPin size={15} /> Xaritadan tanlash</button>
    </div>
    <div className={styles.inputWrap}>
      <input id={`${id}-link`} type="url" inputMode="url" value={draft} maxLength={4000} autoComplete="off"
        placeholder="https://yandex.uz/maps/…" aria-describedby={`${id}-status`}
        onChange={event => { generation.current++; request.current?.abort(); acknowledged.current = "";
          setDraft(event.target.value); setResolved(null); setStatus(""); setFailed(false); setLoading(false); onEdit(); }} />
      {loading && <LoaderCircle size={17} className={styles.loading} />}
    </div>
    <small className={styles.hint}>Yandex Maps’dan joy havolasini qo‘ying yoki xaritadan belgilang.</small>
    <div id={`${id}-status`} role="status" aria-live="polite" className={`${styles.status} ${failed ? styles.error : ""}`}>{status}</div>
    {mismatch && <div className={styles.suggestion}>
      <p>Yandex’dagi joy nomi: <strong>{resolved.name}</strong>. Kiritgan nomingiz saqlandi.</p>
      <button type="button" onClick={() => onNameChange(resolved.name)}>Nomni «{resolved.name}»ga o‘zgartirish</button>
    </div>}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby={`${id}-title`} onClose={closePicker}>
      <header><div><h3 id={`${id}-title`}>Joyni xaritadan tanlang</h3><p>Kerakli nuqtaga bosing. Xaritani surish va yaqinlashtirish mumkin.</p></div>
        <button type="button" aria-label="Xaritani yopish" onClick={closePicker}><X size={20} /></button></header>
      {picking && <iframe ref={frame} title="Joy tanlash xaritasi" src={`/maps/venue?mode=pick&latitude=${start.latitude}&longitude=${start.longitude}&lang=${locale}`} />}
      <footer><small role="status">{status || (point ? "Nuqta belgilandi." : "Xaritada joyni belgilang.")}</small>
        <button type="button" disabled={!point || loading} onClick={() => point && void resolve(yandexMapUrl({ ...point, mapUrl: "" }))}>{loading ? "Aniqlanmoqda…" : "Shu joyni tanlash"}</button></footer>
    </dialog>
  </div>;
}
