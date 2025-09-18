"use client";
import AppTooltipComponent from "@/components/reusable/app-tooltip-component";
import AppDropdownMenu from "@/components/reusable/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getConversationDetail } from "@/lib/api/conversations";
import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { IDropdownMenuItem } from "@/lib/interfaces/utils";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical, PenSquare, Pin, Share, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

type Props = {
  conversationID: string;
};

const ConversationLayoutHeader = ({ conversationID }: Props) => {
  const pathname = usePathname();
  const { data: conversation } = useQuery({
    queryKey: [CONVERSATIONS_ENDPOINTS.GET, conversationID],
    queryFn: ({ signal }) => getConversationDetail(conversationID, signal),
  });
  const chatMenuItems: IDropdownMenuItem[] = [
    {
      label: (
        <div className="flex gap-2 items-center">
          <Pin />
          Pin
        </div>
      ),
      onClick: () => {},
    },
    {
      label: (
        <div className="flex gap-2 items-center">
          <Trash2 />
          Delete
        </div>
      ),
      onClick: () => {},
    },
  ];
  const handleShareConversation = async () => {
    try {
      const pageURL = `${window.location.origin}${pathname}`;
      await window.navigator.clipboard.writeText(pageURL);
      toast.success(
        "Copied link to clipboard. Shared links can be viewed by anyone with the links",
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy link to clipboard");
    }
  };
  return (
    <div className="w-full flex gap-4 justify-between p-4">
      <p className="text-lg font-semibold">
        {conversation?.title ?? "Private chat"}
      </p>
      <div className="flex gap-2">
        <AppTooltipComponent content={"More Actions"}>
          <AppDropdownMenu
            items={chatMenuItems}
            trigger={<EllipsisVertical />}
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
  );
};

export default ConversationLayoutHeader;
