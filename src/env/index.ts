import { Environment, NodeEnv } from "@/lib/env"
import { LogLevel } from "@/lib/logger"
import { Type } from "@sinclair/typebox"

const EnvironmentSchema = Type.Object({
  NODE_ENV: Type.Enum(NodeEnv, { default: NodeEnv.Production }),
  LOG_LEVEL: Type.Enum(LogLevel, { default: LogLevel.Info }),
  LOG_PRETTY: Type.Boolean({ default: false }),

  SERVICE_PORT: Type.Number({ default: 3000 }),

  FLOWCORE_TENANT: Type.String({ minLength: 1 }),
  FLOWCORE_DATA_CORE: Type.String({ minLength: 1 }),
  FLOWCORE_WEBHOOK_BASE_URL: Type.String({ minLength: 1 }),
  FLOWCORE_API_KEY: Type.String(),

  TRANSFORMER_SECRET: Type.String({ minLength: 1 }),
  REDIS_URL: Type.String({ minLength: 1 }),
  REDIS_KEY_PATTERN: Type.String({ minLength: 1 }),

  POSTGRES_CONNECTION_STRING: Type.String({ minLength: 1 }),
  POSTGRES_QUERY_LOG: Type.Boolean({ default: false }),

  SCHEDULER_ENABLED: Type.Boolean({ default: false }),
  SCHEDULER_CRON: Type.String(),

  JWKS_URL: Type.String(),
})

const environment = new Environment(EnvironmentSchema)

export default environment.env
