import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authService.signUp(name, email, password),
  });
}
