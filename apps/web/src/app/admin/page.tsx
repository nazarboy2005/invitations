import { SiteHeader } from "@/components/site-header";
import { AdminTemplates } from "@/modules/admin/admin-templates";
export const metadata = {
  title: "Dizaynlarni boshqarish",
  robots: { index: false, follow: false },
};
export default function AdminPage() {
  return (
    <>
      <SiteHeader compact />
      <AdminTemplates />
    </>
  );
}
