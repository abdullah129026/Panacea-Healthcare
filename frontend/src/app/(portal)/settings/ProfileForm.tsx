"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";
import { Card, CardTitle, Button, Input, Select } from "@/components/ui";
import { UserRound, Globe } from "lucide-react";
import type { UserProfile } from "@/types";
import type { FormState } from "@/lib/forms";

interface ProfileFormProps {
  profile: UserProfile;
}

const interfaceModes = [
  { value: "standard", icon: "☀️", title: "Standard Mode", desc: "Clean, high-visibility medical frame." },
  { value: "night-shift", icon: "🌙", title: "Night Shift", desc: "Reduced blue light for late hours." },
  { value: "dynamic", icon: "✨", title: "Dynamic UI", desc: "UI adjusts based on context." },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
];

const timezoneOptions = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "EST", label: "Eastern Standard Time (EST)" },
  { value: "CST", label: "Central Standard Time (CST)" },
  { value: "MST", label: "Mountain Standard Time (MST)" },
  { value: "PST", label: "Pacific Standard Time (PST)" },
];

const dateFormatOptions = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
];

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const initialState: FormState = {};
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <>
      {state.error && (
        <div className="bg-error/10 border border-error p-4 rounded-xl text-error text-sm">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="bg-success/10 border border-success p-4 rounded-xl text-success-foreground text-sm">
          {state.message || "Profile updated successfully."}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-4">
            <CardTitle className="flex items-center gap-2">
              <UserRound className="w-4 h-4 text-primary" /> Identity Details
            </CardTitle>
            <div>
              <Input
                label="Full Name"
                name="name"
                defaultValue={profile.name}
                placeholder="Enter your full name"
              />
              <FieldError messages={state.fieldErrors?.name} />
            </div>

            <div>
              <Input
                label="Professional Title"
                name="title"
                defaultValue={profile.title || ""}
                placeholder="e.g., Chief Medical Officer"
              />
              <FieldError messages={state.fieldErrors?.title} />
            </div>

            <div>
              <Input
                label="Official Email"
                name="email"
                type="email"
                defaultValue={profile.email}
                disabled
              />
              <p className="text-[11px] text-muted-foreground mt-1">Email cannot be changed here.</p>
            </div>
          </Card>

          <Card className="space-y-4">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Language & Region
            </CardTitle>
            <div>
              <Select
                label="Portal Language"
                name="language"
                defaultValue={profile.language}
                options={languageOptions}
              />
              <FieldError messages={state.fieldErrors?.language} />
            </div>

            <div>
              <Select
                label="Time Zone"
                name="timezone"
                defaultValue={profile.timezone}
                options={timezoneOptions}
              />
              <FieldError messages={state.fieldErrors?.timezone} />
            </div>

            <div>
              <Select
                label="Date Format"
                name="dateFormat"
                defaultValue={profile.dateFormat}
                options={dateFormatOptions}
              />
              <FieldError messages={state.fieldErrors?.dateFormat} />
            </div>
          </Card>
        </div>

        <Card className="space-y-4">
          <CardTitle>Interface Preferences</CardTitle>
          <div className="grid grid-cols-3 gap-4">
            {interfaceModes.map((mode) => (
              <label
                key={mode.value}
                className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                  profile.interfaceMode === mode.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <input
                  type="radio"
                  name="interfaceMode"
                  value={mode.value}
                  defaultChecked={profile.interfaceMode === mode.value}
                  className="sr-only"
                />
                <p className="text-2xl mb-2">{mode.icon}</p>
                <p className="text-sm font-medium text-foreground">{mode.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{mode.desc}</p>
              </label>
            ))}
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
