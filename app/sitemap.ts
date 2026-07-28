import type { MetadataRoute } from "next";
import { getAllQuestions } from "@/lib/questions";
import { getAllPosts } from "@/lib/blog-posts";

// Sitemap — the 401(k) Q&A pages are the long-tail SEO surface (funnel
// brief §5: "SEO is the highest-leverage channel"), so every question page
// is enumerated here alongside the core marketing pages.

const BASE = "https://12thandgood.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/employers`, priority: 0.9 },
    { url: `${BASE}/employers/roi-calculator`, priority: 0.6 },
    { url: `${BASE}/401k-questions`, priority: 0.9 },
    { url: `${BASE}/resources`, priority: 0.7 },
    { url: `${BASE}/resources/401k-calculator`, priority: 0.5 },
    { url: `${BASE}/resources/debt-payoff`, priority: 0.5 },
    { url: `${BASE}/resources/emergency-fund`, priority: 0.5 },
    { url: `${BASE}/resources/budget-builder`, priority: 0.5 },
    { url: `${BASE}/resources/benefits-checkup`, priority: 0.5 },
    { url: `${BASE}/resources/wellness-assessment`, priority: 0.5 },
    { url: `${BASE}/coach-ai`, priority: 0.6 },
    { url: `${BASE}/about`, priority: 0.6 },
    { url: `${BASE}/blog`, priority: 0.6 },
    { url: `${BASE}/privacy`, priority: 0.3 },
  ];

  const questions: MetadataRoute.Sitemap = getAllQuestions().map((q) => ({
    url: `${BASE}/401k-questions/${q.slug}`,
    priority: 0.7,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    priority: 0.5,
  }));

  return [...core, ...questions, ...posts];
}
