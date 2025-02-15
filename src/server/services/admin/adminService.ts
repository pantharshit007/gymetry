"use server";

import { db } from "@/server/db";

/**
 * Service to fetch user details for admin dashboard
 * @returns user details
 */
export async function getUserService() {
  try {
    const userDetails = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        streak: {
          select: { current_streak: true, longest_streak: true },
        },
      },
    });

    return {
      success: true,
      data: userDetails,
    };
  } catch (err: any) {
    console.error("> [ERROR-ADMIN] getUser ", err);
    return {
      success: false,
      data: null,
      message: err.message,
    };
  }
}
