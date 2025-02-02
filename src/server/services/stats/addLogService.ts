import { setTimeZone } from "@/lib/streak";
import { db } from "@/server/db";
import { LogBody } from "@/utils/types";

/**
 * service to add present day's log to the database
 * @param logs: LogBody
 */
async function addLog(logs: LogBody, userId: string) {
  const adjustDate = setTimeZone({ date: new Date(logs.date) });

  try {
    const result = await db.$transaction(async (tx) => {
      // create daily log
      await tx.dailyLog.createMany({
        data: logs.entries.map((entry) => ({
          userId,
          date: adjustDate,
          workout: entry.workout,
          reps: entry.reps,
          weight: entry.weight,
          steps: entry.steps,
          distance: entry.distance,
        })),
      });

      const currentDate = adjustDate;
      // fetch user's last log date from cache and then compare with current date to check if user has logged yesterday
      // for now i am asuming they have
      const daydifference = 1; // if its greater than 1 then user hasn't logged yesterday: 1 for 1 day
      if (daydifference > 1) {
        // reset streak: can be done via a cron job at midnight
      }

      // update user's streak
      await tx.streak.upsert({
        where: { userId },
        create: {
          userId,
          current_streak: 1,
          longest_streak: 1,
          last_log_date: adjustDate,
        },

        update: {
          current_streak: { increment: 1 },
          longest_streak: {
            increment: await tx.streak
              .findUnique({
                where: { userId },
                select: { longest_streak: true, current_streak: true },
              })
              .then((streak) =>
                streak
                  ? streak.current_streak + 1 > streak!.longest_streak
                    ? 1
                    : 0
                  : 1,
              ),
          },
          last_log_date: adjustDate,
        },
      });

      return true;
    });

    if (!result) {
      return {
        success: false,
        message: "Failed to add log",
      };
    }

    return {
      success: true,
      message: "Log added successfully",
    };
  } catch (err: any) {
    console.error("> [ERROR-SERVICE] adding log ", err);
    return {
      success: false,
      message: err.message,
    };
  }
}

export { addLog };
