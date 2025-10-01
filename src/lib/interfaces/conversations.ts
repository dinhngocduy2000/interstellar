import z from "zod";
import { IPagination } from "./utils";
import { CreateConversationSchema } from "../schemas/create-conversation-schema";

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
  is_new: boolean;
  first_message: string;
};

export type IConversationQuery = Partial<Conversation> & IPagination;

export type ICreateConversation = z.infer<typeof CreateConversationSchema>;
export interface ConversationPinRequestDTO {
  /** Whether the conversation is pinned */
  is_pinned: boolean;
}
