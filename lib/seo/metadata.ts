import type { Metadata } from "next"
import { site } from "@/content/site"

export const defaultOgImage = {
  url: "/og-tenaasesores-1200x630.png",
  width: 1200,
  height: 630,
  alt: "tenaasesores — asesoría fiscal, contable y laboral online",
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
  "/fiscalidad-canaria",
  "/implementacion-odoo",
  "/plan-autonomos",
  "/plan-empresas",
  "/nosotros",
  "/asesoria-contable-tenerife",
  "/faq",
  "/contacto",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
] as const
