import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomTooltip } from "../Stats/CustomToolTip";
import { memo, useMemo } from "react";
import { Variation } from "@prisma/client";
import { ExerciseProgressChartDataType } from "@/types/analysis";
import Loader from "@/components/Loader";

interface ProgressChartProps {
  data: ExerciseProgressChartDataType[];
  selectedExercise: string;
  onExerciseChange: (exercise: string) => void;
  isLoading?: boolean;
}

const colorMap: Record<Variation, string> = {
  BICEPS: "#36A2EB",
  TRICEPS: "#FF6384",
  CHEST: "#4BC0C0",
  BACK: "#FFCE56",
  SHOULDER: "#9966FF",
  HAMSTRING: "#FF9F40",
  QUADS: "#4D4DFF",
  DEADLIFT: "#FF6F61",
  WALK: "#f97316",
};

function ProgressChartComponent({
  data,
  selectedExercise,
  onExerciseChange,
  isLoading,
}: ProgressChartProps) {
  const availableExercises = useMemo<string[]>(() => {
    return ["ALL", ...(data.map((exercise) => exercise.name) || [])];
  }, [data]);

  // NOTE: If this poses performance issues (for larger entries), optmize: Map instead of an array
  const filteredExerciseData = useMemo(() => {
    if (!data) return [];

    if (selectedExercise === "ALL") {
      return data;
    }

    return data.filter((exercise) => exercise.name === selectedExercise);
  }, [selectedExercise, data]);

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Exercise Progress Over Time</CardTitle>
        <Select value={selectedExercise} onValueChange={onExerciseChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select exercise" />
          </SelectTrigger>
          <SelectContent>
            {availableExercises.map((exercise) => (
              <SelectItem key={exercise} value={exercise}>
                {exercise === "ALL" ? "All Exercises" : exercise}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" minHeight={400} maxHeight={450}>
          <LineChart
            margin={{ right: 10, left: 10 }}
            className="max-sm:-ml-5 max-sm:mr-0"
          >
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
                offset: 0,
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Legend wrapperStyle={{ bottom: -10 }} />
            {filteredExerciseData.map((s) => (
              <Line
                dataKey="volume"
                data={s.data}
                key={s.name}
                name={s.name}
                stroke={colorMap[s.name as Variation] || "#f97316"}
                connectNulls
                dot={{ strokeWidth: 2 }}
                style={{ marginTop: 10 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export const ProgressChart = memo(ProgressChartComponent);
