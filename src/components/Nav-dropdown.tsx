import React, { Fragment } from "react";
import Link from "next/link";

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
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import { AppItemProps } from "@/components/AppBar";
import UserAvatar from "@/components/User-avatar";
import { getServerSession } from "@/lib/getServerSession";
import LogoutButton from "./LogoutButton";

// prettier-ignore
const NavBarItem = [
  { id: 1, name: "Dashboard", href: "/dashboard", icon: Home, isAdmin: false },
  { id: 2, name: "Enter Stats", href: "/stats", icon: Calendar, isAdmin: false, },
  { id: 3, name: "Analytics", href: "/analytics", icon: LineChart, isAdmin: false, },
  { id: 4, name: "Profile", href: "/profile", icon: User, isAdmin: false },
  { id: 5, name: "Settings", href: "/settings", icon: Settings, isAdmin: false, },
  { id: 6, name: "Admin", href: "/admin", icon: ShieldCheck, isAdmin: true },
];

async function NavDropdown({ isLoggedIn }: { isLoggedIn: boolean }) {
  const session = await getServerSession();
  const user = session?.user;
  const filteredItems = NavBarItem.filter(
    (item) => !item.isAdmin || user?.role === "ADMIN",
  );

  return (
    <Fragment>
      {!isLoggedIn ? (
        // Not logged in user
        <Button asChild variant={"marketing"}>
          <Link href="/login">Get Started</Link>
        </Button>
      ) : (
        //   Logged in user dropdown
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <UserAvatar imgUrl={user?.image} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end" forceMount>
            {filteredItems.map((item) => (
              <DropDownComponent
                key={item.id}
                href={item.href}
                icon={item.icon}
                name={item.name}
              />
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Fragment>
  );
}

export default NavDropdown;

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
