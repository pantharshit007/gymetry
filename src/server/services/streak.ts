import { cache } from "@/server/caches/cache";
import { CACHE_TYPES } from "@/types/cacheType";
import { db } from "@/server/db";
import { StreakCache } from "@/types/types";
import { setTimeZone } from "@/lib/streak";

/**
 * fetches the streak data for a user via: cache/db
 * @param userId
 * @param setCache - `default: true`
 * @returns streak data
 */
export const fetchUserStreak = async (
  userId: string,
  setCache: boolean = true,
) => {
  "use server";
  try {
    // Check cache for streak data
    const cachedStreak = await cache.get<StreakCache>(CACHE_TYPES.STREAK, [
      userId,
    ]);

    if (cachedStreak) {
      return cachedStreak;
    }

    // Cache miss: Fetch streak from db
    const streak = await db.streak.findUnique({
      where: { userId },
      select: {
        current_streak: true,
        longest_streak: true,
        last_log_date: true,
      },
    });

    if (!streak) throw new Error("No streak found for user");

    // for add log service
    if (!setCache) return streak;

    const secondsUntilMidnight = getSecondsUntilMidnight();
    await cache.set<StreakCache>(
      CACHE_TYPES.STREAK,
      [userId],
      streak,
      secondsUntilMidnight, // Expire at midnight IST
    );

    return streak;
  } catch (error) {
    console.error("Failed to fetch user streak:", error);
    throw new Error("Failed to fetch streak");
  }
};

// Helper: Get seconds until midnight IST
export function getSecondsUntilMidnight(): number {
  const now = setTimeZone({ date: new Date() });
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // next midnight (IST)

  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}
