
"use client";

import * as React from "react";
import type { Component, Log } from "@/lib/types";
import { mockComponents, mockLogs, mockUsers } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/dashboard/header";
import InventorySummary from "@/components/dashboard/inventory-summary";
import RecentActivity from "@/components/dashboard/recent-activity";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ComponentTable from "@/components/dashboard/component-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");
  const [componentsData, setComponentsData] = React.useState<Component[]>(mockComponents);
  const [logsData, setLogsData] = React.useState<Log[]>(mockLogs);

  const user = mockUsers.admin;

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

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
        status: "Borrowed",
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
    toast({
      title: "Component Borrowed",
      description: `${component.name} has been successfully borrowed.`,
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header
            onThemeChange={handleThemeChange}
            theme={theme}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <InventorySummary components={componentsData} />
            
            <div className="mt-8 grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>A log of the last 5 component borrows and returns.</CardDescription>
                        </div>
                         <Link href="/logs">
                            <Button variant="outline" size="sm">View all</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <RecentActivity logs={logsData.slice(0,5)} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Inventory Overview</CardTitle>
                            <CardDescription>Top 5 components in the inventory.</CardDescription>
                        </div>
                        <Link href="/components">
                            <Button variant="outline" size="sm">
                                View all
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <ComponentTable components={componentsData.slice(0,5)} onBorrow={handleBorrow} minimal />
                    </CardContent>
                </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
