import type { TransformerSuccessHandler } from "@flowcore/sdk-transformer-core"
import { ElysiaTransformerBuilder } from "./elysia-transformer-builder"

/**
 * Represents the options for creating a transformer.
 *
 * @property {TransformerSuccessHandler} onSuccess - The callback function to handle successful transformations.
 * @property {string} secret - The secret key for the transformer.
 */
export type TransformerOptions = {
  onSuccess?: TransformerSuccessHandler
  secret: string
}

/**
 * Constructs a transformer builder tailored to a specific flow type.
 *
 * This function returns a new instance of ElysiaTransformerBuilder, which is configured to handle transformations for the specified flow type.
 *
 * @param {string} flowType - Identifies the type of flow that the transformer will process.
 * @returns {ElysiaTransformerBuilder} - A newly created ElysiaTransformerBuilder instance, set up to handle transformations for the given flow type.
 */
export type ConstructedTransformerFactory = (flowType: string) => ElysiaTransformerBuilder

/**
 * Creates a new transformer builder with the specified options.
 *
 * This is an opinionated factory that returns an ElysiaTransformerBuilder with some predefined settings.
 * You are free to replace this factory with your own implementation, or make your own to fit your needs.
 *
 * @param {TransformerOptions} options - The options for the transformer.
 * @returns {ConstructedTransformerFactory} - A function that returns a new ElysiaTransformerBuilder instance.
 */
export const transformerFactory = (options: TransformerOptions): ConstructedTransformerFactory => {
  return (flowType: string) => {
    const elysia = new ElysiaTransformerBuilder(flowType)
    if (options.onSuccess) {
      elysia.withSuccessHandler(options.onSuccess)
    }
    elysia.withSecret(options.secret)
    return elysia
  }
}
