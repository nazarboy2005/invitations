import { notFound } from "next/navigation";
import { templateById } from "@taklifnoma/contracts";
import { getPublishedInvitation } from "@/server/invitations";
import { resolveGuest } from "@/server/public";
import { AnorInvitation } from "@/templates/anor";
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
  if (invitation.templateId !== "anor") notFound();
  return (
    <AnorInvitation
      invitation={invitation}
      invitationId={result.id}
      locale={locale}
      guestName={guestName}
      guestToken={query.g}
    />
  );
}
