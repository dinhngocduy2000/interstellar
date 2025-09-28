"use client";
import React, { Fragment, RefObject, use, useEffect, useRef } from "react";
import MessageItem from "./message-item";
import { useGetConversationDetailQuery } from "@/lib/queries/conversation-query";
import { useGetConversationMessagesInfiniteQuery } from "@/lib/queries/conversation-message-query";
import NoDataComponent from "@/components/reusable/no-data-component";
import { cn, getErrorMessage } from "@/lib/utils";
import { AxiosErrorPayload, IPagination } from "@/lib/interfaces/utils";
import { MESSAGE_AUTHOR } from "@/lib/enum/message-author";
import { AxiosError } from "axios";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import LoadingSpinner from "@/components/reusable/loading-spinner";
import { LOCAL_STORAGE_KEY } from "@/lib/enum/storage-keys";
const ListMessageComponent = ({
  params,
  handleSendMessage,
  closeSSEConnection,
  isResponding,
  ref,
  isAllowingAutoScrollRef,
  isScrolledOnce,
}: {
  params: Promise<{ conversationID: string }>;
  handleSendMessage: (_message: string) => Promise<void>;
  closeSSEConnection: VoidFunction;
  isResponding: boolean;
  ref?: RefObject<HTMLDivElement | null>;
  isAllowingAutoScrollRef: RefObject<boolean>;
  isScrolledOnce: RefObject<boolean>;
}) => {
  const { conversationID } = use(params);
  const listMessagesRef = useRef<HTMLDivElement | null>(null);
  const conversationMessagesParams: IPagination & { conversationID: string } = {
    conversationID: conversationID,
    page: 1,
    limit: 10,
  };
  const { data: conversationDetail } = useGetConversationDetailQuery({
    queryKey: [],
    params: {
      conversationID: conversationID,
    },
    enabled: conversationID !== "private",
  });
  const {
    data: listMessagesData,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetConversationMessagesInfiniteQuery({
    queryKey: [],
    params: conversationMessagesParams,
    enabled: conversationDetail?.is_new === false,
  });

  const { loaderRef: topScrollRef } = useInfiniteScroll({
    onPageChange: () => {
      fetchNextPage();
    },
    hasMore: hasNextPage,
    isFetchingData: isFetchingNextPage,
  });

  useEffect(() => {
    if (conversationID === "private") {
      const privateMessage = localStorage.getItem(
        LOCAL_STORAGE_KEY.PRIVATE_MESSAGE,
      );
      if (!privateMessage) {
        return;
      }
      handleSendMessage(privateMessage);
    }
    if (conversationDetail?.is_new && conversationDetail) {
      handleSendMessage(conversationDetail.first_message);
    }
    return () => {
      closeSSEConnection();
    };
  }, [conversationDetail, conversationID]);

  useEffect(() => {
    if (!ref?.current) return;
    ref?.current?.scrollIntoView({ behavior: "instant" });
  }, [conversationID]);

  const onHandleScroll = () => {
    if (!listMessagesRef.current) return;
    if (!isResponding) {
      isAllowingAutoScrollRef.current = true;
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = listMessagesRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      isAllowingAutoScrollRef.current = true;
      return;
    }
    if (isScrolledOnce.current && scrollTop + clientHeight < scrollHeight - 1) {
      isAllowingAutoScrollRef.current = false;
    }
  };

  // if (isRefetching) {
  //   return (
  //     <div className="mt-6 h-full w-full flex flex-col gap-4 md:max-w-4xl max-w-full mx-auto">
  //       {Array.from({ length: 8 }).map((_, index) => (
  //         <Skeleton key={index} className="h-8 w-full" />
  //       ))}
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <NoDataComponent
        text={getErrorMessage(error as AxiosError<AxiosErrorPayload>)}
      />
    );
  }
  return (
    <div
      onScroll={onHandleScroll}
      ref={listMessagesRef}
      className="w-full flex-1 overflow-auto h-full flex flex-col-reverse md:max-w-4xl max-w-full mx-auto gap-4 px-4"
    >
      <div ref={ref} className={cn("min-h-2")} />
      {listMessagesData?.pages.map((page, index) => (
        <div className="flex flex-col gap-4" key={index}>
          <div
            ref={topScrollRef}
            className={cn("min-h-2 w-full flex justify-center py-2")}
          >
            {isFetchingNextPage && <LoadingSpinner />}
          </div>
          {page.data.map((message) => {
            return (
              <Fragment key={message.id}>
                {message.author === MESSAGE_AUTHOR.USER && (
                  <MessageItem
                    key={message.id}
                    message={message}
                    containerProps={{ className: "self-end" }}
                  />
                )}
                {message.author === MESSAGE_AUTHOR.BOT && (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isResponding={isResponding}
                    isLastMessage={
                      message.id === `new_message_${page.data.length}`
                    }
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ListMessageComponent;
