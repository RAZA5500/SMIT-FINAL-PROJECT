import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { ORDER_STATUSES, type OrderStatus } from "@/constants/enums";
import { orderService } from "./index";
import type { IFetchAdminOrdersPayload, IFetchCustomerOrdersPayload } from "./types";

export const customerOrderKeys = {
  all: ["customerOrders"] as const,
  paginated: (payload: IFetchCustomerOrdersPayload) => ["customerOrders", "list", payload] as const,
  detail: (id: string) => ["customerOrders", "detail", id] as const,
};

export const adminOrderKeys = {
  all: ["adminOrders"] as const,
  paginated: (payload: IFetchAdminOrdersPayload) => ["adminOrders", "list", payload] as const,
  detail: (id: string) => ["adminOrders", "detail", id] as const,
};

export function useGetCustomerOrders(payload: IFetchCustomerOrdersPayload) {
  return useQuery({
    queryKey: customerOrderKeys.paginated(payload),
    queryFn: ({ signal }) => orderService.listCustomer(payload, signal),
    placeholderData: keepPreviousData,
  });
}

export function useGetCustomerOrderDetail(id: string) {
  return useQuery({
    queryKey: customerOrderKeys.detail(id),
    queryFn: ({ signal }) => orderService.getCustomerDetail(id, signal),
  });
}

export function useGetAdminOrders(payload: IFetchAdminOrdersPayload) {
  return useQuery({
    queryKey: adminOrderKeys.paginated(payload),
    queryFn: ({ signal }) => orderService.listAdmin(payload, signal),
    placeholderData: keepPreviousData,
  });
}

export function useGetAdminOrderDetail(id: string) {
  return useQuery({
    queryKey: adminOrderKeys.detail(id),
    queryFn: ({ signal }) => orderService.getAdminDetail(id, signal),
  });
}

/** Har order status ki ginti (limit 1 → sirf `meta.total`) — admin overview ka chart */
export function useGetAdminOrderStatusCounts() {
  return useQueries({
    queries: ORDER_STATUSES.map((status) => {
      const payload: IFetchAdminOrdersPayload = { status, limit: 1 };
      return {
        queryKey: adminOrderKeys.paginated(payload),
        queryFn: ({ signal }: { signal: AbortSignal }) => orderService.listAdmin(payload, signal),
      };
    }),
    combine: (results) => ({
      counts: ORDER_STATUSES.map((status, index) => ({
        status: status as OrderStatus,
        count: results[index].data?.meta.total ?? 0,
      })),
      isLoading: results.some((result) => result.isLoading),
      isError: results.some((result) => result.isError),
    }),
  });
}
