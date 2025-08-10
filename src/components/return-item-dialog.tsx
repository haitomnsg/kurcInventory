
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

const returnItemSchema = z.object({
  borrowerName: z.string().min(1, "Please select a borrower."),
  componentId: z.string().min(1, "Please select a component to return."),
  returnDate: z.date({ required_error: "A return date is required." }),
  remarks: z.string().optional(),
});

type ReturnItemFormValues = z.infer<typeof returnItemSchema>;

type ReturnItemDialogProps = {
  components: Component[]; // Should be only borrowed components
  onReturn: (componentId: string, remarks: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReturnItemDialog({ components, onReturn, open, onOpenChange }: ReturnItemDialogProps) {
  const [isBorrowerPopoverOpen, setIsBorrowerPopoverOpen] = React.useState(false);
  const [isComponentPopoverOpen, setIsComponentPopoverOpen] = React.useState(false);

  const form = useForm<ReturnItemFormValues>({
    resolver: zodResolver(returnItemSchema),
    defaultValues: {
      borrowerName: "",
      componentId: "",
      returnDate: new Date(),
      remarks: "",
    },
  });

  const selectedBorrower = form.watch("borrowerName");

  const borrowers = React.useMemo(() => {
    const borrowerSet = new Set(components.map(c => c.borrowedBy).filter(Boolean) as string[]);
    return Array.from(borrowerSet);
  }, [components]);

  const componentsForBorrower = React.useMemo(() => {
    if (!selectedBorrower) return [];
    return components.filter(c => c.borrowedBy === selectedBorrower);
  }, [components, selectedBorrower]);
  
  React.useEffect(() => {
    // Reset componentId when borrower changes
    form.setValue("componentId", "");
  }, [selectedBorrower, form]);

  const onSubmit = (data: ReturnItemFormValues) => {
    onReturn(data.componentId, data.remarks || "");
    handleOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset({
        borrowerName: "",
        componentId: "",
        returnDate: new Date(),
        remarks: "",
      });
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Return Component</DialogTitle>
          <DialogDescription>
            Select the borrower and the component being returned.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="borrowerName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Borrower's Name</FormLabel>
                  <Popover open={isBorrowerPopoverOpen} onOpenChange={setIsBorrowerPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value || "Select a borrower"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search borrower..." />
                        <CommandEmpty>No borrower found.</CommandEmpty>
                        <CommandGroup>
                          {borrowers.map((borrower) => (
                            <CommandItem
                              value={borrower}
                              key={borrower}
                              onSelect={(currentValue) => {
                                form.setValue("borrowerName", currentValue === field.value ? "" : currentValue);
                                setIsBorrowerPopoverOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", borrower === field.value ? "opacity-100" : "opacity-0")} />
                              {borrower}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedBorrower && (
              <FormField
                control={form.control}
                name="componentId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Component</FormLabel>
                    <Popover open={isComponentPopoverOpen} onOpenChange={setIsComponentPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            disabled={!componentsForBorrower.length}
                          >
                            {field.value ? components.find(c => c.id === field.value)?.name : "Select a component"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search component..." />
                          <CommandEmpty>No component found for this borrower.</CommandEmpty>
                          <CommandGroup>
                            {componentsForBorrower.map((component) => (
                              <CommandItem
                                value={component.name}
                                key={component.id}
                                onSelect={() => {
                                  form.setValue("componentId", component.id || "");
                                  setIsComponentPopoverOpen(false);
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", component.id === field.value ? "opacity-100" : "opacity-0")} />
                                {component.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Return Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
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
                    <Textarea placeholder="e.g., Component was returned in good condition." {...field} />
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
