#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "public",
  "scripts/ci",
])
const IGNORE_FILES = new Set([
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  ".env.example",
  ".env.local",
  ".env",
])
const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".md",
  ".yml",
  ".yaml",
  ".env",
  ".local",
])

const PATTERNS = [
  { name: "AWS access key", regex: /AKIA[0-9A-Z]{16}/ },
  { name: "Stripe live secret", regex: /sk_live_[0-9a-zA-Z]{16,}/ },
  { name: "GitHub PAT", regex: /ghp_[0-9a-zA-Z]{20,}/ },
  { name: "Google API key", regex: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: "Private key block", regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  {
    name: "Assigned onboarding secret",
    regex: /LANDING_ONBOARDING_API_SECRET\s*=\s*['"]?[A-Za-z0-9_\-]{12,}['"]?/,
  },
  {
    name: "Assigned Supabase service role",
    regex: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"]?eyJ[A-Za-z0-9_-]{20,}/,
  },
  {
    name: "Bearer JWT in source",
    regex: /['"]Bearer eyJ[A-Za-z0-9_-]{20,}/,
  },
]

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(fullPath, files)
      continue
    }
    if (!TEXT_EXT.has(path.extname(entry.name))) continue
    if (IGNORE_FILES.has(entry.name)) continue
    files.push(fullPath)
  }
  return files
}

const violations = []
const files = await walk(ROOT)

for (const file of files) {
  const info = await stat(file)
  if (info.size > 512_000) continue
  const content = await readFile(file, "utf8")
  const rel = path.relative(ROOT, file)
  const lines = content.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes("check-secrets.mjs")) continue
    for (const { name, regex } of PATTERNS) {
      if (regex.test(line)) {
        violations.push(`${rel}:${i + 1} [${name}]`)
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Possible secret exposure:\n")
  for (const line of violations) console.error(`  ${line}`)
  process.exit(1)
}

console.log("secrets check OK")
