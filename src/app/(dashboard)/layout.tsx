"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/Mode-toggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, LineChart, Home, Settings, User, Menu } from "lucide-react";
import Link from "next/link";
import { getClientSession } from "@/lib/getClientSession";
import { redirect } from "next/navigation";

function layout({ children }: { children: React.ReactNode }) {
  const session = getClientSession();
  if (!session || !session.data?.user) {
    return redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar Trigger */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet>
          {/* TODO: move from here covers logo to right of nav? */}
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex h-16 items-center justify-between border-b px-4">
              <h1 className="text-xl font-bold">
                <Link href="/">Gymetry</Link>
              </h1>
              {/* TODO: move to nav bar */}
              <ModeToggle className="mr-6" />
            </div>
            <SheetDescription className="sr-only">
              Navigation menu for Gymetry application
            </SheetDescription>
            <nav className="space-y-2 p-2">
              <AppItem href="/" icon={Home}>
                Dashboard
              </AppItem>
              <AppItem href="/stats" icon={Calendar}>
                Enter Stats
              </AppItem>
              <AppItem href="/analytics" icon={LineChart}>
                Analytics
              </AppItem>
              <AppItem href="/profile" icon={User}>
                Profile
              </AppItem>
              <AppItem href="/settings" icon={Settings}>
                Settings
              </AppItem>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 hidden w-64 border-r bg-background lg:block">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1 className="text-xl font-bold">
            <Link href="/">Gymetry</Link>
          </h1>
          <ModeToggle />
        </div>

        {/* Desktop Sidebar Navigation */}
        <nav className="space-y-2 p-2">
          <AppItem href="/dashboard" icon={Home}>
            Dashboard
          </AppItem>
          <AppItem href="/stats" icon={Calendar}>
            Enter Stats
          </AppItem>
          <AppItem href="/analytics" icon={LineChart}>
            Analytics
          </AppItem>
          <AppItem href="/profile" icon={User}>
            Profile
          </AppItem>
          <AppItem href="/settings" icon={Settings}>
            Settings
          </AppItem>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 pl-0 lg:pl-64">{children}</main>
    </div>
  );
}

export default layout;

interface AppItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function AppItem({ href, icon: Icon, children }: AppItemProps) {
  return (
    <Button asChild variant="ghost" className="w-full justify-start">
      <Link href={href}>
        <Icon className="mr-2 h-5 w-5" />
        <span>{children}</span>
      </Link>
    </Button>
  );
}
