import { useMutation } from "@tanstack/react-query";
import { homeService } from "../services/home.service";

export function useGenerateWalkInPin() {
  return useMutation({
    mutationFn: () => homeService.generateWalkInPin(),
  });
}
