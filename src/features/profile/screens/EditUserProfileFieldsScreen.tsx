import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EditFieldHeader } from '@/src/components/EditFieldHeader';
import { TextInputField } from '@/src/components/TextInputField';
import { MultilineInputField } from '@/src/components/MultilineInputField';
import { HelperCopy } from '@/src/components/HelperCopy';
import { PrimaryButton } from '@/src/components/PrimaryButton';

type EditMode = 'name' | 'bio' | 'password';

export function EditUserProfileFieldsScreen() {
  const router = useRouter();
  const [mode] = useState<EditMode>('name');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  if (mode === 'password') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.passwordContent}>
          <Text style={styles.passwordTitle}>Change Password</Text>
          <Text style={styles.passwordSubtitle}>Enter your current and new password</Text>
          <View style={styles.passwordFields}>
            <View>
              <Text style={styles.fieldLabel}>Current Password</Text>
              <View style={styles.passwordInputRow}>
                <TextInputField
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Current Password"
                  secureTextEntry={!showCurrentPw}
                  style={styles.passwordInput}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPw((v) => !v)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showCurrentPw ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9D9DA5"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.fieldLabel}>New Password</Text>
              <View style={styles.passwordInputRow}>
                <TextInputField
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New Password"
                  secureTextEntry={!showNewPw}
                  style={styles.passwordInput}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPw((v) => !v)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showNewPw ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9D9DA5"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.forgotRow} onPress={() => router.push('/forgot-password')}>
              <Text style={styles.forgotText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
          <PrimaryButton
            label="Change Password"
            onPress={() => {}}
            style={styles.passwordBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <EditFieldHeader
        title={mode === 'bio' ? 'Bio' : 'Your Name'}
        onBack={() => router.back()}
        onSave={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {mode === 'bio' ? (
          <MultilineInputField
            value={bio}
            onChangeText={setBio}
            placeholder="Bio"
          />
        ) : (
          <TextInputField
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />
        )}
        <HelperCopy
          lines={[
            mode === 'bio'
              ? 'Tell customers and colleagues a little about yourself.'
              : 'Enter your name, it will be shown in detail of barber & list of barber in barbershop booking website',
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F4E8',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  passwordContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 32,
  },
  passwordTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  passwordSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: -24,
  },
  passwordFields: {
    gap: 12,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  passwordInputRow: {
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  eyeBtn: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  forgotRow: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 13,
    color: '#C6ED3C',
    fontWeight: '600',
  },
  passwordBtn: {
    backgroundColor: '#C6ED3C',
  },
});
