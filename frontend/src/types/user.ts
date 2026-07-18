import type { ISODateString, Role, TenantScoped } from "./common";

/** The authenticated staff member. Carries role + clinic for RBAC and scoping. */
export type User = TenantScoped & {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Optional display avatar initials, matching existing UI (e.g. "JR"). */
  avatar?: string;
  createdAt: ISODateString;
};
