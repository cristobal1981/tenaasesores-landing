import { chatbotUi } from "@/content/chatbot"
import { matchIntent } from "./intents"
import { matchServiceIntent } from "./match-service"
import { extractSnippet } from "./normalize"
import { searchKnowledge } from "./search"
import type { ChatReply } from "./types"

export function respondToQuery(query: string): ChatReply {
  const serviceReply = matchServiceIntent(query)
  if (serviceReply) return serviceReply

  const intentReply = matchIntent(query)
  if (intentReply) return intentReply

  const hits = searchKnowledge(query, 1)
  if (hits.length > 0) {
    const { chunk } = hits[0]
    const snippet = extractSnippet(chunk.body, query)
    return {
      source: "search",
      text: `${chunk.title}: ${snippet}`,
      href: chunk.href,
      linkLabel: chatbotUi.linkLabel,
    }
  }

  return {
    source: "fallback",
    text: chatbotUi.fallback.text,
    href: chatbotUi.fallback.href,
    linkLabel: chatbotUi.fallback.linkLabel,
  }
}
