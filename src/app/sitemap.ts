import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { pages } from "@/lib/pages";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [
    "",
    "contact",
    "current-focus",
    ...Object.keys(pages).filter((p) => !["privacy", "terms"].includes(p)),
  ].map((path) => ({
    url: new URL(`/${path}`, siteUrl).href,
    changeFrequency: "monthly" as const,
    priority:
      path === "" ? 1 : ["ai", "current-focus"].includes(path) ? 0.9 : 0.6,
  }));
}
