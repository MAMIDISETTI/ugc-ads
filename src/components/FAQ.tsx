"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How many credits do I get?",
    a: "New users get 20 free credits. Image generation uses 5 credits per project; video generation uses 10 credits per project.",
  },
  {
    q: "Which platforms can I use my ads on?",
    a: "Ads are designed for Meta (Facebook, Instagram, Reels) and Google. You can share via YouTube, Instagram, or copy the link.",
  },
  {
    q: "Do I need a Google or Cloudinary account?",
    a: "You only need an AdsGen account. We use Google AI and Cloudinary on the backend for generation and storage.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-t border-white/10 px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-8 space-y-2 sm:mt-10">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-[var(--card)]"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex min-h-[48px] w-full items-center justify-between px-4 py-3 text-left font-medium text-white"
              >
                {faq.q}
                <span className="text-zinc-400">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className="border-t border-white/10 px-4 py-3 text-sm text-zinc-400">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
