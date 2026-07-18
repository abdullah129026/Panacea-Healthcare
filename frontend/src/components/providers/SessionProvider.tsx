"use client";

import { createContext, useContext } from "react";
import type { User } from "@/types";

/**
 * Makes the server-resolved session `User` available to the client shell
 * (Sidebar role gating, Header identity). The value is populated once in the
 * `(portal)` layout — a Server Component that has already verified the session —
 * and never carries secrets (no token, no password).
 */
const SessionContext = createContext<User | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

export function useSession(): User {
  const user = useContext(SessionContext);
  if (!user) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return user;
}
