"use client";
import { useGetPinnedConversationsQuery } from "@/lib/queries/conversation-query";
import React from "react";
import ListNavConversationUI from "@/components/reusable/list-nav-conversation/list-nav-conversation-ui";

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
