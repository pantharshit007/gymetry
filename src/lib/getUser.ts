import { db } from "@/server/db";

async function getUserById(id: string) {
  const user = await db.user.findUnique({
    where: { id },
  });

  return user;
}

async function getUserByEmail(email: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  return user;
}

export { getUserById, getUserByEmail };
