"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/Mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Calendar,
  Home,
  LineChart,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { AppItemProps } from "./AppBar";
import { logoutAction } from "@/actions/auth";
import UserAvatar from "./User-avatar";

const NavBarItem = [
  { id: 1, name: "Dashboard", href: "/dashboard", icon: Home },
  { id: 2, name: "Enter Stats", href: "/stats", icon: Calendar },
  { id: 3, name: "Analytics", href: "/analytics", icon: LineChart },
  { id: 4, name: "Profile", href: "/profile", icon: User },
  { id: 5, name: "Settings", href: "/settings", icon: Settings },
];

export function NavBar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">Gymetry</span>
          </Link>
        </div>

        <div className="flex items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <UserAvatar />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {NavBarItem.map((item) => (
                  <DropDownComponent
                    key={item.id}
                    href={item.href}
                    icon={item.icon}
                    name={item.name}
                  />
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutAction}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

function DropDownComponent({ href, icon: Icon, name }: AppItemProps) {
  return (
    <DropdownMenuItem asChild>
      <Link href={href}>
        <Icon className="mr-2 h-4 w-4 text-orange-500" />
        <span>{name}</span>
      </Link>
    </DropdownMenuItem>
  );
}
