import { Dashboard } from "@/modules/dashboard/dashboard";
import { display, sans } from "@/app/platform-fonts";
export const metadata = { title: "Taklifnomalarim" };
export default function DashboardPage() {
  return (
    <div data-page-scrollbar="gold" className={`${display.variable} ${sans.variable}`}>
      <Dashboard />
    </div>
  );
}
