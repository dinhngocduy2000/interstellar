"use client";
import React, { Fragment, use, useEffect, useRef, useState } from "react";
import MessageItem from "./message-item";
import { useGetConversationDetailQuery } from "@/lib/queries/conversation-query";
import { useGetConversationMessageQuery } from "@/lib/queries/conversation-message-query";
import NoDataComponent from "@/components/reusable/no-data-component";
import { getErrorMessage } from "@/lib/utils";
import {
  AxiosErrorPayload,
  IPagination,
  IResponseDataWithPagination,
} from "@/lib/interfaces/utils";
import { MESSAGE_AUTHOR } from "@/lib/enum/message-author";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { CHAT_ENDPOINTS, CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { Conversation } from "@/lib/interfaces/conversations";
import { IConversationMessage } from "@/lib/interfaces/message";

const ListMessageComponent = ({
  params,
}: {
  params: Promise<{ conversationID: string }>;
}) => {
  const { conversationID } = use(params);
  const queryClient = useQueryClient();
  const newMessageRef = useRef<string>("");
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isResponding, setIsResponding] = useState(false);
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
  const closeSSEConnection = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsResponding(false);
  };
  const handleSendMessage = async (message: string) => {
    if (eventSourceRef.current) {
      return;
    }
    setIsResponding(true);
    eventSourceRef.current = new EventSource(
      `http://localhost:3000/api/v1/chat/sse/${conversationID}?content=${message}`,
      {
        withCredentials: true,
      },
    );

    eventSourceRef.current.addEventListener("open", () => {
      const userMessage: IConversationMessage = {
        id: "new_user_message",
        author: MESSAGE_AUTHOR.USER,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_upvote: false,
        is_downvote: false,
        content: message,
        conversation_id: conversationID,
      };
      queryClient.setQueryData(
        [CHAT_ENDPOINTS.GET_MESSAGES, conversationMessagesParams],
        (
          oldData: IResponseDataWithPagination<IConversationMessage>,
        ): IResponseDataWithPagination<IConversationMessage> => ({
          ...oldData,
          data: [...oldData.data, userMessage],
        }),
      );
    });

    eventSourceRef.current.addEventListener("message", function (event) {
      // Use the setMessages function to update state
      const newMessage: IConversationMessage = {
        id: "new_message",
        author: MESSAGE_AUTHOR.BOT,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_upvote: false,
        is_downvote: false,
        content: newMessageRef.current + event.data,
        conversation_id: conversationID,
      };
      newMessageRef.current = newMessage.content;
      queryClient.setQueryData(
        [CHAT_ENDPOINTS.GET_MESSAGES, conversationMessagesParams],
        (
          oldData: IResponseDataWithPagination<IConversationMessage>,
        ): IResponseDataWithPagination<IConversationMessage> => {
          return {
            ...oldData,
            data:
              oldData.data[oldData.data.length - 1]?.id === "new_message"
                ? oldData.data.map((oldListsMessage) => {
                    if (oldListsMessage.id === "new_message") {
                      return newMessage;
                    }
                    return oldListsMessage;
                  })
                : [...oldData.data, newMessage],
          };
        },
      );
    });
    eventSourceRef.current.addEventListener("end", () => {
      newMessageRef.current = "";
      queryClient.invalidateQueries({
        queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, conversationMessagesParams],
      });

      queryClient.setQueryData(
        [CONVERSATIONS_ENDPOINTS.GET, conversationID],
        (oldData: Conversation): Conversation => ({
          ...oldData,
          is_new: false,
        }),
      );

      closeSSEConnection();
    });
  };

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
