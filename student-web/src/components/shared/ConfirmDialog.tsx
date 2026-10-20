"use client";

import { TriangleAlert } from "lucide-react";
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

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-modal-title">{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      {children}

      {destructive && (
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-cancel-red">
            <TriangleAlert className="size-3.5" aria-hidden="true" />
            This action cannot be undone
          </span>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <Checkbox
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked)}
            />
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
          variant={destructive ? "destructive" : "cta"}
          className={destructive ? "bg-destructive text-white hover:bg-destructive/90" : undefined}
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
