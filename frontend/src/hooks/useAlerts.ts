"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRealtime } from "@/components/providers/RealtimeProvider";
import type { AlertRaisedEvent, AlertSeverity } from "@/types/events";

interface Alert extends AlertRaisedEvent {
  dismissedAt?: string;
  snoozedUntil?: string;
}

interface UseAlertsOptions {
  maxAlerts?: number;
  severityFilter?: AlertSeverity[];
  onAlert?: (alert: AlertRaisedEvent) => void;
  playSound?: boolean;
}

/**
 * Hook for managing alerts in the application.
 * Subscribes to alert events and maintains a list of active alerts.
 * Handles dismissal, snoozing, and sound playback.
 */
export function useAlerts(options: UseAlertsOptions = {}) {
  const {
    maxAlerts = 10,
    severityFilter = ["critical", "high", "medium", "low"],
    onAlert,
    playSound = true,
  } = options;

  const { subscribe, status } = useRealtime();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Play alert sound (using Web Audio or simple beep).
   */
  const playAlertSound = useCallback(() => {
    if (!playSound) return;

    try {
      // Try to use Web Audio API for a beep
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Hz
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      // Fallback: silent if audio context fails
      console.debug("[useAlerts] Could not play sound:", error);
    }
  }, [playSound]);

  /**
   * Handle incoming alert event.
   */
  const handleAlertRaised = useCallback(
    (event: AlertRaisedEvent) => {
      // Filter by severity
      if (!severityFilter.includes(event.severity)) {
        return;
      }

      const alert: Alert = {
        ...event,
      };

      setAlerts((prev) => {
        const updated = [alert, ...prev];
        // Keep only max alerts
        return updated.slice(0, maxAlerts);
      });

      setUnreadCount((prev) => prev + 1);

      // Callback & sound
      onAlert?.(event);
      playAlertSound();
    },
    [severityFilter, maxAlerts, onAlert, playAlertSound]
  );

  /**
   * Subscribe to alert events.
   */
  useEffect(() => {
    const unsubscribe = subscribe("alert.raised", handleAlertRaised);
    return unsubscribe;
  }, [subscribe, handleAlertRaised]);

  /**
   * Dismiss an alert (mark as read).
   */
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, dismissedAt: new Date().toISOString() }
          : alert
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  /**
   * Snooze an alert (hide for N minutes, then re-show).
   */
  const snoozeAlert = useCallback(
    (alertId: string, minutes: number = 5) => {
      const snoozedUntil = new Date(Date.now() + minutes * 60000).toISOString();
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? { ...alert, snoozedUntil }
            : alert
        )
      );
    },
    []
  );

  /**
   * Clear all dismissed/snoozed alerts.
   */
  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  /**
   * Get active alerts (not dismissed, not snoozed).
   */
  const activeAlerts = alerts.filter((alert) => {
    if (alert.dismissedAt) return false;
    if (alert.snoozedUntil && new Date(alert.snoozedUntil) > new Date()) {
      return false;
    }
    return true;
  });

  /**
   * Get alerts by severity level.
   */
  const getAlertsBySeverity = useCallback(
    (severity: AlertSeverity) => {
      return activeAlerts.filter((alert) => alert.severity === severity);
    },
    [activeAlerts]
  );

  return {
    alerts: activeAlerts,
    allAlerts: alerts,
    unreadCount,
    isConnected: status === "connected",
    dismissAlert,
    snoozeAlert,
    clearAlerts,
    getAlertsBySeverity,
    playAlertSound,
  };
}
