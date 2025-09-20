"use client";
import React, { use, useEffect, useRef, useState } from "react";
import MessageItem from "./message-item";
import { useGetConversationDetailQuery } from "@/lib/queries/conversation-query";

const ListMessageComponent = ({
  params,
}: {
  params: Promise<{ conversationID: string }>;
}) => {
  const [messages, setMessages] = useState<string>("");
  const { conversationID } = use(params);
  const { data: conversationDetail } = useGetConversationDetailQuery({
    queryKey: [],
    params: {
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
      setMessages((prev) => prev + event.data);
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

  return (
    <div className="w-full flex-1 overflow-auto h-full flex flex-col md:max-w-4xl max-w-full mx-auto gap-4 px-4">
      <MessageItem
        content={conversationDetail?.first_message ?? ""}
        containerProps={{ className: "self-end" }}
      />
      <MessageItem content={messages} />
    </div>
  );
};

export default ListMessageComponent;
