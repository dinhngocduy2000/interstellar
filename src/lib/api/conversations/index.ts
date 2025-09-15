import { CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import axiosConfig from "..";
import { IPagination } from "@/lib/interfaces/utils";

export const getListConversations = async (
  params: IPagination,
  signal?: AbortSignal,
): Promise<string[]> => {
  return await axiosConfig.get(CONVERSATIONS_ENDPOINTS.LIST, {
    signal: signal,
    params: params,
  });
};
