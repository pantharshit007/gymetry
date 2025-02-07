import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth/auth";
import { addLog } from "@/server/services/stats/addLogService";
import { ApiResponse, LogBody } from "@/types/types";
import { headers } from "next/headers";

export const POST = async (
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> => {
  const session = await auth();
  const headerList = await headers();
  const userId = headerList.get("X-User-Id");

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 },
    );
  }

  if (session.user.id !== userId) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  try {
    const log: LogBody = await req.json();

    if (log.entries.length === 0) {
      return NextResponse.json(
        { success: false, message: "No entries found" },
        { status: 400 },
      );
    }

    const res = await addLog(log, session.user.id);
    if (!res.success) {
      return NextResponse.json(
        { success: false, message: res.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Log added successfully" },
      { status: 200 },
    );
  } catch (e: any) {
    console.error("> [ERROR-ADDLOG] adding log ", e.message);
    return NextResponse.json(
      {
        success: false,
        message: e.message || "Something went wrong",
      },
      { status: 400 },
    );
  }
};
