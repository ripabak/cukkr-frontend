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
│   │   ├── screens/              # Screen implementations
│   │   ├── services/             # Feature API and business logic
│   │   └── utils/                # Feature helper utilities
│   └── feature-name/             # Placeholder for another feature module
│       ├── feature-name-theme.ts # Theme and styling constants
│       ├── components/           # Feature-specific UI components
│       ├── screens/              # Screen implementations
│       ├── services/             # Feature API and business logic
│       └── utils/                # Feature helper utilities
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
- **Never import external API clients directly** (e.g., `authClient`, `app.api`). Always use services.
- **No business logic or data transformation.** Logic lives in services; screens call them and handle results.
- **UI feedback via toast, never Alert.** All success, error, and info messages use `useToast()` from `@/src/lib/providers`.
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

## Common Issues & Solutions

**Expo routing type errors**: If you see `Argument of type '"/path"' is not assignable` for Link href, run `npx expo start` then Ctrl+C. This generates Expo routing types.

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
| **Auth & Organization**     | `docs-guides/AUTH_AND_ORGANIZATION.md` | Auth client setup, organization management, and implementation patterns             |

Update `docs/project-conventions.md` whenever a new pattern is established.
Update `docs/track_pages_and_components.md` whenever a page, component, or infrastructure item is created or modified.
