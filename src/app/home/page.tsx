import Hero from "@/components/Landing/Hero";
import Features from "@/components/Landing/Features";
import CTA from "@/components/Landing/CTA";
import Footer from "@/components/Landing/Footer";
import Pricing from "@/components/Landing/Pricing";
import FAQ from "@/components/Landing/Faq";
import MouseMoveEffect from "@/hooks/use-mouse-effect";

export default function Home() {
  return (
    <>
      <MouseMoveEffect />

      <div className="relative min-h-screen">
        {/* Background gradients */}
        <div className="h-full w-full bg-slate-950">
          <div className="absolute bottom-0 left-0 right-0 top-[3.5rem] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="relative">
          <Hero />
          <Features />
          {/* <Pricing /> */}
          <FAQ />
          <CTA />
          <Footer />
        </div>
      </div>
    </>
  );
}
