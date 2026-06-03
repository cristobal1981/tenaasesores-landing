import Link from "next/link"
import { BrandLogo } from "@/components/layout/brand-logo"
import { SectionShell } from "@/components/layout/section-shell"
import { notImplementedPath } from "@/content/errors"
import { footer, site } from "@/content/site"
import { webIssueFooter, webIssueReportPath } from "@/content/web-issue"

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
            <div className="mt-6">
              <h4 className="mb-3 font-sans text-sm font-semibold text-on-dark">Síguenos</h4>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={notImplementedPath}
                  className="inline-flex min-h-11 items-center text-sm text-muted-on-dark transition-colors hover:text-primary"
                >
                  LinkedIn
                </Link>
                <Link
                  href={notImplementedPath}
                  className="inline-flex min-h-11 items-center text-sm text-muted-on-dark transition-colors hover:text-primary"
                >
                  Instagram
                </Link>
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

        <p className="mt-10 text-center text-xs leading-relaxed text-muted-on-dark/90 sm:text-left">
          {webIssueFooter.prompt}{" "}
          <Link
            href={webIssueReportPath}
            className="text-muted-on-dark underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {webIssueFooter.linkLabel}
          </Link>
        </p>

        <div className="mt-6 flex flex-col items-center border-t border-agua/30 pt-6 text-center">
          <p className="text-sm text-muted-on-dark">
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </p>
        </div>
      </SectionShell>
    </footer>
  )
}
