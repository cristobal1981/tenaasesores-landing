import type { Metadata } from "next"
import { site } from "@/content/site"

export const defaultOgImage = {
  url: "/brand/android-chrome-512x512.png",
  width: 512,
  height: 512,
  alt: "tenaasesores — asesoría online",
} as const

type PageMetadataInput = {
  title: string
  description: string
  path: string
  ogImage?: {
    url: string
    width?: number
    height?: number
    alt?: string
  }
  robots?: Metadata["robots"]
}

export function pageMetadata({
  title,
  description,
  path,
  ogImage = defaultOgImage,
  robots,
}: PageMetadataInput): Metadata {
  const url = `${site.url}${path}`
  const imageUrl = ogImage.url.startsWith("http") ? ogImage.url : `${site.url}${ogImage.url}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "es_ES",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt ?? site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    ...(robots ? { robots } : {}),
  }
}

export const indexablePaths = [
  "",
  "/servicios",
  "/plan-autonomos",
  "/plan-empresas",
  "/nosotros",
  "/faq",
  "/contacto",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
] as const
