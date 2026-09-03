import type { PoolConnection } from "mysql2/promise";

import { getMySqlPool } from "./pools";
import type { DatabaseKey } from "./types";

export async function withTransaction<T>(
  callback: (connection: PoolConnection) => Promise<T>,
  db: DatabaseKey = "primary",
): Promise<T> {
  const connection = await getMySqlPool(db).getConnection();

  try {
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();

    return result;
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // Preserve the original error.
    }

    throw error;
  } finally {
    connection.release();
  }
}
