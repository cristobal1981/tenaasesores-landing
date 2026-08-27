import { odoo } from "@/content/site"

export type OdooModule =
  | "auditoria"
  | "estructura"
  | "bancos"
  | "facturacion"
  | "formacion"
  | "acompanamiento"

export type OdooMockupRow = {
  label: string
  width: "sm" | "md" | "lg" | "full"
  tone?: "highlight"
}

export type OdooMockupKpi = {
  label: string
  value: string
}

export type OdooPhase = {
  id: string
  number: string
  title: string
  description: string
  module: OdooModule
  mockup: {
    headerLabel: string
    rows: readonly OdooMockupRow[]
    kpis?: readonly OdooMockupKpi[]
  }
}

export const odooImplementationMeta = {
  title: "Implementación de Odoo: auditoría, migración y formación | tenaasesores",
  description:
    "Cómo implementamos Odoo en tu negocio: auditoría inicial, estructura contable y fiscal, migración bancaria, facturación con OCR, formación del equipo y acompañamiento continuo. Partners oficiales de Odoo.",
} as const

export const odooImplementationHero = {
  eyebrow: "Implementación de Odoo",
  title: ["Así implementamos Odoo", "en tu negocio, paso a paso"] as const,
  lead: odoo.intro,
} as const

export const odooImplementationQuote = {
  text: "La diferencia no la marca el software. La marca la implantación.",
  author: "Cristóbal Díaz Martín",
  role: "Estrategia y Compliance Legal & Fiscal, tenaasesores",
} as const

export const odooImplementationPhasesTitle = "Cómo lo implementamos, fase a fase"

export const odooImplementationPhases: readonly OdooPhase[] = [
  {
    id: "auditoria",
    number: "01",
    title: "Auditoría inicial",
    description:
      "Revisamos tu operativa actual —herramientas, procesos y obligaciones fiscales y laborales— para saber exactamente de dónde partimos antes de tocar nada.",
    module: "auditoria",
    mockup: {
      headerLabel: "Diagnóstico",
      rows: [
        { label: "Herramientas actuales", width: "lg" },
        { label: "Procesos manuales detectados", width: "md", tone: "highlight" },
        { label: "Obligaciones fiscales", width: "full" },
        { label: "Riesgos identificados", width: "sm" },
      ],
      kpis: [
        { label: "Procesos revisados", value: "12+" },
        { label: "Duración media", value: "1-2 sem." },
      ],
    },
  },
  {
    id: "estructura",
    number: "02",
    title: "Diseño de estructura contable y fiscal",
    description:
      "Definimos plan contable, impuestos, circuitos y responsabilidades desde el inicio, con la preconfiguración completa de Odoo adaptada a tu negocio.",
    module: "estructura",
    mockup: {
      headerLabel: "Contabilidad",
      rows: [
        { label: "Plan contable", width: "full", tone: "highlight" },
        { label: "Impuestos configurados", width: "md" },
        { label: "Circuitos de aprobación", width: "lg" },
        { label: "Responsables asignados", width: "sm" },
      ],
      kpis: [
        { label: "Cuentas configuradas", value: "100%" },
        { label: "Impuestos activos", value: "IVA · IRPF · IS" },
      ],
    },
  },
  {
    id: "bancos",
    number: "03",
    title: "Migración y conexión bancaria",
    description:
      "Conectamos tus bancos, importamos movimientos históricos y automatizamos la conciliación, sin parón operativo mientras haces el cambio.",
    module: "bancos",
    mockup: {
      headerLabel: "Bancos",
      rows: [
        { label: "Cuentas conectadas", width: "full", tone: "highlight" },
        { label: "Movimientos importados", width: "lg" },
        { label: "Conciliación automática", width: "md" },
        { label: "Histórico migrado", width: "sm" },
      ],
      kpis: [
        { label: "Bancos conectados", value: "Todos" },
        { label: "Conciliación", value: "Automática" },
      ],
    },
  },
  {
    id: "facturacion",
    number: "04",
    title: "Facturación y captura de documentos",
    description:
      "Configuramos la captura de facturas por OCR o email para centralizar toda la documentación y automatizar procesos clave de facturación.",
    module: "facturacion",
    mockup: {
      headerLabel: "Facturación",
      rows: [
        { label: "Facturas emitidas", width: "lg" },
        { label: "OCR de proveedores", width: "full", tone: "highlight" },
        { label: "Documentación centralizada", width: "md" },
        { label: "Envíos automatizados", width: "sm" },
      ],
      kpis: [
        { label: "Captura", value: "OCR + email" },
        { label: "Intervención manual", value: "Mínima" },
      ],
    },
  },
  {
    id: "formacion",
    number: "05",
    title: "Formación del equipo",
    description:
      "Sesiones prácticas para que tu equipo gane autonomía real en el día a día, con soporte cercano durante toda la adopción.",
    module: "formacion",
    mockup: {
      headerLabel: "Formación",
      rows: [
        { label: "Sesiones completadas", width: "md" },
        { label: "Usuarios formados", width: "full", tone: "highlight" },
        { label: "Materiales de apoyo", width: "lg" },
        { label: "Dudas resueltas", width: "sm" },
      ],
      kpis: [
        { label: "Sesiones", value: "A medida" },
        { label: "Soporte", value: "Continuo" },
      ],
    },
  },
  {
    id: "acompanamiento",
    number: "06",
    title: "Acompañamiento y revisión continua",
    description:
      "Supervisamos cierres, ajustes y mejoras para que el sistema siga sirviendo a tu negocio, con criterio profesional detrás de cada automatización.",
    module: "acompanamiento",
    mockup: {
      headerLabel: "Seguimiento",
      rows: [
        { label: "Cierres revisados", width: "full", tone: "highlight" },
        { label: "Ajustes aplicados", width: "md" },
        { label: "Cumplimiento normativo", width: "lg" },
        { label: "Mejoras propuestas", width: "sm" },
      ],
      kpis: [
        { label: "Revisión", value: "Continua" },
        { label: "Cumplimiento", value: "Garantizado" },
      ],
    },
  },
] as const

export const odooImplementationBenefits = [
  {
    title: "Rentabilidad real, no solo cifras globales",
    description:
      "Vas más allá de la cuenta de resultados: sabes qué departamento, servicio o cliente es realmente rentable y dónde se está perdiendo dinero sin que nadie lo detecte.",
  },
  {
    title: "Acceso Enterprise sin coste extra",
    description:
      "Nuestro acceso como asesores en la versión Enterprise de Odoo no supone coste adicional para ti: tienes todo el producto, con nuestra supervisión incluida.",
  },
  {
    title: "Todo conectado, todo en tiempo real",
    description:
      "Facturación, bancos, gastos e impuestos en un solo lugar. Dejas de depender de que la asesoría te cuente cómo va tu negocio una vez al trimestre.",
  },
  {
    title: "Supervisión profesional sobre cada dato",
    description:
      "La automatización no sustituye el criterio: revisamos, corregimos y garantizamos que todo cumple con la normativa vigente.",
  },
] as const

export const odooImplementationCta = {
  title: "¿Hablamos de tu implementación?",
  label: "Solicitar consulta gratuita",
} as const
