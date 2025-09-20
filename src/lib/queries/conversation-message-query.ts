import { useQuery } from "@tanstack/react-query";
import { IPagination, ReactQueryHookParams } from "../interfaces/utils";
import { CHAT_ENDPOINTS } from "../enum/endpoints";
import { getConversationMessages } from "../api/chat";

export const useGetConversationMessageQuery = ({
  params,
  queryKey,
}: ReactQueryHookParams<IPagination & { conversationID: string }>) =>
  useQuery({
    queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, params, ...queryKey],
    queryFn: async ({ signal }) =>
      await getConversationMessages(params, signal),
    refetchOnWindowFocus: false,
    staleTime: 5000,
  });
