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
          reject(new Error(JSON.parse(xhr.responseText).message || `Upload failed`));
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
  async getCurrent() {
    const { data: response, error } = await app.api.barbershop.get();
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch current barbershop",
      );
    return response.data;
  },

  async updateSettings(data: {
    name?: string;
    slug?: string;
    description?: string | null;
    address?: string | null;
    onboardingCompleted?: boolean;
  }) {
    const { data: response, error } =
      await app.api.barbershop.settings.patch(data);
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to update settings");
    return response.data;
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

  async leave(orgId: string) {
    const { data: response, error } = await authClient.organization.leave({
      organizationId: orgId,
    });
    if (error || !response) throw new Error("Failed to leave barbershop");
    return response;
  },

  async delete(orgId: string) {
    const { data: response, error } = await (
      authClient.organization as any
    ).delete({
      organizationId: orgId,
    });
    if (error || !response) throw new Error("Failed to delete barbershop");
    return response;
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
};
