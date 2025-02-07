import { auth } from "@/server/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { TimeRange } from "@/types/analysis";
import { AnalysisAPIResponse } from "@/types/types";
import { analyzeLog } from "@/server/services/analytics/analyzeLogService";

const GET = async (
  req: NextRequest,
): Promise<NextResponse<AnalysisAPIResponse>> => {
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
    const logs = await analyzeLog(session.user.id, timeRange);

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
