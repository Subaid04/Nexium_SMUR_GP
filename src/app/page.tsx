import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-bold">AI Pitcher</h1>
        <p className="text-muted-foreground">
          Create one-liner & detailed investor pitches in seconds.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            className="px-5 py-2 rounded-md bg-primary text-primary-foreground"
            href="/login"
          >
            Login
          </Link>
          <Link className="px-5 py-2 rounded-md border" href="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
