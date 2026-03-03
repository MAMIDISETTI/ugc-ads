"use client";

import { motion } from "framer-motion";

const items = [
  {
    title: "AI image ads",
    description: "Upload a product image, add your copy, and get UGC-style ad creatives in seconds.",
  },
  {
    title: "Short-form video",
    description: "Turn your generated image into a short video for Reels and YouTube Shorts.",
  },
  {
    title: "Meta & Google ready",
    description: "Export and share to Instagram, Facebook, and Google with one click.",
  },
];

export function Features() {
  return (
    <section className="border-t border-white/10 px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          How it works
        </h2>
        <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-[var(--card)] p-6"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-zinc-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
