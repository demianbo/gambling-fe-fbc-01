# GamblingApp Frontend

A Next.js frontend application built with Feature-Based Colocation architecture, Tailwind CSS, and shadcn/ui.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Setup

```bash
# Install dependencies
pnpm install

# Create .env.local from .env.example
cp .env.example .env.local

# Update API_BASE_URL if needed (default: http://localhost:5099)
```

### Development

```bash
# Start dev server (http://localhost:3000)
pnpm dev

# Check TypeScript
pnpm tsc --noEmit

# Build for production
pnpm build
pnpm start
```

## Architecture

This project follows **Feature-Based Colocation**, where each feature is a self-contained module colocated with its routes in the `app/` directory.

### Folder Structure

```
src/
├── app/
│   ├── (landing)/          # Public landing page route group
│   │   ├── components/     # Landing-only components
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── layout.tsx          # Root layout
│
├── components/             # Shared UI components (Button, Header, Footer, etc.)
├── services/               # Shared API layer (fetcher)
├── hooks/                  # Shared custom hooks
└── lib/                    # Shared utilities (cn, etc.)
```

### Key Principles

1. **Features are self-contained** — each feature in `app/` can only import from:
   - Its own colocated folders (`./components`, `./hooks`, `./types.ts`)
   - Shared utilities (`@/components`, `@/hooks`, `@/lib`, `@/services`)

2. **No cross-feature imports** — features never import from other features

3. **Data flow** — `services/` → `feature/api/` → `feature/hooks/` or `page.tsx`

4. **Error handling** — all `api/` functions return `{ data: T | null, error: string | null }` (never throw)

## Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **HTTP**: Native `fetch` via `@/services/fetcher`
- **Icons**: lucide-react

## Code Conventions

- **Files**: `kebab-case` (e.g., `hero-section.tsx`, `use-balance.ts`)
- **Components**: Always Server Components by default; add `'use client'` only when strictly necessary
- **Types**: Always explicit, never `any`
- **Exports**: Named exports only, no default exports

## API Configuration

Set `API_BASE_URL` in `.env.local` (defaults to `http://localhost:5099`):

```env
API_BASE_URL=http://localhost:5099
```

The fetcher automatically:
- Builds full URLs from the base URL
- Sets `Content-Type: application/json`
- Handles errors gracefully

## Contributing

- Follow Feature-Based Colocation rules (see CLAUDE.md)
- Keep components small and focused
- Use shared utilities for common functionality
- No cross-feature imports

See [CLAUDE.md](./CLAUDE.md) for detailed architecture guidelines.