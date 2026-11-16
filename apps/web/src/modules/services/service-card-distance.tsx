"use client";

import { Navigation } from "lucide-react";
import { formatServiceDistance, serviceDistance } from "./service-distance";
import { useServicesLocation } from "./services-location";
import styles from "./services.module.css";

export function ServiceCardDistance({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const { position } = useServicesLocation();
  const meters = serviceDistance(position, { latitude, longitude });
  if (meters === null) return null;
  const distance = formatServiceDistance(meters);
  return (
    <span
      className={styles.cardDistance}
      data-service-distance
      title="Joriy joylashuvingizdan taxminiy to‘g‘ri chiziqli masofa"
      aria-label={`Sizdan taxminan ${distance}`}
    >
      <Navigation size={12} aria-hidden="true" />
      {distance}
    </span>
  );
}
