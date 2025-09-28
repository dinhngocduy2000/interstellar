import { getConversationDetail } from "@/lib/api/conversations";
import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { getQueryClient } from "@/lib/queries/query-client";
import ConversationLayoutHeader from "./(conversation-layout-header)";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function ConversationLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ conversationID: string }>;
}>) {
  const { conversationID } = await params;
  const queryClient = getQueryClient();
  // const conversationMessagesParams: IPagination & { conversationID: string } = {
  //   conversationID: conversationID,
  //   page: 1,
  //   limit: 10,
  // };
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: [CONVERSATIONS_ENDPOINTS.GET, conversationID],
      queryFn: ({ signal }) => getConversationDetail(conversationID, signal),
      staleTime: 5000,
    }),
    // queryClient.prefetchInfiniteQuery({
    //   queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, conversationID],
    //   queryFn: async ({ signal }) =>
    //     await getConversationMessages(conversationMessagesParams, signal),
    //   staleTime: 5000,
    //   getNextPageParam: (
    //     currentPageData: IResponseDataWithPagination<IConversationMessage>,
    //     _param: unknown,
    //     currentPageParams: number
    //   ) => {
    //     return currentPageParams <
    //       Math.ceil(currentPageData.total / conversationMessagesParams.limit)
    //       ? currentPageParams + 1
    //       : undefined;
    //   },
    //   initialPageParam: 1,
    // }),
  ]);
  return (
    <Suspense
      fallback={<div className="h-screen w-full bg-red-400">Loading...</div>}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ConversationLayoutHeader conversationID={conversationID} />
      </HydrationBoundary>

      {children}
    </Suspense>
  );
}
