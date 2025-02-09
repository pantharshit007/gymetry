import { isStreakContinues, setTimeZone } from "@/lib/streak";
import { cache } from "@/server/caches/cache";
import { db } from "@/server/db";
import { CACHE_TTL, CACHE_TYPES } from "@/types/cacheType";
import { LogBody, StreakCache } from "@/types/types";

/**
 * service to add present day's log to the database
 * @param logs: LogBody
 */
async function addLog(logs: LogBody, userId: string) {
  const adjustDate = setTimeZone({ date: new Date(logs.date) });

  try {
    return await db.$transaction(async (tx) => {
      const currentStreak = await verifyStreak(userId);
      if (!currentStreak) return { success: false, message: "No streak found" };

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

      return {
        success: res.count > 0,
        message: res.count > 0 ? "Log added successfully" : "Failed to add log",
      };
    });
  } catch (err: any) {
    console.error("> [ERROR-SERVICE] adding log ", err);
    return {
      success: false,
      message: err.message,
    };
  }
}

async function verifyStreak(userId: string): Promise<false | StreakCache> {
  const cachedStreak = await cache.get<StreakCache>(CACHE_TYPES.STREAK, [
    userId,
  ]);
  if (cachedStreak) {
    return cachedStreak;
  }

  // cache miss
  const streak = await db.streak.findUnique({
    where: { userId },
    select: { current_streak: true, longest_streak: true, last_log_date: true },
  });

  if (!streak) return false;

  return streak;
}

// Helper to get seconds until midnight
function getSecondsUntilMidnight(): number {
  const now = setTimeZone({ date: new Date() });
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // next midnight (IST)

  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

export { addLog };
