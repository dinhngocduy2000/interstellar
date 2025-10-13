import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createConversation,
  getConversationDetail,
  getListConversations,
} from "../api/conversations";
import { getConversations } from "../api/conversations/conversations";
import { CONVERSATIONS_ENDPOINTS } from "../enum/endpoints";
import {
  Conversation,
  ConversationPinRequestDTO,
  IConversationQuery,
  ICreateConversation,
} from "../interfaces/conversations";
import { IMutation, ReactQueryHookParams } from "../interfaces/utils";

type ICreateConversationMutation = Omit<IMutation, "onSuccess"> & {
  onSuccess?: (_res: Conversation, _data: ICreateConversation) => void;
};

export const useConversationListQuery = ({
  queryKey,
  params,
  enabled,
}: ReactQueryHookParams<IConversationQuery> & {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.LIST, params, ...queryKey],
    queryFn: () => getListConversations(params),
    enabled: enabled,
  });
};

export const useConversationListInfiniteQuery = ({
  params,
  queryKey,
}: ReactQueryHookParams<IConversationQuery>) => {
  return useInfiniteQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.LIST, params, ...queryKey],
    queryFn: ({ signal, pageParam }) =>
      getListConversations({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (currentPageData, _, currentPageParams) => {
      return currentPageParams < Math.ceil(currentPageData.total / params.limit)
        ? currentPageParams + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    staleTime: 5000,
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
}: IMutation) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      conversationID: string;
      conversationPinRequestDTO: ConversationPinRequestDTO;
    }) =>
      await getConversations().conversationControllerPinConversation(
        params.conversationID,
        params.conversationPinRequestDTO,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          CONVERSATIONS_ENDPOINTS.PIN,
          {
            page: 1,
            limit: 10,
          },
        ],
      });
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

export const useGetPinnedConversationsQuery = ({
  queryKey,
  params,
  enabled,
}: ReactQueryHookParams<IConversationQuery> & {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.PIN, params, ...queryKey],
    queryFn: async ({ signal }) =>
      await getConversations().conversationControllerGetPinnedConversations(
        params,
        {
          signal: signal,
        },
      ),
    enabled: enabled,
  });
};
