"use client";
import { formatDistance } from "date-fns";
import { useRouter } from "next/navigation";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { Conversation } from "@/lib/interfaces/conversations";
import HistoryConversationActionItems from "./history-conversation-action-items";

type Props = {
	conversation: Conversation;
};

const HistoryConversationItem = ({ conversation }: Props) => {
	const router = useRouter();
	return (
		<div className="group hover:bg-border items-center flex justify-between gap-4 hover:cursor-pointer rounded-2xl px-4 w-full">
			<p
				onClick={() => {
					router.push(`${ROUTE_PATH.CONVERSATIONS}/${conversation.id}`);
				}}
				className="line-clamp-2 py-2 flex-1 text-base"
			>
				{conversation.title}
			</p>
			<span className="text-sm text-ring group-hover:hidden">
				{formatDistance(conversation.created_at, new Date())} ago
			</span>
			<HistoryConversationActionItems conversation={conversation} />
		</div>
	);
};

export default HistoryConversationItem;
