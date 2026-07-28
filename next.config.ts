import type { NextConfig } from "next";

// Retired July 2026 — the consumer marketplace (book-a-coach, pay-per-session,
// coach recruitment) is retired in favor of the employer annual-program
// business. These routes still exist in the codebase (not yet deleted, so a
// stale link or bookmark doesn't 404) but are no longer linked from anywhere
// on the site. Redirect them to the pages that replaced them.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/coaches", destination: "/employers", permanent: false },
      { source: "/coach", destination: "/employers", permanent: false },
      { source: "/coach/:path*", destination: "/employers", permanent: false },
      { source: "/tony", destination: "/about", permanent: false },
      { source: "/become-a-coach", destination: "/employers", permanent: false },
      { source: "/book", destination: "/employers#contact", permanent: false },
      { source: "/book/:path*", destination: "/employers#contact", permanent: false },
      { source: "/session", destination: "/employers", permanent: false },
      { source: "/session/:path*", destination: "/employers", permanent: false },
      { source: "/account", destination: "/employers", permanent: false },
      { source: "/login", destination: "/employers", permanent: false },
      { source: "/how-we-make-money", destination: "/employers#pricing", permanent: false },
      // NOTE: /coach-ai is intentionally NOT retired — it's a live feature
      // sold on /employers ("AI Money Coach — 24/7 access") and linked from
      // /resources and the blog. It was briefly redirected here by mistake.
      { source: "/home-a", destination: "/", permanent: false },
      { source: "/home-b", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
