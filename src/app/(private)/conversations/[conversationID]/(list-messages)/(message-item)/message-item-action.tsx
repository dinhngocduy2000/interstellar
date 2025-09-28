import AppTooltipComponent from "@/components/reusable/app-tooltip-component";
import { Button } from "@/components/ui/button";
import { IConversationMessage } from "@/lib/interfaces/message";
import { Clipboard, ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

type Props = {
  message: IConversationMessage;
};

const MessageItemActionComponent = ({ message }: Props) => {
  const handleShareConversation = async (string: string) => {
    try {
      await window.navigator.clipboard.writeText(string);
      toast.success("Response copied to clipboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy to clipboard");
    }
  };
  const actionButtons: {
    label: string;
    icon: React.ReactNode;
    onClick: VoidFunction;
  }[] = [
    {
      label: "Upvote",
      icon: <ThumbsUp />,
      onClick: () => {},
    },
    {
      label: "Downvote",
      icon: <ThumbsDown />,
      onClick: () => {},
    },
    {
      label: "Copy",
      icon: <Clipboard />,
      onClick: () => handleShareConversation(message.content),
    },
  ];
  return (
    <div className="flex w-full gap-1">
      {actionButtons.map((action) => (
        <AppTooltipComponent key={action.label} content={action.label}>
          <Button
            variant={"ghost"}
            onClick={action.onClick}
            className="rounded-full !px-2.5"
          >
            {action.icon}
          </Button>
        </AppTooltipComponent>
      ))}
    </div>
  );
};

export default MessageItemActionComponent;
