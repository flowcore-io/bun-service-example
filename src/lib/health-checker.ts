export type HealthChecks = Record<string, () => Promise<string | undefined>>

type HealthCheckSuccess = {
  status: "ok"
}

type HealthCheckError = {
  status: "error"
  errors: Record<string, string>
}

export function healthCheckHandler(healthChecks: HealthChecks) {
  return async (): Promise<HealthCheckSuccess | HealthCheckError> => {
    const results = (
      await Promise.all(
        Object.entries(healthChecks).map(async ([name, check]) => ({
          name,
          error: await check(),
        })),
      )
    ).filter((result) => result.error !== undefined) as Record<string, string>[]

    if (results.length > 0) {
      return {
        status: "error",
        errors: results.reduce<Record<string, string>>((acc, result) => {
          acc[result.name] = result.error
          return acc
        }, {}),
      }
    }

    return {
      status: "ok",
    }
  }
}
