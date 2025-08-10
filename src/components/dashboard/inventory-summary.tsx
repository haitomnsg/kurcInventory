"use client";

import type { Component } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, PackageCheck, PackageOpen } from "lucide-react";
import * as React from "react";

type InventorySummaryProps = {
  components: Component[];
};

export default function InventorySummary({ components }: InventorySummaryProps) {
  const summary = React.useMemo(() => {
    const total = components.reduce((sum, item) => sum + item.totalQuantity, 0);
    const available = components.reduce((sum, item) => sum + item.availableQuantity, 0);
    const borrowed = total - available;
    return { total, borrowed, available };
  }, [components]);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Components
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-muted-foreground">
              Total items in inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Borrowed
            </CardTitle>
            <PackageOpen className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.borrowed}</div>
            <p className="text-xs text-muted-foreground">
              Components currently on loan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <PackageCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.available}</div>
            <p className="text-xs text-muted-foreground">
              Items ready to be borrowed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
