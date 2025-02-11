import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { memo } from "react";
import Loader from "@/components/Loader";

interface StepsChartProps {
  data: Array<{ date: string; steps: number }>;
  isLoading?: boolean;
}

function StepsChartComponent({ data, isLoading }: StepsChartProps) {
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip labelClassName="text-slate-900" />
            <Line type="monotone" dataKey="steps" stroke="#f97316" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export const StepsChart = memo(StepsChartComponent);
