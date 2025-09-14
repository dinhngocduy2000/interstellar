import { useMutation } from "@tanstack/react-query";
import { IMutation } from "../interfaces/utils";
import { LoginForm } from "../interfaces/auth";
import { loginAPI } from "../api/auth";

export const useLoginMutation = ({
  onSuccess,
  onError,
  onMutate,
  signal,
}: IMutation) => {
  return useMutation({
    mutationFn: async (data: LoginForm) => {
      return await loginAPI(data, signal);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
    onMutate: () => {
      onMutate?.();
    },
  });
};
