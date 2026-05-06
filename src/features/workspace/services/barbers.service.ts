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
};
