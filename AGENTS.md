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