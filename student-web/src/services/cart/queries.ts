import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { cartService } from "./index";

export const cartKeys = {
  cart: ["cart"] as const,
};

/** Cart sirf signed-in CUSTOMER ka — guest/admin ke liye request hi nahi jati */
export function useGetCart() {
  const isCustomer = useAuthStore((state) => Boolean(state.token) && state.user?.role === "CUSTOMER");
  return useQuery({
    queryKey: cartKeys.cart,
    queryFn: ({ signal }) => cartService.get(signal),
    enabled: isCustomer,
  });
}
