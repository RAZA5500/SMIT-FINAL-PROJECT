import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  isLoading?: boolean;
  loadingText?: string;
}

/** Pending mein disabled + spinner — double click se duplicate request nahi (FLOW-MD 07 §7, 11 §2) */
export function LoadingButton({ isLoading = false, loadingText, disabled, children, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} aria-busy={isLoading || undefined} {...props}>
      {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
}
