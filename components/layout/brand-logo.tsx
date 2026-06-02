import Image from "next/image"
import Link from "next/link"
import { brand } from "@/content/site"

type BrandLogoProps = {
  className?: string
  priority?: boolean
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className ?? ""}`}>
      <Image
        src={brand.logoSrc}
        alt=""
        width={40}
        height={40}
        priority={priority}
        className="h-8 w-8 shrink-0 sm:h-10 sm:w-10"
      />
      <span className="font-sans text-2xl font-semibold lowercase tracking-tight sm:text-3xl">
        <span className="text-brisa">{brand.wordmarkHighlight}</span>
        <span className="text-muted-on-dark">{brand.wordmarkRest}</span>
      </span>
    </Link>
  )
}
