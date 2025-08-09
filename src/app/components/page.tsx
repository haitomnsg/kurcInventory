"use client";

import * as React from "react";
import type { Component, Log, User } from "@/lib/types";
import { mockComponents, mockLogs, mockUsers } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/dashboard/header";
import ComponentTable from "@/components/dashboard/component-table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { AddComponentDialog } from "@/components/add-component-dialog";

export default function ComponentsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");
  const [userRole, setUserRole] = React.useState<"admin" | "member">("member");
  const [componentsData, setComponentsData] = React.useState<Component[]>(mockComponents);
  const [logsData, setLogsData] = React.useState<Log[]>(mockLogs);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

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

  const handleAddComponent = (newComponent: Omit<Component, 'id' | 'status' | 'imageUrl' | 'aiHint'>) => {
    const componentToAdd: Component = {
        ...newComponent,
        id: (componentsData.length + 1).toString(),
        status: "Available",
        imageUrl: "https://placehold.co/100x100.png",
        aiHint: `${newComponent.name.toLowerCase()} ${newComponent.category.toLowerCase()}`.trim(),
    };
    setComponentsData(prev => [componentToAdd, ...prev]);
    toast({
        title: "Component Added",
        description: `${newComponent.name} has been successfully added to the inventory.`
    });
    setIsAddDialogOpen(false);
  }

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
            <ComponentTable 
              components={filteredComponents} 
              user={user} 
              onBorrow={handleBorrow} 
              onAddComponent={() => setIsAddDialogOpen(true)}
            />
          </main>
        </div>
        <AddComponentDialog 
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddComponent={handleAddComponent}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
