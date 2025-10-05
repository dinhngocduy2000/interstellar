"use client";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { Conversation } from "@/lib/interfaces/conversations";
import Link from "next/link";
import { formatDistance } from "date-fns";

type Props = {
  conversation: Conversation;
};

const HistoryConversationItem = ({ conversation }: Props) => {
  return (
    <Link
      href={`${ROUTE_PATH.CONVERSATIONS}/${conversation.id}`}
      className="hover:bg-sidebar-accent flex justify-between gap-4 hover:cursor-pointer rounded-2xl px-4 py-3 w-full"
    >
      <p className="line-clamp-2 flex-1">{conversation.title}</p>
      <span className="text-sm text-ring">
        {formatDistance(conversation.created_at, new Date())} ago
      </span>
    </Link>
  );
};

export default HistoryConversationItem;
