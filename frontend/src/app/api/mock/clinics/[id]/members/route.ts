import { NextRequest, NextResponse } from "next/server";

// Mock clinic members database
const mockMembers: Record<string, any[]> = {
  clinic_001: [
    {
      id: "member_001",
      userId: "user_john",
      clinicId: "clinic_001",
      name: "Dr. John Smith",
      email: "john@clinic.health",
      role: "admin",
      status: "active",
      lastActive: new Date().toISOString(),
      joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "member_002",
      userId: "user_sarah",
      clinicId: "clinic_001",
      name: "Dr. Sarah Johnson",
      email: "sarah@clinic.health",
      role: "clinician",
      status: "active",
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      joinedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: "member_003",
      userId: "user_pending",
      clinicId: "clinic_001",
      name: "Dr. Michael Chen",
      email: "michael@clinic.health",
      role: "clinician",
      status: "pending",
      invitedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    const members = mockMembers[id] || [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return NextResponse.json({
      success: true,
      data: {
        items: members.slice(start, end),
        total: members.length,
        page,
        pageSize,
        hasMore: end < members.length,
      },
    });
  } catch (error) {
    console.error("[mock/clinics/members]", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
