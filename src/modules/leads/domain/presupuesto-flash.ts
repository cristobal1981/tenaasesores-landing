export type PresupuestoLinea = {
  nombre: string
  precio: number
}

export type PresupuestoFlash = {
  tipo: string
  residencia: string
  lineas: PresupuestoLinea[]
  totalMensual: number
}

// El webhook que genera esto sigue en borrador: parseo defensivo, no confiar
// ciegamente en la forma del JSON.
export function parsePresupuestoFlash(raw: unknown): PresupuestoFlash | null {
  if (!raw || typeof raw !== "object") return null
  const body = raw as Record<string, unknown>

  if (!Array.isArray(body.lineas)) return null

  const lineas = body.lineas
    .filter((linea): linea is Record<string, unknown> => Boolean(linea) && typeof linea === "object")
    .map((linea) => ({
      nombre: typeof linea.nombre === "string" ? linea.nombre : "",
      precio: typeof linea.precio === "number" ? linea.precio : Number(linea.precio) || 0,
    }))
    .filter((linea) => linea.nombre.length > 0)

  if (lineas.length === 0) return null

  const totalMensual =
    typeof body.total_mensual === "number" ? body.total_mensual : Number(body.total_mensual) || 0

  return {
    tipo: typeof body.tipo === "string" ? body.tipo : "",
    residencia: typeof body.residencia === "string" ? body.residencia : "",
    lineas,
    totalMensual,
  }
}
