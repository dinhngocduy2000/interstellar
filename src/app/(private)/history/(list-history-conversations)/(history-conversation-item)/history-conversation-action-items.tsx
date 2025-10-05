import AlertDialogComponent from "@/components/reusable/app-alert-dialog";
import AppTooltipComponent from "@/components/reusable/app-tooltip-component";
import { Button } from "@/components/ui/button";
import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { Conversation } from "@/lib/interfaces/conversations";
import { AxiosErrorPayload } from "@/lib/interfaces/utils";
import { useDeleteConversationQuery } from "@/lib/queries/conversation-query";
import { getErrorMessage } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowUpRightFromSquareIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  conversation: Conversation;
};
const HistoryConversationActionItems = ({ conversation }: Props) => {
  const queryClient = useQueryClient();
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const { mutateAsync: deleteConversation, isPending: isDeletingConversation } =
    useDeleteConversationQuery({
      onSuccess: () => {
        toast.success("Conversation deleted successfully");
        setOpenConfirmDelete(false);
        queryClient.invalidateQueries({
          queryKey: [CONVERSATIONS_ENDPOINTS.LIST],
        });
      },
      onError: (error) => {
        toast.error(
          `Failed to delete conversation: ${getErrorMessage(error as AxiosError<AxiosErrorPayload>)}`,
        );
      },
    });
  const handleConfirmDeleteConversation = async () => {
    await deleteConversation(conversation.id);
  };
  return (
    <>
      <div
        className="group-hover:flex hidden z-10"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
        }}
      >
        <AppTooltipComponent content="Open in new tab">
          <Button variant={"ghost"} className="ring-0" size="icon">
            <Link
              target="_blank"
              href={`${ROUTE_PATH.CONVERSATIONS}/${conversation.id}`}
            >
              <ArrowUpRightFromSquareIcon />
            </Link>
          </Button>
        </AppTooltipComponent>
        <AppTooltipComponent content="Delete">
          <Button
            onClick={() => setOpenConfirmDelete(true)}
            variant={"ghost"}
            type="button"
            disabled={isDeletingConversation}
            loading={isDeletingConversation}
            className="ring-0"
            size="icon"
          >
            <Trash2 />
          </Button>
        </AppTooltipComponent>
      </div>
      <AlertDialogComponent
        open={openConfirmDelete}
        loading={isDeletingConversation}
        setOpen={setOpenConfirmDelete}
        onConfirm={handleConfirmDeleteConversation}
        dialogTrigger={undefined}
        title={`Delete conversation: <${conversation.title}>`}
        text="Are you sure you want to delete this conversation?"
      />
    </>
  );
};

export default HistoryConversationActionItems;
