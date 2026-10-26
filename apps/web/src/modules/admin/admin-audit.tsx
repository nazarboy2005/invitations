import type { getAdminAudit } from "@/server/admin";
import styles from "./admin.module.css";
const actions: Record<string, string> = {
  "template.update": "Dizayn yangilandi",
  "category.create": "Kategoriya yaratildi",
  "category.update": "Kategoriya yangilandi",
  "music.create": "Musiqa qo‘shildi",
  "music.update": "Musiqa yangilandi",
  "user.suspend": "Hisobga kirish cheklandi",
  "user.restore": "Hisobga kirish yoqildi",
  "user.revoke_sessions": "Sessiyalar yopildi",
  "payment.create": "To‘lov qayd etildi",
  "payment.update": "To‘lov yozuvi yangilandi",
  "broadcast.create": "Xabar tayyorlandi",
  "broadcast.confirm": "Xabar yuborishga tasdiqlandi",
  "broadcast.cancel": "Xabar bekor qilindi",
  "invitation.create": "Foydalanuvchiga taklifnoma yaratildi",
  "invitation.update": "Taklifnoma tahrirlandi",
  "invitation.publish": "Taklifnoma nashr qilindi",
  "invitation.archive": "Taklifnoma nashrdan olindi",
  "invitation.delete": "Qoralama o‘chirildi",
  "invitation.extend_deadline": "Tahrirlash muddati uzaytirildi",
  "invitation.moderate": "Tilak yoki chek moderatsiya qilindi",
  "invitation.upload": "Foydalanuvchi uchun fayl yuklandi",
};
const fields: Record<string, string> = {
  published: "Nashr holati",
  priceMinor: "Narx (tiyin)",
  categoryIds: "Kategoriyalar",
  supportedEventTypes: "Tadbir turlari",
  replacementTemplateId: "O‘rinbosar",
  replaced: "Almashtirilgan taklifnomalar",
  name: "Nom",
  position: "Tartib",
  title: "Nom",
  active: "Tanlovda",
  assetId: "Audio fayl",
  reason: "Amal sababi",
  note: "Izoh",
  status: "Holat",
  ownerId: "Foydalanuvchi",
  reference: "Tranzaksiya belgisi",
  amountMinor: "Summa (tiyin)",
  recipientCount: "Qabul qiluvchilar",
  audience: "Auditoriya",
  revokedSessions: "Yopilgan sessiyalar",
  editDeadlineAt: "Tahrirlash muddati",
};
function format(value: unknown): string {
  if (value === true) return "Ha";
  if (value === false) return "Yo‘q";
  if (value == null) return "—";
  return Array.isArray(value) ? value.join(", ") || "—" : String(value);
}
export function AdminAudit({
  entries,
}: {
  entries: Awaited<ReturnType<typeof getAdminAudit>>;
}) {
  return (
    <section className={styles.panel} aria-label="Oxirgi o‘zgarishlar">
      <div className={styles.panelHeading}>
        <h2>Oxirgi 50 ta o‘zgarish</h2>
        <span className={styles.count}>{entries.length} ta yozuv</span>
      </div>
      {!entries.length && (
        <p className={styles.empty}>
          Hali o‘zgarish qayd etilmagan. Saqlangan o‘zgarishlar shu yerda
          ko‘rinadi.
        </p>
      )}
      <div className={styles.auditList}>
        {entries.map((entry) => (
          <details key={entry.id}>
            <summary>
              <span>
                <strong>{actions[entry.action] ?? entry.action}</strong>
                <small>
                  {entry.targetId} — {entry.actorName}
                </small>
              </span>
              <time dateTime={entry.createdAt}>
                {new Intl.DateTimeFormat("uz-Latn", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Tashkent",
                }).format(new Date(entry.createdAt))}{" "}
                (Toshkent)
              </time>
            </summary>
            <dl className={styles.changes}>
              {Object.entries(entry.after)
                .filter(([key]) => key !== "id" && key !== "selectionHash")
                .map(([key, value]) => (
                  <div key={key}>
                    <dt>{fields[key] ?? key}</dt>
                    <dd>
                      {entry.before && key in entry.before && (
                        <>
                          <span>{format(entry.before[key])}</span> →{" "}
                        </>
                      )}
                      {format(value)}
                    </dd>
                  </div>
                ))}
            </dl>
          </details>
        ))}
      </div>
    </section>
  );
}
