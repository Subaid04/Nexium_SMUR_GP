import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Pitcher",
  description: "Generate investor-ready pitches fast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* add "dark" here if you want dark mode by default */}
      <body className="bg-background text-foreground">
        <Toaster richColors closeButton />
        {children}
      </body>
    </html>
  );
}
