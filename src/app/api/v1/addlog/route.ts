import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth/auth";
import { addLog } from "@/server/services/stats/addLogService";
import { ApiResponse, LogBody } from "@/types/types";
import { headers } from "next/headers";
import { cache } from "@/server/caches/cache";
import { CACHE_TYPES } from "@/types/cacheType";
import { rawDataType } from "@/types/dailyLog";
import { rateLimiter } from "@/lib/ratelimit";

export const POST = async (
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> => {
  const session = await auth();
  const headerList = await headers();
  const userId = headerList.get("X-User-Id");
  const timeZone = headerList.get("X-Time-Zone");
  const ip =
    headerList.get("x-forwarded-for") ||
    headerList.get("x-real-ip") ||
    headerList.get("cf-connecting-ip") ||
    headerList.get("true-client-ip");

  const { success } = await rateLimiter.isAllowed(ip!);
  if (!success) {
    return NextResponse.json(
      { success: false, message: "Too many requests" },
      { status: 429 },
    );
  }

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

    const res = await addLog(log, session.user.id, timeZone);
    if (!res.success || !res.data) {
      return NextResponse.json(
        { success: false, message: res.message },
        { status: 400 },
      );
    }

    // update the analytics cache (if available)
    await updateAnalyticsCache(session.user.id, res.data);

    return NextResponse.json(
      { success: true, message: "Log added for the day!" },
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

async function updateAnalyticsCache(userId: string, data: rawDataType[]) {
  const key = [userId, "28"];
  const ttl = await cache.getTtl(CACHE_TYPES.ANALYZE_LOG, key);
  if (ttl && ttl > 0) {
    const cachedLog =
      (await cache.get<rawDataType[]>(CACHE_TYPES.ANALYZE_LOG, key)) || [];

    const updatedData = [...cachedLog, ...data];
    //prettier-ignore
    await cache.set<rawDataType[]>(CACHE_TYPES.ANALYZE_LOG, key, updatedData, ttl);
    return;
  }
}
