"use client";

import { useRemoveCartItem, useUpdateCartItem } from "@/services/cart/mutations";
import type { ICartItem } from "@/services/cart/types";
import { cancelCartSync, scheduleCartSync, useShopStore } from "@/stores/shop-store";

/**
 * Cart line ka +/- : UI foran nayi quantity dikhati hai (optimistic), API ko aakhri
 * click ke 350 ms baad sirf ek absolute `PATCH` jata hai (FLOW-MD 01 §13, 08 §8).
 * Min se neeche = remove; max = min(stock, maximumOrderQuantity).
 */
export function useCartItemQuantity(item: ICartItem) {
  const optimistic = useShopStore((state) => state.optimisticQuantities[item.productId]);
  const setOptimisticQuantity = useShopStore((state) => state.setOptimisticQuantity);
  const clearOptimisticQuantity = useShopStore((state) => state.clearOptimisticQuantity);
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const quantity = optimistic ?? item.quantity;
  const atMinimum = quantity <= item.minimumOrderQuantity;
  const canIncrease = item.isAvailable && quantity < item.maxAllowedQuantity;

  const syncQuantity = (next: number) => {
    setOptimisticQuantity(item.productId, next);
    scheduleCartSync(item.productId, () => {
      // mutateAsync — component unmount ho jaye (panel band) tab bhi optimistic value saaf ho
      updateItem
        .mutateAsync({ itemId: item.id, quantity: next })
        .catch(() => undefined) // error toast hook mein
        .finally(() => {
          if (useShopStore.getState().optimisticQuantities[item.productId] === next) {
            clearOptimisticQuantity(item.productId);
          }
        });
    });
  };

  const remove = () => {
    cancelCartSync(item.productId);
    clearOptimisticQuantity(item.productId);
    removeItem.mutate(item.id);
  };

  return {
    quantity,
    atMinimum,
    canIncrease,
    isRemoving: removeItem.isPending,
    increase: () => {
      if (canIncrease) syncQuantity(quantity + 1);
    },
    decrease: () => {
      if (atMinimum) remove();
      else syncQuantity(quantity - 1);
    },
    remove,
  };
}
