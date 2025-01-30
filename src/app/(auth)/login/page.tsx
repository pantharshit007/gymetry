"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";

function login() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-8 rounded-lg bg-white p-10 shadow-md">
        <h1 className="text-2xl font-bold dark:text-black">Welcome Back</h1>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center gap-4 rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-50"
        >
          <span>Sign in with Google</span>
        </Button>
      </div>
    </div>
  );
}

export default login;
