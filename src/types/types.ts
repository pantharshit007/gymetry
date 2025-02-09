import { Variation } from "@prisma/client";
import { rawDataType } from "@/types/dailyLog";

export interface LogBody {
  date: string;
  entries: ExerciseEntry[];
}

export interface ExerciseEntry {
  workout: ExerciseVariation;
  reps?: number;
  weight?: number;
  steps?: number;
  distance?: number;
}

// Exercise type from Variation enum
export type ExerciseVariation = (typeof Variation)[keyof typeof Variation];

// streak cache type
export interface StreakCache {
  current_streak: number;
  longest_streak: number;
  last_log_date: Date;
}

// API response type
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface AnalysisAPIResponse extends ApiResponse {
  data: rawDataType[];
}
