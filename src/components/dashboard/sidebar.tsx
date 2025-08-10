
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader className="border-b h-16 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Gem className="h-7 w-7 text-primary" />
                    <span className="text-xl font-semibold">KURC Inventory</span>
                </div>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/">
                            <SidebarMenuButton 
                                size="lg"
                                isActive={pathname === "/"}
                                tooltip="Dashboard"
                            >
                                <LayoutDashboard />
                                Dashboard
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                         <Link href="/components">
                            <SidebarMenuButton 
                                size="lg"
                                isActive={pathname === "/components"}
                                tooltip="Components"
                            >
                                <Package />
                                Components
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg"
                            isActive={pathname === "/logs"}
                            tooltip="Transaction Logs"
                        >
                            <History />
                            Transaction Logs
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg"
                            isActive={pathname === "/accounts"}
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
