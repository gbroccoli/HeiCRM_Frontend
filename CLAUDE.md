# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HeiCRM Frontend is a React-based CRM application built with TypeScript, Vite, and modern tooling. The project uses Tailwind CSS v4 for styling and shadcn/ui components for the UI layer.

## Build & Development Commands

- **Development server**: `npm run dev` or `bun dev`
  - Runs on Vite dev server
  - Configured to allow host: `tuna.testenvenv.ru`
- **Build**: `npm run build` or `bun build`
  - Runs TypeScript compiler first (`tsc -b`), then Vite build
  - Output goes to `dist/`
- **Lint**: `npm run lint` or `bun lint`
  - Uses ESLint 9 with flat config
- **Preview**: `npm run preview` or `bun preview`
  - Preview production build locally

## Architecture

### Technology Stack

- **Build Tool**: Vite (using rolldown-vite@7.2.2)
- **Framework**: React 19.2.0 with TypeScript 5.9.3
- **Routing**: React Router 7.9.6 (new architecture)
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Forms**: React Hook Form 7.66.0 with Zod 4.1.12 validation
- **State Management**: Zustand 5.0.8
- **HTTP Client**: Axios 1.13.2
- **Icons**: Lucide React 0.553.0

### Project Structure

```
src/
├── api/
│   └── axios.ts    # Configured axios instance ($api) with interceptors
├── assets/          # Static assets (images, icons)
├── components/
│   └── ui/         # shadcn/ui components (Button, Form, Input, etc.)
├── lib/
│   └── utils.ts    # Utility functions (cn for className merging)
├── pages/
│   └── Login/      # Page-level components
│       ├── LoginPage.tsx
│       └── componetns/  # Note: typo in folder name "componetns"
│           └── LoginForm.tsx
├── main.tsx        # App entry point with router setup
└── index.css       # Global styles and Tailwind directives
```

### Path Aliases

- `@/*` maps to `src/*` (configured in tsconfig.json and vite.config.ts)
- shadcn/ui components use these aliases:
  - `@/components` → `src/components`
  - `@/lib/utils` → `src/lib/utils`
  - `@/ui` → `src/components/ui`

### Routing

The app uses React Router v7 with `createBrowserRouter`:
- Routing is defined in `src/main.tsx`
- Currently has single route: `/` → LoginPage

### Forms & Validation

Forms follow this pattern:
1. Define schema using Zod (e.g., `formSchema` with validation rules)
2. Use `useForm` from react-hook-form
3. Wrap form in `<Form>` provider
4. Use `FormField` + `FormItem` + `FormLabel` + `FormControl` + `FormMessage` for each field
5. Form submission handled via `form.handleSubmit(onSubmit)`

### UI Components

All UI components are in `src/components/ui/` and follow shadcn/ui patterns:
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Use `cn()` utility for conditional className merging
- Components include: Button, Input, Form, Label, Separator, Textarea, Field, InputGroup

### HTTP Client & API

The app uses a configured axios instance located at `src/api/axios.ts`:
- Export name: `$api` (also default export)
- Base URL configured via `VITE_API_BASE_URL` environment variable
- Request interceptor: automatically adds `Authorization: Bearer <token>` header from localStorage
- Response interceptor: handles 401 errors with automatic token refresh logic
- Tokens stored in localStorage: `accessToken` and `refreshToken`

**Usage example:**
```typescript
import { $api } from '@/api/axios';

const response = await $api.post('/auth/login', { email, password });
```

**Environment variables:**
- Create `.env.local` file (already gitignored via `*.local` pattern)
- See `.env.example` for required variables
- Access in code via `import.meta.env.VITE_*`

### Styling Conventions

- Use Tailwind CSS v4 utility classes
- Use `cn()` from `@/lib/utils` to merge class names conditionally
- shadcn/ui uses "New York" style variant
- Base color: gray
- CSS variables enabled for theming
- Dark mode support via Tailwind's `dark:` prefix

## Important Notes

- **Typo in folder structure**: `src/pages/Login/componetns/` should be `components` but is currently `componetns` - maintain this for consistency unless explicitly refactoring
- **Vite override**: Project uses `rolldown-vite@7.2.2` instead of standard Vite (specified in package.json overrides)
- **Language**: UI text is in Russian (Cyrillic)
- **React version**: Using React 19 (latest)
- **"use client"**: Some components have `"use client"` directive (from Next.js shadcn/ui templates) but this is a Vite app - these directives are ignored and can be removed if desired
