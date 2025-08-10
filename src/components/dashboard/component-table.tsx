
"use client";

import * as React from "react";
import type { Component } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

type ComponentTableProps = {
  components: Component[];
  onAddComponent?: () => void;
  onEditComponent?: (component: Component) => void;
  onDeleteComponent?: (component: Component) => void;
  onSearch?: (term: string) => void;
  minimal?: boolean;
};

export default function ComponentTable({ components, onAddComponent, onEditComponent, onDeleteComponent, onSearch, minimal = false }: ComponentTableProps) {
  
  const tableContent = (
     <Table>
        <TableHeader>
          <TableRow>
            {!minimal && <TableHead className="w-[50px]">S.N.</TableHead>}
            <TableHead>Name</TableHead>
            {!minimal && <TableHead className="hidden md:table-cell">Category</TableHead>}
            <TableHead className="hidden md:table-cell text-right">Total</TableHead>
            <TableHead className="text-right">Available</TableHead>
            {!minimal && <TableHead className="text-right w-[120px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.length > 0 ? (
            components.map((component, index) => (
              <TableRow key={component.id}>
                {!minimal && <TableCell className="font-medium">{index + 1}</TableCell>}
                <TableCell className="font-medium">{component.name}</TableCell>
                {!minimal && <TableCell className="hidden md:table-cell">{component.category}</TableCell>}
                <TableCell className="hidden md:table-cell text-right">{component.totalQuantity}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={component.availableQuantity > 0 ? "secondary" : "destructive"}>
                    {component.availableQuantity}
                  </Badge>
                </TableCell>
                {!minimal && (
                  <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                          {onEditComponent &&
                              <Button variant="outline" size="icon" onClick={() => onEditComponent(component)}>
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                              </Button>
                          }
                          {onDeleteComponent &&
                              <Button variant="destructive" size="icon" onClick={() => onDeleteComponent(component)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                              </Button>
                          }
                      </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
             <TableRow>
                <TableCell colSpan={minimal ? 3 : 6} className="h-24 text-center">
                    No components found.
                </TableCell>
             </TableRow>
          )}
        </TableBody>
      </Table>
  )

  if (minimal) {
    return <div>{tableContent}</div>
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>
                Browse and manage all available components.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                {onSearch && (
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search components..."
                            className="w-full bg-background pl-9"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                )}
                {onAddComponent && (
                    <Button size="sm" className="gap-1" onClick={onAddComponent}>
                        <PlusCircle className="h-4 w-4" />
                        Add Component
                    </Button>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent>
       {tableContent}
      </CardContent>
      </Card>
    </>
  );
}
