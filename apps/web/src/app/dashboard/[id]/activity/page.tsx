import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth";
import { getOwnedInvitation, getOwnedPublishedInvitationBySlug } from "@/server/invitations";
import { InvitationActivity } from "@/modules/dashboard/invitation-activity";
export const dynamic = "force-dynamic";
export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dashboard");
  const { id } = await params;
  const invitation = /^[0-9a-f-]{36}$/i.test(id)
    ? await getOwnedInvitation(id, user.id)
    : /^[0-9A-Za-z]{6}$/.test(id)
      ? await getOwnedPublishedInvitationBySlug(id, user.id)
      : null;
  if (!invitation) notFound();
  return <InvitationActivity invitation={invitation} />;
}
