# AGENTS.md

## Project Structure

### Notation

- **(feature-scope)**: A folder in parentheses represents a route group or scope. It groups related screens and layouts without creating an extra path segment in the router.
- **feature-name**: A placeholder for any feature module under `src/features`.

### Tree Structure

```
app/                              # App router layer (Expo routing)
├── _layout.tsx                   # Root layout and navigation setup
├── (auth)/                       # Example auth route scope
│   ├── create-password.tsx
│   ├── forgot-password.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── verify-account.tsx
│   └── verify-otp.tsx
└── index.tsx                     # Home page

src/                              # Business logic and reusable code
├── components/                   # Global reusable UI components
├── features/                     # Feature-specific modules
│   ├── auth/                     # Example feature module
│   │   ├── auth-theme.ts         # Theme and styling constants
│   │   ├── components/           # Feature-specific UI components
│   │   ├── hooks/                # Custom React hooks (useQuery, useMutation)
│   │   ├── screens/              # Screen implementations
│   │   ├── services/             # Feature API and business logic
│   │   └── utils/                # Feature helper utilities
│   └── feature-name/             # Placeholder for another feature module
│       ├── feature-name-theme.ts # Theme and styling constants
│       ├── components/           # Feature-specific UI components
│       ├── hooks/                # Custom React hooks (useQuery, useMutation)
│       ├── screens/              # Screen implementations
│       ├── services/             # Feature API and business logic
│       └── utils/                # Feature helper utilities
├── lib/                          # Core library setup
│   ├── providers/                # Context providers (QueryProvider, ToastProvider)
│   └── TANSTACK_QUERY_EXAMPLES.md # TanStack Query usage examples
├── services/                     # Global reusable services
└── utils/                        # Global reusable utilities
```

### Organization Pattern

- **app/**: Contains route definitions and layout wiring.
- **(feature-scope)**: Used in `app` to group a set of related pages under one router scope without adding a path segment.
- **src/features/**: Each feature has an isolated module structure with its own components, screens, services, and utils.
- **src/components/**, **src/services/**, and **src/utils/**: Shared code that is reusable across the whole application.

## Feature Architecture Guidelines

### Screens
- **Entry point for user interaction.** Screens handle user input, display data, and orchestrate async operations.
- **No business logic or data transformation.** Logic lives in services; screens call them and handle results.
- **UI feedback via toast, never Alert.** All success, error, and info messages use `useToast()` from `@/src/lib/providers/toast`.
- **Wrap async service calls in try-catch.** Convert errors to user-friendly messages via `getErrorMessage(error)` utility.
- **Example**: Login screen imports `authService`, calls `authService.signIn()`, and displays result via `toast.success()` or `toast.error()`.

### Services
- **Single responsibility.** One service file = one cohesive domain or operation type (e.g., `auth.service.ts` for login/signup, `otp.service.ts` for OTP flows).
- **Wrap external clients.** Services are the only place that imports and calls `authClient`, `app.api`, or third-party API clients.
- **Throw errors, not return error objects.** Service methods throw descriptive Error objects on failure; screens catch them.
- **Pure functions where possible.** No side effects; no direct UI updates (no toast, no navigation inside services).
- **Typed contracts.** Export an object with strongly-typed async methods. Provide JSDoc comments for complex operations.
- **Barrel export via index.ts.** All services in a feature expose themselves through `services/index.ts` for clean imports.
- **Example**: `authService.signIn(email, password)` throws on error; caller in screen catches and shows `toast.error()`.

### Utils
- **Helper functions and constants.** Stateless, reusable logic that doesn't call external APIs.
- **Validation functions** (e.g., `isValidEmail()`, `validatePrice()`). Return validation result objects with `{ isValid, message }`.
- **Error converters** (e.g., `getErrorMessage(error)` extracts message from various error types safely).
- **Data transformers** (e.g., `slug-generator.ts` creates slugs from barbershop names).
- **No side effects.** Utils are pure utility functions; they never call services, APIs, or update UI state.
- **Example**: `isValidEmail(email)` returns `boolean`; `getErrorMessage(error)` safely extracts error message string.

### Context (if multi-step forms or complex state)
- **Centralize multi-step form state.** When a flow spans multiple screens (e.g., create barbershop over 5 steps), use Context to share state.
- **Only for form/wizard state, not API data.** Context holds form field values and step progress; API responses are managed by individual screens.
- **Provide via Provider at feature root.** Wrap feature screens in a Context Provider in the layout or root component.
- **Example**: `CreateBarbershopContext` holds name, slug, address across screens; each screen updates via `updateFormData()`.

### Components
- **Feature-specific UI components live in `components/` folder.** Reusable buttons, inputs, modals for this feature.
- **Global components in `src/components/`.** Shared across entire app (e.g., `PrimaryButton`, `ScreenHeader`).
- **Presentational only.** Components receive data via props and call callbacks; they don't fetch data or manage async state.
- **Example**: `AuthTextField` (feature-specific) wraps styling; screens pass `value`, `onChangeText`, `label` as props.

### Hooks (TanStack Query)
- **Only for data queries that need caching.** Use TanStack Query for reads where multiple screens share the same data and caching improves UX.
- **Query hooks for fetching data.** Use `useQuery()` for reads; automatically cached and revalidated. Example: `useBarbershopCurrent()` fetches current barbershop data.
- **Mutation hooks for API writes that affect queries.** Use `useMutation()` with `onSuccess` cache invalidation. Example: `useUpdateBarbershopSettings()` updates settings and invalidates related queries.
- **Live in `hooks/` folder.** Each feature has `hooks/index.ts` that barrel-exports all custom hooks for clean imports.
- **Query keys are centralized.** Query keys defined in hooks ensure consistency for cache invalidation and debugging. Example: `BARBERSHOP_QUERY_KEYS = { all: ['barbershop'], list: () => [...], current: () => [...] }`.
- **Hooks handle invalidation.** On mutation success, hooks automatically invalidate related query keys via `queryClient.invalidateQueries()`. Screens don't manage cache directly.
- **Screens use hooks for data queries.** Screens import hooks and call `const { data, isLoading } = useBarbershopCurrent()` instead of calling service directly.
- **Error & loading states from hooks.** Hooks return `{ data, isLoading, error, isPending }` for UI feedback without manual state management.
- **Example**: `useUpdateBarbershopSettings()` returns `{ mutate, isPending, error }`; screen calls `mutate(data)` and shows `isPending` in button.

## Data Flow Architecture

### Query Flow (Reading Data)
```
Screen Component
    ↓
Imports & calls custom hook (e.g., useBarbershopCurrent())
    ↓
Hook uses TanStack Query (useQuery)
    ↓
Query calls service function (e.g., barbershopService.getCurrent())
    ↓
Service imports & uses API client (authClient, app.api)
    ↓
API call to backend
    ↓
Response cached by TanStack Query
    ↓
Screen receives { data, isLoading, error } & renders UI
```

### Mutation Flow (Writing Data with Cache Invalidation)
```
Screen Component
    ↓
User action (button press, form submit)
    ↓
Screen calls mutation hook (e.g., const { mutate } = useUpdateBarbershopSettings())
    ↓
mutate({ name: '...' })
    ↓
Hook uses TanStack Query (useMutation)
    ↓
Mutation calls service function (e.g., barbershopService.updateSettings())
    ↓
Service imports & uses API client (authClient, app.api)
    ↓
API call to backend
    ↓
On success: Hook invalidates related queries → re-fetches data
    ↓
Screen receives onSuccess/onError callback
    ↓
Screen shows toast feedback & updates UI
```

### Key Points
- **For data queries: Use hooks, not services.** Hooks handle caching & invalidation automatically.
- **For authClient operations: Call services directly with try-catch.** No React Query wrapper needed; use `useState` for loading.
- **Services remain lightweight.** They only wrap API clients; no business logic beyond API calls.
- **Cache is smart and selective.** Only cache data that multiple screens share (queries). Skip caching for one-off operations (authClient).

## Common Issues & Solutions

**TypeScript errors**: Always run `npx tsc --noEmit` after changes. Fix any TS errors immediately—don't leave type issues for later.

**Expo routing type errors**: If you see `Argument of type '"/path"' is not assignable` for Link href, run `npx expo start` then Ctrl+C. This generates Expo routing types.

## Eden Treaty API Client

The app uses **Eden Treaty** (`@elysia/eden`) as a type-safe API client. All API requests go through `src/lib/eden-app.ts`.

### Setup
- **Client**: `src/lib/eden-app.ts` creates a treaty client typed by the backend Elysia `App`
- **Backend types**: `src/types/app.d.ts` (auto-generated from backend, includes all endpoints and types)
- **Authentication**: Automatically includes auth cookies via `onRequest` hook in `eden-app.ts`

### Basic Usage in Services
```typescript
import { app } from "@/src/lib/eden-app";

// Call an API endpoint (example: GET /api/barbershop)
const response = await app.api.barbershop.get();
const { data } = response.data; // Fully typed response

// Call with parameters (example: POST /api/services)
const response = await app.api.services.post({
  name: "Haircut",
  price: 50000,
  duration: 30,
});

// Call with path params (example: GET /api/services/:id)
const response = await app.api.services[":id"].get({
  params: { id: "service-123" },
});

// Call with query params (example: GET /api/services?sort=name_asc)
const response = await app.api.services.get({
  query: { sort: "name_asc" },
});
```

### Error Handling
- All API calls may throw errors; wrap in try-catch in services
- Services throw errors; screens catch and convert to user messages via `getErrorMessage()`
- See `TANSTACK_QUERY_SETUP.md` for hook-level error handling

### Common Endpoints
Check `src/types/app.d.ts` for complete endpoint list. Key endpoints include:
- **Barbershop**: `app.api.barbershop` (GET, POST, PATCH, settings, logo)
- **Services**: `app.api.services` (CRUD, toggle-active, set-default, image upload)
- **Bookings**: `app.api.bookings` (CRUD, status update, accept/decline, reassign)
- **Customers**: `app.api.customers` (list, get, bookings, notes)
- **Notifications**: `app.api.notifications` (list, read, actions)
- **Analytics**: `app.api.analytics` (get stats by range)
- **Public**: `app.api.public` (barbershop details, availability, booking, walk-in)

## Key Documentation

Every agent must read these docs before starting any work:

| Document                    | Path                                 | Purpose                                                                            |
| --------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| **Project structure**       | `docs/project-structure.md`          | Full directory tree, tech stack, feature modules, shared components, dev commands  |
| **Coding conventions**      | `docs/project-conventions.md`        | Theme system, component patterns, naming rules, screen layout rules, testing setup |
| **Page/component tracking** | `docs/track_pages_and_components.md` | Implementation status for all pages and components (slicing, UI functional, API)   |
| **Page descriptions**       | `docs/ui-ux-pages-descriptions.md`   | UI/UX intent for each page derived from design files                               |
| **Component index**         | `docs/component-index.md`            | All components grouped by category for quick lookup                                |
| **Toast examples**          | `docs-guides/TOAST_USAGE_EXAMPLES.md` | Real-world toast implementation examples and patterns                             |
| **Protected Route**          | `docs-guides/PROTECTED_ROUTES.md` | Implementation how to protected route for auth    
| **Auth & Organization**     | `docs-guides/AUTH_AND_ORGANIZATION.md` | Auth client setup, organization management, and implementation patterns             |
| **Eden Treaty API Guide**   | `AGENTS.md` (above)                  | Type-safe API client setup, common endpoints, basic usage examples                 |
| **TanStack Query Setup**    | `src/lib/TANSTACK_QUERY_SETUP.md`   | Data fetching patterns, hook usage, error handling, best practices for queries & mutations |
| **TanStack Query Examples** | `src/lib/TANSTACK_QUERY_EXAMPLES.md` | Real-world implementation examples, refactoring guide, performance tips             |

Update `docs/project-conventions.md` whenever a new pattern is established.
Update `docs/track_pages_and_components.md` whenever a page, component, or infrastructure item is created or modified.


## Constraints
- don't use `any` as much as possible, use them with proper TypeScript types, use any when the options are just any or unknown, if you can make proper typescript types, make it.