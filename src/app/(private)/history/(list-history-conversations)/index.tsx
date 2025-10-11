"use client";

import { useConversationListInfiniteQuery } from "@/lib/queries/conversation-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import HistoryConversationItem from "./(history-conversation-item)";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Virtuoso } from "react-virtuoso";
const ListConversationHistory = () => {
  const params = useSearchParams();
  const searchText = params.get("search") ?? "";
  const {
    data: listConversations,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isRefetching,
  } = useConversationListInfiniteQuery({
    queryKey: [],
    params: {
      page: 1,
      limit: 20,
      title: searchText,
    },
  });

  const flatConversations = useMemo(() => {
    return listConversations?.pages.flatMap((page) => page.data) ?? [];
  }, [listConversations]);

  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center h-full flex-col gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full h-full max-h-full overflow-auto pr-2">
      <Virtuoso
        data={flatConversations}
        style={{
          height: "100%",
          width: "100%",
        }}
        fixedItemHeight={40}
        endReached={() => {
          fetchNextPage();
        }}
        components={{
          Footer: () => (
            <div
              className={cn(
                "min-h-2 flex max-w-fit max-h-fit items-center gap-2 mx-auto py-2",
              )}
            >
              {isFetchingNextPage && (
                <>
                  <Spinner />
                  <p className="text-sm">Loading older conversations...</p>
                </>
              )}
            </div>
          ),
        }}
        itemContent={(_, conversation) => (
          <HistoryConversationItem
            key={conversation.id}
            conversation={conversation}
          />
        )}
      />
    </div>
  );
};

export default ListConversationHistory;
