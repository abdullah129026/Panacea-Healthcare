"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import type { ConnectionStatus, RealtimeEvent, EventHandler } from "@/types/events";

interface RealtimeContextType {
  status: ConnectionStatus;
  isConnected: boolean;
  error: string | null;
  recentEvents: RealtimeEvent[];
  subscribe: <T extends RealtimeEvent>(
    eventType: T["type"],
    handler: EventHandler<T>
  ) => () => void;
  subscribeAll: (handler: EventHandler) => () => void;
  emit: (event: RealtimeEvent) => Promise<void>;
  reconnect: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

interface RealtimeProviderProps {
  children: ReactNode;
  enabled?: boolean;
  pollInterval?: number;
  userId?: string;
  clinicId?: string;
}

/**
 * Provider component for real-time events.
 * Wraps the app to provide event subscription + status to all components.
 */
export function RealtimeProvider({
  children,
  enabled = true,
  pollInterval = 3000,
  userId,
  clinicId,
}: RealtimeProviderProps) {
  const realtime = useRealtimeEvents({
    enabled,
    pollInterval,
    userId,
    clinicId,
  });

  const value = useMemo(
    () => ({
      status: realtime.status,
      isConnected: realtime.isConnected,
      error: realtime.error,
      recentEvents: realtime.recentEvents,
      subscribe: realtime.subscribe,
      subscribeAll: realtime.subscribeAll,
      emit: realtime.emit,
      reconnect: realtime.reconnect,
    }),
    [
      realtime.status,
      realtime.isConnected,
      realtime.error,
      realtime.recentEvents,
      realtime.subscribe,
      realtime.subscribeAll,
      realtime.emit,
      realtime.reconnect,
    ]
  );

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

/**
 * Hook to access real-time context.
 * Must be used inside RealtimeProvider.
 */
export function useRealtime(): RealtimeContextType {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error("useRealtime must be used inside RealtimeProvider");
  }
  return context;
}
