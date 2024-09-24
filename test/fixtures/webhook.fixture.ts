import { faker } from "@faker-js/faker"
import type { FlowcoreEventSchema } from "@flowcore/sdk-transformer-core"
import type { Static } from "@sinclair/typebox"
import Elysia from "elysia"

export type WebhookTestFixtureServer = Elysia<"">

export type WebhookTestFixtureOptions = {
  tenant: string
  dataCore: string
  port: number
  secret: string
  transformerPort: number
}

export type WebhookTestFixtureEndpoint = {
  flowType: string
  eventType: string
  redirectTo: string
}

export class WebhookTestFixture {
  private readonly app = new Elysia()
  private readonly redirects: WebhookTestFixtureEndpoint[] = []

  constructor(private readonly options: WebhookTestFixtureOptions) {}

  public addEndpoint(flowType: string, eventType: string, redirectTo?: string): this {
    this.redirects.push({
      flowType,
      eventType,
      redirectTo: redirectTo ?? `http://localhost:${this.options.transformerPort}/transformers/${flowType}`,
    })
    return this
  }

  public async stop() {
    await this.app.stop()
  }

  public async start() {
    this.app.get("/health", () => "ok")

    for (const redirect of this.redirects) {
      this.app.post(
        `/event/${this.options.tenant}/${this.options.dataCore}/${redirect.flowType}/${redirect.eventType}`,
        async (req) => {
          const event: Static<typeof FlowcoreEventSchema> = {
            eventId: faker.string.uuid(),
            aggregator: redirect.flowType,
            eventType: redirect.eventType,
            validTime: new Date().toISOString(),
            payload: req.body,
          }

          try {
            const response = await fetch(`${redirect.redirectTo}`, {
              method: "POST",
              body: JSON.stringify(event),
              headers: {
                "Content-Type": "application/json",
                "x-secret": this.options.secret,
              },
            })

            if (![200, 201].includes(response.status)) {
              throw new Error(
                `Received non-success status code: ${response.status} (${response.statusText}) with body ${await response.text()}`,
              )
            }
          } catch (error) {
            console.log("Error", error)
          }

          return {
            eventId: event.eventId,
          }
        },
      )
    }

    this.app.listen(this.options.port)

    for (let i = 0; i < 10; i++) {
      try {
        const response = await fetch(`http://localhost:${this.options.port}/health`)
        if (response.status === 200) {
          return
        }
      } catch (error) {
        await Bun.sleep(1000)
      }
    }

    throw new Error("Webhook Test Fixture is not ready")
  }
}
