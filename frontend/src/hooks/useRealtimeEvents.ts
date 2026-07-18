"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { eventManager } from "@/lib/events";
import type { RealtimeEvent, ConnectionStatus, EventHandler } from "@/types/events";

interface UseRealtimeEventsOptions {
  enabled?: boolean;
  pollInterval?: number; // ms between polling (mock API); default 3000
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number; // ms; exponential backoff
  userId?: string;
  clinicId?: string;
}

/**
 * Hook for subscribing to real-time events.
 * Handles polling (mock API) and will switch to WebSocket when backend is ready.
 */
export function useRealtimeEvents(options: UseRealtimeEventsOptions = {}) {
  const {
    enabled = true,
    pollInterval = 3000,
    autoReconnect = true,
    maxReconnectAttempts = 5,
    reconnectDelay = 1000,
    userId,
    clinicId,
  } = options;

  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectedRef = useRef(false);

  /**
   * Fetch recent events from the API (mock or real).
   */
  const fetchEvents = useCallback(async () => {
    if (!enabled) return;

    try {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      if (clinicId) params.append("clinicId", clinicId);

      const response = await fetch(`/api/mock/events?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("panacea_session") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const { success, data } = await response.json();

      if (!success) {
        throw new Error("Failed to fetch events");
      }

      // Emit each event through the manager
      const events = Array.isArray(data) ? data : data.items || [];
      for (const event of events) {
        await eventManager.emit(event);
      }

      setRecentEvents(events);
      setStatus("connected");
      setError(null);
      reconnectAttemptsRef.current = 0;
      isConnectedRef.current = true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setStatus("error");
      isConnectedRef.current = false;

      // Attempt reconnection
      if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);
        console.warn(
          `[useRealtimeEvents] Reconnection attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts} after ${delay}ms`
        );
        setTimeout(() => fetchEvents(), delay);
      } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        setStatus("disconnected");
        console.error("[useRealtimeEvents] Max reconnection attempts reached");
      }
    }
  }, [enabled, userId, clinicId, autoReconnect, maxReconnectAttempts, reconnectDelay]);

  /**
   * Set up polling interval.
   */
  useEffect(() => {
    if (!enabled) {
      setStatus("disconnected");
      return;
    }

    // Initial fetch
    fetchEvents();

    // Set up polling
    pollIntervalRef.current = setInterval(() => {
      fetchEvents();
    }, pollInterval);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [enabled, pollInterval, fetchEvents]);

  /**
   * Subscribe to a specific event type.
   */
  const subscribe = useCallback(
    <T extends RealtimeEvent>(
      eventType: T["type"],
      handler: EventHandler<T>
    ): (() => void) => {
      return eventManager.subscribe(eventType, handler);
    },
    []
  );

  /**
   * Subscribe to all events.
   */
  const subscribeAll = useCallback((handler: EventHandler): (() => void) => {
    return eventManager.subscribeAll(handler);
  }, []);

  /**
   * Manually emit an event (for testing).
   */
  const emit = useCallback(
    async (event: RealtimeEvent): Promise<void> => {
      await eventManager.emit(event);
    },
    []
  );

  /**
   * Manually reconnect.
   */
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setStatus("connecting");
    fetchEvents();
  }, [fetchEvents]);

  return {
    status,
    isConnected: status === "connected",
    error,
    recentEvents,
    subscribe,
    subscribeAll,
    emit,
    reconnect,
  };
}

/**
 * Utility to get cookie value by name.
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
