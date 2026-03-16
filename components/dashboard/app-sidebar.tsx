"use client";

import * as React from "react";

import Link from "next/link";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboardIcon, ListIcon, CommandIcon, UsersIcon } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useCurrentUser();
  const isSuperAdmin = user?.role === "super_admin";
  const sidebarUser = user
    ? { name: user.user, email: user.email, avatar: "/avatars/shadcn.jpg" }
    : { name: "Guest", email: "", avatar: "/avatars/shadcn.jpg" };
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: <LayoutDashboardIcon />,
      },
      {
        title: "Tasks",
        url: "/dashboard/tasks",
        icon: <ListIcon />,
      },
      ...(isSuperAdmin
        ? [
            {
              title: "Manage users",
              url: "/dashboard/manage-users",
              icon: <UsersIcon />,
            },
          ]
        : []),
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Task Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
