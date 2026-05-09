import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { authClient } from "@/src/lib/auth-client";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";

export function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) return;
    setLoading(true);
    const { data, error } = await authClient.signIn.email({
      email: identifier,
      password: password,
    });
    console.log(data)
    console.log(error)
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message || "Failed to login");
      return;
    }

    router.replace("/");
  };

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

      <View className="items-end -mt-[4px]">
        <Link href="/forgot-password" asChild>
          <Pressable>
            <Text className="text-[#A7D92C] text-[13px] font-semibold">Forgot Password</Text>
          </Pressable>
        </Link>
      </View>

      <AuthButton
        label={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
    </AuthScreenShell>
  );
}