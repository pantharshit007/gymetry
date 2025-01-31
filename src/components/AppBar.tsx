"use client";

import React, { Fragment } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/Mode-toggle";
import { Button } from "@/components/ui/button";
import { Calendar, LineChart, Home, Settings, User, Menu } from "lucide-react";
import Link from "next/link";

const AppBarItem = [
  { id: 1, name: "Dashboard", href: "/dashboard", icon: Home },
  { id: 2, name: "Enter Stats", href: "/stats", icon: Calendar },
  { id: 3, name: "Analytics", href: "/analytics", icon: LineChart },
  { id: 4, name: "Profile", href: "/profile", icon: User },
  { id: 5, name: "Settings", href: "/settings", icon: Settings },
];

function AppBar() {
  return (
    <Fragment>
      {/* Mobile Sidebar */}
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

            {/* Mobile Sidebar Navigation */}
            <nav className="space-y-2 p-2">
              {AppBarItem.map((item) => (
                <AppItem key={item.id} href={item.href} icon={item.icon}>
                  {item.name}
                </AppItem>
              ))}
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
          {AppBarItem.map((item) => (
            <AppItem key={item.id} href={item.href} icon={item.icon}>
              {item.name}
            </AppItem>
          ))}
        </nav>
      </aside>
    </Fragment>
  );
}

export default AppBar;

interface AppItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function AppItem({ href, icon: Icon, children }: AppItemProps) {
  return (
    <Button asChild variant="ghost" className="w-full justify-start">
      <Link href={href}>
        <Icon className="mr-2 h-5 w-5 text-orange-500" />
        <span>{children}</span>
      </Link>
    </Button>
  );
}
