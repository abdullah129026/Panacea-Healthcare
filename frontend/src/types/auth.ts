import type { User } from "./user";

/**
 * Shape returned by the backend auth endpoints (`/auth/login`, `/auth/register`).
 * The `token` is an opaque bearer credential persisted in the session cookie;
 * `user` carries the role + clinic used for RBAC and tenant scoping.
 */
export type AuthResponse = {
  token: string;
  user: User;
};
