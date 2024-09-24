import { faker } from "@faker-js/faker"
import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import { authFixture } from "../fixtures/auth.fixture"
import type { ServerFixtureInstance } from "../fixtures/server.fixture"
import { serverFixture } from "../setup"

describe("Scenario CRUD", () => {
  let server: ServerFixtureInstance

  beforeEach(async () => {
    authFixture.setUnauthorizedUser()
    server = await serverFixture.createClient()
  })

  afterEach(async () => {
    await server.stop()
  })

  it("should return 401, when user is not authenticated", async () => {
    // Arrange
    const input = {
      exampleData: faker.word.words(),
    }

    // Act
    const response = await server.client.api.v1.examples.index.post(input)

    // Assert
    expect(response.status).toBe(401)
  })
})
