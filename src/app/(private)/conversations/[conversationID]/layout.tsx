import { getConversationDetail } from "@/lib/api/conversations";
import { CHAT_ENDPOINTS, CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { getQueryClient } from "@/lib/queries/query-client";
import ConversationLayoutHeader from "./(conversation-layout-header)";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  IPagination,
  IResponseDataWithPagination,
} from "@/lib/interfaces/utils";
import { getConversationMessages } from "@/lib/api/chat";
import { IConversationMessage } from "@/lib/interfaces/message";

export default async function ConversationLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ conversationID: string }>;
}>) {
  const { conversationID } = await params;
  const queryClient = getQueryClient();
  const conversationMessagesParams: IPagination & { conversationID: string } = {
    conversationID: conversationID,
    page: 1,
    limit: 10,
  };
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: [CONVERSATIONS_ENDPOINTS.GET, conversationID],
      queryFn: ({ signal }) => getConversationDetail(conversationID, signal),
      staleTime: 5000,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [CHAT_ENDPOINTS.GET_MESSAGES],
      queryFn: async ({ signal }) =>
        await getConversationMessages(conversationMessagesParams, signal),
      staleTime: 5000,
      getNextPageParam: (
        currentPageData: IResponseDataWithPagination<IConversationMessage>,
        _param: unknown,
        currentPageParams: number,
      ) => {
        return currentPageParams <
          Math.ceil(currentPageData.total / conversationMessagesParams.limit)
          ? currentPageParams + 1
          : undefined;
      },
      initialPageParam: 1,
    }),
  ]);
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ConversationLayoutHeader conversationID={conversationID} />
      </HydrationBoundary>
      {children}
    </>
  );
}
