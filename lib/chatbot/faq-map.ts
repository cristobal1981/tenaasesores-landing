import { faqContact } from "@/content/site"
import { faqHref, faqSections } from "@/content/faq"
import { normalizeText, tokenize } from "./normalize"
import type { ChatReply } from "./types"

type FaqEntry = {
  question: string
  answer: string
  href: string
  aliases: string[]
}

const FAQ_ENTRIES: FaqEntry[] = [
  ...faqSections.flatMap((section) =>
    section.items.map((item) => ({
      question: item.question,
      answer: item.answer,
      href: `${faqHref}#${section.slug}`,
      aliases: item.question.includes("solo en Tenerife")
        ? (["solo tenerife", "fuera de tenerife", "trabajais en madrid", "atendeis online"] as string[])
        : ([] as string[]),
    }))
  ),
  ...faqContact.items.map((item) => ({
    question: item.question,
    answer: item.answer,
    href: `${faqHref}#contacto`,
    aliases:
      item.question.includes("formulario")
        ? (["como solicito consulta", "solicitar consulta asesor", "como pedir consulta", "formulario consulta"] as string[])
        : ([] as string[]),
  })),
  {
    question: "¿La primera consulta tiene coste?",
    answer: "No. Primera consulta gratuita y sin compromiso.",
    href: `${faqHref}#empezar`,
    aliases: ["consulta gratis", "consulta gratuita", "coste consulta", "tiene coste la consulta"],
  },
  {
    question: "¿En cuánto tiempo respondéis normalmente?",
    answer: "Normalmente respondemos en menos de 24 horas laborables.",
    href: `${faqHref}#empezar`,
    aliases: ["cuando responden", "tiempo respuesta", "24 horas"],
  },
]

function isProceduralQuery(queryTokens: string[]): boolean {
  const bag = queryTokens.join(" ")
  return (
    queryTokens.includes("como") ||
    queryTokens.includes("solicito") ||
    queryTokens.includes("solicitar") ||
    queryTokens.includes("donde") ||
    /^(que debo|pasos|formulario)/.test(bag)
  )
}

function isProceduralFaqEntry(entry: FaqEntry): boolean {
  const bag = normalizeText(`${entry.question} ${entry.aliases.join(" ")}`)
  return (
    bag.includes("formulario") ||
    bag.includes("que debo") ||
    bag.includes("canal") ||
    bag.includes("cuando recibire")
  )
}

function computeScore(queryTokens: string[], entry: FaqEntry): number {
  const bag = normalizeText(`${entry.question} ${entry.aliases.join(" ")}`)
  let score = 0
  for (const token of queryTokens) {
    if (token.length <= 2) continue
    if (bag.includes(token)) score += token.length >= 5 ? 2 : 1
  }
  if (queryTokens.length > 0 && normalizeText(entry.question) === queryTokens.join(" ")) {
    score += 3
  }

  if (isProceduralQuery(queryTokens) && !isProceduralFaqEntry(entry)) {
    score = Math.floor(score * 0.35)
  }

  return score
}

export function matchFaqReply(query: string): ChatReply | null {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) return null

  let best: FaqEntry | null = null
  let bestScore = 0

  for (const entry of FAQ_ENTRIES) {
    const score = computeScore(queryTokens, entry)
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }

  if (!best || bestScore < 2) return null

  return {
    source: "intent",
    text: best.answer,
    href: best.href,
    linkLabel: "Ver detalle",
  }
}
