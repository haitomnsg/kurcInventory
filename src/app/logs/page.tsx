
"use client";

import * as React from "react";
import useSWR, { mutate } from 'swr';
import type { Log, Component } from "@/lib/types";
import { fetchLogs, fetchComponents, addLog, updateComponent } from "@/lib/data-service";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, MinusCircle } from "lucide-react";
import { IssueItemDialog } from "@/components/issue-item-dialog";
import { ReturnItemDialog } from "@/components/return-item-dialog";
import { Separator } from "@/components/ui/separator";
import AuthGuard from "@/components/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";

export default function LogsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");
  
  const { data: logsData, error: logsError } = useSWR<Log[]>('logs', fetchLogs);
  const { data: componentsData, error: componentsError } = useSWR<Component[]>('components', fetchComponents);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "borrowed" | "returned">("all");
  const [isIssueDialogOpen, setIsIssueDialogOpen] = React.useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleIssueItem = async (details: { componentId: string; userName: string; purpose: string; expectedReturnDate: Date; contactNumber: string; quantity: number }) => {
    const component = componentsData?.find(c => c.id === details.componentId);
    if (!component || !component.id) return;
    
    if(details.quantity > component.availableQuantity) {
        toast({ title: "Error", description: "Not enough items available to issue.", variant: "destructive" });
        return;
    }

    try {
        await updateComponent(component.id, { 
            availableQuantity: component.availableQuantity - details.quantity,
        });

        const newLog: Omit<Log, 'id'> = {
            componentName: component.name,
            componentId: component.id,
            userName: details.userName,
            contactNumber: details.contactNumber,
            quantity: details.quantity,
            status: "Borrowed",
            timestamp: new Date().toISOString(),
            expectedReturnDate: details.expectedReturnDate.toISOString(),
            purpose: details.purpose,
        };
        await addLog(newLog);

        mutate('components');
        mutate('logs');

        toast({
            title: "Component Issued",
            description: `${details.quantity} of ${component.name} has been issued to ${details.userName}.`,
        });
        setIsIssueDialogOpen(false);
    } catch (error) {
        console.error("Failed to issue component:", error);
        toast({ title: "Error", description: "Failed to issue component.", variant: "destructive" });
    }
  }

  const handleReturnItem = async (logToReturn: Log, remarks: string) => {
    if (!logToReturn?.componentId) return;
    const component = componentsData?.find(c => c.id === logToReturn.componentId);
    if (!component || !component.id) return;

    try {
        await updateComponent(component.id, { 
            availableQuantity: component.availableQuantity + logToReturn.quantity,
        });
        
        const newLog: Omit<Log, 'id'> = {
            componentName: component.name,
            componentId: component.id,
            userName: logToReturn.userName,
            quantity: logToReturn.quantity,
            status: "Returned",
            timestamp: new Date().toISOString(),
            remarks: remarks
        };
        await addLog(newLog);
        
        mutate('components');
        mutate('logs');

        toast({
            title: "Component Returned",
            description: `${logToReturn.quantity} of ${component.name} has been returned.`,
        });
        setIsReturnDialogOpen(false);
    } catch (error) {
        console.error("Failed to return component:", error);
        toast({ title: "Error", description: "Failed to return component.", variant: "destructive" });
    }
  }


  const filteredLogs = React.useMemo(() => {
    if (!logsData) return [];
    return logsData
      .filter((log) => {
        if (filter === "all") return true;
        return log.status.toLowerCase() === filter;
      })
      .filter(
        (log) =>
          log.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [logsData, searchTerm, filter]);

  const availableComponents = React.useMemo(() => componentsData?.filter(c => c.availableQuantity > 0) || [], [componentsData]);
  const borrowedLogs = React.useMemo(() => logsData?.filter(log => log.status === 'Borrowed') || [], [logsData]);
  
  const isLoading = !logsData && !logsError || !componentsData && !componentsError;

  const renderLoadingSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2 pt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            <Header onThemeChange={handleThemeChange} theme={theme} />
            <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-6">
              <Card className="bg-muted-background">
                  <CardContent className="p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                              <h3 className="text-lg font-medium">Transaction Controls</h3>
                              <p className="text-sm text-muted-foreground">Issue a new item or process a return.</p>
                          </div>
                          <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => setIsIssueDialogOpen(true)} disabled={isLoading}>
                                  <PlusCircle className="mr-2 h-4 w-4" /> Issue Item
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setIsReturnDialogOpen(true)} disabled={isLoading}>
                                  <MinusCircle className="mr-2 h-4 w-4" /> Return Item
                              </Button>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {isLoading ? renderLoadingSkeleton() : (
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Logs</CardTitle>
                    <CardDescription>
                        A log of all component borrows and returns.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search logs..."
                                className="w-full bg-background pl-9"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                            <Button variant={filter === 'borrowed' ? 'default' : 'outline'} onClick={() => setFilter('borrowed')}>Borrowed</Button>
                            <Button variant={filter === 'returned' ? 'default' : 'outline'} onClick={() => setFilter('returned')}>Returned</Button>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Component</TableHead>
                           <TableHead>Quantity</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                                <TableRow key={log.id}>
                                <TableCell className="font-medium">{log.componentName}</TableCell>
                                <TableCell>{log.quantity}</TableCell>
                                <TableCell>{log.userName}</TableCell>
                                <TableCell>
                                    <Badge variant={log.status === "Borrowed" ? "destructive" : "secondary"}>
                                    {log.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{format(new Date(log.timestamp), "PPP p")}</TableCell>
                                <TableCell>
                                    {log.remarks || "N/A"}
                                </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
          <IssueItemDialog 
              open={isIssueDialogOpen}
              onOpenChange={setIsIssueDialogOpen}
              components={availableComponents}
              onIssue={handleIssueItem}
          />
          <ReturnItemDialog
              open={isReturnDialogOpen}
              onOpenChange={setIsReturnDialogOpen}
              borrowedLogs={borrowedLogs}
              onReturn={(log, remarks) => handleReturnItem(log, remarks)}
          />
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
