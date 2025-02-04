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
import { processData } from "@/lib/processData";
import type { DailyLog } from "@/utils/types";
// import sampleData from "@/utils/sample.json";
import { CustomTooltip } from "../Stats/CustomToolTip";

export default function AnalyticsPage() {
  const [data, setData] = useState<DailyLog[]>([]);

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
    totalVolumeByExercise,
    exerciseProgressData,
    totalStepsByDate,
    walkData,
  } = processData(data);

  const volumeData = Object.entries(totalVolumeByExercise).map(
    ([name, volume]) => ({
      name,
      volume: volume / 100000, // Convert to a more readable scale
    }),
  );

  const stepsData = Object.entries(totalStepsByDate).map(([date, steps]) => ({
    date,
    steps,
  }));

  const exerciseProgressChartData = Object.entries(exerciseProgressData).map(
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

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Workout Analysis (Last 7 Days)</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Volume by Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
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
        <CardHeader>
          <CardTitle>Exercise Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" minHeight={400} maxHeight={450}>
            <LineChart margin={{ right: 10, left: 20 }}>
              <XAxis
                dataKey="date"
                type="category"
                allowDuplicatedCategory={false}
                tickFormatter={formatDate}
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
              {exerciseProgressChartData.map((s) => (
                <Line
                  dataKey="volume"
                  data={s.data}
                  name={s.name}
                  key={s.name}
                  stroke={`rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`}
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
