import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { Conversation } from "@/lib/interfaces/conversations";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  conversation: Conversation;
};

const ConversationItemComponent = ({ conversation }: Props) => {
  const pathname = usePathname();
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={pathname.includes(conversation.id)}
        asChild
      >
        <Link href={`${ROUTE_PATH.CONVERSATIONS}/${conversation.id}`}>
          <span>{conversation.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};

export default ConversationItemComponent;
