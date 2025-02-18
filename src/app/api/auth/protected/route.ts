import { rateLimiter } from "@/lib/ratelimit";
import { auth } from "@/server/auth/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for") ||
    headerList.get("x-real-ip") ||
    headerList.get("cf-connecting-ip") ||
    headerList.get("true-client-ip") ||
    "127.0.0.1";

  const { success } = await rateLimiter.isAllowed(ip!);
  if (!success) {
    console.log("success:", false);
    return NextResponse.json(
      { success: false, message: "Too many requests" },
      { status: 429 },
    );
  }

  const session = await auth();
  if (session && session.user) {
    console.log("success:", true);
    return NextResponse.json({
      success: true,
      message: "Authenticated",
    });
  }

  return NextResponse.json(
    { success: false, message: "Not authenticated" },
    { status: 401 },
  );
};
