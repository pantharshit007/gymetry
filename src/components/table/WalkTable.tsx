import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";
import { format } from "date-fns-tz";

interface WalkTableProps {
  data: {
    date: Date;
    steps: number | null;
    distance: number | null;
  }[];
  isLoading: boolean;
}

function WalkTableComponent({ data, isLoading }: WalkTableProps) {
  if (isLoading) {
    return <Loader />;
  }
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Walk Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map(({ date, steps, distance }, index) => (
            <div key={index} className="rounded-md bg-muted p-4">
              <p className="font-medium">
                {format(date, "PP", { timeZone: userTimeZone })}
              </p>
              <p>Steps: {steps}</p>
              <p>
                Distance:{" "}
                {distance && distance < 1000
                  ? `${distance} m`
                  : `${(distance || 0) / 1000} km`}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const WalkTable = memo(WalkTableComponent);
