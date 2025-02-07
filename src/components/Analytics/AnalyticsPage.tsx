"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MaxWeightChart } from "@/components/charts/Max-weight-chart";
import { StepsChart } from "@/components/charts/Steps-chart";
import { ProgressChart } from "@/components/charts/Progress-chart";
import { ExerciseTable } from "@/components/table/ExerciseTable";
import { WalkTable } from "@/components/table/WalkTable";

import { useExerciseData } from "@/hooks/use-exercise-data";
import { ChartProps, TimeRange } from "@/types/analysis";
import { rawDataType } from "@/types/dailyLog";
import { apiClient } from "@/utils/apiClient";

const timeRangeOptions = [
  { label: "Past 7 days", value: 7 },
  { label: "Past 14 days", value: 14 },
  { label: "Past 28 days", value: 28 },
  // { label: "Past 90 days", value: 90 },
] as const;

export default function AnalyticsPage() {
  const [data, setData] = useState<rawDataType[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("7");
  const [selectedExercise, setSelectedExercise] = useState("ALL");

  async function fetchData() {
    const headers = { ["X-Time-Range"]: timeRange };
    const res = await apiClient<rawDataType[]>({
      url: "/api/v1/analysis",
      method: "GET",
      headers,
    });

    if (res.success && res.data) {
      setData(res.data);
    }
  }

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // Process data from hook
  const {
    data: processedData,
    isLoading,
    error,
  }: ChartProps = useExerciseData(data, timeRange);

  const maxWeightData = useMemo(() => {
    if (!processedData) return [];
    return Object.entries(processedData.maxWeightByExercise).map(
      ([name, weight]) => ({
        name,
        weight,
      }),
    );
  }, [processedData]);

  const stepsData = useMemo(() => {
    if (!processedData) return [];
    return Object.entries(processedData.totalStepsByDate).map(
      ([date, steps]) => ({
        date,
        steps,
      }),
    );
  }, [processedData]);

  const exerciseProgressChartData = useMemo(() => {
    if (!processedData) return [];
    return Object.entries(processedData.exerciseProgressData).map(
      ([exercise, data]) => ({
        name: exercise,
        data: data,
      }),
    );
  }, [processedData]);

  const ExerciseLogData = useMemo(() => {
    if (!processedData) return [];
    return Object.entries(processedData.exercisesByDate).map(
      ([date, exercises]) => ({
        date,
        exercises,
      }),
    );
  }, [processedData]);

  const WalkLogData = useMemo(() => {
    if (!processedData) return [];
    return processedData.walkData.map((log) => ({
      date: log.date,
      steps: log.steps,
      distance: log.distance,
    }));
  }, [processedData]);

  // Callbacks for event handlers
  const handleTimeRangeChange = useCallback((value: TimeRange) => {
    setTimeRange(value);
  }, []);

  const handleExerciseChange = useCallback((value: string) => {
    setSelectedExercise(value);
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6 py-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold max-sm:text-xl">Workout Analysis</h1>

        {/* Time range selector */}
        <Select
          value={`${timeRange}`}
          onValueChange={(value) => handleTimeRangeChange(value as TimeRange)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map((option) => (
              <SelectItem key={option.value} value={`${option.value}`}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Charts - section 1*/}
      <div className="grid gap-6 md:grid-cols-2">
        <MaxWeightChart data={maxWeightData} isLoading={isLoading} />
        <StepsChart data={stepsData} isLoading={isLoading} />
      </div>

      {/* Charts - section 2*/}
      <ProgressChart
        data={exerciseProgressChartData || []}
        selectedExercise={selectedExercise}
        onExerciseChange={handleExerciseChange}
        isLoading={isLoading}
      />

      {/* Data table - section 1*/}
      <ExerciseTable data={ExerciseLogData} isLoading={isLoading} />

      {/* Data table - section 2*/}
      <WalkTable data={WalkLogData} isLoading={isLoading} />
    </div>
  );
}
