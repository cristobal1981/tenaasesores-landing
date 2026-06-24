import Image from "next/image"
import Link from "next/link"
import { BrandLogo } from "@/components/layout/brand-logo"
import { SectionShell } from "@/components/layout/section-shell"
import { contact, footer, odoo, site } from "@/content/site"
import { webIssueFooter, webIssueReportPath } from "@/content/web-issue"

const socialLinkClassName =
  "inline-flex min-h-11 items-center text-sm text-muted-on-dark transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://")
}

export function Footer() {
  return (
    <footer className="border-t border-agua/30 bg-background pb-[calc(3.75rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <SectionShell innerClassName="py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo className="mb-4" />
            <p className="mt-4 text-sm leading-relaxed text-muted-on-dark">
              {footer.description}
            </p>
            <div className="mt-10">
              <h4 className="mb-3 font-sans text-sm font-semibold text-on-dark">Síguenos</h4>
              <div className="flex flex-wrap items-center gap-4">
                {contact.socials.map((social) =>
                  isExternalHref(social.href) ? (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={socialLinkClassName}
                    >
                      {social.label}
                    </a>
                  ) : (
                    <Link key={social.label} href={social.href} className={socialLinkClassName}>
                      {social.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-sm font-semibold text-on-dark">Servicios</h4>
            <ul className="space-y-3">
              {footer.services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-sm text-muted-on-dark transition-colors hover:text-primary"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-sm font-semibold text-on-dark">Empresa</h4>
            <ul className="space-y-3">
              {footer.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-on-dark transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-sm font-semibold text-on-dark">Legal</h4>
            <ul className="space-y-3">
              {footer.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-on-dark transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="text-center text-xs leading-relaxed text-muted-on-dark/90 sm:text-left">
            {webIssueFooter.prompt}{" "}
            <Link
              href={webIssueReportPath}
              className="text-muted-on-dark underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {webIssueFooter.linkLabel}
            </Link>
          </p>

          <div
            className="flex shrink-0 items-center justify-end gap-3 sm:gap-4"
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

        <div className="mt-6 flex flex-col items-center border-t border-agua/30 pt-6 text-center">
          <p className="text-sm text-muted-on-dark">
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </p>
        </div>
      </SectionShell>
    </footer >
  )
}
