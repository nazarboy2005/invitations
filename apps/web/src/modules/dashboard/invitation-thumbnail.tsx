"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Invitation } from "@taklifnoma/contracts";
import { AnorInvitation } from "@/templates/anor";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
import { isInvitateTemplate, InvitateInvitation } from "@/templates/invitate";
import { VelvetRoyaleInvitation } from "@/templates/velvet-royale/renderer";
import { OliveManorInvitation } from "@/templates/olive-manor/renderer";
import { IslamicEditionInvitation } from "@/templates/islamic-edition/renderer";
import { ManorInvitation } from "@/templates/manor-edition/renderer";
import { OshEditionInvitation } from "@/templates/osh-edition-v1/renderer";
import { MonochromeEditorialInvitation } from "@/templates/monochrome-editorial-edition/renderer";
import { XatnaEditionInvitation } from "@/templates/xatna-edition/renderer";
import { AmruMarufEditionInvitation } from "@/templates/amru-maruf-edition-v1/renderer";
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
          ) : isInvitateTemplate(invitation.templateId) ? (
            <InvitateInvitation {...props} />
          ) : invitation.templateId === "royal-burgundy-edition" ? (
            <VelvetRoyaleInvitation {...props} />
          ) : invitation.templateId === "olive-manor-edition" ? (
            <OliveManorInvitation {...props} />
          ) : invitation.templateId === "islamic-edition" ? (
            <IslamicEditionInvitation {...props} />
          ) : invitation.templateId === "manor-edition" ? (
            <ManorInvitation {...props} />
          ) : invitation.templateId === "osh-edition-v1" ? (
            <OshEditionInvitation {...props} silentPlayback />
          ) : invitation.templateId === "monochrome-editorial-edition" ? (
            <MonochromeEditorialInvitation {...props} silentPlayback />
          ) : invitation.templateId === "amru-maruf-edition-v1" ? (
            <AmruMarufEditionInvitation {...props} silentPlayback />
          ) : invitation.templateId === "xatna-edition" ? (
            <XatnaEditionInvitation {...props} silentPlayback />
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
