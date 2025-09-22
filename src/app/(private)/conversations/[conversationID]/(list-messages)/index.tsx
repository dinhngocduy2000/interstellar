"use client";
import React, { Fragment, use, useEffect } from "react";
import MessageItem from "./message-item";
import { useGetConversationDetailQuery } from "@/lib/queries/conversation-query";
import { useGetConversationMessageQuery } from "@/lib/queries/conversation-message-query";
import NoDataComponent from "@/components/reusable/no-data-component";
import { getErrorMessage } from "@/lib/utils";
import { AxiosErrorPayload, IPagination } from "@/lib/interfaces/utils";
import { MESSAGE_AUTHOR } from "@/lib/enum/message-author";
import { AxiosError } from "axios";

const ListMessageComponent = ({
  params,
  handleSendMessage,
  closeSSEConnection,
  isResponding,
}: {
  params: Promise<{ conversationID: string }>;
  handleSendMessage: (_message: string) => Promise<void>;
  closeSSEConnection: VoidFunction;
  isResponding: boolean;
}) => {
  const { conversationID } = use(params);
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

  if (error) {
    return (
      <NoDataComponent
        text={getErrorMessage(error as AxiosError<AxiosErrorPayload>)}
      />
    );
  }

  return (
    <div className="w-full flex-1 overflow-auto h-full flex flex-col md:max-w-4xl max-w-full mx-auto gap-4 px-4">
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
    </div>
  );
};

export default ListMessageComponent;
