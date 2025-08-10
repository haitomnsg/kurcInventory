
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import type { Component } from "@/lib/types";
import { borrowingSanityCheck } from "@/ai/flows/borrowing-sanity-check";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


const issueItemSchema = z.object({
  componentId: z.string().min(1, "Please select a component."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  userName: z.string().min(1, "User name is required."),
  contactNumber: z.string().min(1, "Contact number is required."),
  purpose: z.string().min(10, { message: "Please provide a more detailed purpose." }),
  expectedReturnDate: z.date({
    required_error: "An expected return date is required.",
  }),
});

type IssueItemFormValues = z.infer<typeof issueItemSchema>;

type IssueItemDialogProps = {
  components: Component[];
  onIssue: (details: IssueItemFormValues) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function IssueItemDialog({ components, onIssue, open, onOpenChange }: IssueItemDialogProps) {
    const [isChecking, setIsChecking] = React.useState(false);
    const [aiWarning, setAiWarning] = React.useState<string | null>(null);

  const form = useForm<IssueItemFormValues>({
    resolver: zodResolver(issueItemSchema),
    defaultValues: {
      componentId: "",
      quantity: 1,
      userName: "",
      contactNumber: "",
      purpose: "",
    },
  });

  const purposeValue = form.watch("purpose");
  const componentIdValue = form.watch("componentId");
  
  const componentName = React.useMemo(() => {
    return components.find(c => c.id === componentIdValue)?.name || 'component';
  }, [componentIdValue, components]);

  React.useEffect(() => {
    if (purposeValue && purposeValue.trim().length >= 10) {
      const handler = setTimeout(async () => {
        setIsChecking(true);
        setAiWarning(null);
        try {
          const result = await borrowingSanityCheck({ purpose: purposeValue, componentName: componentName });
          if (!result.isSafe) {
            setAiWarning(result.warningMessage);
          }
        } catch (error) {
          console.error("AI check failed:", error);
          setAiWarning("Could not verify purpose. Please try again.");
        } finally {
          setIsChecking(false);
        }
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [purposeValue, componentName]);
  
  const handleOpenChange = (isOpen: boolean) => {
    if(!isOpen) {
      form.reset();
      setAiWarning(null);
    }
    onOpenChange(isOpen);
  }

  const onSubmit = (data: IssueItemFormValues) => {
    if (!aiWarning) {
      onIssue(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Issue New Component</DialogTitle>
          <DialogDescription>
            Select a component and fill in the details for the borrower.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="componentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Component</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a component" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {components.map(component => (
                                <SelectItem key={component.id} value={component.id!}>
                                    {component.name} ({component.availableQuantity} available)
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
                name="quantity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Quantity to Issue</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrower's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrower's Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 98xxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedReturnDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expected Return Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., For final year project on line-following robots."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {isChecking && (
                    <FormDescription className="flex items-center gap-2">
                       <Loader2 className="h-4 w-4 animate-spin" />
                       Checking purpose against club rules...
                    </FormDescription>
                   )}
                  {aiWarning && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Purpose Warning</AlertTitle>
                      <AlertDescription>{aiWarning}</AlertDescription>
                    </Alert>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isChecking || !!aiWarning}>Issue Component</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
