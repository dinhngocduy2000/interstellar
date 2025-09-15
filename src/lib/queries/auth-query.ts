import { useMutation } from "@tanstack/react-query";
import { IMutation } from "../interfaces/utils";
import { LoginForm, LoginResponse } from "../interfaces/auth";
import { loginAPI } from "../api/auth";
type ILoginMutation = Omit<IMutation, "onSuccess"> & {
  onSuccess: (_res: LoginResponse, _data: LoginForm) => void;
};
export const useLoginMutation = ({
  onSuccess,
  onError,
  onMutate,
  signal,
}: ILoginMutation) => {
  return useMutation({
    mutationFn: async (data: LoginForm) => {
      return await loginAPI({ ...data, saveSession: undefined }, signal);
    },
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      onError?.(error);
    },
    onMutate: () => {
      onMutate?.();
    },
  });
};
