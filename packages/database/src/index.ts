import postgres from "postgres";

let sql: postgres.Sql | undefined;
export function getDb(): postgres.Sql {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL is not configured");
  return (sql ??= postgres(process.env.DATABASE_URL, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  }));
}
export async function closeDb() {
  if (sql) {
    await sql.end();
    sql = undefined;
  }
}
