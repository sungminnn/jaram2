import type { MetadataRoute } from "next";
import { facilityPages } from "@/content/facilities";
import { getSiteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/about/greeting", priority: 0.9 },
    { path: "/about/founding", priority: 0.9 },
    { path: "/about/vision", priority: 0.9 },
    { path: "/about/organization", priority: 0.8 },
    { path: "/news/notices", priority: 0.8 },
    { path: "/news/stories", priority: 0.8 },
    { path: "/news/gallery", priority: 0.8 },
    { path: "/news/faq", priority: 0.7 },
    { path: "/news/qna", priority: 0.7 },
  ] satisfies Array<{ path: string; priority: number }>;

  const facilityRoutes = Object.values(facilityPages).map((facility) => ({
    path: `/facilities/${facility.slug}`,
    priority: 0.8,
  }));

  return [...staticRoutes, ...facilityRoutes].map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.path === "" ? "weekly" : "monthly",
    priority: route.priority,
  }));
}
