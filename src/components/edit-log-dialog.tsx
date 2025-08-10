
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Log, Component } from "@/lib/types";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

const editLogSchema = z.object({
  userName: z.string().min(1, "User name is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  issueDate: z.date(),
  returnDate: z.date().optional(),
  status: z.enum(["Borrowed", "Returned"]),
  remarks: z.string().optional(),
});

type EditLogFormValues = z.infer<typeof editLogSchema>;

type EditLogDialogProps = {
  log: Log;
  components: Component[];
  onUpdateLog: (data: Partial<Log>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditLogDialog({ log, components, onUpdateLog, open, onOpenChange }: EditLogDialogProps) {
  const form = useForm<EditLogFormValues>({
    resolver: zodResolver(editLogSchema),
    defaultValues: {
      userName: log.userName,
      quantity: log.quantity,
      issueDate: new Date(log.issueDate),
      returnDate: log.returnDate ? new Date(log.returnDate) : undefined,
      status: log.status,
      remarks: log.remarks || "",
    },
  });

  React.useEffect(() => {
    if (log) {
      form.reset({
        userName: log.userName,
        quantity: log.quantity,
        issueDate: new Date(log.issueDate),
        returnDate: log.returnDate ? new Date(log.returnDate) : undefined,
        status: log.status,
        remarks: log.remarks || "",
      });
    }
  }, [log, form]);

  const onSubmit = (data: EditLogFormValues) => {
    const updatedLogData: Partial<Log> = {
      ...data,
      issueDate: data.issueDate.toISOString(),
      returnDate: data.returnDate ? data.returnDate.toISOString() : undefined,
    };
    onUpdateLog(updatedLogData);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
      onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Log: {log.componentName}</DialogTitle>
          <DialogDescription>
            Update the details for this log entry.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Issue Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Return Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>(Not returned)</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Status</FormLabel>
                        <FormDescription>
                            Is this item currently borrowed or returned?
                        </FormDescription>
                    </div>
                    <FormControl>
                        <div className="flex items-center space-x-2">
                            <span className={cn(field.value === "Returned" && "text-muted-foreground")}>Borrowed</span>
                            <Switch
                                checked={field.value === 'Returned'}
                                onCheckedChange={(checked) => field.onChange(checked ? 'Returned' : 'Borrowed')}
                            />
                            <span className={cn(field.value === "Borrowed" && "text-muted-foreground")}>Returned</span>
                        </div>
                    </FormControl>
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any remarks here..." {...field} />
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
