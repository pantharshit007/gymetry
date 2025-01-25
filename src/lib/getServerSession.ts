import { auth } from "@/server/auth/auth";
import { cache } from "react";

export const getServerSession = cache(async () => {
  const session = await auth();
  return session;
});
