"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { NavMainItems } from "@/lib/interfaces/utils";

type Props = {
	item: NavMainItems;
};

const NavMainItemComponent = ({ item }: Props) => {
	const pathname = usePathname();
	return (
		<Collapsible asChild className="group/collapsible">
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton
						className="hover:cursor-pointer"
						tooltip={item.title}
						isActive={pathname === item.url}
					>
						{item.icon && <item.icon />}
						<Link className=" w-full" href={item.url}>
							{item.title}
						</Link>
						{item.shortcut && (
							<p className="text-xs text-gray-500 group-hover/collapsible:flex hidden">
								{item.shortcut}
							</p>
						)}
					</SidebarMenuButton>
				</CollapsibleTrigger>
			</SidebarMenuItem>
		</Collapsible>
	);
};

export default NavMainItemComponent;
