export interface IAddress {
  id: string;
  addressLine: string;
  city: string;
  county: string;
  postcode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddressFields {
  addressLine: string;
  city: string;
  county: string;
  postcode: string;
}
