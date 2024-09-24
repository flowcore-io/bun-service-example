import { ExampleEvent, createExampleData } from "../../contracts/events/example.0.ts"
import { transformerBuilder } from "../transformer-builder.ts"
import createExample0 from "./example-create.0.ts"

export default transformerBuilder(ExampleEvent.flowType)
  .onEventType(ExampleEvent.eventTypes.createExample, createExampleData, createExample0)
  .getRouter()
