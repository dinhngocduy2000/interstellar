"use client";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import {
  BookOpen,
  Settings2,
  SquarePen,
  ClipboardList,
  ArchiveIcon,
  Pin,
} from "lucide-react";
import { ROUTE_PATH } from "@/lib/enum/route-path";
export function NavMain({ children }: PropsWithChildren) {
  const items = [
    { title: "Ask", url: ROUTE_PATH.HOME, icon: SquarePen },
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
    {
      title: "Pinned",
      url: "#",
      icon: Pin,
    },
  ];
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild className="group/collapsible">
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
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        {children}
      </SidebarMenu>
    </SidebarGroup>
  );
}
