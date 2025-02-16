"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

function LogoutButton() {
  async function logout() {
    await signOut({ redirectTo: "/login" });
  }
  return (
    <div onClick={logout} className="flex items-center gap-2">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </div>
  );
}

export default LogoutButton;
