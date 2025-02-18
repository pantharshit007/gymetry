import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";
import Provider from "@/app/_providers/provider";
import { PostHogProvider } from "@/app/_providers/posthog-provider";
import { auth } from "@/server/auth/auth";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gymetry",
  description: "Track your gym progress",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider session={session}>
          <PostHogProvider>
            <div className="flex min-h-screen flex-col">
              <NavBar />
              {children}
              <Toaster />
              <Analytics />
            </div>
          </PostHogProvider>
        </Provider>
      </body>
    </html>
  );
}
