import { app } from "@/src/lib/eden-app";

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

  async uploadAvatar(file: File) {
    const { data: response, error } = await app.api.me.avatar.post({ file });

    if (error || !response) {
      throw new Error(error?.value?.message || "Failed to upload avatar");
    }
    return response.data;
  },
};
