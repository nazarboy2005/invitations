"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  invitationSchema,
  type Invitation,
  type TemplateDefinition,
} from "@taklifnoma/contracts";
import { AnorInvitation } from "@/templates/anor";
import { readBrowserDraft } from "@/modules/studio/draft-storage";
import {
  createTemplatePreviewSample,
  hasAuthoredInvitationContent,
} from "./preview-sample";
import styles from "./full-template-preview.module.css";

function previewDraftKey(id: string) {
  return `taklifnoma:full-preview:v1:${id}`;
}

export function FullTemplatePreview({
  template,
  canSelect,
  draftId,
  demo = false,
}: {
  template: TemplateDefinition;
  canSelect: boolean;
  draftId?: string;
  demo?: boolean;
}) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);

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
          : createTemplatePreviewSample(template.id);
      setInvitation(resolved);
    }
    void load();
    return () => {
      active = false;
    };
  }, [demo, draftId, template.id]);

  const returnHref = draftId
    ? `/studio?draft=${encodeURIComponent(draftId)}`
    : "/preview";
  const selectHref = draftId
    ? `/studio?draft=${encodeURIComponent(draftId)}&useTemplate=${encodeURIComponent(template.id)}`
    : `/studio?template=${encodeURIComponent(template.id)}`;

  return (
    <main className={styles.fullPreview}>
      <nav className={styles.previewToolbar} aria-label="Dizayn ko‘rish">
        <Link href={returnHref} className={styles.toolbarBack}>
          <ArrowLeft size={16} />
          <span>{draftId ? "Tahrirga qaytish" : "Dizaynlar"}</span>
        </Link>
        {canSelect && (
          <Link href={selectHref} className={styles.toolbarAction}>
            <span>Shu dizaynni tanlash</span>
            <ArrowUpRight size={16} />
          </Link>
        )}
      </nav>
      {!invitation ? (
        <div className={styles.loading}>Dizayn ochilmoqda…</div>
      ) : template.id === "anor" ? (
        <AnorInvitation
          invitation={invitation}
          invitationId={invitation.id}
          locale={invitation.defaultLocale}
          preview
          fullPreview
        />
      ) : (
        <div className={styles.unsupported}>
          <p>Bu dizaynning to‘liq ko‘rinishi hali tayyorlanmagan.</p>
          <Link href={returnHref}>Orqaga qaytish</Link>
        </div>
      )}
    </main>
  );
}
