import type { TransformerSuccessHandler, WebhookPredicate } from "@flowcore/sdk-transformer-core"
import { TTLMap } from "./utils/ttl-map"

const DEFAULT_TTL_MS = 60000 // 1 minute

let inMemoryCache: TTLMap

/**
 * Options for the in-memory predicate.
 * @property ttlMs - The time-to-live for cache entries in milliseconds. If not specified, the default TTL is used, which is 1 minute.
 */
export type InMemoryPredicateOptions = {
  ttlMs?: number
}

/**
 * Creates a webhook predicate checker that checks if an event ID exists in the in-memory cache.
 *
 * This function initializes the in-memory cache if it's not already initialized. It then returns a webhook predicate function that checks the existence of the event ID in the cache.
 *
 * @returns A webhook predicate function that checks the existence of the event ID in the cache.
 */
export function createInMemoryPredicateChecker(): WebhookPredicate {
  if (!inMemoryCache) {
    inMemoryCache = new TTLMap()
  }

  return async (eventId: string) => inMemoryCache.has(eventId)
}

/**
 * Creates a webhook predicate notifier that sets an event ID in the in-memory cache.
 *
 * This function initializes the in-memory cache if it's not already initialized. It then returns a webhook predicate function that sets the event ID in the cache with an optional TTL.
 *
 * @param options - The options for the in-memory predicate.
 * @returns A webhook predicate function that sets the event ID in the cache.
 */
export function createInMemoryPredicateNotifier(options?: InMemoryPredicateOptions): TransformerSuccessHandler {
  if (!inMemoryCache) {
    inMemoryCache = new TTLMap()
  }

  return async (payload: { eventId: string }) => {
    inMemoryCache.set(payload.eventId, "1", options?.ttlMs ?? DEFAULT_TTL_MS)
  }
}

/**
 * Factory function for creating an in-memory predicate checker and notifier.
 *
 * This function returns an object with two methods: check and notify. The check method is a webhook predicate function that checks the existence of an event ID in the cache. The notify method is a webhook predicate function that sets an event ID in the cache.
 *
 * @param options - The options for the in-memory predicate.
 * @returns An object with check and notify methods.
 */
export function inMemoryPredicateFactory(options?: InMemoryPredicateOptions) {
  return {
    check: createInMemoryPredicateChecker(),
    notify: createInMemoryPredicateNotifier(options),
  }
}
