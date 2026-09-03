# Next.js Global Structure

Production-ready Next.js 16 boilerplate with App Router, MySQL database layer, and shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI**: shadcn/ui + Lucide icons
- **Database**: MySQL (mysql2/promise) with query builder
- **Validation**: Zod
- **Compiler**: React Compiler (experimental)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run c` | Add shadcn components (`npx shadcn@latest add`) |

## Project Structure

```
src/
├── actions/          # Server actions
├── app/              # Next.js App Router
│   ├── api/          # API routes
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── not-found.tsx # 404 page
├── components/
│   ├── auth/         # Auth components (LoginForm)
│   ├── layout/       # Layout components (Header, Footer)
│   └── ui/           # shadcn/ui primitives
├── config/
│   └── database/     # MySQL connection + query builder
├── constants/        # App constants
├── lib/
│   ├── api.ts        # HTTP client (fetch wrapper)
│   └── utils.ts      # Utility functions (cn, etc.)
├── schemas/          # Zod schemas (ready to use)
└── types/            # Shared TypeScript types
```

## Path Aliases

`@/*` maps to `./src/*` — use it for all imports:

```ts
import { db } from "@/config/database";
import { Button } from "@/components/ui/button";
```

## Database

MySQL query builder with primary/secondary connection pools, parameterized queries, and debug logging.

```ts
import { db, sqlQuery, withTransaction } from "@/config/database";

// Query builder
const users = await db("users").where("role", "admin").get();

// Debug a query (prints full SQL with values)
const user = await db("users").debug().where("id", 1).first();

// Raw SQL
const rows = await sqlQuery("SELECT * FROM users WHERE id = ?", [1]);

// Transaction
await withTransaction(async (conn) => {
  await conn.query("UPDATE accounts SET balance = balance - ? WHERE id = ?", [100, 1]);
  await conn.query("INSERT INTO transactions (accountId, amount) VALUES (?, ?)", [1, 100]);
});
```

See [src/config/database/DATABASE.md](src/config/database/DATABASE.md) for full docs.

### Environment Variables

```bash
MYSQL_PRIMARY_URL="mysql://user:password@host:3306/primary_db"
MYSQL_SECONDARY_URL="mysql://user:password@host:3306/secondary_db"
```

## HTTP Client

Fetch wrapper at `src/lib/api.ts` with typed methods.

### Basic Requests

```ts
import { api } from "@/lib/api";

const users = await api.get<User[]>("/users");
const user = await api.post<User>("/users", { name: "John" });
await api.put<User>("/users/1", { name: "Updated" });
await api.delete("/users/1");
```

### File Download (with progress)

```ts
const blob = await api.download("/files/report.pdf", {
  filename: "report.pdf",          // auto-triggers browser save dialog
  onProgress: (p) => {
    console.log(`${p.loaded} / ${p.total} (${p.percent}%)`);
  },
});
```

### Stream Large Responses

```ts
const stream = await api.stream("/data/large.json");
const reader = stream.getReader();
const decoder = new TextDecoder();
let data = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  data += decoder.decode(value, { stream: true });
}
```

### Stream + Parse JSON

```ts
const users = await api.streamJson<User[]>("/data/users.json");
```

## Adding Components

```bash
npm run c button card input
```

## Deploy

Standalone output is configured for Docker/container deployments:

```bash
npm run build
# .next/standalone/ is ready for deployment
```
