import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronRight, Clock } from "lucide-react";
import React from "react";
import ListConversationComponent from "./list-conversation";
import { getQueryClient } from "@/lib/queries/query-client";
import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { IConversationQuery } from "@/lib/interfaces/conversations";
import { getListConversations } from "@/lib/api/conversations";
import Link from "next/link";
import { ROUTE_PATH } from "@/lib/enum/route-path";

const PreviousConversations = async () => {
  const conversationParams: IConversationQuery = { page: 1, limit: 10 };
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.LIST, conversationParams],
    queryFn: async () => await getListConversations(conversationParams),
  });
  return (
    <Collapsible asChild defaultOpen={true} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="hover:cursor-pointer">
            <Clock />
            <Link href={ROUTE_PATH.HISTORY}>History</Link>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ListConversationComponent />
        </HydrationBoundary>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default PreviousConversations;
