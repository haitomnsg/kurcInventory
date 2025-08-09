"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Gem, LayoutDashboard, Package, History, Users } from "lucide-react";
import { User } from "@/lib/types";

type AppSidebarProps = {
    user: User;
};

export default function AppSidebar({ user }: AppSidebarProps) {
    const [activeItem, setActiveItem] = React.useState("dashboard");

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="flex items-center gap-3">
                    <Gem className="h-7 w-7 text-primary" />
                    <span className="text-xl font-semibold">KURC Inventory</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg"
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
                            size="lg"
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
                            size="lg"
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
                            size="lg"
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
        </Sidebar>
    )
}
