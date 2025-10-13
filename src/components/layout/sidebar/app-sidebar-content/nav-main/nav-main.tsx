"use client";
import {
	ArchiveIcon,
	BookOpen,
	ClipboardList,
	Settings2,
	SquarePen,
} from "lucide-react";
import { PropsWithChildren } from "react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
} from "@/components/ui/sidebar";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { NavMainItems } from "@/lib/interfaces/utils";
import NavMainItemComponent from "./nav-main-item";
export function NavMain({ children }: PropsWithChildren) {
	const items: NavMainItems[] = [
		{ title: "Ask", url: ROUTE_PATH.HOME, icon: SquarePen, shortcut: "⌘J" },
		{ title: "Tasks", url: ROUTE_PATH.TASK, icon: ClipboardList },
		{ title: "Files", url: ROUTE_PATH.FILES, icon: ArchiveIcon },
		{
			title: "Feedbacks",
			url: ROUTE_PATH.FEEDBACKS,
			icon: Settings2,
		},
		{
			title: "Calendar",
			url: ROUTE_PATH.CALENDAR,
			icon: BookOpen,
		},
	];
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item, index) => (
					<NavMainItemComponent
						key={item.title + index.toString()}
						item={item}
					/>
				))}
				{children}
			</SidebarMenu>
		</SidebarGroup>
	);
}
