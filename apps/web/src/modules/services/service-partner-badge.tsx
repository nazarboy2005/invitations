import { Handshake } from "lucide-react";
import styles from "./services.module.css";

export function ServicePartnerBadge({
  overlay = false,
}: {
  overlay?: boolean;
}) {
  return (
    <span
      className={`${styles.partnerBadge}${overlay ? ` ${styles.partnerBadgeOverlay}` : ""}`}
      data-service-partner-badge
    >
      <Handshake size={15} strokeWidth={1.7} aria-hidden="true" />
      <span>Hamkor</span>
    </span>
  );
}
