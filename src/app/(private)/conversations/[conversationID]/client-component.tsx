"use client";
import { Suspense, use } from "react";
import ListMessageComponent from "./(list-messages)";
import ChatInputComponent from "@/components/reusable/chat-input-component";
import { useSendChatMessageSSE } from "@/lib/hooks/use-chat-sse";

const ConversationClientComponent = ({
  params,
}: {
  params: Promise<{ conversationID: string }>;
}) => {
  const { conversationID } = use(params);
  const {
    handleSendMessage,
    closeSSEConnection,
    isResponding,
    lastMessageRef,
    isAllowingAutoScroll,
    isScrolledOnce,
  } = useSendChatMessageSSE({
    conversationID,
    conversationMessagesParams: {
      conversationID,
      page: 1,
      limit: 10,
    },
  });
  return (
    <>
      <ListMessageComponent
        params={params}
        handleSendMessage={handleSendMessage}
        closeSSEConnection={closeSSEConnection}
        isResponding={isResponding}
        ref={lastMessageRef}
        isAllowingAutoScrollRef={isAllowingAutoScroll}
        isScrolledOnce={isScrolledOnce}
      />
      <Suspense>
        <ChatInputComponent
          closeSSEConnection={closeSSEConnection}
          isResponding={isResponding}
          handleSendMessage={handleSendMessage}
        />
      </Suspense>
    </>
  );
};

export default ConversationClientComponent;
