import path from "node:path"
import { fileURLToPath } from "node:url"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { buildConfig, type SharpDependency } from "payload"
import sharp from "sharp"

import { BlogPosts } from "./collections/blog-posts"
import { Users } from "./collections/users"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, BlogPosts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    // Aísla las tablas de Payload en su propio schema: este Postgres es
    // compartido con syntia-app, que ya tiene su propia tabla public.users.
    schemaName: "payload",
  }),
  // Desajuste de tipos entre las sobrecargas de sharp y SharpDependency
  // (issue conocido en la comunidad de Payload); el runtime es compatible.
  sharp: sharp as unknown as SharpDependency,
})
