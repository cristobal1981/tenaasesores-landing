import {
  Calculator,
  FileText,
  Users,
  Briefcase,
  ShieldCheck,
  Monitor,
  GraduationCap,
  type LucideIcon,
} from "lucide-react"

export const serviceIconsBySlug: Record<string, LucideIcon> = {
  fiscal: FileText,
  contable: Calculator,
  laboral: Users,
  constitucion: Briefcase,
}

export const valueDifferentialIcons: LucideIcon[] = [ShieldCheck, Monitor, GraduationCap]

/** @deprecated Use getServiceIconBySlug */
export const serviceIcons: LucideIcon[] = [FileText, Calculator, Users, Briefcase]

export function getServiceIconBySlug(slug: string): LucideIcon {
  return serviceIconsBySlug[slug] ?? FileText
}

export function getServiceIcon(index: number): LucideIcon {
  const slugs = ["fiscal", "contable", "laboral", "constitucion"]
  return getServiceIconBySlug(slugs[index] ?? "fiscal")
}
