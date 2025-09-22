import ChatTypingComponent from "@/components/reusable/chat-typing-component";
import { MESSAGE_AUTHOR } from "@/lib/enum/message-author";
import { IConversationMessage } from "@/lib/interfaces/message";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  message: IConversationMessage;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  isResponding?: boolean;
};

const MessageItem = ({ message, containerProps, isResponding }: Props) => {
  return (
    <>
      <div
        {...containerProps}
        className={cn(
          "max-w-xl bg-primary-foreground rounded-lg p-4 flex flex-col gap-2",
          containerProps?.className && containerProps?.className,
        )}
      >
        <p className="text-primary">{message.content}</p>
      </div>
      {isResponding &&
        message.id === "new_message" &&
        message.author === MESSAGE_AUTHOR.BOT && <ChatTypingComponent />}
    </>
  );
};

export default MessageItem;
