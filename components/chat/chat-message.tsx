import Link from "next/link"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "bot"
  text: string
  href?: string
  linkLabel?: string
  onLinkClick?: () => void
}

export function ChatMessage({ role, text, href, linkLabel, onLinkClick }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-turquesa text-on-light rounded-br-md"
            : "bg-muted text-on-dark rounded-bl-md",
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {!isUser && href && linkLabel ? (
          <Link
            href={href}
            onClick={onLinkClick}
            className="mt-2 inline-block text-xs font-semibold text-primary underline-offset-2 hover:underline"
          >
            {linkLabel} →
          </Link>
        ) : null}
      </div>
    </div>
  )
}
