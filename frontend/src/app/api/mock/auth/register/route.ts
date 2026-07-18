import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, clinicName, agree } = await request.json();

    if (!email || !password || !name || !clinicName) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    if (!agree) {
      return NextResponse.json(
        { error: "Must agree to terms" },
        { status: 400 }
      );
    }

    // Mock user
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      name,
      clinicId: `clinic_${Date.now()}`,
      clinicName,
      role: "admin", // First user is admin
      createdAt: new Date().toISOString(),
    };

    const token = Buffer.from(JSON.stringify(mockUser)).toString("base64");
    const refreshToken = Buffer.from(`refresh_${mockUser.id}`).toString("base64");

    return NextResponse.json({
      token,
      refreshToken,
      user: mockUser,
    });
  } catch (error) {
    console.error("[mock/auth/register]", error);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}
