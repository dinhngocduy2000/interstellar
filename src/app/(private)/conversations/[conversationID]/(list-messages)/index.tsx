"use client";
import React, { Fragment, RefObject, use, useEffect, useRef } from "react";
import MessageItem from "./message-item";
import { useGetConversationDetailQuery } from "@/lib/queries/conversation-query";
import { useGetConversationMessageQuery } from "@/lib/queries/conversation-message-query";
import NoDataComponent from "@/components/reusable/no-data-component";
import { cn, getErrorMessage } from "@/lib/utils";
import { AxiosErrorPayload, IPagination } from "@/lib/interfaces/utils";
import { MESSAGE_AUTHOR } from "@/lib/enum/message-author";
import { AxiosError } from "axios";
const ListMessageComponent = ({
  params,
  handleSendMessage,
  closeSSEConnection,
  isResponding,
  ref,
  isAllowingAutoScrollRef,
}: {
  params: Promise<{ conversationID: string }>;
  handleSendMessage: (_message: string) => Promise<void>;
  closeSSEConnection: VoidFunction;
  isResponding: boolean;
  ref?: RefObject<HTMLDivElement | null>;
  isAllowingAutoScrollRef: RefObject<boolean>;
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
  });
  const { data: listMessagesData, error } = useGetConversationMessageQuery({
    queryKey: [],
    params: conversationMessagesParams,
    enabled: conversationDetail?.is_new === false,
  });

  useEffect(() => {
    if (conversationDetail?.is_new && conversationDetail) {
      handleSendMessage(conversationDetail.first_message);
    }
    return () => {
      closeSSEConnection();
    };
  }, [conversationDetail]);

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

    isAllowingAutoScrollRef.current = false;
  };

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
      className="w-full flex-1 overflow-auto h-full flex flex-col md:max-w-4xl max-w-full mx-auto gap-4 px-4"
    >
      {listMessagesData?.data.map((message) => (
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
            />
          )}
        </Fragment>
      ))}
      <div ref={ref} className={cn(isResponding && "min-h-14")}></div>
    </div>
  );
};

export default ListMessageComponent;
