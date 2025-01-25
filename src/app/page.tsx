"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { logoutAction } from "@/actions/auth";
import { getClientSession } from "@/lib/getClientSession";

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
      <Link href="/api/auth/protected">
        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
          Protected Page
        </button>
      </Link>

      {JSON.stringify(session)}

      <button onClick={logout}>Logout</button>

      <button onClick={signin}>Sign in </button>
    </div>
  );
}
