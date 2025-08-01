"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const [companyName, setCompanyName] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [usp, setUsp] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await apiFetch("/projects/create-with-pitch", {
        method: "POST",
        body: JSON.stringify({ companyName, problem, solution, usp }),
      });
      toast.success("Project created with AI pitch");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Create With AI</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Problem</Label>
            <Textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Solution</Label>
            <Textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Unique Selling Point</Label>
            <Textarea
              value={usp}
              onChange={(e) => setUsp(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Generating..." : "Generate & Save"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
