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
  // metadataBase makes every relative OG/twitter image URL resolve to the
  // production domain — without it, social cards silently fail to render.
  metadataBase: new URL("https://12thandgood.com"),
  title: "12th & Good Street — Financial wellness your team will actually use",
  description:
    "A named financial coach for every employee — by phone, email, and Zoom, all year. One flat annual fee, no commissions, no per-user meter. Employer-sponsored, employee-private.",
  openGraph: {
    siteName: "12th & Good Street",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

// Organization schema, sitewide — pairs with the Person/Book schema on
// /about so search engines connect the company, the founder, and the books.
const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "12th & Good Street",
  url: "https://12thandgood.com",
  logo: "https://12thandgood.com/icon.svg",
  description:
    "Employer-sponsored financial wellness: one flat annual fee gives everyone on the payroll a financial coach they can actually call. No commissions, no products.",
  email: "hello@12thandgood.com",
  founder: { "@type": "Person", name: "Tony Doble" },
  sameAs: ["https://www.linkedin.com/in/tonydoble"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        <ScrollReveal />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
