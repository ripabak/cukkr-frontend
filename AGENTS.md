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

### Error explained

- if related to existing href link like `<Link href="/path" asChild>` like `Argument of type '"/path"' is not assignable` when running `npx tsc --noEmit`, maybe because need to generate the expo type first by running `npx expo start` and ctrl-c to stop server.

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
