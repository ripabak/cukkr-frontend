import { EditFieldHeader } from '@/src/components/EditFieldHeader';
import { HelperCopy } from '@/src/components/HelperCopy';
import { MultilineInputField } from '@/src/components/MultilineInputField';
import { TextInputField } from '@/src/components/TextInputField';
import { useChangePassword } from '@/src/features/auth/hooks';
import { useToast } from '@/src/lib/providers/toast';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChangePhone, useProfile, useUpdateProfile } from '../hooks';
import { getErrorMessage } from '../utils/error-handler';
import { profileValidators } from '../utils/form-validators';

type EditMode = 'name' | 'bio' | 'password' | 'phone';

export function EditUserProfileFieldsScreen() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const rawMode = useGlobalSearchParams().mode;
  const modeStr = Array.isArray(rawMode) ? rawMode[0] : rawMode;
  const mode: EditMode = (modeStr as EditMode) ?? 'name';

  const { data: profile, isLoading } = useProfile();
  const { mutateAsync: updateProfile, isPending: savingProfile } = useUpdateProfile();
  const { mutateAsync: changePassword, isPending: changingPassword } = useChangePassword();
  const { mutateAsync: changePhone, isPending: changingPhone } = useChangePhone();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [nameError, setNameError] = useState('');
  const [bioError, setBioError] = useState('');

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [currentPwError, setCurrentPwError] = useState('');
  const [newPwError, setNewPwError] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSaveNameBio = async () => {
    const nameResult = profileValidators.validateName(name);
    const bioResult = profileValidators.validateBio(bio);

    setNameError(nameResult.isValid ? '' : nameResult.message);
    setBioError(bioResult.isValid ? '' : bioResult.message);

    if (!nameResult.isValid || !bioResult.isValid) return;

    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() || null });
      toast.success('Profile updated successfully');
      router.back();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSavePhone = async () => {
    const phoneResult = profileValidators.validatePhone(phone);
    setPhoneError(phoneResult.isValid ? '' : phoneResult.message);
    if (!phoneResult.isValid) return;

    try {
      await changePhone(phone.trim());
      router.push({
        pathname: '/verify-contact',
        params: { contact: phone.trim(), type: 'phone' },
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleChangePassword = async () => {
    const currentResult = profileValidators.validatePassword(currentPassword);
    const newResult = profileValidators.validatePassword(newPassword);

    setCurrentPwError(currentResult.isValid ? '' : currentResult.message);
    setNewPwError(newResult.isValid ? '' : newResult.message);

    if (!currentResult.isValid || !newResult.isValid) return;

    try {
      await changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      router.back();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A1A1A" />
        </View>
      </View>
    );
  }

  if (mode === 'password') {
    return (
      <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <EditFieldHeader title="Change Password" onBack={() => router.back()} onSave={handleChangePassword} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View>
            <Text style={styles.fieldLabel}>Current Password</Text>
            <View style={styles.passwordInputRow}>
              <TextInputField
                value={currentPassword}
                onChangeText={(text) => { setCurrentPassword(text); setCurrentPwError(''); }}
                placeholder="Current Password"
                secureTextEntry={!showCurrentPw}
                inputStyle={{ paddingRight: 40 }}
              />
              <TouchableOpacity onPress={() => setShowCurrentPw((v) => !v)} style={styles.eyeBtn}>
                <Ionicons name={showCurrentPw ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9D9DA5" />
              </TouchableOpacity>
            </View>
            {currentPwError ? <Text style={styles.errorText}>{currentPwError}</Text> : null}
          </View>
          <View>
            <Text style={styles.fieldLabel}>New Password</Text>
            <View style={styles.passwordInputRow}>
              <TextInputField
                value={newPassword}
                onChangeText={(text) => { setNewPassword(text); setNewPwError(''); }}
                placeholder="New Password"
                secureTextEntry={!showNewPw}
                inputStyle={{ paddingRight: 40 }}
              />
              <TouchableOpacity onPress={() => setShowNewPw((v) => !v)} style={styles.eyeBtn}>
                <Ionicons name={showNewPw ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9D9DA5" />
              </TouchableOpacity>
            </View>
            {newPwError ? <Text style={styles.errorText}>{newPwError}</Text> : null}
          </View>
          <TouchableOpacity style={styles.forgotRow} onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotText}>Forgot Password</Text>
          </TouchableOpacity>
          <HelperCopy lines={['Enter your current password, then set your new password.']} />
        </ScrollView>
        {changingPassword && (
          <View style={styles.savingOverlay}>
            <ActivityIndicator size="small" color="#1A1A1A" />
          </View>
        )}
      </View>
    );
  }

  if (mode === 'phone') {
    return (
      <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <EditFieldHeader title="Phone Number" onBack={() => router.back()} onSave={handleSavePhone} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TextInputField
            value={phone}
            onChangeText={(text) => { setPhone(text); setPhoneError(''); }}
            placeholder="+628xxxxxxxxxx"
            keyboardType="phone-pad"
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          <HelperCopy lines={['Enter your new phone number. We will send a verification code to confirm the change.']} />
        </ScrollView>
        {changingPhone && (
          <View style={styles.savingOverlay}>
            <ActivityIndicator size="small" color="#1A1A1A" />
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <EditFieldHeader
        title={mode === 'bio' ? 'Bio' : 'Your Name'}
        onBack={() => router.back()}
        onSave={handleSaveNameBio}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {mode === 'bio' ? (
          <>
            <MultilineInputField
              value={bio}
              onChangeText={(text) => { setBio(text); setBioError(''); }}
              placeholder="Bio"
            />
            {bioError ? <Text style={styles.errorText}>{bioError}</Text> : null}
          </>
        ) : (
          <>
            <TextInputField
              value={name}
              onChangeText={(text) => { setName(text); setNameError(''); }}
              placeholder="Your Name"
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </>
        )}
        <HelperCopy
          lines={[
            mode === 'bio'
              ? 'Tell customers and colleagues a little about yourself.'
              : 'Enter your name, it will be shown in detail of barber & list of barber in barbershop booking website',
          ]}
        />
      </ScrollView>
      {savingProfile && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="small" color="#1A1A1A" />
        </View>
      )}
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    opacity: 0.8,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  passwordInputRow: {
    position: 'relative',
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
  errorText: {
    fontSize: 12,
    color: '#EE6352',
    marginTop: 6,
  },
});
