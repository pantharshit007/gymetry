"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";

export default function ProfilePage() {
  const achievementCardRef = useRef<HTMLDivElement>(null);

  const downloadAchievementCard = async () => {
    if (achievementCardRef.current) {
      const canvas = await html2canvas(achievementCardRef.current);
      const link = document.createElement("a");
      link.download = "achievement-card.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" defaultValue="75" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" defaultValue="180" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Achievement Card</h2>
            <Button onClick={downloadAchievementCard} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          <Card
            ref={achievementCardRef}
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white"
          >
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="Profile"
                    className="h-16 w-16 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">John Doe</h3>
                  <p className="text-orange-200">Elite Lifter</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-orange-200">
                  Personal Records
                </h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span>Bench Press</span>
                    <span className="font-bold">120 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Deadlift</span>
                    <span className="font-bold">180 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Squat</span>
                    <span className="font-bold">160 kg</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
