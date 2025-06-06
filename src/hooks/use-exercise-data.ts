"use client";

import { format, toZonedTime as utcToZonedTime } from "date-fns-tz";
import {
  ExerciseProgressDataType,
  ExercisesByDateType,
  MaxWeightExerciseType,
  TotalStepsByDateType,
} from "@/types/analysis";
import { rawDataType } from "@/types/dailyLog";
import { useMemo, useState } from "react";
import { addDays } from "date-fns";

export function useExerciseData(rawData: rawDataType[], timeRange: string) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const processedData = useMemo(() => {
    try {
      // Sort data by date in ascending order [oldest to newest]
      // const sortedData = [...data].sort((a, b) => {
      //   const dateA = new Date(a.date).getTime();
      //   const dateB = new Date(b.date).getTime();
      //   return dateA - dateB;
      // });

      setIsLoading(true);

      // Get user's timezone
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Calculate date range in UTC
      const now = rawData[-1]?.date ?? new Date();
      const daysInMilliseconds = Number(timeRange) * 24 * 60 * 60 * 1000;
      const startDate = new Date(now.getTime() - daysInMilliseconds);

      // Filter data based on UTC time range
      const filteredData = rawData.filter(
        (log) => new Date(log.date) >= startDate,
      );

      const exerciseData = filteredData.filter((log) => log.workout !== "WALK");
      const walkData = filteredData.filter((log) => log.workout === "WALK");

      // Group exercises by date (displayed in user's timezone)
      const exercisesByDate = exerciseData.reduce((acc, log) => {
        const utcDate = new Date(log.date);
        const userDate = adjustDateForTimezone(utcDate, userTimeZone);
        const formattedDate = format(userDate, "PP", {
          timeZone: userTimeZone,
        });

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(log);
        return acc;
      }, {} as ExercisesByDateType);

      // Calculate max weights (timezone independent)
      const maxWeightByExercise = exerciseData.reduce((acc, log) => {
        const workout = log.workout;
        if (!acc[workout] || (log.weight && log.weight / 100 > acc[workout])) {
          acc[workout] = log.weight ? log.weight / 100 : 0;
        }
        return acc;
      }, {} as MaxWeightExerciseType);

      // Process exercise progress (display dates in user's timezone)
      const exerciseProgressData = exerciseData.reduce((acc, log) => {
        const utcDate = new Date(log.date);
        const userDate = adjustDateForTimezone(utcDate, userTimeZone);

        const formattedDate = format(userDate, "yyyy-MM-dd", {
          timeZone: userTimeZone,
        });

        const sortedDates = [
          ...new Set(
            exerciseData.map((e) =>
              format(
                adjustDateForTimezone(e.date, userTimeZone),
                "yyyy-MM-dd",
                { timeZone: userTimeZone },
              ),
            ),
          ),
        ];

        const workout = log.workout;

        if (!acc[workout]) {
          acc[workout] = sortedDates.map((date) => ({
            date,
            volume: 0,
          }));
        }

        let dateEntry = acc[workout].find((e) => e.date === formattedDate);

        if (dateEntry && log.reps && log.weight) {
          dateEntry.volume = log.reps * (log.weight / 100);
        }

        return acc;
      }, {} as ExerciseProgressDataType);

      // Process steps data (display dates in user's timezone)
      const totalStepsByDate = walkData.reduce((acc, log) => {
        const utcDate = new Date(log.date);
        const userDate = adjustDateForTimezone(utcDate, userTimeZone);
        const formattedDate = format(userDate, "d/M", {
          timeZone: userTimeZone,
        });

        if (!acc[formattedDate]) {
          acc[formattedDate] = 0;
        }
        acc[formattedDate] += log.steps || 0;
        return acc;
      }, {} as TotalStepsByDateType);

      return {
        exercisesByDate,
        maxWeightByExercise,
        exerciseProgressData,
        totalStepsByDate,
        walkData,
      };
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to process data"),
      );
      console.error("[ERROR PROCESSING DATA]", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [rawData, timeRange]);

  return { data: processedData, isLoading, error };
}

/**
 * special handler for timezone where the user's timezone is ahead of UTC and alot of sh*t happens :/
 * @param utcDate
 * @param userTimeZone
 * @returns
 */
export const adjustDateForTimezone = (utcDate: Date, userTimeZone: string) => {
  const userDate = utcToZonedTime(utcDate, userTimeZone);
  const userHours = parseInt(format(userDate, "H", { timeZone: userTimeZone }));
  const userMins = parseInt(format(userDate, "m", { timeZone: userTimeZone }));

  // Calculate the user's timezone offset in hours and minutes
  const utcOffset = -new Date().getTimezoneOffset() / 60; // Offset in hours
  const offsetHours = Math.floor(utcOffset);
  const offsetMinutes = Math.round((utcOffset - offsetHours) * 60);

  // If the local time is between 12:00 AM and the user's timezone offset, subtract one day
  if (
    userHours < offsetHours ||
    (userHours === offsetHours && userMins < offsetMinutes)
  ) {
    return addDays(userDate, -1);
  }

  return userDate;
};
