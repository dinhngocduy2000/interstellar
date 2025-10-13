"use client";

import ListNavConversationUI from "@/components/reusable/list-nav-conversation/list-nav-conversation-ui";
import { useConversationListQuery } from "@/lib/queries/conversation-query";

const ListConversationComponent = () => {
	const { data, error } = useConversationListQuery({
		params: {
			page: 1,
			limit: 10,
		},
		queryKey: [],
	});

	return <ListNavConversationUI listConversation={data?.data} error={error} />;
};

export default ListConversationComponent;
