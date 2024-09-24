import { safeParseType } from "@/lib/utils"
import type { Static, TObject, TProperties } from "@sinclair/typebox"

export enum NodeEnv {
  Development = "development",
  Production = "production",
  Staging = "staging",
  Test = "test",
}

export class Environment<T extends TProperties> {
  private schema: TObject<T>
  private _env: Static<typeof this.schema> | undefined

  constructor(schema: TObject<T>) {
    this.schema = schema
  }

  get env(): Static<typeof this.schema> {
    if (this._env) {
      return this._env
    }

    if (process.env.SKIP_ENV_VALIDATION) {
      console.debug("Skipping env validation")
      this._env = {} as Static<typeof this.schema>
      return this._env
    }

    const parsed = safeParseType(this.schema, process.env)

    if (!parsed.success) {
      console.error("Missing or invalid environment variables", { errors: parsed.errors })
      process.exit(1)
    }

    this._env = parsed.data
    return this._env
  }
}
