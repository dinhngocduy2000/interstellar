import { useQuery } from "@tanstack/react-query";
import { IConversationQuery } from "../interfaces/conversations";
import { ReactQueryHookParams } from "../interfaces/utils";
import { CONVERSATIONS_ENDPOINTS } from "../enum/endpoints";
import { getListConversations } from "../api/conversations";

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
