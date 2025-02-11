import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rawDataType } from "@/types/dailyLog";
import Loader from "@/components/Loader";
import { Activity } from "lucide-react";

interface ExerciseTableProps {
  data: {
    date: string;
    exercises: rawDataType[];
  }[];
  isLoading: boolean;
}

function ExerciseTableComponent({ data, isLoading }: ExerciseTableProps) {
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map(({ date, exercises }) => (
            <div key={date} className="border-b pb-4">
              <h3 className="mb-2 text-lg font-semibold">{date}</h3>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md bg-muted p-4"
                  >
                    <div>
                      <p className="font-medium tracking-wider text-orange-500">
                        {exercise.workout}
                      </p>
                      <p>Reps: {exercise.reps}</p>
                      <p>
                        Weight:{" "}
                        {exercise.weight ? exercise.weight / 100 : "N/A"} kg
                      </p>
                    </div>

                    <Activity className="h-8 w-8 text-orange-400" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const ExerciseTable = memo(ExerciseTableComponent);
