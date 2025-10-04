"use client";
import NoDataComponent from "@/components/reusable/no-data-component";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarMenuSub } from "@/components/ui/sidebar";
import { AxiosErrorPayload } from "@/lib/interfaces/utils";
import { useConversationListQuery } from "@/lib/queries/conversation-query";
import { getErrorMessage } from "@/lib/utils";
import { AxiosError } from "axios";
import React from "react";
import ConversationItemComponent from "./conversation-item";

const ListConversationComponent = () => {
  const { data, error } = useConversationListQuery({
    params: {
      page: 1,
      limit: 10,
    },
    queryKey: [],
  });
  if (error) {
    return (
      <NoDataComponent
        text={getErrorMessage(error as AxiosError<AxiosErrorPayload>)}
      />
    );
  }
  if (data?.data?.length === 0) {
    return <NoDataComponent />;
  }
  return (
    <CollapsibleContent>
      <SidebarMenuSub className="pr-0">
        {data?.data.map((conversation) => (
          <ConversationItemComponent
            conversation={conversation}
            key={conversation.id}
          />
        ))}
      </SidebarMenuSub>
    </CollapsibleContent>
  );
};

export default ListConversationComponent;
