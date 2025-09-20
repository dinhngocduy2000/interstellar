import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  content: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

const MessageItem = ({ content, containerProps }: Props) => {
  return (
    <div
      {...containerProps}
      className={cn(
        "max-w-xl bg-primary-foreground rounded-lg p-4 flex flex-col gap-2",
        containerProps?.className && containerProps?.className,
      )}
    >
      <p className="text-primary">{content}</p>
    </div>
  );
};

export default MessageItem;
