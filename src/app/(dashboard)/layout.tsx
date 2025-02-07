import React from "react";
import { redirect } from "next/navigation";
import AppBar from "@/components/AppBar";
import { auth } from "@/server/auth/auth";
import ClientWrapper from "@/components/ClientWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gymetry: Dashboard",
  description: "Track your gym progress",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

async function layout({ children }: { children: React.ReactNode }) {
  // const session = await auth();
  // if (!session || !session.user) {
  //   return redirect("/login");
  // }

  return (
    <ClientWrapper>
      <AppBar />

      {/* Main content */}
      <main
        data-content
        className="container flex-1 pt-14 transition-all duration-300 lg:pl-64"
      >
        {children}
      </main>
    </ClientWrapper>
  );
}

export default layout;
