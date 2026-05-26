export type KnowledgeChunk = {
  id: string
  topic: string
  title: string
  body: string
  href: string
  keywords: string[]
}

export type ChatReplySource = "intent" | "search" | "fallback"

export type ChatReply = {
  text: string
  href?: string
  linkLabel?: string
  source: ChatReplySource
}

export type ChatMessage = {
  id: string
  role: "user" | "bot"
  text: string
  href?: string
  linkLabel?: string
}
