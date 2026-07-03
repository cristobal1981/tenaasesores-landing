const STORAGE_PREFIX = "alta-autonomo-draft:"

export type AltaAutonomoFormDraft = {
  nombre: string
  apellidos: string
  nif: string
  telefono: string
  email: string
  certificadoDigital: "" | "si" | "no"
  yaEresAutonomo: "" | "si" | "no"
  fechaAlta: string
  fechaDarAlta: string
  fuisteAutonomo3Anos: "" | "si" | "no"
  fechaBaja: string
  fechaEmpezarConNosotros: string
  direccion: string
  ciudad: string
  provincia: string
  codigoPostal: string
  pais: string
  actividad: string
  ingresosAnuales: string
  iban: string
  comentarios: string
  privacyAccepted: boolean
}

function storageKey(token: string): string {
  return `${STORAGE_PREFIX}${token}`
}

function isYesNo(value: unknown): value is "si" | "no" {
  return value === "si" || value === "no"
}

function parseDraft(raw: unknown): AltaAutonomoFormDraft | null {
  if (!raw || typeof raw !== "object") return null
  const data = raw as Record<string, unknown>

  return {
    nombre: typeof data.nombre === "string" ? data.nombre : "",
    apellidos: typeof data.apellidos === "string" ? data.apellidos : "",
    nif: typeof data.nif === "string" ? data.nif : "",
    telefono: typeof data.telefono === "string" ? data.telefono : "+34 ",
    email: typeof data.email === "string" ? data.email : "",
    certificadoDigital: isYesNo(data.certificadoDigital) ? data.certificadoDigital : "",
    yaEresAutonomo: isYesNo(data.yaEresAutonomo) ? data.yaEresAutonomo : "",
    fechaAlta: typeof data.fechaAlta === "string" ? data.fechaAlta : "",
    fechaDarAlta: typeof data.fechaDarAlta === "string" ? data.fechaDarAlta : "",
    fuisteAutonomo3Anos: isYesNo(data.fuisteAutonomo3Anos) ? data.fuisteAutonomo3Anos : "",
    fechaBaja: typeof data.fechaBaja === "string" ? data.fechaBaja : "",
    fechaEmpezarConNosotros:
      typeof data.fechaEmpezarConNosotros === "string" ? data.fechaEmpezarConNosotros : "",
    direccion: typeof data.direccion === "string" ? data.direccion : "",
    ciudad: typeof data.ciudad === "string" ? data.ciudad : "",
    provincia: typeof data.provincia === "string" ? data.provincia : "",
    codigoPostal: typeof data.codigoPostal === "string" ? data.codigoPostal : "",
    pais: typeof data.pais === "string" ? data.pais : "",
    actividad: typeof data.actividad === "string" ? data.actividad : "",
    ingresosAnuales: typeof data.ingresosAnuales === "string" ? data.ingresosAnuales : "",
    iban: typeof data.iban === "string" ? data.iban : "",
    comentarios: typeof data.comentarios === "string" ? data.comentarios : "",
    privacyAccepted: data.privacyAccepted === true,
  }
}

export function readAltaAutonomoFormDraft(token: string): AltaAutonomoFormDraft | null {
  if (typeof window === "undefined" || !token) return null

  try {
    const raw = window.localStorage.getItem(storageKey(token))
    if (!raw) return null
    return parseDraft(JSON.parse(raw))
  } catch {
    return null
  }
}

export function writeAltaAutonomoFormDraft(token: string, draft: AltaAutonomoFormDraft): void {
  if (typeof window === "undefined" || !token) return

  try {
    window.localStorage.setItem(storageKey(token), JSON.stringify(draft))
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function clearAltaAutonomoFormDraft(token: string): void {
  if (typeof window === "undefined" || !token) return

  try {
    window.localStorage.removeItem(storageKey(token))
  } catch {
    // Ignore storage errors.
  }
}
