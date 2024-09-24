import type { TransformerSuccessHandler, WebhookPredicate } from "@flowcore/sdk-transformer-core"
import Redis from "ioredis"

/**
 * Options for the Redis predicate.
 * @property redisUrl - The URL of the Redis server.
 * @property redisEventIdKey - The key pattern for the Redis key.
 * @example "redisEventIdKey: scenario-api:event-cache"
 */
export type RedisPredicateOptions = {
  redisUrl: string
  redisEventIdKey: string
}

/**
 * Creates a webhook predicate checker that checks if a Redis key exists for a given event ID.
 *
 * @param options - The options for the Redis connection and the key pattern.
 * @returns A webhook predicate function that checks the existence of the Redis key and returns true if it exists.
 */
export function createPredicateRedisChecker(redis: Redis, options: RedisPredicateOptions): WebhookPredicate {
  return async (eventId: string) => {
    const loaded = await redis?.get(`${options.redisEventIdKey}:${eventId}`)
    return !!loaded
  }
}

/**
 * Creates a webhook predicate notifier that sets a Redis key for a given event ID.
 * The key is set to expire in 60 seconds.
 *
 * @param options - The options for the Redis connection and the key pattern.
 * @returns A webhook predicate function that sets the Redis key and returns true.
 */
export function createPredicateRedisNotifier(redis: Redis, options: RedisPredicateOptions): TransformerSuccessHandler {
  return async (payload: { eventId: string }) => {
    await redis.set(`${options.redisEventIdKey}:${payload.eventId}`, "1", "EX", "60")
    return true
  }
}

/**
 * Factory function for creating a Redis predicate checker and notifier.
 *
 * @param options - The options for the Redis connection and the key pattern.
 * @returns An object with a check function that checks the existence of the Redis key and a notify function that sets the Redis key.
 */
export function predicateRedisFactory(options: RedisPredicateOptions) {
  const redis = new Redis(options.redisUrl)

  return {
    check: createPredicateRedisChecker(redis, options),
    notify: createPredicateRedisNotifier(redis, options),
  }
}
