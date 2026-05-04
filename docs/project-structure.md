# Project Structure

> Canonical reference for the cukkr-frontend codebase. Read this alongside `docs/project-conventions.md` before creating or modifying any file.

---

## Overview

**cukkr-frontend** is a React Native / Expo app (file-based routing via `expo-router`) for a barbershop management platform. It targets iOS, Android, and Web from a single codebase.

| Item            | Detail                                           |
| --------------- | ------------------------------------------------ |
| Framework       | React Native + Expo SDK 54                       |
| Router          | expo-router v6 (file-based, Expo Router)         |
| Language        | TypeScript 5.9                                   |
| Package manager | pnpm                                             |
| Test runner     | Jest + jest-expo + @testing-library/react-native |
| Linter          | ESLint (eslint-config-expo)                      |
| Architecture    | Feature-module; no global state store            |

---

## Development Commands

```bash
pnpm start          # Start Expo dev server (also regenerates typed routes)
pnpm ios            # Run on iOS simulator
pnpm android        # Run on Android emulator
pnpm web            # Run in browser
pnpm test           # Run Jest in watch mode
pnpm lint           # Run ESLint
npx tsc --noEmit    # Type-check (run pnpm start first if route types are stale)
```

---

## Full Directory Tree

```
cukkr-frontend/
├── app/                                  # Route layer — thin files only
│   ├── _layout.tsx                       # Root Stack layout + DevNavFloat overlay
│   ├── index.tsx                         # Entry — Redirect to first screen
│   ├── dev-nav.tsx                       # Dev-only navigation hub (not production)
│   ├── (auth)/                           # Auth route scope
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── verify-account.tsx
│   │   ├── forgot-password.tsx
│   │   ├── verify-otp.tsx
│   │   └── create-password.tsx
│   ├── (onboarding)/                     # Onboarding route scope
│   │   ├── onboarding-splash.tsx
│   │   ├── onboarding-easy-booking.tsx
│   │   ├── onboarding-run-barbershop.tsx
│   │   └── onboarding-customer-happy.tsx
│   ├── (home)/                           # Home / dashboard route scope
│   │   └── home-dashboard.tsx
│   ├── (workspace)/                      # Workspace setup and switching
│   │   ├── switch-barbershop.tsx
│   │   ├── create-barbershop-name-logo.tsx
│   │   ├── create-barbershop-invite-barber-empty.tsx
│   │   ├── create-barbershop-invite-barber-filled.tsx
│   │   ├── create-barbershop-first-service.tsx
│   │   └── create-barbershop-success.tsx
│   ├── (barbershop)/                     # Barbershop management route scope
│   │   ├── barbershop-settings.tsx
│   │   ├── edit-barbershop-info.tsx
│   │   ├── edit-booking-url.tsx
│   │   ├── open-hours.tsx
│   │   ├── services-management.tsx
│   │   ├── service-detail.tsx
│   │   ├── add-or-edit-service.tsx
│   │   ├── barbers-management.tsx
│   │   ├── invite-barber.tsx
│   │   ├── customer-management.tsx
│   │   ├── customer-detail-general.tsx
│   │   ├── customer-detail-books.tsx
│   │   ├── customer-detail-messages.tsx
│   │   └── send-messages-to-customers.tsx
│   ├── (schedule)/                       # Booking / schedule route scope
│   │   ├── schedule-active-bookings.tsx
│   │   ├── new-appointment.tsx
│   │   ├── new-walk-in.tsx
│   │   ├── select-barber.tsx
│   │   ├── select-services.tsx
│   │   ├── booking-detail-request.tsx
│   │   ├── booking-detail-waiting.tsx
│   │   ├── booking-detail-in-progress.tsx
│   │   ├── booking-detail-result.tsx
│   │   ├── history-bookings.tsx
│   │   └── notifications-list.tsx
│   └── (profile)/                        # User profile route scope
│       ├── user-profile.tsx
│       ├── edit-user-profile-fields.tsx
│       └── verify-contact.tsx
│
├── src/                                  # All business logic and reusable code
│   ├── app-theme.ts                      # Global design tokens
│   ├── components/                       # Shared components (used across 2+ features)
│   └── features/                         # Feature modules
│       ├── auth/
│       ├── onboarding/
│       ├── home/
│       ├── workspace/
│       ├── barbershop/
│       ├── schedule/
│       ├── profile/
│       └── notifications/
│
├── assets/
│   └── images/                           # App icons, splash, and other static images
│
├── docs/                                 # Project documentation
│   ├── project-structure.md              # ← this file
│   ├── project-conventions.md            # Coding style, theme, naming, testing
│   ├── track_pages_and_components.md     # Implementation status per page/component
│   └── ui-ux-pages-descriptions.md       # UI/UX intent derived from design files
│
├── ui-ux-pages-pngs/                     # Design reference PNGs organized by feature
│   ├── auth.png
│   ├── barbershop/
│   ├── booking-detail/
│   ├── create-barbershop/
│   ├── home/
│   ├── notification/
│   ├── onboarding/
│   ├── schedule/
│   ├── schedule-new-book-by-admin/
│   └── user-profile/
│
├── AGENTS.md                             # LLM agent entry point and key doc index
├── app.json                              # Expo app config
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── eslint.config.js
```

---

## Feature Module Pattern

Every feature under `src/features/<feature>/` follows this structure:

```
src/features/<feature>/
├── <feature>-theme.ts       # Feature-specific design tokens (optional; extends AppTheme)
├── components/              # UI components used only inside this feature
├── screens/                 # Screen implementations — UI + local state
├── services/                # API calls and business logic (no UI code)
└── utils/                   # Pure helpers, validators, formatters
```

### Active Feature Modules

| Feature         | Route scope    | Responsibility                                    |
| --------------- | -------------- | ------------------------------------------------- |
| `auth`          | `(auth)`       | Login, register, OTP, password recovery           |
| `onboarding`    | `(onboarding)` | Brand splash and benefit slides                   |
| `home`          | `(home)`       | Dashboard KPIs, shortcuts, walk-in PIN            |
| `workspace`     | `(workspace)`  | Barbershop creation wizard, workspace switching   |
| `barbershop`    | `(barbershop)` | Settings, services, barbers, customers, messaging |
| `schedule`      | `(schedule)`   | Bookings, appointments, history, notifications    |
| `profile`       | `(profile)`    | User profile editing, contact verification        |
| `notifications` | `(schedule)`   | Notification list (housed under schedule scope)   |

---

## Shared Components (`src/components/`)

Components used across two or more features. Full list:

| Component                | Purpose                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `AlertModal`             | Single-action blocking / success dialog                              |
| `BookingCard`            | Summary card for a booking item                                      |
| `BookingDetailCard`      | Detailed card used in booking detail screens                         |
| `BookingForm`            | Shared form for creating appointments                                |
| `BookingTypeToggle`      | Toggle between booking types                                         |
| `BottomTabBar`           | 4-tab global navigation bar (post-auth)                              |
| `CalendarModal`          | Date-picker modal overlay                                            |
| `ChartCard`              | KPI chart surface                                                    |
| `ComputedSummaryRow`     | Label + computed value row                                           |
| `ConfirmationModal`      | Two-action confirmation dialog                                       |
| `CustomerCard`           | Customer summary card                                                |
| `DangerButton`           | Destructive action button                                            |
| `DateSelectorPill`       | Horizontal date selector                                             |
| `DayChipRow`             | Weekday multi-select chips                                           |
| `DayHoursRow`            | Opening-hours row per weekday                                        |
| `DevNavFloat`            | Global floating dev button (FAB) → nav modal → `/dev-nav` (dev-only) |
| `DualActionFooter`       | Sticky two-button footer                                             |
| `EditFieldHeader`        | Back + centered title + save (checkmark) header                      |
| `FloatingActionButton`   | FAB overlay                                                          |
| `GradientButton`         | CTA with gradient fill and trailing icon                             |
| `HelperCopy`             | Instructional copy block under inputs (with optional error line)     |
| `HistoryBookingRow`      | Row in booking history list                                          |
| `IconActionButton`       | Icon-only action button                                              |
| `ImageUploadBox`         | Dashed or filled media upload surface                                |
| `InfoRow`                | Label–value row with optional chevron                                |
| `InlineDecisionButtons`  | Inline approve / reject button pair                                  |
| `InviteRow`              | Pending invite row with remove affordance                            |
| `LogoutRow`              | Logout action row                                                    |
| `MemberCard`             | Barber / team member card                                            |
| `MessageComposer`        | Text input + send for messaging                                      |
| `MessageThread`          | Message bubble list                                                  |
| `MetricCard`             | KPI count card (optional accent border)                              |
| `MultilineInputField`    | Long-form textarea input                                             |
| `NotificationCard`       | Single notification item                                             |
| `OperationRow`           | Chevron row navigating to a sub-screen                               |
| `OverflowMenu`           | Three-dot context menu                                               |
| `PrefixedInputField`     | Input with fixed prefix (e.g. booking URL domain)                    |
| `PrimaryButton`          | Main CTA button                                                      |
| `ProfileSummaryCard`     | User avatar + name + role card                                       |
| `ScreenHeader`           | Back button + centered title + optional right slot                   |
| `SearchInput`            | Search bar input                                                     |
| `SecondaryButton`        | Outlined secondary button                                            |
| `SegmentedTabs`          | Horizontal pill tab switcher                                         |
| `SelectionFooter`        | Bottom bar for bulk-selection actions                                |
| `SelectionRow`           | Avatar + text row with chevron for single selection                  |
| `SelectionToolbar`       | Top bar for bulk-selection mode                                      |
| `SelectorInput`          | Dropdown-style selector input                                        |
| `ServiceCard`            | Service summary card                                                 |
| `ServiceForm`            | Form fields for creating/editing a service                           |
| `ServiceSelectionCard`   | Selectable service card                                              |
| `ShortcutTile`           | Icon + label quick-access tile                                       |
| `SortMenu`               | Sort options menu                                                    |
| `StatCard`               | Stat summary card                                                    |
| `StatusBadge`            | Colored status indicator badge                                       |
| `StatusFilterMenu`       | Filter menu by booking status                                        |
| `StatusPill`             | Inline status pill                                                   |
| `StickyCta`              | Full-width sticky bottom CTA                                         |
| `SuccessState`           | Centered success illustration block                                  |
| `SwipeConfirmationModal` | Swipe-to-confirm modal                                               |
| `TextInputField`         | Single-line text / numeric / currency input                          |
| `TimePickerModal`        | Time selection modal                                                 |
| `ToggleRow`              | Label + toggle switch row                                            |
| `ToggleSwitch`           | Standalone toggle switch                                             |
| `WizardProgress`         | Multi-step progress bar                                              |
| `WorkspacePill`          | Current workspace dropdown-style selector                            |

---

## Global Design Tokens (`src/app-theme.ts`)

```ts
AppTheme.colors.bg; // '#EEEEE0' — page background
AppTheme.colors.card; // '#FFFFFF' — card / surface
AppTheme.colors.dark; // '#1A1A1A' — primary text, dark buttons
AppTheme.colors.gray; // '#666666' — secondary text, icons
AppTheme.colors.lightGray; // '#B0ADA0' — placeholder, disabled
AppTheme.colors.accent; // '#C6FF4D' — primary accent (lime green)
AppTheme.colors.border; // '#E0DDD0' — dividers, input borders
AppTheme.colors.danger; // '#E53E3E' — error text, destructive
AppTheme.colors.dangerBg; // '#FFE4E4' — danger button background
AppTheme.colors.infoRowBg; // '#D9E8A0' — profile card tint
AppTheme.colors.blue; // '#2196F3' — informational state
AppTheme.colors.orange; // '#FF9800' — warning state
```

Spacing scale: `xs=4 sm=8 md=12 lg=16 xl=20 xxl=24 xxxl=32`  
Border radii: `sm=6 md=12 lg=16 xl=24 full=999`  
Typography scale: `heading(28/700) subheading(20/700) body(14/400) caption(12/400) label(13/500)`

---

## Key Architecture Rules

1. **`app/` is route-only** — each file imports a screen and does nothing else.
2. **All UI + state lives in `src/features/<feature>/screens/`**.
3. **Shared component threshold**: if used in 2+ features → `src/components/`; otherwise → `src/features/<feature>/components/`.
4. **No global store** — use `useState`/`useReducer` locally; lift to nearest common parent when needed.
5. **Navigation** always via `expo-router` (`useRouter`, `router.push/replace/back`). Never navigate inside shared components.
6. **Theming** — never hard-code colors or spacing that exist in `AppTheme`. Use the token.
7. **Named exports** for all `src/` files; `export default` only in `app/` route files.

---

## Related Documents

| Document              | Path                                 | Read when                               |
| --------------------- | ------------------------------------ | --------------------------------------- |
| Coding conventions    | `docs/project-conventions.md`        | Starting any file edit or creation      |
| Implementation status | `docs/track_pages_and_components.md` | Checking what's done / what's next      |
| UI/UX descriptions    | `docs/ui-ux-pages-descriptions.md`   | Implementing or reviewing screen design |
| Agent entry point     | `AGENTS.md`                          | Understanding LLM agent workflow        |
