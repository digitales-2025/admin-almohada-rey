"use client";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "../ui/sidebar";
import { sidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavLogo } from "./nav-logo";
import { NavUser } from "./nav-user";
import { filterSidebarData } from "./utils/sidebar-filter";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useProfile();

  // Filtrar el sidebar basado en el rol del usuario
  const filteredSidebarData = user?.userRol ? filterSidebarData(sidebarData, user.userRol) : sidebarData;

  return (
    <Sidebar collapsible="icon" variant="inset" {...props} className="bg-sidebar">
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        {filteredSidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
