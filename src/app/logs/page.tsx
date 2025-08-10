
"use client";

import * as React from "react";
import useSWR, { mutate } from 'swr';
import type { Log, Component } from "@/lib/types";
import { fetchLogs, fetchComponents, addLog, updateLog, deleteLog, updateComponent } from "@/lib/data-service";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import Header from "@/components/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, MinusCircle, Pencil, Trash2 } from "lucide-react";
import { IssueItemDialog } from "@/components/issue-item-dialog";
import { ReturnItemDialog } from "@/components/return-item-dialog";
import { EditLogDialog } from "@/components/edit-log-dialog";
import { DeleteLogDialog } from "@/components/delete-log-dialog";
import { Separator } from "@/components/ui/separator";
import AuthGuard from "@/components/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";

export default function LogsPage() {
  const { toast } = useToast();
  const [user, setUser] = React.useState<User | null>(null);
  
  const { data: logsData, error: logsError } = useSWR<Log[]>('logs', fetchLogs);
  const { data: componentsData, error: componentsError } = useSWR<Component[]>('components', fetchComponents);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "borrowed" | "returned">("all");
  const [isIssueDialogOpen, setIsIssueDialogOpen] = React.useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<Log | null>(null);


  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenEditDialog = (log: Log) => {
    setSelectedLog(log);
    setIsEditDialogOpen(true);
  }

  const handleOpenDeleteDialog = (log: Log) => {
    setSelectedLog(log);
    setIsDeleteDialogOpen(true);
  }


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
            issueDate: new Date().toISOString(),
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

  const handleReturnItem = async (logToReturn: Log, returnDetails: { returnDate: Date, remarks: string }) => {
    if (!logToReturn?.id || !logToReturn?.componentId) return;

    const component = componentsData?.find(c => c.id === logToReturn.componentId);
    if (!component || !component.id) return;

    try {
      await updateComponent(component.id, {
        availableQuantity: component.availableQuantity + logToReturn.quantity,
      });

      await updateLog(logToReturn.id, {
        status: 'Returned',
        returnDate: returnDetails.returnDate.toISOString(),
        remarks: returnDetails.remarks,
      });

      mutate('logs');
      mutate('components');

      toast({
        title: "Component Returned",
        description: `${logToReturn.quantity} of ${logToReturn.componentName} has been returned.`,
      });
      setIsReturnDialogOpen(false);
    } catch (error) {
      console.error("Failed to return component:", error);
      toast({ title: "Error", description: "Failed to return component.", variant: "destructive" });
    }
  }

  const handleUpdateLog = async (logDetails: Partial<Log>) => {
    if (!selectedLog || !selectedLog.id) return;
    try {
      await updateLog(selectedLog.id, logDetails);
      mutate('logs');
      toast({ title: "Log Updated", description: "The log entry has been successfully updated." });
      setIsEditDialogOpen(false);
      setSelectedLog(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update log.", variant: "destructive" });
    }
  }

  const handleDeleteLog = async () => {
    if (!selectedLog || !selectedLog.id) return;
    
    // Revert inventory quantity if deleting a "Borrowed" log
    if (selectedLog.status === 'Borrowed') {
        const component = componentsData?.find(c => c.id === selectedLog.componentId);
        if (component) {
            await updateComponent(component.id, {
                availableQuantity: component.availableQuantity + selectedLog.quantity
            });
        }
    }

    try {
        await deleteLog(selectedLog.id);
        mutate('logs');
        mutate('components');
        toast({ title: "Log Deleted", description: "The log entry has been successfully deleted." });
        setIsDeleteDialogOpen(false);
        setSelectedLog(null);
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete log.", variant: "destructive" });
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
            <Header user={user} />
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
                              <Button variant="outline" size="sm" onClick={() => setIsReturnDialogOpen(true)} disabled={isLoading || borrowedLogs.length === 0}>
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
                          <TableHead>S.N.</TableHead>
                          <TableHead>Component</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Return Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, index) => (
                                <TableRow key={log.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{log.componentName}</TableCell>
                                <TableCell>{log.userName}</TableCell>
                                <TableCell>{log.quantity}</TableCell>
                                <TableCell>{format(new Date(log.issueDate), "PPP")}</TableCell>
                                <TableCell>
                                    {log.returnDate ? format(new Date(log.returnDate), "PPP") : "N/A"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={log.status === "Borrowed" ? "destructive" : "secondary"}>
                                    {log.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="icon" onClick={() => handleOpenEditDialog(log)}>
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => handleOpenDeleteDialog(log)}>
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-24">
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
              onReturn={handleReturnItem}
          />
          {selectedLog && (
            <>
                <EditLogDialog
                    open={isEditDialogOpen}
                    onOpenChange={(open) => {
                        if (!open) setSelectedLog(null);
                        setIsEditDialogOpen(open);
                    }}
                    onUpdateLog={handleUpdateLog}
                    log={selectedLog}
                    components={componentsData || []}
                />
                <DeleteLogDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={(open) => {
                        if (!open) setSelectedLog(null);
                        setIsDeleteDialogOpen(open);
                    }}
                    onConfirmDelete={handleDeleteLog}
                    logEntry={selectedLog}
                />
            </>
          )}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
