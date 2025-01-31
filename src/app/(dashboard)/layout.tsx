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
    <div className="flex flex-1">
      <AppBar />
      {/* Main content */}
      <main className="container flex-1 pl-0 pt-14 transition-all duration-300 lg:pl-64 lg:group-data-[collapsed=true]:pl-16">
        {children}
      </main>
    </div>
  );
}

export default layout;
