import * as jwksGuardModule from "@/lib/jwks-guard"
import { spyOn } from "bun:test"
import type { JWTPayload } from "jose"

/**
 * Mocks the tryExtractUserFromJwks function from jwksGuardModule.
 */
const mock = spyOn(jwksGuardModule, "tryExtractUserFromJwks")

/**
 * Sets the mock to return an unauthorized user response.
 *
 * @param errorMessage - The error message to return. Defaults to "Unauthorized".
 */
function setUnauthorizedUser(errorMessage = "Unauthorized") {
  mock.mockResolvedValueOnce({
    user: null,
    status: 401,
    error: errorMessage,
  })
}

/**
 * Sets the mock to return an authorized user response.
 *
 * @param user - The JWT payload of the authorized user.
 */
function setAuthorizedUser(user: JWTPayload) {
  mock.mockResolvedValue({
    user,
    status: 200,
    error: "",
  })
}

/**
 * The authFixture object provides methods to mock unauthorized and authorized user responses.
 */
const authFixture = {
  setUnauthorizedUser,
  setAuthorizedUser,
}

export { authFixture }
