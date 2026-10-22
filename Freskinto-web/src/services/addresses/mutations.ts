import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/lib/toast";
import type { IMutationOptions } from "@/services/types";
import { addressService } from "./index";
import { addressKeys } from "./queries";
import type { ICreateAddressPayload, IUpdateAddressPayload } from "./types";

export function useCreateAddress({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateAddressPayload) => addressService.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: addressKeys.all });
      if (!silent) toastSuccess("Address saved");
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to save address", error.message);
    },
  });
}

export function useUpdateAddress({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateAddressPayload }) =>
      addressService.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: addressKeys.all });
      if (!silent) toastSuccess("Address updated");
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to update address", error.message);
    },
  });
}

export function useSetDefaultAddress({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.setDefault(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: addressKeys.all });
      if (!silent) toastSuccess("Default address updated");
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to set default address", error.message);
    },
  });
}

export function useDeleteAddress({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: addressKeys.all });
      if (!silent) toastSuccess("Address deleted");
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to delete address", error.message);
    },
  });
}
