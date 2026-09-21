"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  VIEW_H,
  VIEW_W,
  canariasInset,
  canariasPath,
  coverageMapOrigin,
  coverageMapRoutes,
  mainlandPath,
} from "@/content/coverage-map"

function bezierPath(x0: number, y0: number, x2: number, y2: number, bow = 0.22) {
  const mx = (x0 + x2) / 2
  const my = (y0 + y2) / 2
  const dist = Math.hypot(x2 - x0, y2 - y0)
  const cy = my - dist * bow
  return `M${x0},${y0} Q${mx},${cy} ${x2},${y2}`
}

// Las Palmas cae pegada a Tenerife en el recuadro de Canarias — su etiqueta se
// desplaza a la derecha para no solapar con la de origen. El resto usa la
// posición por defecto (centrada, encima del nodo).
const LABEL_OFFSETS: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  "Las Palmas": { dx: 12, dy: 4, anchor: "start" },
}
const DEFAULT_LABEL_OFFSET = { dx: 0, dy: -12, anchor: "middle" as const }

// Sentinel para "se está pasando el ratón por el origen": todas las rutas se
// activan a la vez, como si Tenerife estuviera emitiendo hacia todas partes.
const HUB_HOVER = "*"

type CoverageDispatchMapProps = {
  /** Desactívalo en usos pequeños (p. ej. una tarjeta teaser): a menos escala
   * el texto deja de ser legible antes de que la media query sm: lo oculte. */
  showLabels?: boolean
}

export function CoverageDispatchMap({ showLabels = true }: CoverageDispatchMapProps) {
  const originLabelId = "coverage-map-origin"
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="relative aspect-[900/560] w-full">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        aria-hidden={!showLabels}
      >
        <g aria-hidden>
          <path
            d={mainlandPath}
            className="fill-agua/10 stroke-agua/40 transition-colors duration-300 group-hover:stroke-primary"
            strokeWidth={1}
          />
          <path
            d={canariasPath}
            className="fill-agua/10 stroke-agua/40 transition-colors duration-300 group-hover:stroke-primary"
            strokeWidth={1}
          />
          <rect
            x={canariasInset.x}
            y={canariasInset.y}
            width={canariasInset.width}
            height={canariasInset.height}
            rx={4}
            fill="none"
            className="stroke-agua/25"
            strokeWidth={1}
          />
        </g>

        <g aria-hidden>
          {coverageMapRoutes.map((route) => {
            const isActive = hovered === route.name || hovered === HUB_HOVER
            const isDimmed = hovered !== null && !isActive
            return (
              <path
                key={route.name}
                d={bezierPath(coverageMapOrigin.x, coverageMapOrigin.y, route.x, route.y)}
                fill="none"
                className={cn(
                  "route-line transition-colors duration-300",
                  isActive ? "stroke-primary" : isDimmed ? "stroke-primary/15" : "stroke-primary/45"
                )}
                strokeWidth={isActive ? 1.6 : 1.1}
                strokeLinecap="round"
              />
            )
          })}
        </g>

        {coverageMapRoutes.map((route) => {
          const { dx, dy, anchor } = LABEL_OFFSETS[route.name] ?? DEFAULT_LABEL_OFFSET
          const isActive = hovered === route.name
          return (
            <g
              key={route.name}
              onMouseEnter={() => setHovered(route.name)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* fill="transparent" (no "none") para que el área sin pintar visible siga capturando el hover */}
              <circle cx={route.x} cy={route.y} r={14} fill="transparent" />
              <circle
                cx={route.x}
                cy={route.y}
                r={6}
                className={cn(
                  "fill-none transition-colors duration-300",
                  isActive ? "stroke-primary" : "stroke-primary/30"
                )}
                strokeWidth={isActive ? 1.5 : 1}
              />
              <circle cx={route.x} cy={route.y} r={3.5} className="fill-primary" />
              {showLabels ? (
                <text
                  x={route.x + dx}
                  y={route.y + dy}
                  textAnchor={anchor}
                  className={cn(
                    "hidden text-[13px] tracking-wide transition-colors duration-300 sm:block",
                    isActive ? "fill-on-dark font-semibold" : "fill-muted-on-dark font-medium"
                  )}
                >
                  {route.name}
                </text>
              ) : null}
            </g>
          )
        })}

        <g
          aria-labelledby={showLabels ? originLabelId : undefined}
          onMouseEnter={() => setHovered(HUB_HOVER)}
          onMouseLeave={() => setHovered(null)}
        >
          <circle cx={coverageMapOrigin.x} cy={coverageMapOrigin.y} r={14} fill="transparent" />
          <circle
            cx={coverageMapOrigin.x}
            cy={coverageMapOrigin.y}
            r={9}
            className="fill-primary/25 animate-ping"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
          <circle
            cx={coverageMapOrigin.x}
            cy={coverageMapOrigin.y}
            r={5}
            className="fill-none stroke-on-dark/40"
            strokeWidth={1.5}
          />
          <circle cx={coverageMapOrigin.x} cy={coverageMapOrigin.y} r={5} className="fill-primary" />
          {showLabels ? (
            <text
              id={originLabelId}
              x={coverageMapOrigin.x - 10}
              y={coverageMapOrigin.y + 4}
              textAnchor="end"
              className="fill-on-dark text-[13px] font-semibold tracking-wide sm:text-[14px]"
            >
              {coverageMapOrigin.name}
            </text>
          ) : null}
        </g>
      </svg>

      {showLabels ? (
        <p className="mt-4 text-center text-xs text-muted-on-dark sm:hidden">
          Cada trazo representa una gestión resuelta a distancia, en las provincias donde ya trabajamos.
        </p>
      ) : null}
    </div>
  )
}
