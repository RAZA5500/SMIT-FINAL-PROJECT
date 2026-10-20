export type UserRole = "ADMIN" | "CUSTOMER";

/** Backend `IUser` — money string, passwordHash kabhi nahi aata */
export interface IUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  totalOrders: number;
  totalSpent: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}

/** Register mein `role` field nahi — backend hamesha CUSTOMER banata hai */
export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}
