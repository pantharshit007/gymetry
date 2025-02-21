import { BarChart2, Calendar, ClipboardList, TrendingUp } from "lucide-react";

const features = [
  {
    name: "Workout Logging",
    description: "Easily log your daily workouts with our intuitive interface.",
    icon: Calendar,
  },
  {
    name: "Progress Tracking",
    description:
      "Track your progress over time with detailed metrics and charts.",
    icon: TrendingUp,
  },
  {
    name: "Data Visualization",
    description:
      "Visualize your fitness journey with powerful, interactive graphs.",
    icon: BarChart2,
  },
  {
    name: "Variety of exercises",
    description:
      "Simple interface to record exercises, sets, reps, and weights + Walk",
    icon: ClipboardList,
  },
];

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-24" id="features">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Powerful Features
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover how Gymetry can transform your fitness journey with our
          innovative tools.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative overflow-hidden rounded-lg border bg-slate-200/80 p-8 dark:bg-stone-900/80"
          >
            <div className="flex items-center gap-4">
              <feature.icon className="text-brand h-8 w-8" />
              <h3 className="font-heading font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
