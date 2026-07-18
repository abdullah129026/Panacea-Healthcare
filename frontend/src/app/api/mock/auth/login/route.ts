import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Mock user based on email
    const mockUser = {
      id: `user_${email.split("@")[0]}`,
      email,
      name: email.split("@")[0].replace(/[._]/g, " "),
      clinicId: "clinic_001",
      role: email.includes("admin") ? "admin" : email.includes("support") ? "support" : "clinician",
      createdAt: new Date().toISOString(),
    };

    // Mock token (just a base64 encoded user ID for demo)
    const token = Buffer.from(JSON.stringify(mockUser)).toString("base64");
    const refreshToken = Buffer.from(`refresh_${mockUser.id}`).toString("base64");

    return NextResponse.json({
      token,
      refreshToken,
      user: mockUser,
    });
  } catch (error) {
    console.error("[mock/auth/login]", error);
    return NextResponse.json(
      { error: "Failed to log in" },
      { status: 500 }
    );
  }
}
