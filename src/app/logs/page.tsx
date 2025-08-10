
"use client";

import * as React from "react";
import type { Log, Component } from "@/lib/types";
import { mockLogs, mockComponents } from "@/lib/data";
import { format } from "date-fns";

import Header from "@/components/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type EnrichedLog = Log & {
  expectedReturnDate?: string;
};

export default function LogsPage() {
  const [theme, setTheme] = React.useState("light");
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

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const filteredLogs = React.useMemo(() => {
    return logsData
      .filter((log) => {
        if (filter === "all") return true;
        return log.action.toLowerCase() === filter;
      })
      .filter(
        (log) =>
          log.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [logsData, searchTerm, filter]);

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
                        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                        <Button variant={filter === 'borrowed' ? 'default' : 'outline'} onClick={() => setFilter('borrowed')}>Borrowed</Button>
                        <Button variant={filter === 'returned' ? 'default' : 'outline'} onClick={() => setFilter('returned')}>Returned</Button>
                    </div>
                </div>
                 <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search logs..."
                        className="w-full bg-background pl-9"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
      </SidebarInset>
    </SidebarProvider>
  );
}
