import type { MetadataRoute } from "next"
import { site } from "@/content/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/proximamente",
        "/400",
        "/reportar-problema",
        "/solicitud-alta-autonomo",
        "/solicitud-alta-autonomo/*",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
