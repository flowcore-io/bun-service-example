import { createLogger } from "@/lib/logger"

import type { TransformerEventHandler } from "@flowcore/sdk-transformer-core"
import type { CreateExampleData } from "../../contracts/events/example.0"

const logger = createLogger("example.0-exampleEventType0")

// todo add a default context
const createExample0: TransformerEventHandler<CreateExampleData, unknown> = async (payload, event) => {
  logger.debug("Example Event", { event, payload })

  // check if example already exists in the database

  // if it does, then ignore the event

  // if it does not exist, then insert into the database
}

export default createExample0
