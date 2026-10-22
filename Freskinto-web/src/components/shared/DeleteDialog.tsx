"use client";

import { useState, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Stack } from "@/components/ui/flex";
import { LoadingButton } from "./LoadingButton";

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  isPending?: boolean;
}

/**
 * Pattern A (DeleteDialog): Simple confirmation modal
 * with { open, onConfirm, title, description, isLoading }
 */
export function DeleteDialog({
  open,
  onOpenChange,
  title = "Delete this item?",
  description = "This action will remove the record from your store.",
  confirmLabel = "Delete",
  onConfirm,
  isLoading,
  isPending,
}: DeleteDialogProps) {
  const pending = isLoading ?? isPending ?? false;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <TriangleAlert aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            isLoading={pending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export interface StandardDestructiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  isPending?: boolean;
  /** Entity Summary Card: shows details of the entity being deleted/canceled */
  entitySummary?: ReactNode;
  children?: ReactNode;
}

/**
 * Pattern B (Standard Destructive Modal): Rich destructive confirmation containing:
 * 1. Entity Summary Card
 * 2. "Cannot be undone" warning badge
 * 3. Confirmation checkbox to enable submission
 * 4. Destructive action button with loading spinner
 */
export function StandardDestructiveModal({
  open,
  onOpenChange,
  ...props
}: StandardDestructiveModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {open && <StandardDestructiveModalBody {...props} onOpenChange={onOpenChange} />}
    </AlertDialog>
  );
}

function StandardDestructiveModalBody({
  title,
  description,
  confirmLabel = "Delete permanently",
  onConfirm,
  isLoading,
  isPending,
  entitySummary,
  children,
}: Omit<StandardDestructiveModalProps, "open">) {
  const [acknowledged, setAcknowledged] = useState(false);
  const pending = isLoading ?? isPending ?? false;

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogMedia className="bg-destructive/10 text-destructive">
          <TriangleAlert aria-hidden="true" />
        </AlertDialogMedia>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
      </AlertDialogHeader>

      {/* 1. Entity Summary Card */}
      {(entitySummary || children) && (
        <Card size="sm" className="bg-muted/40 p-4 border border-border">
          {entitySummary ?? children}
        </Card>
      )}

      {/* 2. "Cannot be undone" badge & 3. Confirmation checkbox */}
      <Stack gap="3" className="rounded-xl border border-destructive/20 bg-destructive/10 p-4">
        <Badge variant="destructive" className="w-fit font-semibold uppercase tracking-wider text-xs">
          This action cannot be undone
        </Badge>
        <Field orientation="horizontal">
          <Checkbox
            id="destructive-confirm-ack"
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(Boolean(checked))}
          />
          <FieldLabel htmlFor="destructive-confirm-ack" className="text-sm font-medium">
            I understand the consequences and wish to proceed
          </FieldLabel>
        </Field>
      </Stack>

      {/* 4. Destructive action button with spinner */}
      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
        <LoadingButton
          variant="destructive"
          isLoading={pending}
          disabled={!acknowledged || pending}
          onClick={onConfirm}
        >
          {confirmLabel}
        </LoadingButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
