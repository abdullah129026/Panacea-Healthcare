"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateClinicUserRole, removeClinicMember } from "../actions";
import { Button, Badge, Select, Modal, Input } from "@/components/ui";
import { Trash2, Edit2, MoreVertical } from "lucide-react";
import type { ClinicMember } from "@/types/settings";
import type { FormState } from "@/lib/forms";

interface ClinicMembersTableProps {
  members: ClinicMember[];
  onMembersUpdated?: () => void;
}

const roleOptions = [
  { value: "clinician", label: "Clinician" },
  { value: "admin", label: "Admin" },
  { value: "support", label: "Support" },
  { value: "billing", label: "Billing" },
];

const statusColors = {
  active: "success",
  pending: "warning",
  inactive: "outline",
} as const;

interface FieldErrorProps {
  messages?: string[];
}

function FieldError({ messages }: FieldErrorProps) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function ClinicMembersTable({ members, onMembersUpdated }: ClinicMembersTableProps) {
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [removePassword, setRemovePassword] = useState("");

  const [roleState, roleFormAction, rolePending] = useActionState(updateClinicUserRole, {});
  const [removeState, removeFormAction, removePending] = useActionState(removeClinicMember, {});

  const handleRoleChange = async (userId: string, newRole: string) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("role", newRole);
    await roleFormAction(formData);
    setEditingMemberId(null);
    onMembersUpdated?.();
  };

  const handleRemoveMember = async () => {
    if (!removingMemberId) return;
    const formData = new FormData();
    formData.append("userId", removingMemberId);
    formData.append("password", removePassword);
    await removeFormAction(formData);
    if (removeState.success) {
      setRemovingMemberId(null);
      setRemovePassword("");
      onMembersUpdated?.();
    }
  };

  if (!members.length) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No clinic members yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Email</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Role</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Last Active</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                <td className="py-3 px-4">
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </td>
                <td className="py-3 px-4">
                  {editingMemberId === member.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        disabled={rolePending}
                        className="h-8 text-sm rounded-lg border border-input bg-card px-2 py-1"
                      >
                        {roleOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setEditingMemberId(null)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <Badge variant="outline" className="capitalize text-xs">
                      {member.role}
                    </Badge>
                  )}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={statusColors[member.status]} className="text-xs capitalize">
                    {member.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <p className="text-xs text-muted-foreground">
                    {member.lastActive
                      ? new Date(member.lastActive).toLocaleDateString()
                      : member.status === "pending"
                        ? "Not yet joined"
                        : "Never"}
                  </p>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingMemberId(member.id)}
                      disabled={editingMemberId === member.id}
                      className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      title="Edit role"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRemovingMemberId(member.id)}
                      className="p-2 hover:bg-error/10 rounded-lg text-muted-foreground hover:text-error transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {roleState.error && (
        <div className="mt-3 bg-error/10 border border-error p-3 rounded-lg text-error text-sm">
          {roleState.error}
        </div>
      )}

      <Modal open={removingMemberId !== null} onClose={() => setRemovingMemberId(null)} size="sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRemoveMember();
          }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-lg font-semibold font-mono text-foreground">Remove Member</h2>
            <p className="text-sm text-muted-foreground mt-1">
              This action will remove the member from your clinic. They will no longer have access to clinic data.
            </p>
          </div>

          {removeState.error && (
            <div className="bg-error/10 border border-error p-3 rounded-lg text-error text-sm">
              {removeState.error}
            </div>
          )}

          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password to confirm"
              value={removePassword}
              onChange={(e) => setRemovePassword(e.target.value)}
              disabled={removePending}
              required
            />
            <FieldError messages={removeState.fieldErrors?.password} />
            <p className="text-[11px] text-muted-foreground mt-1">
              We need your password to confirm this action.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" variant="destructive" size="sm" disabled={removePending} className="flex-1">
              {removePending ? "Removing..." : "Remove Member"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setRemovingMemberId(null)}
              disabled={removePending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
