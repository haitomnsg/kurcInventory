
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Pencil, Trash2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type CategoryManagerProps = {
  categories: Category[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onSearch: (term: string) => void;
};

function CategoryManager({ categories, onAdd, onUpdate, onDelete, onSearch }: CategoryManagerProps) {
    const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
    const [categoryName, setCategoryName] = React.useState("");

    const handleSelectForEdit = (category: Category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
    }
    
    const handleCancelEdit = () => {
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
            handleCancelEdit();
        }
    }


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-2">
            <CardHeader>
                <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                    <div>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>
                        Manage component categories.
                        </CardDescription>
                    </div>
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
                        <TableHead className="w-[120px]">Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleSelectForEdit(category)}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={() => onDelete(category.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
             <CardHeader>
                <CardTitle>{editingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
                <CardDescription>{editingCategory ? `Update the details for "${editingCategory.name}".` : "Create a new category for components."}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input 
                            id="category-name"
                            placeholder="e.g., Actuators"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {editingCategory && <Button type="button" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>}
                    <Button type="submit">{editingCategory ? "Update Category" : "Add Category"}</Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}

export default React.memo(CategoryManager);
