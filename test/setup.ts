import env from "@/env"
import { afterAll, beforeAll } from "bun:test"
import { serverFixtureFactory } from "./fixtures/server.fixture"
import { $ } from "bun"
import { WebhookTestFixture } from "./fixtures/webhook.fixture"
import { ExampleEvent } from "@/contracts/events/example.0"

const webhookFixture = new WebhookTestFixture({
  tenant: env.FLOWCORE_TENANT,
  dataCore: env.FLOWCORE_DATA_CORE,
  port: 6000,
  secret: env.TRANSFORMER_SECRET,
  transformerPort: env.SERVICE_PORT,
}).addEndpoint(ExampleEvent.flowType, ExampleEvent.eventTypes.createExample)

export const serverFixture = serverFixtureFactory({
  port: env.SERVICE_PORT,
})

beforeAll(async () => {
  // This runs before all tests
  process.stdout.write("\r🔴 Setting up services      ")

  process.stdout.write("\r🔴 Clearing services      ")
  await $`docker compose down -v --remove-orphans`.cwd("./test").quiet()
  process.stdout.write("\r🟠 Starting services")
  await $`docker compose up -d --wait`.cwd("./test").quiet()

  process.stdout.write("\r🟢 Pushing schema         ")
  await $`bun drizzle-kit push --dialect=postgresql --schema=../src/database/schemas.ts --url=${process.env.POSTGRES_CONNECTION_STRING}`
    .cwd("./test")
    .quiet()

  await webhookFixture.start()

  process.stdout.write("\r✅ Services setup complete")
  console.log("")
})

afterAll(async () => {
  // This runs after all tests
  await $`docker compose down -v --remove-orphans`.cwd("./test").quiet()

  await webhookFixture.stop()
})
