import { authClient } from "@/src/lib/auth-client";
import { app } from "@/src/lib/eden-app";

export const barbersService = {
  async getList(search?: string) {
    const { data: response, error } = await app.api.barbers.get({
      query: { search },
    });
    if (error || !response) throw new Error("Failed to fetch barbers");
    return response.data || [];
  },

  async inviteSingle(email: string) {
    const { data: response, error } = await authClient.organization.inviteMember({
      email,
      role: "member",
    });
    if (error || !response) throw new Error("Failed to send invitation");
    return response;
  },

  async cancelInvitation(invitationId: string) {
    const { data: response, error } = await authClient.organization.cancelInvitation({
      invitationId,
    });
    if (error || !response) throw new Error("Failed to cancel invitation");
    return response;
  },

  async removeMember(memberIdOrEmail: string) {
    const { data: response, error } = await authClient.organization.removeMember({
      memberIdOrEmail,
    });
    if (error || !response) throw new Error("Failed to remove barber");
    return response;
  },
};
