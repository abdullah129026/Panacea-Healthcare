"use client";

import { useState } from "react";
import { Card, CardTitle, Button } from "@/components/ui";
import { Users, Plus } from "lucide-react";
import { ClinicMembersTable } from "./ClinicMembersTable";
import { InviteUserModal } from "./InviteUserModal";
import type { ClinicMember } from "@/types/settings";

interface ClinicMembersPageClientProps {
  members: ClinicMember[];
  clinicId: string;
}

export function ClinicMembersPageClient({ members, clinicId }: ClinicMembersPageClientProps) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [displayMembers, setDisplayMembers] = useState(members);

  const handleMembersUpdated = () => {
    // Revalidate data on the server side (ideally with Next.js revalidation)
    // For now, we'll just refetch or rely on the server to update
    window.location.reload();
  };

  const activeMembersCount = displayMembers.filter((m) => m.status === "active").length;
  const pendingInvitesCount = displayMembers.filter((m) => m.status === "pending").length;

  return (
    <>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">Team Members</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {activeMembersCount} active · {pendingInvitesCount} pending invitations
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Invite Member
          </Button>
        </div>

        <ClinicMembersTable members={displayMembers} onMembersUpdated={handleMembersUpdated} />
      </Card>

      <InviteUserModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSuccess={() => {
          setInviteModalOpen(false);
          handleMembersUpdated();
        }}
      />
    </>
  );
}
