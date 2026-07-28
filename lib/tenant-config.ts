/**
 * White-label tenant config — the licensing seed (per funnel build brief §2).
 *
 * NOTHING in the 401(k) Q&A tool's templates hardcodes 12th & Good Street
 * branding directly — it all reads from this config. Today there is exactly
 * one tenant. When licensing to other advisors/RIAs becomes real, this
 * object moves to the `tenant_config` Supabase table (already in schema.sql)
 * and gets resolved per-hostname; the components don't change.
 *
 * Colors intentionally reference the site's CSS custom properties rather
 * than raw hex, so a licensee swap is a token swap.
 */

export type TenantConfig = {
  tenantId: string;
  orgName: string;
  /** Short name used mid-sentence ("…a ${orgShort} coach"). */
  orgShort: string;
  logoUrl: string | null;
  /** CSS color values or var() references. */
  primaryColor: string;
  accentColor: string;
  /** Show "Powered by 12th & Good Street" (licensees: true). */
  poweredBy: boolean;
  /** Where the soft CTA at the bottom of every answer routes. */
  contactCtaUrl: string;
  /** The soft CTA copy block (brief §2 "Lead Capture / Funnel Connection"). */
  ctaHeadline: string;
  ctaButtonLabel: string;
};

export const TENANT: TenantConfig = {
  tenantId: "12th-and-good",
  orgName: "12th & Good Street",
  orgShort: "12th & Good",
  logoUrl: null,
  primaryColor: "var(--accent)",
  accentColor: "var(--clay)",
  poweredBy: false,
  contactCtaUrl: "/employers",
  ctaHeadline:
    "Want this handled for your whole team, not just looked up alone?",
  ctaButtonLabel: "See how it works",
};
