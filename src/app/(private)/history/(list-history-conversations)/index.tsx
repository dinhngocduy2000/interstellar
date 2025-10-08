"use client";

import { useConversationListInfiniteQuery } from "@/lib/queries/conversation-query";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";
import HistoryConversationItem from "./(history-conversation-item)";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

const ListConversationHistory = () => {
  const params = useSearchParams();
  const searchText = params.get("search") ?? "";
  const {
    data: listConversations,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
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
  const { loaderRef: bottomScrollRef } = useInfiniteScroll({
    onPageChange: () => {
      fetchNextPage();
    },
    hasMore: hasNextPage,
    isFetchingData: isFetchingNextPage,
  });
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
    <div className="flex flex-col w-full max-h-full overflow-auto pr-2">
      {listConversations?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.data.map((conversation) => (
            <HistoryConversationItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </Fragment>
      ))}
      <div
        ref={bottomScrollRef}
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
    </div>
  );
};

export default ListConversationHistory;
