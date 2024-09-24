/**
 * A map that stores key-value pairs with a time-to-live (TTL) for each entry.
 *
 * This class provides a way to store data with a limited lifetime. Each entry in the map
 * can be set to expire after a specified amount of time. The map automatically removes
 * expired entries.
 *
 * Inspired by: https://gist.github.com/maman/557aa2b3b55bc971cf415c0c8369c874
 */
export class TTLMap {
  private timeoutData: Record<string, Timer>
  private data: Map<string, string>

  constructor() {
    this.timeoutData = {}
    this.data = new Map()
  }

  private clearInstancedTimeout(key: string) {
    clearTimeout(this.timeoutData[key])
    delete this.timeoutData[key]
  }

  /**
   * Retrieves the value associated with a given key.
   *
   * This method returns the value stored in the map for the specified key. If the key
   * does not exist or has expired, it returns undefined.
   *
   * @param key - The key for which to retrieve the value.
   * @returns The value associated with the key, or undefined if the key does not exist or has expired.
   */
  get(key: string) {
    return this.data.get(key)
  }

  /**
   * Checks if a key exists in the map.
   *
   * This method returns true if the specified key exists in the map and has not expired,
   * otherwise it returns false.
   *
   * @param key - The key to check.
   * @returns True if the key exists and has not expired, otherwise false.
   */
  has(key: string) {
    return this.data.has(key)
  }

  /**
   * Sets a key-value pair in the map with an optional TTL.
   *
   * This method sets a new key-value pair in the map. If a TTL is specified, the entry
   * will expire after the specified amount of time. If the key already exists, its value
   * is updated and its TTL is reset.
   *
   * @param key - The key for the new entry.
   * @param val - The value for the new entry.
   * @param ttl - The time-to-live for the new entry in milliseconds. If not specified, the entry does not expire.
   * @returns This instance of TTLMap.
   */
  set(key: string, val: string, ttl?: number) {
    this.clearInstancedTimeout(key)
    this.data.set(key, val)

    const timeout = setTimeout(() => {
      this.clearInstancedTimeout(key)
      this.data.delete(key)
      this.delete(key)
    }, ttl)

    this.timeoutData[key] = timeout
    return this
  }

  /**
   * Deletes a key-value pair from the map.
   *
   * This method removes the specified key-value pair from the map. If the key exists
   * and has not expired, it returns true; otherwise, it returns false.
   *
   * @param key - The key to delete.
   * @returns True if the key existed and was deleted, otherwise false.
   */
  delete(key: string) {
    this.clearInstancedTimeout(key)
    if (this.data.has(key)) {
      this.data.delete(key)
      return true
    }
    this.data.delete(key)
    return false
  }

  /**
   * Clears all key-value pairs from the map.
   *
   * This method removes all entries from the map and stops all associated timers.
   */
  clear() {
    this.data.clear()

    for (const timeout of Object.values(this.timeoutData)) {
      clearTimeout(timeout)
    }

    this.timeoutData = {}
  }
}
