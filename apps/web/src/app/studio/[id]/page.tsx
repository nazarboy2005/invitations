import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { Studio } from "@/modules/studio/studio";
import { SiteHeader } from "@/components/site-header";
import { getSessionUser } from "@/server/auth";
import { getOwnedInvitation } from "@/server/invitations";
export const dynamic = "force-dynamic";
export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  let user;
  try {
    user = await getSessionUser();
  } catch {
    redirect("/dashboard");
  }
  if (!user) redirect("/dashboard");
  const invitation = await getOwnedInvitation(id, user.id);
  if (!invitation) notFound();
  return (
    <>
      <SiteHeader compact />
      <Studio initialInvitation={invitation} />
    </>
  );
}
