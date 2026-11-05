import postgres from "postgres";

// Share the pool across route bundles and development hot reloads. A module-local
// pool opens a fresh set of connections whenever Next recompiles a route.
const database = globalThis as typeof globalThis & {
  fotihaDatabase?: postgres.Sql;
};
export function getDb(): postgres.Sql {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL is not configured");
  return (database.fotihaDatabase ??= postgres(process.env.DATABASE_URL, {
    max: 5,
    idle_timeout: 20,
    // Remote database connections can need more than ten seconds to wake/connect.
    connect_timeout: 30,
    prepare: false,
  }));
}
export async function closeDb() {
  const sql = database.fotihaDatabase;
  if (sql) {
    database.fotihaDatabase = undefined;
    await sql.end();
  }
}
