import { db } from "@/database"
import { sql } from "drizzle-orm"

import { type HealthChecks, healthCheckHandler } from "@/lib/health-checker"
import Elysia from "elysia"

const healthChecks: HealthChecks = {
  postgres: () =>
    db
      .execute(sql`SELECT 1`)
      .then(() => undefined)
      .catch((error) => (error instanceof Error ? error.message : "unknown error")),
}

export default new Elysia({ prefix: "/health" }).get("/", healthCheckHandler(healthChecks))
