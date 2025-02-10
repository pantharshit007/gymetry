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
async function addLog(logs: LogBody, userId: string) {
  const adjustDate = setTimeZone({ date: new Date(logs.date) });

  try {
    const result = await db.$transaction(async (tx) => {
      const currentStreak = await fetchUserStreak(userId, false);

      let newCurrentStreak = 1;
      let newLongestStreak = currentStreak.longest_streak ?? 1;

      const isConsecutive = isStreakContinues(
        currentStreak.last_log_date,
        adjustDate,
      );

      if (isConsecutive) {
        newCurrentStreak = currentStreak.current_streak + 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      }

      // create daily log
      const [res] = await Promise.all([
        tx.dailyLog.createMany({
          data: logs.entries.map((entry) => ({
            userId,
            date: adjustDate,
            workout: entry.workout,
            reps: entry.reps,
            weight: entry.weight! * 100,
            steps: entry.steps,
            distance: entry.distance,
          })),
        }),

        // TODO: remove the upsert and move this to onboarding
        // update user's streak
        tx.streak.upsert({
          where: { userId },
          create: {
            userId,
            current_streak: newCurrentStreak,
            longest_streak: newLongestStreak,
            last_log_date: adjustDate,
          },
          update: {
            current_streak: newCurrentStreak,
            longest_streak: newLongestStreak,
            last_log_date: adjustDate,
          },
        }),
      ]);

      const secondsUntilMidnight = getSecondsUntilMidnight();

      await cache.set<StreakCache>(
        CACHE_TYPES.STREAK,
        [userId],
        currentStreak,
        CACHE_TTL + secondsUntilMidnight, // 1 day + remaining seconds
      );

      return res.count > 0;
    });

    const newEntries: rawDataType[] = logs.entries.map((entry) => ({
      date: adjustDate,
      workout: entry.workout,
      reps: entry.reps || null,
      weight: entry.weight ? entry.weight * 100 : null,
      steps: entry.steps || null,
      distance: entry.distance || null,
    }));

    return {
      success: result,
      message: result ? "Log added successfully" : "Failed to add log",
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
