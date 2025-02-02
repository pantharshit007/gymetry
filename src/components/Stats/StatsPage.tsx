"use client";

import { useState } from "react";
import { CalendarIcon, Plus, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";

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
import { ApiResponse, ExerciseEntry, ExerciseVariation } from "@/utils/types";
import { Variation } from "@prisma/client";
import { useCurrentUser } from "@/lib/useClientSession";

export default function StatsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [availableWorkouts, setAvailableWorkouts] = useState<
    ExerciseVariation[]
  >([...Object.values(Variation)]);

  const user = useCurrentUser();
  if (!user || !user.id) return <div>Loading...</div>;

  const addEntry = () => {
    if (availableWorkouts.length === 0) return;

    const newEntries = [...entries, { workout: availableWorkouts[0] }];
    setEntries(newEntries as ExerciseEntry[]);

    // Remove the selected exercise from the available workouts
    setAvailableWorkouts(availableWorkouts.slice(1));
  };

  const updateEntry = (
    index: number,
    field: keyof ExerciseEntry,
    value: number,
  ) => {
    const newEntries = [...entries];
    // prettier-ignore
    newEntries[index] = {...newEntries[index], [field]: value,} as ExerciseEntry;
    setEntries(newEntries);
  };

  const deleteEntry = (index: number) => {
    const exerciseToDelete = entries[index]?.workout;
    // prettier-ignore
    setAvailableWorkouts([...availableWorkouts, exerciseToDelete] as ExerciseVariation[]);
    setEntries(entries.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ date, entries });

    if (entries.length === 0) {
      window.alert("Please add at least one exercise");
      return;
    }

    const data = await fetch("/api/v1/addlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": user.id,
      },
      body: JSON.stringify({ date, entries }),
    });

    const response: ApiResponse = await data.json();

    if (!data.ok || !response.success) {
      console.error("> [ERROR-STATS] Failed to add log", response.message);
      throw new Error("Failed to add log");
    }

    console.log(response);

    // TODO: Submit to API
  };

  const scrollIntoView = (node: HTMLElement) => {
    node.scrollIntoView({ behavior: "smooth" });
  };

  // handle change of workouts
  function handleExerciseChange(
    index: number,
    newExercise: ExerciseVariation,
  ): void {
    const oldExercise = entries[index]?.workout;
    const newEntries = [...entries];
    // reseting reps and weight for the new exercise
    // prettier-ignore
    newEntries[index] = {...newEntries[index], workout: newExercise };
    setEntries(newEntries);

    if (oldExercise === newExercise) return;

    // Update available workouts
    const newAvailableWorkouts = availableWorkouts.map((workout) =>
      workout === newExercise ? oldExercise : workout,
    );

    setAvailableWorkouts(newAvailableWorkouts as ExerciseVariation[]);
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col items-center justify-between gap-4 max-md:flex-row sm:flex-row">
        <h1 className="text-3xl font-bold max-md:text-2xl">Enter Stats</h1>

        {/* CALENDER */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[240px] justify-start text-left font-normal max-md:w-[200px]"
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
              <div
                key={index}
                className="grid gap-4 max-sm:pb-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <Select
                  value={entry.workout}
                  onValueChange={(value: ExerciseVariation) =>
                    handleExerciseChange(index, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {[entry.workout, ...availableWorkouts].map((exercise) => (
                      <SelectItem key={exercise} value={exercise}>
                        {exercise.charAt(0).toUpperCase() +
                          exercise.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* INPUT BOXES */}
                {entry.workout === "WALK" ? (
                  <>
                    <Input
                      type="number"
                      placeholder="Steps"
                      value={entry.steps ?? ""}
                      required
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
                      value={entry.distance ?? ""}
                      required
                      onChange={(e) =>
                        updateEntry(
                          index,
                          "distance",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </>
                ) : (
                  <>
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={entry.reps || ""}
                      required
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
                      required
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

                {/* DELETE BUTTON */}
                <Button
                  variant="ghost"
                  type="button"
                  size="icon"
                  onClick={() => deleteEntry(index)}
                  className="h-9 w-9 rounded-full outline-dotted outline-1 outline-rose-500 max-sm:ml-auto"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Delete exercise</span>
                </Button>
              </div>
            ))}

            {/* ADD ENTRY / SAVE */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={addEntry}
                disabled={availableWorkouts.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
              <Button type="submit" disabled={entries.length === 0}>
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
