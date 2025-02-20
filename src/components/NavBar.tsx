import { ModeToggle } from "@/components/Mode-toggle";
import { auth } from "@/server/auth/auth";
import NavDropdown from "./Nav-dropdown";
import Logo from "@/components/Logo";
import { Button } from "./ui/button";
import Link from "next/link";

export async function NavBar() {
  const session = await auth();

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <Logo navBar />
        </div>

        <div className="flex items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="max-sm:hidden"
            >
              <Link href="/about">About</Link>
            </Button>
            <ModeToggle />

            <NavDropdown isLoggedIn={!!session?.user} />
          </div>
        </div>
      </div>
    </header>
  );
}
