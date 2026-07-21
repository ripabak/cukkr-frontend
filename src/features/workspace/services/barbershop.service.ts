import { Platform } from 'react-native';
import { authClient } from "@/src/lib/auth-client";
import { app } from "@/src/lib/eden-app";

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

export const barbershopService = {
  async getList(query: string | undefined) {
    const { data: response, error } = await app.api.barbershop["list"].get({
      query: {},
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch barbershop list",
      );
    return response.data || [];
  },

  async checkSlugAvailability(slug: string) {
    const { data: response, error } = await app.api.barbershop[
      "slug-check"
    ].get({
      query: { slug },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to check slug availability",
      );
    return response.data?.available || false;
  },

  async uploadLogo(file: { uri: string; name: string; type: string }) {
    if (Platform.OS === 'web') {
      const nativeFile = await createWebFile(file);
      const { data: response, error } = await app.api.barbershop.logo.post({
        file: nativeFile,
      });
      if (error || !response)
        throw new Error(error?.value?.message || 'Failed to upload logo');
      return response.data;
    }
    return nativeUpload('/api/barbershop/logo', file) as Promise<{
      logoUrl: string;
    }>;
  },
};
