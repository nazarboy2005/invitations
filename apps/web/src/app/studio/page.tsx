import { Studio } from "@/modules/studio/studio";
import { SiteHeader } from "@/components/site-header";
export const metadata = { title: "Taklifnoma yaratish" };
export default function StudioPage() {
  return (
    <>
      <SiteHeader compact />
      <Studio />
    </>
  );
}
