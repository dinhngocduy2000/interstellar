import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronRight, Pin } from "lucide-react";

import { getQueryClient } from "@/lib/queries/query-client";
import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { IConversationQuery } from "@/lib/interfaces/conversations";
import ListPinnedConversationComponent from "./list-pinned-conversations";
import { getConversations } from "@/lib/api/conversations/conversations";

const PinnedConversations = async () => {
  const conversationParams: IConversationQuery = { page: 1, limit: 10 };
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.PIN, conversationParams],
    queryFn: async () =>
      await getConversations().conversationControllerGetPinnedConversations(
        conversationParams,
      ),
  });

  return (
    <Collapsible asChild defaultOpen={false} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="hover:cursor-pointer">
            <Pin />
            Pinned
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ListPinnedConversationComponent />
        </HydrationBoundary>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default PinnedConversations;
