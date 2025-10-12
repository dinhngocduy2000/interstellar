"use client";

import { useConversationListInfiniteQuery } from "@/lib/queries/conversation-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import HistoryConversationItem from "./(history-conversation-item)";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
const ListConversationHistory = () => {
  const params = useSearchParams();
  const searchText = params.get("search") ?? "";
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const {
    data: listConversations,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    isFetchedAfterMount,
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

  const handleScrollToTop = () => {
    virtuosoRef.current?.scrollToIndex({
      index: 0,
      behavior: "smooth",
    });
  };

  if (isFetching && !isFetchedAfterMount) {
    return (
      <div className="flex items-center h-full flex-col gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full h-full relative">
      <Virtuoso
        ref={virtuosoRef}
        data={flatConversations}
        className="!h-full !w-full !pr-2"
        atTopStateChange={setIsAtTop}
        endReached={() => {
          fetchNextPage();
        }}
        components={{
          Footer: () => (
            <div
              className={cn(
                "h-2 flex max-w-fit max-h-fit items-center gap-2 mx-auto py-2",
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
      {!isAtTop && (
        <Button
          className="absolute bottom-0 -right-32 rounded-full size-12"
          variant={"default"}
          onClick={handleScrollToTop}
        >
          <ArrowUp />
        </Button>
      )}
    </div>
  );
};

export default ListConversationHistory;
