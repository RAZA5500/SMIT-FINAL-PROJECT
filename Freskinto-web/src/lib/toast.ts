import { toast } from "sonner";

/** Ek jaisi success/error toasts — mutations `onSuccess` / `onError` mein (FLOW-MD 07 §7) */
export function toastSuccess(title: string, description?: string): void {
  toast.success(title, { description });
}

export function toastError(title: string, description?: string): void {
  toast.error(title, { description });
}
