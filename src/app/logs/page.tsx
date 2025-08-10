
"use client";

import * as React from "react";
import type { Log, Component } from "@/lib/types";
import { mockLogs, mockComponents } from "@/lib/data";
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

type EnrichedLog = Log & {
  expectedReturnDate?: string;
};

export default function LogsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");
  const [componentsData, setComponentsData] = React.useState<Component[]>(mockComponents);
  
  const [logsData, setLogsData] = React.useState<EnrichedLog[]>(() => {
    return mockLogs.map(log => {
        if (log.action === 'Borrowed') {
            const component = mockComponents.find(c => c.name === log.componentName && c.status === 'Borrowed');
            return {
                ...log,
                expectedReturnDate: component?.expectedReturnDate
            }
        }
        return log;
    })
  });

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

  const handleIssueItem = (details: { componentId: string; userName: string; purpose: string; expectedReturnDate: Date; }) => {
    const component = componentsData.find(c => c.id === details.componentId);
    if (!component) return;

    setComponentsData(prev =>
      prev.map(c =>
        c.id === details.componentId ? { ...c, status: "Borrowed", borrowedBy: details.userName, expectedReturnDate: details.expectedReturnDate.toISOString().split('T')[0] } : c
      )
    );
    const newLog: EnrichedLog = {
      id: (logsData.length + 1).toString(),
      componentName: component.name,
      userName: details.userName,
      action: "Borrowed",
      timestamp: new Date().toISOString(),
      expectedReturnDate: details.expectedReturnDate.toISOString().split('T')[0]
    };
    setLogsData(prev => [newLog, ...prev]);

    toast({
      title: "Component Issued",
      description: `${component.name} has been issued to ${details.userName}.`,
    });
    setIsIssueDialogOpen(false);
  }

  const handleReturnItem = (componentId: string, remarks: string) => {
    const component = componentsData.find(c => c.id === componentId);
    if (!component) return;
    
    setComponentsData(prev =>
        prev.map(c =>
            c.id === componentId ? { ...c, status: 'Available', borrowedBy: undefined, expectedReturnDate: undefined } : c
        )
    );
     const newLog: EnrichedLog = {
      id: (logsData.length + 1).toString(),
      componentName: component.name,
      userName: component.borrowedBy || 'Unknown',
      action: "Returned",
      timestamp: new Date().toISOString(),
    };
    setLogsData(prev => [newLog, ...prev]);

    toast({
      title: "Component Returned",
      description: `${component.name} has been returned.`,
    });
    setIsReturnDialogOpen(false);
  }

  const filteredLogs = React.useMemo(() => {
    let logs = [...logsData];

    // Re-enrich logs with latest component data
    logs = logs.map(log => {
      if (log.action === 'Borrowed') {
        const component = componentsData.find(c => c.name === log.componentName && c.status === 'Borrowed');
        // if component is not found among borrowed, it means it was returned.
        // But we might want to keep the log.
        // For this mock, let's just use what's there.
        return {
          ...log,
          expectedReturnDate: component?.expectedReturnDate
        }
      }
      return log;
    })


    return logs
      .filter((log) => {
        if (filter === "all") return true;
        if (filter === 'borrowed') {
            const component = componentsData.find(c => c.name === log.componentName);
            return log.action.toLowerCase() === filter && component?.status === 'Borrowed';
        }
        return log.action.toLowerCase() === filter;
      })
      .filter(
        (log) =>
          log.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logsData, searchTerm, filter, componentsData]);

  const availableComponents = React.useMemo(() => componentsData.filter(c => c.status === 'Available'), [componentsData]);
  const borrowedComponents = React.useMemo(() => componentsData.filter(c => c.status === 'Borrowed'), [componentsData]);


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header onThemeChange={handleThemeChange} theme={theme} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Transaction Logs</CardTitle>
                        <CardDescription>
                            A log of all component borrows and returns.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsIssueDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Issue Item
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsReturnDialogOpen(true)}>
                            <MinusCircle className="mr-2 h-4 w-4" /> Return Item
                        </Button>
                    </div>
                </div>
                 <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
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
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Expected Return</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.componentName}</TableCell>
                        <TableCell>{log.userName}</TableCell>
                        <TableCell>
                          <Badge variant={log.action === "Borrowed" ? "destructive" : "secondary"}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(log.timestamp), "PPP")}</TableCell>
                        <TableCell>
                          {log.expectedReturnDate
                            ? format(new Date(log.expectedReturnDate), "PPP")
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
            components={borrowedComponents}
            onReturn={handleReturnItem}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
