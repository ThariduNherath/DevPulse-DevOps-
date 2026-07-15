import type { Metadata } from "next";
import "./globals.css";

// Note: using system font stacks (defined in globals.css) instead of
// next/font/google on purpose — it keeps `npm run build` fully offline,
// which matters once this runs inside Docker/CI without egress to
// fonts.googleapis.com. Swap in next/font/google if you have network
// access and want a specific webfont.

export const metadata: Metadata = {
  title: "DevPulse — Live Infra Monitor",
  description: "Real-time system monitoring dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-void text-text">{children}</body>
    </html>
  );
}
