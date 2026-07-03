import { altaAutonomoFormContent } from "@/content/alta-autonomo-form"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const POSTAL_CODE_RE = /^\d{5}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE"
const NIE_PREFIX = new Map<string, string>([
  ["X", "0"],
  ["Y", "1"],
  ["Z", "2"],
])

const YES_NO_SET = new Set(["si", "no"])

export type AltaAutonomoSubmissionPayload = {
  token?: string
  nombre?: string
  apellidos?: string
  nif?: string
  telefono?: string
  email?: string
  certificado_digital?: string
  ya_eres_autonomo?: string
  fecha_alta?: string
  fecha_dar_alta?: string
  fuiste_autonomo_3_anos?: string
  fecha_baja?: string
  fecha_empezar_con_nosotros?: string
  direccion?: string
  ciudad?: string
  provincia?: string
  codigo_postal?: string
  pais?: string
  actividad?: string
  ingresos_anuales?: string
  iban?: string
  comentarios?: string
  privacidad?: boolean
  company?: string
  formStartedAt?: number
}

export type ValidatedAltaAutonomoSubmission = {
  token: string
  nombre: string
  apellidos: string
  nif: string
  telefono: string
  email: string
  certificado_digital: "si" | "no"
  ya_eres_autonomo: "si" | "no"
  fecha_alta?: string
  fecha_dar_alta?: string
  fuiste_autonomo_3_anos?: "si" | "no"
  fecha_baja?: string
  fecha_empezar_con_nosotros: string
  direccion: string
  ciudad: string
  provincia: string
  codigo_postal: string
  pais: string
  actividad: string
  ingresos_anuales: number
  iban: string
  comentarios?: string
  privacidad: true
}

export type AltaAutonomoValidationErrorCode =
  | "honeypot"
  | "too_fast"
  | "invalid_body"

export type AltaAutonomoValidationIssueKey = keyof typeof altaAutonomoFormContent.validation

export type AltaAutonomoValidationIssue = {
  field: AltaAutonomoValidationIssueKey
  message: string
}

export type AltaAutonomoValidationResult =
  | { ok: true; data: ValidatedAltaAutonomoSubmission }
  | { ok: false; code: AltaAutonomoValidationErrorCode; issues?: AltaAutonomoValidationIssue[] }

function toTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeUpperCompact(value: string): string {
  return value.toUpperCase().replace(/\s+/g, "")
}

function normalizePhone(value: string): string {
  return value.replace(/[()\s-]/g, "")
}

function normalizeIban(value: string): string {
  return value.toUpperCase().replace(/\s+/g, "")
}

function isValidDateValue(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return false
  return date.toISOString().slice(0, 10) === value
}

function isYesNo(value: string): value is "si" | "no" {
  return YES_NO_SET.has(value)
}

function isValidNifNie(rawValue: string): boolean {
  const value = normalizeUpperCompact(rawValue)
  if (value.length < 2 || value.length > altaAutonomoFormContent.limits.nifMax) {
    return false
  }

  const letter = value.slice(-1)
  if (!/^[A-Z]$/.test(letter)) return false
  const body = value.slice(0, -1)

  let numericBody = body
  const niePrefix = NIE_PREFIX.get(body[0] ?? "")
  if (niePrefix) {
    numericBody = `${niePrefix}${body.slice(1)}`
  }

  if (!/^\d{8}$/.test(numericBody)) return false

  const number = Number.parseInt(numericBody, 10)
  if (!Number.isFinite(number)) return false
  const expectedLetter = DNI_LETTERS[number % 23]
  return expectedLetter === letter
}

function isValidSpanishMobilePhone(rawValue: string): boolean {
  const value = normalizePhone(rawValue)
  if (!value.startsWith("+34")) return false
  const national = value.slice(3)
  return /^[6789]\d{8}$/.test(national)
}

function ibanToBigIntChunks(iban: string): string {
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`
  let numeric = ""

  for (const char of rearranged) {
    if (/[A-Z]/.test(char)) {
      numeric += String(char.charCodeAt(0) - 55)
    } else if (/\d/.test(char)) {
      numeric += char
    } else {
      return ""
    }
  }

  return numeric
}

function mod97(numericString: string): number {
  let remainder = 0
  for (const digit of numericString) {
    remainder = (remainder * 10 + Number.parseInt(digit, 10)) % 97
  }
  return remainder
}

function isValidSpanishIban(rawValue: string): boolean {
  const value = normalizeIban(rawValue)
  if (!/^ES\d{22}$/.test(value)) return false
  const numeric = ibanToBigIntChunks(value)
  if (!numeric) return false
  return mod97(numeric) === 1
}

function hasPhoneDigits(rawValue: string): boolean {
  const national = normalizePhone(rawValue).replace(/^\+34/, "")
  return national.length > 0
}

function parsePositiveInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value
  if (typeof value === "string") {
    const parsed = Number.parseInt(value.trim(), 10)
    if (Number.isInteger(parsed) && parsed > 0) return parsed
  }
  return null
}

/** Required fields filled (no format checks). Used to enable submit. */
export function isAltaAutonomoFormComplete(input: AltaAutonomoSubmissionPayload): boolean {
  const nombre = toTrimmedString(input.nombre)
  const apellidos = toTrimmedString(input.apellidos)
  const nif = toTrimmedString(input.nif)
  const telefono = toTrimmedString(input.telefono)
  const email = toTrimmedString(input.email)
  const certificadoDigital = toTrimmedString(input.certificado_digital)
  const yaEresAutonomo = toTrimmedString(input.ya_eres_autonomo)
  const fechaAlta = toTrimmedString(input.fecha_alta)
  const fechaDarAlta = toTrimmedString(input.fecha_dar_alta)
  const fuisteAutonomo3Anos = toTrimmedString(input.fuiste_autonomo_3_anos)
  const fechaBaja = toTrimmedString(input.fecha_baja)
  const fechaEmpezarConNosotros = toTrimmedString(input.fecha_empezar_con_nosotros)
  const direccion = toTrimmedString(input.direccion)
  const ciudad = toTrimmedString(input.ciudad)
  const provincia = toTrimmedString(input.provincia)
  const codigoPostal = toTrimmedString(input.codigo_postal)
  const pais = toTrimmedString(input.pais)
  const actividad = toTrimmedString(input.actividad)
  const ingresosAnualesRaw = toTrimmedString(input.ingresos_anuales)
  const iban = toTrimmedString(input.iban)

  if (!nombre || !apellidos || !nif || !hasPhoneDigits(telefono) || !email) {
    return false
  }
  if (!isYesNo(certificadoDigital) || !isYesNo(yaEresAutonomo)) {
    return false
  }

  if (yaEresAutonomo === "si") {
    if (!fechaAlta) return false
  } else if (yaEresAutonomo === "no") {
    if (!fechaDarAlta || !isYesNo(fuisteAutonomo3Anos)) return false
    if (fuisteAutonomo3Anos === "si" && !fechaBaja) return false
  }

  if (!fechaEmpezarConNosotros) return false
  if (!direccion || !ciudad || !provincia || !codigoPostal || !pais || !actividad) {
    return false
  }
  if (ingresosAnualesRaw.replace(/\D/g, "").length === 0) return false
  if (!iban) return false
  if (input.privacidad !== true) return false

  return true
}

export function getAltaAutonomoValidationIssues(
  input: AltaAutonomoSubmissionPayload
): AltaAutonomoValidationIssue[] {
  const issues: AltaAutonomoValidationIssue[] = []
  const pushIssue = (field: AltaAutonomoValidationIssueKey) => {
    issues.push({ field, message: altaAutonomoFormContent.validation[field] })
  }

  const nombre = toTrimmedString(input.nombre)
  const apellidos = toTrimmedString(input.apellidos)
  const nif = toTrimmedString(input.nif)
  const telefono = toTrimmedString(input.telefono)
  const email = toTrimmedString(input.email).toLowerCase()
  const certificadoDigital = toTrimmedString(input.certificado_digital)
  const yaEresAutonomo = toTrimmedString(input.ya_eres_autonomo)
  const fechaAlta = toTrimmedString(input.fecha_alta)
  const fechaDarAlta = toTrimmedString(input.fecha_dar_alta)
  const fuisteAutonomo3Anos = toTrimmedString(input.fuiste_autonomo_3_anos)
  const fechaBaja = toTrimmedString(input.fecha_baja)
  const fechaEmpezarConNosotros = toTrimmedString(input.fecha_empezar_con_nosotros)
  const direccion = toTrimmedString(input.direccion)
  const ciudad = toTrimmedString(input.ciudad)
  const provincia = toTrimmedString(input.provincia)
  const codigoPostal = toTrimmedString(input.codigo_postal)
  const pais = toTrimmedString(input.pais)
  const actividad = toTrimmedString(input.actividad)
  const ingresosAnualesRaw = toTrimmedString(input.ingresos_anuales)
  const iban = toTrimmedString(input.iban)
  const comentarios = toTrimmedString(input.comentarios)

  if (!nombre || nombre.length > altaAutonomoFormContent.limits.nombreMax) pushIssue("nombre")
  if (!apellidos || apellidos.length > altaAutonomoFormContent.limits.apellidosMax) {
    pushIssue("apellidos")
  }
  if (!isValidNifNie(nif)) pushIssue("nif")
  if (!isValidSpanishMobilePhone(telefono)) pushIssue("telefono")
  if (!email || email.length > altaAutonomoFormContent.limits.emailMax || !EMAIL_RE.test(email)) {
    pushIssue("email")
  }

  if (!isYesNo(certificadoDigital)) pushIssue("certificado_digital")
  if (!isYesNo(yaEresAutonomo)) pushIssue("ya_eres_autonomo")

  if (yaEresAutonomo === "si") {
    if (!fechaAlta || !isValidDateValue(fechaAlta)) pushIssue("fecha_alta")
  } else if (yaEresAutonomo === "no") {
    if (!fechaDarAlta || !isValidDateValue(fechaDarAlta)) pushIssue("fecha_dar_alta")
    if (!isYesNo(fuisteAutonomo3Anos)) {
      pushIssue("fuiste_autonomo_3_anos")
    } else if (fuisteAutonomo3Anos === "si" && (!fechaBaja || !isValidDateValue(fechaBaja))) {
      pushIssue("fecha_baja")
    }
  }

  if (!fechaEmpezarConNosotros || !isValidDateValue(fechaEmpezarConNosotros)) {
    pushIssue("fecha_empezar_con_nosotros")
  }

  if (!direccion || direccion.length > altaAutonomoFormContent.limits.direccionMax) {
    pushIssue("direccion")
  }
  if (!ciudad || ciudad.length > altaAutonomoFormContent.limits.ciudadMax) pushIssue("ciudad")
  if (!parsePositiveInt(provincia)) pushIssue("provincia")
  if (!POSTAL_CODE_RE.test(codigoPostal)) pushIssue("codigo_postal")
  if (!parsePositiveInt(pais)) pushIssue("pais")
  if (
    !actividad ||
    actividad.length < altaAutonomoFormContent.limits.actividadMin ||
    actividad.length > altaAutonomoFormContent.limits.actividadMax
  ) {
    pushIssue("actividad")
  }

  const ingresosDigits = ingresosAnualesRaw.replace(/\D/g, "")
  const ingresosAnuales = Number.parseInt(ingresosDigits, 10)
  if (
    !Number.isFinite(ingresosAnuales) ||
    ingresosDigits.length === 0 ||
    ingresosDigits.length > altaAutonomoFormContent.limits.ingresosAnualesDigitsMax ||
    ingresosAnuales < altaAutonomoFormContent.minAnnualIncomeEur
  ) {
    pushIssue("ingresos_anuales")
  }

  if (
    !isValidSpanishIban(iban) ||
    normalizeIban(iban).length > altaAutonomoFormContent.limits.ibanMax
  ) {
    pushIssue("iban")
  }

  if (comentarios.length > altaAutonomoFormContent.limits.comentariosMax) {
    pushIssue("comentarios")
  }

  if (input.privacidad !== true) pushIssue("privacidad")

  return issues
}

export function validateAltaAutonomoSubmission(
  input: AltaAutonomoSubmissionPayload,
  now = Date.now()
): AltaAutonomoValidationResult {
  if (typeof input.company === "string" && input.company.trim().length > 0) {
    return { ok: false, code: "honeypot" }
  }

  const startedAt =
    typeof input.formStartedAt === "number" && Number.isFinite(input.formStartedAt)
      ? input.formStartedAt
      : 0
  if (startedAt > 0 && now - startedAt < altaAutonomoFormContent.limits.minSubmitDelayMs) {
    return { ok: false, code: "too_fast" }
  }

  const token = toTrimmedString(input.token)
  if (!token || token.length > altaAutonomoFormContent.limits.tokenMax) {
    return { ok: false, code: "invalid_body" }
  }

  const issues = getAltaAutonomoValidationIssues(input)
  if (issues.length > 0) {
    return { ok: false, code: "invalid_body", issues }
  }

  const yaEresAutonomo = toTrimmedString(input.ya_eres_autonomo) as "si" | "no"
  const fuisteAutonomo3Anos = toTrimmedString(input.fuiste_autonomo_3_anos)
  const ingresosAnuales = Number.parseInt(toTrimmedString(input.ingresos_anuales).replace(/\D/g, ""), 10)

  return {
    ok: true,
    data: {
      token: toTrimmedString(input.token),
      nombre: toTrimmedString(input.nombre),
      apellidos: toTrimmedString(input.apellidos),
      nif: normalizeUpperCompact(toTrimmedString(input.nif)),
      telefono: normalizePhone(toTrimmedString(input.telefono)),
      email: toTrimmedString(input.email).toLowerCase(),
      certificado_digital: toTrimmedString(input.certificado_digital) as "si" | "no",
      ya_eres_autonomo: yaEresAutonomo,
      fecha_alta: yaEresAutonomo === "si" ? toTrimmedString(input.fecha_alta) : undefined,
      fecha_dar_alta: yaEresAutonomo === "no" ? toTrimmedString(input.fecha_dar_alta) : undefined,
      fuiste_autonomo_3_anos:
        yaEresAutonomo === "no" ? (fuisteAutonomo3Anos as "si" | "no") : undefined,
      fecha_baja:
        yaEresAutonomo === "no" && fuisteAutonomo3Anos === "si"
          ? toTrimmedString(input.fecha_baja)
          : undefined,
      fecha_empezar_con_nosotros: toTrimmedString(input.fecha_empezar_con_nosotros),
      direccion: toTrimmedString(input.direccion),
      ciudad: toTrimmedString(input.ciudad),
      provincia: toTrimmedString(input.provincia),
      codigo_postal: toTrimmedString(input.codigo_postal),
      pais: toTrimmedString(input.pais),
      actividad: toTrimmedString(input.actividad),
      ingresos_anuales: ingresosAnuales,
      iban: normalizeIban(toTrimmedString(input.iban)),
      comentarios: toTrimmedString(input.comentarios) || undefined,
      privacidad: true,
    },
  }
}
