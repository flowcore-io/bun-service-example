import * as schemas from "@/database/schemas"
import env from "@/env"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: env.POSTGRES_CONNECTION_STRING,
})

export const db = drizzle(pool, {
  schema: schemas,
  logger: env.POSTGRES_QUERY_LOG,
})
