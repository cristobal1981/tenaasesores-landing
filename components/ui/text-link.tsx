import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://")
}

const simpleLinkClassName =
  "underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

const iconLinkClassName =
  "inline-flex items-center gap-1 text-primary underline-offset-4 transition-colors hover:text-on-dark hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

type TextLinkProps = {
  href: string
  children: ReactNode
  className?: string
}

/** Enlace de solo texto: color heredado, al hover pasa a verde syntia + subrayado. */
export function TextLink({ href, children, className }: TextLinkProps) {
  const external = isExternalHref(href)
  const linkClassName = cn(simpleLinkClassName, className)

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  )
}

type TextLinkWithIconProps = TextLinkProps

/** Enlace con flecha: verde syntia por defecto, blanco + subrayado al hover.
 * Flecha diagonal si el enlace es externo, flecha recta si es interno. */
export function TextLinkWithIcon({ href, children, className }: TextLinkWithIconProps) {
  const external = isExternalHref(href)
  const Icon = external ? ArrowUpRight : ArrowRight
  const linkClassName = cn(iconLinkClassName, className)

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {children}
        <Icon className="size-3.5 shrink-0" aria-hidden />
      </a>
    )
  }

  return (
    <Link href={href} className={linkClassName}>
      {children}
      <Icon className="size-3.5 shrink-0" aria-hidden />
    </Link>
  )
}
