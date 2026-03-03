"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { api } from "@/config/axios";
import { useAuth } from "@/contexts/AuthContext";
import type { AuthResponse } from "@/types";
import toast from "react-hot-toast";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and always show form from top
  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => {
      contentRef.current?.scrollTo(0, 0);
    });
    return () => {
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(id);
    };
  }, [mounted, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        const { data } = await api.post<AuthResponse>("/api/auth/register", {
          email,
          password,
          name,
        });
        login(data.token, data.user);
        toast.success("Account created! You have 20 free credits.");
      } else {
        const { data } = await api.post<AuthResponse>("/api/auth/login", {
          email,
          password,
        });
        login(data.token, data.user);
        toast.success("Signed in.");
      }
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 sm:py-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <motion.div
        ref={contentRef}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md shrink-0 rounded-2xl border border-white/10 bg-[var(--card)] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between gap-2">
          <h2 id="auth-modal-title" className="text-xl font-semibold text-white">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-400">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-base text-white placeholder-zinc-500 focus:border-[var(--accent)] focus:outline-none"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-base text-white placeholder-zinc-500 focus:border-[var(--accent)] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-base text-white placeholder-zinc-500 focus:border-[var(--accent)] focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-h-[48px] w-full rounded-lg bg-[var(--accent)] py-3 font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-400">
          {mode === "signin" ? (
            <>
              No account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-medium text-[var(--accent)] hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-medium text-[var(--accent)] hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </motion.div>
    </motion.div>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
