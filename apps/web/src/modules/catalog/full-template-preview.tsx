"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  invitationSchema,
  type Invitation,
  type TemplateDefinition,
} from "@taklifnoma/contracts";
import { AnorInvitation } from "@/templates/anor";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
import { isInvitateTemplate, InvitateInvitation } from "@/templates/invitate";
import { VelvetRoyaleInvitation } from "@/templates/velvet-royale/renderer";
import { OliveManorInvitation } from "@/templates/olive-manor/renderer";
import { IslamicEditionInvitation } from "@/templates/islamic-edition/renderer";
import { ManorInvitation } from "@/templates/manor-edition/renderer";
import { GulliDarvozaInvitation } from "@/templates/onlinetaklifnoma/gulli-darvoza";
import { isChorloveTemplate, ChorloveInvitation } from "@/templates/chorlove";
import { readBrowserDraft } from "@/modules/studio/draft-storage";
import {
  createTemplatePreviewSample,
  createLongNamePreview,
  hasAuthoredInvitationContent,
} from "./preview-sample";
import styles from "./full-template-preview.module.css";

function previewDraftKey(id: string) {
  return `taklifnoma:full-preview:v1:${id}`;
}

export function FullTemplatePreview({
  template,
  canSelect,
  canCreate,
  draftId,
  demo = false,
  silentPlayback = false,
  longNames = false,
  qaReducedMotion = false,
  qaMobile = false,
}: {
  template: TemplateDefinition;
  canSelect: boolean;
  canCreate: boolean;
  draftId?: string;
  demo?: boolean;
  silentPlayback?: boolean;
  longNames?: boolean;
  qaReducedMotion?: boolean;
  qaMobile?: boolean;
}) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [catalogPreview, setCatalogPreview] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const previewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      let candidate: Invitation | null = null;
      if (draftId) {
        try {
          const stored = sessionStorage.getItem(previewDraftKey(draftId));
          if (stored) {
            const parsed = invitationSchema.safeParse(JSON.parse(stored));
            if (parsed.success) candidate = parsed.data;
          }
        } catch {
          /* Fall back to the owner's recoverable browser draft below. */
        }
        if (!candidate) {
          try {
            const response = await fetch("/api/auth/session", {
              cache: "no-store",
            });
            const session = response.ok ? await response.json() : null;
            const ownerId =
              typeof session?.user?.id === "string" ? session.user.id : null;
            candidate = readBrowserDraft(draftId, ownerId)?.invitation ?? null;
          } catch {
            candidate = null;
          }
        }
      }

      if (!active) return;
      const candidateHasContent = candidate
        ? hasAuthoredInvitationContent(candidate)
        : false;
      const resolved =
        candidate && (!demo || candidateHasContent)
          ? { ...candidate, templateId: template.id }
          : createTemplatePreviewSample(template.id, candidate ?? undefined);
      setCatalogPreview(!candidateHasContent);
      setInvitation(longNames && !candidateHasContent ? createLongNamePreview(resolved) : resolved);
    }
    void load();
    return () => {
      active = false;
    };
  }, [demo, draftId, longNames, template.id]);

  useEffect(() => {
    const host = previewRef.current;
    if (!host) return;
    const frames = Array.from(host.querySelectorAll("iframe"));
    const cleanups: Array<() => void> = [];
    const frameOffsets = new WeakMap<HTMLIFrameElement, number>();
    const pointerOffsets = new WeakMap<HTMLIFrameElement, number>();

    const subscribeToFrame = (frame: HTMLIFrameElement) => {
      try {
        const doc = frame.contentDocument;
        const view = frame.contentWindow;
        if (!doc || !view) return;

        const getScrollY = () =>
          view.scrollY || doc.documentElement.scrollTop || doc.body.scrollTop || 0;
        frameOffsets.set(frame, getScrollY());

        const onScroll = () => {
          const currentY = getScrollY();
          const delta = currentY - (frameOffsets.get(frame) ?? currentY);
          if (currentY <= 8) setShowControls(false);
          else if (Math.abs(delta) > 2) setShowControls(delta < 0);
          frameOffsets.set(frame, currentY);
        };
        const onWheel = (event: WheelEvent) => {
          if (Math.abs(event.deltaY) > 2) setShowControls(event.deltaY < 0);
        };
        const onPointerDown = (event: PointerEvent) =>
          pointerOffsets.set(frame, event.clientY);
        const onPointerMove = (event: PointerEvent) => {
          if (event.buttons !== 1) return;
          const prior = pointerOffsets.get(frame) ?? event.clientY;
          const delta = event.clientY - prior;
          if (Math.abs(delta) > 2) setShowControls(delta > 0);
          pointerOffsets.set(frame, event.clientY);
        };
        view.addEventListener("scroll", onScroll, { passive: true });
        doc.addEventListener("wheel", onWheel, { passive: true });
        doc.addEventListener("pointerdown", onPointerDown, { passive: true });
        doc.addEventListener("pointermove", onPointerMove, { passive: true });
        cleanups.push(() => {
          view.removeEventListener("scroll", onScroll);
          doc.removeEventListener("wheel", onWheel);
          doc.removeEventListener("pointerdown", onPointerDown);
          doc.removeEventListener("pointermove", onPointerMove);
        });
      } catch {
        // Cross-origin or not-yet-ready preview frames are ignored.
      }
    };

    for (const frame of frames) {
      subscribeToFrame(frame);
      const onLoad = () => subscribeToFrame(frame);
      frame.addEventListener("load", onLoad);
      cleanups.push(() => frame.removeEventListener("load", onLoad));
    }
    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [invitation]);

  return (
    <main className={styles.fullPreview} ref={previewRef}>
      <nav
        className={`${styles.previewControls} ${showControls ? styles.controlsVisible : ""}`}
        aria-label="Dizayn amallari"
        aria-hidden={!showControls}
        inert={!showControls}
      >
        <Link
          className={styles.backButton}
          href="/preview"
          aria-label="Dizaynlar ro‘yxatiga qaytish"
          title="Dizaynlar ro‘yxatiga qaytish"
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </Link>
        {canSelect && canCreate && (
          <Link
            className={styles.createButton}
            href={`/studio?new=1&template=${encodeURIComponent(template.id)}`}
          >
            Yaratish <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        )}
      </nav>
      {!invitation ? (
        <div className={styles.loading}>Dizayn ochilmoqda…</div>
      ) : template.id === "gulli-darvoza" ? (
        <GulliDarvozaInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "anor" ? (
        <AnorInvitation
          invitation={invitation}
          invitationId={invitation.id}
          locale={invitation.defaultLocale}
          preview
          fullPreview
          catalogMusic={catalogPreview}
          sampleWishes={catalogPreview}
        />
      ) : isInvitateTemplate(template.id) ? (
        <InvitateInvitation
          invitation={invitation}
          invitationId={invitation.id}
          locale={invitation.defaultLocale}
          preview
          fullPreview
          catalogMusic={catalogPreview}
          sampleWishes={catalogPreview}
          silentPlayback={silentPlayback}
        />
      ) : isChorloveTemplate(template.id) ? (
        <ChorloveInvitation
          invitation={invitation}
          invitationId={invitation.id}
          locale={invitation.defaultLocale}
          templateId={template.id}
          preview
          fullPreview
          catalogMusic={catalogPreview}
          sampleWishes={catalogPreview}
          silentPlayback={silentPlayback}
          qaReducedMotion={qaReducedMotion}
          qaMobile={qaMobile}
        />
      ) : template.id === "royal-burgundy-edition" ? (
          <VelvetRoyaleInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "olive-manor-edition" ? (
          <OliveManorInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "islamic-edition" ? (
          <IslamicEditionInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "manor-edition" ? (
          <ManorInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : isMarxabaTemplate(template.id) ? (
        <MarxabaInvitation
          invitation={invitation}
          invitationId={invitation.id}
          locale={invitation.defaultLocale}
          templateId={template.id}
          preview
          fullPreview
          catalogMusic={catalogPreview}
          silentPlayback={silentPlayback}
          sampleWishes={catalogPreview}
          qaReducedMotion={qaReducedMotion}
        />
      ) : (
        <div className={styles.unsupported}>
          <p>Bu dizaynning to‘liq ko‘rinishi hali tayyorlanmagan.</p>
          <Link href="/#templates">Dizaynlarni ko‘rish</Link>
        </div>
      )}
    </main>
  );
}
