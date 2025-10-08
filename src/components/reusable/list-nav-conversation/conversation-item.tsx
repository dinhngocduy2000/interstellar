"use client";
import AlertDialogComponent from "@/components/reusable/app-alert-dialog";
import AppTooltipComponent from "@/components/reusable/app-tooltip-component";
import AppDropdownMenu from "@/components/reusable/dropdown-menu";
import LoadingSpinner from "@/components/reusable/loading-spinner";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { Conversation } from "@/lib/interfaces/conversations";
import {
  AxiosErrorPayload,
  IDropdownMenuItem,
  IResponseDataWithPagination,
} from "@/lib/interfaces/utils";
import {
  useDeleteConversationQuery,
  usePinConversationMutation,
} from "@/lib/queries/conversation-query";
import { cn, getErrorMessage } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { EllipsisVertical, Pin, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  conversation: Conversation;
};

const ConversationItemComponent = ({ conversation }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const { mutateAsync: pinConversation, isPending: isPinningConversation } =
    usePinConversationMutation({
      onSuccess: () => {
        toast.success(
          `Conversation ${conversation?.is_pinned ? "unpinned" : "pinned"} successfully`,
        );
        queryClient.invalidateQueries({
          queryKey: [CONVERSATIONS_ENDPOINTS.GET, conversation.id],
        });
        queryClient.setQueryData(
          [CONVERSATIONS_ENDPOINTS.LIST, { page: 1, limit: 10 }],
          (
            oldData: IResponseDataWithPagination<Conversation> | undefined,
          ): IResponseDataWithPagination<Conversation> | undefined => {
            return {
              ...oldData,
              data:
                oldData?.data.map((conversationItem) => {
                  if (conversation.id !== conversationItem.id) {
                    return conversationItem;
                  }
                  return {
                    ...conversationItem,
                    is_pinned: !conversation?.is_pinned,
                  };
                }) ?? [],
              total: oldData?.total ?? 0,
            };
          },
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to pin conversation: ${getErrorMessage(error as AxiosError<AxiosErrorPayload>)}`,
        );
      },
    });
  const { mutateAsync: deleteConversation, isPending: isDeletingConversation } =
    useDeleteConversationQuery({
      onSuccess: () => {
        toast.success("Conversation deleted successfully");
        setOpenConfirmDelete(false);
        queryClient.invalidateQueries({
          queryKey: [
            CONVERSATIONS_ENDPOINTS.LIST,
            {
              page: 1,
              limit: 10,
            },
          ],
        });
        if (pathname.includes(conversation.id)) {
          router.push(ROUTE_PATH.HOME);
        }
      },
      onError: (error) => {
        toast.error(
          `Failed to delete conversation: ${getErrorMessage(error as AxiosError<AxiosErrorPayload>)}`,
        );
      },
    });
  const chatMenuItems: IDropdownMenuItem[] = [
    {
      label: (
        <div className="flex gap-2 items-center">
          <Pin
            className={cn(
              conversation?.is_pinned ? "fill-primary" : "fill-none",
            )}
          />
          Pin
        </div>
      ),
      onClick: async () => {
        await pinConversation({
          conversationID: conversation.id,
          conversationPinRequestDTO: {
            is_pinned: !conversation?.is_pinned,
          },
        });
      },
    },
    {
      label: (
        <div className="flex gap-2 items-center">
          <Trash2 />
          Delete
        </div>
      ),
      onClick: () => setOpenConfirmDelete(true),
    },
  ];
  const handleConfirmDeleteConversation = async () => {
    await deleteConversation(conversation.id);
  };
  return (
    <>
      <SidebarMenuSubButton
        isActive={pathname.includes(conversation.id)}
        className={cn(
          "w-full justify-between gap-2 py-4 relative group/conversation",
        )}
        asChild
      >
        <SidebarMenuSubItem>
          <AppTooltipComponent content={conversation.title}>
            <Link
              className="flex-1 truncate"
              href={`${ROUTE_PATH.CONVERSATIONS}/${conversation.id}`}
            >
              {conversation.title}
            </Link>
          </AppTooltipComponent>
          <AppDropdownMenu
            disabled={isDeletingConversation || isPinningConversation}
            items={chatMenuItems}
            contentAlign="start"
            dropdownTriggerClassName={cn(
              "w-fit absolute right-0 !px-2 bg-sidebar border-none hover:bg-gray-700",
              "data-[state=open]:bg-gray-700 hidden group-hover/conversation:block data-[state=open]:block",
            )}
            trigger={
              isDeletingConversation ? <LoadingSpinner /> : <EllipsisVertical />
            }
          />
        </SidebarMenuSubItem>
      </SidebarMenuSubButton>

      <AlertDialogComponent
        open={openConfirmDelete}
        text="Are you sure you want to delete this conversation?"
        setOpen={setOpenConfirmDelete}
        loading={isDeletingConversation}
        dialogTrigger={undefined}
        title={`Delete conversation: <${conversation?.title}>`}
        onConfirm={handleConfirmDeleteConversation}
      />
    </>
  );
};

export default ConversationItemComponent;
