import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services";
import { PROFILE_QUERY_KEYS } from "./useProfileQuery";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; bio?: string | null }) =>
      profileService.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.current(), (old: any) => ({
        ...old,
        ...updatedProfile,
      }));
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.current() });
    },
  });
}

export function useChangePhone() {
  return useMutation({
    mutationFn: (phone: string) => profileService.changePhone(phone),
  });
}

export function useVerifyPhoneChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      profileService.verifyPhoneChange(phone, otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.current() });
    },
  });
}
