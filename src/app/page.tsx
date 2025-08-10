
"use client";

import * as React from "react";
import useSWR, { mutate } from 'swr';
import type { Component, Log } from "@/lib/types";
import { fetchComponents, fetchLogs } from "@/lib/data-service";
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
import AuthGuard from "@/components/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");

  const { data: componentsData, error: componentsError } = useSWR<Component[]>('components', fetchComponents);
  const { data: logsData, error: logsError } = useSWR<Log[]>('logs', fetchLogs);

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  
  const isLoading = (!componentsData && !componentsError) || (!logsData && !logsError);

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
        </div>
    </div>
  )

  const availableComponents = React.useMemo(() => {
      if (!componentsData) return [];
      return componentsData.filter(c => c.availableQuantity > 0).slice(0, 5);
  }, [componentsData]);


  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            <Header
              onThemeChange={handleThemeChange}
              theme={theme}
            />
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {isLoading ? renderLoadingSkeleton() : (
                <>
                    <InventorySummary components={componentsData || []} />
                    
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
                                <RecentActivity logs={(logsData || []).slice(0,5)} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Inventory Overview</CardTitle>
                                    <CardDescription>Top 5 available components in the inventory.</CardDescription>
                                </div>
                                <Link href="/components">
                                    <Button variant="outline" size="sm">
                                        View all
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <ComponentTable components={availableComponents} minimal />
                            </CardContent>
                        </Card>
                    </div>
                </>
              )}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
