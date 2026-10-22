import type { IPaginationPayload } from "@/services/types";

export interface IAddress {
  id: string;
  addressLine: string;
  city: string;
  county: string;
  postcode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IFetchAddressesPayload = IPaginationPayload;

export interface ICreateAddressPayload {
  addressLine: string;
  city: string;
  county: string;
  postcode: string;
  isDefault?: boolean;
}

/** Default sirf `PATCH /addresses/:id/default` se badalta hai */
export type IUpdateAddressPayload = Partial<Omit<ICreateAddressPayload, "isDefault">>;
