"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/Date-range-picker";
import { addDays } from "date-fns";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DateRange } from "react-day-picker";

// Sample data - in a real app, this would come from your API
const data = [
  {
    date: "Mon",
    biceps: 40,
    chest: 24,
    legs: 24,
  },
  {
    date: "Tue",
    biceps: 30,
    chest: 13,
    legs: 22,
  },
  {
    date: "Wed",
    biceps: 20,
    chest: 98,
    legs: 22,
  },
  {
    date: "Thu",
    biceps: 27,
    chest: 39,
    legs: 20,
  },
  {
    date: "Fri",
    biceps: 18,
    chest: 48,
    legs: 21,
  },
];

export default function AnalyticsPage() {
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Volume by Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="biceps"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="chest"
                    stroke="#db2777"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="legs"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Max Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="biceps"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="chest"
                    stroke="#db2777"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="legs"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
