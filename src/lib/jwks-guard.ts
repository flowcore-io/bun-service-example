import bearer from "@elysiajs/bearer"
import Elysia from "elysia"
import { type JWTPayload, type JWTVerifyOptions, createRemoteJWKSet, jwtVerify } from "jose"
import { createLogger } from "./logger"

const logger = createLogger("jwks")

export type AuthOptions = {
  certificateUrl: string
}

export type ExtractUserFromJwksValidationResult = {
  user: JWTPayload | null
  status: number
  error: string
}

type Key = ReturnType<typeof createRemoteJWKSet>

/**
 * This method is used to create a JWKS guard.
 * @param {AuthOptions} options - The options for JWKS guard creation.
 * @returns The Elysia instance with the JWKS guard.
 * @throws {Error} - If the bearer token is invalid or the JWKS validation fails with a 401 error
 */
export function createJwksGuard(options: AuthOptions) {
  const jwks = createRemoteJWKSet(new URL(options.certificateUrl))

  const guardRoute = new Elysia().use(bearer()).derive({ as: "scoped" }, async ({ bearer, set }) => {
    const token = bearer as string
    const result = await tryExtractUserFromJwks(token, jwks, {})
    if (result.error) {
      set.status = result.status
      throw new Error(result.error)
    }

    return {
      user: result.user,
    }
  })

  return guardRoute
}

/**
 * This method is used to extract user from JWKS validation.
 * @param {string | Uint8Array} bearer - The bearer token to be validated.
 * @param {Key} key - The key used for validation.
 * @param {JWTVerifyOptions} options - The options for JWT verification.
 * @returns {Promise<ExtractUserFromJwksValidationResult>} - The result of the validation.
 */
export async function tryExtractUserFromJwks(
  bearer: string | Uint8Array,
  key: Key,
  options?: JWTVerifyOptions,
): Promise<ExtractUserFromJwksValidationResult> {
  if (!bearer) {
    logger.error("Bearer token is required")

    return {
      error: "Bearer token is required",
      status: 401,
      user: null,
    }
  }

  try {
    const { payload } = await jwtVerify(bearer, key, options)
    return {
      user: payload,
      status: 200,
      error: "",
    }
  } catch (error) {
    logger.error("Failed to verify bearer token", { error })
    return {
      user: null,
      status: 401,
      error: "Bearer token is invalid",
    }
  }
}
