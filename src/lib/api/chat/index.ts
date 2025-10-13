import { CHAT_ENDPOINTS } from "@/lib/enum/endpoints";
import { IConversationMessage, IVoteMessage } from "@/lib/interfaces/message";
import {
  IPagination,
  IResponseDataWithPagination,
} from "@/lib/interfaces/utils";
import axiosConfig from "..";

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

export const upvoteMessage = async (
  params: IVoteMessage & { messageID: string },
  signal?: AbortSignal,
): Promise<unknown> => {
  return await axiosConfig.put(
    `${CHAT_ENDPOINTS.UPVOTE_MESSAGE}/${params.messageID}`,
    { upvote: params.data },
    {
      signal,
    },
  );
};

export const downvoteMessage = async (
  params: IVoteMessage & { messageID: string },
  signal?: AbortSignal,
): Promise<unknown> => {
  return await axiosConfig.put(
    `${CHAT_ENDPOINTS.DOWNVOTE_MESSAGE}/${params.messageID}`,
    {
      downvote: params.data,
    },
    {
      signal,
    },
  );
};
