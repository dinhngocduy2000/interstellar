"use client";
import { useConversationListQuery } from "@/lib/queries/conversation-query";

import ListNavConversationUI from "@/components/reusable/list-nav-conversation/list-nav-conversation-ui";

const ListConversationComponent = () => {
  const { data, error } = useConversationListQuery({
    params: {
      page: 1,
      limit: 10,
    },
    queryKey: [],
  });

  return <ListNavConversationUI listConversation={data?.data} error={error} />;
};

export default ListConversationComponent;
