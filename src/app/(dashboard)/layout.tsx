import React from "react";
import { redirect } from "next/navigation";
import AppBar from "@/components/AppBar";
import { auth } from "@/server/auth/auth";

async function layout({ children }: { children: React.ReactNode }) {
  // const session = await auth();
  // if (!session || !session.user) {
  //   return redirect("/login");
  // }

  return (
    <div className="flex min-h-screen">
      <AppBar />
      {/* Main content */}
      <main className="flex-1 pl-0 lg:pl-64">{children}</main>
    </div>
  );
}

export default layout;
