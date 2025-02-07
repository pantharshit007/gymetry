import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { memo } from "react";
import Loader from "@/components/Loader";

interface MaxWeightChartProps {
  data: { name: string; weight: number }[];
  isLoading?: boolean;
}

function MaxWeightChartComponent({ data, isLoading }: MaxWeightChartProps) {
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Max Weight per Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ bottom: 7 }}>
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
  );
}

export const MaxWeightChart = memo(MaxWeightChartComponent);
