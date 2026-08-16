import type { NextConfig } from "next";

// Consumer 1:1 booking lane is LIVE alongside the employer program (restored
// Aug 2026). The booking page (/tony), the booking success page, and the
// trust pages (/how-we-make-money, /become-a-coach) are reachable again.
// Only genuinely retired routes below still redirect. /coach-ai is a live
// employer feature and is intentionally NOT redirected.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Individual coach profile routes — not part of the 1:1 lane yet.
      { source: "/coach", destination: "/employers", permanent: false },
      { source: "/coach/:path*", destination: "/employers", permanent: false },
      // /book is a convenience alias that consolidates into the booking page.
      { source: "/book", destination: "/tony", permanent: false },
      // Client account/session views stay parked until the signed-in
      // consumer experience is reopened (booking works guest-only for now).
      { source: "/session", destination: "/employers", permanent: false },
      { source: "/session/:path*", destination: "/employers", permanent: false },
      { source: "/account", destination: "/employers", permanent: false },
      { source: "/login", destination: "/employers", permanent: false },
      // Retired A/B quiz homepage variants.
      { source: "/home-a", destination: "/", permanent: false },
      { source: "/home-b", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
