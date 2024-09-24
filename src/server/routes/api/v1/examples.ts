import { createLogger } from "@/lib/logger"
import Elysia from "elysia"
import { createExampleBody, exampleByIdParams, exampleByIdResponse, exampleCreatedResponse } from "./examples.dto"
import { webhookCreateExample } from "@/webhooks/example.0"

export const logger = createLogger("example-v1")

export const exampleV1 = new Elysia({
  prefix: "/v1/examples",
  tags: ["api"],
})
  .post(
    "/",
    async (req) => {
      logger.info("create")

      const id = "123" // some generated id

      await webhookCreateExample.send({
        id,
        exampleData: req.body.exampleData,
      })

      return {
        id,
      }
    },
    {
      body: createExampleBody,
      response: exampleCreatedResponse,
      detail: {
        description: "Create a new example",
      },
    },
  )
  .get(
    "/:id",
    async (req) => {
      logger.info("get")

      return {
        id: req.params.id,
        exampleData: "exampleData",
      }
    },
    {
      params: exampleByIdParams,
      response: exampleByIdResponse,
    },
  )
