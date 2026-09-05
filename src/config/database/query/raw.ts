import type { QueryValues } from "mysql2";
import type { RowDataPacket } from "mysql2/promise";
import { getMySqlPool } from "../pools";
import type { DatabaseKey } from "../types";
import { logQuery } from "../debug";

export type DatabaseSelection = DatabaseKey | DatabaseKey[];

type SqlQueryOptions = {
  debug?: boolean;
};

export async function sqlQuery<T = RowDataPacket[]>(
  sql: string,
  values: QueryValues = [],
  database: DatabaseSelection = "primary",
  options?: SqlQueryOptions,
): Promise<T | Record<DatabaseKey, T>> {
  if (Array.isArray(database)) {
    const results = await Promise.all(
      database.map(async (db) => {
        if (options?.debug) logQuery(sql, values as unknown[], db);
        const [rows] = await getMySqlPool(db).query(sql, values);
        return { db, rows: rows as T };
      }),
    );
    return Object.fromEntries(
      results.map(({ db, rows }) => [db, rows]),
    ) as Record<DatabaseKey, T>;
  }

  if (options?.debug) logQuery(sql, values as unknown[], database);
  const [rows] = await getMySqlPool(database).query(sql, values);
  return rows as T;
}

export async function sqlQueryArray<T = RowDataPacket[]>(
  sql: string,
  values: QueryValues = [],
  database: DatabaseKey = "primary",
  options?: SqlQueryOptions,
): Promise<T[]> {
  const result = await sqlQuery<T[]>(sql, values, database, options);
  return Array.isArray(result) ? result : (result.primary ?? []);
}
