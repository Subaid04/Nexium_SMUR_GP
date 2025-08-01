/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { isAuthed, clearSession } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Project = {
  _id: string;
  companyName: string;
  pitch?: { oneLiner?: string; detailed?: string };
  createdAt?: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const data = await apiFetch<Project[]>("/projects");
        setProjects(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load projects");
      }
    })();
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Projects</h1>
        <div className="space-x-2">
          <Button onClick={() => router.push("/new")}>New (AI)</Button>
          <Button
            variant="outline"
            onClick={() => {
              clearSession();
              router.replace("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects yet. Create one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <Card key={p._id} className="p-4 space-y-2">
              <div className="font-semibold">{p.companyName}</div>
              {p.pitch?.oneLiner && (
                <div className="text-sm">{p.pitch.oneLiner}</div>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/project/${p._id}`)}
                >
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
