"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/config/axios";
import type { Project } from "@/types";

export default function MyGenerationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
      return;
    }
    if (!user) return;
    const fetchProjects = async () => {
      try {
        const { data } = await api.get<Project[]>("/api/user/projects");
        setProjects(Array.isArray(data) ? data : []);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user, authLoading, router]);

  // Poll for projects that are generating
  useEffect(() => {
    const generating = projects.filter((p) => p.isGenerating || p.isVideoGenerating);
    if (generating.length === 0) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get<Project[]>("/api/user/projects");
        setProjects(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [projects]);

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  const handleProjectUpdate = (updated: Project) => {
    const hasMedia =
      !!updated.generatedVideo ||
      !!updated.generatedImage ||
      (updated.uploadedImages && updated.uploadedImages.length > 0);
    if (!hasMedia) {
      setProjects((prev) => prev.filter((p) => p._id !== updated._id));
    } else {
      setProjects((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-zinc-400">Loading…</p>
        </main>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-20 pb-12 sm:pt-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">My generations</h1>
          <p className="mt-2 text-zinc-400">
            View, share, or delete your ad projects.
          </p>
          {loading ? (
            <p className="mt-8 text-zinc-500">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="mt-8 text-zinc-500">
              No projects yet.{" "}
              <a href="/generate" className="text-[var(--accent)] hover:underline">
                Create your first ad
              </a>
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDelete={handleDelete}
                  onProjectUpdate={handleProjectUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
