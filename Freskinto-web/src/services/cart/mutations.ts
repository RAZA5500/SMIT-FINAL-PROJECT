import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/lib/toast";
import type { IMutationOptions } from "@/services/types";
import { cartService } from "./index";
import { cartKeys } from "./queries";
import type { IAddCartItemPayload } from "./types";

/** Response poora cart hai — cache foran update (header count), phir invalidate */
export function useAddCartItem({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: IAddCartItemPayload) => cartService.addItem(payload),
    onSuccess: (cart) => {
      qc.setQueryData(cartKeys.cart, cart);
      void qc.invalidateQueries({ queryKey: cartKeys.cart });
      if (!silent) toastSuccess("Added to basket");
    },
    onError: (error: Error) => {
      if (!silent) toastError("Couldn't add to basket", error.message);
    },
  });
}

/** Stepper ka debounced sync — nayi quantity UI mein pehle hi dikh rahi hoti hai, is liye success toast nahi */
export function useUpdateCartItem({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, { quantity }),
    onSuccess: (cart) => qc.setQueryData(cartKeys.cart, cart),
    onError: (error: Error) => {
      if (!silent) toastError("Couldn't update quantity", error.message);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: cartKeys.cart }),
  });
}

export function useRemoveCartItem({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.cart });
      if (!silent) toastSuccess("Removed from basket");
    },
    onError: (error: Error) => {
      if (!silent) toastError("Couldn't remove item", error.message);
    },
  });
}

export function useClearCart({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clear(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.cart });
      if (!silent) toastSuccess("Basket cleared");
    },
    onError: (error: Error) => {
      if (!silent) toastError("Couldn't clear basket", error.message);
    },
  });
}
