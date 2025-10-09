import { getQueryClient } from "@/lib/queries/query-client";
import HistoryHeaderComponent from "./(history-header)";
import ListConversationHistory from "./(list-history-conversations)";
import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { getListConversations } from "@/lib/api/conversations";
import React, { Suspense } from "react";

const HistoryPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.LIST],
    queryFn: () => getListConversations({ page: 1, limit: 20, title: "" }),
  });
  return (
    <div className="h-full md:w-4xl md:max-w-4xl max-h-full max-w-full mx-auto p-4 flex flex-col gap-4">
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
