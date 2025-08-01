/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await apiFetch<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const access =
        data?.session?.access_token ||
        data?.data?.session?.access_token ||
        data?.access_token;
      const user = data?.user || data?.data?.user || data?.session?.user;
      if (!access) throw new Error("No access token returned");
      saveSession(access, { id: user?.id, email: user?.email });
      toast.success("Logged in!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a className="underline" href="/signup">
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
}
