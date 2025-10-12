import {
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  IMutation,
  IPagination,
  IResponseDataWithPagination,
  ReactQueryHookParams,
} from "../interfaces/utils";
import { CHAT_ENDPOINTS } from "../enum/endpoints";
import {
  downvoteMessage,
  getConversationMessages,
  upvoteMessage,
} from "../api/chat";
import { IConversationMessage, IVoteMessage } from "../interfaces/message";

export const useGetConversationMessageQuery = ({
  params,
  queryKey,
  enabled,
}: ReactQueryHookParams<IPagination & { conversationID: string }> & {
  enabled: boolean;
}) =>
  useQuery({
    queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, params, ...queryKey],
    queryFn: async ({ signal }) =>
      await getConversationMessages(params, signal),
    refetchOnWindowFocus: false,
    staleTime: 5000,
    enabled: enabled,
  });

export const useGetConversationMessagesInfiniteQuery = ({
  params,
  queryKey,
  enabled,
}: ReactQueryHookParams<IPagination & { conversationID: string }> & {
  enabled?: boolean;
}) =>
  useInfiniteQuery({
    queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, params.conversationID, ...queryKey],
    queryFn: async ({ signal, pageParam }) =>
      await getConversationMessages({ ...params, page: pageParam }, signal),
    getNextPageParam: (currentPageData, _, currentPageParams) => {
      return currentPageParams < Math.ceil(currentPageData.total / params.limit)
        ? currentPageParams + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    enabled: enabled,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

export const useUpvoteMessageMutation = ({
  onSuccess,
  onError,
  onMutate,
  signal,
}: IMutation) =>
  useMutation({
    mutationFn: async (params: IVoteMessage & { messageID: string }) =>
      await upvoteMessage(params, signal),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
    onMutate: () => {
      onMutate?.();
    },
  });

export const useDownvoteMessageMutation = ({
  onSuccess,
  onError,
  onMutate,
  signal,
}: IMutation) =>
  useMutation({
    mutationFn: async (params: IVoteMessage & { messageID: string }) =>
      await downvoteMessage(params, signal),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
    onMutate: () => {
      onMutate?.();
    },
  });

export const addNewUserMessageData = ({
  userMessage,
  queryClient,
  queryKey,
}: {
  userMessage: IConversationMessage;
  queryClient: QueryClient;
  queryKey: unknown[];
}) => {
  queryClient.setQueryData(
    queryKey,
    (
      oldData:
        | InfiniteData<
            IResponseDataWithPagination<IConversationMessage>,
            unknown
          >
        | undefined,
    ):
      | InfiniteData<IResponseDataWithPagination<IConversationMessage>, unknown>
      | undefined => {
      const firstPage = oldData?.pages[0];
      const updatedFirstPageData = [...(firstPage?.data ?? []), userMessage];

      if (!firstPage) {
        return {
          ...oldData,
          pages: [
            {
              data: updatedFirstPageData ?? [],
              total: 0,
            },
          ],
          pageParams: oldData?.pageParams ?? [],
        };
      }
      return {
        ...oldData,
        pageParams: oldData?.pageParams ?? [],
        pages:
          oldData?.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: updatedFirstPageData ?? [],
                total: firstPage?.total ?? 0,
              };
            } else {
              return {
                data: page.data ?? [],
                total: page.total ?? 0,
              };
            }
          }) ?? [],
      };
    },
  );
};

export const updateNewBotReplyMessageData = ({
  newMessage,
  queryClient,
  queryKey,
  index,
}: {
  newMessage: IConversationMessage;
  queryClient: QueryClient;
  queryKey: unknown[];
  index: number;
}) => {
  queryClient.setQueryData(
    queryKey,
    (
      oldData:
        | InfiniteData<
            IResponseDataWithPagination<IConversationMessage>,
            unknown
          >
        | undefined,
    ):
      | InfiniteData<IResponseDataWithPagination<IConversationMessage>, unknown>
      | undefined => {
      const firstPage = oldData?.pages[0];
      const updatedFirstPageData =
        firstPage?.data[firstPage?.data.length - 1]?.id ===
        `new_message_${index}`
          ? firstPage.data.map((oldListsMessage) => {
              if (oldListsMessage.id === `new_message_${index}`) {
                return newMessage;
              }
              return oldListsMessage;
            })
          : [...(firstPage?.data ?? []), newMessage];

      return {
        ...oldData,
        pageParams: oldData?.pageParams ?? [],
        pages:
          oldData?.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: updatedFirstPageData ?? [],
                total: firstPage?.total ?? 0,
              };
            } else {
              return {
                data: page.data ?? [],
                total: page.total ?? 0,
              };
            }
          }) ?? [],
      };
    },
  );
};
