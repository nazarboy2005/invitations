"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  invitationSchema,
  type Invitation,
  type TemplateDefinition,
} from "@taklifnoma/contracts";
import { AnorInvitation } from "@/templates/anor";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
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
  draftId,
  demo = false,
  silentPlayback = false,
  longNames = false,
}: {
  template: TemplateDefinition;
  canSelect: boolean;
  draftId?: string;
  demo?: boolean;
  silentPlayback?: boolean;
  longNames?: boolean;
}) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [catalogPreview, setCatalogPreview] = useState(true);

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

  return (
    <main className={styles.fullPreview}>
      {!invitation ? (
        <div className={styles.loading}>Dizayn ochilmoqda…</div>
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
