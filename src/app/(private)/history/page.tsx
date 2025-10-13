import React, { Suspense } from "react";
import { getListConversations } from "@/lib/api/conversations";
import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { getQueryClient } from "@/lib/queries/query-client";
import HistoryHeaderComponent from "./(history-header)";
import ListConversationHistory from "./(list-history-conversations)";

const HistoryPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.LIST],
    queryFn: () => getListConversations({ page: 1, limit: 20, title: "" }),
  });
  return (
    <div className="mx-auto flex h-full max-h-full w-full max-w-full flex-col gap-4 p-4 md:max-w-4xl">
      <Suspense>
        <HistoryHeaderComponent />
      </Suspense>
      <Suspense>
        <ListConversationHistory />
      </Suspense>
    </div>
  );
};

export default HistoryPage;
