"use server";

import { auth } from "@/server/auth/auth";
import { db } from "@/server/db";

/**
 * deletes the account
 * @param userId
 * @returns null
 */
async function deleteAccount(userId: string) {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false, message: "Not authenticated" };
  }

  if (session.user.id !== userId) {
    return { success: false, message: "Not authorized" };
  }

  try {
    await db.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: "Account deleted",
    };
  } catch (err: any) {
    console.error("> [ERROR-DELETEACCOUNT] deleting account ", err.message);
    return {
      success: false,
      message: err.message || "Something went wrong",
    };
  }
}

export { deleteAccount };
