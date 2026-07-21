import { Platform } from 'react-native';
import { app } from "@/src/lib/eden-app";
import { authClient } from "@/src/lib/auth-client";
import { compressImage } from "@/src/utils/compress-image";

async function createWebFile(file: { uri: string; name: string; type: string }): Promise<File> {
  const response = await fetch(file.uri);
  const blob = await response.blob();
  return new File([blob], file.name, { type: file.type });
}

const API_URL = process.env.EXPO_PUBLIC_ENV_API_URL!;

async function nativeUpload(apiPath: string, file: { uri: string; name: string; type: string }): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file as unknown as Blob);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}${apiPath}`);

    const cookies = authClient.getCookie();
    if (cookies) {
      xhr.setRequestHeader('Cookie', cookies);
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText).data);
        } catch {
          reject(new Error('Invalid response from server'));
        }
      } else {
        try {
          reject(new Error(JSON.parse(xhr.responseText).message || 'Upload failed'));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export const profileService = {
  async getProfile() {
    const { data: response, error } = await app.api.me.get();

    if (error || !response) {
      throw new Error(error?.value?.message || "Failed to fetch profile");
    }
    return response.data;
  },

  async updateProfile(data: { name?: string; bio?: string | null }) {
    const { data: response, error } = await app.api.me.patch(data);

    if (error || !response) {
      throw new Error(error?.value?.message || "Failed to update profile");
    }
    return response.data;
  },

  async uploadAvatar(file: { uri: string; name: string; type: string }) {
    const compressed = await compressImage(file.uri);
    if (Platform.OS === 'web') {
      const nativeFile = await createWebFile(compressed);
      const { data: response, error } = await app.api.me.avatar.post({
        file: nativeFile,
      });
      if (error || !response)
        throw new Error(error?.value?.message || 'Failed to upload avatar');
      return response.data;
    }
    return nativeUpload('/api/me/avatar', compressed) as Promise<{
      avatarUrl: string;
      avatarThumb: string;
      avatarMed: string;
      avatarFull: string;
    }>;
  },
};
