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
      const now = new Date();
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
        const userDate = utcToZonedTime(utcDate, userTimeZone);
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
        const userDate = utcToZonedTime(utcDate, userTimeZone);

        const formattedDate = format(userDate, "yyyy-MM-dd", {
          timeZone: userTimeZone,
        });

        // Sort dates in UTC
        const sortedDates = Array.from(
          new Set(
            exerciseData.map((log) =>
              format(
                utcToZonedTime(new Date(log.date), userTimeZone),
                "yyyy-MM-dd",
                { timeZone: userTimeZone },
              ),
            ),
          ),
        ).sort();

        const workout = log.workout;

        if (!acc[workout]) {
          acc[workout] = sortedDates.map((date) => ({
            date,
            volume: null,
          }));
        }

        const dateEntry = acc[workout]?.find(
          (entry) => entry.date === formattedDate,
        );

        if (dateEntry) {
          dateEntry.volume = log.reps! * (log.weight! / 100);
        }

        return acc;
      }, {} as ExerciseProgressDataType);

      // Process steps data (display dates in user's timezone)
      const totalStepsByDate = walkData.reduce((acc, log) => {
        const utcDate = new Date(log.date);
        const userDate = utcToZonedTime(utcDate, userTimeZone);
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
