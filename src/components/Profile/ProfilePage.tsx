"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import { useCurrentUser } from "@/lib/useClientSession";
import UserAvatar from "../User-avatar";

export default function ProfilePage() {
  const achievementCardRef = useRef<HTMLDivElement>(null);

  const user = useCurrentUser();

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
              <Label>Name</Label>
              <p className="font-mono text-orange-400">
                {user?.name || "John Doe"}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <p className="font-mono text-orange-400">
                {user?.email || "john@example.com"}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <p className="capitalize">{user?.role || "User"}</p>
            </div>

            {/*
        <div className="grid gap-2">
          <Label>Weight (kg)</Label>
          <p>75</p>
        </div>
        <div className="grid gap-2">
          <Label>Height (cm)</Label>
          <p>180</p>
        </div>
        */}
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
            className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white"
          >
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <UserAvatar className="h-full w-full" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{user?.name || "Ryan"}</h3>
                  <p className="font-medium italic text-slate-700">
                    Elite Lifter
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
