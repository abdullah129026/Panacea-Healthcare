import { NextRequest, NextResponse } from "next/server";
import type { RealtimeEvent, AlertRaisedEvent } from "@/types/events";

/**
 * Mock events API for Feature 26 testing.
 * Returns recent events for a clinic/user.
 *
 * In production, this would be replaced with WebSocket connection.
 */

// In-memory event store (for demo; would use Redis/database in real backend)
const eventStore: RealtimeEvent[] = [];

// Seed with some demo events
function seedEvents() {
  if (eventStore.length > 0) return; // Only seed once

  const now = new Date();
  const alerts: AlertRaisedEvent[] = [
    {
      type: "alert.raised",
      id: "alert_001",
      clinicId: "clinic_001",
      severity: "critical",
      title: "Critical: High Heart Rate",
      message: "Patient vitals exceed safe limits. Immediate attention required.",
      patientId: "patient_001",
      patientName: "John Smith",
      source: "vital_monitor",
      actionUrl: "/patients/patient_001",
      timestamp: new Date(now.getTime() - 60000).toISOString(),
    },
    {
      type: "alert.raised",
      id: "alert_002",
      clinicId: "clinic_001",
      severity: "high",
      title: "Lab Result Available",
      message: "Lab results for patient ready for review",
      patientId: "patient_002",
      patientName: "Jane Doe",
      source: "lab_result",
      actionUrl: "/medical-records",
      timestamp: new Date(now.getTime() - 120000).toISOString(),
    },
    {
      type: "alert.raised",
      id: "alert_003",
      clinicId: "clinic_001",
      severity: "medium",
      title: "Appointment Reminder",
      message: "Patient appointment in 30 minutes",
      patientId: "patient_003",
      patientName: "Robert Johnson",
      source: "manual",
      actionUrl: "/appointments/schedule",
      timestamp: new Date(now.getTime() - 180000).toISOString(),
    },
    {
      type: "alert.raised",
      id: "alert_004",
      clinicId: "clinic_001",
      severity: "high",
      title: "Critical: Blood Pressure Alert",
      message: "Systolic BP reading critically elevated. Immediate medical review needed.",
      patientId: "patient_004",
      patientName: "Sarah Williams",
      source: "vital_monitor",
      actionUrl: "/patients/patient_004",
      timestamp: new Date(now.getTime() - 300000).toISOString(),
    },
    {
      type: "alert.raised",
      id: "alert_005",
      clinicId: "clinic_001",
      severity: "low",
      title: "Prescription Refill Reminder",
      message: "Patient medication running low, refill recommended",
      patientId: "patient_005",
      patientName: "Michael Brown",
      source: "manual",
      actionUrl: "/patients/patient_005",
      timestamp: new Date(now.getTime() - 420000).toISOString(),
    },
    {
      type: "alert.raised",
      id: "alert_006",
      clinicId: "clinic_001",
      severity: "critical",
      title: "Emergency: Abnormal ECG Detected",
      message: "Irregular heart rhythm detected. Alert attending physician immediately.",
      patientId: "patient_001",
      patientName: "John Smith",
      source: "vital_monitor",
      actionUrl: "/patients/patient_001",
      timestamp: new Date(now.getTime() - 540000).toISOString(),
    },
    {
      type: "alert.raised",
      id: "alert_007",
      clinicId: "clinic_001",
      severity: "medium",
      title: "Lab Order Pending Review",
      message: "New lab orders require physician authorization",
      patientId: "patient_002",
      patientName: "Jane Doe",
      source: "lab_result",
      actionUrl: "/medical-records",
      timestamp: new Date(now.getTime() - 600000).toISOString(),
    },
    {
      type: "alert.raised",
      id: "alert_008",
      clinicId: "clinic_001",
      severity: "low",
      title: "Patient Survey Available",
      message: "Patient satisfaction survey available for review",
      patientId: "patient_006",
      patientName: "Emma Davis",
      source: "manual",
      actionUrl: "/patients/patient_006",
      timestamp: new Date(now.getTime() - 720000).toISOString(),
    },
  ];

  eventStore.push(...alerts);
}

/**
 * GET /api/mock/events
 * Fetch recent events for the clinic.
 *
 * Query params:
 * - userId: filter to events for this user
 * - clinicId: filter to events for this clinic
 * - type: filter by event type (alert.raised, etc.)
 * - limit: max events to return (default 20)
 */
export async function GET(request: NextRequest) {
  seedEvents();

  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const clinicId = searchParams.get("clinicId") || "clinic_001";
  const eventType = searchParams.get("type");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);

  try {
    // Filter events
    let filtered = eventStore.filter(
      (event) => event.clinicId === clinicId
    );

    if (eventType) {
      filtered = filtered.filter((event) => event.type === eventType);
    }

    // Sort by timestamp (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit
    const events = filtered.slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        data: events,
        meta: {
          total: filtered.length,
          returned: events.length,
          clinicId,
          userId: userId || "all",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[mock/events] GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch events",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mock/events
 * Emit a new event (for testing/demo purposes).
 *
 * Body: { type: string, data: any }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: "Missing type or data" },
        { status: 400 }
      );
    }

    // Create event with metadata
    const event: RealtimeEvent = {
      ...data,
      type,
      timestamp: data.timestamp || new Date().toISOString(),
      id: data.id || `event_${Date.now()}`,
    } as RealtimeEvent;

    eventStore.unshift(event);

    // Keep store size reasonable (keep last 1000 events)
    if (eventStore.length > 1000) {
      eventStore.pop();
    }

    return NextResponse.json(
      {
        success: true,
        data: event,
        message: "Event emitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[mock/events] POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to emit event",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mock/events
 * Clear all events (for testing).
 */
export async function DELETE() {
  try {
    const count = eventStore.length;
    eventStore.length = 0;

    return NextResponse.json(
      {
        success: true,
        message: `Cleared ${count} events`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[mock/events] DELETE error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear events",
      },
      { status: 500 }
    );
  }
}
