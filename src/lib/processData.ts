import type { DailyLog } from "@/utils/types";

export interface ProcessDataOptions {
  timeRange: number;
}

export type exercisesByDateType = {
  [key: string]: DailyLog[];
};

export type maxWeightExerciseType = {
  [key: string]: number;
};

export type exerciseProgressDataType = {
  [key: string]: { date: string; volume: number }[];
};

export type totalStepsByDateType = {
  [key: string]: number;
};

export function processData(data: DailyLog[], options: ProcessDataOptions) {
  // Sort data by date in ascending order [oldest to newest]
  // const sortedData = [...data].sort((a, b) => {
  //   const dateA = new Date(a.date).getTime();
  //   const dateB = new Date(b.date).getTime();
  //   return dateA - dateB;
  // });

  const now = new Date();
  const startDate = new Date(
    now.getTime() - options.timeRange * 24 * 60 * 60 * 1000,
  );

  // Filter data within the specified time range
  const filteredData = data.filter((log) => new Date(log.date) >= startDate);

  const exerciseData = filteredData.filter((log) => log.workout !== "WALK");
  const walkData = filteredData.filter((log) => log.workout === "WALK");

  const exercisesByDate = exerciseData.reduce((acc, log) => {
    const date = new Date(log.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(log);
    return acc;
  }, {} as exercisesByDateType);

  const maxWeightExercise = exerciseData.reduce((acc, log) => {
    const workout = log.workout;
    if (!acc[workout] || (log.weight && log.weight / 100 > acc[workout])) {
      acc[workout] = log.weight ? log.weight / 100 : 0;
    }
    return acc;
  }, {} as maxWeightExerciseType);

  // Sort all dates first
  const sortedDates = Array.from(
    new Set(
      exerciseData.map((log) => new Date(log.date).toISOString().split("T")[0]),
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
  }, {} as exerciseProgressDataType);

  const totalStepsByDate = walkData.reduce((acc, log) => {
    const date = new Date(log.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
    if (!acc[formattedDate]) {
      acc[formattedDate] = 0;
    }
    acc[formattedDate] += log.steps || 0;
    return acc;
  }, {} as totalStepsByDateType);

  return {
    exercisesByDate,
    maxWeightExercise,
    exerciseProgressData,
    totalStepsByDate,
    walkData,
  };
}
