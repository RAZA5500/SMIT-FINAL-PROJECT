"use client";

import { CircleHelp, TriangleAlert } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  /** Destructive pattern: "cannot be undone" badge + confirm checkbox (FLOW-MD 07 §3) */
  destructive?: boolean;
  /** Extra content — e.g. entity summary card ya reason form */
  children?: ReactNode;
  /** false ho to confirm button disabled (e.g. form invalid) */
  canConfirm?: boolean;
}

export function ConfirmDialog({ open, onOpenChange, ...props }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Popup band hone par unmount hota hai — acknowledgement har dafa reset */}
        <ConfirmDialogBody onCancel={() => onOpenChange(false)} {...props} />
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialogBody({
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  formId,
  onCancel,
  isPending = false,
  destructive = false,
  children,
  canConfirm = true,
}: Omit<ConfirmDialogProps, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const Icon = destructive ? TriangleAlert : CircleHelp;

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            destructive ? "bg-tomato-soft text-destructive" : "bg-brand-soft text-brand",
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1.5 pt-1">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </div>
      </DialogHeader>

      {children}

      {destructive && (
        <div className="flex flex-col gap-3 rounded-xl bg-tomato-soft/60 p-3.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive">
            <TriangleAlert className="size-3.5" aria-hidden="true" />
            This action cannot be undone
          </span>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
            <Checkbox checked={acknowledged} onCheckedChange={(checked) => setAcknowledged(checked)} />
            I understand, continue
          </label>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
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
      </DialogFooter>
    </>
  );
}
