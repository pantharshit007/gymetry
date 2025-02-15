import { auth } from "@/server/auth/auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

async function layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || !session.user) {
    return redirect("/login");
  }

  if (session?.user?.role !== "ADMIN") {
    return notFound();
  }
  return <>{children}</>;
}

export default layout;
