import env from "@/env"
import { createLogger } from "@/lib/logger"
import { api } from "@/server/routes/api"
import healthRouter from "@/server/routes/health"
import Elysia from "elysia"
import transformersRouter from "@/transformers"

const logger = createLogger("server")

export const server = new Elysia()
  .use(healthRouter)

  // Add routes here
  .use(api)

  .use(transformersRouter)

export default {
  start: () => {
    server.listen(env.SERVICE_PORT)
    logger.info(`Server listening on port ${env.SERVICE_PORT}`)
  },
  stop: () => {
    server.stop()
    logger.info("Server stopped")
  },
}
