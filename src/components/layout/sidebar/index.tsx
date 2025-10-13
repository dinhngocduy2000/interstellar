import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import AppSidebarContentComponent from "./app-sidebar-content";
import AppSidebarHeaderComponent from "./app-sidebar-header";

export function AppSidebarComponent({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<AppSidebarHeaderComponent>
				<Link href={`${ROUTE_PATH.HISTORY}?search=`} className="px-4">
					<Button variant={"outline"} className="justify-start w-full">
						<Search />
						Search <span className="text-xs text-gray-500">⌘K</span>
					</Button>
				</Link>
			</AppSidebarHeaderComponent>
			<AppSidebarContentComponent />
		</Sidebar>
	);
}
