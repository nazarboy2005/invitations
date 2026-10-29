import { CalendarDays, ChevronRight, FileText, Settings2, Users } from "lucide-react";
import { LANGUAGE_NAMES } from "@taklifnoma/contracts";
import type { PublicationIssue } from "@taklifnoma/contracts/publication";
import styles from "./studio.module.css";

const groups = [
  { title: "Dizayn", icon: FileText },
  { title: "Asosiy ma’lumotlar", icon: Users },
  { title: "Tadbir tafsilotlari", icon: CalendarDays },
  { title: "Qo‘shimcha imkoniyatlar", icon: Settings2 },
];
function fieldLabel(issue: PublicationIssue) {
  if (issue.path.startsWith("program.")) return `Dastur · ${Number(issue.path.split(".")[1]) + 1}-band vaqti`;
  if (issue.path.includes(".programTitles.")) return "Dastur bandi nomi";
  const field = issue.path.split(".").at(-1);
  return ({ people: "Ismlar", message: "Taklif matni", eventLabel: "Tadbir nomi", venueName: "Tadbir joyi", address: "Manzil", startsAt: "Sana va vaqt", timezone: "Vaqt mintaqasi" } as Record<string, string>)[field ?? ""] ?? issue.message;
}

export function ReadinessChecklist({ issues, onSelect }: {
  issues: PublicationIssue[];
  onSelect: (issue: PublicationIssue) => void;
}) {
  return <div className={styles.readinessChecklist} aria-label="To‘ldirilmagan ma’lumotlar">
    <div className={styles.readinessHeading}><strong>Yana ozgina qoldi</strong><span>{issues.length} ta maydon</span></div>
    {groups.map(({ title, icon: Icon }, section) => {
      const items = issues.filter((issue) => issue.section === section);
      if (!items.length) return null;
      return <section className={styles.readinessGroup} key={section}>
        <h3><Icon size={16} aria-hidden="true" />{title}</h3>
        <div>{items.map((issue) => <button key={issue.path} type="button" title={issue.message} onClick={() => onSelect(issue)}>
          <span>{fieldLabel(issue)}</span>
          {issue.locale && <small>{LANGUAGE_NAMES[issue.locale]}</small>}
          <ChevronRight size={14} aria-hidden="true" />
        </button>)}</div>
      </section>;
    })}
  </div>;
}
