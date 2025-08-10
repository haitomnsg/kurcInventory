
"use client";

import type { Log } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

type RecentActivityProps = {
  logs: Log[];
};

export default function RecentActivity({ logs }: RecentActivityProps) {
  return (
    <div className="grid gap-6">
      {logs.map((log) => (
        <div key={log.id} className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src={`https://placehold.co/40x40.png`} alt="Avatar" data-ai-hint="user avatar"/>
            <AvatarFallback>{log.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">
              {log.userName}
              <span className="text-sm text-muted-foreground font-normal ml-1">
                {log.status === 'Borrowed' ? 'borrowed' : 'returned'} the
              </span>
              <span className="font-medium"> {log.componentName}</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
