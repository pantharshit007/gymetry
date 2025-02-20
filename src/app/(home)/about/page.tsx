import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dumbbell,
  BarChartIcon as ChartBar,
  Code,
  HeartHandshake,
} from "lucide-react";
import Footer from "@/components/Landing/Footer";

export default function Page() {
  return (
    <div className="container mx-auto mt-[3.5rem] max-w-screen-2xl space-y-6 p-6 md:w-[90%]">
      <h1 className="font-heading text-3xl font-bold">About Gymetry</h1>

      <p className="text-lg text-muted-foreground">
        Gymetry is your personal fitness companion, designed to help you track
        your workouts, monitor your progress, and achieve your fitness goals.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={Dumbbell}
          title="Workout Logging"
          description="Easily log your exercises, sets, reps, and weights after each session."
        />
        <FeatureCard
          icon={ChartBar}
          title="Progress Tracking"
          description="Visualize your performance over time with detailed analytics and charts."
        />
        <FeatureCard
          icon={HeartHandshake}
          title="Simple"
          description="No complicated setup, just log your workouts and enjoy the benefits."
        />
        <FeatureCard
          icon={Code}
          title="Open Source (soon..)"
          description="Built with modern web technologies and open for contributions."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            At Gymetry, we believe that everyone should have access to powerful
            tools for tracking and improving their fitness journey. Our mission
            is to provide a user-friendly, data-driven platform that motivates
            and empowers individuals to reach their health and fitness goals.
          </p>
        </CardContent>
      </Card>

      <Footer />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0">
        <Icon className="mr-2 h-6 w-6 text-primary" />
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
