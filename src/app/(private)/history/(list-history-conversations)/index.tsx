"use client";

import { useConversationListInfiniteQuery } from "@/lib/queries/conversation-query";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";
import HistoryConversationItem from "./(history-conversation-item)";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const ListConversationHistory = () => {
  const params = useSearchParams();
  const searchText = params.get("search") ?? "";
  const {
    data: listConversations,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
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
  return (
    <div className="flex flex-col w-full max-h-full overflow-auto">
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
