import { env } from "@/env";
import { Metadata } from "next";

const TITLE = "Gymetry - Track Your Progress, Visualize Your Gains";
const DESCRIPTION =
  "Easily log your daily workouts and visualize your fitness journey with powerful data insights.";
const PREVIEW_URL = "/img/preview.png";
const BASE_URL = "https://gymetry.pantharhsit007.tech";
const ALT_TITLE = "Simple, smooth, and fast dashboard for your gym workouts";

export const siteConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: "./favicon.ico" },
  applicationName: "Gymetry",
  authors: [{ name: "pantharhsit007" }],
  publisher: "pantharhsit007",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  alternates: { canonical: BASE_URL },
  twitter: {
    creator: "@pantharhsit007",
    title: TITLE,
    description: DESCRIPTION,
    card: "summary_large_image",
    images: [
      {
        url: PREVIEW_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Gymetry",
    url: BASE_URL,
    locale: "en_US",
    images: [
      {
        url: PREVIEW_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Fitness",
  keywords:
    "Gym, Workout, Fitness, Health, Track, Dashboard, Progress, Visualize, Analytics, Data Insights",
  metadataBase: new URL(BASE_URL),
};
