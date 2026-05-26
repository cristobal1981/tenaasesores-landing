import MiniSearch from "minisearch"
import { flattenSiteContent } from "./flatten-site"
import { normalizeText, tokenize } from "./normalize"
import { filterSearchTokens } from "./stopwords"
import type { KnowledgeChunk } from "./types"

const MIN_SCORE = 1.25
const FUZZY = 0.16

type IndexedDocument = Omit<KnowledgeChunk, "keywords"> & {
  keywords: string
}

let indexInstance: MiniSearch<IndexedDocument> | null = null
let chunksById: Map<string, KnowledgeChunk> | null = null

function getIndex(): { index: MiniSearch<IndexedDocument>; chunks: Map<string, KnowledgeChunk> } {
  if (indexInstance && chunksById) {
    return { index: indexInstance, chunks: chunksById }
  }

  const chunks = flattenSiteContent()
  chunksById = new Map(chunks.map((c) => [c.id, c]))

  indexInstance = new MiniSearch<IndexedDocument>({
    fields: ["title", "body", "keywords", "topic"],
    storeFields: ["id", "title", "body", "href", "topic"],
    searchOptions: {
      boost: { title: 4, keywords: 2.5, topic: 1.5, body: 1 },
      fuzzy: FUZZY,
      prefix: true,
    },
    tokenize: (text) => tokenize(text),
    processTerm: (term) => normalizeText(term),
  })

  indexInstance.addAll(
    chunks.map((chunk) => ({
      id: chunk.id,
      topic: chunk.topic,
      title: chunk.title,
      body: chunk.body,
      href: chunk.href,
      keywords: chunk.keywords.join(" "),
    })),
  )

  return { index: indexInstance, chunks: chunksById }
}

function rankResults(
  results: { id: unknown; score: number }[],
  chunks: Map<string, KnowledgeChunk>,
): { chunk: KnowledgeChunk; score: number }[] {
  if (results.length === 0) return []

  const topScore = results[0].score
  const minRequired = Math.max(MIN_SCORE, topScore * 0.4)

  return results
    .filter((result) => result.score >= minRequired)
    .map((result) => ({
      chunk: chunks.get(String(result.id))!,
      score: result.score,
    }))
    .filter((hit) => hit.chunk != null)
}

export type SearchHit = {
  chunk: KnowledgeChunk
  score: number
}

export function searchKnowledge(query: string, limit = 3): SearchHit[] {
  const tokens = filterSearchTokens(tokenize(query))
  if (tokens.length === 0) return []

  const { index, chunks } = getIndex()
  const searchStr = tokens.join(" ")
  const baseOptions = { fuzzy: FUZZY, prefix: true, boost: { title: 4, keywords: 2.5, topic: 1.5, body: 1 } }

  let results =
    tokens.length >= 2
      ? index.search(searchStr, { ...baseOptions, combineWith: "AND" })
      : index.search(searchStr, baseOptions)

  if (results.length === 0 && tokens.length >= 2) {
    results = index.search(searchStr, { ...baseOptions, combineWith: "OR" })
  }

  if (results.length === 0 && tokens.length === 1) {
    results = index.search(tokens[0], { ...baseOptions, fuzzy: 0.22 })
  }

  return rankResults(results, chunks).slice(0, limit)
}
