import { notFound } from "next/navigation";
import { requireAdminPage } from "@/server/admin-page";
import { getAdminInvitationOwner } from "@/server/admin-management";
import { getOwnedInvitation } from "@/server/invitations";
import { Studio } from "@/modules/studio/studio";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administrator tahriri",
  robots: { index: false, follow: false },
};
export default async function AdminEditPage({
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
    <Studio
      initialInvitation={invitation}
      adminContext={{ ownerId: owner.id, ownerName: owner.displayName }}
    />
  );
}
