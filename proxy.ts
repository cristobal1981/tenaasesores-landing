import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  let decoded = pathname
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return NextResponse.rewrite(new URL("/400", request.url), { status: 400 })
  }

  const isInvalidPath =
    decoded.includes("\0") || /%00/i.test(pathname) || /\/{2,}/.test(pathname)

  if (isInvalidPath) {
    return NextResponse.rewrite(new URL("/400", request.url), { status: 400 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
