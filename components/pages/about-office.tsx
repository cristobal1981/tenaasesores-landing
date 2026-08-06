import { Clock, MapPin, Phone } from "lucide-react"
import { FadeIn, FloatingElement } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import { legalEntity } from "@/content/legal"
import { about, site } from "@/content/site"

const infoRowClassName = "flex items-start gap-3"
const infoIconWrapClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary"

export function AboutOffice() {
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(legalEntity.address)}&output=embed`
  const mapSearchHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(legalEntity.address)}`

  return (
    <section className="relative overflow-hidden border-t border-agua/30 bg-background py-16 md:py-24">
      <FloatingElement
        className="absolute top-0 left-[-10%] h-72 w-72 rounded-full bg-agua/20 blur-[110px]"
        duration={13}
      />
      <FloatingElement
        className="absolute right-[-8%] bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-[100px]"
        duration={10}
        delay={1.5}
      />

      <SectionShell className="relative">
        <FadeIn className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2 className="mb-3 text-2xl font-semibold text-on-dark sm:text-3xl">
              {about.office.title}
            </h2>
            <p className="mb-8 max-w-[48ch] text-base leading-relaxed text-muted-on-dark">
              {about.office.description}
            </p>

            <div className="space-y-5">
              <div className={infoRowClassName}>
                <span className={infoIconWrapClassName}>
                  <MapPin className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                    Dirección
                  </p>
                  <a
                    href={mapSearchHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-on-dark underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {legalEntity.address}
                  </a>
                </div>
              </div>

              <div className={infoRowClassName}>
                <span className={infoIconWrapClassName}>
                  <Phone className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                    Teléfono
                  </p>
                  <a
                    href={site.phone.href}
                    className="text-sm text-on-dark underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {site.phone.display}
                  </a>
                </div>
              </div>

              <div className={infoRowClassName}>
                <span className={infoIconWrapClassName}>
                  <Clock className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                    Horario
                  </p>
                  <p className="text-sm text-on-dark">{about.office.hoursLabel}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-agua/30">
            <iframe
              src={mapEmbedSrc}
              title={`Mapa de la oficina de tenaasesores en ${legalEntity.address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full lg:h-96"
            />
          </div>
        </FadeIn>
      </SectionShell>
    </section>
  )
}
