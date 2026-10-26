"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  invitationSchema,
  type Invitation,
  type TemplateDefinition,
} from "@taklifnoma/contracts";

import { isMarxabaTemplate } from "@/templates/marxaba/registry";
import { isInvitateTemplate } from "@/templates/invitate/registry";

import { isChorloveTemplate } from "@/templates/chorlove/registry";
import { readBrowserDraft } from "@/modules/studio/draft-storage";
import { CATALOG_PREVIEW_MUSIC } from "./catalog-music";
import { InvitationMusicAutoplay } from "./invitation-view-tracker";
import {
  createTemplatePreviewSample,
  createLongNamePreview,
  hasAuthoredInvitationContent,
} from "./preview-sample";
import styles from "./full-template-preview.module.css";

// Load only the renderer selected by this preview, rather than every design.
const AnorInvitation = dynamic(() => import("@/templates/anor/renderer").then((module) => module.AnorInvitation));
const WedivoPulauSehati = dynamic(() => import("@/templates/wedivo-pulau-sehati/renderer").then((module) => module.WedivoPulauSehati));
const TakliflaZarhalSahifa = dynamic(() => import("@/templates/taklifla-zarhal-sahifa/renderer").then((module) => module.TakliflaZarhalSahifaInvitation));
const MarxabaInvitation = dynamic(() => import("@/templates/marxaba/renderer").then((module) => module.MarxabaInvitation));
const InvitateInvitation = dynamic(() => import("@/templates/invitate/renderer").then((module) => module.InvitateInvitation));
const VelvetRoyaleInvitation = dynamic(() => import("@/templates/velvet-royale/renderer").then((module) => module.VelvetRoyaleInvitation));
const OliveManorInvitation = dynamic(() => import("@/templates/olive-manor/renderer").then((module) => module.OliveManorInvitation));
const IslamicEditionInvitation = dynamic(() => import("@/templates/islamic-edition/renderer").then((module) => module.IslamicEditionInvitation));
const ManorInvitation = dynamic(() => import("@/templates/manor-edition/renderer").then((module) => module.ManorInvitation));
const OshEditionInvitation = dynamic(() => import("@/templates/osh-edition-v1/renderer").then((module) => module.OshEditionInvitation));
const MonochromeEditorialInvitation = dynamic(() => import("@/templates/monochrome-editorial-edition/renderer").then((module) => module.MonochromeEditorialInvitation));
const XatnaEditionInvitation = dynamic(() => import("@/templates/xatna-edition/renderer").then((module) => module.XatnaEditionInvitation));
const AmruMarufEditionInvitation = dynamic(() => import("@/templates/amru-maruf-edition-v1/renderer").then((module) => module.AmruMarufEditionInvitation));
const GulliDarvozaInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/gulli-darvoza").then((module) => module.GulliDarvozaInvitation));
const OltinDarvozaInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/oltin-darvoza-ortidagi-baxt").then((module) => module.OltinDarvozaInvitation));
const MingBirKechaInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/ming-bir-kecha").then((module) => module.MingBirKechaInvitation));
const ZarrinDoppiInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/zarrin-doppi").then((module) => module.ZarrinDoppiInvitation));
const AndalusDarvozasiInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/andalus-darvozasi").then((module) => module.AndalusDarvozasiInvitation));
const SamarqandPeshtoqInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/samarqand-peshtoqi").then((module) => module.SamarqandPeshtoqInvitation));
const ShishaBogInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/shisha-bog").then((module) => module.ShishaBogInvitation));
const KapadokiyaTongiInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/kapadokiya-tongi").then((module) => module.KapadokiyaTongiInvitation));
const BuxoroRavoqInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/buxoro-ravoq").then((module) => module.BuxoroRavoqInvitation));
const JannatBogiInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/jannat-bogi").then((module) => module.JannatBogiInvitation));
const TojmahalOltinDarvozasiInvitation = dynamic(() => import("@/templates/onlinetaklifnoma/tojmahal-oltin-darvozasi").then((module) => module.TojmahalOltinDarvozasiInvitation));
const ChorloveInvitation = dynamic(() => import("@/templates/chorlove/renderer").then((module) => module.ChorloveInvitation));

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
  cardPreview = false,
  posterCapture = false,
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
  cardPreview?: boolean;
  posterCapture?: boolean;
}) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [catalogPreview, setCatalogPreview] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const previewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      let candidate: Invitation | null = null;
      if (draftId && !posterCapture) {
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
      setCatalogPreview(!candidateHasContent && !cardPreview && !posterCapture);
      const result = longNames && !candidateHasContent ? createLongNamePreview(resolved) : resolved;
      setInvitation({
        ...result,
        ...(posterCapture ? { enabledLocales: [result.defaultLocale] } : {}),
        ...((cardPreview || posterCapture) ? { music: { ...result.music, enabled: false, url: "" } } : {}),
      });
    }
    void load();
    return () => {
      active = false;
    };
  }, [cardPreview, demo, draftId, longNames, posterCapture, template.id]);

  useEffect(() => {
    if (!cardPreview || !invitation || !previewRef.current) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cleanups: Array<() => void> = [];
    const opened = new WeakSet<Document>();
    function start(frame: HTMLIFrameElement) {
      timers.push(setTimeout(() => {
        const doc = frame.contentDocument;
        if (!doc || !doc.URL.startsWith(`${window.location.origin}/templates/`) || doc.readyState !== "complete" || opened.has(doc)) return;
        opened.add(doc);
        // Only catalog embeds hide scrollbar chrome; full previews remain scrollable.
        const scrollbarStyle = doc.createElement("style");
        scrollbarStyle.textContent = "html, body, * { scrollbar-width: none !important; } ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }";
        doc.head.append(scrollbarStyle);
        const mute = () => doc.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
          if (!media.muted) media.muted = true;
          if (media.volume !== 0) media.volume = 0;
        });
        mute();
        doc.addEventListener("volumechange", mute, true);
        const observer = new MutationObserver(mute);
        observer.observe(doc.documentElement, { childList: true, subtree: true });
        cleanups.push(() => { observer.disconnect(); doc.removeEventListener("volumechange", mute, true); });
        // Only invitation-opening controls; never submit RSVP, wishes, or links.
        const opener = doc.querySelector<HTMLElement>("#open-invitation, #open-prompt, #open-btn, #openBtn, #openEnvelope, #si-opener, [data-open], [data-gg-source-opening], [data-landing-screenshot-id='invite-envelope']");
        opener?.click();
        window.parent.postMessage({ type: "catalog-preview:ready" }, window.location.origin);
        if (template.id === "doira") {
          timers.push(setTimeout(() => opener?.click(), 450));
          timers.push(setTimeout(() => opener?.click(), 900));
        }
      }, 350));
    }
    const host = previewRef.current;
    const subscribed = new WeakSet<HTMLIFrameElement>();
    function attachFrames() {
      host?.querySelectorAll<HTMLIFrameElement>("iframe").forEach((frame) => {
        if (subscribed.has(frame)) return;
        subscribed.add(frame);
        const onLoad = () => start(frame);
        frame.addEventListener("load", onLoad);
        start(frame);
        cleanups.push(() => frame.removeEventListener("load", onLoad));
      });
    }
    attachFrames();
    // Lazy renderers mount their source frame after this effect has started.
    const framesObserver = new MutationObserver(attachFrames);
    framesObserver.observe(host, { childList: true, subtree: true });
    return () => { framesObserver.disconnect(); timers.forEach(clearTimeout); cleanups.forEach((cleanup) => cleanup()); };
  }, [cardPreview, invitation, template.id]);

  useEffect(() => {
    if (cardPreview) return;
    const host = previewRef.current;
    if (!host) return;
    const subscribed = new WeakSet<HTMLIFrameElement>();
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

    function attachFrames() {
      for (const frame of host!.querySelectorAll("iframe")) {
        if (subscribed.has(frame)) continue;
        subscribed.add(frame);
        subscribeToFrame(frame);
        const onLoad = () => subscribeToFrame(frame);
        frame.addEventListener("load", onLoad);
        cleanups.push(() => frame.removeEventListener("load", onLoad));
      }
    }
    attachFrames();
    const framesObserver = new MutationObserver(attachFrames);
    framesObserver.observe(host, { childList: true, subtree: true });
    return () => {
      framesObserver.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [cardPreview, invitation]);

  return (
    <main className={styles.fullPreview} ref={previewRef} data-card-preview={cardPreview || undefined}>
      {invitation && !cardPreview && !posterCapture && (
        <InvitationMusicAutoplay
          musicUrl={
            silentPlayback
              ? ""
              : catalogPreview
                ? CATALOG_PREVIEW_MUSIC.url
                : invitation.music.enabled
                  ? invitation.music.url
                  : ""
          }
        />
      )}
      {!cardPreview && !posterCapture && <nav
        className={`${styles.previewControls} ${showControls ? styles.controlsVisible : ""}`}
        aria-label="Dizayn amallari"
        aria-hidden={!showControls}
        inert={!showControls}
      >
        <Link
          className={styles.backButton}
          href="/templates"
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
      </nav>}
      {!invitation ? (
        <div className={styles.loading}>Dizayn ochilmoqda…</div>
      ) : template.id === "oltin-darvoza-ortidagi-baxt" ? (
        <OltinDarvozaInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "gulli-darvoza" ? (
        <GulliDarvozaInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "ming-bir-kecha" ? (
        <MingBirKechaInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "samarqand-peshtoqi" ? (
        <SamarqandPeshtoqInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "shisha-bog" ? (
        <ShishaBogInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "kapadokiya-tongi" ? (
        <KapadokiyaTongiInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "buxoro-ravoq" ? (
        <BuxoroRavoqInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "jannat-bogi" ? (
        <JannatBogiInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "tojmahal-oltin-darvozasi" ? (
        <TojmahalOltinDarvozasiInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "andalus-darvozasi" ? (
        <AndalusDarvozasiInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "zarrin-doppi" ? (
        <ZarrinDoppiInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} />
      ) : template.id === "wedivo-pulau-sehati" ? (
        <WedivoPulauSehati invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} />
      ) : template.id === "taklifla-zarhal-sahifa" ? (
        <TakliflaZarhalSahifa invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} />
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
      ) : template.id === "wedivo-pulau-sehati" ? (
        <WedivoPulauSehati invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} />
      ) : template.id === "royal-burgundy-edition" ? (
          <VelvetRoyaleInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "olive-manor-edition" ? (
          <OliveManorInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "islamic-edition" ? (
          <IslamicEditionInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "manor-edition" ? (
          <ManorInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} sampleWishes={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "osh-edition-v1" ? (
          <OshEditionInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "monochrome-editorial-edition" ? (
          <MonochromeEditorialInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "amru-maruf-edition-v1" ? (
        <AmruMarufEditionInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
      ) : template.id === "xatna-edition" ? (
        <XatnaEditionInvitation invitation={invitation} invitationId={invitation.id} locale={invitation.defaultLocale} preview fullPreview catalogMusic={catalogPreview} silentPlayback={silentPlayback} qaReducedMotion={qaReducedMotion} qaMobile={qaMobile} />
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
