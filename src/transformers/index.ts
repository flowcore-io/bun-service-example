import Elysia from "elysia"
import example0 from "./example.0/route"

export default new Elysia({
  prefix: "/transformers",
  tags: ["transformers"],
}).use(example0)
