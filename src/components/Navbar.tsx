"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { AuthModal } from "./AuthModal";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/generate", label: "Create Ad" },
  { href: "/my-generations", label: "My Videos" },
  { href: "/community", label: "Community" },
  { href: "/plans", label: "Plans" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const linkClass = (href: string) =>
    `block rounded-lg px-3 py-2.5 text-base font-medium transition md:inline-block md:px-0 md:py-0 md:text-sm ${
      pathname === href ? "text-[var(--accent)]" : "text-zinc-400 hover:text-white md:hover:bg-transparent"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[var(--background)]/90 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 min-h-[44px] max-w-6xl items-center justify-between gap-4 px-4 sm:h-16">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white sm:text-xl min-h-[44px] min-w-[44px] flex items-center"
          aria-label="AdsGen home"
        >
          AdsGen
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400">{user.credits} credits</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20 min-h-[36px]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="text-sm font-medium text-zinc-400 hover:text-white min-h-[36px] py-2"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] min-h-[40px]"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <span className="text-xs text-zinc-400 sm:text-sm">{user.credits} cr</span>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/10"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <span className="text-xl leading-none" aria-hidden>×</span>
            ) : (
              <span className="flex flex-col gap-1" aria-hidden>
                <span className="h-0.5 w-5 bg-current" />
                <span className="h-0.5 w-5 bg-current" />
                <span className="h-0.5 w-5 bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 bg-[var(--background)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={linkClass(href) + " w-full"}
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-left text-base font-medium text-white hover:bg-white/20"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-base font-medium text-zinc-400 hover:bg-white/10 hover:text-white"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-lg bg-[var(--accent)] px-3 py-2.5 text-center text-base font-semibold text-white hover:bg-[var(--accent-hover)]"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {authOpen && (
          <AuthModal
            onClose={() => setAuthOpen(false)}
            onSuccess={() => setAuthOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
