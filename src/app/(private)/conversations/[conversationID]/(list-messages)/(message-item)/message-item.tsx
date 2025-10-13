import ChatTypingComponent from "@/components/reusable/chat-typing-component";
import { MESSAGE_AUTHOR } from "@/lib/enum/message-author";
import { IConversationMessage } from "@/lib/interfaces/message";
import { cn, isStringUUID } from "@/lib/utils";

import MessageItemActionComponent from "./message-item-action";

type Props = {
  message: IConversationMessage;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  isResponding?: boolean;
  isLastMessage?: boolean;
};

const MessageItem = ({
  message,
  containerProps,
  isResponding,
  isLastMessage,
}: Props) => {
  return (
    <>
      <div
        {...containerProps}
        className={cn(
          "flex w-fit max-w-xl flex-col gap-4 rounded-lg bg-primary-foreground p-4",
          containerProps?.className && containerProps?.className,
        )}
      >
        <p className="text-primary">{message.content}</p>
        {isResponding && isLastMessage && <ChatTypingComponent />}
      </div>
      {isStringUUID(message.id) && message.author === MESSAGE_AUTHOR.BOT && (
        <MessageItemActionComponent message={message} />
      )}
    </>
  );
};

export default MessageItem;
