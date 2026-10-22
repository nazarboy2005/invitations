import { notFound } from "next/navigation";
import { templateById } from "@taklifnoma/contracts";
import { getPublishedInvitation } from "@/server/invitations";
import { resolveGuest } from "@/server/public";
import { AnorInvitation } from "@/templates/anor";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
import { isInvitateTemplate, InvitateInvitation } from "@/templates/invitate";
import { VelvetRoyaleInvitation } from "@/templates/velvet-royale/renderer";
import { OliveManorInvitation } from "@/templates/olive-manor/renderer";
import { IslamicEditionInvitation } from "@/templates/islamic-edition/renderer";
import { ManorInvitation } from "@/templates/manor-edition/renderer";
import { GulliDarvozaInvitation } from "@/templates/onlinetaklifnoma/gulli-darvoza";
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
  if (invitation.templateId === "gulli-darvoza")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} />
        <GulliDarvozaInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (invitation.templateId === "anor")
    return (
      <>
        <InvitationViewTracker invitationId={result.id} />
        <AnorInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  if (isMarxabaTemplate(invitation.templateId))
    return (
      <>
        <InvitationViewTracker invitationId={result.id} />
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
        <InvitationViewTracker invitationId={result.id} />
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
        <InvitationViewTracker invitationId={result.id} />
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
        <InvitationViewTracker invitationId={result.id} />
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
        <InvitationViewTracker invitationId={result.id} />
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
        <InvitationViewTracker invitationId={result.id} />
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
        <InvitationViewTracker invitationId={result.id} />
        <ManorInvitation
          invitation={invitation}
          invitationId={result.id}
          locale={locale}
          guestName={guestName}
          guestToken={query.g}
        />
      </>
    );
  notFound();
}
