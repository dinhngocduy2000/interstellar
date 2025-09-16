"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  AudioWaveform,
  BookOpen,
  Command,
  Map,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquarePen,
  ClipboardList,
  ArchiveIcon,
  Pin,
  Clock,
} from "lucide-react";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { ROUTE_PATH } from "@/lib/enum/route-path";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
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
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Pinned",
      url: "#",
      icon: Pin,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "History",
      url: "#",
      icon: Clock,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Projects",
      url: "#",
      icon: Frame,
    },
    {
      name: "Members",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Feedbacks",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebarComponent({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects items={data.projects} />
      </SidebarContent>
    </Sidebar>
  );
}
