# Next.js Global Structure

Production-ready Next.js 16 boilerplate with App Router, MySQL database layer, TanStack data tables, and shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI**: shadcn/ui + Lucide icons + Base UI primitives
- **Database**: MySQL (mysql2/promise) with query builder
- **Data Fetching**: TanStack React Query v5
- **Data Tables**: TanStack React Table v8
- **Forms**: React Hook Form + Zod validation
- **Auth**: NextAuth v5 (beta)
- **Theme**: next-themes (dark/light mode)
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
├── actions/                    # Server actions (by domain)
│   ├── auth/                   #   NextAuth actions
│   ├── permission-management/  #   Permission/category CRUD
│   ├── vendor-settings/        #   API master settings
│   └── vnoc/                   #   VNOC data actions
├── app/                        # Next.js App Router
│   ├── (auth)/                 #   Route group: login page (no /auth prefix)
│   │   ├── page.tsx            #     Login page at /
│   │   └── _components/        #     LoginForm
│   ├── api/                    #   API routes
│   │   ├── auth/[...nextauth]/ #     NextAuth catch-all
│   │   ├── demo/               #     Demo endpoint
│   │   └── health/             #     Health check (/api/health)
│   ├── dashboard/              #   Dashboard section
│   │   ├── layout.tsx          #     Dashboard layout (sidebar + header)
│   │   ├── page.tsx            #     Dashboard home
│   │   ├── need-help/          #     Help page
│   │   ├── checks/query-sim/   #     Query simulator
│   │   ├── user-management/    #     User management
│   │   │   ├── admin/          #       Admin list
│   │   │   ├── company/        #       Company list
│   │   │   └── vendor/         #       Vendor list
│   │   └── (permission-management)/  # Route group: PM pages
│   │       └── pm/             #     Permission management (CategoryM, PermissionM)
│   ├── vnoc/                   #   VNOC dashboard
│   │   ├── layout.tsx          #     VNOC layout
│   │   ├── page.tsx            #     VNOC overview
│   │   ├── [slug]/             #     Dynamic VNOC detail (vnoc1–vnoc8)
│   │   └── _components/        #     VnocHeader, VnocSidebar, VnocCard, vnoc1–vnoc8
│   ├── layout.tsx              #   Root layout
│   ├── page.tsx                #   Redirects to dashboard
│   ├── error.tsx               #   Global error boundary
│   └── not-found.tsx           #   404 page
├── components/
│   ├── ai/                     # AI components (Bot)
│   ├── common/                 # Shared components
│   │   ├── AutoBreadcrumb.tsx  #   Auto-generated breadcrumbs
│   │   ├── CSVDownlaod.tsx     #   CSV export button
│   │   ├── GlobalDeleteButton.tsx  # Reusable delete button
│   │   ├── SelectCompany.tsx   #   Company selector
│   │   ├── SelectVendor.tsx    #   Vendor selector
│   │   └── data-table/         #   Data table components
│   │       ├── Datatable.tsx   #     Client-side table (search, sort, pagination, row selection, CSV export)
│   │       └── ServerDatatable.tsx  # Server-side paginated table
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardHeaderSearchbar.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardFooter.tsx
│   │   ├── constants.ts        #   Sidebar navigation constants
│   │   ├── home/ChartSection.tsx
│   │   └── user-management/UserSettingsController.tsx
│   ├── layout/                 # Layout utilities
│   │   ├── LogoutButton.tsx
│   │   ├── ModeToggle.tsx      #   Dark/light theme toggle
│   │   └── UserProfile.tsx
│   └── ui/                     # shadcn/ui primitives (27 components)
│       ├── accordion.tsx       ├── avatar.tsx
│       ├── badge.tsx           ├── breadcrumb.tsx
│       ├── button.tsx          ├── card.tsx
│       ├── checkbox.tsx        ├── dialog.tsx
│       ├── dropdown-menu.tsx   ├── field.tsx
│       ├── input-otp.tsx       ├── input.tsx
│       ├── label.tsx           ├── popover.tsx
│       ├── progress.tsx        ├── select.tsx
│       ├── separator.tsx       ├── sheet.tsx
│       ├── sidebar.tsx         ├── skeleton.tsx
│       ├── sonner.tsx          ├── switch.tsx
│       ├── table.tsx           ├── tabs.tsx
│       ├── textarea.tsx        └── tooltip.tsx
├── config/
│   └── database/               # MySQL connection + query builder
│       ├── index.ts            #   Barrel export (db, sqlQuery, withTransaction)
│       ├── config.ts           #   Env validation (Zod)
│       ├── pools.ts            #   Primary/secondary connection pools
│       ├── transaction.ts      #   Transaction helper
│       ├── debug.ts            #   Per-query debug logging
│       ├── types.ts            #   Database types
│       ├── query/
│       │   ├── builder.ts      #   Fluent query builder (db("users").where(...).get())
│       │   ├── raw.ts          #   Raw SQL helper (sqlQuery)
│       │   └── index.ts        #   Query barrel export
│       └── DATABASE.md         #   Full database documentation
├── functions/                  # Reusable functions
│   ├── csr-function.ts         #   Client-side rendering helper
│   └── get-user.ts             #   User retrieval
├── hooks/                      # Custom React hooks
│   ├── use-mobile.ts           #   Mobile detection
│   ├── use-user.ts             #   Current user hook
│   ├── permission-management/  #   PM data hooks
│   │   ├── use-permission-management.ts
│   │   └── use-cat-permission-management.ts
│   └── vendor-settings/
│       └── useApiMaster.ts     #   API master hook
├── lib/
│   ├── api.ts                  # HTTP client (fetch wrapper with download/stream)
│   ├── download.ts             # File download utilities
│   ├── nodemailer.ts           # Email transport config
│   ├── utils.ts                # Utility functions (cn, etc.)
│   └── auth/
│       ├── auth.ts             #   NextAuth config
│       ├── authUtils.ts        #   Auth helper functions
│       └── dummySession.ts     #   Session stub for development
├── providers/
│   ├── TanstackProvider.tsx    #   React Query provider (SSR-safe, devtools, retry config)
│   └── ThemeProvider.tsx       #   next-themes provider
├── schemas/                    # Zod schemas (placeholder, ready to use)
└── types/                      # Shared TypeScript types (placeholder, ready to use)
```

## Path Aliases

`@/*` maps to `./src/*` — use it for all imports:

```ts
import { db, sqlQuery } from "@/config/database";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
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

// Raw SQL with debug
const data = await sqlQuery("SELECT * FROM users", { debug: true });

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

## Data Tables

### Client-Side (`Datatable`)

Full-featured client-side table with search, sorting, pagination, column visibility, row selection, and CSV export.

```tsx
import Datatable from "@/components/common/data-table/Datatable";

const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true },
  { accessorKey: "email", header: "Email" },
];

<Datatable
  data={users}
  columns={columns}
  title="Users"
  enableSearch
  enableColumnVisibility
  enableRowSelection
  onSelectionChange={(selected) => console.log(selected)}
  downloadButton={<CsvDownload data={csvData} filename="users" columns={["name", "email"]} />}
  headerAction={<Button onClick={handleAdd}>Add User</Button>}
/>
```

### Server-Side (`ServerDatatable`)

Paginated table driven by server-side data. Pass current page, page size, sort state, and a fetch callback.

```tsx
import ServerDatatable from "@/components/common/data-table/ServerDatatable";

<ServerDatatable
  columns={columns}
  fetchData={fetchUsers}
  title="Users"
  totalCount={totalUsers}
/>
```

## HTTP Client

Fetch wrapper at `src/lib/api.ts` with typed methods.

```ts
import { api } from "@/lib/api";

// Basic requests
const users = await api.get<User[]>("/users");
const user = await api.post<User>("/users", { name: "John" });
await api.put<User>("/users/1", { name: "Updated" });
await api.delete("/users/1");

// File download with progress
const blob = await api.download("/files/report.pdf", {
  filename: "report.pdf",
  onProgress: (p) => console.log(`${p.percent}%`),
});

// Stream large responses
const stream = await api.stream("/data/large.json");

// Stream + parse JSON
const users = await api.streamJson<User[]>("/data/users.json");
```

## Data Fetching (TanStack Query)

Provider is pre-configured in the root layout with SSR-safe QueryClient, exponential backoff retries, and devtools.

```tsx
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Users() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get<User[]>("/users"),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newUser: CreateUser) => api.post<User>("/users", newUser),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
```

## VNOC Dashboard

Dynamic VNOC panels at `/vnoc` with role-based access:

- **`/vnoc`** — Overview page with sidebar filters
- **`/vnoc/[slug]`** — Detail page (vnoc1 through vnoc8) with role-based redirects
- Components: `VnocHeader`, `VnocSidebar`, `VnocCard`, and per-panel components (`Vnoc1`–`Vnoc8`)

## Auth

NextAuth v5 (beta) configured at `src/lib/auth/`. API route at `/api/auth/[...nextauth]`.

## Theme

Dark/light mode via `next-themes`. Toggle component at `src/components/layout/ModeToggle.tsx`.

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
