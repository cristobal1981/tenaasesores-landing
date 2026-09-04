#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const dir = path.dirname(fileURLToPath(import.meta.url))

function run(script) {
  const result = spawnSync(process.execPath, [path.join(dir, script)], {
    stdio: "inherit",
    env: process.env,
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function runBin(bin, args = []) {
  const result = spawnSync(bin, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run("check-console.mjs")
run("check-secrets.mjs")
run("check-spanish-copy.mjs")
runBin("pnpm", ["knip"])
runBin("pnpm", ["spellcheck"])

console.log("\nAll main-branch CI checks passed.")
