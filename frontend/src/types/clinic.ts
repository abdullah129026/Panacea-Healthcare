import type { ISODateString } from "./common";

/** The tenant. Scopes every data access in the portal. */
export type Clinic = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  createdAt: ISODateString;
};
