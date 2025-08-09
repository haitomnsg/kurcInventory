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
};

export default function ComponentTable({ components, user, onBorrow }: ComponentTableProps) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>
                Browse and manage all available components.
                </CardDescription>
            </div>
            {user.role === 'admin' && (
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Add Component
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((component) => (
              <TableRow key={component.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={component.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={component.imageUrl}
                    width="64"
                    data-ai-hint={component.aiHint}
                  />
                </TableCell>
                <TableCell className="font-medium">{component.name}</TableCell>
                <TableCell>
                  <Badge variant={component.status === 'Available' ? 'secondary' : 'destructive'} className="flex items-center gap-1 w-fit">
                    {component.status === 'Available' ? 
                      <CheckCircle2 className="h-3 w-3 text-green-600" /> : 
                      <XCircle className="h-3 w-3 text-white" />
                    }
                    <span className={component.status === "Borrowed" ? "text-white" : ""}>{component.status}</span>
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{component.category}</TableCell>
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
      </CardContent>
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
    </Card>
  );
}
