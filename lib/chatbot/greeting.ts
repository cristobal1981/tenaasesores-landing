import { normalizeText } from "./normalize"
import type { ChatReply } from "./types"

function stripPunctuation(value: string): string {
  return value
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function stripSappoMention(value: string): string {
  return value.replace(/\bsappo\b/g, "").replace(/\s+/g, " ").trim()
}

function pickReply(replies: readonly string[]): string {
  return replies[Math.floor(Math.random() * replies.length)]
}

const MORNING_PATTERNS = [/^buenos dias$/, /^buen dia$/]
const AFTERNOON_PATTERNS = [/^buenas tardes$/]
const NIGHT_PATTERNS = [/^buenas noches$/]
const GENERIC_PATTERNS = [
  /^holaa*$/,
  /^holi+$/,
  /^ola$/,
  /^ey$/,
  /^hey$/,
  /^eh$/,
  /^buenas$/,
  /^muy buenas$/,
  /^que tal$/,
  /^que hay$/,
  /^que pasa$/,
  /^como estas$/,
  /^como andas$/,
  /^como va$/,
  /^como vas$/,
  /^saludos$/,
  /^hi$/,
  /^hello$/,
]

const GREETING_REPLIES = {
  morning: [
    "¡Buenos días! Soy Sappo. Pregúntame por servicios, planes, horario o contacto y te oriento al momento.",
    "¡Buenos días! ¿En qué puedo ayudarte? Servicios, planes, Odoo o cómo contactar con el equipo, tú me dices.",
  ],
  afternoon: [
    "¡Buenas tardes! Soy Sappo. Pregúntame por servicios, planes, horario o contacto y te oriento al momento.",
    "¡Buenas tardes! ¿En qué puedo ayudarte? Servicios, planes, Odoo o contacto, tú me dices.",
  ],
  night: [
    "¡Buenas noches! El equipo ya habrá cerrado, pero puedo orientarte con servicios, planes o cómo dejar tu consulta.",
  ],
  generic: [
    "¡Hola! Soy Sappo. Pregúntame por servicios, planes, horario o contacto y te oriento en un momento.",
    "¡Hola! ¿En qué puedo ayudarte? Puedo hablarte de servicios, planes, Odoo o el equipo.",
    "¡Hola! Dime si buscas servicios, planes, horario o contacto y te llevo directo.",
  ],
} as const

const GREETING_GROUPS: { patterns: RegExp[]; replies: readonly string[] }[] = [
  { patterns: MORNING_PATTERNS, replies: GREETING_REPLIES.morning },
  { patterns: AFTERNOON_PATTERNS, replies: GREETING_REPLIES.afternoon },
  { patterns: NIGHT_PATTERNS, replies: GREETING_REPLIES.night },
  { patterns: GENERIC_PATTERNS, replies: GREETING_REPLIES.generic },
]

/**
 * Solo intercepta saludos "puros" (el mensaje entero es un saludo, p. ej. "buenos días" o
 * "hola sappo"). Si el usuario añade cualquier otra cosa ("buenas, qué horario tenéis"),
 * el patrón anclado no matchea y la consulta sigue el pipeline normal de intents/búsqueda.
 */
export function matchGreetingIntent(query: string): ChatReply | null {
  const cleaned = stripSappoMention(stripPunctuation(normalizeText(query)))
  if (!cleaned) return null

  for (const group of GREETING_GROUPS) {
    if (group.patterns.some((pattern) => pattern.test(cleaned))) {
      return { source: "intent", text: pickReply(group.replies) }
    }
  }

  return null
}
