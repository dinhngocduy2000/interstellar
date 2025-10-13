"use client";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
	ArrowBigUp,
	Ghost,
	Image,
	Navigation2,
	Newspaper,
	Paperclip,
	PlusIcon,
	Square,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { CHAT_ENDPOINTS, CONVERSATIONS_ENDPOINTS } from "@/lib/enum/endpoints";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { LOCAL_STORAGE_KEY } from "@/lib/enum/storage-keys";
import { Conversation } from "@/lib/interfaces/conversations";
import { AxiosErrorPayload, IDropdownMenuItem } from "@/lib/interfaces/utils";
import { useCreateConversationQuery } from "@/lib/queries/conversation-query";
import { cn, getErrorMessage } from "@/lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import AppTooltipComponent from "./app-tooltip-component";
import DropdownMenu from "./dropdown-menu";
import LoadingSpinner from "./loading-spinner";

const ChatInputComponent = ({
	handleSendMessage,
	closeSSEConnection,
	isResponding,
	conversationID,
}: {
	handleSendMessage?: (message: string) => Promise<void>;
	closeSSEConnection?: VoidFunction;
	isResponding?: boolean;
	conversationID?: string;
}) => {
	const queryClient = useQueryClient();
	const [chatText, setChatText] = useState<string>("");
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const isPrivate = searchParams.get("private") === "true";
	const { mutateAsync: createConversation, isPending: isCreatingConversation } =
		useCreateConversationQuery({
			onSuccess: (res) => {
				queryClient.invalidateQueries({
					queryKey: [CONVERSATIONS_ENDPOINTS.LIST],
				});
				router.push(`${ROUTE_PATH.CONVERSATIONS}/${res.id}`);
			},
			onError: (error) => {
				const axiosError = error as AxiosError<AxiosErrorPayload>;
				toast.error(getErrorMessage(axiosError));
			},
		});
	const chatInputDropdownItems: IDropdownMenuItem[] = [
		{
			label: (
				<div className="flex gap-2 items-center">
					<Paperclip /> Upload a file
				</div>
			),
			onClick: () => {
				toast.error("Not implemented");
			},
		},
	];

	const handleCreateChat = async () => {
		await createConversation({
			title: chatText,
			model: "gpt-4o",
			description: chatText,
		});
	};

	const onChatSubmit = async () => {
		if (isResponding) {
			closeSSEConnection?.();
			queryClient.invalidateQueries({
				queryKey: [CHAT_ENDPOINTS.GET_MESSAGES, conversationID],
			});

			queryClient.setQueryData(
				[CONVERSATIONS_ENDPOINTS.GET, conversationID],
				(oldData: Conversation): Conversation => ({
					...oldData,
					is_new: false,
				}),
			);
			return;
		}
		setChatText("");
		if (isPrivate) {
			localStorage.setItem(LOCAL_STORAGE_KEY.PRIVATE_MESSAGE, chatText);
			router.push(`${ROUTE_PATH.CONVERSATIONS}/private`);
			return;
		}
		if (pathname === ROUTE_PATH.HOME) {
			await handleCreateChat();
			return;
		}
		await handleSendMessage?.(chatText);
	};

	return (
		<div
			className={cn(
				"w-full p-8 flex flex-col gap-4 justify-center pt-0",
				pathname.includes(ROUTE_PATH.CONVERSATIONS) && "mt-auto pb-0",
			)}
		>
			<form
				className={cn(
					"min-h-[100px] h-[140px] md:max-w-4xl border rounded-xl max-w-full w-full mx-auto flex flex-col",
					isPrivate || conversationID === "private"
						? "bg-[#1B1B23] border-[#4B3B7C]"
						: "bg-chat-foreground border-ring",
				)}
			>
				<Textarea
					rows={4}
					autoFocus
					onKeyUp={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							onChatSubmit();
						}
					}}
					value={chatText}
					disabled={isCreatingConversation}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
						}
					}}
					onChange={(e) => setChatText(e.target.value)}
					placeholder="Make yourself at home and ask away"
					className={cn(
						"flex-1 resize-none md:text-base field-sizing-fixed p-4 border-none shadow-none dark:bg-transparent focus-visible:border-none focus-visible:ring-0",
					)}
				/>
				<div className="flex w-full h-fit p-4">
					<DropdownMenu
						trigger={<PlusIcon />}
						contentAlign="start"
						dropdownTriggerClassName="rounded-full bg-transparent"
						items={chatInputDropdownItems}
					/>
					<Button
						type="button"
						disabled={(!chatText || isCreatingConversation) && !isResponding}
						className="rounded-full ml-auto"
						onClick={onChatSubmit}
					>
						{isCreatingConversation ? (
							<LoadingSpinner />
						) : isResponding ? (
							<Square />
						) : (
							<Navigation2 className="rotate-90" />
						)}
					</Button>
				</div>
			</form>
			{pathname === ROUTE_PATH.HOME && (
				<div className="flex w-full justify-center gap-2">
					<Button className="rounded-2xl" variant={"outline"}>
						<Newspaper />
						Latest News
					</Button>
					<Button className="rounded-2xl" variant={"outline"}>
						<Image />
						Create Images
					</Button>
					<AppTooltipComponent
						content={
							<p>
								Switch to private chat{" "}
								<span className="text-xs flex text-gray-500">
									⌘<span>{<ArrowBigUp width={16} height={16} />}</span>K
								</span>
							</p>
						}
					>
						<Button
							className={cn(
								"rounded-2xl",
								isPrivate
									? "text-[#A08CED] border border-[#A08CED]"
									: "text-primary",
							)}
							variant={"outline"}
							onClick={() => {
								router.push(`${isPrivate ? "/" : "?private=true"}`);
							}}
						>
							<Ghost />
							Private
						</Button>
					</AppTooltipComponent>
				</div>
			)}
		</div>
	);
};

export default ChatInputComponent;
