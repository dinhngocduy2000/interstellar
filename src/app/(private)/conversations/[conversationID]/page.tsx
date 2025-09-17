import ChatInputComponent from "@/components/reusable/chat-input-component";
import React from "react";

const ConversationPage = async () => {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4">
      <ChatInputComponent />
    </div>
  );
};

export default ConversationPage;
