import { useEffect, useRef, useState } from "react";
import { IConversationMessage } from "../interfaces/message";
import { MESSAGE_AUTHOR } from "../enum/message-author";
import { CHAT_ENDPOINTS, CONVERSATIONS_ENDPOINTS } from "../enum/endpoints";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { IPagination, IResponseDataWithPagination } from "../interfaces/utils";
import { Conversation } from "../interfaces/conversations";
import {
  addNewUserMessageData,
  updateNewBotReplyMessageData,
} from "../queries/conversation-message-query";
import { LOCAL_STORAGE_KEY } from "../enum/storage-keys";
type SendChatMessageSSEProps = {
  conversationID: string;

  conversationMessagesParams: IPagination & { conversationID: string };
};
export const useSendChatMessageSSE = ({
  conversationID,
}: SendChatMessageSSEProps) => {
  const newMessageRef = useRef<string>("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const isScrolledOnce = useRef<boolean>(false);
  const isAllowingAutoScroll = useRef<boolean>(true);
  const lastPageListMessageLengthRef = useRef<number>(0);
  const closeSSEConnection = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    lastPageListMessageLengthRef.current = 0;
    setIsResponding(false);
    newMessageRef.current = "";
  };

  const handleSendMessage = async (message: string) => {
    if (eventSourceRef.current) {
      return;
    }
    setIsResponding(true);
    eventSourceRef.current = new EventSource(
      `http://localhost:3000/api/v1/chat/sse/${conversationID}?content=${message}${conversationID === "private" ? "&isPrivate=true" : ""}`,
      {
        withCredentials: true,
      },
    );

    eventSourceRef.current.addEventListener("open", () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.PRIVATE_MESSAGE);
      lastMessageRef.current?.scrollIntoView({ behavior: "instant" });
      setTimeout(() => {
        isScrolledOnce.current = true;
      }, 500);
      const listMessageData:
        | InfiniteData<
            IResponseDataWithPagination<IConversationMessage>,
            unknown
          >
        | undefined = queryClient.getQueryData([
        CHAT_ENDPOINTS.GET_MESSAGES,
        conversationID,
      ]);
      lastPageListMessageLengthRef.current =
        listMessageData?.pages[listMessageData?.pages.length - 1]?.data
          ?.length ?? 0;
      const userMessage: IConversationMessage = {
        id: `new_user_message_${lastPageListMessageLengthRef.current + 1}`,
        author: MESSAGE_AUTHOR.USER,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_upvote: false,
        is_downvote: false,
        content: message,
        conversation_id: conversationID,
      };

      addNewUserMessageData({
        userMessage,
        queryClient,
        queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, conversationID],
      });
    });

    eventSourceRef.current.addEventListener("message", function (event) {
      // Use the setMessages function to update state
      const newMessage: IConversationMessage = {
        id: `new_message_${lastPageListMessageLengthRef.current + 2}`,
        author: MESSAGE_AUTHOR.BOT,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_upvote: false,
        is_downvote: false,
        content: newMessageRef.current + event.data,
        conversation_id: conversationID,
      };
      newMessageRef.current = newMessage.content;
      updateNewBotReplyMessageData({
        newMessage,
        queryClient,
        queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, conversationID],
        index: lastPageListMessageLengthRef.current + 2,
      });
      if (isAllowingAutoScroll.current) {
        lastMessageRef.current?.scrollIntoView({ behavior: "instant" });
      }
    });
    eventSourceRef.current.addEventListener("end", () => {
      newMessageRef.current = "";
      isScrolledOnce.current = false;
      closeSSEConnection();
      if (conversationID === "private") {
        return;
      }
      queryClient.invalidateQueries({
        queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, conversationID],
      });

      queryClient.setQueryData(
        [CONVERSATIONS_ENDPOINTS.GET, conversationID],
        (oldData: Conversation): Conversation => ({
          ...oldData,
          is_new: false,
        }),
      );
    });
  };

  useEffect(() => {
    return () => {
      if (conversationID === "private") {
        queryClient.resetQueries({
          queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, conversationID],
        });
      }
    };
  }, []);

  return {
    closeSSEConnection,
    handleSendMessage,
    eventSourceRef,
    isResponding,
    lastMessageRef,
    isAllowingAutoScroll,
    isScrolledOnce,
  };
};
