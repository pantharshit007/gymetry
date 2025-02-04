import { DailyLog } from "@/utils/types";
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface groupedByDate {
  [key: string]: Record<string, { date: string; volume: number }>;
}

const ExerciseProgressChart = ({ data = [] }: { data: DailyLog[] }) => {
  // Process exercise data specifically
  const processedData = useMemo(() => {
    // Ensure data is an array and check for nested data structure
    const workoutData = data;

    // Group exercises by date and type
    const exerciseData: groupedByDate = {};

    workoutData.forEach((entry) => {
      const date = new Date(entry.date).toISOString().split("T")[0] ?? "";
      const exercise = entry.workout;

      if (!exerciseData[exercise]) {
        exerciseData[exercise] = {};
      }

      if (!exerciseData[exercise][date]) {
        exerciseData[exercise][date] = {
          date,
          volume: 0,
        };
      }

      // Calculate volume (reps * weight)
      exerciseData[exercise][date].volume +=
        (entry.reps || 0) * (entry.weight! / 100 || 0);
    });

    // Convert to chart-friendly format
    return Object.keys(exerciseData).map((exercise) => ({
      name: exercise,
      data: Object.values(exerciseData[exercise]),
    }));
  }, [data]);

  // Placeholder for no data
  if (processedData.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="text-gray-500">No exercise data available</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full">
      <h2 className="mb-4 text-xl font-bold">Exercise Volume Tracker</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{
              value: "Date",
              position: "insideBottomRight",
              offset: -10,
            }}
          />
          <YAxis
            label={{
              value: "Volume (Reps * Weight)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded border bg-white p-4 shadow">
                    <p className="font-bold">{label}</p>
                    {payload.map((entry) => (
                      <p key={entry.dataKey}>
                        {entry.name}: {entry.value}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          {processedData.map((exercise) => (
            <Line
              key={exercise.name}
              type="monotone"
              dataKey="volume"
              data={exercise.data}
              name={exercise.name}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExerciseProgressChart;
