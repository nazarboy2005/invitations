import { Dashboard } from "@/modules/dashboard/dashboard";
import { SiteHeader } from "@/components/site-header";
export const metadata = { title: "Taklifnomalarim" };
export default function DashboardPage() {
  return (
    <>
      <SiteHeader compact />
      <Dashboard />
    </>
  );
}
