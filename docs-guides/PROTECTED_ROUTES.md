# Protected Routes Implementation

## Overview

All profile routes are now protected with authentication checks. Users who are not authenticated will be automatically redirected to the login page.

## Architecture

### 1. Authentication Hooks

Located in `src/hooks/`:

#### `useAuthGuard()`

Checks if the user is authenticated using `authClient.getSession()`. Automatically redirects to login if not authenticated.

```typescript
const { isLoading, isAuthenticated } = useAuthGuard();
```

#### `useAuthUser()`

Fetches and returns the current authenticated user data.

```typescript
const { user, isLoading } = useAuthUser();
```

### 2. ProtectedRoute Component

Located in `src/components/ProtectedRoute.tsx`

Wraps protected routes and displays a loading state while checking authentication. Used in route layouts.

### 3. Protected Profile Routes

All routes under `app/(profile)/` are protected:

- `(profile)/user-profile.tsx` - User profile display
- `(profile)/edit-user-profile-fields.tsx` - Edit profile fields
- `(profile)/verify-contact.tsx` - Contact verification

Protected via `app/(profile)/_layout.tsx` which wraps all profile routes with `<ProtectedRoute>`.

## How It Works

### Route Protection Flow

```
User navigates to /user-profile
    ↓
ProtectedRoute component loads
    ↓
useAuthGuard() checks authentication
    ↓
If authenticated → Show profile screen
If not authenticated → Redirect to /(auth)/login
```

### Authentication Check

Uses `authClient.getSession()` from better-auth to check if a valid session exists.

## Usage

### Protecting New Routes

1. Create route files in `app/(profile)/` (or another protected group)
2. The `_layout.tsx` in that group will automatically protect all routes

### In Screens

Access user data using the hook:

```typescript
import { useAuthUser } from "@/src/hooks";

export function MyScreen() {
  const { user, isLoading } = useAuthUser();

  if (isLoading) return <ActivityIndicator />;

  return <Text>Welcome, {user?.name}</Text>;
}
```

## Files Created/Modified

### Created

- `src/hooks/useAuthGuard.ts` - Authentication guard hook
- `src/hooks/useAuthUser.ts` - Get authenticated user hook
- `src/hooks/index.ts` - Hooks barrel export
- `src/components/ProtectedRoute.tsx` - Protected route wrapper
- `app/(profile)/_layout.tsx` - Profile routes layout with protection

### Configuration

- No additional configuration needed
- Uses existing `authClient` from `src/lib/auth-client.ts`
- Integrates with better-auth session management

## Error Handling

- If session check fails, redirects to login
- Shows loading state during authentication check
- Silently handles auth errors with console warning

## Future Enhancements

- Add role-based access control (RBAC)
- Add refresh token handling
- Add logout functionality to routes
- Add auth state context for app-wide access
