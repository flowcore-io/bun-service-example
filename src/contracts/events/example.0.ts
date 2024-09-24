import { type Static, Type } from "@sinclair/typebox"

// Flowcore Event
export const ExampleEvent = {
  flowType: "example.0",
  eventTypes: {
    createExample: "example.created.0",
  },
} as const

// Schema
export const createExampleData = Type.Object({
  id: Type.String(),
  exampleData: Type.String(),
})

// Types
export type CreateExampleData = Static<typeof createExampleData>
