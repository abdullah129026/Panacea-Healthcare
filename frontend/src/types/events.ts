import type { ISODateString } from "./common";

/**
 * Real-time event types that flow through the system.
 * Each event has a type and contextual data.
 */

export type AlertSeverity = "critical" | "high" | "medium" | "low";

export type RealtimeEvent =
  | AlertRaisedEvent
  | PatientUpdatedEvent
  | AppointmentCreatedEvent
  | AppointmentCancelledEvent
  | DocumentUploadedEvent
  | UserStatusChangedEvent;

/** Critical alert raised in clinic (e.g., vital out of range) */
export type AlertRaisedEvent = {
  type: "alert.raised";
  id: string;
  clinicId: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  patientId?: string;
  patientName?: string;
  source: string; // e.g., "vital_monitor", "lab_result", "manual"
  actionUrl?: string; // Link to view more details
  timestamp: ISODateString;
};

/** Patient record updated */
export type PatientUpdatedEvent = {
  type: "patient.updated";
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  updatedBy: string;
  changes: string[]; // e.g., ["vitals", "medication"]
  timestamp: ISODateString;
};

/** New appointment created */
export type AppointmentCreatedEvent = {
  type: "appointment.created";
  id: string;
  clinicId: string;
  appointmentId: string;
  patientName: string;
  clinicianName: string;
  scheduledTime: ISODateString;
  timestamp: ISODateString;
};

/** Appointment cancelled */
export type AppointmentCancelledEvent = {
  type: "appointment.cancelled";
  id: string;
  clinicId: string;
  appointmentId: string;
  patientName: string;
  reason?: string;
  timestamp: ISODateString;
};

/** Medical document uploaded */
export type DocumentUploadedEvent = {
  type: "document.uploaded";
  id: string;
  clinicId: string;
  documentId: string;
  patientName: string;
  documentName: string;
  uploadedBy: string;
  timestamp: ISODateString;
};

/** User online/offline status changed */
export type UserStatusChangedEvent = {
  type: "user.status_changed";
  id: string;
  clinicId: string;
  userId: string;
  userName: string;
  status: "online" | "offline" | "away";
  timestamp: ISODateString;
};

/**
 * Event handler function signature.
 * Each event type can have multiple handlers.
 */
export type EventHandler<T extends RealtimeEvent = RealtimeEvent> = (
  event: T
) => void | Promise<void>;

/**
 * Connection status for real-time transport.
 */
export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

/**
 * Realtime connection state for context.
 */
export type RealtimeState = {
  status: ConnectionStatus;
  isConnected: boolean;
  lastEventTime?: ISODateString;
  error?: string;
  messageQueue: RealtimeEvent[];
};
