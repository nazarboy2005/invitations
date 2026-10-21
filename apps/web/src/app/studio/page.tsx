import { Studio } from "@/modules/studio/studio";
import { display, sans } from "@/app/platform-fonts";
import styles from "@/modules/studio/studio.module.css";
export const metadata = { title: "Taklifnoma yaratish" };
export default function StudioPage() {
  return (
    <div className={`${styles.fonts} ${display.variable} ${sans.variable}`}>
      <Studio />
    </div>
  );
}
