"use client";

import * as React from "react";
import type { Component, Log, User } from "@/lib/types";
import { mockComponents, mockLogs, mockUsers } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/dashboard/header";
import InventorySummary from "@/components/dashboard/inventory-summary";
import RecentActivity from "@/components/dashboard/recent-activity";
import ComponentTable from "@/components/dashboard/component-table";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";

export default function DashboardPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");
  const [userRole, setUserRole] = React.useState<"admin" | "member">("member");
  const [componentsData, setComponentsData] = React.useState<Component[]>(mockComponents);
  const [logsData, setLogsData] = React.useState<Log[]>(mockLogs);
  const [searchTerm, setSearchTerm] = React.useState("");

  const user = mockUsers[userRole];

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleRoleChange = (role: "admin" | "member") => {
    setUserRole(role);
    toast({
      title: "Switched Role",
      description: `You are now viewing as ${role === "admin" ? "an Admin" : "a Member"}.`,
    });
  };

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleBorrow = (component: Component, details: { expectedReturnDate: Date; purpose: string }) => {
    setComponentsData(prev =>
      prev.map(c =>
        c.id === component.id ? { ...c, status: "Borrowed", borrowedBy: user.name, expectedReturnDate: details.expectedReturnDate.toISOString().split('T')[0] } : c
      )
    );
    setLogsData(prev => [
      {
        id: (prev.length + 1).toString(),
        componentName: component.name,
        userName: user.name,
        action: "Borrowed",
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
    toast({
      title: "Component Borrowed",
      description: `${component.name} has been successfully borrowed.`,
    });
  };

  const filteredComponents = React.useMemo(() => {
    return componentsData.filter(
      (component) =>
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [componentsData, searchTerm]);

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header
            user={user}
            onRoleChange={handleRoleChange}
            onThemeChange={handleThemeChange}
            theme={theme}
            onSearch={setSearchTerm}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <InventorySummary components={componentsData} />
            
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <ComponentTable components={filteredComponents} user={user} onBorrow={handleBorrow} />
              </div>
              <div className="md:col-span-1">
                <RecentActivity logs={logsData} />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
