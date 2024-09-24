import { createLogger } from "@/lib/logger"
import { roundNumber } from "@/lib/utils"
import { Cron } from "croner"

const logger = createLogger("scheduler")

export interface SchedulerOptions {
  id?: string
  cronPattern: string
  task: () => Promise<void>
}

export default class Scheduler {
  public id: string
  private task: () => Promise<void>
  private wrappedTask: () => Promise<void>
  private job: Cron

  constructor(options: SchedulerOptions) {
    this.id = options.id ?? Math.random().toString().slice(2)
    this.task = options.task
    this.wrappedTask = async () => {
      logger.info(`Scheduled task (${this.id}) starting`)
      const start = performance.now()
      try {
        await this.task()
        const time = roundNumber(performance.now() - start, 2)
        logger.info(`Scheduled task (${this.id}) completed`, {
          nextRun: this.job.nextRun(),
          timeMs: time,
        })
      } catch (error) {
        logger.error(`Error running scheduled task (${this.id})`, { error })
      }
    }
    this.job = new Cron(options.cronPattern, this.wrappedTask, {
      paused: true,
      timezone: "UTC",
    })

    logger.info(`Scheduled created (${this.id}): ${options.cronPattern}`)
  }

  run() {
    return this.task()
  }

  start() {
    this.job.resume()
    logger.info(`Schedule started (${this.id})`, { nextRun: this.job.nextRun() })
  }

  stop() {
    this.job.pause()
    logger.info(`Schedule stopped (${this.id})`)
  }
}
