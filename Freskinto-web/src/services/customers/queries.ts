import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { customerService } from "./index";
import type { IFetchCustomersPayload } from "./types";

export const adminCustomerKeys = {
  all: ["adminCustomers"] as const,
  paginated: (payload: IFetchCustomersPayload) => ["adminCustomers", "list", payload] as const,
};

export function useGetCustomers(payload: IFetchCustomersPayload) {
  return useQuery({
    queryKey: adminCustomerKeys.paginated(payload),
    queryFn: ({ signal }) => customerService.list(payload, signal),
    placeholderData: keepPreviousData,
  });
}
