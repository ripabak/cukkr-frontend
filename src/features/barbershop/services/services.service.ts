import { app } from "@/src/lib/eden-app";

type SortOption = "name_asc" | "name_desc" | "price_asc" | "price_desc" | "recent";

export const servicesService = {
  async getList(options?: { search?: string; sort?: SortOption; activeOnly?: boolean }) {
    const { data: response, error } = await app.api.services.get({ query: options });
    if (error || !response) throw new Error(error?.value?.message || "Failed to fetch services");
    return response.data || [];
  },

  async getById(id: string) {
    const { data: response, error } = await app.api.services({ id }).get();
    if (error || !response) throw new Error(error?.value?.message || "Failed to fetch service");
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
    if (error || !response) throw new Error(error?.value?.message || "Failed to create service");
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
    const { data: response, error } = await app.api.services({ id }).patch(data);
    if (error || !response) throw new Error(error?.value?.message || "Failed to update service");
    return response.data;
  },

  async delete(id: string) {
    const { data: response, error } = await app.api.services({ id }).delete();
    if (error || !response) throw new Error(error?.value?.message || "Failed to delete service");
    return response.data;
  },

  async toggleActive(id: string) {
    const { data: response, error } = await app.api.services({ id })["toggle-active"].patch({});
    if (error || !response) throw new Error(error?.value?.message || "Failed to toggle service");
    return response.data;
  },

  async setDefault(id: string) {
    const { data: response, error } = await app.api.services({ id })["set-default"].patch({});
    if (error || !response) throw new Error(error?.value?.message || "Failed to set default service");
    return response.data;
  },
};
