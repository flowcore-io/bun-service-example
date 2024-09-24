import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import { faker } from "@faker-js/faker"
import { authFixture } from "../fixtures/auth.fixture"
import type { ServerFixtureInstance } from "../fixtures/server.fixture"
import { serverFixture } from "../setup"

describe("Example API", () => {
  let sut: ServerFixtureInstance

  beforeEach(async () => {
    authFixture.setAuthorizedUser({
      sub: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
    })
    sut = await serverFixture.createClient()
  })

  afterEach(async () => {
    await sut.stop()
  })

  it("should return 200 when posting a new example", async () => {
    // Arrange
    const input = {
      exampleData: faker.word.words(),
    }

    // Act
    const response = await sut.client.api.v1.examples.index.post(input)

    // Assert
    expect(response.status).toBe(200)
  })
})
