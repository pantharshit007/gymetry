import { Activity, Dumbbell, Target, Trophy, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardCard from "./Dashboard-card";

function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/stats">
            <Plus className="mr-2 h-4 w-4" /> Add New Stats
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Workouts"
          icon={Dumbbell}
          content="24"
          description="+2 from last month"
        />
        <DashboardCard
          title="Active Streak"
          icon={Trophy}
          content="7 days"
          description="Personal best: 14 days"
        />

        <DashboardCard
          title="Total Volume"
          icon={Activity}
          content="12,450 kg"
          description="+15% from last week"
        />

        <DashboardCard
          title="Goals Completed"
          icon={Target}
          content="3/5"
          description="2 goals remaining"
        />
      </div>

      {/* TODO: Think what to do about this. */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Latest Exercise Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Bench Press", weight: "80kg", reps: "10", sets: "3" },
              { name: "Deadlift", weight: "120kg", reps: "8", sets: "4" },
              { name: "Squats", weight: "100kg", reps: "12", sets: "3" },
              { name: "Shoulder Press", weight: "40kg", reps: "10", sets: "3" },
              { name: "Bicep Curls", weight: "20kg", reps: "12", sets: "4" },
              { name: "Pull-ups", weight: "BW", reps: "8", sets: "3" },
            ].map((exercise) => (
              <Card key={exercise.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{exercise.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">{exercise.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reps:</span>
                      <span className="font-medium">{exercise.reps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sets:</span>
                      <span className="font-medium">{exercise.sets}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

export default DashboardPage;
