import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { SectionShell } from "@/components/layout/section-shell"
import { pageMetadata } from "@/lib/seo/metadata"
import { getPayloadClient } from "@/lib/payload"

export const dynamic = "force-dynamic"

type Args = {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: "blog-posts",
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return pageMetadata({
      title: "Artículo no encontrado | tenaasesores",
      description: "El artículo que buscas no existe o ha sido movido.",
      path: `/blog/${slug}`,
      robots: { index: false, follow: true },
    })
  }

  return pageMetadata({
    title: `${post.title} | tenaasesores`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  })
}

export default async function BlogPostPage({ params }: Args) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background py-16 md:py-24">
      <SectionShell innerClassName="max-w-3xl">
        <p className="text-sm text-muted-foreground">
          {new Date(post.publishedDate).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
          {post.author ? ` · ${post.author}` : ""}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{post.title}</h1>

        {post.tags && post.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {/* TODO: instalar @tailwindcss/typography para estilar el rich text (POC sin pulir) */}
        <div className="mt-10 space-y-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold">
          <RichText data={post.content} />
        </div>
      </SectionShell>
    </main>
  )
}
