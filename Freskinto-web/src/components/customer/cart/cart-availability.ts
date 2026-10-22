import type { ICartItem } from "@/services/cart/types";

/**
 * Cart response `isAvailable` + limits batata hai — UI sirf wajah dikhati hai.
 * Order create backend par phir bhi stock/active check karta hai.
 */
export function cartItemIssue(item: ICartItem): string | null {
  if (item.isAvailable) return null;
  if (item.maxAllowedQuantity === 0) return "Out of stock — remove this item to continue";
  if (item.quantity > item.maxAllowedQuantity) {
    return `Only ${item.maxAllowedQuantity} available — reduce the quantity`;
  }
  if (item.quantity < item.minimumOrderQuantity) {
    return `Minimum order is ${item.minimumOrderQuantity}`;
  }
  return "No longer available — remove this item to continue";
}

export function cartHasIssues(items: ICartItem[]): boolean {
  return items.some((item) => !item.isAvailable);
}
