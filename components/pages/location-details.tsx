import { Clock, MapPin, Phone } from "lucide-react"
import { legalEntity } from "@/content/legal"
import { about, site } from "@/content/site"

const rowClassName = "flex items-start gap-3"
const iconWrapClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary"

/** Filas de dirección/teléfono/horario usadas en la sección de cobertura de /asesoria-contable-tenerife. */
export function LocationDetails() {
  return (
    <div className="space-y-5">
      <div className={rowClassName}>
        <span className={iconWrapClassName}>
          <MapPin className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Dirección</p>
          <a
            href={legalEntity.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-on-dark underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {legalEntity.address}
          </a>
        </div>
      </div>

      <div className={rowClassName}>
        <span className={iconWrapClassName}>
          <Phone className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Teléfono</p>
          <a
            href={site.phone.href}
            className="text-sm text-on-dark underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {site.phone.display}
          </a>
        </div>
      </div>

      <div className={rowClassName}>
        <span className={iconWrapClassName}>
          <Clock className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Horario</p>
          <p className="text-sm text-on-dark">{about.office.hoursLabel}</p>
        </div>
      </div>
    </div>
  )
}
