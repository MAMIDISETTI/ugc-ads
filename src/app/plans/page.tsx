import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const plans = [
  {
    name: "Free",
    price: "$0",
    credits: "20 welcome credits",
    description: "Try image and video generation. 5 credits per image, 10 per video.",
    cta: "Get Started",
    href: "/",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    credits: "100 credits/month",
    description: "For small teams and creators. More generations, priority support.",
    cta: "Coming soon",
    href: "#",
    featured: true,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/mo",
    credits: "500 credits/month",
    description: "For agencies and growth teams. API access and bulk export.",
    cta: "Coming soon",
    href: "#",
    featured: false,
  },
];

export default function PlansPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-20 pb-12 sm:pt-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-center text-2xl font-bold text-white sm:text-3xl">
            Plans & pricing
          </h1>
          <p className="mt-2 text-center text-zinc-400">
            5 credits per image, 10 credits per video.
          </p>
          <div className="mt-8 grid gap-6 sm:mt-12 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-5 sm:p-6 ${
                  plan.featured
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-white/10 bg-[var(--card)]"
                }`}
              >
                <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
                <p className="mt-2 text-2xl font-bold text-white">
                  {plan.price}
                  {plan.period && (
                    <span className="text-base font-normal text-zinc-400">
                      {plan.period}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{plan.credits}</p>
                <p className="mt-4 text-sm text-zinc-400">{plan.description}</p>
                <Link
                  href={plan.href}
                  className={`mt-6 flex min-h-[48px] items-center justify-center rounded-xl py-3 text-center font-semibold sm:py-2.5 ${
                    plan.featured
                      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
