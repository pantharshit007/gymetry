"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { logoutAction } from "@/actions/auth";
import { getClientSession } from "@/lib/getClientSession";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const session = getClientSession();

  async function logout() {
    await logoutAction();
  }

  async function signin() {
    await signIn("google");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>

      {JSON.stringify(session)}

      <Button onClick={logout}>Logout</Button>
      <br />
      <Button onClick={signin}>Sign in </Button>
    </div>
  );
}
