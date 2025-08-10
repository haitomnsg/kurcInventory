
"use client"

import * as React from "react";
import type { Category } from "@/lib/types";
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
import { MoreHorizontal, PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

type CategoryManagerProps = {
  categories: Category[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onSearch: (term: string) => void;
};

export default function CategoryManager({ categories, onAdd, onUpdate, onDelete, onSearch }: CategoryManagerProps) {
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
    const [categoryName, setCategoryName] = React.useState("");

    const handleOpenForm = (category: Category | null = null) => {
        setEditingCategory(category);
        setCategoryName(category ? category.name : "");
        setIsFormOpen(true);
    }

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
        setCategoryName("");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryName.trim()) {
            if (editingCategory) {
                onUpdate(editingCategory.id, categoryName.trim());
            } else {
                onAdd(categoryName.trim());
            }
            handleCloseForm();
        }
    }


  return (
    <>
        <Card>
        <CardHeader>
            <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                    Manage component categories.
                    </CardDescription>
                </div>
                 <Button size="sm" className="gap-1" onClick={() => handleOpenForm()}>
                    <PlusCircle className="h-4 w-4" />
                    Add Category
                </Button>
            </div>
             <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search categories..."
                    className="w-full bg-background pl-9"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenForm(category)}><Pencil className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(category.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
        </Card>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingCategory ? "Edit" : "Add"} Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="py-4">
                        <Input 
                            placeholder="Category name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={handleCloseForm}>Cancel</Button>
                        <Button type="submit">{editingCategory ? "Update" : "Add"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </>
  );
}
