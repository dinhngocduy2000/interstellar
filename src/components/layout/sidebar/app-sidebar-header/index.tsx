"use client";
import AppLogoComponent from "@/components/reusable/app-logo-component";
import { Button } from "@/components/ui/button";
import {
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

const AppSidebarHeaderComponent = ({ children }: PropsWithChildren) => {
  const { open } = useSidebar();
  const router = useRouter();
  useEffect(() => {
    const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.platform);

    const handleKeyDown = (event: KeyboardEvent) => {
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;
      // Listen for Ctrl + K
      if (cmdOrCtrl && event.key.toLowerCase() === "k") {
        event.preventDefault(); // Prevent default browser behavior
        router.push(`${ROUTE_PATH.HISTORY}?search=`);
      }

      if (cmdOrCtrl && event.shiftKey && event.key.toLowerCase() === "j") {
        event.preventDefault(); // Prevent default browser behavior
        router.push(`${ROUTE_PATH.HOME}?private=true`);
      }

      // Listen for Ctrl + J
      if (cmdOrCtrl && !event.shiftKey && event.key.toLowerCase() === "j") {
        event.preventDefault(); // Prevent default browser behavior
        router.push(`${ROUTE_PATH.HOME}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
