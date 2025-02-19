import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h1 className="font-heading bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Track Your Progress,
          <br />
          Visualize Your Gains
        </h1>
        <p className="mx-auto max-w-[42rem] text-sm leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Easily log your daily workouts and visualize your fitness journey with
          powerful data insights.
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild size="lg" variant={"marketing"}>
          <Link href="/login">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="max-sm:hidden">
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
      <div className="relative z-40 mt-16 w-full max-w-3xl">
        <div className="from-brand absolute -inset-[0.3] bg-gradient-to-r to-purple-600 opacity-75 blur"></div>
        <div className="relative">
          <Image
            src="/img/dashboard_dark.png"
            // src="/img/dashboard_light.png"
            alt="Gymetry Dashboard"
            width={1200}
            height={675}
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
