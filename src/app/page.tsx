import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PricingPreview } from "@/components/PricingPreview";
import { FAQ } from "@/components/FAQ";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <PricingPreview />
        <FAQ />
        <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-zinc-500">
          AdsGen – AI UGC Ads for Meta & Google
        </footer>
      </main>
    </>
  );
}
