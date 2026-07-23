import { getLenisInstance } from "@/lib/scroll/lenis-instance"

function getHeaderOffset() {
  if (typeof window === "undefined") return -56
  const height = getComputedStyle(document.documentElement).getPropertyValue("--site-header-height")
  const parsed = Number.parseFloat(height)
  return Number.isFinite(parsed) ? -parsed : -56
}

export function scrollToElement(
  target: HTMLElement | string,
  options?: { offset?: number; behavior?: ScrollBehavior },
) {
  const element =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target

  if (!element) return

  const lenis = getLenisInstance()
  const offset = options?.offset ?? getHeaderOffset()

  if (lenis) {
    lenis.scrollTo(element, { offset })
    return
  }

  element.scrollIntoView({
    behavior: options?.behavior ?? "smooth",
    block: "start",
  })
}
