import env from "@/env"
import { createJwksGuard } from "@/lib/jwks-guard"
import Elysia from "elysia"
import { exampleV1 } from "./v1/examples"

const api = new Elysia({
  prefix: "/api",
  tags: ["api"],
})
  // Add authentication guard here
  .use(createJwksGuard({ certificateUrl: env.JWKS_URL }))

  // Setup of Rest API Endpoints
  .use(exampleV1)

export { api }
