"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/10 to-transparent" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
        >
          AI UGC Ads for{" "}
          <span className="text-[var(--accent)]">Meta & Google</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:mt-6 sm:text-lg"
        >
          Create AI-generated product ad images and short-form videos. Launch
          UGC ads on Meta and Google in minutes.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
        >
          <Link
            href="/generate"
            className="min-h-[48px] rounded-xl bg-[var(--accent)] px-6 py-3 text-center font-semibold text-white hover:bg-[var(--accent-hover)] sm:min-h-0"
          >
            Create a New Ad
          </Link>
          <Link
            href="/plans"
            className="min-h-[48px] rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-center font-semibold text-white hover:bg-white/10 sm:min-h-0"
          >
            View Plans
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
