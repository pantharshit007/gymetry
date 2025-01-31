import { auth } from "@/server/auth/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (session && session.user) {
    return NextResponse.json({
      data: "Protected data",
      moreData: session.user,
    });
  }

  return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
};
