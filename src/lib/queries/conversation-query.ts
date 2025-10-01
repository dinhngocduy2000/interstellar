import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Conversation,
  ConversationPinRequestDTO,
  IConversationQuery,
  ICreateConversation,
} from "../interfaces/conversations";
import { IMutation, ReactQueryHookParams } from "../interfaces/utils";
import { CONVERSATIONS_ENDPOINTS } from "../enum/endpoints";
import {
  createConversation,
  getConversationDetail,
  getListConversations,
} from "../api/conversations";
import { getConversations } from "../api/conversations/conversations";

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

export const useGetConversationDetailQuery = ({
  queryKey,
  params,
  enabled,
}: ReactQueryHookParams<{ conversationID: string }> & {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.GET, params.conversationID, ...queryKey],
    queryFn: async ({ signal }) =>
      await getConversationDetail(params.conversationID, signal),
    refetchOnWindowFocus: false,
    staleTime: 5000,
    enabled: enabled,
  });
};

export const useDeleteConversationQuery = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation) =>
  useMutation({
    mutationFn: async (conversationID: string) =>
      await getConversations().conversationControllerDeleteConversation(
        conversationID,
      ),
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

export const usePinConversationMutation = ({
  onSuccess,
  onError,
  onMutate,
}: IMutation) =>
  useMutation({
    mutationFn: async (params: {
      conversationID: string;
      conversationPinRequestDTO: ConversationPinRequestDTO;
    }) =>
      await getConversations().conversationControllerPinConversation(
        params.conversationID,
        params.conversationPinRequestDTO,
      ),
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
