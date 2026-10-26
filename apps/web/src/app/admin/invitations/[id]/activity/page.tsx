import { notFound } from "next/navigation";
import { requireAdminPage } from "@/server/admin-page";
import { getAdminInvitationOwner } from "@/server/admin-management";
import { getOwnedInvitation } from "@/server/invitations";
import { InvitationActivity } from "@/modules/dashboard/invitation-activity";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Taklifnoma faolligi",
  robots: { index: false, follow: false },
};
export default async function AdminActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  let owner;
  try {
    owner = await getAdminInvitationOwner(id);
  } catch {
    notFound();
  }
  const invitation = await getOwnedInvitation(id, owner.id);
  if (!invitation) notFound();
  return (
    <InvitationActivity
      invitation={invitation}
      adminContext={{ ownerName: owner.displayName }}
    />
  );
}
