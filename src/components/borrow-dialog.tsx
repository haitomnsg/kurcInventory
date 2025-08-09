"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { AlertCircle, Calendar as CalendarIcon, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";

const borrowSchema = z.object({
  purpose: z.string().min(10, { message: "Please provide a more detailed purpose." }),
  expectedReturnDate: z.date({
    required_error: "An expected return date is required.",
  }),
});

type BorrowFormValues = z.infer<typeof borrowSchema>;

type BorrowDialogProps = {
  component: Component;
  onBorrow: (details: BorrowFormValues) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BorrowDialog({ component, onBorrow, open, onOpenChange }: BorrowDialogProps) {
  const [isChecking, setIsChecking] = React.useState(false);
  const [aiWarning, setAiWarning] = React.useState<string | null>(null);

  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowSchema),
    defaultValues: {
      purpose: "",
    },
  });

  const purposeValue = form.watch("purpose");

  React.useEffect(() => {
    if (purposeValue && purposeValue.trim().length >= 10) {
      const handler = setTimeout(async () => {
        setIsChecking(true);
        setAiWarning(null);
        try {
          const result = await borrowingSanityCheck({ purpose: purposeValue, componentName: component.name });
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
  }, [purposeValue, component.name]);


  const onSubmit = (data: BorrowFormValues) => {
    if (!aiWarning) {
      onBorrow(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Borrow: {component.name}</DialogTitle>
          <DialogDescription>
            Please provide the following details to borrow this component.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            "w-[240px] pl-3 text-left font-normal",
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
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isChecking || !!aiWarning}>
                Confirm Borrow
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
