import { notFound } from "next/navigation";
import { requireAdminPage } from "@/server/admin-page";
import { getAdminUser } from "@/server/admin-management";
import { getCatalog } from "@/server/catalog";
import { AdminShell } from "@/modules/admin/admin-shell";
import { AdminUserDetails } from "@/modules/admin/admin-management";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Foydalanuvchini boshqarish",
  robots: { index: false, follow: false },
};
export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const actor = await requireAdminPage();
  const { id } = await params;
  let user;
  try {
    user = await getAdminUser(id);
  } catch {
    notFound();
  }
  const catalog = await getCatalog(true);
  if (!catalog.configured) throw new Error("Admin catalog unavailable");
  return (
    <AdminShell user={actor} view="users">
      <AdminUserDetails
        user={user}
        templates={catalog.templates}
        actorId={actor.id}
      />
    </AdminShell>
  );
}
