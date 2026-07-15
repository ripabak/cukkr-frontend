import { EditFieldHeader } from "@/src/components/EditFieldHeader";
import { HelperCopy } from "@/src/components/HelperCopy";
import { MultilineInputField } from "@/src/components/MultilineInputField";
import { TextInputField } from "@/src/components/TextInputField";
import { useChangePassword } from "@/src/features/auth/hooks";
import { useToast } from "@/src/lib/providers/toast";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfile, useUpdateProfile } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";
import { profileValidators } from "../utils/form-validators";

type EditMode = "name" | "bio" | "password";

export function EditUserProfileFieldsScreen() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const rawMode = useGlobalSearchParams().mode;
  const modeStr = Array.isArray(rawMode) ? rawMode[0] : rawMode;
  const mode: EditMode = (modeStr as EditMode) ?? "name";

  const { data: profile, isLoading } = useProfile();
  const { mutateAsync: updateProfile, isPending: savingProfile } =
    useUpdateProfile();
  const { mutateAsync: changePassword, isPending: changingPassword } =
    useChangePassword();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [nameError, setNameError] = useState("");
  const [bioError, setBioError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [currentPwError, setCurrentPwError] = useState("");
  const [newPwError, setNewPwError] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSaveNameBio = async () => {
    const nameResult = profileValidators.validateName(name);
    const bioResult = profileValidators.validateBio(bio);

    setNameError(nameResult.isValid ? "" : nameResult.message);
    setBioError(bioResult.isValid ? "" : bioResult.message);

    if (!nameResult.isValid || !bioResult.isValid) return;

    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() || null });
      toast.success("Profile updated successfully");
      router.back();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleChangePassword = async () => {
    const currentResult = profileValidators.validatePassword(currentPassword);
    const newResult = profileValidators.validatePassword(newPassword);

    setCurrentPwError(currentResult.isValid ? "" : currentResult.message);
    setNewPwError(newResult.isValid ? "" : newResult.message);

    if (!currentResult.isValid || !newResult.isValid) return;

    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully");
      router.back();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.safe,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.text.primary} />
        </View>
      </View>
    );
  }

  if (mode === "password") {
    return (
      <View
        style={[
          styles.safe,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <EditFieldHeader
          title="Change Password"
          onBack={() => router.back()}
          onSave={handleChangePassword}
        />
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <AppText style={styles.fieldLabel}>Current Password</AppText>
            <View style={styles.passwordInputRow}>
              <TextInputField
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setCurrentPwError("");
                }}
                placeholder="Current Password"
                secureTextEntry={!showCurrentPw}
                inputStyle={{ paddingRight: 40 }}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPw((v) => !v)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showCurrentPw ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.icon.muted}
                />
              </TouchableOpacity>
            </View>
            {currentPwError ? (
              <AppText style={styles.errorText}>{currentPwError}</AppText>
            ) : null}
          </View>
          <View>
            <AppText style={styles.fieldLabel}>New Password</AppText>
            <View style={styles.passwordInputRow}>
              <TextInputField
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setNewPwError("");
                }}
                placeholder="New Password"
                secureTextEntry={!showNewPw}
                inputStyle={{ paddingRight: 40 }}
              />
              <TouchableOpacity
                onPress={() => setShowNewPw((v) => !v)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showNewPw ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.icon.muted}
                />
              </TouchableOpacity>
            </View>
            {newPwError ? (
              <AppText style={styles.errorText}>{newPwError}</AppText>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.forgotRow}
            onPress={() => router.push("/d/forgot-password")}
          >
            <AppText style={styles.forgotText}>Forgot Password</AppText>
          </TouchableOpacity>
          <HelperCopy
            lines={["Enter your current password, then set your new password."]}
          />
        </ScrollView>
        {changingPassword && (
          <View style={styles.savingOverlay}>
            <ActivityIndicator size="small" color={Colors.text.primary} />
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.safe,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <EditFieldHeader
        title={mode === "bio" ? "Bio" : "Your Name"}
        onBack={() => router.back()}
        onSave={handleSaveNameBio}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {mode === "bio" ? (
          <>
            <MultilineInputField
              value={bio}
              onChangeText={(text) => {
                setBio(text);
                setBioError("");
              }}
              placeholder="Bio"
            />
            {bioError ? <AppText style={styles.errorText}>{bioError}</AppText> : null}
          </>
        ) : (
          <>
            <TextInputField
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameError("");
              }}
              placeholder="Your Name"
            />
            {nameError ? (
              <AppText style={styles.errorText}>{nameError}</AppText>
            ) : null}
          </>
        )}
        <HelperCopy
          lines={[
            mode === "bio"
              ? "Tell customers and colleagues a little about yourself."
              : "Enter your name, it will be shown in detail of barber & list of barber in barbershop booking website",
          ]}
        />
      </ScrollView>
      {savingProfile && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="small" color={Colors.text.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg.default,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  savingOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 12,
    backgroundColor: Colors.brand.primary,
    borderRadius: 8,
    opacity: 0.8,
  },
  fieldLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  passwordInputRow: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  forgotRow: {
    alignSelf: "flex-end",
  },
  forgotText: {
    fontSize: 13,
    color: Colors.brand.primary,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    color: Colors.status.danger,
    marginTop: 6,
  },
});
