import { requireAdminPage } from "@/server/admin-page";
import { getCatalog } from "@/server/catalog";
import { getAdminAudit } from "@/server/admin";
import { AdminTemplates } from "@/modules/admin/admin-templates";
import { AdminMusicLibrary } from "@/modules/admin/admin-music-library";
import { AdminShell } from "@/modules/admin/admin-shell";
import { AdminAudit } from "@/modules/admin/admin-audit";
import {
  AdminUsers,
  AdminInvitations,
  AdminPayments,
  AdminBroadcasts,
} from "@/modules/admin/admin-management";
import {
  listAdminUsers,
  listAdminInvitations,
  listAdminPayments,
} from "@/server/admin-management";
import { listAdminBroadcasts } from "@/server/admin-broadcasts";
import { z } from "zod";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Boshqaruv",
  robots: { index: false, follow: false, noarchive: true },
};
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    q?: string;
    page?: string;
    status?: string;
    userId?: string;
    invitationId?: string;
  }>;
}) {
  const user = await requireAdminPage();
  const query = await searchParams;
  const { view: requestedView } = query;
  const filters = {
    q: query.q,
    page: query.page,
    status: query.status,
    userId: query.userId,
  };
  const view = [
    "users",
    "invitations",
    "payments",
    "broadcasts",
    "templates",
    "categories",
    "music",
    "activity",
  ].includes(requestedView ?? "")
    ? requestedView!
    : "users";
  const catalog =
    view === "templates" || view === "categories"
      ? await getCatalog(true)
      : null;
  if (catalog && !catalog.configured)
    throw new Error("Admin catalog unavailable");
  return (
    <AdminShell user={user} view={view}>
      {view === "users" && (
        <AdminUsers data={await listAdminUsers(filters)} filters={filters} />
      )}
      {view === "invitations" && (
        <AdminInvitations
          data={await listAdminInvitations(filters)}
          filters={filters}
        />
      )}
      {view === "payments" && (
        <AdminPayments
          data={await listAdminPayments(filters)}
          filters={filters}
          initialInvitationId={
            z.uuid().safeParse(query.invitationId).success
              ? query.invitationId
              : undefined
          }
        />
      )}
      {view === "broadcasts" && (
        <AdminBroadcasts
          initialItems={await listAdminBroadcasts()}
          selectedUserId={
            z.uuid().safeParse(query.userId).success ? query.userId : undefined
          }
        />
      )}
      {catalog && (
        <AdminTemplates
          initialCatalog={catalog}
          view={view as "templates" | "categories"}
        />
      )}
      {view === "music" && <AdminMusicLibrary />}
      {view === "activity" && <AdminAudit entries={await getAdminAudit()} />}
    </AdminShell>
  );
}
