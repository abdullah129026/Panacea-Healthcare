import { NextRequest, NextResponse } from "next/server";

// Mock security settings database
const mockSecuritySettings: Record<string, any> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const settings = mockSecuritySettings[id] || {
      userId: id,
      twoFactorEnabled: false,
      twoFactorMethod: undefined,
      activeSessions: [
        {
          id: "session_001",
          device: "MacBook Pro (Current)",
          location: "New York, NY",
          lastActive: new Date().toISOString(),
          isCurrent: true,
        },
        {
          id: "session_002",
          device: "iPhone 14 Pro",
          location: "New York, NY",
          lastActive: new Date(Date.now() - 86400000).toISOString(),
          isCurrent: false,
        },
      ],
      loginHistory: [
        {
          timestamp: new Date().toISOString(),
          location: "New York, NY",
          device: "MacBook Pro",
          status: "success",
        },
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          location: "New York, NY",
          device: "iPhone 14 Pro",
          status: "success",
        },
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          location: "Brooklyn, NY",
          device: "Chrome Browser",
          status: "success",
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("[mock/users/security]", error);
    return NextResponse.json(
      { error: "Failed to fetch security settings" },
      { status: 500 }
    );
  }
}
