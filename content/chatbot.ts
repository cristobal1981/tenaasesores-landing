import { faqHref } from "@/content/faq"

export const sappoIntroStorageKey = "tenaasesores-sappo-intro-seen" as const

export const sappoAssets = {
  fabLogo: "/brand/sappo/logo-sappo_colores-45deg.webp",
  chatAvatar: "/brand/sappo/logo-sappo_blanco.webp",
} as const

export const chatbotUi = {
  name: "Sappo",
  fabLabel: "Abrir Sappo, asistente de ayuda",
  title: "Sappo",
  welcome:
    "Hola, soy Sappo. Puedo ayudarte a encontrar información sobre nuestros servicios, horarios, contacto y más. ¿En qué te puedo ayudar?",
  introBubble: {
    title: "¡Hola! Soy Sappo",
    body: "Tu asistente en tenaasesores. Pregúntame por servicios, horarios, Odoo o contacto cuando quieras.",
    cta: "Hablar con Sappo",
    dismissLabel: "Cerrar presentación",
    autoDismissMs: 8000,
  },
  inputPlaceholder: "Escribe tu pregunta…",
  sendLabel: "Enviar",
  closeLabel: "Cerrar chat",
  linkLabel: "Ver más",
  fallback: {
    text: "No tengo respuesta exacta para eso todavía. Prueba servicios, nosotros o preguntas frecuentes y te llevo directo.",
    href: faqHref,
    linkLabel: "Ver preguntas frecuentes",
  },
} as const

export const quickReplies = [
  { label: "Servicios", query: "servicios fiscal contable laboral" },
  { label: "Planes", query: "que planes hay" },
  { label: "Horario", query: "horario de atención" },
  { label: "¿Atendéis online?", query: "atendéis fuera de tenerife online" },
  { label: "Teléfono", query: "teléfono de contacto" },
  { label: "Odoo", query: "Odoo partners" },
  { label: "Equipo", query: "equipo profesionales" },
  { label: "FAQ", query: "preguntas frecuentes consulta inicial" },
] as const

export type IntentDefinition = {
  id: string
  patterns: RegExp[]
  keywords: string[]
}

export const intentDefinitions: IntentDefinition[] = [
  {
    id: "hours",
    patterns: [/horario/, /abierto/, /atencion/, /cuando\s+atend/, /fin\s+de\s+semana/],
    keywords: ["horario", "abierto", "atencion", "hora", "weekend"],
  },
  {
    id: "phone",
    patterns: [/telefono/, /llamar/, /whatsapp/, /movil/],
    keywords: ["telefono", "llamar", "numero", "922"],
  },
  {
    id: "email",
    patterns: [/correo/, /email/, /e-mail/],
    keywords: ["email", "correo", "info@"],
  },
  {
    id: "location",
    patterns: [/donde/, /ubicacion/, /direccion/, /tenerife/, /canarias/, /online/, /remoto/],
    keywords: ["ubicacion", "tenerife", "canarias", "donde", "online", "remoto"],
  },
  {
    id: "contact",
    patterns: [/formulario/, /pagina\s+de\s+contacto/],
    keywords: ["formulario", "contacto"],
  },
  {
    id: "odoo",
    patterns: [/odoo/, /erp/, /migracion/, /partner/],
    keywords: ["odoo", "erp", "migracion", "partner"],
  },
  {
    id: "team",
    patterns: [/equipo/, /quienes/, /profesional/, /persona/],
    keywords: ["equipo", "nosotros", "profesionales", "cristobal", "ariana"],
  },
  {
    id: "plans",
    patterns: [/\bplanes\b/, /\bplan\b/, /\bsuscrip/, /\btarifas?\b/, /\bprecios?\b/],
    keywords: ["planes", "plan", "suscripcion", "tarifa", "precio", "mensual"],
  },
  {
    id: "services",
    patterns: [/servicio/, /gestoria/, /asesoria/, /ofreceis/, /ofrecéis/],
    keywords: ["servicios", "gestoria", "asesoria"],
  },
]
