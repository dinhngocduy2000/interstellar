import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Clipboard, ThumbsDown, ThumbsUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import AppTooltipComponent from "@/components/reusable/app-tooltip-component";
import LoadingSpinner from "@/components/reusable/loading-spinner";
import { Button } from "@/components/ui/button";
import { CHAT_ENDPOINTS } from "@/lib/enum/endpoints";
import { IConversationMessage } from "@/lib/interfaces/message";
import { AxiosErrorPayload } from "@/lib/interfaces/utils";
import {
  useDownvoteMessageMutation,
  useUpvoteMessageMutation,
} from "@/lib/queries/conversation-message-query";
import { cn, getErrorMessage } from "@/lib/utils";

type Props = {
  message: IConversationMessage;
};

const MessageItemActionComponent = ({ message }: Props) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { mutateAsync: downvoteMessage, isPending: isDownvotePending } =
    useDownvoteMessageMutation({
      onSuccess: () => {
        handleRefetchMessages();
      },
      onError: (error) => {
        toast.error(
          `Failed to downvote: ${getErrorMessage(error as AxiosError<AxiosErrorPayload>)}`,
        );
      },
    });

  const { mutateAsync: upvoteMessage, isPending: isUpvotePending } =
    useUpvoteMessageMutation({
      onSuccess: () => {
        handleRefetchMessages();
      },
      onError: (error) => {
        toast.error(
          `Failed to upvote: ${getErrorMessage(error as AxiosError<AxiosErrorPayload>)}`,
        );
      },
    });

  const handleRefetchMessages = () => {
    const conversationID = pathname.split("/").pop();
    queryClient.invalidateQueries({
      queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, conversationID],
    });
  };

  const handleShareConversation = async (string: string) => {
    try {
      await window.navigator.clipboard.writeText(string);
      toast.success("Response copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };
  const actionButtons: {
    label: string;
    icon: React.ReactNode;
    onClick: VoidFunction;
    isLoading?: boolean;
  }[] = [
    {
      label: "Upvote",
      icon: (
        <ThumbsUp
          className={cn(
            message.is_upvote
              ? "fill-green-400 stroke-green-400"
              : "stroke-primary",
          )}
        />
      ),
      onClick: () =>
        upvoteMessage({
          data: !message.is_upvote,
          messageID: message.id,
        }),
      isLoading: isUpvotePending,
    },
    {
      label: "Downvote",
      icon: (
        <ThumbsDown
          className={cn(
            message.is_downvote
              ? "fill-red-400 stroke-red-400"
              : "stroke-primary",
          )}
        />
      ),
      onClick: () =>
        downvoteMessage({
          data: !message.is_downvote,
          messageID: message.id,
        }),
      isLoading: isDownvotePending,
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
            disabled={action.isLoading}
            className="!px-2.5 rounded-full"
          >
            {action.isLoading ? <LoadingSpinner /> : action.icon}
          </Button>
        </AppTooltipComponent>
      ))}
    </div>
  );
};

export default MessageItemActionComponent;
