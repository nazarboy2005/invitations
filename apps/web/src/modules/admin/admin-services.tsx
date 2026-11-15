"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  ImageIcon,
  Plus,
  Search,
  Star,
  Store,
  Upload,
  RefreshCw,
} from "lucide-react";
import { publicAsset } from "@/lib/public-asset";
import {
  emptyService,
  serviceCategoryChoices,
  type ServiceRecord,
} from "@/modules/services/service-editor-contract";
import { normalizeServiceSearch } from "@/modules/services/services-utils";
import { ServiceEditorPanel } from "./service-editor-panel";
import { ServiceImports } from "./service-imports";
import styles from "./admin-services.module.css";
import { servicesRequest } from "./service-admin-request";

export function AdminServices({
  initialItems,
}: {
  initialItems: ServiceRecord[];
}) {
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState("list");
  const [editing, setEditing] = useState<ServiceRecord | "new" | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const counts = {
    published: items.filter((i) => i.published).length,
    drafts: items.filter((i) => i.status === "draft").length,
    featured: items.filter((i) => i.published?.featured).length,
  };
  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const text = normalizeServiceSearch(
          [
            i.draft.name,
            i.slug,
            i.draft.address,
            ...i.draft.phones.map((p) => p.value),
          ].join(" "),
        );
        return (
          normalizeServiceSearch(q)
            .split(" ")
            .every((word) => text.includes(word)) &&
          (!category || i.draft.categoryIds.includes(category)) &&
          (!status ||
            (status === "featured"
              ? i.published?.featured
              : status === "changes"
                ? i.published &&
                  JSON.stringify(i.draft) !== JSON.stringify(i.published)
                : i.status === status))
        );
      }),
    [items, q, status, category],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 20)),
    currentPage = Math.min(page, pages);
  function saved(item: ServiceRecord) {
    setItems((all) =>
      all.some((i) => i.slug === item.slug)
        ? all.map((i) => (i.slug === item.slug ? item : i))
        : [...all, item],
    );
    setEditing(item);
  }
  async function openImported(slug: string) {
    try {
      const { item } = await servicesRequest(`/api/admin/services/${slug}`);
      saved(item);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function refreshItems() {
    try {
      const { items } = await servicesRequest("/api/admin/services");
      setItems(items);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (editing)
    return (
      <ServiceEditorPanel
        initial={
          editing === "new"
            ? {
                slug: "",
                draft: emptyService(),
                published: null,
                status: "draft",
                revision: 0,
                updatedAt: "",
                evidence: null,
                reviewRequired: false,
              }
            : editing
        }
        onSaved={saved}
        onClose={() => setEditing(null)}
      />
    );
  return (
    <div className={styles.root}>
      <div className={styles.stats}>
        <div>
          <Store size={19} />
          <span>
            Barcha servislar<strong>{items.length}</strong>
          </span>
        </div>
        <div>
          <Check size={19} />
          <span>
            Nashr qilingan<strong>{counts.published}</strong>
          </span>
        </div>
        <div>
          <ImageIcon size={19} />
          <span>
            Qoralamalar<strong>{counts.drafts}</strong>
          </span>
        </div>
        <div>
          <Star size={19} />
          <span>
            Hamkorlar<strong>{counts.featured}</strong>
          </span>
        </div>
      </div>
      <div className={styles.topline}>
        <div className={styles.tabs} aria-label="Servis bo‘limlari">
          <button
            type="button"
            aria-pressed={tab === "list"}
            onClick={() => {
              setTab("list");
              void refreshItems();
            }}
          >
            Servislar
          </button>
          <button
            type="button"
            aria-pressed={tab === "imports"}
            onClick={() => setTab("imports")}
          >
            <Upload size={15} /> Maps import
          </button>
        </div>
        <div className={styles.rowActions}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => void refreshItems()}
          >
            <RefreshCw size={15} /> Yangilash
          </button>
          <button className={styles.primary} onClick={() => setEditing("new")}>
            <Plus size={16} /> Servis qo‘shish
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {tab === "imports" ? (
        <ServiceImports onOpen={openImported} />
      ) : (
        <>
          <div className={styles.filters}>
            <label className={styles.search}>
              <Search size={17} />
              <input
                aria-label="Servis qidirish"
                placeholder="Nomi, telefoni yoki manzili…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </label>
            <select
              aria-label="Kategoriya bo‘yicha saralash"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Barcha kategoriyalar</option>
              {serviceCategoryChoices.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Holat bo‘yicha saralash"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Barcha holatlar</option>
              <option value="published">Nashr qilingan</option>
              <option value="draft">Qoralamalar</option>
              <option value="changes">Nashr qilinmagan o‘zgarishlar</option>
              <option value="featured">Hamkorlar</option>
              <option value="archived">Arxiv</option>
            </select>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Servis</th>
                  <th>Kategoriya / manzil</th>
                  <th>Holat</th>
                  <th>Joylashuv</th>
                  <th>
                    <span className={styles.srOnly}>Amallar</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice((currentPage - 1) * 20, currentPage * 20)
                  .map((item) => (
                    <tr key={item.slug}>
                      <td>
                        <button
                          className={styles.nameButton}
                          onClick={() => setEditing(item)}
                        >
                          {item.draft.images[0] ? (
                            <img
                              src={publicAsset(item.draft.images[0].src)}
                              alt=""
                              width={58}
                              height={48}
                            />
                          ) : (
                            <span className={styles.placeholder}>
                              <ImageIcon size={20} />
                            </span>
                          )}
                          <span>
                            <strong>{item.draft.name}</strong>
                            <small>/{item.slug}</small>
                          </span>
                        </button>
                      </td>
                      <td>
                        {item.draft.categoryLabel}
                        <small>
                          {[item.draft.region, item.draft.district]
                            .filter(Boolean)
                            .join(", ") ||
                            item.draft.address ||
                            "Manzil kiritilmagan"}
                        </small>
                      </td>
                      <td>
                        <span
                          className={styles.badge}
                          data-status={item.status}
                        >
                          {item.status === "published"
                            ? "Nashr qilingan"
                            : item.status === "archived"
                              ? "Arxiv"
                              : "Qoralama"}
                        </span>
                        {item.reviewRequired && <small>Tekshirish kerak</small>}
                        {item.published &&
                          JSON.stringify(item.draft) !==
                            JSON.stringify(item.published) && (
                            <small>Yangi o‘zgarishlar bor</small>
                          )}
                      </td>
                      <td>
                        {item.published?.featured ? (
                          <span className={styles.partner}>
                            <Star size={13} /> Hamkor ·{" "}
                            {item.published.featuredOrder ?? 0}
                          </span>
                        ) : (
                          "Oddiy"
                        )}
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <button onClick={() => setEditing(item)}>
                            Tahrirlash
                          </button>
                          {item.published && (
                            <a
                              href={`/services/b/${item.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${item.draft.name}: saytda ochish`}
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className={styles.empty}>
                <Search size={26} />
                <h3>Servis topilmadi</h3>
                <p>Qidiruvni yoki filtrlarni o‘zgartiring.</p>
              </div>
            )}
          </div>
          <div className={styles.pagination}>
            <span>
              {filtered.length} servis · {currentPage} / {pages} sahifa
            </span>
            <div>
              <button
                aria-label="Oldingi sahifa"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                aria-label="Keyingi sahifa"
                disabled={currentPage === pages}
                onClick={() => setPage(currentPage + 1)}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
