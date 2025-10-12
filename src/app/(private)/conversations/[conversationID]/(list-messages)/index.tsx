"use client";
import React, {
  Fragment,
  RefObject,
  use,
  useEffect,
  useMemo,
  useRef,
} from "react";
import MessageItem from "./(message-item)/message-item";
import { useGetConversationDetailQuery } from "@/lib/queries/conversation-query";
import { useGetConversationMessagesInfiniteQuery } from "@/lib/queries/conversation-message-query";
import NoDataComponent from "@/components/reusable/no-data-component";
import { cn, getErrorMessage } from "@/lib/utils";
import { AxiosErrorPayload, IPagination } from "@/lib/interfaces/utils";
import { MESSAGE_AUTHOR } from "@/lib/enum/message-author";
import { AxiosError } from "axios";
import LoadingSpinner from "@/components/reusable/loading-spinner";
import { LOCAL_STORAGE_KEY } from "@/lib/enum/storage-keys";
import { Skeleton } from "@/components/ui/skeleton";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
const ListMessageComponent = ({
  params,
  handleSendMessage,
  closeSSEConnection,
  isResponding,
  isAllowingAutoScrollRef,
  virtuosoRef,
}: {
  params: Promise<{ conversationID: string }>;
  handleSendMessage: (_message: string) => Promise<void>;
  closeSSEConnection: VoidFunction;
  isResponding: boolean;
  isAllowingAutoScrollRef: RefObject<boolean>;
  virtuosoRef: React.RefObject<VirtuosoHandle | null>;
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
    isFetching,
    isFetchedAfterMount,
    hasNextPage,
  } = useGetConversationMessagesInfiniteQuery({
    queryKey: [],
    params: conversationMessagesParams,
    enabled: conversationDetail?.is_new === false,
  });

  const listMessages = useMemo(
    () => listMessagesData?.pages.flatMap((page) => page.data),
    [listMessagesData],
  );

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
    virtuosoRef.current?.scrollToIndex({
      index: "LAST",
      behavior: "auto",
      offset: 1000,
    });
  }, [isFetchedAfterMount]);

  const onHandleScroll = (isAtBottom: boolean) => {
    if (!listMessagesRef.current) return;
    if (!isResponding) {
      isAllowingAutoScrollRef.current = true;
      return;
    }
    isAllowingAutoScrollRef.current = isAtBottom;
  };

  const onFetchPreviousMessages = (atTop: boolean) => {
    if (!atTop || !hasNextPage || !isFetchedAfterMount) return;
    fetchNextPage();
  };

  if (isFetching && !isFetchedAfterMount) {
    return (
      <div className="mt-6 h-full w-full flex flex-col gap-4 md:max-w-4xl max-w-full mx-auto">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <NoDataComponent
        text={getErrorMessage(error as AxiosError<AxiosErrorPayload>)}
      />
    );
  }
  return (
    <div
      ref={listMessagesRef}
      className="w-full flex-1 overflow-auto h-full flex flex-col-reverse md:max-w-4xl max-w-full mx-auto gap-4"
    >
      <Virtuoso
        data={listMessages}
        ref={virtuosoRef}
        atBottomStateChange={onHandleScroll}
        atBottomThreshold={15}
        className="!h-full !w-full !pr-2 !flex !flex-col"
        components={{
          Header: () => (
            <div className={cn("min-h-4 w-full flex justify-center py-2")}>
              {isFetchingNextPage && <LoadingSpinner />}
            </div>
          ),
        }}
        atTopStateChange={onFetchPreviousMessages}
        itemContent={(_, message) => (
          <Fragment key={message.id}>
            {message.author === MESSAGE_AUTHOR.USER && (
              <MessageItem
                key={message.id}
                message={message}
                containerProps={{ className: "ml-auto mb-4 mr-2" }}
              />
            )}
            {message.author === MESSAGE_AUTHOR.BOT && (
              <MessageItem
                key={message.id}
                message={message}
                isResponding={isResponding}
                isLastMessage={
                  message.id === `new_message_${listMessages?.length}`
                }
              />
            )}
          </Fragment>
        )}
      />
    </div>
  );
};

export default ListMessageComponent;
