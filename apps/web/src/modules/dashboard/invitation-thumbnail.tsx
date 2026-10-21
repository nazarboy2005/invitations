"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation } from "@taklifnoma/contracts";
import { AnorInvitation } from "@/templates/anor";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
import styles from "./invitation-thumbnail.module.css";

/** Reuse the real opening page, with authored content and no guest actions/audio. */
export function InvitationThumbnail({
  invitation,
}: {
  invitation: Invitation;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(640);
  const silentInvitation = useMemo(
    () => ({
      ...invitation,
      music: { ...invitation.music, enabled: false, url: "" },
    }),
    [invitation],
  );

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => {
      const nextScale = entry.contentRect.width / 390;
      if (nextScale > 0) {
        setScale(nextScale);
        setHeight(Math.max(560, entry.contentRect.height / nextScale));
      }
    });
    resize.observe(element);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { rootMargin: "150px" },
    );
    observer.observe(element);
    return () => {
      resize.disconnect();
      observer.disconnect();
    };
  }, []);

  const props = {
    invitation: silentInvitation,
    invitationId: invitation.id,
    locale: invitation.defaultLocale,
    preview: true,
  };

  return (
    <div ref={root} className={styles.thumbnail} aria-hidden="true" inert>
      {visible && (
        <div
          className={styles.viewport}
          style={{ transform: `scale(${scale})`, height }}
        >
          {invitation.templateId === "anor" ? (
            <AnorInvitation {...props} />
          ) : isMarxabaTemplate(invitation.templateId) ? (
            <MarxabaInvitation
              {...props}
              templateId={invitation.templateId}
              silentPlayback
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
