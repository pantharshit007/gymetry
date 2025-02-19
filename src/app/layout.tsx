import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";

import "@/styles/globals.css";
import Provider from "@/app/_providers/provider";
import { PostHogProvider } from "@/app/_providers/posthog-provider";
import { auth } from "@/server/auth/auth";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gymetry - Track Your Progress, Visualize Your Gains",
  description:
    "Easily log your daily workouts and visualize your fitness journey with powerful data insights.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, fontHeading.variable)}>
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
