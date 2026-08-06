"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { Send, X } from "lucide-react"
import { chatbotUi, quickReplies, sappoAssets, sappoIntroStorageKey } from "@/content/chatbot"
import { ChatMessage, ChatTypingIndicator } from "@/components/chat/chat-message"
import { Button } from "@/components/ui/button"
import { ChipScrollRow } from "@/components/ui/chip-scroll-row"
import { Input } from "@/components/ui/input"
import { respondToQuery } from "@/lib/chatbot/respond"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"
import type { ChatMessage as ChatMessageType } from "@/lib/chatbot/types"
function createMessage(
  role: ChatMessageType["role"],
  text: string,
  href?: string,
  linkLabel?: string,
): ChatMessageType {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    text,
    href,
    linkLabel,
  }
}

const quickReplyChipClassName =
  "shrink-0 rounded-full border border-agua/30 bg-muted/50 px-3.5 py-1.5 text-xs font-medium whitespace-nowrap text-on-dark transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-primary active:bg-primary/15"

export function SiteChatWidget() {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLDivElement>(null)
  const messagesScrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  const [isOpen, setIsOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const closeChat = useCallback(() => setIsOpen(false), [])

  const dismissIntro = useCallback(() => {
    setShowIntro(false)
    try {
      localStorage.setItem(sappoIntroStorageKey, "1")
    } catch {
      /* private mode / blocked storage */
    }
  }, [])

  const openChat = useCallback(() => {
    dismissIntro()
    setIsOpen(true)
  }, [dismissIntro])
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessageType[]>(() => [
    createMessage("bot", chatbotUi.welcome),
  ])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })
  }, [reducedMotion])

  useEffect(() => {
    try {
      if (localStorage.getItem(sappoIntroStorageKey)) return
      const timer = window.setTimeout(() => setShowIntro(true), 900)
      return () => window.clearTimeout(timer)
    } catch {
      return undefined
    }
  }, [])

  useEffect(() => {
    if (!showIntro) return
    const timer = window.setTimeout(dismissIntro, chatbotUi.introBubble.autoDismissMs)
    return () => window.clearTimeout(timer)
  }, [showIntro, dismissIntro])

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [isOpen, messages, isTyping, scrollToBottom])

  useEffect(() => () => {
    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen && !showIntro) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (isOpen) closeChat()
      else if (showIntro) dismissIntro()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, showIntro, closeChat, dismissIntro])

  useEffect(() => {
    if (!isOpen && !showIntro) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (fabRef.current?.contains(target)) return
      if (introRef.current?.contains(target)) return
      if (isOpen) closeChat()
      if (showIntro) dismissIntro()
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [isOpen, showIntro, closeChat, dismissIntro])

  useEffect(() => {
    const scrollEl = messagesScrollRef.current
    if (!isOpen || !scrollEl) return

    const onWheel = (event: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollEl
      const atTop = scrollTop <= 0
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1
      if ((atTop && event.deltaY < 0) || (atBottom && event.deltaY > 0)) {
        event.preventDefault()
      }
    }

    scrollEl.addEventListener("wheel", onWheel, { passive: false })
    return () => scrollEl.removeEventListener("wheel", onWheel)
  }, [isOpen])

  const submitQuery = useCallback(
    (query: string) => {
      const trimmed = query.trim()
      if (!trimmed || isTyping) return

      setMessages((prev) => [...prev, createMessage("user", trimmed)])
      setInput("")
      setIsTyping(true)
      typingTimeoutRef.current = window.setTimeout(
        () => {
          const reply = respondToQuery(trimmed)
          setMessages((prev) => [
            ...prev,
            createMessage("bot", reply.text, reply.href, reply.linkLabel),
          ])
          setIsTyping(false)
        },
        reducedMotion ? 150 : 700,
      )
    },
    [isTyping, reducedMotion],
  )

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    submitQuery(input)
  }

  const panelMotion = reducedMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
        transition: { duration: 0.2, ease: "easeOut" as const },
      }

  const introMotion = reducedMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 8, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 6, scale: 0.98 },
        transition: { duration: 0.25, ease: "easeOut" as const },
      }

  return (
    <div
      className={cn(
        "fixed z-[60] flex w-max max-w-[calc(100vw-2rem)] flex-col items-end",
        "bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]",
        "sm:bottom-6 sm:right-6",
      )}
    >
      <div className="relative flex flex-col items-end gap-2 pb-[calc(2.75rem+1.25rem)] sm:gap-3 sm:pb-[calc(3rem+1.25rem)]">
      <AnimatePresence>
        {showIntro && !isOpen ? (
          <motion.div
            ref={introRef}
            key="sappo-intro"
            role="status"
            aria-live="polite"
            className="relative w-[min(380px,calc(100vw-2rem))] sm:max-w-[280px]"
            {...introMotion}
          >
            <div className="relative rounded-2xl border border-border bg-card px-4 py-3.5 shadow-xl">
              <button
                type="button"
                onClick={dismissIntro}
                aria-label={chatbotUi.introBubble.dismissLabel}
                className="absolute top-2 right-2 rounded-md p-1 text-muted-on-dark transition-colors hover:bg-muted/80 hover:text-on-dark"
              >
                <X className="size-3.5" />
              </button>
              <p className="pr-6 font-sans text-sm font-semibold text-on-dark">
                {chatbotUi.introBubble.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-on-dark">
                {chatbotUi.introBubble.body}
              </p>
              <Button
                type="button"
                size="sm"
                onClick={openChat}
                className="mt-3 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {chatbotUi.introBubble.cta}
              </Button>
            </div>
            <span
              aria-hidden
              className="absolute -bottom-1.5 right-7 size-3 rotate-45 border-r border-b border-border bg-card"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={panelRef}
            key="chat-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="flex w-[min(380px,calc(100vw-2rem))] max-h-[min(52dvh,22rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:max-h-[min(68vh,32.5rem)]"
            {...panelMotion}
          >
            <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-agua shadow-sm ring-1 ring-primary/25 sm:size-9"
                  aria-hidden
                >
                  <Image
                    src={sappoAssets.chatAvatar}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 object-contain sm:size-[22px]"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <h2 id={titleId} className="font-sans text-sm font-semibold tracking-wide text-on-dark uppercase">
                    {chatbotUi.title}
                  </h2>
                  <span className="text-[0.6875rem] font-medium text-muted-on-dark">
                    Asistente virtual
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeChat}
                aria-label={chatbotUi.closeLabel}
                className="shrink-0 rounded-md p-1.5 text-muted-on-dark transition-colors hover:bg-muted hover:text-on-dark"
              >
                <X className="size-4" />
              </button>
            </header>

            <div
              ref={messagesScrollRef}
              className="chat-scrollbar flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-y-contain px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  text={message.text}
                  href={message.href}
                  linkLabel={message.linkLabel}
                  onLinkClick={closeChat}
                />
              ))}
              {isTyping ? <ChatTypingIndicator reducedMotion={reducedMotion} /> : null}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 ? (
              <div className="shrink-0 border-t border-border">
                {/* Mobile: single-row horizontal scroll, fade + chevron hint on whichever side still has chips */}
                <div className="sm:hidden">
                  <ChipScrollRow className="gap-2 px-4 py-2.5" edgeFrom="from-card">
                    {quickReplies.map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => submitQuery(chip.query)}
                        className={quickReplyChipClassName}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </ChipScrollRow>
                </div>

                {/* Desktop/tablet: wrap so every chip stays reachable without a scroll gesture */}
                <div className="hidden flex-wrap gap-2 px-4 py-2.5 sm:flex">
                  {quickReplies.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => submitQuery(chip.query)}
                      className={quickReplyChipClassName}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="flex shrink-0 items-center gap-2 border-t border-border p-2.5 sm:p-3"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={chatbotUi.inputPlaceholder}
                className="flex-1 rounded-full border-border bg-background/50 px-4 text-on-dark placeholder:text-muted-on-dark"
                name="sappo-chat-message"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                data-1p-ignore
                data-lpignore="true"
                data-form-type="other"
              />
              <Button
                type="submit"
                size="icon"
                aria-label={chatbotUi.sendLabel}
                disabled={!input.trim() || isTyping}
                className="shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
      </div>

      <motion.div
        ref={fabRef}
        className="absolute right-0 bottom-0"
        animate={
          !isOpen && !reducedMotion ? { y: [0, -3, 0] } : { y: 0 }
        }
        transition={
          !isOpen && !reducedMotion
            ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      >
        <Button
          type="button"
          size="icon"
          onClick={() => (isOpen ? closeChat() : openChat())}
          aria-label={chatbotUi.fabLabel}
          aria-expanded={isOpen}
          className={cn(
            "relative size-11 shrink-0 cursor-pointer overflow-hidden rounded-full p-0 bg-primary text-primary-foreground",
            "shadow-[0_4px_20px_rgba(4,29,35,0.32)] transition-colors duration-200",
            "hover:bg-primary/90 active:bg-primary/80",
            "focus-visible:ring-2 focus-visible:ring-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            !isOpen && !reducedMotion && "motion-safe:animate-sappo-fab",
            "sm:size-12",
          )}
        >
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-150",
              isOpen ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={!isOpen}
          >
            <X className="size-4 sm:size-5" />
          </span>
          <Image
            src={sappoAssets.fabLogo}
            alt=""
            width={44}
            height={44}
            className={cn(
              "absolute bottom-0 left-1/2 block size-11 max-w-none -translate-x-1/2 object-contain object-bottom transition-opacity duration-150 sm:size-12",
              isOpen ? "opacity-0" : "opacity-100",
            )}
            aria-hidden={isOpen}
          />
        </Button>
      </motion.div>
    </div>
  )
}
