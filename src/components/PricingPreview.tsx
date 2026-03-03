"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function PricingPreview() {
  return (
    <section className="border-t border-white/10 px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Simple pricing</h2>
        <p className="mt-2 text-zinc-400">
          5 credits per image, 10 per video. New users get 20 free credits.
        </p>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-6 sm:mt-8 inline-block"
        >
          <Link
            href="/plans"
            className="flex min-h-[48px] items-center justify-center rounded-xl border border-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/10"
          >
            See Plans & Pricing
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
