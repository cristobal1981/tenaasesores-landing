"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { Button, marketingCtaBaseClassName, marketingCtaVariantClassName } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
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

/** Enlaces del navbar: solo color, sin fondo (Verde Syntia en hover/activo). */
function navItemClass(isActive: boolean) {
  return cn(
    "font-sans text-base font-medium transition-colors hover:text-primary focus-visible:outline-none",
    isActive ? "text-primary" : "text-muted-on-dark"
  )
}

/** Anula estilos por defecto de shadcn en el trigger de Planes. */
const plansTriggerClass = cn(
  navItemClass(false),
  "group !h-auto !w-max gap-1 !rounded-none !bg-transparent !px-0 !py-0 !text-base !shadow-none",
  "hover:!bg-transparent focus:!bg-transparent",
  "data-[state=open]:!bg-transparent data-[state=open]:!text-primary",
  "data-[state=open]:hover:!bg-transparent data-[state=open]:focus:!bg-transparent",
  "hover:!text-primary focus:!text-primary"
)

function PlansNavListItem({
  label,
  description,
  href,
  isActive,
}: {
  label: string
  description: string
  href: string
  isActive: boolean
}) {
  return (
    <li>
      <Link
        href={href}
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

  useEffect(() => {
    setIsMobilePlansOpen(false)
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-agua/30 bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
          <BrandLogo className="justify-self-start" priority />

          <NavigationMenu
            viewport={false}
            className="hidden max-w-none flex-none justify-self-center md:flex"
          >
            <NavigationMenuList className="gap-8">
              {navItems.map((item) => {
                if (hasChildren(item)) {
                  const isParentActive = item.children.some((child) =>
                    isNavActive(pathname, child.href)
                  )
                  return (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuTrigger
                        className={cn(plansTriggerClass, isParentActive && "!text-primary")}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!rounded-xl !border !border-agua/30 !bg-background !text-on-dark p-2 shadow-lg shadow-black/20 md:left-1/2 md:w-72 md:-translate-x-1/2">
                        <ul className="flex flex-col gap-0.5">
                          {item.children.map((child) => (
                            <PlansNavListItem
                              key={child.label}
                              label={child.label}
                              description={child.description}
                              href={child.href}
                              isActive={isNavActive(pathname, child.href)}
                            />
                          ))}
                        </ul>
                      </NavigationMenuContent>
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
                  const isParentActive = item.children.some((child) =>
                    isNavActive(pathname, child.href)
                  )
                  return (
                    <div key={item.label} className="space-y-2">
                      <button
                        type="button"
                        className={cn(
                          "inline-flex w-full items-center justify-between py-2 text-left",
                          navItemClass(isParentActive)
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
                          <div className="flex flex-col gap-3 border-l border-agua/40 px-3 py-1">
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
                                <span className="block text-sm font-medium">{child.label}</span>
                                <span className="mt-0.5 block text-xs leading-snug text-muted-on-dark/90">
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
                      className={cn("py-2", navItemClass(isNavActive(pathname, item.href)))}
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
