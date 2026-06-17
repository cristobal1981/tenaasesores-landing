import Link from "next/link"
import Image from "next/image"
import { FadeIn } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import { logoMarquee } from "@/content/site"

export function LogoMarquee() {
  const logos = [...logoMarquee.items, ...logoMarquee.items, ...logoMarquee.items]

  return (
    <section className="relative overflow-hidden border-y border-agua/30 bg-background py-14 md:py-20">
      <SectionShell>
        <FadeIn className="mb-10 text-center md:mb-12">
          <div className="badge-on-dark mb-4">
            <span className="badge-label-on-dark">{logoMarquee.badge}</span>
          </div>
          <p className="text-lg font-medium text-muted-on-dark">{logoMarquee.title}</p>
        </FadeIn>

        <div className="logo-marquee-mask">
          <ul className="logo-marquee-track" aria-label="Empresas con las que trabajamos">
            {logos.map((logo, index) => {
              const key = `${logo.name}-${index}`
              const slotStyle = {
                width: logoMarquee.slotWidth,
                height: logoMarquee.slotHeight,
              } as const
              const logoImage = (
                <div className="flex shrink-0 items-center justify-center" style={slotStyle}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logoMarquee.slotWidth}
                    height={logoMarquee.slotHeight}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                    style={
                      logo.scale !== 1
                        ? { transform: `scale(${logo.scale})`, transformOrigin: "center" }
                        : undefined
                    }
                  />
                </div>
              )

              return (
                <li key={key} className="logo-marquee-item">
                  {logo.url ? (
                    <Link href={logo.url} aria-label={logo.name} target="_blank" rel="noreferrer">
                      {logoImage}
                    </Link>
                  ) : (
                    logoImage
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </SectionShell>
    </section>
  )
}
