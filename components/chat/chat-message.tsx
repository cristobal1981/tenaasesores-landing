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

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-turquesa px-3.5 py-2.5 text-sm leading-relaxed text-on-light">
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex max-w-[92%]">
      <div
        className={cn(
          "min-w-0 flex-1 rounded-2xl rounded-tl-md border border-agua/40 bg-agua/25 px-3.5 py-2.5 text-sm leading-relaxed text-on-dark",
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {href && linkLabel ? (
          <Link
            href={href}
            onClick={onLinkClick}
            className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
          >
            {linkLabel}
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </div>
  )
}

interface ChatTypingIndicatorProps {
  reducedMotion?: boolean
}

export function ChatTypingIndicator({ reducedMotion }: ChatTypingIndicatorProps) {
  return (
    <div className="flex max-w-[92%]" role="status" aria-live="polite" aria-label="Sappo está escribiendo">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-agua/40 bg-agua/25 px-4 py-3.5">
        {[0, 160, 320].map((delay) => (
          <span
            key={delay}
            className={cn(
              "size-1.5 rounded-full bg-muted-on-dark",
              !reducedMotion && "animate-chat-typing-dot",
            )}
            style={!reducedMotion ? { animationDelay: `${delay}ms` } : undefined}
          />
        ))}
      </div>
    </div>
  )
}
