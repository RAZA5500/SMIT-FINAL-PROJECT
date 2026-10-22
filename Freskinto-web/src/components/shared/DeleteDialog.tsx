"use client";

import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogText,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingButton } from "./LoadingButton";

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  /** Non-destructive confirms (e.g. "Activate customer") ke liye */
  confirmVariant?: "destructive" | "default";
  icon?: ReactNode;
}

/**
 * Pattern A — simple confirmation modal: `{ open, onConfirm, title, description, isLoading }`.
 * Rich destructive confirmations ke liye Pattern B (`StandardDestructiveModal`).
 */
export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete this item?",
  description = "This action will remove the record from your store.",
  confirmLabel = "Delete",
  isLoading = false,
  confirmVariant = "destructive",
  icon,
}: DeleteDialogProps) {
  const destructive = confirmVariant === "destructive";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className={destructive ? "bg-tomato-soft text-destructive" : "bg-brand-soft text-brand-green"}>
            {icon ?? <TriangleAlert aria-hidden="true" />}
          </AlertDialogMedia>
          <AlertDialogText>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          </AlertDialogText>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <LoadingButton variant={confirmVariant} isLoading={isLoading} onClick={onConfirm}>
            {confirmLabel}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
