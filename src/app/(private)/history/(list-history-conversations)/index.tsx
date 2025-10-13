"use client";

import { ArrowUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useConversationListInfiniteQuery } from "@/lib/queries/conversation-query";
import { cn } from "@/lib/utils";
import HistoryConversationItem from "./(history-conversation-item)";

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
      <div className="flex h-full flex-col items-center gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  return (
    <div className="relative flex h-full w-full flex-col">
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
                "mx-auto flex h-2 max-h-fit max-w-fit items-center gap-2 py-2",
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
          className="-right-32 absolute bottom-0 size-12 rounded-full"
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
