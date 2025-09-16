import React from "react";
import { SidebarContent } from "@/components/ui/sidebar";
import { NavMain } from "./nav-main/nav-main";
import { NavProjects } from "./nav-project/nav-projects";
import PreviousConversations from "./previous-conversations";
const AppSidebarContentComponent = () => {
  return (
    <SidebarContent>
      <NavMain>
        <PreviousConversations />
      </NavMain>
      <NavProjects />
    </SidebarContent>
  );
};

export default AppSidebarContentComponent;
