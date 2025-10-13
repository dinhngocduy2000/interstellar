"use client";

import ListNavConversationUI from "@/components/reusable/list-nav-conversation/list-nav-conversation-ui";
import { useGetPinnedConversationsQuery } from "@/lib/queries/conversation-query";

const ListPinnedConversationComponent = () => {
  const { data, error } = useGetPinnedConversationsQuery({
    params: {
      page: 1,
      limit: 10,
    },

    queryKey: [],
  });

  return <ListNavConversationUI listConversation={data?.data} error={error} />;
};

export default ListPinnedConversationComponent;
