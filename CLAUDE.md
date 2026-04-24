# CLAUDE.md

Persistent context for the **Gambling Frontend** project (Feature-Based Colocation architecture practice).

---

## Tech Stack

- **Framework**: Next.js with App Router (never Pages Router)
- **Language**: Strict TypeScript (`strict: true` in tsconfig)
- **Fetching**: Native Next.js `fetch` (never axios or other HTTP libraries)
- **Styles**: Tailwind CSS + shadcn/ui (never install other UI libraries without explicit request)
- **Testing**: Do not generate tests unless explicitly requested

---

## Architecture: Feature-Based Colocation

The project strictly follows Feature-Based Colocation.

**Dependency rule**:

- Shared utilities (`components/`, `hooks/`, `lib/`, `services/`) can be imported from anywhere.
- Feature folders colocated under `app/` are **self-contained** — they must not import from each other.

### Folder structure

```
src/
├── app/
│   ├── (landing)/          ← Route Group público (aislado)
│   │   ├── components/     ← Componentes exclusivos de la landing (ej. hero-section.tsx)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── (main)/             ← Route Group de la app real (ej. auth requerida)
│       ├── layout.tsx      ← Layout con Sidebar/Navbar global
│       │
│       └── dashboard/           ← Feature: User and wallet info.
│           ├── api/
│           ├── components/
│           ├── hooks/
│           ├── types.ts    ← Feature-scoped types, DTOs, interfaces
│           └── page.tsx
│
│
├── components/             ← Shared UI — Botones, Cards genéricas
├── hooks/                  ← Shared hooks — useDebounce, etc.
├── lib/                    ← Shared utilities — formatCurrency, utils
└── services/               ← Shared API layer — base fetch wrapper, interceptors
```

### Import rules

```ts
// ✅ Correct — import from shared utilities
import { formatCurrency } from '@/lib/utils'

// ✅ Correct — import within the same feature
import { BalanceViewer } from './components/balance-viewer'
import { useBalance } from './hooks/use-balance'
import type { WalletDto } from './types'

// ❌ Incorrect — cross-feature import
import { UserCard } from '../user/components/user-card'
```

### Data flow convention

`services/` → `feature/api/` → `feature/hooks/` or `page.tsx`. Feature `api/` files are the only consumers of `services/`. Pages and components never call `services/` directly.

**API functions return Result-style tuples**: `{ data: T | null, error: string | null }`. Never throw from `api/` functions.

```ts
// feature/api/wallet.ts
export async function fetchBalance(userId: string) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/wallet/balance`, { /* ... */ })
    if (!response.ok) return { data: null, error: 'Failed to fetch balance' }
    const data = await response.json()
    return { data, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}
```

---

## Code conventions

- **Files**: `kebab-case` for all files (e.g. `format-currency.ts`, `user-card.tsx`, `use-balance.ts`)
- **Types**: always explicit, never `any`
- **Exports**: named exports only, no `default export`

### Server vs Client Components

- Everything is a **Server Component** by default
- Add `'use client'` only when strictly necessary (interactivity, state/effect hooks)
- Push the `'use client'` boundary as deep as possible — prefer extracting interactive parts into dedicated leaf components
- Components in `components/` that use state must be Client Components
- Never place `'use client'` on a file that fetches data; separate data fetching (server) from interactivity (client)

### Loading and Error States

Each route feature should have colocated `loading.tsx` and `error.tsx` to handle its async states:

```
src/app/(main)/dashboard/
├── page.tsx        ← async function Page() { ... }
├── loading.tsx     ← Skeleton or loading UI
├── error.tsx       ← Error boundary for this route
├── components/
├── api/
├── hooks/
└── types.ts
```

---

## Environment variables

- API base URL must come from `process.env.API_BASE_URL` (server-only)
- Never hardcode URLs in source files
- Env vars used in Client Components must have `NEXT_PUBLIC_` prefix
- Document all variables in `.env.example`

---

## API

- **Base URL**: `http://localhost:5099` (local dev; see `process.env.API_BASE_URL`)
- **Authentication**: none for now
- **Contracts**: see `docs/api-contracts.md`

---

## Constraints

- **Do not invent layers** or folders outside the structure defined above
- **Do not add libraries** unless explicitly requested
- **Do not generate tests** unless explicitly requested
- **Never use Pages Router** under any circumstance
- **Do not break the Feature-Based Colocation dependency rule**: shared utilities flow inward, features never import from each other
- **Grow `(landing)/components/` intentionally**: if it accumulates more than 5 files, introduce sub-structure (`api/`, `hooks/`, `types.ts`) like feature folders
