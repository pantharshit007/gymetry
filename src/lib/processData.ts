import type { DailyLog } from "@/utils/types";

export function processData(data: DailyLog[]) {
  // Sort data by date in ascending order [oldest to newest]
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  // Get the last 7 days of data
  const last7DaysData = data.slice(0, 7 * 3); // Assuming max 3 entries per day

  const exerciseData = last7DaysData.filter((log) => log.workout !== "WALK");
  const walkData = last7DaysData.filter((log) => log.workout === "WALK");

  const exercisesByDate = exerciseData.reduce(
    (acc, log) => {
      const date = new Date(log.date);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(log);
      return acc;
    },
    {} as Record<string, DailyLog[]>,
  );

  const totalVolumeByExercise = exerciseData.reduce(
    (acc, log) => {
      const workout = log.workout;
      if (!acc[workout]) {
        acc[workout] = 0;
      }
      acc[workout] += (log.reps || 0) * (log.weight || 0); // reps * weight
      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort all dates first
  const sortedDates = Array.from(
    new Set(
      exerciseData.map((log) => new Date(log.date).toISOString().split("T")[0]),
    ),
  ).sort();

  const exerciseProgressData = exerciseData.reduce(
    (acc, log) => {
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

        acc[workout][dateIndex].volume +=
          ((log.reps || 0) * (log.weight || 0)) / 100; // Convert to kg
      }
      return acc;
    },
    {} as Record<string, { date: string; volume: number }[]>,
  );

  const totalStepsByDate = walkData.reduce(
    (acc, log) => {
      const date = new Date(log.date);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
      if (!acc[formattedDate]) {
        acc[formattedDate] = 0;
      }
      acc[formattedDate] += log.steps || 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    exercisesByDate,
    totalVolumeByExercise,
    exerciseProgressData,
    totalStepsByDate,
    walkData,
  };
}
