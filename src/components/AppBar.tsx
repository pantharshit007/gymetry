"use client";

import React, { use } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  LineChart,
  Home,
  Settings,
  User,
  ChevronLeft,
  AlignLeft,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useCollapseState } from "@/store/collapseState";
import { useCurrentUser } from "@/hooks/useClientSession";

// prettier-ignore
const AppBarItem = [
  { id: 1, name: "Dashboard", href: "/dashboard", icon: Home, isAdmin: false },
  { id: 2, name: "Enter Stats", href: "/stats", icon: Calendar, isAdmin: false },
  { id: 3, name: "Analytics", href: "/analytics", icon: LineChart, isAdmin: false },
  { id: 4, name: "Profile", href: "/profile", icon: User, isAdmin: false },
  { id: 5, name: "Settings", href: "/settings", icon: Settings, isAdmin: false },
  { id: 6, name: "Admin", href: "/admin", icon: ShieldCheck, isAdmin: true },
];

function AppBar() {
  const toggle = useCollapseState((state) => state.toggle);
  const collapsed = useCollapseState((state) => state.collapse);
  const user = useCurrentUser();

  const filteredItems = AppBarItem.filter(
    (item) => !item.isAdmin || user?.role === "ADMIN",
  );
  return (
    <>
      {/* Mobile Sidebar */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet>
          {/* TODO: move from here covers logo to right of nav? */}
          <SheetTrigger asChild className="fixed bottom-4 left-4 z-50">
            <Button variant="outline" size="icon">
              <AlignLeft className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex h-16 items-center justify-between border-b px-4">
              <h1 className="text-xl font-bold">
                <Link href="/">Gymetry</Link>
              </h1>
            </div>
            <SheetDescription className="sr-only">
              Navigation menu for Gymetry application
            </SheetDescription>

            {/* Mobile Sidebar Navigation */}
            <nav className="mt-2 flex-1 space-y-2 p-2">
              {AppBarItem.map((item) => (
                <AppItem
                  key={item.id}
                  href={item.href}
                  icon={item.icon}
                  name={item.name}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="group fixed inset-y-0 top-14 hidden w-64 flex-col border-r bg-background transition-all duration-300 data-[collapsed=true]:w-16 lg:flex"
        data-collapsed={collapsed}
      >
        {/* Desktop Sidebar Navigation */}
        <nav className="mt-2 flex-1 space-y-2 p-2">
          {filteredItems.map((item) => (
            <AppItem
              key={item.id}
              href={item.href}
              icon={item.icon}
              name={item.name}
            />
          ))}
        </nav>

        {/* Collapse Button */}
        <Button
          variant={"ghost"}
          className="absolute -right-5 top-5 h-10 w-10 rounded-full border bg-background"
          onClick={toggle}
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-data-[collapsed=true]:rotate-180" />
        </Button>
      </aside>
    </>
  );
}

export default AppBar;

export interface AppItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
}

function AppItem({ href, icon: Icon, name }: AppItemProps) {
  return (
    <Button asChild variant="ghost" className="w-full justify-start">
      <Link href={href}>
        <Icon className="mr-2 h-6 w-6 text-orange-500" />
        <span className="group-data-[collapsed=true]:hidden">{name}</span>
      </Link>
    </Button>
  );
}
