import { IPagination } from "./utils";

export type Conversation = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_pinned: boolean;
  model: string;
  user_id: string;
};

export type IConversationQuery = Partial<Conversation> & IPagination;
