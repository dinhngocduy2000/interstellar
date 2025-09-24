import { useRef, useState } from "react";
import { IConversationMessage } from "../interfaces/message";
import { MESSAGE_AUTHOR } from "../enum/message-author";
import { CHAT_ENDPOINTS, CONVERSATIONS_ENDPOINTS } from "../enum/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { IPagination } from "../interfaces/utils";
import { Conversation } from "../interfaces/conversations";
import {
  addNewUserMessageData,
  updateNewBotReplyMessageData,
} from "../queries/conversation-message-query";
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
      lastMessageRef.current?.scrollIntoView({ behavior: "instant" });
      setTimeout(() => {
        isScrolledOnce.current = true;
      }, 500);
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
      addNewUserMessageData({
        userMessage,
        queryClient,
        queryKey: [CHAT_ENDPOINTS.GET_MESSAGES],
      });
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
      updateNewBotReplyMessageData({
        newMessage,
        queryClient,
        queryKey: [CHAT_ENDPOINTS.GET_MESSAGES],
      });
      if (isAllowingAutoScroll.current) {
        lastMessageRef.current?.scrollIntoView({ behavior: "instant" });
      }
    });
    eventSourceRef.current.addEventListener("end", () => {
      newMessageRef.current = "";
      isScrolledOnce.current = false;
      queryClient.invalidateQueries({
        queryKey: [CHAT_ENDPOINTS.GET_MESSAGES],
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
