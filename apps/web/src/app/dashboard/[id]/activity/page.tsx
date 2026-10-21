import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth";
import { getOwnedInvitation } from "@/server/invitations";
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
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const invitation = await getOwnedInvitation(id, user.id);
  if (!invitation) notFound();
  return <InvitationActivity invitation={invitation} />;
}
