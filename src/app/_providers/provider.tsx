"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/Theme-provider";

export default function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
