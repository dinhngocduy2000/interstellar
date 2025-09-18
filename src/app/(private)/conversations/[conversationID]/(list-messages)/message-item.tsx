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
        "max-w-xl bg-gray-800 rounded-lg p-4",
        containerProps?.className && containerProps?.className,
      )}
    >
      {content}
    </div>
  );
};

export default MessageItem;
