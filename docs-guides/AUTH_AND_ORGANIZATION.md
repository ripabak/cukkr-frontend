# Auth & Organization Setup Guide

## 📋 Overview

Auth dan Organization sudah di-setup dan siap digunakan. System menggunakan **better-auth** dengan plugins untuk OTP dan organization management.

## 🔧 Auth Setup

**File**: `@src/lib/auth-client.ts`

```tsx
import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.EXPO_PUBLIC_ENV_AUTH_URL,
    plugins: [
        expoClient({...}),
        emailOTPClient(),
        organizationClient()
    ]
});
```

### Available Plugins

✅ **expoClient** - Expo integration  
✅ **emailOTPClient** - Email OTP authentication  
✅ **organizationClient** - Organization management

## 🏢 Organization Implementation

### Setup Reference

File: `@src/lib/auth-client.ts` - Organization plugin sudah initialized

### Documentation

Full organization implementation guide:  
👉 https://better-auth.com/docs/plugins/organization#create-an-organization

### Quick Start

#### Create Organization

```tsx
import { authClient } from "@/src/lib/auth-client";

const createOrg = async (name: string, description?: string) => {
  const result = await authClient.organization.create({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description,
    metadata: {},
  });
  return result;
};
```

#### List Organizations

```tsx
const listOrgs = async () => {
  const { data } = await authClient.organization.list();
  return data;
};
```

#### Invite Member

```tsx
const inviteMember = async (orgId: string, email: string, role: string) => {
  const result = await authClient.organization.inviteMember({
    organizationId: orgId,
    email,
    role, // "admin", "member", etc
  });
  return result;
};
```

## 🔐 Auth Implementation

### Setup Reference

File: `@src/lib/auth-client.ts` - Auth client sudah initialized dengan plugins: expoClient, emailOtpClient, organizationClient

### Documentation

Full auth implementation guide:  
👉 https://better-auth.com/docs (main documentation)

### Actual Auth Flow

**Current Implementation** (@src/features/auth/):

- Email + Password untuk Login/Signup
- OTP untuk Email Verification (setelah signup)
- OTP untuk Password Reset Flow

### Quick Start

#### Sign Up (Email + Password)

```tsx
import { authClient } from "@/src/lib/auth-client";
import { Alert } from "react-native";

const handleSignUp = async (name: string, email: string, password: string) => {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
  });

  if (error) {
    Alert.alert("Error", error.message || "Failed to register");
    return;
  }

  // Send verification OTP ke email
  const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "email-verification",
  });

  if (sendError) {
    Alert.alert("Error", sendError.message || "Failed to send OTP");
    return;
  }

  // Navigate ke verify account screen dengan email param
  router.push({
    pathname: "/verify-account",
    params: { email },
  });
};
```

#### Sign In (Email + Password)

```tsx
const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
  });

  if (error) {
    Alert.alert("Error", error.message || "Failed to login");
    return;
  }

  router.replace("/");
};
```

#### Verify Email OTP

```tsx
const handleVerifyEmail = async (email: string, otp: string) => {
  const { error } = await authClient.emailOtp.verifyEmail({
    email,
    otp,
  });

  if (error) {
    Alert.alert("Error", error.message || "Failed to verify OTP");
    return;
  }

  router.replace("/");
};
```

#### Password Reset - Send OTP

```tsx
const handleForgotPassword = async (email: string) => {
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "forget-password",
  });

  if (error) {
    Alert.alert("Error", error.message || "Failed to send OTP");
    return;
  }

  // Navigate ke OTP verification screen
  router.push({
    pathname: "/verify-otp",
    params: { email, isPasswordReset: "true" },
  });
};
```

#### Password Reset - Verify OTP & Create New Password

```tsx
const handleResetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  // After OTP verified, user can create new password
  // Navigate ke create-password screen with email & otp params
};
```

#### Get Current User

```tsx
const getCurrentUser = async () => {
  const { data: user } = await authClient.getSession();
  return user;
};
```

#### Logout

```tsx
const logout = async () => {
  await authClient.signOut();
};
```

## 🎯 Common Patterns

### Pattern 1: Complete Sign Up Flow

```tsx
// src/features/auth/screens/RegisterScreen.tsx (existing)
export function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    // Step 1: Create account
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }

    // Step 2: Send verification OTP
    const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    setLoading(false);

    if (sendError) {
      Alert.alert("Error", sendError.message);
      return;
    }

    // Step 3: Navigate to OTP verification
    router.push({
      pathname: "/verify-account",
      params: { email },
    });
  };

  return (
    <AuthScreenShell>
      {/* Form fields */}
      <AuthButton
        onPress={handleRegister}
        label={loading ? "Creating..." : "Create Account"}
        disabled={loading}
      />
    </AuthScreenShell>
  );
}
```

### Pattern 2: Create Organization with Current User

```tsx
import { authClient } from "@/src/lib/auth-client";

export function CreateOrganization() {
  const [loading, setLoading] = useState(false);

  const handleCreate = async (name: string) => {
    setLoading(true);
    const { data, error } = await authClient.organization.create({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message || "Failed to create organization");
      return;
    }

    Alert.alert("Success", "Organization created!");
    return data;
  };

  return (
    <Button
      onPress={() => handleCreate("My Org")}
      disabled={loading}
      title={loading ? "Creating..." : "Create Organization"}
    />
  );
}
```

### Pattern 3: Invite Members to Organization

```tsx
export function InviteMembers() {
  const [loading, setLoading] = useState(false);

  const handleInvite = async (orgId: string, emails: string[]) => {
    setLoading(true);
    try {
      for (const email of emails) {
        const { error } = await authClient.organization.inviteMember({
          organizationId: orgId,
          email,
          role: "member",
        });

        if (error) {
          Alert.alert("Error", error.message || `Failed to invite ${email}`);
          return;
        }
      }
      Alert.alert("Success", `Invited ${emails.length} member(s)!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={() => handleInvite("org123", ["user@email.com"])}
      disabled={loading}
      title={loading ? "Inviting..." : "Invite Members"}
    />
  );
}
```

### Pattern 4: Password Reset Flow

```tsx
// Step 1: Send OTP
const handleForgotPassword = async (email: string) => {
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "forget-password",
  });

  if (error) {
    Alert.alert("Error", error.message);
    return;
  }

  router.push({
    pathname: "/verify-otp",
    params: { email, isPasswordReset: "true" },
  });
};

// Step 2: Verify OTP & set new password
const handleResetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  // Navigate ke create-password screen with otp & email
  router.push({
    pathname: "/create-password",
    params: { email, otp },
  });
};
```

## 📚 Reference Links

| Resource                | Link                                                                     |
| ----------------------- | ------------------------------------------------------------------------ |
| **Better Auth Docs**    | https://better-auth.com/docs                                             |
| **Organization Plugin** | https://better-auth.com/docs/plugins/organization                        |
| **Organization API**    | https://better-auth.com/docs/plugins/organization#create-an-organization |
| **Email OTP**           | https://better-auth.com/docs/plugins/email-otp                           |
| **Expo Client**         | https://better-auth.com/docs/client/expo                                 |

## 🔧 Configuration

### Environment Variables Required

```env
EXPO_PUBLIC_ENV_AUTH_URL=https://your-auth-server.com
```

### Plugins Configured

- ✅ Expo client with SecureStore
- ✅ Email OTP for authentication
- ✅ Organization management

## 🎯 Auth Screens Reference

Already Implemented in `@src/features/auth/screens/`:

- ✅ **LoginScreen** - Email + Password login
- ✅ **RegisterScreen** - Email + Password signup + OTP verification
- ✅ **VerifyAccountScreen** - Email OTP verification (post-signup)
- ✅ **VerifyOtpScreen** - OTP verification (password reset & account verification)
- ✅ **ForgotPasswordScreen** - Initiate password reset
- ✅ **CreatePasswordScreen** - Set new password after OTP verification

### When to Use Which Screen

- **LoginScreen**: User exists, wants to sign in
- **RegisterScreen**: New user, wants to create account
- **VerifyAccountScreen**: After signup, verify email with OTP
- **VerifyOtpScreen**: Verify OTP for password reset (isPasswordReset=true param)
- **ForgotPasswordScreen**: Initiate forgot password flow
- **CreatePasswordScreen**: Set new password (via email + otp params)

## 🎯 Organization Integration

1. **After Auth Success**
   - List user's organizations
   - Select default organization
   - Store organization context

2. **Organization Features**
   - Create new organization
   - Invite team members
   - Manage organization members
   - Switch between organizations

3. **In Other Features**
   - Use organization context to scope operations
   - Pass organizationId to workspace/feature APIs
   - Handle organization-level permissions

## ⚠️ Important Notes

- **SecureStore**: Tokens stored securely on device
- **OTP Flow**: Email OTP used for authentication
- **Organization**: Tied to user account
- **Plugins**: All 3 plugins are active by default

## 🚀 Best Practices

1. **Always handle errors** for auth operations

   ```tsx
   const { data, error } = await authClient.signIn.email({...});
   if (error) {
     Alert.alert("Error", error.message);
     return;
   }
   ```

2. **Use proper OTP types**
   - `email-verification` - After signup
   - `forget-password` - Password reset
   - `account-verification` - Account verification

3. **Handle token refresh** automatically via authClient (built-in)

4. **Validate inputs** before API calls
   - Check password match on signup
   - Validate OTP length (typically 4-6 digits)
   - Validate email format

5. **Navigate correctly after actions**
   - Use `router.replace()` for auth flows (replace history)
   - Use `router.push()` for navigation within flows
   - Pass email/otp as params to next screens

6. **Implement countdown timers** for OTP resend
   - Prevent spam
   - Guide user experience
   - Reset timer when new OTP sent

## 📋 Recommendation: Migrate to Global Toast

Current implementation uses `Alert.alert()`. Consider migrating to global toast system:

```tsx
import { useToast } from "@/src/lib/providers";

const toast = useToast();
// Instead of: Alert.alert("Error", error.message);
// Use: toast.error(error.message);
```

See: `docs-guides/TOAST_SETUP.md` for setup and examples.

---

**Last Updated**: May 2026  
**Status**: ✅ Setup Complete  
**Setup File**: `@src/lib/auth-client.ts`
