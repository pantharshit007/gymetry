"use server";

import { getServerSession } from "@/lib/getServerSession";
import { fetchUserStreak } from "@/server/services/streak";

export async function fetchStreakAction() {
  const session = await getServerSession();

  if (!session || !session.user) {
    return { success: false, message: "Not authenticated", data: null };
  }

  try {
    const res = await fetchUserStreak(session.user.id);
    return {
      success: true,
      message: "Streak fetched",
      data: res,
    };
  } catch (err: any) {
    console.error("> [ERROR-FETCHSTREAK] fetching log ", err.message);
    return {
      success: false,
      message: err.message || "Something went wrong",
      data: null,
    };
  }
}
