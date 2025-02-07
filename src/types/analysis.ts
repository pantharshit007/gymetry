import { rawDataType } from "./dailyLog";

export interface ChartProps {
  data: ProcessedData | null;
  isLoading?: boolean;
  error?: Error | null;
}

export type TimeRange = 7 | 14 | 30 | 60 | 90;

export type ExercisesByDateType = {
  [key: string]: rawDataType[];
};

export type MaxWeightExerciseType = {
  [key: string]: number;
};

export type ExerciseProgressDataType = {
  [key: string]: { date: string; volume: number }[];
};

export type TotalStepsByDateType = {
  [key: string]: number;
};

export type ExerciseProgressChartDataType = {
  name: string;
  data: {
    date: string;
    volume: number;
  }[];
};

export interface ProcessedData {
  exercisesByDate: ExercisesByDateType;
  maxWeightByExercise: MaxWeightExerciseType;
  exerciseProgressData: ExerciseProgressDataType;
  totalStepsByDate: TotalStepsByDateType;
  walkData: rawDataType[];
}
