import { notFound } from "next/navigation";
import { templateById } from "@taklifnoma/contracts";
import { getPublishedInvitation } from "@/server/invitations";
import { resolveGuest } from "@/server/public";
import { AnorInvitation } from "@/templates/anor";
import { isMarxabaTemplate, MarxabaInvitation } from "@/templates/marxaba";
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
  if (invitation.templateId === "anor")
    return (
      <AnorInvitation
        invitation={invitation}
        invitationId={result.id}
        locale={locale}
        guestName={guestName}
        guestToken={query.g}
      />
    );
  if (isMarxabaTemplate(invitation.templateId))
    return (
      <MarxabaInvitation
        invitation={invitation}
        invitationId={result.id}
        locale={locale}
        templateId={invitation.templateId}
        guestName={guestName}
        guestToken={query.g}
      />
    );
  notFound();
}
