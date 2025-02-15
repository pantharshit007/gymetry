"use server";

import { db } from "@/server/db";
import { TimeRange } from "@/types/analysis";
import { rawDataType } from "@/types/dailyLog";

/**
 * Service to fetch and analyze logs for a given user and time range.
 * @param userId: string
 * @param timeRange: TimeRange
 * @returns Promise<DailyLog[]>
 */
async function analyzeLog(
  userId: string,
  timeRange: TimeRange,
): Promise<rawDataType[]> {
  try {
    const now = new Date();
    const startDate = new Date(
      now.getTime() - Number(timeRange) * 24 * 60 * 60 * 1000,
    );

    const logs = await db.dailyLog.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
        },
      },
      select: {
        date: true,
        workout: true,
        reps: true,
        weight: true,
        steps: true,
        distance: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return logs;
  } catch (err: any) {
    console.error("> [ERROR-SERVICE] analyzing log ", err.message);
    throw err;
  }
}

export { analyzeLog };
