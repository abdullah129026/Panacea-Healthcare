import { NextRequest, NextResponse } from "next/server";

// Mock user profiles database
const mockProfiles: Record<string, any> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const profile = mockProfiles[id] || {
      id,
      name: "Dr. Sarah Johnson",
      email: `user_${id}@clinic.health`,
      title: "Senior Clinician",
      language: "en",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      interfaceMode: "standard",
      clinicId: "clinic_001",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("[mock/users/profile]", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    mockProfiles[id] = updated;

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("[mock/users/profile PUT]", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
