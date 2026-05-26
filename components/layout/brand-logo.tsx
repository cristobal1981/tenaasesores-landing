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
        className="h-10 w-10 shrink-0"
      />
      <span className="font-sans text-3xl font-semibold lowercase tracking-tight">
        <span className="text-brisa">{brand.wordmarkHighlight}</span>
        <span className="text-muted-on-dark">{brand.wordmarkRest}</span>
      </span>
    </Link>
  )
}
