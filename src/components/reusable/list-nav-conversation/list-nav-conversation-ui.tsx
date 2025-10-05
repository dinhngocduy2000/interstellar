import ConversationItemComponent from "@/components/reusable/list-nav-conversation/conversation-item";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarMenuSub } from "@/components/ui/sidebar";
import { Conversation } from "@/lib/interfaces/conversations";
import React from "react";
import NoDataComponent from "../no-data-component";
import { getErrorMessage } from "@/lib/utils";
import { AxiosError } from "axios";
import { AxiosErrorPayload } from "@/lib/interfaces/utils";

type Props = {
  listConversation?: Conversation[];
  error: Error | null;
};

const ListNavConversationUI = ({ listConversation = [], error }: Props) => {
  if (error) {
    return (
      <NoDataComponent
        text={getErrorMessage(error as AxiosError<AxiosErrorPayload>)}
      />
    );
  }
  if (listConversation?.length === 0) {
    return <NoDataComponent />;
  }
  return (
    <CollapsibleContent>
      <SidebarMenuSub className="pr-0">
        {listConversation.map((conversation) => (
          <ConversationItemComponent
            conversation={conversation}
            key={conversation.id}
          />
        ))}
      </SidebarMenuSub>
    </CollapsibleContent>
  );
};

export default ListNavConversationUI;
