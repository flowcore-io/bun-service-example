import env from "@/env"
import { WebhookBuilder } from "@flowcore/sdk-transformer-core"
import { predicateRedisFactory } from "../lib/predicate-redis"

export const webhookBuilder = new WebhookBuilder({
  baseUrl: env.FLOWCORE_WEBHOOK_BASE_URL,
  tenant: env.FLOWCORE_TENANT,
  dataCore: env.FLOWCORE_DATA_CORE,
  apiKey: env.FLOWCORE_API_KEY,
})
  .withPredicate({
    predicate: predicateRedisFactory({
      redisUrl: env.REDIS_URL,
      redisEventIdKey: env.REDIS_KEY_PATTERN,
    }).check,
  })
  .withRetry()
  .factory()
