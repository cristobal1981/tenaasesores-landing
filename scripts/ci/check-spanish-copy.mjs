#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const COPY_GLOBS_DIRS = [
  "content",
  path.join("app", "(site)"),
  path.join("components", "pages"),
  path.join("components", "landing"),
]
const EXTENSIONS = new Set([".ts", ".tsx"])

/** User-facing Spanish: unaccented forms that should not ship. */
const BANNED = [
  { pattern: /\balta autonomo\b/gi, hint: "alta autónomo" },
  { pattern: /\bde autonomo\b/gi, hint: "de autónomo" },
  { pattern: /\bpara autonomo\b/gi, hint: "para autónomo" },
  { pattern: /\bcomo autonomo\b/gi, hint: "como autónomo" },
  { pattern: /\bsoy autonomo\b/gi, hint: "soy autónomo" },
  { pattern: /\bmas habituales\b/gi, hint: "más habituales" },
  { pattern: /\bel tramite\b/gi, hint: "el trámite" },
  { pattern: /\bdel tramite\b/gi, hint: "del trámite" },
  { pattern: /\biniciar el tramite\b/gi, hint: "iniciar el trámite" },
  { pattern: /\btelefono movil\b/gi, hint: "teléfono móvil" },
  { pattern: /\bcodigo postal\b/gi, hint: "código postal" },
  { pattern: /\bno es valido\b/gi, hint: "no es válido" },
  { pattern: /\bespanol\b/gi, hint: "español" },
  { pattern: /\bEspana\b/g, hint: "España" },
  { pattern: /\bpolitica de privacidad\b/gi, hint: "política de privacidad" },
  { pattern: /\bestimacion\b/gi, hint: "estimación" },
  { pattern: /\belectronico\b/gi, hint: "electrónico" },
  { pattern: /\bcuando quieres\b/gi, hint: "cuándo quieres" },
  { pattern: /\bultimos 3 anos\b/gi, hint: "últimos 3 años" },
  { pattern: /\bdigitos\b/gi, hint: "dígitos" },
  { pattern: /\bdesde 69\s*€/gi, hint: "desde 55 € (precio actual plan Base)" },
  { pattern: /\bdesde 59\s*€/gi, hint: "desde 55 € (precio actual plan Base)" },
]

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".next") continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(fullPath, files)
      continue
    }
    if (EXTENSIONS.has(path.extname(entry.name))) files.push(fullPath)
  }
  return files
}

const violations = []

for (const dir of COPY_GLOBS_DIRS) {
  const target = path.join(ROOT, dir)
  let files = []
  try {
    files = await walk(target)
  } catch {
    continue
  }

  for (const file of files) {
    const content = await readFile(file, "utf8")
    const rel = path.relative(ROOT, file)
    const lines = content.split("\n")

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.trim().startsWith("//")) continue
      if (line.includes("pathPrefix") || line.includes("sectionId")) continue
      if (line.includes("_autonomo") || line.includes("ya_eres_autonomo")) continue
      if (line.includes("/plan-autonomos") || line.includes("solicitud-alta-autonomo")) continue
      if (/\b(direccion|codigo_postal|telefono|privacidad)\b/.test(line) && !line.includes('"')) continue
      if (/^\s*(direccion|codigo_postal|telefono|privacidad):/.test(line)) continue
      if (/name="|fieldErrors\.|setDireccion|const \[direccion/.test(line)) continue
      if (/patterns:|keywords:|\/direccion\//.test(line)) continue

      for (const { pattern, hint } of BANNED) {
        pattern.lastIndex = 0
        if (pattern.test(line)) {
          violations.push(`${rel}:${i + 1} → use «${hint}» (${line.trim().slice(0, 80)})`)
        }
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Spanish copy / accent issues:\n")
  for (const line of violations) console.error(`  ${line}`)
  process.exit(1)
}

console.log("spanish copy check OK")
