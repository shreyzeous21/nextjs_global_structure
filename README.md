# Next.js Global Structure

Production-ready Next.js 16 boilerplate with App Router, MySQL database layer, TanStack data tables, and shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 16.3.4 (App Router, React 19.2.8)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **UI**: shadcn/ui (base-nova style) + @base-ui/react primitives + Lucide icons
- **Database**: MySQL (mysql2/promise 3.24.2) with custom query builder
- **Data Fetching**: TanStack React Query v5.102
- **Data Tables**: TanStack React Table v8.21
- **Forms**: React Hook Form 7.87 + Zod 4.5 validation
- **Auth**: NextAuth v5 (beta.32) with Credentials provider
- **Theme**: next-themes 0.4.6 (dark/light mode)
- **Compiler**: React Compiler (experimental, babel-plugin-react-compiler 1.0.0)
- **Email**: Nodemailer 8.0 (Gmail SMTP)
- **Scheduling**: node-cron 4.6

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env .env.local  # or create .env.local manually with the required vars below

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

## Project Structure

```
src/
├── actions/                    # Server actions (by domain)
│   ├── auth/                   #   NextAuth actions
│   ├── permission-management/  #   Permission/category CRUD
│   ├── vendor-settings/        #   API master settings
│   ├── vnoc/                   #   VNOC data actions
│   └── get-use-action.ts       #   Vendor list retrieval
├── app/                        # Next.js App Router
│   ├── (auth)/                 #   Route group: login page (no /auth prefix)
│   │   ├── page.tsx            #     Login page at /
│   │   └── _components/        #     LoginForm, NetworkSVG
│   ├── api/                    #   API routes
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
│   │   ├── page.tsx            #     Redirects to /vnoc/vnoc-1
│   │   ├── [slug]/             #     Dynamic VNOC detail (vnoc1–vnoc8)
│   │   └── _components/        #     VnocHeader, VnocSidebar, VnocCard, vnoc1–vnoc8
│   ├── layout.tsx              #   Root layout
│   ├── error.tsx               #   Global error boundary
│   ├── not-found.tsx           #   404 page
│   └── globals.css             #   Tailwind v4 + shadcn theme config
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
│   └── ui/                     # shadcn/ui primitives (26 components)
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
│   ├── constants/              # App-wide constants
│   │   └── index.ts            #   CONFIG_CONSTANTS (API_URL, COMPANY_ID)
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
│       ├── authUtils.ts        #   Auth helper functions (passwordHash, UserRole)
│       └── dummySession.ts     #   Session stub for development
├── providers/
│   ├── TanstackProvider.tsx    #   React Query provider (SSR-safe, retry config)
│   └── ThemeProvider.tsx       #   next-themes provider
├── schemas/                    # Zod schemas (placeholder, ready to use)
└── types/
    └── pm-types.ts             #   Permission management Zod schemas + types
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

// Count
const count = await db("users").where("status", "active").count();

// Where variations
const filtered = await db("users")
  .whereIn("role", ["admin", "superadmin"])
  .whereNotNull("deleted_at")
  .whereLike("name", "%john%")
  .get();

// Joins
const posts = await db("posts")
  .join("users", "posts.user_id", "users.id")
  .leftJoin("categories", "posts.category_id", "categories.id")
  .select("posts.*", "users.name as author", "categories.name as category")
  .get();

// Group by + order
const stats = await db("orders")
  .select("user_id", db.raw("COUNT(*) as order_count"))
  .groupBy("user_id")
  .orderBy("order_count", "desc")
  .get();

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
# Database (required)
MYSQL_PRIMARY_URL="mysql://user:password@host:3306/primary_db"
MYSQL_SECONDARY_URL="mysql://user:password@host:3306/secondary_db"

# Auth (required)
AUTH_SECRET="your-secret-here"

# External API (optional)
EXTERNAL_API_URL="https://api.example.com"

# Email (optional, for Nodemailer)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# Encryption (optional)
URL_ENCRYPTION_KEY="your-encryption-key"
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

**Provider Config:**
- `staleTime`: 30 seconds
- `gcTime`: 5 minutes
- `refetchOnWindowFocus`: true
- `refetchOnReconnect`: true
- `retry`: 1 with exponential backoff
- Mutations: no retry

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

Dynamic VNOC panels at `/vnoc` with role-based access. Users with roles `superadmin`, `admin`, `company`, or `companychild` can access all panels.

**Routes:**
- `/vnoc` — Redirects to `/vnoc/vnoc-1`
- `/vnoc/[slug]` — Detail page (vnoc1 through vnoc8)

**Panels:**

| Panel | Route | Description |
|-------|-------|-------------|
| MVNO Day Wise API Records | `/vnoc/vnoc-1` | Daily API usage statistics |
| Wholesale Request Chart | `/vnoc/vnoc-2` | Visual chart of wholesale requests |
| Wholesale Request & Response | `/vnoc/vnoc-3` | Request/response comparison |
| Hourly API Records | `/vnoc/vnoc-4` | Hourly API usage breakdown |
| API Request Count | `/vnoc/vnoc-5` | Total request counts with notifications |
| API 5 Minutes Graph | `/vnoc/vnoc-6` | 5-minute interval graph |
| API Transaction | `/vnoc/vnoc-7` | Transaction details |
| API Latency | `/vnoc/vnoc-8` | Response time metrics |

**Components:** `VnocHeader`, `VnocSidebar`, `VnocCard`, and per-panel components (`Vnoc1`–`Vnoc8`)

## Auth

NextAuth v5 (beta) with Credentials provider configured at `src/lib/auth/`. API route at `/api/auth/[...nextauth]`.

**Features:**
- Email + password authentication
- JWT strategy (1-day expiry, 12-hour update age)
- Password hashing with bcryptjs (12 salt rounds)

**User Roles:**
- `superadmin` — Full system access
- `admin` — Admin-level access
- `company` — Company-level access
- `companychild` — Sub-company access
- `vendor` — Vendor-level access
- `vendorchild` — Sub-vendor access

## Theme

Dark/light mode via `next-themes`. Toggle component at `src/components/layout/ModeToggle.tsx`.

## Health Check

GET endpoint at `/api/health` returning:
- Health status
- Platform info
- Memory usage
- CPU info
- Uptime
- Database connection status

## Email

Nodemailer configured for Gmail SMTP at `src/lib/nodemailer.ts`. Requires `EMAIL_USER` and `EMAIL_PASSWORD` environment variables.

## Deploy

### Docker

Multi-stage Dockerfile included for production deployment:

```bash
# Build the Docker image
docker build -t nextjs-app .

# Run the container
docker run -p 3000:3000 nextjs-app
```

The Dockerfile uses:
- Node.js 24.13.0-slim
- Multi-stage build (dependencies → builder → runner)
- Standalone output for minimal image size
- Non-root user for security

### Standalone

Standalone output is configured for container deployments:

```bash
npm run build
# .next/standalone/ is ready for deployment
```

Uncomment `output: "standalone"` in `next.config.ts` if not already enabled.
