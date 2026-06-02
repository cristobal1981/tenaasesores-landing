"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { Button, marketingCtaBaseClassName, marketingCtaVariantClassName } from "@/components/ui/button"
import { BrandLogo } from "@/components/layout/brand-logo"
import { contactHref, navItems } from "@/content/site"
import { cn } from "@/lib/utils"

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function hasChildren(item: (typeof navItems)[number]): item is (typeof navItems)[number] & {
  children: ReadonlyArray<{ label: string; href: string }>
} {
  return "children" in item
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPlansOpen, setIsPlansOpen] = useState(false)
  const [isMobilePlansOpen, setIsMobilePlansOpen] = useState(false)
  const pathname = usePathname()
  const plansMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setIsPlansOpen(false)
    setIsMobilePlansOpen(false)
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isPlansOpen) return

    function handleOutsideClick(event: MouseEvent) {
      if (!plansMenuRef.current) return
      const target = event.target
      if (target instanceof Node && !plansMenuRef.current.contains(target)) {
        setIsPlansOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [isPlansOpen])

  const linkClass = (href: string) =>
    cn(
      "font-sans text-base font-medium transition-colors hover:text-primary",
      isNavActive(pathname, href) ? "text-primary" : "text-muted-on-dark"
    )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-agua/30 bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
          <BrandLogo className="justify-self-start" priority />

          <nav className="hidden items-center gap-8 justify-self-center md:flex">
            {navItems.map((item) => {
              if (hasChildren(item)) {
                const isParentActive = item.children.some((child) => isNavActive(pathname, child.href))
                return (
                  <div
                    key={item.label}
                    className="relative"
                    ref={plansMenuRef}
                  >
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1 font-sans text-base font-medium transition-colors hover:text-primary",
                        isParentActive ? "text-primary" : "text-muted-on-dark"
                      )}
                      aria-expanded={isPlansOpen}
                      aria-haspopup="menu"
                      onClick={() => setIsPlansOpen((prev) => !prev)}
                    >
                      {item.label}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isPlansOpen && "rotate-180")} />
                    </button>

                    <div
                      className={cn(
                        "absolute top-full left-1/2 z-50 mt-3 w-52 -translate-x-1/2 rounded-xl border border-agua/35 bg-background/95 p-2 shadow-lg shadow-agua/10 backdrop-blur-sm transition-[opacity,transform] duration-200",
                        isPlansOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
                      )}
                      role="menu"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          role="menuitem"
                          onClick={() => setIsPlansOpen(false)}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-agua/20 hover:text-primary",
                            isNavActive(pathname, child.href) ? "text-primary" : "text-muted-on-dark"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }

              if ("href" in item) {
                return (
                  <Link key={item.label} href={item.href} className={linkClass(item.href)}>
                    {item.label}
                  </Link>
                )
              }

              return null
            })}
          </nav>

          <div className="hidden justify-self-end md:flex">
            <Button
              asChild
              className={cn(marketingCtaBaseClassName, marketingCtaVariantClassName.primary)}
            >
              <Link href={contactHref}>Consulta Gratis</Link>
            </Button>
          </div>

          <button
            type="button"
            className="col-start-3 justify-self-end p-2 text-on-dark md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div
          className={cn(
            "grid overflow-hidden border-agua/30 transition-[grid-template-rows,border-top-width] duration-300 ease-out motion-reduce:transition-none md:hidden",
            isMenuOpen ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr] border-t-0"
          )}
          aria-hidden={!isMenuOpen}
        >
          <div className="min-h-0">
            <nav
              className={cn(
                "flex flex-col gap-4 py-4 transition-[opacity,transform] duration-250 ease-out motion-reduce:transition-none",
                isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              )}
            >
              {navItems.map((item) => {
                if (hasChildren(item)) {
                  const isParentActive = item.children.some((child) => isNavActive(pathname, child.href))
                  return (
                    <div key={item.label} className="space-y-2">
                      <button
                        type="button"
                        className={cn(
                          "inline-flex w-full items-center justify-between py-2 text-left font-sans text-base font-medium transition-colors hover:text-primary",
                          isParentActive ? "text-primary" : "text-muted-on-dark"
                        )}
                        onClick={() => setIsMobilePlansOpen((prev) => !prev)}
                        tabIndex={isMenuOpen ? 0 : -1}
                        aria-expanded={isMobilePlansOpen}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", isMobilePlansOpen && "rotate-180")}
                        />
                      </button>
                      <div
                        className={cn(
                          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200",
                          isMobilePlansOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <div className="min-h-0 pl-3">
                          <div className="flex flex-col gap-2 border-l border-agua/40 px-3 py-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                className={cn(
                                  "py-1.5 text-sm transition-colors hover:text-primary",
                                  isNavActive(pathname, child.href) ? "text-primary" : "text-muted-on-dark"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                                tabIndex={isMenuOpen && isMobilePlansOpen ? 0 : -1}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                if ("href" in item) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn("py-2 transition-colors hover:text-primary", linkClass(item.href))}
                      onClick={() => setIsMenuOpen(false)}
                      tabIndex={isMenuOpen ? 0 : -1}
                    >
                      {item.label}
                    </Link>
                  )
                }

                return null
              })}
              <Button
                asChild
                className={cn(
                  "mt-2 w-full",
                  marketingCtaBaseClassName,
                  marketingCtaVariantClassName.primary
                )}
              >
                <Link href={contactHref} onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1}>
                  Consulta Gratis
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
