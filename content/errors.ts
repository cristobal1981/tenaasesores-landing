export const notImplementedPath = "/proximamente" as const

export const errorQuickLinks = [
  { label: "Servicios", href: "/servicios" },
  { label: "Autónomos", href: "/plan-autonomos" },
  { label: "Empresas", href: "/plan-empresas" },
  { label: "Contacto", href: "/contacto" },
] as const

export const errorPages = {
  404: {
    code: "404",
    title: "Esta página no está en el balance",
    description:
      "Hemos revisado el archivo entero y esta dirección no figura en ningún expediente. Puede que el enlace esté desactualizado o que la URL tenga un error.",
    primaryLabel: "Volver al inicio",
    primaryHref: "/",
  },
  400: {
    code: "400",
    title: "Esta petición no cuadra",
    description:
      "Algo en la solicitud no encaja con lo que esperábamos, como una fila de la hoja de cálculo que no suma. Revisa la dirección e inténtalo de nuevo.",
    primaryLabel: "Volver al inicio",
    primaryHref: "/",
  },
  500: {
    code: "500",
    title: "Pausa café involuntaria",
    description:
      "Nuestros servidores se han tomado un descanso que nadie pidió. No es nada que hayas hecho tú: ya lo estamos revisando. Si el problema persiste, escríbenos y lo miramos con calma.",
    primaryLabel: "Volver al inicio",
    primaryHref: "/",
  },
  wip: {
    code: "Próximamente",
    title: "Este expediente todavía no cuadra",
    description:
      "Esta sección sigue en construcción en nuestros libros. Estará lista muy pronto; mientras tanto puedes volver al inicio o escribirnos si necesitas algo urgente.",
    primaryLabel: "Volver al inicio",
    primaryHref: "/",
  },
} as const
