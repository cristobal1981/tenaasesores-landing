import Image from "next/image"
import { ChevronDown, MapPin, Phone } from "lucide-react"
import { BrandLogo } from "@/components/layout/brand-logo"
import { SectionShell } from "@/components/layout/section-shell"
import { TextLink } from "@/components/ui/text-link"
import { contact, footer, odoo, site } from "@/content/site"
import { legalEntity } from "@/content/legal"
import { webIssueFooter, webIssueReportPath } from "@/content/web-issue"

type FooterLinkGroupProps = {
  title: string
  items: ReadonlyArray<{ label: string; href: string }>
}

/** En móvil se comporta como acordeón (details/summary nativo, sin JS); de sm en
 * adelante queda fijo y abierto para mantener la estructura de columnas de siempre. */
function FooterLinkGroup({ title, items }: FooterLinkGroupProps) {
  return (
    <details
      open
      className="group border-b border-agua/15 pb-4 sm:border-none sm:pb-0"
    >
      <summary className="mb-3 flex cursor-pointer list-none items-center justify-between font-sans text-sm font-semibold text-on-dark sm:cursor-default sm:justify-start sm:gap-0 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="size-4 text-muted-on-dark transition-transform duration-200 group-open:rotate-180 sm:hidden"
          aria-hidden
        />
      </summary>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <TextLink href={item.href} className="text-sm text-muted-on-dark">
              {item.label}
            </TextLink>
          </li>
        ))}
      </ul>
    </details>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-agua/30 bg-background pb-[calc(3.75rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <SectionShell innerClassName="pt-12 pb-5 md:pt-16 md:pb-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1fr] lg:gap-6">
          {/* Marca + badges + síguenos */}
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo className="mb-4" />
            <p className="mb-6 text-sm leading-relaxed text-muted-on-dark">
              {footer.description}
            </p>

            <div
              className="mb-8 flex flex-wrap items-center gap-3"
              aria-label="Partners oficiales Odoo y Holded"
            >
              <div className="rounded bg-white">
                <Image
                  src={odoo.partners.odoo.batch.src}
                  alt={odoo.partners.odoo.batch.alt}
                  width={odoo.partners.odoo.batch.width}
                  height={odoo.partners.odoo.batch.height}
                  className="h-8 w-auto object-contain"
                  style={{ width: "auto" }}
                />
              </div>
              <div className="rounded bg-white">
                <Image
                  src={odoo.partners.holded.batch.src}
                  alt={odoo.partners.holded.batch.alt}
                  width={odoo.partners.holded.batch.width}
                  height={odoo.partners.holded.batch.height}
                  className="h-8 w-auto object-contain"
                  style={{ width: "auto" }}
                />
              </div>
            </div>
          </div>

          <FooterLinkGroup title="Servicios" items={footer.services} />
          <FooterLinkGroup title="Planes" items={footer.plans} />
          <FooterLinkGroup title="Compañía" items={footer.company} />
          <FooterLinkGroup title="Legal" items={footer.legal} />
        </div>

        {/* Síguenos + contacto — ancho completo, entre los dos separadores */}
        <div className="mt-6 border-t border-agua/30 pt-5">
          <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-2">
            <p className="font-sans text-sm font-semibold text-muted-on-dark/70">Síguenos:</p>
            <div className="flex flex-wrap items-center gap-4">
              {contact.socials.map((social) => (
                <TextLink key={social.label} href={social.href} className="text-sm text-muted-on-dark">
                  {social.label}
                </TextLink>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-8">
              <TextLink href={site.phone.href} className="inline-flex items-center gap-2 text-sm text-muted-on-dark">
                <Phone className="size-4 shrink-0" aria-hidden />
                {site.phone.display}
              </TextLink>
              <TextLink
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(legalEntity.address)}`}
                className="inline-flex items-center gap-2 text-sm text-muted-on-dark"
              >
                <MapPin className="size-4 shrink-0" aria-hidden />
                Los Realejos, Tenerife
              </TextLink>
            </div>
            <p className="text-xs whitespace-nowrap text-muted-on-dark/80">
              {webIssueFooter.prompt}{" "}
              <TextLink href={webIssueReportPath}>{webIssueFooter.linkLabel}</TextLink>
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-agua/30 pt-5 text-center">
          <p className="text-sm text-muted-on-dark">
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-[0.7rem] text-muted-on-dark/70">
            <span className="text-on-dark">Diseñado por:</span>{" "}
            <TextLink href="https://guillermosh.com">GuillermoSH</TextLink>
          </p>
        </div>
      </SectionShell>
    </footer>
  )
}
