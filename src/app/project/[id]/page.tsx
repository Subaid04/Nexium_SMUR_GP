/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Project = {
  _id: string;
  companyName: string;
  problem: string;
  solution: string;
  usp: string;
  pitch?: { oneLiner?: string; detailed?: string };
};

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const data = await apiFetch<Project>(`/projects/${params.id}`);
      setProject(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load project");
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [params.id]);

  async function regenerate() {
    if (!project) return;
    setBusy(true);
    try {
      const res = await apiFetch<any>("/ai/generate-pitch", {
        method: "POST",
        body: JSON.stringify({
          projectId: project._id,
          companyName: project.companyName,
          problem: project.problem,
          solution: project.solution,
          usp: project.usp,
        }),
      });
      toast.success("Regenerated");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to regenerate");
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    if (!confirm("Delete this project?")) return;
    try {
      await apiFetch(`/projects/${params.id}`, { method: "DELETE" });
      toast.success("Deleted");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  }

  if (!project) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{project.companyName}</h1>
        <div className="flex gap-2">
          <Button onClick={regenerate} disabled={busy}>
            {busy ? "Regenerating..." : "Regenerate Pitch"}
          </Button>
          <Button variant="destructive" onClick={del}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back
          </Button>
        </div>
      </div>

      <Card className="p-4 space-y-2">
        <div>
          <span className="font-medium">Problem:</span> {project.problem}
        </div>
        <div>
          <span className="font-medium">Solution:</span> {project.solution}
        </div>
        <div>
          <span className="font-medium">USP:</span> {project.usp}
        </div>
      </Card>

      {project.pitch?.oneLiner && (
        <Card className="p-4 space-y-2">
          <div className="font-semibold">One‑liner</div>
          <p>{project.pitch.oneLiner}</p>
        </Card>
      )}

      {project.pitch?.detailed && (
        <Card className="p-4 space-y-2">
          <div className="font-semibold">Detailed Pitch</div>
          <p className="whitespace-pre-wrap">{project.pitch.detailed}</p>
        </Card>
      )}
    </div>
  );
}
