import { Link } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DevNav() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cukkr Frontend - Navigation</Text>
        <Text style={styles.subtitle}>Choose a page to test:</Text>

        {/* Onboarding Pages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Onboarding Pages</Text>
          <Link href="/onboarding-splash" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Onboarding Splash</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/onboarding-easy-booking" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Easy Booking</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/onboarding-run-barbershop" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Run Barbershop</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/onboarding-customer-happy" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Customer Happy</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Home / Dashboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Home</Text>
          <Link href="/home-dashboard" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Home Dashboard</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Workspace Pages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workspace Pages</Text>
          <Link href="/switch-barbershop" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Switch Barbershop</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/create-barbershop-name-logo" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>
                Create Barbershop — Name & Logo
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href="/create-barbershop-invite-barber-empty" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Invite Barber (Empty)</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/create-barbershop-invite-barber-filled" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Invite Barber (Filled)</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/create-barbershop-first-service" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Create First Service</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/create-barbershop-success" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Create Barbershop — Success</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Barbershop Pages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Barbershop Pages</Text>
          <Link href="/barbershop-settings" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Barbershop Settings</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/edit-barbershop-info" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Edit Barbershop Info</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/edit-booking-url" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Edit Booking URL</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/barbers-management" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Barbers Management</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/invite-barber" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Invite Barber</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/services-management" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Services Management</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/service-detail" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Service Detail</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/add-or-edit-service" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Add / Edit Service</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/open-hours" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Open Hours</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Schedule & Booking Pages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule & Booking Pages</Text>
          <Link href="/schedule-active-bookings" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Schedule — Active Bookings</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/history-bookings" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>History Bookings</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/booking-detail-request" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Booking Detail — Request</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/booking-detail-waiting" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Booking Detail — Waiting</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/booking-detail-in-progress" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>
                Booking Detail — In Progress
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href="/booking-detail-result" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Booking Detail — Result</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/notifications-list" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Notifications</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Customer Management Pages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Management</Text>
          <Link href="/customer-management" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Customer Management</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/send-messages-to-customers" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Send Messages To Customers</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/customer-detail-general" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Customer Detail — General</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/customer-detail-books" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Customer Detail — Books</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/customer-detail-messages" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Customer Detail — Messages</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Admin Booking Creation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Booking Creation</Text>
          <Link href="/new-appointment" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>New Appointment</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/new-walk-in" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>New Walk-In</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/select-barber" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Select Barber</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/select-services" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Select Services</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* User Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Profile</Text>
          <Link href="/user-profile" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>User Profile</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/edit-user-profile-fields" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Edit Profile Fields</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/verify-contact" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Verify Contact</Text>
            </TouchableOpacity>
          </Link>
        </View>

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
