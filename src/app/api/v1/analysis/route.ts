import { auth } from "@/server/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { TimeRange } from "@/types/analysis";
import { AnalysisAPIResponse } from "@/types/types";
import { analyzeLog } from "@/server/services/analytics/analyzeLogService";
import { cache } from "@/server/caches/cache";
import { rawDataType } from "@/types/dailyLog";
import { CACHE_TTL, CACHE_TYPES } from "@/types/cacheType";
import { rateLimiter } from "@/lib/ratelimit";

const GET = async (): Promise<NextResponse<AnalysisAPIResponse>> => {
  const session = await auth();
  const headerList = await headers();
  const timeRange = headerList.get("X-Time-Range") ?? "7";
  const ip =
    headerList.get("x-forwarded-for") ||
    headerList.get("x-real-ip") ||
    headerList.get("cf-connecting-ip") ||
    headerList.get("true-client-ip") ||
    "127.0.0.1";

  const { success } = await rateLimiter.isAllowed(ip!);
  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many requests",
        data: [],
      },
      { status: 429 },
    );
  }

  const validRanges: TimeRange[] = ["7", "14", "28", "60", "90"];
  if (!validRanges.includes(timeRange as TimeRange)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid time range",
        data: [],
      },
      { status: 400 },
    );
  }

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
        data: [],
      },
      { status: 401 },
    );
  }

  try {
    // const headers = { "Cache-Control": `public, max-age=${CACHE_TTL * 7}` };
    const headers = { "Cache-Control": "no-cache" };
    const extendedTimeRange = parseInt(timeRange) > 28 ? true : false;
    const customTimeRange = (extendedTimeRange ? timeRange : "28") as TimeRange;

    // cached data
    const cachedData = await cache.get<rawDataType[]>(CACHE_TYPES.ANALYZE_LOG, [
      session.user.id,
      customTimeRange,
    ]);

    if (cachedData) {
      return NextResponse.json(
        {
          success: true,
          message: "Data fetched from cache!",
          data: cachedData,
        },
        { status: 200, headers },
      );
    }

    const logs = await analyzeLog(session.user.id, customTimeRange);

    // setting cache
    if (extendedTimeRange) {
      await cache.set<rawDataType[]>(
        CACHE_TYPES.ANALYZE_LOG,
        [session.user.id, customTimeRange],
        logs,
        CACHE_TTL, // 1 day
      );
    } else {
      await cache.set<rawDataType[]>(
        CACHE_TYPES.ANALYZE_LOG,
        [session.user.id, customTimeRange],
        logs,
        CACHE_TTL * 7, // 7 days
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data fetched!",
        data: logs,
      },
      { status: 200, headers },
    );
  } catch (err: any) {
    console.error("> [ERROR-FETCHLOG] fetching log ", err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.message,
        data: [],
      },
      { status: 400 },
    );
  }
};

export { GET };
