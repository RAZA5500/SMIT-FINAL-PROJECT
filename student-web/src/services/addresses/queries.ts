import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { addressService } from "./index";
import type { IFetchAddressesPayload } from "./types";

export const addressKeys = {
  all: ["addresses"] as const,
  list: (payload: IFetchAddressesPayload) => ["addresses", "list", payload] as const,
};

export function useGetAddresses(payload: IFetchAddressesPayload) {
  return useQuery({
    queryKey: addressKeys.list(payload),
    queryFn: ({ signal }) => addressService.list(payload, signal),
    placeholderData: keepPreviousData,
  });
}
