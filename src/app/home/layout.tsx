import React from "react";
import MouseMoveEffect from "@/hooks/use-mouse-effect";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gymetry - Track Your Progress, Visualize Your Gains",
  description:
    "Easily log your daily workouts and visualize your fitness journey with powerful data insights.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MouseMoveEffect />
      {children}
    </>
  );
}

export default layout;
