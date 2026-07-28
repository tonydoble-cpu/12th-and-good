import type { Metadata } from "next";
import "@fontsource/newsreader/300.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/500.css";
import "@fontsource/instrument-sans/600.css";
import ScrollReveal from "@/components/ScrollReveal";
import "./globals.css";

export const metadata: Metadata = {
  title: "12th & Good Street — Financial wellness your team will actually use",
  description:
    "A named financial coach for every employee — by phone, email, and Zoom, all year. One flat annual fee, no commissions, no per-user meter. Employer-sponsored, employee-private.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-ink">
        <ScrollReveal />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
