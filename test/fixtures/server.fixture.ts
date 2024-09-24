import { treaty } from "@elysiajs/eden"

export type ServerFixtureOptions = {
  port?: number
}

export type ServerFixtureInstance = Awaited<ReturnType<typeof createServerClient>>

async function createServerClient(port: number) {
  const { server } = await import("@/server")
  const instance = server.listen(port)
  return {
    client: treaty<typeof instance>(instance),
    stop: async () => {
      await instance.stop()
    },
  }
}

export function serverFixtureFactory(options: ServerFixtureOptions = {}) {
  return {
    /**
     * Creates a server fixture client instance.
     *
     * This lazy-loads the server on-the-fly, to allow for easier mocking control, and execution flow
     *
     * Additionally, it generates a type-safe client for the server, allowing for easy requests to the server - making for cleaner tests.
     *
     * This method initializes a server fixture client instance with the specified port number. If no port is provided, it defaults to 3000.
     *
     * @returns {Promise<{ client: ServerFixtureInstance, stop: () => Promise<void> }>} - A promise that resolves to a server controller and a type-safe client for cleaner testing.
     */
    createClient: async (): Promise<ServerFixtureInstance> => {
      const port = options.port || 3000
      return createServerClient(port)
    },
  }
}
