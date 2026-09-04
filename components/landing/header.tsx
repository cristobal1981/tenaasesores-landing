"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { MarketingButton } from "@/components/ui/marketing-button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { BrandLogo } from "@/components/layout/brand-logo"
import { contactHref, navItems } from "@/content/site"
import { useActiveSectionHash } from "@/lib/scroll/use-active-section-hash"
import { cn } from "@/lib/utils"

type NavItem = (typeof navItems)[number]
type PanelChild = { label: string; href: string; description: string }
type Panel = { items: ReadonlyArray<PanelChild>; faqHref: string }

/** Separa un href tipo "/servicios#fiscal" en su ruta ("/servicios") y su ancla ("fiscal"). */
function splitHref(href: string) {
  const hashIndex = href.indexOf("#")
  if (hashIndex === -1) return { path: href, hash: "" }
  return { path: href.slice(0, hashIndex) || "/", hash: href.slice(hashIndex + 1) }
}

function isNavActive(pathname: string, href: string, activeHash = "") {
  const { path, hash } = splitHref(href)
  if (hash) return pathname === path && hash === activeHash
  return pathname === path || pathname.startsWith(`${path}/`)
}

/** Para items de grid del panel: si el item no tiene hash (enlaza a la propia página,
 * p. ej. "Inicio" → "/" o "Implementación de Odoo" → "/implementacion-odoo"), solo debe
 * marcarse activo mientras no se haya cruzado ninguna sección trackeada — si no, se queda
 * activo para siempre en cuanto estás en la página, ignorando el scroll. */
function isPanelChildActive(pathname: string, href: string, activeHash: string) {
  const { path, hash } = splitHref(href)
  if (path !== pathname) return false
  return hash ? hash === activeHash : activeHash === ""
}

function hasPanel(item: NavItem): item is NavItem & { panel: Panel } {
  return "panel" in item
}

function isPanelItemActive(
  item: NavItem & { panel: Panel },
  pathname: string,
  activeHash: string
) {
  if ("href" in item) return isNavActive(pathname, item.href, activeHash)
  return item.panel.items.some((child) => isPanelChildActive(pathname, child.href, activeHash))
}

function navItemClass(isActive: boolean) {
  return cn(
    "font-sans text-base font-medium transition-colors hover:text-primary focus-visible:outline-none",
    isActive ? "text-primary" : "text-muted-on-dark"
  )
}

function megaMenuTriggerClass(isActive: boolean) {
  return cn(
    navItemClass(isActive),
    "h-auto w-auto rounded-none bg-transparent p-0 hover:bg-transparent focus:bg-transparent focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent",
    isActive
      ? "hover:text-primary focus:text-primary focus-visible:text-primary data-[state=open]:text-primary data-[state=open]:focus:text-primary"
      : "hover:text-on-dark focus:text-on-dark focus-visible:text-on-dark data-[state=open]:text-on-dark data-[state=open]:focus:text-on-dark"
  )
}

function MegaMenuGridItem({
  label,
  description,
  href,
  isActive,
  onNavigate,
}: {
  label: string
  description: string
  href: string
  isActive: boolean
  onNavigate?: () => void
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          "group flex flex-col gap-1 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "hover:bg-agua/20",
          isActive && "bg-agua/15"
        )}
      >
        <span
          className={cn(
            "leading-none font-medium text-on-dark transition-colors group-hover:text-primary",
            isActive && "text-primary"
          )}
        >
          {label}
        </span>
        <span className="line-clamp-2 text-xs leading-snug text-muted-on-dark transition-colors group-hover:text-muted-on-dark">
          {description}
        </span>
      </Link>
    </li>
  )
}

function MegaMenuFaqLink({ href, onNavigate }: { href: string; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="inline-block w-fit rounded px-3 py-1 text-xs font-medium text-muted-on-dark/80 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      Preguntas frecuentes
    </Link>
  )
}

function MegaMenuGridPanel({
  items,
  faqHref,
  pathname,
  activeHash,
  onNavigate,
}: {
  items: ReadonlyArray<PanelChild>
  faqHref: string
  pathname: string
  activeHash: string
  onNavigate?: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {items.map((child) => (
          <MegaMenuGridItem
            key={child.label}
            label={child.label}
            description={child.description}
            href={child.href}
            isActive={isPanelChildActive(pathname, child.href, activeHash)}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
      <div className="border-t border-agua/10 pt-2">
        <MegaMenuFaqLink href={faqHref} onNavigate={onNavigate} />
      </div>
    </div>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobilePanel, setOpenMobilePanel] = useState<string | null>(null)
  const [megaMenuValue, setMegaMenuValue] = useState("")
  const pathname = usePathname()

  const sectionIds = useMemo(() => {
    const ids: string[] = []
    for (const item of navItems) {
      if (!hasPanel(item)) continue
      for (const child of item.panel.items) {
        const { path, hash } = splitHref(child.href)
        if (hash && path === pathname) ids.push(hash)
      }
    }
    return ids
  }, [pathname])
  const activeHash = useActiveSectionHash(sectionIds)

  // Cierre al navegar: ajuste de estado durante el render, no en efecto.
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpenMobilePanel(null)
    setIsMenuOpen(false)
    setMegaMenuValue("")
  }

  useEffect(() => {
    if (!isMenuOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [isMenuOpen])

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-agua/30 bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[var(--site-header-height)]">
          <BrandLogo className="justify-self-start" priority />

          <NavigationMenu
            key={pathname}
            fullWidth
            delayDuration={0}
            value={megaMenuValue}
            onValueChange={setMegaMenuValue}
            className="hidden max-w-none flex-none justify-self-center md:flex"
          >
            <NavigationMenuList className="gap-7">
              {navItems.map((item) => {
                if (hasPanel(item)) {
                  const isActive = isPanelItemActive(item, pathname, activeHash)
                  const isOpen = megaMenuValue === item.label
                  return (
                    <NavigationMenuItem key={item.label} value={item.label}>
                      <NavigationMenuTrigger
                        className={megaMenuTriggerClass(isActive)}
                        onClick={(event) => {
                          if (isOpen) event.preventDefault()
                        }}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent fullWidth>
                        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                          <MegaMenuGridPanel
                            items={item.panel.items}
                            faqHref={item.panel.faqHref}
                            pathname={pathname}
                            activeHash={activeHash}
                          />
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                }

                if ("href" in item) {
                  const isActive = isNavActive(pathname, item.href, activeHash)
                  return (
                    <NavigationMenuItem key={item.label}>
                      <Link href={item.href} className={navItemClass(isActive)}>
                        {item.label}
                      </Link>
                    </NavigationMenuItem>
                  )
                }

                return null
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden justify-self-end md:flex">
            <MarketingButton asChild size="sm">
              <Link href={contactHref}>Consulta Gratis</Link>
            </MarketingButton>
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
            "fixed inset-x-0 top-16 bottom-0 bg-background transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none md:hidden",
            isMenuOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          )}
          aria-hidden={!isMenuOpen}
        >
          <nav className="flex h-full flex-col gap-1 overflow-y-auto px-6 py-8">
            {navItems.map((item) => {
              if (hasPanel(item)) {
                const isOpen = openMobilePanel === item.label
                const isParentActive = item.panel.items.some((child) =>
                  isPanelChildActive(pathname, child.href, activeHash)
                )
                return (
                  <div key={item.label} className="border-b border-agua/15 py-1">
                    <button
                      type="button"
                      className={cn(
                        navItemClass(isParentActive || isOpen),
                        "inline-flex w-full items-center justify-between py-3.5 text-left text-xl"
                      )}
                      onClick={() => setOpenMobilePanel(isOpen ? null : item.label)}
                      tabIndex={isMenuOpen ? 0 : -1}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180")}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="min-h-0 pb-3 pl-3">
                        <div className="flex flex-col gap-4 border-l border-agua/40 px-3 py-2">
                          {item.panel.items.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className={cn(
                                "block transition-colors hover:text-primary",
                                isPanelChildActive(pathname, child.href, activeHash) ? "text-primary" : "text-muted-on-dark"
                              )}
                              onClick={() => setIsMenuOpen(false)}
                              tabIndex={isMenuOpen && isOpen ? 0 : -1}
                            >
                              <span className="block text-base font-medium">{child.label}</span>
                              <span className="mt-0.5 block text-sm leading-snug text-muted-on-dark/90">
                                {child.description}
                              </span>
                            </Link>
                          ))}
                          <Link
                            href={item.panel.faqHref}
                            className={cn(
                              "block text-sm transition-colors hover:text-primary",
                              pathname === "/faq" ? "text-primary" : "text-muted-on-dark/80"
                            )}
                            onClick={() => setIsMenuOpen(false)}
                            tabIndex={isMenuOpen && isOpen ? 0 : -1}
                          >
                            Preguntas frecuentes
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              const href = "href" in item ? item.href : undefined
              if (!href) return null

              return (
                <Link
                  key={item.label}
                  href={href}
                  className={cn(
                    navItemClass(isNavActive(pathname, href, activeHash)),
                    "border-b border-agua/15 py-3.5 text-xl"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  {item.label}
                </Link>
              )
            })}
            <MarketingButton asChild size="lg" className="mt-6 w-full">
              <Link href={contactHref} onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1}>
                Consulta Gratis
              </Link>
            </MarketingButton>
          </nav>
        </div>
      </div>
    </header>
  )
}
