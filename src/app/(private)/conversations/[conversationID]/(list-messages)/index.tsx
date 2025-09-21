"use client";
import React, { Fragment, use, useEffect, useRef } from "react";
import MessageItem from "./message-item";
import { useGetConversationDetailQuery } from "@/lib/queries/conversation-query";
import { useGetConversationMessageQuery } from "@/lib/queries/conversation-message-query";
import NoDataComponent from "@/components/reusable/no-data-component";
import { getErrorMessage } from "@/lib/utils";
import { AxiosErrorPayload } from "@/lib/interfaces/utils";
import { MESSAGE_AUTHOR } from "@/lib/enum/message-author";
import { AxiosError } from "axios";

const ListMessageComponent = ({
  params,
}: {
  params: Promise<{ conversationID: string }>;
}) => {
  const { conversationID } = use(params);
  const { data: conversationDetail } = useGetConversationDetailQuery({
    queryKey: [],
    params: {
      conversationID: conversationID,
    },
  });
  const { data: listMessagesData, error } = useGetConversationMessageQuery({
    queryKey: [],
    params: {
      page: 1,
      limit: 10,
      conversationID: conversationID,
    },
  });
  const eventSourceRef = useRef<EventSource | null>(null);
  const isNewConversation = conversationDetail?.is_new;
  const closeSSEConnection = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  };
  const handleSendMessage = async (message: string) => {
    eventSourceRef.current = new EventSource(
      `http://localhost:3000/api/v1/chat/sse/${conversationID}?content=${message}`,
      {
        withCredentials: true,
      },
    );
    eventSourceRef.current.addEventListener("message", function (event) {
      // Use the setMessages function to update state
      console.log(event.data);
    });
    eventSourceRef.current.addEventListener("end", () => {
      closeSSEConnection();
    });
  };
  useEffect(() => {
    if (isNewConversation) {
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

  if (listMessagesData?.data.length === 0) {
    return <NoDataComponent />;
  }

  return (
    <div className="w-full flex-1 overflow-auto h-full flex flex-col md:max-w-4xl max-w-full mx-auto gap-4 px-4">
      {listMessagesData?.data.map((message) => (
        <Fragment key={message.id}>
          {message.author === MESSAGE_AUTHOR.USER && (
            <MessageItem
              content={message.content}
              containerProps={{ className: "self-end" }}
            />
          )}
          {message.author === MESSAGE_AUTHOR.BOT && (
            <MessageItem content={message.content} />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default ListMessageComponent;
