"use client";

import { useActionState } from "react";
import { updateNotifications } from "../actions";
import { Card, CardTitle, Button, Input } from "@/components/ui";
import { Mail, MessageSquare, Bell, Moon, AlertTriangle, CalendarDays, MessagesSquare } from "lucide-react";
import type { NotificationPreferences } from "@/types";
import type { FormState } from "@/lib/forms";

interface NotificationsFormProps {
  preferences: NotificationPreferences;
}

const channels = [
  {
    icon: Mail,
    name: "Email Notifications",
    desc: "Summaries of non-critical events and daily reports.",
    fieldName: "emailEnabled",
  },
  {
    icon: MessageSquare,
    name: "SMS Notifications",
    desc: "Real-time mobile alerts for urgent critical events only.",
    fieldName: "smsEnabled",
  },
  {
    icon: Bell,
    name: "In-App Browser Notifications",
    desc: "Desktop-level notifications while the portal is open.",
    fieldName: "inAppEnabled",
  },
];

const ruleGroups = [
  {
    icon: AlertTriangle,
    color: "text-error-foreground",
    title: "Critical Alerts",
    items: [
      { label: "Vitals Outside Range", fieldName: "vitalOutOfRange" },
      { label: "Stat Lab Results", fieldName: "statLabResults" },
      { label: "Emergency Admissions", fieldName: "emergencyAdmissions" },
    ],
  },
  {
    icon: CalendarDays,
    color: "text-info-foreground",
    title: "Appointments",
    items: [
      { label: "New Bookings", fieldName: "appointmentBookings" },
      { label: "Cancellations", fieldName: "appointmentCancellations" },
      { label: "15-min Reminders", fieldName: "appointmentReminders" },
    ],
  },
  {
    icon: MessagesSquare,
    color: "text-primary",
    title: "Messages",
    items: [
      { label: "Internal Staff Chat", fieldName: "staffChat" },
      { label: "Patient Inquiries", fieldName: "patientInquiries" },
      { label: "Insurance Liaison", fieldName: "insuranceLiaison" },
    ],
  },
];

const initialState: FormState = {};

export function NotificationsForm({ preferences }: NotificationsFormProps) {
  const [state, formAction, pending] = useActionState(updateNotifications, initialState);

  return (
    <>
      {state.error && (
        <div className="col-span-3 bg-error/10 border border-error p-4 rounded-xl text-error text-sm">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="col-span-3 bg-success/10 border border-success p-4 rounded-xl text-success-foreground text-sm">
          {state.message || "Notification preferences updated."}
        </div>
      )}

      <form action={formAction} className="col-span-2 space-y-6">
        {/* Global channels */}
        <Card className="space-y-3">
          <CardTitle>Global Notification Channels</CardTitle>
          {channels.map((channel) => {
            const Icon = channel.icon;
            const isEnabled =
              channel.fieldName === "emailEnabled"
                ? preferences.channels.emailEnabled
                : channel.fieldName === "smsEnabled"
                  ? preferences.channels.smsEnabled
                  : preferences.channels.inAppEnabled;

            return (
              <div
                key={channel.fieldName}
                className="flex items-center justify-between p-3 rounded-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{channel.name}</p>
                    <p className="text-xs text-muted-foreground">{channel.desc}</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={channel.fieldName}
                    defaultChecked={isEnabled}
                    className="w-4 h-4 rounded accent-primary"
                    disabled={pending}
                  />
                </label>
              </div>
            );
          })}
        </Card>

        {/* Trigger rules */}
        <Card className="space-y-4">
          <div>
            <CardTitle>Notification Trigger Rules</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Define which alerts trigger a notification across your active channels.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {ruleGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.title} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${group.color}`} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.title}
                    </span>
                  </div>
                  {group.items.map((item) => {
                    const isChecked = preferences.triggers[item.fieldName as keyof typeof preferences.triggers];
                    return (
                      <label
                        key={item.fieldName}
                        className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name={item.fieldName}
                          defaultChecked={Boolean(isChecked)}
                          className="w-4 h-4 rounded accent-primary"
                          disabled={pending}
                        />
                        {item.label}
                      </label>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Do Not Disturb */}
        <Card className="space-y-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Moon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Scheduled Do Not Disturb</p>
              <p className="text-xs text-muted-foreground">
                Automatically silence non-critical notifications.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              name="doNotDisturbStart"
              defaultValue={preferences.doNotDisturbStart || "22:00"}
              disabled={pending}
            />
            <Input
              label="End Time"
              type="time"
              name="doNotDisturbEnd"
              defaultValue={preferences.doNotDisturbEnd || "06:00"}
              disabled={pending}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="reset" variant="ghost" size="sm" disabled={pending}>
            Discard Changes
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={pending}>
            {pending ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </>
  );
}
