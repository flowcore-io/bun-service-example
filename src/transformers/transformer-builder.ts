import env from "@/env"
import { predicateRedisFactory } from "@/lib/predicate-redis"
import { transformerFactory } from "@/lib/transformer-factory"

export const transformerBuilder = transformerFactory({
  onSuccess: predicateRedisFactory({
    redisUrl: env.REDIS_URL,
    redisEventIdKey: env.REDIS_KEY_PATTERN,
  }).notify,
  secret: env.TRANSFORMER_SECRET,
})
