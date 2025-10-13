import { ChevronDownIcon } from "lucide-react";
import { IDropdownMenuProps } from "@/lib/interfaces/utils";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

const AppDropdownMenu = ({
	trigger,
	items,
	onSearch,
	dropdownContentClassName,
	dropdownTriggerClassName,
	disabled,
	contentAlign = "end",
}: IDropdownMenuProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger disabled={disabled} asChild>
				<Button variant={"outline"} className={dropdownTriggerClassName}>
					{trigger ?? "Actions"}
					{!trigger && <ChevronDownIcon strokeWidth={1} />}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className={cn(
					"flex w-[--radix-dropdown-menu-trigger-width] min-w-56 flex-col gap-1 rounded-lg",
					dropdownContentClassName,
				)}
				side={"bottom"}
				align={contentAlign}
				sideOffset={4}
			>
				{onSearch && (
					<Input
						placeholder="Search an option.."
						onChange={(e) => onSearch(e.target.value)}
					/>
				)}
				{items.map((item, index) => (
					<DropdownMenuItem
						onClick={item.onClick}
						key={index.toString()}
						disabled={item.disabled}
						className="hover:cursor-pointer"
					>
						{item.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AppDropdownMenu;
