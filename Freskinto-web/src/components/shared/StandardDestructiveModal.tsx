"use client";

import { TriangleAlert } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogText,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { Flex, Stack } from "@/components/ui/flex";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "./LoadingButton";

export interface StandardDestructiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  /** Simple confirm; `formId` diya ho to button us form ko submit karta hai (validation form mein) */
  onConfirm?: () => void;
  formId?: string;
  isLoading?: boolean;
  /** false ho to confirm disabled (e.g. form invalid) */
  canConfirm?: boolean;
  /** 1. Entity Summary Card — kya delete/cancel ho raha hai */
  entitySummary?: ReactNode;
  /** Extra fields (e.g. cancel reason form) */
  children?: ReactNode;
}

/**
 * Pattern B — rich destructive confirmation: entity summary card, "cannot be undone" warning
 * badge, confirmation checkbox (jab tak tick na ho submit disabled), aur spinner wala
 * destructive button.
 */
export function StandardDestructiveModal({ open, onOpenChange, ...props }: StandardDestructiveModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* Band hone par body unmount — acknowledgement har dafa reset */}
      {open && <StandardDestructiveBody {...props} />}
    </AlertDialog>
  );
}

function StandardDestructiveBody({
  title,
  description,
  confirmLabel = "Delete permanently",
  onConfirm,
  formId,
  isLoading = false,
  canConfirm = true,
  entitySummary,
  children,
}: Omit<StandardDestructiveModalProps, "open" | "onOpenChange">) {
  const ackId = useId();
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogMedia className="bg-destructive-soft text-destructive">
          <TriangleAlert aria-hidden="true" />
        </AlertDialogMedia>
        <AlertDialogText>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogText>
      </AlertDialogHeader>

      <AlertDialogBody>
        {entitySummary && (
          <Box data-slot="entity-summary" className="rounded-xl border border-border bg-muted/60 p-4 text-sm">
            {entitySummary}
          </Box>
        )}

        {children}

        <Stack gap="3" className="rounded-xl border border-destructive/20 bg-destructive-soft p-4">
          <Badge variant="destructive" className="w-fit bg-card">
            <TriangleAlert aria-hidden="true" />
            This action cannot be undone
          </Badge>
          <Flex align="start" gap="3">
            <Checkbox
              id={ackId}
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(Boolean(checked))}
            />
            <Label htmlFor={ackId} className="cursor-pointer text-sm leading-snug text-destructive-ink">
              I understand the consequences and want to continue
            </Label>
          </Flex>
        </Stack>
      </AlertDialogBody>

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
        <LoadingButton
          type={formId ? "submit" : "button"}
          form={formId}
          variant="destructive"
          isLoading={isLoading}
          disabled={!canConfirm || !acknowledged}
          onClick={formId ? undefined : onConfirm}
        >
          {confirmLabel}
        </LoadingButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
