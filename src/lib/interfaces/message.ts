import { MESSAGE_AUTHOR } from "../enum/message-author";

export type IConversationMessage = {
	id: string;
	author: MESSAGE_AUTHOR;
	created_at: string;
	updated_at: string;
	is_upvote: boolean;
	is_downvote: boolean;
	content: string;
	conversation_id: string;
};

export type IVoteMessage = {
	data: boolean;
};
