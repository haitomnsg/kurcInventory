
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import type { Log } from "@/lib/types";

type DeleteLogDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirmDelete: () => void;
    logEntry: Log;
};

export function DeleteLogDialog({ open, onOpenChange, onConfirmDelete, logEntry }: DeleteLogDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the log entry for 
            <span className="font-semibold"> {logEntry.userName}'s</span> loan of 
            <span className="font-semibold"> {logEntry.quantity}x {logEntry.componentName}</span>. 
            If the item was borrowed, this will also revert the available quantity in the inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className={buttonVariants({ variant: "destructive" })}
          >
            Delete Log Entry
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
