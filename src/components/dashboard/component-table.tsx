
"use client";

import * as React from "react";
import Image from "next/image";
import type { Component, User } from "@/lib/types";
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
import { MoreHorizontal, PlusCircle, CheckCircle2, XCircle, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BorrowDialog } from "../borrow-dialog";

type ComponentTableProps = {
  components: Component[];
  user: User;
  onBorrow: (component: Component, details: { expectedReturnDate: Date; purpose:string }) => void;
  onAddComponent?: () => void;
  minimal?: boolean;
};

export default function ComponentTable({ components, user, onBorrow, onAddComponent, minimal = false }: ComponentTableProps) {
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = React.useState(false);
  const [selectedComponent, setSelectedComponent] = React.useState<Component | null>(null);

  const handleBorrowClick = (component: Component) => {
    setSelectedComponent(component);
    setIsBorrowDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsBorrowDialogOpen(false);
    setSelectedComponent(null);
  }

  const tableContent = (
     <Table>
        <TableHeader>
          <TableRow>
            {!minimal && <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>}
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
          {components.map((component) => (
            <TableRow key={component.id}>
              {!minimal && <TableCell className="hidden sm:table-cell">
                <Image
                  alt={component.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={component.imageUrl}
                  width="64"
                  data-ai-hint={component.aiHint}
                />
              </TableCell>}
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
                {user.role === 'admin' ? (
                   <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button aria-haspopup="true" size="icon" variant="ghost">
                       <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">Toggle menu</span>
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     <DropdownMenuItem><Pencil className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                     <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
                ) : (
                  <Button size="sm" onClick={() => handleBorrowClick(component)} disabled={component.status === 'Borrowed'}>Borrow</Button>
                )}
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
                    onOpenChange={setIsBorrowDialogOpen}
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
            Browse and manage all available components.
            </CardDescription>
        </div>
        {user.role === 'admin' && onAddComponent && (
            <Button size="sm" className="gap-1" onClick={onAddComponent}>
                <PlusCircle className="h-4 w-4" />
                Add Component
            </Button>
        )}
      </CardHeader>
      <CardContent>
       {tableContent}
      </CardContent>
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
    </Card>
  );
}
