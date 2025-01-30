"use client";

import { useState } from "react";
import { CalendarIcon, Plus, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const exercises = [
  "biceps",
  "back",
  "shoulder",
  "hamstring",
  "chest",
  "legs",
  "triceps",
  "abs",
  "walk",
] as const;

type Exercise = (typeof exercises)[number];

interface ExerciseEntry {
  exercise: Exercise;
  sets?: number;
  reps?: number;
  weight?: number;
  steps?: number;
  distance?: number;
}

export default function StatsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<ExerciseEntry[]>([
    { exercise: "biceps", sets: 0, reps: 0, weight: 0 },
  ]);

  const addEntry = () => {
    setEntries([
      ...entries,
      { exercise: "biceps", sets: 0, reps: 0, weight: 0 },
    ]);
  };

  const updateEntry = (
    index: number,
    field: keyof ExerciseEntry,
    value: any,
  ) => {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: value,
    } as ExerciseEntry;
    setEntries(newEntries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ date, entries });
    // TODO: Submit to API
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Enter Stats</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[240px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {entries.map((entry, index) => (
              <div key={index} className="grid grid-cols-4 gap-4">
                <Select
                  value={entry.exercise}
                  onValueChange={(value: Exercise) =>
                    updateEntry(index, "exercise", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises.map((exercise) => (
                      <SelectItem key={exercise} value={exercise}>
                        {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {entry.exercise === "walk" ? (
                  <>
                    <Input
                      type="number"
                      placeholder="Steps"
                      value={entry.steps || ""}
                      onChange={(e) =>
                        updateEntry(
                          index,
                          "steps",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Distance (meters)"
                      value={entry.distance || ""}
                      onChange={(e) =>
                        updateEntry(
                          index,
                          "distance",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                    />
                    <div></div> {/* Empty div to maintain grid layout */}
                  </>
                ) : (
                  <>
                    <Input
                      type="number"
                      placeholder="Sets"
                      value={entry.sets || ""}
                      onChange={(e) =>
                        updateEntry(
                          index,
                          "sets",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={entry.reps || ""}
                      onChange={(e) =>
                        updateEntry(
                          index,
                          "reps",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={entry.weight || ""}
                      onChange={(e) =>
                        updateEntry(
                          index,
                          "weight",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </>
                )}
              </div>
            ))}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={addEntry}>
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Entries
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
