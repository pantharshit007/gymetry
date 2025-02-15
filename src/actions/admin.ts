"use server";

import { auth } from "@/server/auth/auth";
import { getUserService } from "@/server/services/admin/adminService";

export async function getUserAction() {
  const session = await auth();
  if (!session || !session.user)
    return { success: false, message: "Not logged in" };

  if (session.user.role !== "ADMIN")
    return { success: false, message: "Admin only" };

  try {
    const { data, success, message } = await getUserService();
    if (!success) throw new Error(message);

    return {
      success,
      data,
    };
  } catch (err: any) {
    console.error("> [ERROR-ADMIN-ACTION] getUser ", err);
    return {
      success: false,
      data: null,
      numberOfUsers: 0,
      message: err.message,
    };
  }
}
