import { getConversationDetail } from "@/lib/api/conversations";
import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { getQueryClient } from "@/lib/queries/query-client";
import ConversationLayoutHeader from "./(conversation-layout-header)";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ConversationLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ conversationID: string }>;
}>) {
  const { conversationID } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.GET, conversationID],
    queryFn: ({ signal }) => getConversationDetail(conversationID, signal),
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ConversationLayoutHeader conversationID={conversationID} />
      </HydrationBoundary>
      {children}
    </>
  );
}
