import env from "@/env"
import { createLogger } from "@/lib/logger"
import Scheduler from "@/lib/scheduler"

const logger = createLogger("schedule-bun-service-example")

export const exampleSchedule = new Scheduler({
  id: "schedule-bun-service-example",
  cronPattern: env.SCHEDULER_CRON,
  task: async () => {
    logger.info("Example schedule is running")
  },
})
