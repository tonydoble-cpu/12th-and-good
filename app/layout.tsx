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
  title: "12th & Good Street — The Marketplace for Better Money Conversations",
  description:
    "Fee-only financial coaching from people who've lived what you're living. No products, no commissions — book a vetted coach who works only for you.",
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
