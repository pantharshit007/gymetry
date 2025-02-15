"use client";

import { useState, useTransition } from "react";
import { CalendarIcon, Plus, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Variation } from "@prisma/client";

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

import { ExerciseEntry, ExerciseVariation } from "@/types/types";
import { useCurrentUser } from "@/hooks/useClientSession";
import { apiClient } from "@/utils/apiClient";
import { apiEndpoints } from "@/utils/apiRoutes";
import { toast } from "@/hooks/use-toast";

export default function StatsPage() {
  const [isPending, startTransition] = useTransition();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (entries.length === 0) {
      window.alert("Please add at least one exercise");
      return;
    }

    startTransition(async () => {
      try {
        const res = await apiClient({
          url: apiEndpoints.ADD_DAILYLOG,
          method: "POST",
          headers: {
            "X-User-Id": user.id,
          },
          data: JSON.stringify({ date: date.toISOString(), entries }),
        });

        if (!res.success) {
          console.log("[ERROR-STATS] Failed to add log:", res.message);
          toast({
            title: "Error",
            description: res.message || "Something went wrong",
            variant: "error",
          });

          return;
        }

        toast({
          title: "Success",
          description: res.message || "Log added for the day!",
          variant: "success",
        });

        // resetting the entries and available workouts
        setEntries([]);
        setAvailableWorkouts([...Object.values(Variation)]);
      } catch (err: any) {
        console.log("[ERROR-STATS] Failed to add log", err);
        toast({
          title: "Error",
          description: err.message || "Something went wrong",
          variant: "error",
        });
      }
    });
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
                      min={1}
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
                      min={1}
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
                      value={entry.reps ?? ""}
                      required
                      min={1}
                      onChange={(e) =>
                        updateEntry(
                          index,
                          "reps",
                          Number.parseInt(e.target.value) ?? 0,
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={entry.weight || ""}
                      required
                      min={1}
                      step={0.5}
                      onChange={(e) =>
                        updateEntry(
                          index,
                          "weight",
                          parseFloat(e.target.value) ?? 0,
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
                disabled={availableWorkouts.length === 0 || isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
              <Button
                type="submit"
                disabled={entries.length === 0 || isPending}
              >
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
