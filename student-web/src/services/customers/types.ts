import type { IUser } from "@/services/auth/types";
import type { IPaginationPayload } from "@/services/types";

/** Admin customer list — wahi `IUser` shape (passwordHash kabhi nahi) */
export type ICustomer = IUser;

export interface IFetchCustomersPayload extends IPaginationPayload {
  /** name / email / phone */
  search?: string;
  isActive?: boolean;
}

export interface IUpdateCustomerStatusPayload {
  isActive: boolean;
}
