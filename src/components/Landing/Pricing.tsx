import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic workout logging",
      "Progress tracking",
      "Limited data visualization",
      "Community access",
    ],
    cta: "Get Started",
    available: true,
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "For serious fitness enthusiasts",
    features: [
      "Advanced workout logging",
      "Detailed progress tracking",
      "Advanced data visualization",
      "Priority community support",
      "Personalized workout plans",
      "Nutrition tracking",
    ],
    cta: "Coming Soon",
    available: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Start tracking your fitness journey today
          </p>
        </div>
        <div className="flex flex-col justify-center gap-8 md:flex-row">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg p-8 shadow-lg md:w-[35%] ${tier.name === "Pro" ? "border-brand border-2" : "border-2 border-gray-600"}`}
            >
              <h3 className="font-heading text-2xl font-semibold">
                {tier.name}
              </h3>
              <p className="mt-4 text-gray-600">{tier.description}</p>
              <p className="mt-4 text-4xl font-bold">{tier.price}</p>
              <p className="mt-1 text-gray-600">
                {tier.name === "Free" ? "Forever" : "per month"}
              </p>
              <ul className="mt-6 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-6 w-6 flex-shrink-0 text-green-500" />
                    <span className="ml-3">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 w-full ${
                  tier.available
                    ? "bg-brand hover:bg-brand/90"
                    : "cursor-not-allowed bg-gray-300 text-black"
                }`}
                disabled={!tier.available}
              >
                {tier.cta}
              </Button>
              {!tier.available && (
                <p className="mt-2 text-center text-sm text-gray-500">
                  Not yet available
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
