import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Conversation } from "@/lib/interfaces/conversations";
import Link from "next/link";
import React from "react";

type Props = {
  conversation: Conversation;
};

const ConversationItemComponent = ({ conversation }: Props) => {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <Link href={conversation.id}>
          <span>{conversation.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};

export default ConversationItemComponent;
