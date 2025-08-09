"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Gem, LayoutDashboard, Package, History, Users, LogOut, Settings } from "lucide-react";
import { User } from "@/lib/types";

type AppSidebarProps = {
    user: User;
};

export default function AppSidebar({ user }: AppSidebarProps) {
    const [activeItem, setActiveItem] = React.useState("dashboard");

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Gem className="h-6 w-6 text-primary" />
                    <span className="text-lg font-semibold">KURC Inventory</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            isActive={activeItem === "dashboard"}
                            onClick={() => setActiveItem("dashboard")}
                            tooltip="Dashboard"
                        >
                            <LayoutDashboard />
                            Dashboard
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            isActive={activeItem === "components"}
                            onClick={() => setActiveItem("components")}
                            tooltip="Components"
                        >
                            <Package />
                            Components
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            isActive={activeItem === "logs"}
                            onClick={() => setActiveItem("logs")}
                            tooltip="Transaction Logs"
                        >
                            <History />
                            Transaction Logs
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            isActive={activeItem === "accounts"}
                            onClick={() => setActiveItem("accounts")}
                            tooltip="Accounts"
                        >
                            <Users />
                            Accounts
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                 <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Settings />
                            Settings
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LogOut />
                            Logout
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                 </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
