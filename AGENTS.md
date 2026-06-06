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

## Feature Module Isolation Rules

Each feature module (`src/features/<feature>/`) is **self-contained**. Its screens, hooks, and services must only import from within the same feature or from shared paths (`src/components/`, `src/lib/`, `src/utils/`, `src/services/`).

### Cross-feature imports are forbidden

```
// ❌ barbershop screen importing from workspace feature
import { useBarbershopCurrent } from "@/src/features/workspace/hooks";

// ✅ barbershop screen importing from its own feature
import { useBarbershopCurrent } from "@/src/features/barbershop/hooks";
```

### Each feature owns only what it uses

- Create services, hooks, and utils **only for the operations actually used** inside that feature's screens.
- If a function is needed by two features, move it to `src/services/` or `src/utils/` (shared layer), not into one feature and imported by the other.
- When adding a new screen to a feature, always create or implement that feature's own service and hooks, see other feature for reference and use as needed.

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

### Date Handling (mandatory — all date operations must follow this rule)

All date utilities live in `src/utils/date.ts`. Never write inline date formatting functions in screens or components.

#### Architecture (industry standard)

```
Backend  ──► always store & return UTC (timestamptz) ──► "2026-05-16T11:29:38Z"
Frontend ──► display: new Date(apiDate) → JS Date converts UTC → user local automatically
Frontend ──► input:   toApiDateTime() → converts user local → UTC before sending
```

JavaScript's `Date` object handles UTC → local timezone conversion natively. `new Date("2026-05-16T11:29:38Z").getHours()` on a UTC+7 device returns `18` (6 PM) with zero extra code. No manual timezone correction is needed on the frontend.

#### Rule: Display vs. Input

| Direction | Rule | Function |
|---|---|---|
| API → Display (any date field) | Parse normally | `new Date(apiDate as Date)` |
| User input → API (datetime) | Send UTC ISO string | `toApiDateTime(date, h, m, amPm)` |
| User input → API (date-only query param) | Local date components | `toApiDate(date)` |

#### Function reference

```typescript
import {
  formatRelativeTime,  // "5m ago" / "2h ago" / "5d ago"
  formatDateLabel,     // "Sunday, 15 Jan 2025"
  formatDateTime,      // "15 Jan 2025, 09:30"
  formatTime12h,       // "9:30 am" — from a Date object
  formatDisplayDate,   // "Sun, 15 Jan"
  toApiDate,           // "2025-01-15" — local date for query params
  toApiDateTime,       // ISO UTC string for datetime body params
  parseTime24,         // "09:30" → { hour24, minute }
  toInitial12h,        // 24h → 12h for TimePicker initial state
  formatPickerTime,    // "9:30 AM" — display label from picker state values
} from '@/src/utils/date';
```

#### Usage examples

```typescript
// ✅ Displaying any date from API
const date = new Date(booking.createdAt as Date);
<Text>{formatDateTime(date)}</Text>

// ✅ Choosing scheduledAt (appointment) vs createdAt (walk-in)
const timeDate = new Date((booking.scheduledAt ?? booking.createdAt) as Date);
<Text>{formatTime12h(timeDate)}</Text>

// ✅ Notifications relative time
<NotificationCard timestamp={formatRelativeTime(notif.createdAt)} />

// ✅ Sending datetime to API (converts local → UTC automatically)
updateFormData({ scheduledAt: toApiDateTime(selectedDate, hour, minute, amPm) });

// ✅ Date-only API query param
const today = toApiDate(new Date());
useBookings(today);

// ❌ Never write inline date formatters in screens/components
function formatDate(d: Date) { ... }  // use src/utils/date.ts instead
```

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

### Role-Based Access & Permission Components

The app uses Better Auth Organizations for multi-tenancy. Each member has one of three roles:

| Role | Level | Description |
|------|-------|-------------|
| `owner` | Full control | Barbershop creator; can manage everything |
| `admin` | Management | Can manage services, view analytics, accept/decline bookings |
| `member` | Staff (barber) | Can handle bookings and view data, but cannot modify services or view analytics |

#### `useMemberRole()` hook (shared — `src/hooks/useMemberRole.ts`)

Returns the current user's role in the active organization:

```typescript
import { useMemberRole } from "@/src/hooks";

function MyScreen() {
  const { role, isPending } = useMemberRole();
  // role: 'owner' | 'admin' | 'member' | null
  if (isPending) return null;
  if (role === "owner" || role === "admin") {
    // user can manage
  }
}
```

#### `Permission` component (shared — `src/components/Permission.tsx`)

Wraps any JSX and shows it only if the user's role matches one of the allowed `roles`. Optionally renders a `fallback` when access is denied.

**Usage — hide buttons from barbers:**
```tsx
import { Permission } from "@/src/components/Permission";

// Hide the "Add" button unless the user is owner or admin
<Permission roles={["owner", "admin"]}>
  <IconActionButton iconName="add" onPress={handleAdd} />
</Permission>

// Hide toggle switch from barbers — conditional prop passing
const canManage = role === "owner" || role === "admin";
<ServiceCard
  onToggleActive={canManage ? handleToggle : undefined}
/>

// Hide an entire section with a fallback message
<Permission roles={["owner", "admin"]} fallback={<Text>View only</Text>}>
  <AdminPanel />
</Permission>
```

**Rules:**
- Always pair frontend Permission with backend `requireRoles` — Permission is UX-only, backend enforces security.
- `Permission` renders `children` when the user's role is in the `roles` array.
- When `isPending` (role still loading), Permission renders nothing (prevents flash).
- For conditional props (e.g., `onToggleActive`), use the `role` value directly via `useMemberRole()`.

#### Where to apply Permission

| Component/Screen | What to hide | Allowed roles |
|---|---|---|
| `ServicesManagementScreen` | Add (+) button, active toggle per service | `owner`, `admin` |
| `ServiceDetailScreen` | Overflow menu (edit/delete), active toggle, set-default button | `owner`, `admin` |

When adding a new screen or feature, follow this checklist:
1. Decide which roles should access each action.
2. Add `requireRoles` on the backend endpoint.
3. Wrap the corresponding frontend action buttons/components with `<Permission>`.

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

## Routing with Dynamic IDs

Web output is `single` (SPA). Never use `[id].tsx` for runtime-generated IDs — IDs are unknown at build time and can't be statically generated.

**Use a static route with query params instead:**

```
app/d/booking-detail/index.tsx   ✓
app/d/booking-detail/[id].tsx    ✗
```

Navigate:
```ts
router.push({ pathname: "/d/booking-detail", params: { id: bookingId } });
```

Read in route file:
```ts
// app/d/booking-detail/index.tsx
import { useLocalSearchParams } from "expo-router";

export default function BookingDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BookingDetailScreen bookingId={id} />;
}
```

Reference implementations: `app/d/accept-invitation/index.tsx`, `app/d/(schedule)/booking-detail-waiting.tsx`.

## Common Issues & Solutions

**TypeScript errors**: Always run `npx tsc --noEmit` after changes. Fix any TS errors immediately—don't leave type issues for later.

**Expo routing type errors**: If you see `Argument of type '"/path"' is not assignable` for Link href, run `npx expo start` then Ctrl+C. This generates Expo routing types.

**Modal width on desktop**: React Native `Modal` renders at full viewport width. On desktop (≥1024px), the app uses a 390px mobile frame — so any modal card/container using `width: '85%'` or `width: '100%'` will overflow the frame. Always use `useFrame()` from `src/components/FrameContext.tsx` to constrain modal content:
```ts
import { useFrame } from '@/src/components/FrameContext';
const { frameWidth } = useFrame();
```
- Fixed-percentage card (e.g. `width: '85%'`): replace with inline `width: frameWidth * 0.85`
- Full-width container with `paddingHorizontal: N` on overlay: replace with inline `maxWidth: frameWidth - N*2` on the container, add `alignSelf: 'center'`
- **Absolutely-positioned panel** (dropdown/sheet anchored to top): `left: 0, right: 0` spans the full viewport on desktop. Fix by computing `frameOffset = (viewportWidth - frameWidth) / 2` via `useWindowDimensions()` + `useFrame()`, then apply `left: frameOffset, right: frameOffset` to the panel.

See `src/components/ConfirmationModal.tsx` and `src/components/TimePickerModal.tsx` for reference implementations.

## Eden Treaty API Client

The app uses **Eden Treaty** (`@elysia/eden`) as a type-safe API client. All API requests go through `src/lib/eden-app.ts`.

### Setup
- **Client**: `src/lib/eden-app.ts` creates a treaty client typed by the backend Elysia `App`
- **Backend types**: `src/types/app.d.ts` (auto-generated from backend, includes all endpoints and types)
- **Authentication**: Automatically includes auth cookies via `onRequest` hook in `eden-app.ts`

### Usage in Services

**The one rule for dynamic segments:** any `:param` in the path — whether single or nested — is always called as a function `({ param: value })`. Never use `[":id"]` with a `params` object.

Read `src/types/app.d.ts` to find the correct chain: every key starting with `:` becomes a function call in the client.

```typescript
import { app } from "@/src/lib/eden-app";

// Static path — just chain and call
const response = await app.api.barbershop.get();
const { data } = response.data; // Fully typed response

// Static path with body
const response = await app.api.services.post({ name: "Haircut", price: 50000, duration: 30 });

// Static path with query params
const response = await app.api.services.get({ query: { sort: "name_asc" } });

// Dynamic segment (:id) — always call as function({ param })
const response = await app.api.services({ id: "service-123" }).get({});

// Dynamic segment + static sub-path
const response = await app.api.notifications({ id }).read.patch({});

// Dynamic segment + nested sub-path
const response = await app.api.notifications({ id }).actions.accept.post({});
const response = await app.api.customers({ id }).bookings.get({ query: { type: "all", page: 1 } });

// Static sub-path with hyphens — use bracket notation
const response = await app.api.notifications["unread-count"].get({});
const response = await app.api.notifications["read-all"].patch({});
const response = await app.api.services({ id })["toggle-active"].patch({});

// ❌ Never do this
const response = await app.api.services[":id"].get({ params: { id } });
```

**Endpoints and how to call examples**

| Endpoint | Call |
|---|---|
| `GET /api/services/:id` | `app.api.services({ id }).get({})` |
| `PATCH /api/services/:id` | `app.api.services({ id }).patch({ ... })` |
| `DELETE /api/services/:id` | `app.api.services({ id }).delete({})` |
| `PATCH /api/services/:id/toggle-active` | `app.api.services({ id })["toggle-active"].patch({})` |
| `POST /api/services/:id/image` | `app.api.services({ id }).image.post({ file })` |
| `PATCH /api/services/:id/set-default` | `app.api.services({ id })["set-default"].patch({})` |
| `GET /api/bookings/:id` | `app.api.bookings({ id }).get({})` |
| `PATCH /api/bookings/:id/status` | `app.api.bookings({ id }).status.patch({ status })` |
| `POST /api/bookings/:id/accept` | `app.api.bookings({ id }).accept.post({})` |
| `POST /api/bookings/:id/decline` | `app.api.bookings({ id }).decline.post({ reason })` |
| `PATCH /api/bookings/:id/reassign` | `app.api.bookings({ id }).reassign.patch({ handledByMemberId })` |
| `GET /api/customers/:id` | `app.api.customers({ id }).get({})` |
| `GET /api/customers/:id/bookings` | `app.api.customers({ id }).bookings.get({ query: { ... } })` |
| `PATCH /api/customers/:id/notes` | `app.api.customers({ id }).notes.patch({ notes })` |
| `PATCH /api/notifications/:id/read` | `app.api.notifications({ id }).read.patch({})` |
| `POST /api/notifications/:id/actions/accept` | `app.api.notifications({ id }).actions.accept.post({})` |
| `POST /api/notifications/:id/actions/decline` | `app.api.notifications({ id }).actions.decline.post({ reason })` |
| `DELETE /api/barbershop/:orgId/leave` | `app.api.barbershop({ orgId }).leave.delete({})` |

### Error Handling

**Eden Treaty (`app`) calls — always extract the server message:**

```typescript
const { data: response, error } = await app.api.some.endpoint.get();
if (error || !response) throw new Error(error?.value?.message || "Fallback message");
```

- `error?.value?.message` carries the actual backend error message (e.g. "Slug already taken", "Unauthorized")
- The fallback string is used only when no server message is present
- Use optional chaining (`?.`) because `error` may be null when `!response` is the trigger

**`authClient` calls — error message is directly on `error`:**

```typescript
const { data, error } = await authClient.signIn.email({ email, password });
if (error) throw new Error(error.message || "Fallback message");
```

- Never wrap `authClient` errors with `error.value.message` — that shape is Eden-specific
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


## Brand Color System

All colors must use tokens from `src/theme/colors.ts`. **Never hardcode hex values** in components or screens. See that file for the full token list and actual values.

### Token Reference

| Token | When to Use |
|---|---|
| `Colors.brand.primary` | CTA button bg, active tab, toggle ON, selected chip, highlight |
| `Colors.brand.primaryDark` | Pressed/emphasis state, link color |
| `Colors.brand.primarySurface` | Subtle brand-tinted background |
| `Colors.bg.default` | Screen background, card background |
| `Colors.bg.surface` | Section bg inside white screen, secondary cards |
| `Colors.text.primary` | Headings, main body copy |
| `Colors.text.secondary` | Labels, captions, hints, subtext |
| `Colors.text.muted` | Placeholder text, disabled text |
| `Colors.icon.muted` | Inactive/decorative icons |
| `Colors.icon.default` | Active/emphasis icons |
| `Colors.border.default` | Input borders, card outlines |
| `Colors.border.light` | Subtle dividers, separators |
| `Colors.status.danger` | Error, delete, cancel |
| `Colors.status.success` | Completed, accepted |
| `Colors.status.warning` | Pending, caution |
| `Colors.status.inProgress` | In-progress bookings |
| `Colors.status.waiting` | Waiting bookings |

### Usage Rules

- **Brand color is an accent, not a dominant color.** Use it on interactive elements (buttons, active states, highlights), never as a full-screen background.
- **Text on brand-colored background** always uses `Colors.text.primary`, never white.
- **Inactive icons** use `Colors.icon.muted`. Only use `Colors.icon.default` when the icon represents an active/selected state.
- To change any color globally, edit only `src/theme/colors.ts` — all components pick up the change automatically.

```ts
// ✅ Correct
import { Colors } from '@/src/theme/colors';
backgroundColor: Colors.brand.primary

// ❌ Never hardcode hex
backgroundColor: '#ffc81e'
```

## Constraints
- don't use `any` or `as any` as much as possible, use them with proper TypeScript types, use any when the options are just any or unknown, if you can make proper typescript types, make it.