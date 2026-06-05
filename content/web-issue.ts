import { site } from "@/content/site"

export const webIssueReportPath = "/reportar-problema" as const

export const webIssueReportEmail = site.technicalEmail

export const webIssueFooter = {
  prompt: "¿Has tenido algún problema navegando por nuestra web?",
  linkLabel: "Cuéntanoslo aquí",
} as const

export const webIssueReport = {
  badge: "Soporte web",
  title: "Reportar un problema con la web",
  subtitle:
    "Usa este canal solo para incidencias técnicas del sitio (enlaces rotos, errores al enviar formularios, textos incorrectos, etc.). Para consultas de asesoría, utiliza la página de contacto.",
  contactLinkLabel: "Ir a contacto",
  contactHref: "/contacto" as const,
  issueTypes: [
    { value: "enlace-roto", label: "Enlace roto o página no encontrada" },
    { value: "error-formulario", label: "Error al enviar un formulario" },
    { value: "visual", label: "Problema visual o de diseño" },
    { value: "contenido", label: "Texto incorrecto u obsoleto" },
    { value: "otro", label: "Otro problema técnico" },
  ],
  fields: {
    pageUrl: "URL de la página (si aplica)",
    pageUrlPlaceholder: "https://tenaasesores.es/…",
    issueType: "Tipo de incidencia",
    description: "Describe qué ocurre",
    descriptionPlaceholder:
      "Indica qué esperabas ver y qué ocurre en su lugar. Cuanto más detalle, más rápido podremos revisarlo…",
    descriptionMinLength: 24,
    honeypotLabel: "Deja este campo vacío",
    confirmLabel:
      "Confirmo que es una incidencia técnica de la web y no una consulta comercial o de clientes.",
  },
  submitLabel: "Abrir correo para enviar el reporte",
  submitHint:
    "Se abrirá tu cliente de correo con un mensaje prefilled. Revisa el contenido antes de enviar.",
  rateLimitMessage:
    "Has enviado varios reportes recientemente desde este navegador. Espera un momento antes de intentarlo de nuevo.",
  honeypotMessage: "No se ha podido enviar el reporte. Si eres una persona, inténtalo de nuevo.",
  validationMessage: "Completa todos los campos obligatorios y la confirmación.",
  mailtoSubjectPrefix: "[Web]",
} as const
