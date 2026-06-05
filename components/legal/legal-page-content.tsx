"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FadeIn } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import {
  cookieRegistry,
  legalEntity,
  legalPages,
  legalRoutes,
  type LegalPageSlug,
} from "@/content/legal"
import { formatLegalText } from "@/lib/legal/format-legal-text"
import { cn } from "@/lib/utils"

const SCROLL_SPY_OFFSET_PX = 120

function formatLastUpdated(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(date)
}

type LegalPageContentProps = {
  slug: LegalPageSlug
}

export function LegalPageContent({ slug }: LegalPageContentProps) {
  const page = legalPages[slug]
  const sectionIds = useMemo(
    () => page.sections.map((section) => section.id),
    [page.sections]
  )
  const [activeSectionId, setActiveSectionId] = useState(() => sectionIds[0] ?? "")
  const lastUpdated = formatLastUpdated(legalEntity.lastUpdated)

  const updateActiveSection = useCallback(() => {
    if (sectionIds.length === 0) return

    let currentId = sectionIds[0]

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (!element) continue

      const { top } = element.getBoundingClientRect()
      if (top <= SCROLL_SPY_OFFSET_PX) {
        currentId = id
      }
    }

    setActiveSectionId((previous) => (previous === currentId ? previous : currentId))
  }, [sectionIds])

  useEffect(() => {
    setActiveSectionId(sectionIds[0] ?? "")
    updateActiveSection()
  }, [slug, sectionIds, updateActiveSection])

  useEffect(() => {
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [updateActiveSection])

  return (
    <section className="border-t border-agua/20 bg-surface-light py-12 md:py-16">
      <SectionShell>
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
          <FadeIn className="lg:sticky lg:top-28 lg:self-start">
            <nav aria-label="Índice de la página legal">
              <p className="mb-3 text-xs font-semibold tracking-wide text-accent-on-light uppercase">
                En esta página
              </p>
              <ul className="space-y-1 border-l border-on-light/15">
                {page.sections.map((section) => {
                  const isActive = activeSectionId === section.id

                  return (
                    <li key={section.id} className="relative">
                      <span
                        aria-hidden
                        className={cn(
                          "absolute top-1 bottom-1 left-0 w-0.5 rounded-full bg-primary transition-opacity duration-200",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <a
                        href={`#${section.id}`}
                        aria-current={isActive ? "location" : undefined}
                        className={cn(
                          "block py-1.5 pl-4 text-sm leading-snug transition-colors focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                          isActive
                            ? "font-semibold text-accent-on-light"
                            : "text-muted-on-light hover:text-on-light"
                        )}
                        onClick={() => setActiveSectionId(section.id)}
                      >
                        {section.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </FadeIn>

          <FadeIn className="min-w-0">
            <article className="space-y-10">
              {page.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="mb-4 text-xl font-semibold text-pretty text-on-light sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-base leading-relaxed text-muted-on-light">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{formatLegalText(paragraph)}</p>
                    ))}
                    {"listItems" in section && section.listItems ? (
                      <ul className="list-disc space-y-2 pl-5">
                        {section.listItems.map((item) => (
                          <li key={item}>{formatLegalText(item)}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  {slug === "cookies" && section.id === "tabla" ? (
                    <div className="mt-6 overflow-x-auto rounded-xl border border-on-light/15 bg-on-light/5">
                      <table className="w-full min-w-[36rem] border-collapse text-left text-sm text-muted-on-light">
                        <caption className="sr-only">
                          Detalle de cookies y almacenamiento local
                        </caption>
                        <thead>
                          <tr className="border-b border-on-light/15 bg-on-light/8">
                            <th scope="col" className="px-4 py-3 font-semibold text-on-light">
                              Nombre
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold text-on-light">
                              Tipo
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold text-on-light">
                              Finalidad
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold text-on-light">
                              Duración
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold text-on-light">
                              Proveedor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookieRegistry.map((row) => (
                            <tr
                              key={row.name}
                              className="border-b border-on-light/10 last:border-b-0"
                            >
                              <td className="px-4 py-3 align-top font-mono text-xs text-on-light">
                                {row.name}
                              </td>
                              <td className="px-4 py-3 align-top">{row.type}</td>
                              <td className="px-4 py-3 align-top">{row.purpose}</td>
                              <td className="px-4 py-3 align-top">{row.duration}</td>
                              <td className="px-4 py-3 align-top">{row.provider}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </section>
              ))}

              <footer className="border-t border-on-light/15 pt-8">
                <p className="text-sm text-muted-on-light">
                  Última actualización:{" "}
                  <time dateTime={legalEntity.lastUpdated}>{lastUpdated}</time>
                </p>
                <p className="mt-4 text-sm text-muted-on-light">
                  También puedes consultar:{" "}
                  {(
                    [
                      slug !== "aviso-legal"
                        ? { href: legalRoutes["aviso-legal"], label: "Aviso legal" }
                        : undefined,
                      slug !== "privacidad"
                        ? { href: legalRoutes.privacidad, label: "Política de privacidad" }
                        : undefined,
                      slug !== "cookies"
                        ? { href: legalRoutes.cookies, label: "Política de cookies" }
                        : undefined,
                    ] as const
                  )
                    .filter((link) => link !== undefined)
                    .map((link, index) => (
                      <span key={link.href}>
                        {index > 0 ? " · " : null}
                        <Link
                          href={link.href}
                          className="text-accent-on-light underline-offset-4 hover:underline"
                        >
                          {link.label}
                        </Link>
                      </span>
                    ))}
                </p>
              </footer>
            </article>
          </FadeIn>
        </div>
      </SectionShell>
    </section>
  )
}
