export const notImplementedPath = "/proximamente" as const

export type SappoMood = "lost" | "confused" | "sleepy" | "guard" | "dizzy" | "builder"

type ErrorAction = { label: string; href: string }

export type ErrorVariant = {
  /** Texto fantasma a ambos lados de Sappo; Sappo ocupa el hueco de la "o"/"0". */
  ghost: readonly [string, string]
  /** Texto accesible del código (el fantasma es decorativo y va aria-hidden). */
  eyebrow: string
  title: string
  description: string
  mood: SappoMood
  /** Frases del bocadillo de Sappo; la primera sale sola al cargar. */
  croaks: readonly string[]
  primary: ErrorAction
  /** Si hay `onRetry`, el reintento sustituye a la acción primaria. */
  retryLabel?: string
  secondary?: ErrorAction
}

export const errorQuickLinks = [
  { label: "Servicios", href: "/servicios" },
  { label: "Autónomos", href: "/plan-autonomos" },
  { label: "Empresas", href: "/plan-empresas" },
  { label: "Contacto", href: "/contacto" },
] as const

const home = { label: "Volver al inicio", href: "/" } as const

export const errorPages = {
  400: {
    ghost: ["4", "0"],
    eyebrow: "Error 400 · Petición incorrecta",
    title: "Sappo ha ladeado la cabeza: esta petición no cuadra",
    description:
      "Algo en la solicitud no encaja con lo que esperábamos, como una fila de la hoja de cálculo que no suma. Revisa la dirección e inténtalo de nuevo.",
    mood: "confused",
    croaks: [
      "¿Croac…?",
      "Eso no figura en el balance.",
      "Repite, que me he distraído con una mosca.",
    ],
    primary: home,
  },
  404: {
    ghost: ["4", "4"],
    eyebrow: "Error 404 · Página no encontrada",
    title: "Esta página no está en el balance. Sappo ya ha mirado debajo de todos los nenúfares",
    description:
      "Puede que el enlace esté desactualizado o que la dirección tenga un error. Vuelve al inicio o prueba con alguno de los enlaces de abajo.",
    mood: "lost",
    croaks: [
      "Croac. Aquí no hay ningún expediente.",
      "He mirado en el nenúfar. Y en el otro.",
      "¿Seguro que era esta dirección?",
    ],
    primary: home,
  },
  500: {
    ghost: ["5", "0"],
    eyebrow: "Error 500 · Fallo del servidor",
    title: "Pausa café involuntaria. Sappo está mareado",
    description:
      "No es nada que hayas hecho tú. Puedes intentarlo otra vez o volver al inicio; si el problema persiste, escríbenos indicando la referencia de incidencia.",
    mood: "dizzy",
    croaks: [
      "Croac… todo da vueltas.",
      "He apagado y encendido el nenúfar.",
      "Dame un segundo, que me recoloco.",
    ],
    primary: home,
    retryLabel: "Intentar de nuevo",
  },
  fatal: {
    ghost: ["5", "0"],
    eyebrow: "Error crítico · La web no ha podido arrancar",
    title: "Esto es más que un mareo: Sappo se ha desmayado",
    description:
      "Ha fallado algo importante antes de poder mostrarte la página. Recárgala; si sigue igual, vuelve a intentarlo en unos minutos o escríbenos.",
    mood: "dizzy",
    croaks: ["Croac… ¿quién ha apagado la charca?", "Reinicio de emergencia en curso."],
    primary: home,
    retryLabel: "Recargar",
  },
  wip: {
    ghost: ["PR", "NTO"],
    eyebrow: "Próximamente",
    title: "Obras en la charca. Sappo se ha puesto el casco",
    description:
      "Esta sección sigue en construcción. Estará lista muy pronto; mientras tanto puedes volver al inicio o escribirnos si necesitas algo urgente.",
    mood: "builder",
    croaks: [
      "Croac. Casco puesto, ladrillo no.",
      "Esto lleva más cemento del que parece.",
      "Vuelve pronto. Prometido.",
    ],
    primary: home,
  },
} as const satisfies Record<string, ErrorVariant>

export type ErrorVariantKey = `${keyof typeof errorPages}`
