"use server";

import { getListConversations } from "@/lib/api/conversations";
import {
  Conversation,
  IConversationQuery,
} from "@/lib/interfaces/conversations";
import { IResponseDataWithPagination } from "@/lib/interfaces/utils";

export const getListConversationsAction = async (
  params: IConversationQuery,
  signal?: AbortSignal,
): Promise<IResponseDataWithPagination<Conversation>> => {
  return await getListConversations(params, signal);
};
