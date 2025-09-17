import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import axiosConfig from "..";
import {
  Conversation,
  IConversationQuery,
  ICreateConversation,
} from "@/lib/interfaces/conversations";
import { IResponseDataWithPagination } from "@/lib/interfaces/utils";

export const getListConversations = async (
  params: IConversationQuery,
  signal?: AbortSignal,
): Promise<IResponseDataWithPagination<Conversation>> => {
  return await axiosConfig.get(CONVERSATIONS_ENDPOINTS.LIST, {
    signal: signal,
    params: params,
  });
};

export const createConversation = async (
  params: ICreateConversation,
  signal?: AbortSignal,
): Promise<Conversation> => {
  return await axiosConfig.post(CONVERSATIONS_ENDPOINTS.LIST, params, {
    signal: signal,
  });
};

export const getConversationDetail = async (
  conversationID: string,
  signal?: AbortSignal,
): Promise<Conversation> => {
  return await axiosConfig.get(
    CONVERSATIONS_ENDPOINTS.GET.replace("{$id}", conversationID),
    {
      signal: signal,
    },
  );
};
