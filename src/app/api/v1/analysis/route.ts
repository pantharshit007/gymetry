import { auth } from "@/server/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { TimeRange } from "@/types/analysis";
import { AnalysisAPIResponse } from "@/types/types";
import { analyzeLog } from "@/server/services/analytics/analyzeLogService";
import { cache } from "@/server/caches/cache";
import { rawDataType } from "@/types/dailyLog";
import { CACHE_TTL, CACHE_TYPES } from "@/types/cacheType";

const GET = async (): Promise<NextResponse<AnalysisAPIResponse>> => {
  const session = await auth();
  const headerList = await headers();
  const timeRange = (headerList.get("X-Time-Range") ?? "7") as TimeRange;

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
    // cached data
    const cachedData = await cache.get<rawDataType[]>(CACHE_TYPES.ANALYZE_LOG, [
      session.user.id,
      timeRange,
    ]);

    if (cachedData) {
      return NextResponse.json(
        {
          success: true,
          message: "Data fetched from cache!",
          data: cachedData,
        },
        { status: 200 },
      );
    }

    const logs = await analyzeLog(session.user.id, timeRange);

    // setting cache
    await cache.set<rawDataType[]>(
      CACHE_TYPES.ANALYZE_LOG,
      [session.user.id, timeRange],
      logs,
      CACHE_TTL * 7, // 7 days
    );

    return NextResponse.json(
      {
        success: true,
        message: "Data fetched!",
        data: logs,
      },
      { status: 200 },
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
