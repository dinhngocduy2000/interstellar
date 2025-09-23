import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { IPagination, ReactQueryHookParams } from "../interfaces/utils";
import { CHAT_ENDPOINTS } from "../enum/endpoints";
import { getConversationMessages } from "../api/chat";

export const useGetConversationMessageQuery = ({
  params,
  queryKey,
  enabled,
}: ReactQueryHookParams<IPagination & { conversationID: string }> & {
  enabled: boolean;
}) =>
  useQuery({
    queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, params, ...queryKey],
    queryFn: async ({ signal }) =>
      await getConversationMessages(params, signal),
    refetchOnWindowFocus: false,
    staleTime: 5000,
    enabled: enabled,
  });

export const useGetConversationMessagesInfiniteQuery = ({
  params,
  queryKey,
  enabled,
}: ReactQueryHookParams<IPagination & { conversationID: string }> & {
  enabled: boolean;
}) =>
  useInfiniteQuery({
    queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, ...queryKey],
    queryFn: async ({ signal, pageParam }) =>
      await getConversationMessages({ ...params, page: pageParam }, signal),
    getNextPageParam: (currentPageData, _, currentPageParams) => {
      return currentPageParams < Math.ceil(currentPageData.total / params.limit)
        ? currentPageParams + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    enabled: enabled,
  });
