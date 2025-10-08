"use client";
import AppLogoComponent from "@/components/reusable/app-logo-component";
import { Button } from "@/components/ui/button";
import {
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { useKeyboardShortcut } from "@/lib/hooks/use-keyboard-shortcut";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

const AppSidebarHeaderComponent = ({ children }: PropsWithChildren) => {
  const { open } = useSidebar();
  useKeyboardShortcut();
  return (
    <>
      <SidebarHeader
        className={cn(
          "flex flex-row gap-2 w-full justify-between p-4",
          !open && "justify-center px-0",
        )}
      >
        {open && <AppLogoComponent width={30} height={30} />}
        <SidebarTrigger>{!open && <AppLogoComponent />}</SidebarTrigger>
      </SidebarHeader>
      {open ? (
        children
      ) : (
        <Link href={`${ROUTE_PATH.HISTORY}?search=`} className="px-2">
          <Button variant={"outline"} className="w-full">
            <Search />
          </Button>
        </Link>
      )}
    </>
  );
};

export default AppSidebarHeaderComponent;
