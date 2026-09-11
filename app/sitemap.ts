import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * The pages worth ranking. The legal pages and `/seminar-feedback` are left
 * out deliberately — all three set `robots: { index: false }`, and listing a
 * page here that asks not to be indexed is a contradiction search engines
 * report as an error.
 */
const ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/programmes", priority: 0.9, changeFrequency: "weekly" },
  { path: "/podcast", priority: 0.8, changeFrequency: "weekly" },
  { path: "/join", priority: 0.7, changeFrequency: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
