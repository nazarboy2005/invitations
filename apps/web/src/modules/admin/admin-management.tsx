"use client";
import { useEffect, useRef, useState, useId, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Copy, Search, Send } from "lucide-react";
import { formatPrice, type TemplateDefinition } from "@taklifnoma/contracts";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useAdminDirty } from "./admin-navigation-guard";
import {
  amountToMinor,
  broadcastDeliveryText,
  paymentLabels,
  paymentTransitions,
  type AdminUser,
  type AdminInvitation,
  type AdminPayment,
  type AdminBroadcast,
  type PageResult,
  type ManagementFilters,
  type PaymentStatus,
} from "./management-contract";
import type { getAdminUser } from "@/server/admin-management";
import styles from "./admin.module.css";

async function api<T = Record<string, unknown>>(
  url: string,
  body?: unknown,
  method = "POST",
): Promise<T> {
  const response = await fetch(url, {
    ...(body === undefined
      ? { cache: "no-store" as const }
      : {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      result.error?.message ?? "So‘rov bajarilmadi. Qayta urinib ko‘ring.",
    );
  return result;
}
function Message({ error, notice }: { error: string; notice?: string }) {
  return (
    <>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className={styles.notice}>
          {notice}
        </p>
      )}
    </>
  );
}
function Filters({
  view,
  filters,
  statuses,
}: {
  view: string;
  filters: ManagementFilters;
  statuses?: Array<[string, string]>;
}) {
  return (
    <form className={styles.toolbar} action="/admin">
      <input type="hidden" name="view" value={view} />
      {filters.userId && (
        <input type="hidden" name="userId" value={filters.userId} />
      )}
      <label className={styles.search}>
        <Search size={17} aria-hidden="true" />
        <span className={styles.srOnly}>Qidirish</span>
        <input
          name="q"
          type="search"
          defaultValue={filters.q ?? ""}
          autoComplete="off"
          placeholder="Ism, belgi yoki havola bo‘yicha qidirish…"
        />
      </label>
      <div className={styles.inlineActions}>
        {statuses && (
          <label className={styles.statusFilter}>
            <span>Holat</span>
            <select name="status" defaultValue={filters.status ?? ""}>
              <option value="">Barchasi</option>
              {statuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="button secondary">Qidirish</button>
        {filters.userId && (
          <Link className="button secondary" href={`/admin?view=${view}`}>
            Filtrni tozalash
          </Link>
        )}
      </div>
    </form>
  );
}
function Pagination({
  data,
  view,
  filters,
}: {
  data: { page: number; pages: number; total: number };
  view: string;
  filters: ManagementFilters;
}) {
  const href = (page: number) => {
    const query = new URLSearchParams({ view, page: String(page) });
    for (const [key, value] of Object.entries(filters))
      if (value && key !== "page") query.set(key, value);
    return "/admin?" + query.toString();
  };
  return (
    <nav className={styles.pagination} aria-label="Natijalar sahifalari">
      <span>
        {data.total} ta natija · {data.page} / {data.pages}
      </span>
      <div>
        {data.page > 1 && (
          <Link className="button secondary" href={href(data.page - 1)}>
            Oldingi
          </Link>
        )}
        {data.page < data.pages && (
          <Link className="button secondary" href={href(data.page + 1)}>
            Keyingi
          </Link>
        )}
      </div>
    </nav>
  );
}
function ActionDialog({
  title,
  children,
  busy,
  onCancel,
  onSubmit,
  label = "Saqlash",
  disabled = false,
}: {
  title: string;
  children: React.ReactNode;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  label?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId();
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className={styles.actionDialog}
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
    >
      <form onSubmit={onSubmit}>
        <h2 id={id}>{title}</h2>
        {children}
        <div className={styles.inlineActions}>
          <button
            type="button"
            className="button secondary"
            disabled={busy}
            onClick={onCancel}
          >
            Bekor qilish
          </button>
          <button className="button" disabled={busy || disabled}>
            {busy ? "Saqlanmoqda…" : label}
          </button>
        </div>
      </form>
    </dialog>
  );
}
const date = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Tashkent",
  }).format(new Date(value));
function Reason({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.field}>
      Amal sababi
      <textarea
        name="reason"
        minLength={5}
        maxLength={1000}
        required
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nima sababdan o‘zgartiryapsiz…"
      />
    </label>
  );
}

export function AdminUsers({
  data,
  filters,
}: {
  data: PageResult<AdminUser>;
  filters: ManagementFilters;
}) {
  return (
    <>
      <Filters
        view="users"
        filters={filters}
        statuses={[
          ["active", "Faol"],
          ["suspended", "Kirish cheklangan"],
        ]}
      />
      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>Foydalanuvchilar</h2>
          <span className={styles.count}>{data.total} ta hisob</span>
        </div>
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <caption className={styles.srOnly}>
              Foydalanuvchilar va taklifnomalari
            </caption>
            <thead>
              <tr>
                <th>Foydalanuvchi</th>
                <th>Taklifnomalar</th>
                <th>Telegram</th>
                <th>Hisob</th>
                <th>
                  <span className={styles.srOnly}>Amallar</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link
                      className={styles.textLink}
                      href={`/admin/users/${user.id}`}
                    >
                      {user.name}
                    </Link>
                    <small>
                      {user.username ? "@" + user.username : user.telegramId}
                      {user.phoneLast4 ? ` · •••• ${user.phoneLast4}` : ""}
                    </small>
                  </td>
                  <td>
                    <Link href={`/admin?view=invitations&userId=${user.id}`}>
                      {user.invitations} ta{" "}
                      <small>{user.published} ta nashr qilingan</small>
                    </Link>
                  </td>
                  <td>
                    {user.reachable
                      ? "Xabar olish mumkin"
                      : "Xabarlar o‘chirilgan"}
                  </td>
                  <td>
                    <span
                      className={
                        user.disabledAt ? styles.hidden : styles.published
                      }
                    >
                      {user.disabledAt
                        ? "Cheklangan"
                        : user.isAdmin
                          ? "Administrator"
                          : "Faol"}
                    </span>
                  </td>
                  <td>
                    <Link
                      className="button secondary"
                      href={`/admin/users/${user.id}`}
                    >
                      Boshqarish
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!data.items.length && (
          <p className={styles.empty}>Foydalanuvchi topilmadi.</p>
        )}
        <Pagination data={data} view="users" filters={filters} />
      </section>
    </>
  );
}
export function AdminUserDetails({
  user,
  templates,
  actorId,
}: {
  user: Awaited<ReturnType<typeof getAdminUser>>;
  templates: TemplateDefinition[];
  actorId: string;
}) {
  const router = useRouter(),
    [action, setAction] = useState<
      "suspend" | "restore" | "revoke_sessions" | "create" | null
    >(null),
    [reason, setReason] = useState(""),
    [template, setTemplate] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useAdminDirty(!!action && !!reason);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (action === "create") {
        const result = await api<{ id: string }>(
          `/api/admin/users/${user.id}/invitations`,
          { templateId: template, reason },
        );
        router.push(`/admin/invitations/${result.id}/edit`);
      } else {
        await api(`/api/admin/users/${user.id}`, { action, reason }, "PATCH");
        setNotice("Hisob yangilandi.");
        setAction(null);
        setReason("");
        router.refresh();
      }
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Message error={error} notice={notice} />
      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>{user.name}</h2>
          <span className={user.disabledAt ? styles.hidden : styles.published}>
            {user.disabledAt
              ? "Kirish cheklangan"
              : user.isAdmin
                ? "Administrator"
                : "Faol hisob"}
          </span>
        </div>
        <dl className={styles.detailGrid}>
          <div>
            <dt>Telegram</dt>
            <dd>
              {user.username ? "@" + user.username : "—"}{" "}
              <small>{user.telegramId}</small>
            </dd>
          </div>
          <div>
            <dt>Telefon</dt>
            <dd>{user.phone ?? "Ulashilmagan"}</dd>
          </div>
          <div>
            <dt>Ro‘yxatdan o‘tgan</dt>
            <dd>{date(user.createdAt)}</dd>
          </div>
          <div>
            <dt>Umumiy xabarlar</dt>
            <dd>
              {user.optedOut
                ? "Foydalanuvchi o‘chirgan"
                : user.telegramStatus === "active"
                  ? "Yoqilgan"
                  : "Telegramga ulanish mavjud emas"}
            </dd>
          </div>
        </dl>
        {user.disabledReason && (
          <p className={styles.notice}>{user.disabledReason}</p>
        )}
        <div className={styles.inlineActions}>
          <Link
            className="button secondary"
            href={`/admin?view=invitations&userId=${user.id}`}
          >
            Taklifnomalari
          </Link>
          <Link
            className="button secondary"
            href={`/admin?view=payments&userId=${user.id}`}
          >
            To‘lovlari
          </Link>
          <Link
            className="button secondary"
            href={`/admin?view=broadcasts&userId=${user.id}`}
          >
            <Send size={15} aria-hidden="true" />
            Xabar tayyorlash
          </Link>
          <button
            className="button"
            disabled={!!user.disabledAt}
            onClick={() => {
              setAction("create");
              setReason("");
            }}
          >
            Taklifnoma yaratish
          </button>
        </div>
        <div className={styles.dangerZone}>
          <h3>Hisobga kirish</h3>
          <p>
            Kirishni cheklash mavjud taklifnoma va to‘lov tarixini o‘chirmaydi.
            Qayta yoqilgach foydalanuvchi yana Telegram orqali kiradi.
          </p>
          <div className={styles.inlineActions}>
            <button
              className="button secondary"
              disabled={user.isAdmin}
              onClick={() => {
                setAction(user.disabledAt ? "restore" : "suspend");
                setReason("");
              }}
            >
              {user.disabledAt ? "Kirishni qayta yoqish" : "Kirishni cheklash"}
            </button>
            <button
              className="button secondary"
              disabled={user.id === actorId}
              onClick={() => {
                setAction("revoke_sessions");
                setReason("");
              }}
            >
              Barcha qurilmalardan chiqarish
            </button>
          </div>
        </div>
      </section>
      {action && (
        <ActionDialog
          title={
            action === "create"
              ? "Foydalanuvchiga taklifnoma yaratish"
              : action === "suspend"
                ? "Hisobga kirishni cheklash"
                : action === "restore"
                  ? "Hisobga kirishni yoqish"
                  : "Barcha sessiyalarni yopish"
          }
          onCancel={() => setAction(null)}
          onSubmit={submit}
          busy={busy}
        >
          {action === "create" && (
            <label className={styles.field}>
              Dizayn
              <select
                name="template"
                required
                value={template}
                onChange={(event) => setTemplate(event.target.value)}
              >
                <option value="">Dizayn tanlang</option>
                {templates
                  .filter((item) => item.published)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {formatPrice(item.priceMinor)}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <Reason value={reason} onChange={setReason} />
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
        </ActionDialog>
      )}
    </>
  );
}
export function AdminInvitations({
  data,
  filters,
}: {
  data: PageResult<AdminInvitation>;
  filters: ManagementFilters;
}) {
  const router = useRouter(),
    [target, setTarget] = useState<{
      invitation: AdminInvitation;
      action: "archive" | "delete" | "extend_deadline";
    } | null>(null),
    [reason, setReason] = useState(""),
    [deadline, setDeadline] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useAdminDirty(!!target && !!reason);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target) return;
    setBusy(true);
    setError("");
    try {
      await api(
        `/api/admin/invitations/${target.invitation.id}`,
        {
          action: target.action,
          reason,
          ...(target.action === "extend_deadline"
            ? { deadline: new Date(deadline).toISOString() }
            : {}),
        },
        "PATCH",
      );
      setTarget(null);
      setReason("");
      setNotice("Taklifnoma yangilandi.");
      router.refresh();
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const open = (
    invitation: AdminInvitation,
    action: "archive" | "delete" | "extend_deadline",
  ) => {
    setTarget({ invitation, action });
    setReason("");
    setError("");
  };
  return (
    <>
      <Filters
        view="invitations"
        filters={filters}
        statuses={[
          ["draft", "Qoralama"],
          ["published", "Nashr qilingan"],
          ["archived", "Nashrdan olingan"],
        ]}
      />
      <Message error={error} notice={notice} />
      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>Foydalanuvchilar taklifnomalari</h2>
          <span className={styles.count}>{data.total} ta taklifnoma</span>
        </div>
        <div className={styles.invitationRows}>
          {data.items.map((item) => (
            <article key={item.id} className={styles.invitationRow}>
              <div className={styles.rowTitle}>
                <div>
                  <h3>{item.people || "Nomsiz taklifnoma"}</h3>
                  <Link
                    className={styles.textLink}
                    href={`/admin/users/${item.ownerId}`}
                  >
                    {item.ownerName}
                  </Link>
                  <small>
                    {item.templateName} ·{" "}
                    {item.startsAt || "Sana belgilanmagan"}
                  </small>
                </div>
                <span
                  className={
                    item.status === "published"
                      ? styles.published
                      : styles.hidden
                  }
                >
                  {item.status === "published"
                    ? "Nashr qilingan"
                    : item.status === "draft"
                      ? "Qoralama"
                      : "Nashrdan olingan"}
                </span>
              </div>
              {item.url ? (
                <div className={styles.linkBar}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    aria-label="Taklifnoma havolasini nusxalash"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(item.url!);
                        setNotice("Havola nusxalandi.");
                      } catch {
                        setError(
                          "Havolani nusxalab bo‘lmadi. Matnini belgilang va nusxalang.",
                        );
                      }
                    }}
                  >
                    <Copy size={16} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <p className={styles.mutedSmall}>
                  Hali umumiy havola yaratilmagan.
                </p>
              )}
              <div className={styles.inlineActions}>
                <Link
                  className="button secondary"
                  href={`/admin/invitations/${item.id}/edit`}
                >
                  Tahrirlash
                </Link>
                <Link
                  className="button secondary"
                  href={`/admin/invitations/${item.id}/activity`}
                >
                  Javoblar, tilaklar va cheklar
                </Link>
                <Link
                  className="button secondary"
                  href={`/admin?view=payments&invitationId=${item.id}`}
                >
                  To‘lov qo‘shish
                </Link>
                {item.status === "published" && (
                  <>
                    <button
                      className="button secondary"
                      onClick={() => open(item, "extend_deadline")}
                    >
                      Muddatni uzaytirish
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => open(item, "archive")}
                    >
                      Nashrdan olish
                    </button>
                  </>
                )}
                {item.status === "draft" && (
                  <button
                    className="button secondary"
                    onClick={() => open(item, "delete")}
                  >
                    Qoralamani o‘chirish
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        {!data.items.length && (
          <p className={styles.empty}>Taklifnoma topilmadi.</p>
        )}
        <Pagination view="invitations" filters={filters} data={data} />
      </section>
      {target && (
        <ActionDialog
          title={
            target.action === "archive"
              ? "Taklifnomani nashrdan olish"
              : target.action === "delete"
                ? "Qoralamani o‘chirish"
                : "Tahrirlash muddatini uzaytirish"
          }
          busy={busy}
          onCancel={() => setTarget(null)}
          onSubmit={submit}
          label={
            target.action === "delete" ? "Qoralamani o‘chirish" : "Tasdiqlash"
          }
        >
          <p>{target.invitation.people || target.invitation.ownerName}</p>
          {target.action === "archive" && (
            <p>Havola saqlanadi, lekin mehmonlar taklifnomani ko‘ra olmaydi.</p>
          )}
          {target.action === "delete" && (
            <p>
              Qoralama o‘chiriladi. To‘lov tarixiga bog‘langan taklifnomalar
              saqlanadi.
            </p>
          )}
          {target.action === "extend_deadline" && (
            <label className={styles.field}>
              Yangi muddat (qurilmangiz vaqti)
              <input
                type="datetime-local"
                required
                name="deadline"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </label>
          )}
          <Reason value={reason} onChange={setReason} />
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
        </ActionDialog>
      )}
    </>
  );
}

export function AdminPayments({
  data,
  filters,
  initialInvitationId = "",
}: {
  data: PageResult<AdminPayment>;
  filters: ManagementFilters;
  initialInvitationId?: string;
}) {
  const router = useRouter(),
    [create, setCreate] = useState(!!initialInvitationId),
    [target, setTarget] = useState<AdminPayment | null>(null),
    [invitationId, setInvitationId] = useState(initialInvitationId),
    [amount, setAmount] = useState(""),
    [reference, setReference] = useState(""),
    [note, setNote] = useState(""),
    [status, setStatus] = useState<PaymentStatus>("pending"),
    [confirm, setConfirm] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const key = useRef<string | null>(null);
  useAdminDirty((create || !!target) && !!(amount || note || reference));
  function close() {
    setCreate(false);
    setTarget(null);
    setAmount("");
    setNote("");
    setReference("");
    setConfirm(false);
  }
  async function save() {
    setBusy(true);
    setError("");
    try {
      const minor = amountToMinor(amount);
      if (minor === null) throw new Error("Summani so‘mda to‘g‘ri kiriting.");
      if (create) {
        key.current ??= crypto.randomUUID();
        await api("/api/admin/payments", {
          invitationId,
          amountMinor: minor,
          reference,
          note,
          idempotencyKey: key.current,
        });
        key.current = null;
      } else if (target)
        await api(
          `/api/admin/payments/${target.id}`,
          {
            revision: target.revision,
            status,
            amountMinor: minor,
            reference,
            note,
          },
          "PATCH",
        );
      close();
      setNotice("To‘lov yozuvi saqlandi. Bu amal bank orqali pul o‘tkazmaydi.");
      router.refresh();
    } catch (cause) {
      setError((cause as Error).message);
      setConfirm(false);
    } finally {
      setBusy(false);
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      target &&
      status !== target.status &&
      (status === "received" || status === "refunded")
    ) {
      setConfirm(true);
      return;
    }
    void save();
  }
  return (
    <>
      <div className={styles.notice}>
        <strong>Platforma to‘lovlari registri</strong>
        <p>
          Click orqali tasdiqlangan to‘lovlar va qo‘lda yuritiladigan registr.
          Nodze yozuvlari faqat server tasdig‘i bilan yangilanadi. To‘yona
          cheklari alohida, taklifnoma faolligida.
        </p>
        <div className={styles.inlineActions}>
          <Link className="button secondary" href="/admin?view=templates">
            Dizayn narxlarini belgilash
          </Link>
          <button
            className="button"
            onClick={() => {
              close();
              setCreate(true);
              setInvitationId(initialInvitationId);
            }}
          >
            To‘lov yozuvi qo‘shish
          </button>
        </div>
      </div>
      <Filters
        view="payments"
        filters={filters}
        statuses={Object.entries(paymentLabels) as Array<[string, string]>}
      />
      <Message error={error} notice={notice} />
      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>To‘lovlar</h2>
          <span className={styles.count}>{data.total} ta yozuv</span>
        </div>
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <caption className={styles.srOnly}>
              Qo‘lda qayd etilgan platforma to‘lovlari
            </caption>
            <thead>
              <tr>
                <th>Foydalanuvchi / dizayn</th>
                <th>Summa</th>
                <th>Holat</th>
                <th>Sana / izoh</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <strong>{payment.ownerName}</strong>
                    <small>{payment.templateName}</small>
                    <Link
                      className={styles.textLink}
                      href={`/admin/invitations/${payment.invitationId}/edit`}
                    >
                      Taklifnoma
                    </Link>
                  </td>
                  <td>
                    {formatPrice(payment.amountMinor)}
                    <small>
                      {payment.method === "nodze"
                        ? "Nodze / Click"
                        : "Qo‘lda qayd etilgan"}
                    </small>
                  </td>
                  <td>
                    <span
                      className={
                        payment.status === "received"
                          ? styles.published
                          : styles.hidden
                      }
                    >
                      {payment.providerStatus ?? paymentLabels[payment.status]}
                    </span>
                  </td>
                  <td>
                    {date(payment.createdAt)}
                    <small>{payment.reference || payment.note}</small>
                  </td>
                  <td>
                    {payment.method !== "nodze" && (
                      <button
                        className="button secondary"
                        onClick={() => {
                          setTarget(payment);
                          setCreate(false);
                          setAmount(String(payment.amountMinor / 100));
                          setReference(payment.reference);
                          setNote("");
                          setStatus(payment.status);
                        }}
                      >
                        Boshqarish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!data.items.length && (
          <p className={styles.empty}>
            Hali to‘lov qayd etilmagan. Bepul nashrlar uchun to‘lov yozuvi
            yaratilmaydi.
          </p>
        )}
        <Pagination view="payments" filters={filters} data={data} />
      </section>
      {(create || target) && !confirm && (
        <ActionDialog
          title={
            create ? "To‘lov yozuvini yaratish" : "To‘lov yozuvini boshqarish"
          }
          busy={busy}
          onCancel={close}
          onSubmit={submit}
        >
          {create && (
            <label className={styles.field}>
              Taklifnoma identifikatori
              <input
                required
                name="invitationId"
                value={invitationId}
                onChange={(event) => setInvitationId(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <small>
                Taklifnoma ro‘yxatidagi «To‘lov qo‘shish» orqali avtomatik
                tanlash mumkin.
              </small>
            </label>
          )}
          <label className={styles.field}>
            Summa (so‘m)
            <input
              name="amount"
              inputMode="decimal"
              required
              value={amount}
              disabled={!!target && target.status !== "pending"}
              onChange={(event) => setAmount(event.target.value)}
              autoComplete="off"
            />
          </label>
          {target && (
            <label className={styles.field}>
              Holat
              <select
                name="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as PaymentStatus)
                }
              >
                {[target.status, ...paymentTransitions[target.status]].map(
                  (value) => (
                    <option key={value} value={value}>
                      {paymentLabels[value]}
                    </option>
                  ),
                )}
              </select>
            </label>
          )}
          <label className={styles.field}>
            Tranzaksiya yoki hujjat belgisi
            <input
              name="reference"
              maxLength={120}
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              autoComplete="off"
            />
          </label>
          <Reason value={note} onChange={setNote} />
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
        </ActionDialog>
      )}
      {confirm && (
        <ConfirmationDialog
          title={
            status === "received"
              ? "To‘lov qabul qilinganini qayd etasizmi?"
              : "Pul qaytarilganini qayd etasizmi?"
          }
          description={`${formatPrice(target!.amountMinor)}. Avval bank hisobingizni tekshiring. Bu amal pul yechmaydi yoki qaytarmaydi; faqat qo‘lda yuritiladigan registrni yangilaydi.`}
          confirmLabel="Qayd etish"
          onCancel={() => setConfirm(false)}
          onConfirm={() => void save()}
          busy={busy}
        />
      )}
    </>
  );
}

function RecipientPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState(""),
    [items, setItems] = useState<AdminUser[]>([]),
    [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController(),
      timer = setTimeout(() => {
        fetch(`/api/admin/users?q=${encodeURIComponent(query)}`, {
          cache: "no-store",
          signal: controller.signal,
        })
          .then(async (response) => {
            const result = await response.json();
            if (!response.ok)
              throw new Error(result.error?.message ?? "Ro‘yxat yuklanmadi.");
            setItems(result.items ?? []);
          })
          .catch((cause) => {
            if (!controller.signal.aborted) setError(cause.message);
          });
      }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  return (
    <fieldset className={styles.recipientPicker}>
      <legend>Foydalanuvchilarni tanlang ({selected.length})</legend>
      <label className={styles.field}>
        <span className={styles.srOnly}>Foydalanuvchi qidirish</span>
        <input
          name="userSearch"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ism yoki Telegram bo‘yicha qidirish…"
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <div>
        {items.map((user) => (
          <label key={user.id}>
            <input
              type="checkbox"
              checked={selected.includes(user.id)}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...selected, user.id]
                    : selected.filter((id) => id !== user.id),
                )
              }
            />
            <span>
              {user.name}
              <small>
                {user.username ? "@" + user.username : user.telegramId}
                {!user.reachable ? " · Xabarlar o‘chirilgan" : ""}
              </small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function AdminBroadcasts({
  initialItems,
  selectedUserId,
}: {
  initialItems: AdminBroadcast[];
  selectedUserId?: string;
}) {
  const [items, setItems] = useState(initialItems),
    [title, setTitle] = useState(""),
    [message, setMessage] = useState(""),
    [audience, setAudience] = useState(selectedUserId ? "selected" : "all"),
    [userIds, setUserIds] = useState<string[]>(
      selectedUserId ? [selectedUserId] : [],
    ),
    [busy, setBusy] = useState(false),
    [sending, setSending] = useState<string | null>(null),
    [confirm, setConfirm] = useState<AdminBroadcast | null>(null),
    [cancel, setCancel] = useState<AdminBroadcast | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const alive = useRef(true),
    key = useRef<string | null>(null);
  useAdminDirty(!!(title || message));
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => setItems(initialItems), [initialItems]);
  async function load() {
    const result = await api<{ items: AdminBroadcast[] }>(
      "/api/admin/broadcasts",
    );
    if (alive.current) setItems(result.items);
    return result.items;
  }
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      key.current ??= crypto.randomUUID();
      const created = await api<{ id: string }>("/api/admin/broadcasts", {
        title,
        message,
        audience,
        userIds: audience === "selected" ? userIds : [],
        idempotencyKey: key.current,
      });
      const current = await load();
      setConfirm(current.find((item) => item.id === created.id) ?? null);
      setTitle("");
      setMessage("");
      key.current = null;
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function drain(id: string) {
    setSending(id);
    setError("");
    try {
      while (alive.current) {
        const result = await api<{ processed: number; busy: boolean }>(
          `/api/admin/broadcasts/${id}/dispatch`,
          {},
        );
        const current = await load();
        if (
          !current.find((item) => item.id === id && item.status === "queued") ||
          result.processed === 0
        )
          break;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      if (alive.current)
        setNotice(
          "Yuborish holati yangilandi. Tasdiqlanmagan yetkazishlar qayta yuborilmaydi.",
        );
    } catch (cause) {
      if (alive.current) setError((cause as Error).message);
    } finally {
      if (alive.current) setSending(null);
    }
  }
  async function approve() {
    if (!confirm) return;
    const target = confirm;
    setBusy(true);
    setError("");
    try {
      await api(
        `/api/admin/broadcasts/${target.id}`,
        { action: "confirm", recipientCount: target.recipientCount },
        "PATCH",
      );
      setConfirm(null);
      await load();
      void drain(target.id);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Message error={error} notice={notice} />
      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>Telegram xabari tayyorlash</h2>
          <Send size={18} aria-hidden="true" />
        </div>
        <p className={styles.mutedSmall}>
          Xabar faqat botga ulangan, faol foydalanuvchilarga yuboriladi. /stop
          orqali xabarlarni o‘chirganlar chiqarib tashlanadi. Mehmonlarga xabar
          yuborilmaydi.
        </p>
        <form onSubmit={prepare} className={styles.managementForm}>
          <label className={styles.field}>
            Ichki nom
            <input
              name="title"
              required
              maxLength={120}
              value={title}
              disabled={busy}
              onChange={(event) => {
                setTitle(event.target.value);
                key.current = null;
              }}
              placeholder="Masalan: Yangi dizaynlar…"
            />
          </label>
          <label className={styles.field}>
            Auditoriya
            <select
              name="audience"
              value={audience}
              disabled={busy}
              onChange={(event) => {
                setAudience(event.target.value);
                key.current = null;
              }}
            >
              <option value="all">Barcha faol foydalanuvchilar</option>
              <option value="published">
                Nashr qilingan taklifnomasi borlar
              </option>
              <option value="drafts">Qoralamasi borlar</option>
              <option value="selected">Tanlangan foydalanuvchilar</option>
            </select>
          </label>
          {audience === "selected" && (
            <RecipientPicker
              selected={userIds}
              onChange={(ids) => {
                setUserIds(ids);
                key.current = null;
              }}
            />
          )}
          <label className={styles.field}>
            Xabar matni
            <textarea
              name="message"
              required
              maxLength={3500}
              rows={6}
              value={message}
              disabled={busy}
              onChange={(event) => {
                setMessage(event.target.value);
                key.current = null;
              }}
              placeholder="Foydalanuvchilarga yuboriladigan xabar…"
            />
            <small>
              {message.length} / 3500 belgi. Oddiy matn; havolalar oldindan
              ochilmaydi.
            </small>
          </label>
          <button className="button" disabled={busy || !!sending}>
            {busy ? "Tayyorlanmoqda…" : "Auditoriya va xabarni tekshirish"}
          </button>
        </form>
      </section>
      <section className={styles.panel} style={{ marginTop: 24 }}>
        <div className={styles.panelHeading}>
          <h2>Oxirgi 50 ta xabar</h2>
          <button
            className="button secondary"
            onClick={() =>
              void load().catch((cause) => setError(cause.message))
            }
          >
            Yangilash
          </button>
        </div>
        {!items.length && (
          <p className={styles.empty}>Hali umumiy xabar tayyorlanmagan.</p>
        )}
        {items.map((item) => (
          <article className={styles.broadcastRow} key={item.id}>
            <div className={styles.rowTitle}>
              <div>
                <h3>{item.title}</h3>
                <small>
                  {date(item.createdAt)} · {item.actorName}
                </small>
              </div>
              <span
                className={
                  item.status === "completed" ? styles.published : styles.hidden
                }
              >
                {{
                  draft: "Tasdiq kutilmoqda",
                  queued: "Navbatda",
                  completed: "Yuborish yakunlangan",
                  cancelled: "Bekor qilingan",
                }[item.status] ?? item.status}
              </span>
            </div>
            <p className={styles.broadcastText}>{item.message}</p>
            <div className={styles.deliveryCounts}>
              <span>
                Auditoriya: <strong>{item.recipientCount}</strong>
              </span>
              <span>
                Yuborilgan: <strong>{item.sent}</strong>
              </span>
              <span>
                Kutilmoqda: <strong>{item.pending}</strong>
              </span>
              <span>
                O‘tkazilgan: <strong>{item.skipped}</strong>
              </span>
              <span>
                Xato: <strong>{item.failed}</strong>
              </span>
              <span>
                Tasdiqlanmagan: <strong>{item.uncertain}</strong>
              </span>
            </div>
            <div className={styles.inlineActions}>
              {item.status === "draft" && (
                <button
                  className="button"
                  disabled={busy || !item.recipientCount || !!sending}
                  onClick={() => setConfirm(item)}
                >
                  Tekshirish va yuborish
                </button>
              )}
              {item.status === "queued" && (
                <button
                  className="button"
                  disabled={!!sending || busy}
                  onClick={() => void drain(item.id)}
                >
                  {sending === item.id
                    ? "Yuborilmoqda…"
                    : "Yuborishni davom ettirish"}
                </button>
              )}
              {(item.status === "draft" || item.status === "queued") && (
                <button
                  className="button secondary"
                  disabled={busy}
                  onClick={() => setCancel(item)}
                >
                  Bekor qilish
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
      {confirm && (
        <ActionDialog
          title="Xabarni yuborishni tasdiqlash"
          busy={busy}
          disabled={!confirm.recipientCount}
          onCancel={() => setConfirm(null)}
          onSubmit={(event) => {
            event.preventDefault();
            void approve();
          }}
          label={`${confirm.recipientCount} foydalanuvchiga yuborish`}
        >
          <p>
            <strong>{confirm.recipientCount} ta</strong> qabul qiluvchi.
            Yuborilgan xabarlarni bu yerdan qaytarib olib bo‘lmaydi.
          </p>
          <p className={styles.broadcastText}>
            {broadcastDeliveryText(confirm.message)}
          </p>
          {!confirm.recipientCount && (
            <p role="alert">
              Bu auditoriyada xabar olishga tayyor foydalanuvchi yo‘q. Bekor
              qilib boshqa auditoriya tanlang.
            </p>
          )}
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
        </ActionDialog>
      )}
      {cancel && (
        <ConfirmationDialog
          title="Yuborishni bekor qilasizmi?"
          description="Hali yuborilmagan xabarlar to‘xtatiladi. Yuborib bo‘lingan va ayni paytda ketayotgan xabarlar qaytarib olinmaydi."
          confirmLabel="Yuborishni to‘xtatish"
          onCancel={() => setCancel(null)}
          busy={busy}
          onConfirm={async () => {
            setBusy(true);
            try {
              await api(
                `/api/admin/broadcasts/${cancel.id}`,
                { action: "cancel" },
                "PATCH",
              );
              setCancel(null);
              await load();
            } catch (cause) {
              setError((cause as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      )}
    </>
  );
}
