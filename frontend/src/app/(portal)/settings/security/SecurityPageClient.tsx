"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";
import { Card, CardTitle, Button, Badge } from "@/components/ui";
import { Smartphone, Laptop, ShieldAlert, ShieldCheck } from "lucide-react";
import { PasswordUpdateForm } from "./PasswordUpdateForm";
import { TwoFactorSetupModal } from "../TwoFactorSetupModal";
import { AccountDeactivationModal } from "../AccountDeactivationModal";
import type { User } from "@/types";
import type { SecuritySettings } from "@/types";

interface SecurityPageClientProps {
  currentUser: User;
  security: SecuritySettings;
}

export function SecurityPageClient({ currentUser, security }: SecurityPageClientProps) {
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Security" }]} />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground">Enhance your account security</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your authentication methods, review active sessions, and monitor account activity.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success text-success-foreground text-xs font-medium">
            <ShieldCheck className="w-4 h-4" /> Security Status: High
          </div>
        </div>

        <SettingsTabs />

        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Two-Factor Authentication</CardTitle>
              <Badge variant={security.twoFactorEnabled ? "success" : "outline"}>
                {security.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account by requiring more than just a password to log in.
            </p>
            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Authenticator App</p>
                <p className="text-xs text-muted-foreground">Google, Authy or Microsoft Authenticator</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setTwoFactorModalOpen(true)}
              >
                {security.twoFactorMethod === "authenticator" ? "Change" : "Enable"}
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">SMS Verification</p>
                <p className="text-xs text-muted-foreground">Receive a code via text message</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTwoFactorModalOpen(true)}
              >
                {security.twoFactorMethod === "sms" ? "Change" : "Set Up"}
              </Button>
            </div>
          </Card>

          <PasswordUpdateForm />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-3">
            <CardTitle>Active Sessions</CardTitle>
            {security.activeSessions.length > 0 ? (
              <>
                {security.activeSessions.map((session) => {
                  const icon = session.device.toLowerCase().includes("phone") ||
                               session.device.toLowerCase().includes("iphone") ||
                               session.device.toLowerCase().includes("mobile")
                    ? Smartphone
                    : Laptop;
                  const Icon = icon;
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{session.device}</p>
                          <p className="text-xs text-muted-foreground">{session.location}</p>
                        </div>
                      </div>
                      {session.isCurrent ? (
                        <Badge variant="success">Current</Badge>
                      ) : (
                        <button className="text-xs text-destructive hover:underline" disabled>
                          Revoke
                        </button>
                      )}
                    </div>
                  );
                })}
                <Button variant="ghost" size="sm" disabled>
                  Log out of all other sessions
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No active sessions.</p>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Recent Login History</CardTitle>
            </div>
            {security.loginHistory.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">
                      Date & Time
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">
                      Device
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {security.loginHistory.slice(0, 5).map((login, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5">
                        <p className="text-xs text-foreground">{login.timestamp}</p>
                        <p className="text-[10px] text-muted-foreground">{login.location}</p>
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground">{login.device}</td>
                      <td className="py-2.5">
                        <span
                          className={`text-xs font-medium ${
                            login.status === "success"
                              ? "text-success-foreground"
                              : "text-error-foreground"
                          }`}
                        >
                          {login.status === "success" ? "Successful" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">No login history.</p>
            )}
          </Card>
        </div>

        <Card className="border-error/40 bg-error/20">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-error-foreground mt-0.5" />
              <div>
                <CardTitle className="text-error-foreground">Critical Actions</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Temporarily disable your clinical portal access. You can reactivate at any time through hospital administration.
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeactivateModalOpen(true)}
            >
              Deactivate
            </Button>
          </div>
        </Card>
      </div>

      <TwoFactorSetupModal
        open={twoFactorModalOpen}
        onClose={() => setTwoFactorModalOpen(false)}
        currentMethod={security.twoFactorMethod}
      />
      <AccountDeactivationModal
        open={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
      />
    </div>
  );
}
