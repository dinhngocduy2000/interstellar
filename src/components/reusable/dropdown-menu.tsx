import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { IDropdownMenuProps } from "@/lib/interfaces/utils";

const AppDropdownMenu = ({
  trigger,
  items,
  onSearch,
  dropdownContentClassName,
  dropdownTriggerClassName,
  contentAlign = "end",
}: IDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
