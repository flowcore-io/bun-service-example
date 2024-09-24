import server from "@/server"
import env from "@/env"
import { exampleSchedule } from "@/schedules/example-schedule"

server.start()

if (env.SCHEDULER_ENABLED) {
  exampleSchedule.start()
}
