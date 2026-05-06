import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services";

export const PROFILE_QUERY_KEYS = {
  all: ["profile"] as const,
  current: () => [...PROFILE_QUERY_KEYS.all, "current"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.current(),
    queryFn: () => profileService.getProfile(),
  });
}
