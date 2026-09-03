import mysql, { type Pool } from "mysql2/promise";

import { dbEnv } from "./config";
import type { DatabaseKey } from "./types";

const poolConfig = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10_000,
};

const pools: Record<DatabaseKey, Pool> = {
  primary: mysql.createPool({
    uri: dbEnv.MYSQL_PRIMARY_URL,
    ...poolConfig,
  }),

  secondary: mysql.createPool({
    uri: dbEnv.MYSQL_SECONDARY_URL,
    ...poolConfig,
  }),
};

export function getMySqlPool(db: DatabaseKey): Pool {
  return pools[db];
}
