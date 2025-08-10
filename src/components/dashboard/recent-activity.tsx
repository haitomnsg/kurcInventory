
"use client";

import type { Log } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

type RecentActivityProps = {
  logs: Log[];
};

export default function RecentActivity({ logs }: RecentActivityProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length > 0 ? (
            logs.map((log) => (
            <TableRow key={log.id}>
                <TableCell className="font-medium">{log.componentName}</TableCell>
                <TableCell>{log.userName}</TableCell>
                <TableCell>
                <Badge variant={log.status === "Borrowed" ? "destructive" : "secondary"}>
                    {log.status}
                </Badge>
                </TableCell>
                <TableCell>{format(new Date(log.timestamp), "PPP")}</TableCell>
            </TableRow>
            ))
        ) : (
            <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                    No recent activity.
                </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
