"use client";
import { AxiosError } from "axios";
import { ArrowDown } from "lucide-react";
import React, {
	Fragment,
	RefObject,
	use,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import LoadingSpinner from "@/components/reusable/loading-spinner";
import NoDataComponent from "@/components/reusable/no-data-component";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGE_AUTHOR } from "@/lib/enum/message-author";
import { LOCAL_STORAGE_KEY } from "@/lib/enum/storage-keys";
import { AxiosErrorPayload, IPagination } from "@/lib/interfaces/utils";
import { useGetConversationMessagesInfiniteQuery } from "@/lib/queries/conversation-message-query";
import { useGetConversationDetailQuery } from "@/lib/queries/conversation-query";
import { cn, getErrorMessage } from "@/lib/utils";
import MessageItem from "./(message-item)/message-item";

type ListMessageComponentProps = {
	params: Promise<{ conversationID: string }>;
	handleSendMessage: (_message: string) => Promise<void>;
	closeSSEConnection: VoidFunction;
	isResponding: boolean;
	isAllowingAutoScrollRef: RefObject<boolean>;
	virtuosoRef: React.RefObject<VirtuosoHandle | null>;
};

const ListMessageComponent = ({
	params,
	handleSendMessage,
	closeSSEConnection,
	isResponding,
	isAllowingAutoScrollRef,
	virtuosoRef,
}: ListMessageComponentProps) => {
	const { conversationID } = use(params);
	const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
	const conversationMessagesParams: IPagination & { conversationID: string } = {
		conversationID: conversationID,
		page: 1,
		limit: 10,
	};
	const { data: conversationDetail } = useGetConversationDetailQuery({
		queryKey: [],
		params: {
			conversationID: conversationID,
		},
		enabled: conversationID !== "private",
	});
	const {
		data: listMessagesData,
		error,
		fetchNextPage,
		isFetchingNextPage,
		isFetching,
		isFetchedAfterMount,
		hasNextPage,
	} = useGetConversationMessagesInfiniteQuery({
		queryKey: [],
		params: conversationMessagesParams,
		enabled: conversationDetail?.is_new === false,
	});

	const listMessages = useMemo(
		() => listMessagesData?.pages.flatMap((page) => page.data),
		[listMessagesData],
	);

	const onHandleScroll = (isAtBottom: boolean) => {
		setIsAtBottom(isAtBottom);
		if (!isResponding) {
			isAllowingAutoScrollRef.current = true;
			return;
		}
		isAllowingAutoScrollRef.current = isAtBottom;
	};

	const onFetchPreviousMessages = async (atTop: boolean) => {
		if (!atTop || !hasNextPage || !isFetchedAfterMount) return;
		await fetchNextPage();
	};

	const handleScrollToBottom = () => {
		virtuosoRef.current?.scrollToIndex({
			index: "LAST",
			behavior: "auto",
			offset: 1000,
		});
	};

	useEffect(() => {
		if (conversationID === "private") {
			const privateMessage = localStorage.getItem(
				LOCAL_STORAGE_KEY.PRIVATE_MESSAGE,
			);
			if (!privateMessage) {
				return;
			}
			handleSendMessage(privateMessage);
		}
		if (conversationDetail?.is_new && conversationDetail) {
			handleSendMessage(conversationDetail.first_message);
		}
		return () => {
			closeSSEConnection();
		};
	}, [conversationDetail, conversationID]);

	useEffect(() => {
		virtuosoRef.current?.scrollToIndex({
			index: "LAST",
			behavior: "auto",
			offset: 1000,
		});
	}, [isFetchedAfterMount]);

	if (isFetching && !isFetchedAfterMount) {
		return (
			<div className="mt-6 h-full w-full flex flex-col gap-4 md:max-w-4xl max-w-full mx-auto">
				{Array.from({ length: 8 }).map((_, index) => (
					<Skeleton key={index} className="h-8 w-full" />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<NoDataComponent
				text={getErrorMessage(error as AxiosError<AxiosErrorPayload>)}
			/>
		);
	}
	return (
		<>
			<Virtuoso
				data={listMessages}
				ref={virtuosoRef}
				atBottomStateChange={onHandleScroll}
				atBottomThreshold={15}
				className="flex-1 !h-full !w-full !pr-2 !flex !flex-col md:max-w-4xl max-w-full mx-auto gap-4"
				components={{
					Header: () => (
						<div className={cn("min-h-4 w-full flex justify-center py-2")}>
							{isFetchingNextPage && <LoadingSpinner />}
						</div>
					),
				}}
				atTopStateChange={onFetchPreviousMessages}
				itemContent={(_, message) => (
					<Fragment key={message.id}>
						{message.author === MESSAGE_AUTHOR.USER && (
							<MessageItem
								key={message.id}
								message={message}
								containerProps={{ className: "ml-auto mb-4 mr-2" }}
							/>
						)}
						{message.author === MESSAGE_AUTHOR.BOT && (
							<MessageItem
								key={message.id}
								message={message}
								isResponding={isResponding}
								isLastMessage={
									message.id === `new_message_${listMessages?.length}`
								}
							/>
						)}
					</Fragment>
				)}
			/>
			{!isAtBottom && (
				<Button
					className="absolute bottom-0 right-0 rounded-full size-12"
					variant={"default"}
					onClick={handleScrollToBottom}
				>
					<ArrowDown />
				</Button>
			)}
		</>
	);
};

export default ListMessageComponent;
