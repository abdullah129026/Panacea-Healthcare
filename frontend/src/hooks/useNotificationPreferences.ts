"use client";

import type { NotificationPreferences } from "@/types/settings";

const defaultPreferences: NotificationPreferences = {
  userId: "",
  clinicId: "",
  channels: {
    emailEnabled: true,
    smsEnabled: false,
    inAppEnabled: true,
  },
  triggers: {
    criticalAlerts: true,
    vitalOutOfRange: true,
    statLabResults: true,
    emergencyAdmissions: true,
    appointmentBookings: false,
    appointmentCancellations: false,
    appointmentReminders: true,
    staffChat: true,
    patientInquiries: true,
    insuranceLiaison: false,
  },
  doNotDisturbStart: undefined,
  doNotDisturbEnd: undefined,
};

/**
 * Hook to provide user's notification preferences.
 * Currently returns defaults; can be enhanced to fetch from server via SessionProvider context.
 * Used for sound toggle, email/SMS settings, and alert filters.
 */
export function useNotificationPreferences() {
  return {
    preferences: defaultPreferences,
    loading: false,
    error: null,
    // Convenience accessors
    soundEnabled: defaultPreferences.channels.inAppEnabled,
    criticalAlertsEnabled: defaultPreferences.triggers.criticalAlerts,
  };
}
