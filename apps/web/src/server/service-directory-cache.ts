import type { ServiceListing } from "../modules/services/services-utils";

type Snapshot = { revision: string; listings: ServiceListing[] };

/** Retention is bounded; freshness ALWAYS comes from the database revision. */
export function createServiceDirectoryCache() {
  let cached: (Snapshot & { database: string; expires: number }) | undefined;
  const pending = new Map<string, Promise<Snapshot>>();
  return async function read(
    database: string,
    revision: string,
    load: () => Promise<Snapshot>,
  ) {
    if (
      cached?.database === database &&
      cached.revision === revision &&
      cached.expires > Date.now()
    )
      return cached.listings;
    const key = JSON.stringify([database, revision]);
    let task = pending.get(key);
    if (!task) {
      task = load();
      pending.set(key, task);
    }
    try {
      const snapshot = await task;
      cached = { ...snapshot, database, expires: Date.now() + 5 * 60 * 1000 };
      return snapshot.listings;
    } finally {
      if (pending.get(key) === task) pending.delete(key);
    }
  };
}
