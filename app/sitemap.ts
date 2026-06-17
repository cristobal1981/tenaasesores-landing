import type { MetadataRoute } from "next"
import { indexablePaths } from "@/lib/seo/metadata"
import { site } from "@/content/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return indexablePaths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/contacto" || path === "/servicios"
          ? 0.9
          : path.startsWith("/aviso-legal") ||
              path.startsWith("/privacidad") ||
              path.startsWith("/cookies")
            ? 0.3
            : 0.8,
  }))
}
