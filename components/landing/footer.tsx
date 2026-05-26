import Link from "next/link"
import { BrandLogo } from "@/components/layout/brand-logo"
import { SectionShell } from "@/components/layout/section-shell"
import { notImplementedPath } from "@/content/errors"
import { footer, site } from "@/content/site"

export function Footer() {
  return (
    <footer className="border-t border-agua/30 bg-background">
      <SectionShell innerClassName="py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo className="mb-4" />
            <p className="mt-4 text-sm leading-relaxed text-muted-on-dark">
              {footer.description}
            </p>
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
                <li key={item}>
                  <Link
                    href={notImplementedPath}
                    className="text-sm text-muted-on-dark transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-agua/30 pt-8 sm:flex-row">
          <p className="text-sm text-muted-on-dark">
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={notImplementedPath}
              className="text-sm text-muted-on-dark transition-colors hover:text-primary"
            >
              LinkedIn
            </Link>
            <Link
              href={notImplementedPath}
              className="text-sm text-muted-on-dark transition-colors hover:text-primary"
            >
              Instagram
            </Link>
          </div>
        </div>
      </SectionShell>
    </footer>
  )
}
