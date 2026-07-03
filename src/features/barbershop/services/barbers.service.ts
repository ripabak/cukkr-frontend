import { authClient } from "@/src/lib/auth-client";

export const barbersService = {
  async getListMember(search?: string) {
    const { data: response, error } = await authClient.organization.listMembers(
      {
        query: { filterValue: search },
      },
    );
    if (error || !response) throw new Error("Failed to fetch barbers");
    return response.members ?? [];
  },

  async getListInvitation() {
    const { data: response, error } =
      await authClient.organization.listInvitations();
    if (error || !response) throw new Error("Failed to fetch invitations");
    return response || [];
  },

  async inviteSingle(email: string) {
    const { data: response, error } =
      await authClient.organization.inviteMember({
        email,
        role: "member",
      });
    if (error || !response) throw new Error("Failed to send invitation");
    return response;
  },

  async cancelInvitation(invitationId: string) {
    const { data: response, error } =
      await authClient.organization.cancelInvitation({
        invitationId,
      });
    if (error || !response) throw new Error("Failed to cancel invitation");
    return response;
  },

  async removeMember(memberIdOrEmail: string) {
    const { data: response, error } =
      await authClient.organization.removeMember({
        memberIdOrEmail,
      });
    if (error || !response) throw new Error("Failed to remove barber");
    return response;
  },

  async updateMemberRole(memberId: string, role: "admin" | "member") {
    const { data: response, error } =
      await authClient.organization.updateMemberRole({
        memberId,
        role,
      });
    if (error || !response) throw new Error("Failed to update member role");
    return response;
  },
};
