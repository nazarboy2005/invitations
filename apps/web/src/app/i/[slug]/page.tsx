import { notFound } from "next/navigation";
import { templateById } from "@taklifnoma/contracts";
import { getPublishedInvitation } from "@/server/invitations";
import { resolveGuest } from "@/server/public";
import { AnorInvitation } from "@/templates/anor";
import { WedivoPulauSehati } from "@/templates/wedivo-pulau-sehati/renderer";
import { TakliflaZarhalSahifaInvitation } from "@/templates/taklifla-zarhal-sahifa/renderer";
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
import { GulliDarvozaInvitation } from "@/templates/onlinetaklifnoma/gulli-darvoza";
import { OltinDarvozaInvitation } from "@/templates/onlinetaklifnoma/oltin-darvoza-ortidagi-baxt";
import { MingBirKechaInvitation } from "@/templates/onlinetaklifnoma/ming-bir-kecha";
import { ZarrinDoppiInvitation } from "@/templates/onlinetaklifnoma/zarrin-doppi";
import { AndalusDarvozasiInvitation } from "@/templates/onlinetaklifnoma/andalus-darvozasi";
import { SamarqandPeshtoqInvitation } from "@/templates/onlinetaklifnoma/samarqand-peshtoqi";
import { ShishaBogInvitation } from "@/templates/onlinetaklifnoma/shisha-bog";
import { KapadokiyaTongiInvitation } from "@/templates/onlinetaklifnoma/kapadokiya-tongi";
import { BuxoroRavoqInvitation } from "@/templates/onlinetaklifnoma/buxoro-ravoq";
import { JannatBogiInvitation } from "@/templates/onlinetaklifnoma/jannat-bogi";
import { TojmahalOltinDarvozasiInvitation } from "@/templates/onlinetaklifnoma/tojmahal-oltin-darvozasi";
import { isChorloveTemplate, ChorloveInvitation } from "@/templates/chorlove";
import { InvitationViewTracker } from "@/modules/catalog/invitation-view-tracker";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Sizga taklifnoma",
  robots: { index: false, follow: false },
};
export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; g?: string }>;
}) {
  const { slug } = await params;
  if (!/^[0-9A-Za-z]{6}$/.test(slug)) notFound();
  const query = await searchParams;
  const result = await getPublishedInvitation(slug);
  if (!result || !templateById(result.invitation.templateId)) notFound();
  const invitation = result.invitation;
  const requested = query.lang;
  const locale = invitation.enabledLocales.includes(
    requested as typeof invitation.defaultLocale,
  )
    ? (requested as typeof invitation.defaultLocale)
    : invitation.defaultLocale;
  let guestName = "";
  if (query.g) {
    try {
      const guest = await resolveGuest(result.id, query.g);
      guestName = String(guest?.display_name ?? "");
    } catch {
      guestName = "";
    }
  }
  if (invitation.templateId === "oltin-darvoza-ortidagi-baxt")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <OltinDarvozaInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (invitation.templateId === "gulli-darvoza")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <GulliDarvozaInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (invitation.templateId === "ming-bir-kecha")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <MingBirKechaInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} />
      </>
    );
  if (invitation.templateId === "shisha-bog")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><ShishaBogInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "kapadokiya-tongi")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><KapadokiyaTongiInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "buxoro-ravoq")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><BuxoroRavoqInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "jannat-bogi")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><JannatBogiInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "tojmahal-oltin-darvozasi")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TojmahalOltinDarvozasiInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "samarqand-peshtoqi")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><SamarqandPeshtoqInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "andalus-darvozasi")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <AndalusDarvozasiInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} />
      </>
    );
  if (invitation.templateId === "zarrin-doppi")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <ZarrinDoppiInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} />
      </>
    );
  if (invitation.templateId === "anor")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <AnorInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (invitation.templateId === "wedivo-pulau-sehati")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><WedivoPulauSehati invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "taklifla-zarhal-sahifa")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaZarhalSahifaInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (isMarxabaTemplate(invitation.templateId))
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <MarxabaInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          templateId={invitation.templateId}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (isInvitateTemplate(invitation.templateId))
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <InvitateInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );

  if (isChorloveTemplate(invitation.templateId))
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <ChorloveInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          templateId={invitation.templateId}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );

  if (invitation.templateId === "royal-burgundy-edition")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <VelvetRoyaleInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (invitation.templateId === "olive-manor-edition")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <OliveManorInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (invitation.templateId === "islamic-edition")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <IslamicEditionInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (invitation.templateId === "manor-edition")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <ManorInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (invitation.templateId === "osh-edition-v1")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <OshEditionInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (invitation.templateId === "monochrome-editorial-edition")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <MonochromeEditorialInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} />
      </>
    );
  if (invitation.templateId === "amru-maruf-edition-v1")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <AmruMarufEditionInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} />
      </>
    );
  if (invitation.templateId === "xatna-edition")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <XatnaEditionInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} />
      </>
    );
  notFound();
}
