import { SiteHeader } from "@/components/site-header";
import { AdminTemplates } from "@/modules/admin/admin-templates";
import { AdminMusicLibrary } from "@/modules/admin/admin-music-library";
export const metadata = {
  title: "Dizaynlarni boshqarish",
  robots: { index: false, follow: false },
};
export default function AdminPage() {
  return (
    <>
      <SiteHeader compact />
      <>
        <AdminTemplates />
        <div className="container">
          <AdminMusicLibrary />
        </div>
      </>
    </>
  );
}
