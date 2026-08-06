"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { MarketingButton } from "@/components/ui/marketing-button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { BrandLogo } from "@/components/layout/brand-logo"
import { contactHref, navItems } from "@/content/site"
import { cn } from "@/lib/utils"

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function hasChildren(item: (typeof navItems)[number]): item is (typeof navItems)[number] & {
  children: ReadonlyArray<{ label: string; href: string; description: string }>
} {
  return "children" in item
}

function PlansNavDropdown({
  item,
  pathname,
}: {
  item: (typeof navItems)[number] & {
    children: ReadonlyArray<{ label: string; href: string; description: string }>
  }
  pathname: string
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isParentActive = item.children.some((child) => isNavActive(pathname, child.href))

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  // Cierre al navegar: ajuste de estado durante el render, no en efecto.
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 font-sans text-base font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          isParentActive || open ? "text-primary" : "text-muted-on-dark"
        )}
        aria-label="Abrir menú de planes"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.label}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="absolute top-full left-1/2 z-50 mt-1.5 w-72 -translate-x-1/2 rounded-xl border border-agua/30 bg-background p-2 shadow-lg shadow-black/20">
          <ul className="flex flex-col gap-0.5">
            {item.children.map((child) => (
              <PlansNavListItem
                key={child.label}
                label={child.label}
                description={child.description}
                href={child.href}
                isActive={isNavActive(pathname, child.href)}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function navItemClass(isActive: boolean) {
  return cn(
    "font-sans text-base font-medium transition-colors hover:text-primary focus-visible:outline-none",
    isActive ? "text-primary" : "text-muted-on-dark"
  )
}

function PlansNavListItem({
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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobilePlansOpen, setIsMobilePlansOpen] = useState(false)
  const pathname = usePathname()

  // Cierre al navegar: ajuste de estado durante el render, no en efecto.
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setIsMobilePlansOpen(false)
    setIsMenuOpen(false)
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
            viewport={false}
            className="hidden max-w-none flex-none justify-self-center md:flex"
          >
            <NavigationMenuList className="gap-7">
              {navItems.map((item) => {
                if (hasChildren(item)) {
                  return (
                    <NavigationMenuItem key={item.label} className="!bg-transparent">
                      <PlansNavDropdown item={item} pathname={pathname} />
                    </NavigationMenuItem>
                  )
                }

                if ("href" in item) {
                  const isActive = isNavActive(pathname, item.href)
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
              if (hasChildren(item)) {
                const isParentActive = item.children.some((child) =>
                  isNavActive(pathname, child.href)
                )
                return (
                  <div key={item.label} className="border-b border-agua/15 py-1">
                    <button
                      type="button"
                      className={cn(
                        navItemClass(isParentActive || isMobilePlansOpen),
                        "inline-flex w-full items-center justify-between py-3.5 text-left text-xl"
                      )}
                      onClick={() => setIsMobilePlansOpen((prev) => !prev)}
                      tabIndex={isMenuOpen ? 0 : -1}
                      aria-expanded={isMobilePlansOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("h-5 w-5 transition-transform", isMobilePlansOpen && "rotate-180")}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200",
                        isMobilePlansOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="min-h-0 pb-3 pl-3">
                        <div className="flex flex-col gap-4 border-l border-agua/40 px-3 py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className={cn(
                                "block transition-colors hover:text-primary",
                                isNavActive(pathname, child.href) ? "text-primary" : "text-muted-on-dark"
                              )}
                              onClick={() => setIsMenuOpen(false)}
                              tabIndex={isMenuOpen && isMobilePlansOpen ? 0 : -1}
                            >
                              <span className="block text-base font-medium">{child.label}</span>
                              <span className="mt-0.5 block text-sm leading-snug text-muted-on-dark/90">
                                {child.description}
                              </span>
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
                    className={cn(
                      navItemClass(isNavActive(pathname, item.href)),
                      "border-b border-agua/15 py-3.5 text-xl"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                    tabIndex={isMenuOpen ? 0 : -1}
                  >
                    {item.label}
                  </Link>
                )
              }

              return null
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
