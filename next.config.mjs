import withBundleAnalyzerInit from "@next/bundle-analyzer"

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.116", "192.168.88.18"],
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async redirects() {
    // URLs indexadas de un WordPress previo (2015-2020) que hoy devuelven 404.
    // Todas al home por decisión: no hay blog activo para mapearlas a contenido temático.
    return [
      {
        source: "/conoces-el-termino-screen-scraping",
        destination: "/",
        permanent: true,
      },
      {
        source: "/la-tributacion-del-crowdfunding",
        destination: "/",
        permanent: true,
      },
      {
        source: "/portfolio/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/website/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/plan",
        destination: "/",
        permanent: true,
      },
      {
        source: "/crm-comunicacion-autonomo",
        destination: "/servicios",
        permanent: true,
      },
    ]
  },
  async headers() {
    const isVercelPreview =
      process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development"

    if (isVercelPreview) {
      return [
        {
          source: "/:path*",
          headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
        },
      ]
    }

    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL_ENV) {
      return []
    }

    return [
      {
        source: "/proximamente",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/400",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/reportar-problema",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/solicitud-alta-autonomo/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
