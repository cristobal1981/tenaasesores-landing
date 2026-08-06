import Image from "next/image"
import Link from "next/link"
import { brand } from "@/content/site"

type BrandLogoProps = {
  className?: string
  priority?: boolean
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Link href="/" className={`inline-flex shrink-0 ${className ?? ""}`}>
      <Image
        src={brand.logoSrc}
        alt={brand.wordmark}
        width={brand.logoWidth}
        height={brand.logoHeight}
        priority={priority}
        className="h-14 w-auto object-contain md:h-12"
        style={{ width: "auto" }}
      />
    </Link>
  )
}
