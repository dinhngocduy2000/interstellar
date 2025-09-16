import { Sidebar } from "@/components/ui/sidebar";
import AppSidebarHeaderComponent from "./app-sidebar-header";
import AppSidebarContentComponent from "./app-sidebar-content";

export function AppSidebarComponent({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeaderComponent />
      <AppSidebarContentComponent />
    </Sidebar>
  );
}
