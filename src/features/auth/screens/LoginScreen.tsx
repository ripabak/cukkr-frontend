import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { authTheme } from "../auth-theme";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";

export function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthScreenShell
      title="Login"
      description="Enter your email and password to securely access your account and manage your services."
      footer={<AuthFooterPrompt actionLabel="Sign Up here" href="/register" prompt="Don't have an account?" />}
    >
      <AuthTextField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email / Phone Number*"
        onChangeText={setIdentifier}
        placeholder="Email / Phone number*"
        value={identifier}
      />

      <AuthTextField
        label="Password"
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        secureToggle
        value={password}
      />

      <View style={styles.forgotPasswordRow}>
        <Link href="/forgot-password" asChild>
          <Pressable>
            <Text style={styles.forgotPasswordLink}>Forgot Password</Text>
          </Pressable>
        </Link>
      </View>

      <AuthButton label="Login" />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginTop: -4,
  },
  forgotPasswordLink: {
    color: authTheme.colors.mutedAccent,
    fontSize: 13,
    fontWeight: "600",
  },
});