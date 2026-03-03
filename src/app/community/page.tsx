"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { api } from "@/config/axios";
import type { Project } from "@/types";

export default function CommunityPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const { data } = await api.get<Project[]>("/api/project/published");
        setProjects(Array.isArray(data) ? data : []);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPublished();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-20 pb-12 sm:pt-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Community</h1>
          <p className="mt-2 text-zinc-400">
            Browse published ads from other creators.
          </p>
          {loading ? (
            <p className="mt-8 text-zinc-500">Loading…</p>
          ) : projects.length === 0 ? (
            <p className="mt-8 text-zinc-500">No published ads yet.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
