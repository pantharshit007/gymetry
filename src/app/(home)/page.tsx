import { redirect } from "next/navigation";
import Home from "../home/page";
import { auth } from "@/server/auth/auth";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return <Home />;
}
