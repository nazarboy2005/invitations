import { Dashboard } from "@/modules/dashboard/dashboard";
import { SiteHeader } from "@/components/site-header";
import { display, sans } from "@/app/platform-fonts";
export const metadata = { title: "Taklifnomalarim" };
export default function DashboardPage() {
  return (
    <div className={`${display.variable} ${sans.variable}`}>
      <SiteHeader dashboard />
      <Dashboard />
    </div>
  );
}
