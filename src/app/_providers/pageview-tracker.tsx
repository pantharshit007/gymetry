"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, use } from "react";
import { usePostHog } from "posthog-js/react";
import { useCurrentUser } from "@/hooks/useClientSession";

export default function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const userInfo = useCurrentUser();

  // Identify user
  useEffect(() => {
    if (posthog && userInfo) {
      posthog.identify(userInfo.id, {
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.image,
      });
    } else {
      posthog.reset();
    }
  }, [posthog, userInfo]);

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
