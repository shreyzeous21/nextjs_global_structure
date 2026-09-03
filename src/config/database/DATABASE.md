# Database Module

MySQL query builder and connection pool manager for Next.js (App Router). Server-only by default via `import "server-only"`.

---

## Setup

### Environment Variables

Add to `.env.local`:

```bash
MYSQL_PRIMARY_URL="mysql://user:password@host:3306/primary_db"
MYSQL_SECONDARY_URL="mysql://user:password@host:3306/secondary_db"
```

Both are validated at startup with Zod. The app crashes immediately if either is missing.

### Import

```ts
import {
  db,
  sqlQuery,
  withTransaction,
  getMySqlPool,
  type DatabaseKey,
  type DatabaseSelection,
} from "@/config/database";
```

---

## Query Builder (`db`)

Fluent builder for SELECT, INSERT, UPDATE, and DELETE. All queries use parameterized placeholders (`?`) to prevent SQL injection.

```ts
db<T>(table: string, database?: DatabaseKey): QueryBuilder<T>
```

### SELECT

```ts
// Get all users
const users = await db("users").get();

// Select specific columns
const names = await db<User>("users")
  .select("id", "firstName", "lastName")
  .get();

// Get first matching row
const user = await db<User>("users")
  .where("email", "john@example.com")
  .first();

// Count rows
const total = await db("users")
  .where("role", "admin")
  .count();
```

### WHERE

```ts
// Equality (implicit =)
db("users").where("status", "ACTIVE")

// Comparison operators
db("users").where("age", ">=", 18)
db("users").where("score", "!=", 0)

// IN / NOT IN
db("users").whereIn("role", ["admin", "moderator"])
db("users").whereNotIn("status", ["banned", "deleted"])

// LIKE
db("users").whereLike("email", "%@example.com")

// NULL checks
db("users").whereNull("deletedAt")
db("users").whereNotNull("verifiedAt")

// Raw WHERE (escape hatch)
db("users").whereRaw("JSON_EXTRACT(meta, '$.level') > ?", [5])
```

Multiple `.where()` calls are joined with `AND`.

### JOIN

```ts
// INNER JOIN
const posts = await db("posts")
  .select("posts.*", "users.firstName as authorName")
  .join("users", "posts.userId", "=", "users.id")
  .get();

// LEFT JOIN
const users = await db("users")
  .select("users.*", "COUNT(orders.id) as orderCount")
  .leftJoin("orders", "users.id", "=", "orders.userId")
  .groupBy("users.id")
  .get();
```

### ORDER BY, GROUP BY, LIMIT, OFFSET

```ts
const page = await db("products")
  .where("category", "electronics")
  .orderBy("price", "DESC")
  .groupBy("category")
  .limit(20)
  .offset(40)
  .get();
```

### INSERT

Returns the auto-incremented `insertId`.

```ts
const newId = await db("users").insert({
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
});
```

### UPDATE

Requires at least one `.where()` condition. Refuses to run without one. Returns `affectedRows`.

```ts
const updated = await db("users")
  .where("id", 42)
  .update({
    firstName: "Updated",
    updatedAt: new Date(),
  });
```

### DELETE

Requires at least one `.where()` condition. Refuses to run without one. Returns `affectedRows`.

```ts
const deleted = await db("logs")
  .where("createdAt", "<", new Date(Date.now() - 86400000))
  .delete();
```

### Switch Database

```ts
// Use secondary (read replica)
const users = await db("users")
  .useDb("secondary")
  .where("role", "admin")
  .get();
```

---

## Raw SQL Queries (`sqlQuery`)

For complex queries the builder can't express.

```ts
sqlQuery<T>(sql: string, values?: QueryValues, database?: DatabaseSelection): Promise<T>
```

### Single Database

```ts
const users = await sqlQuery<User[]>(
  "SELECT * FROM users WHERE role = ?",
  ["admin"]
);
```

### Query Both Databases (Primary + Secondary)

Pass an array of database keys to run the same query on both and get a merged result.

```ts
const results = await sqlQuery<User[]>(
  "SELECT * FROM users WHERE role = ?",
  ["admin"],
  ["primary", "secondary"]
);

// results.primary  -> User[]
// results.secondary -> User[]
```

---

## Transactions (`withTransaction`)

Wraps a callback in `BEGIN` / `COMMIT` / `ROLLBACK`. The connection is always released.

```ts
import { withTransaction } from "@/config/database";

const newBalance = await withTransaction(async (conn) => {
  const [rows] = await conn.query(
    "SELECT balance FROM accounts WHERE id = ? FOR UPDATE",
    [accountId]
  );

  const currentBalance = (rows as any[])[0].balance;

  if (currentBalance < amount) {
    throw new Error("Insufficient funds");
  }

  await conn.query(
    "UPDATE accounts SET balance = balance - ? WHERE id = ?",
    [amount, accountId]
  );

  await conn.query(
    "INSERT INTO transactions (accountId, amount, type) VALUES (?, ?, ?)",
    [accountId, amount, "debit"]
  );

  return currentBalance - amount;
});

// If the callback throws, the transaction is rolled back.
// If it succeeds, changes are committed.
// Connection is always released.
```

Use the secondary database for read-only transactions:

```ts
await withTransaction(async (conn) => {
  // read-only work on secondary
}, "secondary");
```

---

## Connection Pools

Two MySQL connection pools are created at startup:

| Pool       | Purpose                      | Env Variable              |
|------------|------------------------------|---------------------------|
| `primary`  | Read/write (default)         | `MYSQL_PRIMARY_URL`       |
| `secondary`| Read replicas / failover     | `MYSQL_SECONDARY_URL`     |

Pool settings:
- `connectionLimit: 10`
- `connectTimeout: 10s`
- `enableKeepAlive: true`

Access the raw pool if needed:

```ts
const pool = getMySqlPool("primary");
```

---

## Debug Logging

Chain `.debug()` on any query builder call to print the full parameterized SQL with values interpolated. Nothing is logged unless you explicitly call `.debug()`.

### Query Builder

```ts
// Log this SELECT
const users = await db("users")
  .debug()
  .where("role", "admin")
  .orderBy("createdAt", "DESC")
  .limit(10)
  .get();

// Log an INSERT
await db("users")
  .debug()
  .insert({ firstName: "Jane", email: "jane@example.com" });

// Log an UPDATE
await db("users")
  .debug()
  .where("id", 42)
  .update({ firstName: "Updated" });

// Log a DELETE
await db("logs")
  .debug()
  .where("createdAt", "<", new Date(Date.now() - 86400000))
  .delete();
```

Console output:

```
[DB] primary | 2026-09-02T12:00:00.000Z
SELECT * FROM `users` WHERE `role` = 'admin' ORDER BY `createdAt` DESC LIMIT 10
```

### Raw SQL

Pass `{ debug: true }` as the last argument.

```ts
const users = await sqlQuery<User[]>(
  "SELECT * FROM users WHERE role = ?",
  ["admin"],
  "primary",
  { debug: true }
);
```

---

## Architecture

```
src/config/database/
  index.ts          # Barrel export (single import point)
  config.ts         # Zod env validation
  pools.ts          # Connection pool creation
  transaction.ts    # Transaction wrapper
  types.ts          # DatabaseKey type
  debug.ts          # SQL debug logging utility
  query/
    builder.ts      # QueryBuilder class + db() entry point
    raw.ts          # sqlQuery() for raw SQL
    index.ts        # Re-exports from builder
```

---

## Safety Guarantees

- **SQL injection**: All values use parameterized `?` placeholders. Identifiers are backtick-quoted and validated against `/^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/`.
- **Update/Delete without WHERE**: Throws `"Refusing to update without a WHERE condition"` / `"Refusing to delete without a WHERE condition"`.
- **Server-only**: `builder.ts` imports `"server-only"` — any attempt to use the query builder in a client component fails at build time.
- **Env validation**: App crashes at startup if database URLs are missing.
- **Transaction safety**: Connection is always released in `finally`. Rollback failures are swallowed to preserve the original error.
