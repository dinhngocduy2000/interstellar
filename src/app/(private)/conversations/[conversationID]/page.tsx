import ChatInputComponent from "@/components/reusable/chat-input-component";
import React from "react";
import ListMessageComponent from "./(list-messages)";

const ConversationPage = async ({
  params,
}: {
  params: Promise<{ conversationID: string }>;
}) => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-auto">
      <ListMessageComponent params={params} />
      <ChatInputComponent />
    </div>
  );
};

export default ConversationPage;
