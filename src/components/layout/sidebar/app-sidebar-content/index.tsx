import React from "react";
import { SidebarContent } from "@/components/ui/sidebar";
import { NavMain } from "./nav-main/nav-main";
import { NavProjects } from "./nav-project/nav-projects";
import PreviousConversations from "./previous-conversations";
import PinnedConversations from "./pinned-conversations";
const AppSidebarContentComponent = async () => {
  "use server";
  return (
    <SidebarContent>
      <NavMain>
        <PinnedConversations />
        <PreviousConversations />
      </NavMain>

      <NavProjects />
    </SidebarContent>
  );
};

export default AppSidebarContentComponent;
