import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { display, sans } from "@/app/platform-fonts";
import styles from "./navigation.module.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${display.variable} ${sans.variable}`}>
      <SiteHeader dashboard catalog />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
