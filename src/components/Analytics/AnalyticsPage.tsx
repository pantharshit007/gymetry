"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { processData } from "@/lib/processData";
import type { DailyLog } from "@/utils/types";
// import sampleData from "@/utils/sample.json";
import { CustomTooltip } from "../Stats/CustomToolTip";

const timeRangeOptions = [
  { label: "Past 7 days", value: 7 },
  { label: "Past 14 days", value: 14 },
  { label: "Past 28 days", value: 28 },
  // { label: "Past 90 days", value: 90 },
];

const colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FFB74D",
  "#A366FF",
];

export default function AnalyticsPage() {
  const [data, setData] = useState<DailyLog[]>([]);
  const [timeRange, setTimeRange] = useState(7);
  const [selectedExercise, setSelectedExercise] = useState("ALL");

  async function fetchData() {
    const res = await fetch("/api/v1/analysis");
    const data = await res.json();
    setData(data.sampleData.data as DailyLog[]);
  }

  useEffect(() => {
    // In a real app, you would fetch data from an API here
    // setData(sampleData.data as DailyLog[]);
    fetchData();
  }, []);

  const {
    exercisesByDate,
    maxWeightExercise,
    exerciseProgressData,
    totalStepsByDate,
    walkData,
  } = processData(data, { timeRange: timeRange });

  const maxWeightData = Object.entries(maxWeightExercise).map(
    ([name, weight]) => ({
      name,
      weight,
    }),
  );

  const stepsData = Object.entries(totalStepsByDate).map(([date, steps]) => ({
    date,
    steps,
  }));

  const filteredExerciseData =
    selectedExercise === "ALL"
      ? exerciseProgressData
      : { [selectedExercise]: exerciseProgressData[selectedExercise] };

  const exerciseProgressChartData = Object.entries(filteredExerciseData).map(
    ([exercise, data]) => ({
      name: exercise,
      data: data,
    }),
  );

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const availableExercises = [{ name: "ALL" }, ...Object.values(maxWeightData)];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workout Analysis</h1>

        {/* Time range selector */}
        <Select
          value={`${timeRange}`}
          onValueChange={(value) => setTimeRange(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="">
          <CardHeader>
            <CardTitle>Max Weight per Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maxWeightData} margin={{ bottom: 7 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  // interval={0}
                  label={{
                    value: "Exercise",
                    position: "insideBottom",
                    offset: -6,
                  }}
                />
                <YAxis
                  label={{
                    value: "Weight Lifted",
                    angle: -90,
                    position: "insideLeft",
                    offset: 17,
                  }}
                />
                <Tooltip
                  labelFormatter={(value) => `${value}!`}
                  formatter={(value) => `${value} kg`}
                  labelClassName="text-slate-900"
                />
                <Bar dataKey="weight" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Daily Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stepsData.reverse()}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="steps" stroke="#f97316" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Exercise Progress Over Time</CardTitle>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select exercise" />
            </SelectTrigger>
            <SelectContent>
              {availableExercises.map((exercise) => (
                <SelectItem key={exercise.name} value={exercise.name}>
                  {exercise.name === "ALL" ? "All Exercises" : exercise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" minHeight={400} maxHeight={450}>
            <LineChart margin={{ right: 10, left: 20 }}>
              <XAxis
                dataKey="date"
                type="category"
                allowDuplicatedCategory={false}
                tickFormatter={formatDate}
                angle={-45}
                textAnchor="end"
                height={40}
                label={{
                  value: "Date (DD/MM)",
                  position: "insideBottomRight",
                  offset: -10,
                }}
              />
              <YAxis
                dataKey="volume"
                name="Volume (kg)"
                label={{
                  value: "Volume (Reps * Weight)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Legend wrapperStyle={{ bottom: -10 }} />
              {exerciseProgressChartData.map((s, index) => (
                <Line
                  dataKey="volume"
                  data={s.data}
                  name={s.name}
                  key={s.name}
                  stroke={colors[index % colors.length]}
                  connectNulls
                  dot={{ strokeWidth: 2 }}
                  style={{ marginTop: 10 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(exercisesByDate).map(([date, exercises]) => (
              <div key={date} className="border-b pb-4">
                <h3 className="mb-2 text-lg font-semibold">{date}</h3>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="rounded-md bg-muted p-2">
                      <p className="font-medium">{exercise.workout}</p>
                      <p>Reps: {exercise.reps}</p>
                      <p>
                        Weight:{" "}
                        {exercise.weight ? exercise.weight / 100 : "N/A"} kg
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Walk Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {walkData.map((walk, index) => (
              <div key={index} className="rounded-md bg-muted p-4">
                <p className="font-medium">
                  {new Date(walk.date).toLocaleDateString()}
                </p>
                <p>Steps: {walk.steps}</p>
                <p>
                  Distance:{" "}
                  {walk.distance && walk.distance < 1000
                    ? `${walk.distance} m`
                    : `${(walk.distance || 0) / 1000} km`}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
