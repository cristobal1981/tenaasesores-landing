import Image from "next/image"
import Link from "next/link"
import { sappoAssets } from "@/content/chatbot"
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
    <div className="flex max-w-[92%] items-start gap-2">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-agua shadow-sm ring-1 ring-primary/25"
        aria-hidden
      >
        <Image
          src={sappoAssets.chatAvatar}
          alt=""
          width={24}
          height={24}
          className="size-6 object-contain"
        />
      </div>
      <div
        className={cn(
          "relative min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-on-dark",
          "before:absolute before:top-3 before:-left-1.5 before:h-0 before:w-0",
          "before:border-y-[6px] before:border-r-[7px] before:border-y-transparent before:border-r-muted",
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {href && linkLabel ? (
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
