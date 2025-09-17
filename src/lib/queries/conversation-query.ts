import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Conversation,
  IConversationQuery,
  ICreateConversation,
} from "../interfaces/conversations";
import { IMutation, ReactQueryHookParams } from "../interfaces/utils";
import { CONVERSATIONS_ENDPOINTS } from "../enum/endpoints";
import { createConversation, getListConversations } from "../api/conversations";

type ICreateConversationMutation = Omit<IMutation, "onSuccess"> & {
  onSuccess?: (_res: Conversation, _data: ICreateConversation) => void;
};

export const useConversationListQuery = ({
  queryKey,
  params,
}: ReactQueryHookParams<IConversationQuery>) => {
  return useQuery({
    queryKey: [
      CONVERSATIONS_ENDPOINTS.LIST,
      { ...params, title: undefined },
      ...queryKey,
    ],
    queryFn: () => getListConversations(params),
  });
};

export const useCreateConversationQuery = ({
  onSuccess,
  onError,
  onMutate,
}: ICreateConversationMutation) =>
  useMutation({
    mutationFn: async (data: ICreateConversation) =>
      await createConversation(data),
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
