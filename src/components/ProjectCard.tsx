"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/types";
import { api } from "@/config/axios";
import toast from "react-hot-toast";
import { EditProjectModal } from "./EditProjectModal";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  onProjectUpdate?: (project: Project) => void;
}

export function ProjectCard({
  project,
  onDelete,
  onProjectUpdate,
}: ProjectCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const hasVideo = !!project.generatedVideo;
  const mediaUrl =
    project.generatedVideo ||
    (project.isGenerating ? null : project.generatedImage || project.uploadedImages?.[0]);

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
      setMenuOpen(false);
    }
  };

  const handleDeleteImage = async () => {
    const isGenerated = !!project.generatedImage;
    const isUploaded = !!project.uploadedImages?.[0];
    if (!isGenerated && !isUploaded) return;
    const msg = isGenerated ? "Delete the generated image?" : "Delete the uploaded image?";
    if (!confirm(msg)) return;
    setDeletingImage(true);
    try {
      const url = isGenerated
        ? `/api/project/${project._id}/image`
        : `/api/project/${project._id}/image?type=uploaded`;
      const { data } = await api.delete<{ project: Project }>(url);
      onProjectUpdate?.(data.project);
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setDeletingImage(false);
      setMenuOpen(false);
    }
  };

  const handleDownloadVideo = () => {
    if (!project.generatedVideo) {
      toast.error("No video to download");
      return;
    }
    try {
      if (typeof window !== "undefined") {
        const link = document.createElement("a");
        link.href = project.generatedVideo;
        link.download = "";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      if (typeof window !== "undefined") {
        window.open(project.generatedVideo, "_blank");
      }
    }
    setMenuOpen(false);
  };

  const handleShare = (platform: "youtube" | "instagram" | "copy") => {
    const url =
      typeof window !== "undefined"
        ? window.location.origin + "/result/" + project._id
        : "";
    if (platform === "copy") {
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success("Link copied"))
        .catch(() => toast.error("Failed to copy link"));
      return;
    }
    const urls: Record<string, string> = {
      youtube: "https://www.youtube.com/upload",
      instagram: "https://www.instagram.com/",
    };
    if (typeof window !== "undefined") {
      window.open(urls[platform], "_blank");
      toast.success(`Open ${platform} to share`);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[var(--card)] transition hover:border-white/20">
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

      {(hasVideo || project.generatedImage || project.uploadedImages?.[0]) && (
        <div className="absolute right-2 top-2 z-10">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="More actions"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="mt-2 w-40 rounded-lg border border-white/10 bg-[var(--card)] p-1 text-sm text-zinc-200 shadow-lg">
              {hasVideo && (
                <button
                  type="button"
                  onClick={handleDownloadVideo}
                  className="flex w-full items-center justify-start rounded-md px-3 py-2 text-left hover:bg-white/10"
                >
                  Download Video
                </button>
              )}
              {(project.generatedImage || project.uploadedImages?.[0]) && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  disabled={deletingImage}
                  className="flex w-full items-center justify-start rounded-md px-3 py-2 text-left text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                >
                  {deletingImage ? "Deleting…" : "Delete Image"}
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="mt-1 flex w-full items-center justify-start rounded-md px-3 py-2 text-left text-red-400 hover:bg-red-500/20 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete Project"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="truncate font-semibold text-white">{project.name}</h3>
        <p className="truncate text-sm text-zinc-500">{project.productName}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href={`/result/${project._id}`}
            className="min-h-[36px] rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            View Details
          </Link>
          {project.uploadedImages?.length ? (
            <button
              type="button"
              onClick={() => {
                setEditOpen(true);
                setMenuOpen(false);
              }}
              className="min-h-[36px] rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              Edit
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => handleShare("youtube")}
            className="min-h-[36px] rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/15"
          >
            YouTube
          </button>
          <button
            type="button"
            onClick={() => handleShare("instagram")}
            className="min-h-[36px] rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/15"
          >
            Instagram
          </button>
          <button
            type="button"
            onClick={() => handleShare("copy")}
            className="min-h-[36px] rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/15"
          >
            Copy link
          </button>
        </div>
      </div>
      {editOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setEditOpen(false)}
          onSuccess={(updated) => {
            onProjectUpdate?.(updated);
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
}
