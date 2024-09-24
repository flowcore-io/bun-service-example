import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import type { ServerFixtureInstance } from "../fixtures/server.fixture"
import { serverFixture } from "../setup"

describe("Health Check", () => {
  let sut: ServerFixtureInstance

  beforeEach(async () => {
    sut = await serverFixture.createClient()
  })

  afterEach(async () => {
    await sut.stop()
  })

  it("should return 200", async () => {
    // Arrange & Act
    const response = await sut.client.health.index.get()

    // Assert
    expect(response.status).toBe(200)
  })
})
