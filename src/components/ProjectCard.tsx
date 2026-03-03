"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/types";
import { api } from "@/config/axios";
import toast from "react-hot-toast";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  showPublish?: boolean;
  onPublishToggle?: (id: string) => void;
}

export function ProjectCard({
  project,
  onDelete,
  showPublish = false,
  onPublishToggle,
}: ProjectCardProps) {
  const [deleting, setDeleting] = useState(false);
  const mediaUrl = project.generatedVideo || project.generatedImage || project.uploadedImages?.[0];
  const hasVideo = !!project.generatedVideo;

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/project/${project._id}`);
      onDelete?.(project._id);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = (platform: "youtube" | "instagram" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.origin + "/result/" + project._id : "";
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast.success("Link copied");
      return;
    }
    const urls: Record<string, string> = {
      youtube: "https://www.youtube.com/upload",
      instagram: "https://www.instagram.com/",
    };
    window.open(urls[platform], "_blank");
    toast.success(`Open ${platform} to share`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[var(--card)] transition hover:border-white/20">
      <Link href={`/result/${project._id}`} className="block aspect-video w-full overflow-hidden bg-black">
        {mediaUrl ? (
          hasVideo && project.generatedVideo ? (
            <video
              src={project.generatedVideo}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={project.generatedImage || project.uploadedImages?.[0]}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-500">
            {project.isGenerating ? "Generating…" : "No media"}
          </div>
        )}
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{project.name}</h3>
        <p className="text-sm text-zinc-500 truncate">{project.productName}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href={`/result/${project._id}`}
            className="min-h-[44px] rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/20"
          >
            View Details
          </Link>
          {hasVideo && (
            <>
              <button
                type="button"
                onClick={() => handleShare("youtube")}
                className="min-h-[44px] rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/20"
              >
                YouTube
              </button>
              <button
                type="button"
                onClick={() => handleShare("instagram")}
                className="min-h-[44px] rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/20"
              >
                Instagram
              </button>
              <button
                type="button"
                onClick={() => handleShare("copy")}
                className="min-h-[44px] rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/20"
              >
                Copy link
              </button>
            </>
          )}
          {showPublish && onPublishToggle && !hasVideo && (
            <button
              type="button"
              onClick={() => onPublishToggle(project._id)}
              className="min-h-[44px] rounded-lg bg-[var(--accent)]/20 px-3 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/30"
            >
              {project.isPublished ? "Unpublish" : "Publish"}
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto min-h-[44px] rounded-lg bg-red-500/20 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/30 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
