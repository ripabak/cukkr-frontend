import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4E8' }}>
        <View className="flex-1 p-xxl justify-center gap-xxxl">
          <Text className="text-2xl font-bold text-dark text-center">Change Password</Text>
          <Text className="text-sm text-gray text-center -mt-xxl">Enter your current and new password</Text>
          <View className="gap-md">
            <View>
              <Text className="text-[13px] text-gray mb-[6px]">Current Password</Text>
              <View className="relative">
                <TextInputField
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Current Password"
                  secureTextEntry={!showCurrentPw}
                  style={{ flex: 1 }}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPw((v) => !v)}
                  className="absolute right-lg top-0 bottom-0 justify-center"
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
              <Text className="text-[13px] text-gray mb-[6px]">New Password</Text>
              <View className="relative">
                <TextInputField
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New Password"
                  secureTextEntry={!showNewPw}
                  style={{ flex: 1 }}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPw((v) => !v)}
                  className="absolute right-lg top-0 bottom-0 justify-center"
                >
                  <Ionicons
                    name={showNewPw ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9D9DA5"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity className="self-end" onPress={() => router.push('/forgot-password')}>
              <Text className="text-[13px] text-[#C6ED3C] font-semibold">Forgot Password</Text>
            </TouchableOpacity>
          </View>
          <PrimaryButton
            label="Change Password"
            onPress={() => {}}
            style={{ backgroundColor: '#C6ED3C' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4E8' }}>
      <EditFieldHeader
        title={mode === 'bio' ? 'Bio' : 'Your Name'}
        onBack={() => router.back()}
        onSave={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
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
