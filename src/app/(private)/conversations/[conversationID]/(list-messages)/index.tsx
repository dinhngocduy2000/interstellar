"use client";
import { useSearchParams } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";

const ListMessageComponent = ({
  params,
}: {
  params: Promise<{ conversationID: string }>;
}) => {
  const searchParams = useSearchParams();
  const newMessage = searchParams.get("message");
  const [messages, setMessages] = useState<string>("");
  const { conversationID } = use(params);
  const eventSourceRef = useRef<EventSource | null>(null);
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
      eventSourceRef.current?.close();
    });
  };
  useEffect(() => {
    if (newMessage) {
      handleSendMessage(newMessage);
    }
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return <div>{messages}</div>;
};

export default ListMessageComponent;
