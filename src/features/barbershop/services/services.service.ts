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

type SortOption =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "recent";

export const servicesService = {
  async getList(options?: {
    search?: string;
    sort?: SortOption;
    activeOnly?: boolean;
  }) {
    const { data: response, error } = await app.api.services.get({
      query: options,
    });
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch services");
    return response.data || [];
  },

  async getById(id: string) {
    const { data: response, error } = await app.api.services({ id }).get();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch service");
    return response.data;
  },

  async create(data: {
    name: string;
    price: number;
    duration: number;
    description?: string | null;
    discount?: number;
    isActive?: boolean;
  }) {
    const { data: response, error } = await app.api.services.post(data);
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to create service");
    return response.data;
  },

  async update(
    id: string,
    data: {
      name?: string;
      price?: number;
      duration?: number;
      description?: string | null;
      discount?: number;
    },
  ) {
    const { data: response, error } = await app.api
      .services({ id })
      .patch(data);
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to update service");
    return response.data;
  },

  async delete(id: string) {
    const { data: response, error } = await app.api.services({ id }).delete();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to delete service");
    return response.data;
  },

  async toggleActive(id: string) {
    const { data: response, error } = await app.api
      .services({ id })
      ["toggle-active"].patch({});
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to toggle service");
    return response.data;
  },

  async setDefault(id: string) {
    const { data: response, error } = await app.api
      .services({ id })
      ["set-default"].patch({});
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to set default service");
    return response.data;
  },

  async uploadImage(
    serviceId: string,
    file: { uri: string; name: string; type: string },
  ) {
    const compressed = await compressImage(file.uri);
    if (Platform.OS === 'web') {
      const nativeFile = await createWebFile(compressed);
      const { data: response, error } = await app.api
        .services({ id: serviceId })
        .image.post({ file: nativeFile });
      if (error || !response)
        throw new Error(error?.value?.message || 'Failed to upload service image');
      return response.data;
    }
    return nativeUpload(`/api/services/${serviceId}/image`, compressed) as Promise<{
      imageUrl: string;
      imageThumb: string;
      imageMed: string;
      imageFull: string;
    }>;
  },
};
