<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Project Context: Next.js Global Structure

## Overview

Production-ready Next.js 16 boilerplate with App Router, MySQL database, TanStack data tables, and shadcn/ui components.

## Tech Stack

- **Next.js 16.3.4** with App Router (React 19.2.8)
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** (no config file — uses CSS variables in `globals.css`)
- **shadcn/ui** with `base-nova` style (uses `@base-ui/react`, NOT Radix)
- **MySQL** via `mysql2/promise` with custom query builder
- **TanStack Query v5** for data fetching
- **TanStack Table v8** for data tables
- **React Hook Form + Zod** for forms
- **NextAuth v5** (Credentials provider)
- **React Compiler** (experimental, enabled in `next.config.ts`)

## Key Paths

| Path | Purpose |
|------|---------|
| `src/app/` | App Router routes |
| `src/components/ui/` | shadcn/ui components (26 total) |
| `src/components/common/` | Shared components (data tables, selectors) |
| `src/components/dashboard/` | Dashboard layout + sidebar |
| `src/config/database/` | MySQL connection + query builder |
| `src/lib/auth/` | NextAuth config |
| `src/actions/` | Server actions (by domain) |
| `src/hooks/` | Custom React hooks |
| `src/providers/` | TanstackProvider, ThemeProvider |
| `src/types/` | Shared TypeScript types |

## Path Alias

`@/*` maps to `./src/*` — use for all imports:

```ts
import { db } from "@/config/database";
import { Button } from "@/components/ui/button";
```

## Database Patterns

```ts
import { db, sqlQuery, withTransaction } from "@/config/database";

// Query builder
const users = await db("users").where("role", "admin").get();
const user = await db("users").where("id", 1).first();
const count = await db("users").where("status", "active").count();

// Where variations
await db("users").whereIn("role", ["admin", "superadmin"]).get();
await db("users").whereNotNull("deleted_at").get();
await db("users").whereLike("name", "%john%").get();

// Joins
await db("posts")
  .join("users", "posts.user_id", "users.id")
  .leftJoin("categories", "posts.category_id", "categories.id")
  .select("posts.*", "users.name as author")
  .get();

// Raw SQL
const rows = await sqlQuery("SELECT * FROM users WHERE id = ?", [1]);

// Transaction
await withTransaction(async (conn) => {
  await conn.query("UPDATE accounts SET balance = balance - ? WHERE id = ?", [100, 1]);
  await conn.query("INSERT INTO transactions (accountId, amount) VALUES (?, ?)", [1, 100]);
});
```

## Server Actions

All server actions use `"use server"` directive. Located in `src/actions/` organized by domain:

- `src/actions/auth/authAction.ts` — Login
- `src/actions/permission-management/` — Category + Permission CRUD
- `src/actions/vendor-settings/api-master-action.ts` — API master settings
- `src/actions/vnoc/vnoc5-action.ts` — VNOC notification counts
- `src/actions/get-use-action.ts` — Vendor list retrieval

## Component Patterns

### shadcn/ui Components

Located in `src/components/ui/`. Style: `base-nova` (uses `@base-ui/react` primitives).

```tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
```

### Data Tables

```tsx
// Client-side (full features)
import Datatable from "@/components/common/data-table/Datatable";

// Server-side (paginated)
import ServerDatatable from "@/components/common/data-table/ServerDatatable";
```

### Layout Components

- `DashboardSidebar` + `DashboardHeader` — Dashboard layout
- `VnocSidebar` + `VnocHeader` — VNOC layout
- `ModeToggle` — Dark/light theme toggle
- `AutoBreadcrumb` — Auto-generated breadcrumbs

## Auth Patterns

```ts
import { auth } from "@/lib/auth/auth";  // NextAuth config
import { passwordHash } from "@/lib/auth/authUtils";
import { dummySession } from "@/lib/auth/dummySession";  // Dev stub
```

**User Roles:** `superadmin`, `admin`, `company`, `companychild`, `vendor`, `vendorchild`

## Hooks

```ts
import { useUser } from "@/hooks/use-user";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePermissionManagement } from "@/hooks/permission-management/use-permission-management";
import { useCatPermissionManagement } from "@/hooks/permission-management/use-cat-permission-management";
import { useApiMaster } from "@/hooks/vendor-settings/useApiMaster";
```

## TanStack Query Provider

Pre-configured in root layout with:
- `staleTime`: 30 seconds
- `gcTime`: 5 minutes
- `retry`: 1 with exponential backoff
- Mutations: no retry

## Routes

| Route | Description |
|-------|-------------|
| `/` | Login page (redirects to `/dashboard` if authenticated) |
| `/dashboard` | Dashboard home with vendor selector + charts |
| `/dashboard/need-help` | Help page |
| `/dashboard/user-management/admin` | Admin user management |
| `/dashboard/user-management/company` | Company management |
| `/dashboard/user-management/vendor` | Vendor management |
| `/dashboard/(permission-management)/pm` | Category + Permission CRUD |
| `/dashboard/checks/query-sim` | Query simulator |
| `/vnoc` | Redirects to `/vnoc/vnoc-1` |
| `/vnoc/[slug]` | VNOC panels (vnoc1–vnoc8) |
| `/api/health` | Health check endpoint |

## VNOC Panels

8 panels with role-based access (superadmin, admin, company, companychild):

1. **vnoc-1**: MVNO Day Wise API Records
2. **vnoc-2**: Wholesale Request Chart
3. **vnoc-3**: Wholesale Request & Response
4. **vnoc-4**: Hourly API Records
5. **vnoc-5**: API Request Count
6. **vnoc-6**: API 5 Minutes Graph
7. **vnoc-7**: API Transaction
8. **vnoc-8**: API Latency

## Environment Variables

```bash
# Required
MYSQL_PRIMARY_URL="mysql://user:password@host:3306/primary_db"
MYSQL_SECONDARY_URL="mysql://user:password@host:3306/secondary_db"
AUTH_SECRET="your-secret-here"

# Optional
EXTERNAL_API_URL="https://api.example.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
URL_ENCRYPTION_KEY="your-encryption-key"
```

## Conventions

1. **File naming**: PascalCase for components (`Button.tsx`), camelCase for utilities (`useUser.ts`)
2. **Server actions**: Use `"use server"` directive, organize by domain in `src/actions/`
3. **Components**: Use shadcn/ui primitives from `@/components/ui/`
4. **Styling**: Tailwind CSS classes, use `cn()` utility from `@/lib/utils`
5. **Types**: Shared types in `src/types/`, component-specific types co-located
6. **Forms**: React Hook Form + Zod validation
7. **Data fetching**: TanStack Query for client, server actions for server

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button card input
```
