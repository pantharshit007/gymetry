import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Ready to elevate your fitness journey?
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Join thousands of fitness enthusiasts who trust Gymetry to track their
          progress and achieve their goals.
        </p>
        <Button asChild size="lg" className="" variant={"marketing"}>
          <Link href="/login">Start Today!</Link>
        </Button>
      </div>
    </section>
  );
}
