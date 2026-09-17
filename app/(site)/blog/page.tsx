import type { Metadata } from "next"
import Link from "next/link"
import { SectionShell } from "@/components/layout/section-shell"
import { pageMetadata } from "@/lib/seo/metadata"
import { getPayloadClient } from "@/lib/payload"

export const metadata: Metadata = pageMetadata({
  title: "Blog | tenaasesores",
  description: "Guías y novedades fiscales, contables y laborales para autónomos y empresas.",
  path: "/blog",
})

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const payload = await getPayloadClient()
  const { docs: posts } = await payload.find({
    collection: "blog-posts",
    sort: "-publishedDate",
    limit: 20,
  })

  return (
    <main className="min-h-screen bg-background py-16 md:py-24">
      <SectionShell>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Blog</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Guías y novedades fiscales, contables y laborales.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-muted-foreground">Todavía no hay artículos publicados.</p>
        ) : (
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.id} className="rounded-2xl border border-border p-6">
                <p className="text-sm text-muted-foreground">
                  {new Date(post.publishedDate).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  {post.author ? ` · ${post.author}` : ""}
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </SectionShell>
    </main>
  )
}
