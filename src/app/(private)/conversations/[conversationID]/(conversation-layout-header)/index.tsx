"use client";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { EllipsisVertical, PenSquare, Pin, Share, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import AlertDialogComponent from "@/components/reusable/app-alert-dialog";
import AppTooltipComponent from "@/components/reusable/app-tooltip-component";
import AppDropdownMenu from "@/components/reusable/dropdown-menu";
import LoadingSpinner from "@/components/reusable/loading-spinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  useGetConversationDetailQuery,
  usePinConversationMutation,
} from "@/lib/queries/conversation-query";
import { cn, getErrorMessage } from "@/lib/utils";

type Props = {
  conversationID: string;
};

const ConversationLayoutHeader = ({ conversationID }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data: conversation, isFetching } = useGetConversationDetailQuery({
    queryKey: [],
    params: {
      conversationID: conversationID,
    },
    enabled: conversationID !== "private",
  });
  const { mutateAsync: pinConversation, isPending: isPinningConversation } =
    usePinConversationMutation({
      onSuccess: () => {
        toast.success(
          `Conversation ${conversation?.is_pinned ? "unpinned" : "pinned"} successfully`,
        );
        queryClient.invalidateQueries({
          queryKey: [CONVERSATIONS_ENDPOINTS.GET, conversationID],
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
                  if (conversationID !== conversationItem.id) {
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
        router.push(ROUTE_PATH.HOME);
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
        <div className="flex items-center gap-2">
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
          conversationID: conversationID,
          conversationPinRequestDTO: {
            is_pinned: !conversation?.is_pinned,
          },
        });
      },
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <Trash2 />
          Delete
        </div>
      ),
      onClick: () => setOpenConfirmDelete(true),
    },
  ];
  const handleShareConversation = async () => {
    try {
      const pageURL = `${window.location.origin}${pathname}`;
      await window.navigator.clipboard.writeText(pageURL);
      toast.success(
        "Copied link to clipboard. Shared links can be viewed by anyone with the links",
      );
    } catch {
      toast.error("Failed to copy link to clipboard");
    }
  };

  const handleConfirmDeleteConversation = async () => {
    await deleteConversation(conversationID);
  };
  if (isFetching) {
    return (
      <div className="flex w-full justify-between gap-4 px-4 pt-2">
        <Skeleton className="h-7 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full justify-between gap-4 px-4 pt-2">
        <p className="font-semibold text-lg">
          {conversation?.title ?? "Private chat"}
        </p>
        <div className="flex gap-2">
          <AppTooltipComponent content={"More Actions"}>
            <AppDropdownMenu
              disabled={isDeletingConversation || isPinningConversation}
              items={chatMenuItems}
              trigger={
                isDeletingConversation ? (
                  <LoadingSpinner />
                ) : (
                  <EllipsisVertical />
                )
              }
            />
          </AppTooltipComponent>
          <Button onClick={handleShareConversation} variant={"outline"}>
            <Share />
            Share
          </Button>
          <AppTooltipComponent content={"New Chat"}>
            <Button variant={"ghost"}>
              <Link href={ROUTE_PATH.HOME}>
                <PenSquare className="size-5" height={25} width={25} />
              </Link>
            </Button>
          </AppTooltipComponent>
        </div>
      </div>
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

export default ConversationLayoutHeader;
