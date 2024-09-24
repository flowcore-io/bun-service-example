import { type CreateExampleData, ExampleEvent } from "../contracts/events/example.0"
import { webhookBuilder } from "./webhook-builder"

export const webhookCreateExample = webhookBuilder().buildWebhook<CreateExampleData>(
  ExampleEvent.flowType,
  ExampleEvent.eventTypes.createExample,
)
