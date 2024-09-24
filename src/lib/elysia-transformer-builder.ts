import {
  FlowcoreEventSchema,
  TransformerBuilder,
  TransformerHeadersSchema,
  TransformerResponseSchema,
} from "@flowcore/sdk-transformer-core"
import { Elysia } from "elysia"

export class ElysiaTransformerBuilder extends TransformerBuilder {
  public getRouter() {
    return new Elysia().post(
      `/${this.flowType}`,
      async ({ body, headers, set }) => {
        const response = await this.handleEvent(body, headers["x-secret"])
        set.status = response.statusCode
        return response
      },
      {
        body: FlowcoreEventSchema,
        headers: TransformerHeadersSchema,
        response: TransformerResponseSchema,
      },
    )
  }
}
