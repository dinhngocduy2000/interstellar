"use client";
import AppLogoComponent from "@/components/reusable/app-logo-component";
import {
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const AppSidebarHeaderComponent = () => {
  const { open } = useSidebar();
  return (
    <SidebarHeader
      className={cn(
        "flex flex-row gap-2 w-full justify-between p-4",
        !open && "justify-center px-0",
      )}
    >
      {open && <AppLogoComponent width={30} height={30} />}
      <SidebarTrigger>{!open && <AppLogoComponent />}</SidebarTrigger>
    </SidebarHeader>
  );
};

export default AppSidebarHeaderComponent;
