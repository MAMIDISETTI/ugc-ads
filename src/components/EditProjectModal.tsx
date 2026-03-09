"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { api } from "@/config/axios";
import type { Project } from "@/types";
import toast from "react-hot-toast";

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onSuccess: (updated: Project) => void;
}

export function EditProjectModal({ project, onClose, onSuccess }: EditProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const [userPrompt, setUserPrompt] = useState(project.userPrompt ?? "");
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setUserPrompt(project.userPrompt ?? "");
  }, [project.userPrompt]);

  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted]);

  const handleRegenerate = async () => {
    if (!project.uploadedImages?.length) {
      toast.error("No uploaded image to regenerate from");
      return;
    }
    setRegenerating(true);
    try {
      const { data } = await api.patch<{ project: Project }>(
        `/api/project/${project._id}`,
        { userPrompt, regenerate: true }
      );
      onSuccess(data.project);
      await api.post(`/api/project/${project._id}/generate?regenerate=1`);
      toast.success("Regenerating image…");
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Regeneration failed";
      toast.error(msg);
    } finally {
      setRegenerating(false);
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
      aria-labelledby="edit-modal-title"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md shrink-0 rounded-2xl border border-white/10 bg-[var(--card)] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between gap-2">
          <h2 id="edit-modal-title" className="text-xl font-semibold text-white">
            Edit prompt
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
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              User prompt
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-base text-white placeholder-zinc-500 focus:border-[var(--accent)] focus:outline-none"
              placeholder="e.g. Bright, minimal, lifestyle shot..."
            />
          </div>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating || !project.uploadedImages?.length}
            className="min-h-[48px] w-full rounded-lg bg-[var(--accent)] py-3 font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {regenerating ? "Regenerating… (5 credits)" : "Regenerate (5 credits)"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
