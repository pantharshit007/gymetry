"use server";

import { isStreakContinues, setTimeZone } from "@/lib/streak";
import { cache } from "@/server/caches/cache";
import { db } from "@/server/db";
import { CACHE_TTL, CACHE_TYPES } from "@/types/cacheType";
import { rawDataType } from "@/types/dailyLog";
import { LogBody, StreakCache } from "@/types/types";
import { fetchUserStreak, getSecondsUntilMidnight } from "../streak";

/**
 * service to add present day's log to the database
 * @param logs: LogBody
 */
async function addLog(logs: LogBody, userId: string, timeZone?: string | null) {
  const adjustDate = setTimeZone({ date: logs.date, timeZone });

  try {
    const result = await db.$transaction(async (tx) => {
      const currentStreak = await fetchUserStreak(userId, false);

      // NO same day log
      const currentDay = adjustDate.getDate();
      const storedDay = currentStreak.last_log_date.getDate();

      if (currentDay === storedDay && currentStreak.current_streak > 0) {
        return {
          success: false,
          message: "Already logged today, see you tommorow!",
        };
      }

      if (adjustDate.getTime() < currentStreak.last_log_date.getTime()) {
        return {
          success: false,
          message: "You can't log in the past!",
        };
      }

      let newCurrentStreak = 1;
      let newLongestStreak = Math.max(currentStreak.longest_streak, 1);

      const isConsecutive = isStreakContinues(
        currentStreak.last_log_date,
        adjustDate,
        timeZone,
      );

      console.log(`isConsecutive:userId:${userId}`, isConsecutive);

      if (isConsecutive) {
        newCurrentStreak = currentStreak.current_streak + 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      }

      // create daily log
      const [res, updatedStreak] = await Promise.all([
        tx.dailyLog.createManyAndReturn({
          data: logs.entries.map((entry) => ({
            userId,
            // date: adjustDate,
            workout: entry.workout,
            reps: entry.reps,
            weight: entry.weight! * 100,
            steps: entry.steps,
            distance: entry.distance,
          })),
        }),

        // update user's streak
        tx.streak.update({
          where: { userId },
          data: {
            current_streak: newCurrentStreak,
            longest_streak: newLongestStreak,
            // last_log_date: adjustDate,
          },
        }),
      ]);

      const { id, userId: _, ...streakWithoutIdAndUserId } = updatedStreak;
      const secondsUntilMidnight = getSecondsUntilMidnight();

      await cache.set<StreakCache>(
        CACHE_TYPES.STREAK,
        [userId],
        streakWithoutIdAndUserId,
        CACHE_TTL + secondsUntilMidnight, // 1 day + remaining seconds
      );

      return {
        success: res.length === logs.entries.length,
        data: res,
      };
    });

    const newEntries = result.data
      ? result.data.map(({ id, userId, ...rest }) => rest)
      : logs.entries.map((entry) => ({
          date: adjustDate,
          workout: entry.workout,
          reps: entry.reps || null,
          weight: entry.weight ? entry.weight * 100 : null,
          steps: entry.steps || null,
          distance: entry.distance || null,
        }));

    return {
      success: result.success,
      message: result.success
        ? "Log added successfully"
        : (result.message ?? "Failed to add log"),
      data: result ? newEntries : null,
    };
  } catch (err: any) {
    console.error("> [ERROR-SERVICE] adding log ", err);
    return {
      success: false,
      message: err.message || "Failed to add log",
      data: null,
    };
  }
}

export { addLog };
