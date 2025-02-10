"use client";

import { setTimeZone } from "@/lib/streak";
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
      const now = new Date();
      const daysInMilliseconds = Number(timeRange) * 24 * 60 * 60 * 1000;
      const startDate = new Date(now.getTime() - daysInMilliseconds);

      // Filter data based on time range
      const filteredData = rawData.filter(
        (log) => new Date(log.date) >= startDate,
      );

      const exerciseData = filteredData.filter((log) => log.workout !== "WALK");
      const walkData = filteredData.filter((log) => log.workout === "WALK");

      // Group exercises by date
      const exercisesByDate = exerciseData.reduce((acc, log) => {
        const date = new Date(log.date);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(log);
        return acc;
      }, {} as ExercisesByDateType);

      // Calculate max weights
      const maxWeightByExercise = exerciseData.reduce((acc, log) => {
        const workout = log.workout;
        if (!acc[workout] || (log.weight && log.weight / 100 > acc[workout])) {
          acc[workout] = log.weight ? log.weight / 100 : 0;
        }
        return acc;
      }, {} as MaxWeightExerciseType);

      // Sort all dates: will update to remove this later
      const sortedDates = Array.from(
        new Set(
          exerciseData.map(
            (log) => new Date(log.date).toISOString().split("T")[0],
          ),
        ),
      ).sort();

      const exerciseProgressData = exerciseData.reduce((acc, log) => {
        const date = new Date(log.date);
        const formattedDate = date.toISOString().split("T")[0];
        const workout = log.workout;
        if (!acc[workout]) {
          acc[workout] = sortedDates.map(
            (date): { date: string; volume: number } => ({
              date: date as string,
              volume: 0,
            }),
          );
        }

        // Find the entry for this date and update it
        const dateIndex = acc[workout]?.findIndex(
          (entry) => entry.date === formattedDate,
        );

        if (dateIndex !== -1) {
          if (!acc[workout][dateIndex]) return acc;

          // const currentWeight = log.weight ? log.weight / 100 : 0;
          // acc[workout][dateIndex].weight = currentWeight;
          acc[workout][dateIndex].volume += log.reps! * (log.weight! / 100);
        }
        return acc;
      }, {} as ExerciseProgressDataType);

      // Process steps data
      const totalStepsByDate = walkData.reduce((acc, log) => {
        const date = new Date(log.date);
        const formattedDate = `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
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

      console.log("[ERROR PROCESSING DATA]", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [rawData, timeRange]);

  return { data: processedData, isLoading, error };
}
