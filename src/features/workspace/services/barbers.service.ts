import { authClient } from "@/src/lib/auth-client";

export const barbersService = {
  async inviteSingle(data: { email: string }) {
    const { data: response, error } = await authClient.organization.inviteMember({
      email: data.email,
      role: "member",
    });
    if (error || !response) throw new Error("Failed to send invitation");
    return response;
  },

  async getInvitation(invitationId: string) {
    const { data: response, error } = await authClient.organization.getInvitation({
      query: { id: invitationId },
    });
    if (error || !response) throw new Error("Invitation not found");
    return response;
  },

  async acceptInvitation(invitationId: string) {
    const { data: response, error } = await authClient.organization.acceptInvitation({
      invitationId,
    });
    if (error || !response) throw new Error("Failed to accept invitation");
    return response;
  },

  async rejectInvitation(invitationId: string) {
    const { data: response, error } = await authClient.organization.rejectInvitation({
      invitationId,
    });
    if (error || !response) throw new Error("Failed to reject invitation");
    return response;
  },

};

