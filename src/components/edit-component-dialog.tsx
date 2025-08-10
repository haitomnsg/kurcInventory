
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Component, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const editComponentSchema = z.object({
  name: z.string().min(1, "Name is required."),
  category: z.string().min(1, "Category is required."),
  totalQuantity: z.coerce.number().min(0, "Quantity must be 0 or more."),
  condition: z.enum(["New", "Good", "Fair", "Poor"]),
  description: z.string().min(1, "Description is required."),
});

type EditComponentFormValues = z.infer<typeof editComponentSchema>;

type EditComponentDialogProps = {
  component: Component;
  onEditComponent: (data: EditComponentFormValues) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
};

export function EditComponentDialog({ component, onEditComponent, open, onOpenChange, categories }: EditComponentDialogProps) {
  const form = useForm<EditComponentFormValues>({
    resolver: zodResolver(editComponentSchema),
    defaultValues: {
      name: component.name,
      category: component.category,
      totalQuantity: component.totalQuantity,
      condition: component.condition,
      description: component.description,
    },
  });

  React.useEffect(() => {
    if (component) {
        form.reset({
            name: component.name,
            category: component.category,
            totalQuantity: component.totalQuantity,
            condition: component.condition,
            description: component.description,
        });
    }
  }, [component, form]);
  
  const handleOpenChange = (isOpen: boolean) => {
      onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Component</DialogTitle>
          <DialogDescription>
            Update the details for "{component.name}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEditComponent)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Component Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Arduino Uno" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="totalQuantity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a condition" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Standard Arduino board for various robotics projects."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
