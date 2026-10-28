"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@taklifnoma/contracts";

type Suggestion = { id: string; name: string; address: string };
export type SelectedPlace = Suggestion & { latitude: number | null; longitude: number | null; mapUrl: string };

export function PlaceSearch({ value, locale, onChange, onSelect }: {
  value: string;
  locale: Locale;
  onChange: (value: string) => void;
  onSelect: (place: SelectedPlace) => void;
}) {
  const [places, setPlaces] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState("");
  const session = useRef("");
  const selected = useRef(false);

  useEffect(() => {
    if (selected.current) { selected.current = false; return; }
    if (value.trim().length < 3) { setPlaces([]); setStatus(""); return; }
    if (!session.current) session.current = crypto.randomUUID();
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ q: value.trim(), locale, session: session.current });
      fetch(`/api/places?${params}`, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) {
            const body = await response.json().catch(() => ({})) as { error?: { code?: string } };
            if (body.error?.code === "PLACES_UNCONFIGURED" || response.status === 401) {
              setStatus("Joy qidiruvi hozircha mavjud emas. Manzilni qo‘lda kiriting.");
            } else setStatus("Joy qidiruvi ishlamadi. Manzilni qo‘lda kiriting.");
            setPlaces([]);
            return;
          }
          const data = await response.json() as { places?: Suggestion[] };
          setPlaces(data.places || []);
          setStatus(data.places?.length ? "" : "Joy topilmadi. Manzilni qo‘lda kiriting.");
        })
        .catch((error: unknown) => { if (!controller.signal.aborted) { setPlaces([]); setStatus("Joy qidiruvi ishlamadi. Manzilni qo‘lda kiriting."); } });
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [value, locale]);

  async function choose(place: Suggestion) {
    setPlaces([]);
    setStatus("");
    try {
      const params = new URLSearchParams({ session: session.current });
      const response = await fetch(`/api/places/${encodeURIComponent(place.id)}?${params}`);
      if (!response.ok) throw new Error("Place details unavailable");
      selected.current = true;
      onSelect(await response.json() as SelectedPlace);
      session.current = "";
    } catch {
      setStatus("Joy ma’lumotlari olinmadi. Manzilni qo‘lda kiriting.");
    }
  }

  return <div>
    <input value={value} maxLength={300} onChange={(event) => { onChange(event.target.value); setPlaces([]); }} autoComplete="off" />
    {places.length > 0 && <ul style={{ listStyle: "none", padding: 0, margin: "4px 0", border: "1px solid #d8cfc2", borderRadius: 8, overflow: "hidden" }}>
      {places.map((place) => <li key={place.id}><button type="button" onClick={() => void choose(place)} style={{ width: "100%", padding: "10px 12px", border: 0, borderBottom: "1px solid #eee", background: "white", textAlign: "left", cursor: "pointer" }}><strong>{place.name}</strong>{place.address && <><br /><small>{place.address}</small></>}</button></li>)}
    </ul>}
    {status && <small role="status">{status}</small>}
  </div>;
}
