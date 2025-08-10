
"use client";

import * as React from "react";
import Image from "next/image";
import type { Component } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
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
import { MoreHorizontal, PlusCircle, CheckCircle2, XCircle, Pencil, Trash2, Search, PackagePlus, PackageCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BorrowDialog } from "../borrow-dialog";
import { Input } from "../ui/input";

type ComponentTableProps = {
  components: Component[];
  onBorrow: (component: Component, details: { expectedReturnDate: Date; purpose:string }) => void;
  onReturn: (component: Component) => void;
  onAddComponent?: () => void;
  onSearch?: (term: string) => void;
  minimal?: boolean;
};

export default function ComponentTable({ components, onBorrow, onReturn, onAddComponent, onSearch, minimal = false }: ComponentTableProps) {
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = React.useState(false);
  const [selectedComponent, setSelectedComponent] = React.useState<Component | null>(null);

  const handleBorrowClick = (component: Component) => {
    setSelectedComponent(component);
    setIsBorrowDialogOpen(true);
  };

  const handleReturnClick = (component: Component) => {
    onReturn(component);
  }
  
  const handleDialogClose = () => {
    setIsBorrowDialogOpen(false);
    setSelectedComponent(null);
  }

  const tableContent = (
     <Table>
        <TableHeader>
          <TableRow>
            {!minimal && <TableHead className="w-[50px]">S.N.</TableHead>}
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            {!minimal && <TableHead className="hidden md:table-cell">Category</TableHead>}
            {!minimal && <TableHead className="hidden md:table-cell">Quantity</TableHead>}
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((component, index) => (
            <TableRow key={component.id}>
              {!minimal && <TableCell className="font-medium">{index + 1}</TableCell>}
              <TableCell className="font-medium">{component.name}</TableCell>
              <TableCell>
                <Badge variant={component.status === 'Available' ? 'outline' : 'destructive'} className="flex items-center gap-1 w-fit">
                  {component.status === 'Available' ? 
                    <CheckCircle2 className="h-3 w-3 text-green-600" /> : 
                    <XCircle className="h-3 w-3" />
                  }
                  <span>{component.status}</span>
                </Badge>
              </TableCell>
              {!minimal && <TableCell className="hidden md:table-cell">{component.category}</TableCell>}
              {!minimal && <TableCell className="hidden md:table-cell">{component.quantity}</TableCell>}
              <TableCell>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {component.status === 'Available' ? (
                            <DropdownMenuItem onClick={() => handleBorrowClick(component)}>
                                <PackagePlus className="mr-2 h-4 w-4" />
                                Borrow
                            </DropdownMenuItem>
                        ) : (
                             <DropdownMenuItem onClick={() => handleReturnClick(component)}>
                                <PackageCheck className="mr-2 h-4 w-4" />
                                Return
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  )

  if (minimal) {
    return (
        <div>
            {tableContent}
            {selectedComponent && (
                <BorrowDialog
                    open={isBorrowDialogOpen}
                    onOpenChange={handleDialogClose}
                    component={selectedComponent}
                    onBorrow={(details) => {
                        onBorrow(selectedComponent, details);
                        handleDialogClose();
                    }}
                />
            )}
        </div>
    )
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
      {selectedComponent && (
        <BorrowDialog
            open={isBorrowDialogOpen}
            onOpenChange={handleDialogClose}
            component={selectedComponent}
            onBorrow={(details) => {
                onBorrow(selectedComponent, details);
                handleDialogClose();
            }}
        />
      )}
    </>
  );
}
