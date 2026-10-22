import { useMutation } from "@tanstack/react-query";
import { authService } from "./index";
import type { ILoginPayload, IRegisterPayload } from "./types";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: ILoginPayload) => authService.login(payload),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: IRegisterPayload) => authService.register(payload),
  });
}
