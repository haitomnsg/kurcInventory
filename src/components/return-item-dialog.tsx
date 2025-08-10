
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Component } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";


const returnItemSchema = z.object({
  componentId: z.string().min(1, "Please select a component to return."),
  remarks: z.string().optional(),
});

type ReturnItemFormValues = z.infer<typeof returnItemSchema>;

type ReturnItemDialogProps = {
  components: Component[];
  onReturn: (componentId: string, remarks: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedComponentId?: string;
};

export function ReturnItemDialog({ components, onReturn, open, onOpenChange, selectedComponentId }: ReturnItemDialogProps) {
  const form = useForm<ReturnItemFormValues>({
    resolver: zodResolver(returnItemSchema),
    defaultValues: {
        componentId: selectedComponentId || "",
        remarks: ""
    }
  });
  
  React.useEffect(() => {
    if (selectedComponentId) {
        form.setValue("componentId", selectedComponentId);
    }
  }, [selectedComponentId, form])

  const onSubmit = (data: ReturnItemFormValues) => {
    onReturn(data.componentId, data.remarks || "");
  };

  const handleOpenChange = (isOpen: boolean) => {
    if(!isOpen) {
      form.reset({ componentId: "", remarks: ""});
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Return Component</DialogTitle>
          <DialogDescription>
            Select a component that is being returned.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="componentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrowed Component</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!selectedComponentId}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a component" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {components.map(component => (
                                <SelectItem key={component.id} value={component.id}>
                                    {component.name} (Borrowed by: {component.borrowedBy}, Due: {component.expectedReturnDate ? format(new Date(component.expectedReturnDate), "PPP") : 'N/A'})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Component was returned in good condition."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button type="submit">Confirm Return</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
