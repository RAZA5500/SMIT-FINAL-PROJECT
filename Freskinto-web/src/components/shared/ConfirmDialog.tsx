"use client";

import { CircleHelp, TriangleAlert } from "lucide-react";
import { useState, type ReactNode } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { LoadingButton } from "./LoadingButton";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  /** Simple confirm; `formId` diya ho to button us form ko submit karta hai (validation form mein) */
  onConfirm?: () => void;
  formId?: string;
  isPending?: boolean;
  /** Destructive pattern: "cannot be undone" + confirm checkbox (FLOW-MD 07 §3) */
  destructive?: boolean;
  /** Extra content — e.g. entity summary card ya reason form */
  children?: ReactNode;
  /** false ho to confirm button disabled (e.g. form invalid) */
  canConfirm?: boolean;
}

export function ConfirmDialog({ open, onOpenChange, ...props }: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {/* Popup band hone par unmount hota hai — acknowledgement har dafa reset */}
        <ConfirmDialogBody {...props} />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ConfirmDialogBody({
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  formId,
  isPending = false,
  destructive = false,
  children,
  canConfirm = true,
}: Omit<ConfirmDialogProps, "open" | "onOpenChange">) {
  const [acknowledged, setAcknowledged] = useState(false);
  const Icon = destructive ? TriangleAlert : CircleHelp;

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogMedia className={cn(destructive ? "bg-tomato-soft text-destructive" : "bg-muted text-brand")}>
          <Icon aria-hidden="true" />
        </AlertDialogMedia>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
      </AlertDialogHeader>

      {children}

      {destructive && (
        <Stack gap="3" className={cn("rounded-xl border border-destructive/20 bg-tomato-soft p-4")}>
          <Text variant="code" tone="destructive" weight="semibold" className={cn("uppercase")}>
            This action cannot be undone
          </Text>
          <Field orientation="horizontal">
            <Checkbox
              id="confirm-acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked)}
            />
            <FieldLabel htmlFor="confirm-acknowledge">I understand, continue</FieldLabel>
          </Field>
        </Stack>
      )}

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
        <LoadingButton
          type={formId ? "submit" : "button"}
          form={formId}
          variant={destructive ? "danger" : "default"}
          isLoading={isPending}
          disabled={!canConfirm || (destructive && !acknowledged)}
          onClick={formId ? undefined : onConfirm}
        >
          {confirmLabel}
        </LoadingButton>
      </AlertDialogFooter>
    </>
  );
}
