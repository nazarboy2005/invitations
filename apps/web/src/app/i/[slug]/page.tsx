import { headers } from "next/headers";
import { visitorLocale } from "@taklifnoma/contracts/visitor-locale";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { templateById } from "@taklifnoma/contracts";
import { applyOptionalFeatureVisibility } from "@taklifnoma/contracts/capabilities";
import { getPublishedInvitation } from "@/server/invitations";
import { publicInvitationUrl } from "@/server/publication";
import { invitationShareMetadata } from "@/modules/catalog/invitation-share";
import { resolveGuest } from "@/server/public";
import { AnorInvitation } from "@/templates/anor";
import { WedivoPulauSehati } from "@/templates/kongillar-oroli/renderer";
import { TakliflaFayzliXonadonInvitation } from "@/templates/fayzli-xonadon/renderer";
import { TakliflaErtak } from "@/templates/ertak/renderer";
import { TakliflaGulbog } from "@/templates/gulbog/renderer";
import { TakliflaZarrinGullar } from "@/templates/zarrin-gullar/renderer";
import { ToglarBagridaInvitation } from "@/templates/toglar-bagrida/renderer";
import { TakliflaOltinYol } from "@/templates/oltin-yol/renderer";
import { TakliflaOsmonInvitation } from "@/templates/osmon/renderer";
import { TakliflaParilarErtagiInvitation } from "@/templates/parilar-ertagi/renderer";
import { TakliflaQogozErtagiInvitation } from "@/templates/qogoz-ertagi/renderer";
import { SakuraGuliInvitation } from "@/templates/sakura-guli/renderer";
import { TakliflaSharlarInvitation } from "@/templates/sharlar/renderer";
import { TakliflaYulduzliTun } from "@/templates/yulduzli-tun/renderer";
import { TakliflaTerracottaInvitation } from "@/templates/terrakota/renderer";
import { TakliflaUchrashuv } from "@/templates/uchrashuv/renderer";
import { TakliflaYubileySahifasi } from "@/templates/umr-bahori/renderer";
import { TakliflaBarakali } from "@/templates/baraka/renderer";
import { TakliflaZarhalSahifaInvitation } from "@/templates/zarhal-sahifa/renderer";
import { TakliflaAsalari } from "@/templates/asalari/renderer";
import { TungiSaroyInvitation } from "@/templates/tungi-saroy/renderer";
import { TakliflaTovus } from "@/templates/tovus/renderer";
import { TakliflaTortFasl } from "@/templates/tort-fasl/renderer";
import { MuhrliMaktubInvitation } from "@/templates/muhrli-maktub/renderer";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
import { isInvitateTemplate, InvitateInvitation } from "@/templates/invitate";
import { VelvetRoyaleInvitation } from "@/templates/baxmal-saroy/renderer";
import { OliveManorInvitation } from "@/templates/zaytun/renderer";
import { IslamicEditionInvitation } from "@/templates/islomiy/renderer";
import { MonochromeEditorialInvitation } from "@/templates/oq-qora-lavha/renderer";
import { XatnaEditionInvitation } from "@/templates/xatna/renderer";
import { GulliDarvozaInvitation } from "@/templates/onlinetaklifnoma/gulli-darvoza";
import { OltinDarvozaInvitation } from "@/templates/onlinetaklifnoma/baxt-darvozasi";
import { MingBirKechaInvitation } from "@/templates/onlinetaklifnoma/ming-bir-kecha";
import { ZarrinDoppiInvitation } from "@/templates/onlinetaklifnoma/zarrin-doppi";
import { AndalusDarvozasiInvitation } from "@/templates/onlinetaklifnoma/andalus-darvozasi";
import { SamarqandPeshtoqInvitation } from "@/templates/onlinetaklifnoma/samarqand-peshtoqi";
import { ShishaBogInvitation } from "@/templates/onlinetaklifnoma/shisha-bog";
import { KapadokiyaTongiInvitation } from "@/templates/onlinetaklifnoma/kapadokiya-tongi";
import { BuxoroRavoqInvitation } from "@/templates/onlinetaklifnoma/buxoro-ravogi";
import { JannatBogiInvitation } from "@/templates/onlinetaklifnoma/jannat-bogi";
import { TojmahalOltinDarvozasiInvitation } from "@/templates/onlinetaklifnoma/tojmahal-darvozasi";
import { isChorloveTemplate, ChorloveInvitation } from "@/templates/chorlove";
import { InvitationViewTracker } from "@/modules/catalog/invitation-view-tracker";
export const dynamic = "force-dynamic";
const loadPublishedInvitation = cache(getPublishedInvitation);
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string | string[]; g?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!/^[0-9A-Za-z]{6}$/.test(slug)) notFound();
  const result = await loadPublishedInvitation(slug);
  if (!result || !templateById(result.invitation.templateId)) notFound();
  const query = await searchParams;
  return invitationShareMetadata(result.invitation, slug, publicInvitationUrl(slug), query.lang);
}
export default async function InvitationPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  if (!/^[0-9A-Za-z]{6}$/.test(slug)) notFound();
  const query = await searchParams;
  const result = await loadPublishedInvitation(slug);
  if (!result || !templateById(result.invitation.templateId)) notFound();
  const invitation = applyOptionalFeatureVisibility(result.invitation);
  const requestHeaders = await headers();
  const locale = visitorLocale(invitation, query.lang, requestHeaders.get("x-vercel-ip-country"), requestHeaders.get("accept-language") ?? "");
  let guestName = "";
  if (query.g) {
    try {
      const guest = await resolveGuest(result.id, query.g);
      guestName = String(guest?.display_name ?? "");
    } catch {
      guestName = "";
    }
  }
  if (invitation.templateId === "baxt-darvozasi")
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
  if (invitation.templateId === "buxoro-ravogi")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><BuxoroRavoqInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "jannat-bogi")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><JannatBogiInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "tojmahal-darvozasi")
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
  if (invitation.templateId === "kongillar-oroli")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><WedivoPulauSehati invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "fayzli-xonadon")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaFayzliXonadonInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "ertak")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaErtak invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "gulbog")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaGulbog invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "zarrin-gullar")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaZarrinGullar invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "toglar-bagrida")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><ToglarBagridaInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "oltin-yol")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaOltinYol invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "osmon")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaOsmonInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "parilar-ertagi")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaParilarErtagiInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "qogoz-ertagi")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaQogozErtagiInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "sakura-guli")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><SakuraGuliInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "sharlar")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaSharlarInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "yulduzli-tun")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaYulduzliTun invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "terrakota")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaTerracottaInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "uchrashuv")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaUchrashuv invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "umr-bahori")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaYubileySahifasi invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "baraka")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaBarakali invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "zarhal-sahifa")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaZarhalSahifaInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "tungi-saroy")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TungiSaroyInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "tovus")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaTovus invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "tort-fasl")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaTortFasl invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} /></>;
  if (invitation.templateId === "asalari")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><TakliflaAsalari invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} preview={false} silentPlayback={false} /></>;
  if (invitation.templateId === "muhrli-maktub")
    return <><InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} /><MuhrliMaktubInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} preview={false} silentPlayback={false} /></>;
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

  if (invitation.templateId === "baxmal-saroy")
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
  if (invitation.templateId === "zaytun")
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
  if (invitation.templateId === "islomiy")
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
  if (invitation.templateId === "oq-qora-lavha")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <MonochromeEditorialInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} />
      </>
    );
  if (invitation.templateId === "xatna")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} musicUrl={invitation.music.enabled ? invitation.music.url : ""} />
        <XatnaEditionInvitation invitation={invitation} invitationId={result.id} locale={locale} guestName={guestName} guestToken={query.g} />
      </>
    );
  notFound();
}
