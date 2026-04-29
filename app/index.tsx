import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cukkr Frontend - Navigation</Text>
        <Text style={styles.subtitle}>Choose a page to test:</Text>

        {/* Auth Pages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auth Pages</Text>
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/register" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/forgot-password" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Forgot Password</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/verify-otp" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/verify-account" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Verify Account</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/create-password" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Create Password</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Onboarding Pages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Onboarding Pages</Text>
          <Link href="/splash" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Onboarding - Splash</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/feature-1" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Onboarding - Feature 1</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/feature-2" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Onboarding - Feature 2</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/feature-3" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Onboarding - Feature 3</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  button: {
    backgroundColor: "#C6FF4D",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
});
