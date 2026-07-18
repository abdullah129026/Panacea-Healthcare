import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Just return success - cookie clearing handled by frontend
    return NextResponse.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("[mock/auth/logout]", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}
