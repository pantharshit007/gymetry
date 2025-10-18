import { env } from "@/env";
import { cache } from "@/server/caches/cache";
import { CACHE_TYPES } from "@/types/cacheType";
import { NextResponse } from "next/server";

const redisApiKey = env.REDIS_JOB_API_KEY;
export async function GET(req: Request) {
  const jobApiKey = req.headers.get("RedisJob-Api-Key") || "";

  if (jobApiKey !== redisApiKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Job Key",
      },
      { status: 403 },
    );
  }

  const currentDate = new Date().toISOString();
  await cache.set(CACHE_TYPES.REDIS_CYCLE, [], { date: currentDate }, 60 * 60); // 1 hour

  return NextResponse.json({
    success: true,
    message: "Success, cycle re-started",
  });
}
