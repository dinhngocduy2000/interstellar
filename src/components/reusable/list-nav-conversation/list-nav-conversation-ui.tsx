import { AxiosError } from "axios";
import ConversationItemComponent from "@/components/reusable/list-nav-conversation/conversation-item";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarMenuSub } from "@/components/ui/sidebar";
import { Conversation } from "@/lib/interfaces/conversations";
import { AxiosErrorPayload } from "@/lib/interfaces/utils";
import { getErrorMessage } from "@/lib/utils";
import NoDataComponent from "../no-data-component";

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
