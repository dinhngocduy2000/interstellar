import {
  IPagination,
  IResponseDataWithPagination,
} from "@/lib/interfaces/utils";
import axiosConfig from "..";
import { CHAT_ENDPOINTS } from "@/lib/enum/endpoints";
import { IConversationMessage } from "@/lib/interfaces/message";

export const sendChatMessage = async () => {};

export const getConversationMessages = async (
  params: IPagination & { conversationID: string },
  signal?: AbortSignal,
): Promise<IResponseDataWithPagination<IConversationMessage>> => {
  return await axiosConfig.get(
    `${CHAT_ENDPOINTS.GET_MESSAGES}/${params.conversationID}`,
    {
      params: { ...params, conversationID: undefined },
      signal,
    },
  );
};
