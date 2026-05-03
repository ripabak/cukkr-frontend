import { authClient } from "@/src/lib/auth-client";
import { app } from "@/src/lib/eden-app";

export const barbersService = {
  async getList(search?: string) {
    const { data: response, error } = await app.api.barbers.get({ query: { search } });

    if (error || !response) {
      throw new Error("Failed to fetch barbers");
    }
    return response.data || [];
  },

  async inviteSingle(data: { email: string }) {
    const { data: response, error } = await authClient.organization.inviteMember({
      email: data.email,
      role: "member"
    })

    if (error || !response) {
      throw new Error("Failed to send invitation");
    }
    return response;
  },

  async cancelInvitation(invitationId: string) {
    const { data: response, error } = await (app.api.barbers.invite as any)[invitationId].delete();

    if (error || !response) {
      throw new Error("Failed to cancel invitation");
    }
    return response.data;
  },

  async removeMember(memberId: string) {
    const { data: response, error } = await (app.api.barbers as any)[memberId].delete();

    if (error || !response) {
      throw new Error("Failed to remove member");
    }
    return response.data;
  },

  async acceptInvitation(invitationId: string) {
    const { data: response, error } = await (app.api.barbers.invitations as any)[invitationId].accept.post({});

    if (error || !response) {
      throw new Error("Failed to accept invitation");
    }
    return response.data;
  },

  async declineInvitation(invitationId: string) {
    const { data: response, error } = await (app.api.barbers.invitations as any)[invitationId].decline.post({});

    if (error || !response) {
      throw new Error("Failed to decline invitation");
    }
    return response.data;
  },
};
