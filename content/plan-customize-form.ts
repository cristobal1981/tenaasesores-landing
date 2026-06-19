export type PlanCustomizeAudience = "autonomos" | "empresas"

export const planCustomizeYesNo = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
] as const

export const planCustomizeTaxRegions = [
  { value: "peninsula", label: "Península y Baleares" },
  { value: "canarias", label: "Canarias" },
] as const

export const planCustomizeForm = {
  sectionId: "personalizar-plan",
  fields: {
    honeypotLabel: "Deja este campo vacío",
  },
  panelHeader: {
    autonomos: {
      eyebrow: "Plan personalizado · autónomos",
      lead: "Si tu caso no encaja en el plan Base, aquí preparamos la propuesta a medida.",
    },
    empresas: {
      eyebrow: "Plan personalizado · empresas",
      lead: "Cuéntanos tu situación y preparamos una propuesta a medida — sin paquetes cerrados.",
    },
  },
  steps: {
    progressLabel: "Paso {current} de {total}",
    next: "Siguiente",
    back: "Anterior",
    submit: "Enviar solicitud",
    sending: "Enviando…",
  },
  step1: {
    title: "Tu situación",
    description: "Así dimensionamos el alcance del plan.",
    revenueLabel: "Facturación anual estimada",
    revenuePlaceholder: "Ej. 85000",
    revenueHint: "Importe aproximado en euros al año.",
    autonomos: {
      registeredLabel: "¿Estás dado de alta como autónomo?",
      hireEmployeesLabel: "¿Vas a contratar empleados?",
    },
    empresas: {
      newConstitutionLabel: "¿Es una nueva constitución?",
      hasEmployeesLabel: "¿Tiene empleados?",
      hasEmployeesLabelFuture: "¿Tendrá empleados?",
      employeeCountLabel: "¿Cuántos empleados?",
      employeeCountLabelFuture: "¿Cuántos empleados tendrá?",
      employeeCountPlaceholder: "Ej. 3",
    },
  },
  step2: {
    title: "Qué necesitas",
    description: "Marca todo lo que quieras incluir en la propuesta.",
    servicesLabel: "Servicios",
    selectAllLabel: "Me llevo el pack completo",
    selectAllAriaLabel: "Seleccionar todos los servicios",
    digitalizationHint:
      "También te ayudamos con la gestión de herramientas de digitalización: ERPs, migraciones y puesta al día de tus sistemas.",
    serviceOptions: {
      autonomos: [
        { value: "contabilidad", label: "Contabilidad mensual" },
        { value: "fiscal", label: "Gestión fiscal y modelos" },
        { value: "laboral", label: "Gestión laboral y nóminas" },
        { value: "odoo", label: "Odoo, ERP u otras herramientas" },
        { value: "asesoria", label: "Asesoramiento puntual o estratégico" },
      ],
      empresas: [
        { value: "contabilidad", label: "Contabilidad y cierres" },
        { value: "fiscal", label: "Fiscal y cumplimiento" },
        { value: "laboral", label: "Laboral y nóminas" },
        { value: "constitucion", label: "Constitución o cambios societarios" },
        { value: "odoo", label: "Odoo, ERP e integración tecnológica" },
      ],
    },
    servicesRequired: "Selecciona al menos un servicio.",
  },
  step3: {
    title: "Tu actividad y cómo contactarte",
    description: "Con esto preparamos una propuesta a tu medida.",
    activityLabel: "¿A qué te dedicas?",
    activityPlaceholder: "Ej. consultoría digital, comercio minorista, clínica…",
    taxRegionLabel: "Residencia fiscal",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
    phoneLabel: "Teléfono",
    phonePlaceholder: "+34 600 000 000",
    notesLabel: "Algo más que debamos saber",
    notesPlaceholder: "Plazos, herramientas que usas, dudas concretas…",
  },
  messagePrefix: {
    autonomos: "[Plan personalizado · autónomos]",
    empresas: "[Plan personalizado · empresas]",
  },
  validation: {
    registeredAutonomo: "Indica si estás dado de alta como autónomo.",
    hireEmployees: "Indica si vas a contratar empleados.",
    newConstitution: "Indica si es una nueva constitución.",
    hasEmployees: "Indica si la empresa tiene empleados.",
    hasEmployeesFuture: "Indica si la empresa tendrá empleados.",
    employeeCount: "Indica cuántos empleados tiene la empresa.",
    employeeCountFuture: "Indica cuántos empleados tendrá la empresa.",
    revenue: "Indica tu facturación anual estimada en euros.",
    services: "Selecciona al menos un servicio.",
    activity: "Describe brevemente tu actividad.",
    taxRegion: "Indica si tu residencia fiscal es en península o en Canarias.",
    name: "Indica tu nombre.",
    email: "Indica un email válido.",
  },
  limits: {
    activityMin: 10,
    activityMax: 500,
    notesMax: 1000,
    revenueDigitsMin: 1,
    revenueDigitsMax: 12,
    minSubmitDelayMs: 2500,
  },
  rateLimit: {
    maxPerIpPerHour: 5,
    maxPerEmailPerHour: 3,
    clientMaxPerWindow: 2,
    clientWindowMs: 30 * 60 * 1000,
  },
  messages: {
    validation: "Revisa los campos marcados e inténtalo de nuevo.",
    honeypot:
      "No se ha podido enviar la solicitud. Si eres una persona, inténtalo de nuevo.",
    rateLimit:
      "Has enviado varias solicitudes recientemente. Espera un momento antes de volver a intentarlo.",
    duplicateLead:
      "Ya hay una solicitud reciente con este email. Te contactaremos en breve; si es urgente, llámanos por teléfono.",
    webhookForbidden:
      "No hemos podido registrar tu solicitud ahora mismo. Inténtalo en unos minutos o contáctanos por teléfono.",
    genericError:
      "No se ha podido enviar la solicitud. Inténtalo más tarde o contáctanos por teléfono.",
  },
  success: {
    title: "Proceso completado",
    body: "Hemos recibido tu información. Te contactaremos lo antes posible — en menos de 24 horas laborables — con tu propuesta personalizada.",
    stepsDoneLabel: "Los 3 pasos están enviados",
  },
  privacyNote: "Al enviar aceptas la política de privacidad",
} as const

export function empresasHasEmployeesLabel(isNewConstitution: string): string {
  return isNewConstitution === "yes"
    ? planCustomizeForm.step1.empresas.hasEmployeesLabelFuture
    : planCustomizeForm.step1.empresas.hasEmployeesLabel
}

export function empresasEmployeeCountLabel(isNewConstitution: string): string {
  return isNewConstitution === "yes"
    ? planCustomizeForm.step1.empresas.employeeCountLabelFuture
    : planCustomizeForm.step1.empresas.employeeCountLabel
}

export function empresasHasEmployeesValidationMessage(isNewConstitution: string): string {
  return isNewConstitution === "yes"
    ? planCustomizeForm.validation.hasEmployeesFuture
    : planCustomizeForm.validation.hasEmployees
}

export function empresasEmployeeCountValidationMessage(isNewConstitution: string): string {
  return isNewConstitution === "yes"
    ? planCustomizeForm.validation.employeeCountFuture
    : planCustomizeForm.validation.employeeCount
}
