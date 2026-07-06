#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const SCAN_DIRS = ["app", "components", "content", "lib", "src"]
const EXTENSIONS = new Set([".ts", ".tsx"])
const IGNORE_DIRS = new Set(["node_modules", ".next", "scripts"])
const BANNED = /\bconsole\.(log|debug)\s*\(/

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue
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

for (const dir of SCAN_DIRS) {
  const target = path.join(ROOT, dir)
  let files = []
  try {
    files = await walk(target)
  } catch {
    continue
  }

  for (const file of files) {
    const content = await readFile(file, "utf8")
    const lines = content.split("\n")
    for (let i = 0; i < lines.length; i++) {
      if (BANNED.test(lines[i])) {
        violations.push(`${path.relative(ROOT, file)}:${i + 1}: ${lines[i].trim()}`)
      }
    }
  }
}

if (violations.length > 0) {
  console.error("console.log/debug found (remove before merge to main):\n")
  for (const line of violations) console.error(`  ${line}`)
  process.exit(1)
}

console.log("console check OK")
