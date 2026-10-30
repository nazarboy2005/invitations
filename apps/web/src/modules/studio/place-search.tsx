"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, MapPin, Search } from "lucide-react";
import type { Locale } from "@taklifnoma/contracts";
import styles from "./place-search.module.css";

type Suggestion = { id: string; name: string; address: string };
export type SelectedPlace = Suggestion & { latitude: number; longitude: number; mapUrl: string; placeUri?: string };

export function PlaceSearch({ value, locale, onChange, onSelect, confirmed = false, label = "To‘yxona yoki joy nomi" }: {
  value: string;
  locale: Locale;
  onChange: (value: string) => void;
  onSelect: (place: SelectedPlace) => void;
  confirmed?: boolean;
  label?: string;
}) {
  const id = useId();
  const [places, setPlaces] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const selectedValue = useRef(confirmed ? value : "");
  const generation = useRef(0);
  const selectionRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    const version = ++generation.current;
    selectionRequest.current?.abort();
    if (confirmed || value === selectedValue.current || value.trim().length < 2) {
      setPlaces([]); setStatus(""); setLoading(false); return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setStatus("");
      try {
        const params = new URLSearchParams({ q: value.trim().slice(0, 120), locale });
        const response = await fetch(`/api/places?${params}`, { signal: controller.signal });
        const data = await response.json();
        if (version !== generation.current || controller.signal.aborted) return;
        if (!response.ok) throw new Error(data.error?.message || "Joy qidiruvi ishlamadi. Qayta urinib ko‘ring.");
        setPlaces(data.places || []); setActive(-1); setOpen(true);
        setStatus(data.places?.length ? "" : "Joy topilmadi. Joy nomiga shahar yoki ko‘cha nomini qo‘shing.");
      } catch (error) {
        if (!controller.signal.aborted && version === generation.current) {
          setPlaces([]); setStatus(error instanceof Error ? error.message : "Joy qidiruvi ishlamadi.");
        }
      } finally { if (version === generation.current && !controller.signal.aborted) setLoading(false); }
    }, 280);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [value, locale, confirmed]);
  useEffect(() => () => { generation.current++; selectionRequest.current?.abort(); }, []);

  async function choose(place: Suggestion) {
    const version = ++generation.current;
    selectionRequest.current?.abort();
    const controller = new AbortController(); selectionRequest.current = controller;
    setOpen(false); setPlaces([]); setStatus("Manzil aniqlanmoqda…"); setLoading(true);
    try {
      const response = await fetch(`/api/places/${encodeURIComponent(place.id)}?${new URLSearchParams({ locale })}`, { signal: controller.signal });
      const data = await response.json();
      if (version !== generation.current || controller.signal.aborted) return;
      if (!response.ok) throw new Error(data.error?.message || "Joy ma’lumotlari olinmadi. Qayta tanlang.");
      selectedValue.current = data.name;
      setStatus(""); onSelect(data as SelectedPlace);
    } catch (error) {
      if (!controller.signal.aborted && version === generation.current) setStatus(error instanceof Error ? error.message : "Joy ma’lumotlari olinmadi.");
    } finally { if (version === generation.current) setLoading(false); }
  }

  return <div className={styles.root}>
    <div className={styles.inputWrap}>
      <input role="combobox" aria-label={label} aria-autocomplete="list" aria-expanded={open && places.length > 0}
        aria-controls={`${id}-list`} aria-activedescendant={open && active >= 0 ? `${id}-${active}` : undefined}
        aria-describedby={`${id}-status`} value={value} maxLength={300} autoComplete="off" placeholder="Masalan, Versal, Toshkent"
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        onChange={event => { generation.current++; selectionRequest.current?.abort(); selectedValue.current = ""; setPlaces([]); setStatus(""); onChange(event.target.value); }}
        onKeyDown={event => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault(); setOpen(true);
            setActive(index => places.length ? (index + (event.key === "ArrowDown" ? 1 : -1) + places.length) % places.length : -1);
          } else if (event.key === "Enter" && open && active >= 0 && places[active]) { event.preventDefault(); void choose(places[active]); }
          else if (event.key === "Escape") { setOpen(false); setActive(-1); }
        }} />
      <span className={styles.icon}>{loading ? <LoaderCircle className={styles.loading} size={18} /> : confirmed ? <CheckCircle2 size={18} /> : <Search size={18} />}</span>
    </div>
    {open && places.length > 0 && <ul id={`${id}-list`} role="listbox" aria-label="Yandex joy natijalari" className={styles.list}>
      {places.map((place, index) => <li role="presentation" key={place.id}>
        <button id={`${id}-${index}`} role="option" aria-selected={index === active} type="button"
          className={`${styles.option} ${index === active ? styles.active : ""}`} tabIndex={-1}
          onMouseDown={event => event.preventDefault()} onClick={() => void choose(place)}>
          <MapPin size={17} /><span><strong>{place.name}</strong><small>{place.address}</small></span>
        </button>
      </li>)}
      <li role="presentation" className={styles.attribution}>Yandex Maps</li>
    </ul>}
    <small id={`${id}-status`} role="status" aria-live="polite" className={`${styles.status} ${confirmed ? styles.confirmed : ""}`}>
      {status || (confirmed ? "Joy tanlandi. Xarita shu manzilga bog‘langan." : "")}
    </small>
  </div>;
}
