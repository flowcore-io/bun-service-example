import { Type } from "@sinclair/typebox"

export const exampleByIdParams = Type.Object({
  id: Type.String({ description: "The id of the example", examples: ["b61e0fb1-3bf2-470e-97b6-3aeefb38b1be"] }),
})

export const createExampleBody = Type.Object({
  exampleData: Type.String({ description: "example data", examples: ["exampleData"] }),
})

export const exampleCreatedResponse = Type.Object({
  id: Type.String({ description: "The id of the created example", examples: ["b61e0fb1-3bf2-470e-97b6-3aeefb38b1be"] }),
})

export const exampleByIdResponse = {
  200: Type.Object({
    id: Type.String({ description: "The id of the example", examples: ["b61e0fb1-3bf2-470e-97b6-3aeefb38b1be"] }),
    exampleData: Type.String({ description: "example data", examples: ["exampleData"] }),
  }),
  404: Type.Object({
    message: Type.String({ description: "The message of the error", examples: ["Example not found"] }),
  }),
}
